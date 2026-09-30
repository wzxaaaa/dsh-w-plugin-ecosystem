import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import test from 'node:test'
import { WindowsSpeechRecognizer, speechCulture, windowsSpeechScript } from '../windows-speech.js'

class FakeStream extends EventEmitter {
  setEncoding() {}
}

class FakeChild extends EventEmitter {
  constructor() {
    super()
    this.stdout = new FakeStream()
    this.stderr = new FakeStream()
    this.killed = false
  }

  kill() {
    this.killed = true
  }
}

test('maps only supported speech cultures into the PowerShell script', () => {
  assert.equal(speechCulture('ja-JP'), 'ja-JP')
  assert.equal(speechCulture("zh-CN'); throw 'oops"), 'zh-CN')
  assert.match(windowsSpeechScript('zh-CN'), /GetCultureInfo\('zh-CN'\)/)
})

test('parses ready and final transcript events from Windows speech recognition', () => {
  const child = new FakeChild()
  const states = []
  const results = []
  let spawned
  const recognizer = new WindowsSpeechRecognizer({
    language: 'zh-CN',
    startupTimeoutMs: 5_000,
    spawn(executable, args, options) {
      spawned = { executable, args, options }
      return child
    },
    onState: state => states.push(state),
    onResult: result => results.push(result),
  })

  recognizer.start()
  assert.match(spawned.executable, /powershell\.exe$/i)
  assert.equal(spawned.options.windowsHide, true)
  assert.equal(spawned.args.includes('-EncodedCommand'), true)
  child.stdout.emit('data', '{"type":"ready","culture":"zh-CN"}\r\n')
  child.stdout.emit('data', '{"type":"result","text":"我写完了","confidence":0.82}\r\n')
  assert.equal(states.at(-1).status, 'ready')
  assert.deepEqual(results, [{ text: '我写完了', confidence: 0.82, culture: 'zh-CN' }])

  recognizer.stop()
  assert.equal(child.killed, true)
  assert.equal(states.at(-1).status, 'stopped')
})
