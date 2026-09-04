import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildSettingsOps, inferPreset, presetDraft, readModelConfiguration, validateDraft,
} from '../reasoning-core.js'

test('updates one declared model without dropping unknown fields or sibling models', () => {
  const namespace = {
    value: { providers: { relay: { models: [
      { id: 'grok-4.6', name: 'Grok', secret: 'keep', compat: { supportsStore: false } },
      { id: 'other', name: 'Other' },
    ] } } },
    user: { providers: { relay: { models: [
      { id: 'grok-4.6', name: 'Grok', secret: 'keep', compat: { supportsStore: false } },
      { id: 'other', name: 'Other' },
    ] } } },
  }
  const draft = { ...presetDraft('openai'), defaultEffort: 'high' }
  const ops = buildSettingsOps(namespace, 'relay', 'grok-4.6', draft)
  assert.equal(ops.length, 2)
  assert.deepEqual(ops[0].path, ['providers', 'relay', 'models'])
  assert.equal(ops[0].value[0].secret, 'keep')
  assert.equal(ops[0].value[0].compat.supportsStore, false)
  assert.equal('thinkingFormat' in ops[0].value[0].compat, false)
  assert.equal(ops[0].value[0].compat.supportsReasoningEffort, true)
  assert.deepEqual(ops[0].value[1], { id: 'other', name: 'Other' })
  assert.deepEqual(ops[1], {
    op: 'set', path: ['providers', 'relay', 'reasoning'], value: 'high',
  })
})

test('infers dialect from the endpoint instead of the model brand', () => {
  assert.equal(inferPreset('amd-dsfv', {
    api: 'openai-completions',
    baseURL: 'https://developer.amd.com.cn/radeon/api/v1',
  }), 'openai')
  assert.equal(inferPreset('relay', {
    api: 'openai-completions',
    baseURL: 'https://relay.example/v1',
  }), 'openai')
  assert.equal(inferPreset('deepseek', {
    api: 'openai-completions',
    baseURL: 'https://api.deepseek.com/v1',
  }), 'deepseek')
  assert.equal(inferPreset('relay', {
    api: 'anthropic-messages',
    baseURL: 'https://relay.example/v1',
  }), 'anthropic')
})

test('uses modelOverrides for a catalog-backed model', () => {
  const namespace = {
    value: { providers: { openai: { models: [], modelOverrides: {} } } },
    user: { providers: { openai: {} } },
  }
  const ops = buildSettingsOps(namespace, 'openai', 'o3', {
    ...presetDraft('openai'), defaultEffort: '',
  })
  assert.deepEqual(ops[0].path, ['providers', 'openai', 'modelOverrides', 'o3'])
  assert.equal(ops[0].value.reasoningEfforts.off, 'none')
  assert.deepEqual(ops[1], {
    op: 'unset', path: ['providers', 'openai', 'reasoning'],
  })
})

test('restore removes only bridge-owned fields and preserves unrelated compat', () => {
  const namespace = {
    value: { providers: { relay: { models: [{
      id: 'm',
      reasoningEfforts: { off: null, high: 'high' },
      compat: { thinkingFormat: 'deepseek', supportsDeveloperRole: false, supportsStore: false },
    }] } } },
    user: { providers: { relay: { models: [{
      id: 'm',
      reasoningEfforts: { off: null, high: 'high' },
      compat: { thinkingFormat: 'deepseek', supportsDeveloperRole: false, supportsStore: false },
    }] } } },
  }
  const [op] = buildSettingsOps(namespace, 'relay', 'm', {
    mode: 'inherit', efforts: {}, format: '', supportsReasoningEffort: null,
    supportsDeveloperRole: null, defaultEffort: undefined,
  })
  assert.equal('reasoningEfforts' in op.value[0], false)
  assert.deepEqual(op.value[0].compat, { supportsStore: false })
})

test('reads disabled and enabled declarations', () => {
  const disabled = readModelConfiguration({
    value: { providers: { relay: { models: [{ id: 'm', reasoningEfforts: false }] } } },
  }, 'relay', 'm')
  assert.equal(disabled.mode, 'disabled')

  const enabled = readModelConfiguration({
    value: { providers: { relay: { modelOverrides: { m: {
      reasoningEfforts: { off: null, high: 'reason' },
      compat: { thinkingFormat: 'deepseek' },
    } } } } },
  }, 'relay', 'm')
  assert.equal(enabled.mode, 'enabled')
  assert.equal(enabled.location, 'override')
  assert.equal(enabled.efforts.high, 'reason')
})

test('refuses an enabled declaration with no thinking level', () => {
  assert.match(validateDraft({ mode: 'enabled', efforts: { off: null }, format: '' }), /至少/)
})

test('Anthropic preset does not add OpenAI-only compat switches', () => {
  const namespace = {
    value: { providers: { anthropicRelay: { models: [{ id: 'claude-custom' }] } } },
    user: { providers: { anthropicRelay: { models: [{ id: 'claude-custom' }] } } },
  }
  const [op] = buildSettingsOps(namespace, 'anthropicRelay', 'claude-custom', {
    ...presetDraft('anthropic'), defaultEffort: '',
  })
  assert.equal('compat' in op.value[0], false)
  assert.deepEqual(op.value[0].reasoningEfforts, {
    off: null, low: 'low', medium: 'medium', high: 'high', max: 'max',
  })
})
