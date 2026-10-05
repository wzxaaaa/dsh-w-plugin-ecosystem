/** Registrant-private observable company snapshot and authenticated HTTP actions. */
import type { StudioCatalog, StudioHealth, StudioState } from '../types.ts'
import z from '@deepseek-ai/schemastery'
import { parseFields, stateSchema } from '../schema.ts'

const engineHealth = z.object({ available: z.boolean().required(), version: z.string().required() })
const healthSchema = z.object({ codex: engineHealth.required(), claude: engineHealth.required(), harness: engineHealth.required() })
const model = z.object({ id: z.string().required(), name: z.string().required(),
  efforts: z.array(z.string()).required(), imageInput: z.union([z.boolean(), z.const(null)]) })
const catalogSchema = z.object({ codex: z.array(model).required(), claude: z.array(model).required(),
  claudeError: z.string().required(), harness: z.array(model).required() })

/** Stable snapshot read by the renderer's injected hook. */
export interface StudioView {
  state: StudioState | null
  health: StudioHealth | null
  catalog: StudioCatalog | null
  error: string
  busy: boolean
}
/** One browser-generation owner of polling and edits. */
export class StudioController {
  private view: StudioView = { state: null, health: null, catalog: null, error: '', busy: false }
  private readonly listeners = new Set<() => void>()
  private readonly controller = new AbortController()
  private timer: ReturnType<typeof setTimeout> | undefined
  private interval = 1500
  private refreshPromise: Promise<void> | undefined
  /** Read the current stable observable snapshot.
   * @returns The current public company view.
   */
  getSnapshot = (): StudioView => this.view
  /** Subscribe through the renderer's injected hook.
   * @param listener - Snapshot notification.
   * @returns Subscription disposer.
   */
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }
  private publish(patch: Partial<StudioView>): void {
    if (this.controller.signal.aborted) return
    this.view = { ...this.view, ...patch }
    for (const listener of this.listeners) {
      try { listener() }
      catch (error) { console.error('Studio snapshot subscriber failed', error) }
    }
  }
  private async request(path: string, input?: unknown): Promise<Record<string, unknown>> {
    const response = await fetch(`/api/studio/${path}`, { signal: this.controller.signal, credentials: 'same-origin',
      ...(input === undefined ? {} : { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(input) }) })
    const value: unknown = await response.json()
    if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new Error('Invalid Studio response')
    const reply = value as Record<string, unknown>
    if (!response.ok) throw new Error(typeof reply.error === 'string' ? reply.error : `Studio HTTP ${response.status}`)
    return reply
  }
  private adopt(value: unknown): void {
    const state = parseFields(stateSchema, value) as StudioState
    if (this.view.state === null || state.revision >= this.view.state.revision) this.publish({ state, error: '' })
  }
  /** Reload current state, sharing one pending poll.
   * @returns Poll completion.
   */
  refresh = (): Promise<void> => {
    this.refreshPromise ??= (async () => {
      try {
        const reply = await this.request('state')
        this.adopt(reply.state)
        if (typeof reply.pollIntervalMs === 'number') this.interval = reply.pollIntervalMs
      } catch (error) { this.publish({ error: error instanceof Error ? error.message : 'Studio connection failed' }) }
      finally { this.refreshPromise = undefined }
    })()
    return this.refreshPromise
  }
  /** Start one cancellable polling generation.
   * @returns Lifecycle disposer.
   */
  start(): () => void {
    const poll = async (): Promise<void> => {
      await this.refresh()
      if (!this.controller.signal.aborted) this.timer = setTimeout(() => { void poll() }, this.interval)
    }
    void poll()
    void this.request('catalog').then((catalog) => {
      this.publish({ catalog: parseFields(catalogSchema, catalog) })
    }).catch((error: unknown) => {
      this.publish({ error: error instanceof Error ? error.message : 'Model catalog unavailable' })
    })
    return () => {
      this.listeners.clear()
      this.controller.abort()
      if (this.timer !== undefined) clearTimeout(this.timer)
    }
  }
  /** Submit one command against the observed revision.
   * @param action - Command name.
   * @param input - Action-specific JSON.
   * @returns Success after the committed response, or false with an inline diagnostic.
   */
  command = async (action: string, input: unknown): Promise<boolean> => {
    if (this.view.busy || !this.view.state) return false
    this.publish({ busy: true, error: '' })
    try {
      const reply = await this.request('command', { action, input, expectedRevision: this.view.state.revision })
      this.adopt(reply.state)
      return true
    } catch (error) {
      await this.refresh()
      this.publish({ error: error instanceof Error ? error.message : 'Studio command failed' })
      return false
    } finally { this.publish({ busy: false }) }
  }
  /** Probe native executables without creating model work.
   * @returns Probe completion.
   */
  checkHealth = async (): Promise<void> => {
    try { this.publish({ health: parseFields(healthSchema, await this.request('health')) }) }
    catch (error) { this.publish({ error: error instanceof Error ? error.message : 'Connection probe failed' }) }
  }
}
