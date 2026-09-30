import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import vm from 'node:vm'

const delay = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))

for (const mode of ['legacy', 'official']) test(`${mode}: final browser speech during an active goal is relayed to the exact session`, async () => {
  const source = await readFile(new URL('../client.js', import.meta.url), 'utf8')
  let definition
  let recognition
  let recognitionStarts = 0
  let localPackInstalls = 0
  let registered
  const speech = []
  const cleanup = []
  const goal = { goal: { id: 'goal-1', phase: 'active', objective: 'finish homework' } }

  class FakeSpeechRecognition {
    start() {
      recognitionStarts += 1
      recognition = this
      this.onstart?.()
    }
    abort() {}
  }
  FakeSpeechRecognition.available = async options => {
    assert.equal(options.langs.length, 1)
    assert.equal(options.langs[0], 'zh-CN')
    assert.equal(options.processLocally, true)
    return 'downloadable'
  }
  FakeSpeechRecognition.install = async options => {
    assert.equal(options.langs[0], 'zh-CN')
    assert.equal(options.processLocally, true)
    localPackInstalls += 1
    return true
  }
  Object.defineProperty(FakeSpeechRecognition.prototype, 'processLocally', { value: false, writable: true })

  const video = () => ({ play: async () => {}, srcObject: null })
  const document = {
    querySelector: () => null,
    createElement: tag => tag === 'video' ? video() : { dataset: {}, textContent: '', remove() {} },
    head: { appendChild() {} },
  }
  const mediaDevices = {
    async getUserMedia() { return { getTracks: () => [{ stop() {} }] } },
    async enumerateDevices() { return [] },
  }
  const window = {
    __ModuleLoader__: { load(value) { definition = value } },
    SpeechRecognition: FakeSpeechRecognition,
    webkitSpeechRecognition: FakeSpeechRecognition,
    crypto: { randomUUID: () => `id-${speech.length + 1}` },
    localStorage: {
      getItem(key) {
        if (key.endsWith('/auto-start')) return 'false'
        if (key.endsWith('/voice-engine')) return 'local'
        return null
      },
      setItem() {},
    },
    setTimeout,
    clearTimeout,
  }
  const context = vm.createContext({
    window,
    document,
    navigator: { language: 'zh-CN', mediaDevices },
    console,
    setTimeout,
    clearTimeout,
  })
  vm.runInContext(source, context)
  const plugin = definition.factory(name => {
    if (name === 'react') return {}
    throw new Error(`unexpected module ${name}`)
  })
  const remote = {
    poll: async () => ({ ok: true, value: { request: null, state: {} } }),
    submit: async () => ({ ok: true, value: { accepted: true } }),
    fail: async () => ({ ok: true, value: { accepted: true } }),
    requestTestCapture: async () => ({ ok: true, value: {} }),
    submitSpeech: async input => {
      speech.push(input)
      return { ok: true, value: { accepted: true, reason: '', sessionId: input.sessionId } }
    },
  }
  const sessions = {
    list: { getSnapshot: () => mode === 'legacy' ? { current: 'session-1' } : { byId: {
      unrelated: { id: 'unrelated', retainedBy: { sidebar: 1 } },
      selected: { id: 'session-1', retainedBy: { mainView: 1 } },
    } } },
    binding: id => { assert.equal(id, 'session-1'); return ({
      session: { projections: { faceOf: key => key === 'goal' ? { getSnapshot: () => goal } : undefined } },
    }) },
  }
  const ctx = {
    remote: { $mount: async () => () => {}, cameraWatch: remote },
    sessions,
    locale: { register: () => () => {}, bind: () => key => key },
    effect(factory) {
      const disposer = factory()
      if (typeof disposer === 'function') cleanup.push(disposer)
    },
    get(name) { return name === 'remote.cameraWatch' ? remote : undefined },
    slots: {
      inject(_name, factory) { factory() },
      register(options, component) {
        registered = { options, component }
        return () => {}
      },
    },
  }

  await plugin.apply(ctx)
  const runtime = registered.options.inject().runtime
  runtime.restartVoice()
  await delay(20)
  assert.ok(recognition)
  assert.equal(localPackInstalls, 1)
  assert.equal(recognition.processLocally, true)
  const result = [{ transcript: ' 我已经写完第一题了 ' }]
  result.isFinal = true
  recognition.onresult({ resultIndex: 0, results: [result] })
  await delay(950)
  assert.equal(speech.length, 1)
  assert.equal(speech[0].sessionId, 'session-1')
  assert.equal(speech[0].text, '我已经写完第一题了')
  assert.equal(speech[0].language, 'zh-CN')

  recognition.onerror({ error: 'network' })
  recognition.onend()
  await delay(500)
  assert.equal(recognitionStarts, 1)
  assert.match(runtime.snapshot().voiceError, /设备端语音组件/)

  for (const dispose of cleanup.reverse()) await dispose()
})
