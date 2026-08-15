window.__ModuleLoader__.load({
  id: 'dsh-w-chatflow',
  factory: () => {
    const module = { exports: {} }
    const exports = module.exports

    const name = 'dsh-w-chatflow'
    const inject = ['conversationEvents']
    const PATCH = Symbol.for('dsh-w-chatflow.assistant-step.patch')
    const VISIBILITY = Symbol('dsh-w-chatflow.visibility')

    function blockVisible(block) {
      if (block === undefined || block === null) return false
      if (block.kind === 'tool-call') return false
      if (block.kind === 'text' || block.kind === 'reasoning') return block.text.trim() !== ''
      return true
    }

    function deriveVisibility(blocks) {
      const byIndex = []
      let count = 0
      for (let index = 0; index < blocks.length; index += 1) {
        const visible = blockVisible(blocks[index])
        byIndex[index] = visible
        if (visible) count += 1
      }
      return { byIndex, count }
    }

    function visibilityOf(state) {
      return state[VISIBILITY] ?? deriveVisibility(state.blocks)
    }

    function withVisibility(state, visibility) {
      return { ...state, [VISIBILITY]: visibility }
    }

    function emptyBlock(type) {
      if (type === 'text') return { kind: 'text', text: '' }
      if (type === 'reasoning') return { kind: 'reasoning', text: '' }
      if (type === 'tool-call') return { kind: 'tool-call', callId: '', name: '', argsRaw: '' }
      return { kind: 'other', block: null }
    }

    function finishedBlock(block) {
      if (block.type === 'text') return { kind: 'text', text: block.text }
      if (block.type === 'reasoning') return { kind: 'reasoning', text: block.text }
      if (block.type === 'image') return { kind: 'image', attachment: block.attachment }
      if (block.type === 'tool-call') {
        return { kind: 'tool-call', callId: String(block.id), name: block.name, argsRaw: block.arguments }
      }
      return { kind: 'other', block }
    }

    function tokenDelta(chunk) {
      if (chunk.type === 'text-delta' || chunk.type === 'reasoning-delta') return chunk.text !== ''
      if (chunk.type === 'tool-call-delta') return chunk.argumentsDelta !== '' || chunk.name !== undefined
      return false
    }

    function replaceVisibility(meta, index, visible) {
      const previous = meta.byIndex[index] === true
      const byIndex = [...meta.byIndex]
      byIndex[index] = visible
      return {
        byIndex,
        count: meta.count + (visible ? 1 : 0) - (previous ? 1 : 0),
      }
    }

    function updateChunk(state, match) {
      const chunk = match.event.data.chunk
      const blocks = [...state.blocks]
      let meta = visibilityOf(state)

      switch (chunk.type) {
        case 'block-start': {
          const block = emptyBlock(chunk.blockType)
          blocks[chunk.index] = block
          meta = replaceVisibility(meta, chunk.index, blockVisible(block))
          break
        }
        case 'text-delta': {
          const previous = blocks[chunk.index]
          const continuing = previous?.kind === 'text'
          blocks[chunk.index] = {
            kind: 'text',
            text: (continuing ? previous.text : '') + chunk.text,
          }
          const visible = continuing && meta.byIndex[chunk.index] === true
            ? true
            : chunk.text.trim() !== ''
          meta = replaceVisibility(meta, chunk.index, visible)
          break
        }
        case 'reasoning-delta': {
          const previous = blocks[chunk.index]
          const continuing = previous?.kind === 'reasoning'
          blocks[chunk.index] = {
            kind: 'reasoning',
            text: (continuing ? previous.text : '') + chunk.text,
          }
          const visible = continuing && meta.byIndex[chunk.index] === true
            ? true
            : chunk.text.trim() !== ''
          meta = replaceVisibility(meta, chunk.index, visible)
          break
        }
        case 'tool-call-delta': {
          const previous = blocks[chunk.index]
          const base = previous?.kind === 'tool-call'
            ? previous
            : { kind: 'tool-call', callId: '', name: '', argsRaw: '' }
          blocks[chunk.index] = {
            kind: 'tool-call',
            callId: base.callId || String(chunk.id),
            name: chunk.name ?? base.name,
            argsRaw: base.argsRaw + chunk.argumentsDelta,
          }
          meta = replaceVisibility(meta, chunk.index, false)
          break
        }
        case 'block-end': {
          const block = finishedBlock(chunk.block)
          blocks[chunk.index] = block
          meta = replaceVisibility(meta, chunk.index, blockVisible(block))
          break
        }
        default:
          return state
      }

      const visible = meta.count > 0
      const firstToken = tokenDelta(chunk)
      return withVisibility({
        ...state,
        blocks,
        hidden: visible ? false : state.hidden,
        ...(visible && state.firstVisibleSeq === undefined
          ? { firstVisibleSeq: match.event.seq, firstVisibleTime: match.event.time }
          : {}),
        ...(firstToken && state.firstTokenTime === undefined
          ? { firstTokenTime: match.event.time }
          : {}),
      }, meta)
    }

    function compatibleDefinition(definition) {
      return definition !== null
        && typeof definition === 'object'
        && definition.kind === 'assistant-step'
        && typeof definition.start === 'function'
        && typeof definition.update === 'function'
        && typeof definition.publication === 'function'
        && typeof definition.buildLocationData === 'function'
        && typeof definition.buildViewNode === 'function'
        && Object.isExtensible(definition)
    }

    function installAssistantPatch(definition) {
      if (!compatibleDefinition(definition)) {
        return { applied: false, reason: 'incompatible-definition', dispose() {} }
      }
      if (definition[PATCH] !== undefined) {
        return { applied: false, reason: 'already-patched', dispose() {} }
      }

      const originalUpdate = definition.update
      let degraded = false
      const patchedUpdate = function patchedAssistantUpdate(context, match) {
        try {
          if (match?.event?.type !== 'assistant/chunk') {
            const next = originalUpdate.call(this, context, match)
            return withVisibility(next, deriveVisibility(next.blocks))
          }
          const chunk = match.event.data.chunk
          if (chunk.type === 'usage') {
            const next = originalUpdate.call(this, context, match)
            return withVisibility(next, visibilityOf(context.state))
          }
          if (chunk.type === 'finish' || ![
            'block-start', 'text-delta', 'reasoning-delta', 'tool-call-delta', 'block-end',
          ].includes(chunk.type)) return context.state
          return updateChunk(context.state, match)
        } catch (error) {
          if (!degraded) {
            degraded = true
            console.warn(`[${name}] streaming optimization reverted after an incompatible state`, error)
          }
          if (definition.update === patchedUpdate) definition.update = originalUpdate
          if (definition[PATCH] === record) delete definition[PATCH]
          return originalUpdate.call(this, context, match)
        }
      }
      const record = { originalUpdate, patchedUpdate }
      Object.defineProperty(definition, PATCH, { value: record, configurable: true })
      definition.update = patchedUpdate

      let disposed = false
      return {
        applied: true,
        reason: 'applied',
        dispose() {
          if (disposed) return
          disposed = true
          if (definition.update === patchedUpdate) definition.update = originalUpdate
          if (definition[PATCH] === record) delete definition[PATCH]
        },
      }
    }

    function readConfig() {
      const config = globalThis.__DSH_W_CHATFLOW__
      if (config === null || typeof config !== 'object') {
        return { enabled: false, optimizeStreaming: false }
      }
      return {
        enabled: config.enabled === true,
        optimizeStreaming: config.optimizeStreaming === true,
      }
    }

    function apply(ctx) {
      const config = readConfig()
      if (!config.enabled || !config.optimizeStreaming) return

      ctx.effect(() => {
        let activeDefinition
        let activePatch
        let warned = false

        const synchronize = () => {
          const definition = ctx.conversationEvents.entries()
            .find(candidate => candidate.kind === 'assistant-step')
          if (definition === activeDefinition) return
          activePatch?.dispose()
          activePatch = undefined
          activeDefinition = definition
          if (definition === undefined) return
          const installed = installAssistantPatch(definition)
          if (installed.applied) {
            activePatch = installed
          } else if (!warned) {
            warned = true
            console.warn(`[${name}] streaming optimization disabled: ${installed.reason}`)
          }
        }

        synchronize()
        const unsubscribe = ctx.conversationEvents.subscribe(synchronize)
        return () => {
          unsubscribe()
          activePatch?.dispose()
        }
      }, 'dsh-w-chatflow: assistant streaming optimization')
    }

    exports.apply = apply
    exports.inject = inject
    exports.installAssistantPatch = installAssistantPatch
    exports.name = name
    return module.exports
  },
})
