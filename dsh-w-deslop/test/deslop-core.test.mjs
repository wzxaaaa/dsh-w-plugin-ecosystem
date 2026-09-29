import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildRevisePrompt,
  buildRulesPrompt,
  countChars,
  normalizeChapterFilename,
  normalizeConfig,
  parseDeslopCommand,
  renderScanReport,
  scanText,
} from '../deslop-core.js'

const rules = report => report.hits.map(hit => hit.rule)

test('flags the formulaic shells as must-fix', () => {
  const report = scanText([
    '林默睁开眼，眼中闪过一丝寒芒。他不是害怕，而是愤怒。',
    '“你是谁？”他问，带着一丝嘲讽。',
    '长老倒吸一口凉气。殊不知，这一切早有安排。',
    '她声音不大，却让所有人闭了嘴。',
  ].join('\n'), {})
  for (const rule of ['not-but', 'banned-word', 'carrying-adverbial', 'genre-cliche', 'god-view', 'voice-template']) {
    assert.ok(rules(report).includes(rule), `expected ${rule}`)
  }
  assert.equal(report.summary.verdict, '需要修改')
  assert.ok(report.hits.every((hit, index, all) => index === 0 || all[index - 1].severity === 'high' || hit.severity === 'advise'), 'high hits come first')
})

test('clean prose passes and reports line numbers', () => {
  const clean = '林默把剑插回鞘里，靴底蹭掉石阶上的青苔，一路往山门走，守门的弟子看了他一眼，没拦。\n“回来了？”\n“嗯。”他把腰牌递过去。'
  const report = scanText(clean, {})
  assert.equal(report.summary.high, 0)
  assert.equal(report.summary.verdict, '良好')
  const hit = scanText('第一行没事。\n第二行殊不知出事了。', {}).hits.find(item => item.rule === 'god-view')
  assert.equal(hit.line, 2)
})

test('negation idioms that are not the shell are left alone', () => {
  for (const text of ['要不是你，我是活不成了。', '可不是嘛，是他先动的手。', '这是不是他，是谁都不重要。']) {
    assert.ok(!rules(scanText(text, {})).includes('not-but'), text)
  }
})

test('narrative-only rules ignore quoted dialogue', () => {
  assert.ok(!rules(scanText('“我感到不对劲，殊不知你早就来了。”他说。', {})).includes('god-view'))
  assert.ok(!rules(scanText('“我感到不对劲。”他说。', {})).includes('tell-emotion'))
  assert.ok(rules(scanText('他感到不对劲。', {})).includes('tell-emotion'))
})

test('chapter endings that sum up or forecast are must-fix', () => {
  const report = scanText('他推开门走了进去。\n屋里没人。\n\n属于他的反击，才刚刚开始。', {})
  const ending = report.hits.find(hit => hit.rule === 'ending-sublimation')
  assert.equal(ending.severity, 'high')
  // The same span is not reported twice by the advisory summary rule.
  assert.equal(report.hits.filter(hit => hit.match === '才刚刚开始').length, 1)
  // A two-line excerpt has no chapter ending to judge.
  assert.ok(!rules(scanText('他推开门。\n反击才刚刚开始。', {})).includes('ending-sublimation'))
})

test('triple parallelism tolerates a leading pronoun subject', () => {
  assert.ok(rules(scanText('他看着她的眼睛，看着她的嘴唇，看着她的睫毛。', {})).includes('triple-parallel'))
  assert.ok(!rules(scanText('他看着她的眼睛，伸手接过茶，转身走了。', {})).includes('triple-parallel'))
})

test('weak adverb density and telegraph rhythm are advisory', () => {
  const dense = ('他缓缓抬手，微微一笑，轻轻放下茶盏，淡淡开口。' + '院子里的风把竹叶吹得沙沙响，檐下挂着的铜铃撞了一声。').repeat(8)
  const weak = scanText(dense, {}).hits.find(hit => hit.rule === 'weak-adverb-density')
  assert.equal(weak.severity, 'advise')
  assert.ok(weak.perThousand > 3)
  const telegraph = Array.from({ length: 24 }, (_, i) => (i % 2 ? '他抬手。' : '门开了。')).join('')
  assert.ok(rules(scanText(telegraph, {})).includes('telegraph'))
})

test('strict mode, custom words and the allow list', () => {
  assert.ok(!rules(scanText('他停了一下——然后走了……', {})).includes('dash-pause'))
  assert.ok(rules(scanText('他停了一下——然后走了。', { strict: true })).includes('dash-pause'))
  assert.ok(rules(scanText('他霸气侧漏。', { extraBanned: ['霸气侧漏'] })).includes('custom-banned'))
  assert.ok(!rules(scanText('她眼中闪过一丝光。', { whitelist: ['一丝', '眼中闪过'] })).includes('banned-word'))
})

test('config normalization accepts textarea input and rejects bad shapes', () => {
  assert.deepEqual(normalizeConfig(undefined), { enabled: true, strict: false, autoCheck: true, extraBanned: [], whitelist: [] })
  const config = normalizeConfig({ enabled: false, extraBanned: '甲\n乙，丙\n\n甲', whitelist: ['  淡淡  '] })
  assert.equal(config.enabled, false)
  assert.deepEqual(config.extraBanned, ['甲', '乙', '丙'])
  assert.deepEqual(config.whitelist, ['淡淡'])
  assert.throws(() => normalizeConfig([]), /config must be an object/)
  assert.throws(() => normalizeConfig({ extraBanned: ['x'.repeat(41)] }), /longer than/)
  assert.throws(() => scanText('x'.repeat(200_001)), /one chapter at a time/)
})

test('rules prompt follows the config', () => {
  const standard = buildRulesPrompt({})
  assert.match(standard, /不是A，而是B/)
  assert.match(standard, /deslop_scan\(text\)/)
  assert.doesNotMatch(standard, /严格模式/)
  const custom = buildRulesPrompt({ strict: true, autoCheck: false, extraBanned: ['霸气侧漏'], whitelist: ['一丝'] })
  assert.match(custom, /严格模式/)
  assert.doesNotMatch(custom, /deslop_scan/)
  assert.match(custom, /霸气侧漏/)
  assert.doesNotMatch(custom.split('## 套词')[1].split('\n')[1], /一丝/)
})

test('command parsing, revise prompt and filename validation', () => {
  assert.deepEqual(parseDeslopCommand(''), { kind: 'revise', filename: null })
  assert.deepEqual(parseDeslopCommand(' status '), { kind: 'status' })
  assert.deepEqual(parseDeslopCommand('第3章.md'), { kind: 'revise', filename: '第3章.md' })
  assert.match(buildRevisePrompt('第3章.md'), /deslop_scan\(filename: "第3章.md"\)/)
  assert.match(buildRevisePrompt(null), /novel_outline_read/)
  assert.equal(normalizeChapterFilename('第3章'), '第3章.md')
  assert.equal(normalizeChapterFilename('ch03.txt'), 'ch03.txt')
  for (const bad of ['../x.md', 'a/b.md', 'C:x.md', '..', '']) assert.throws(() => normalizeChapterFilename(bad))
})

test('report rendering and character counting', () => {
  assert.equal(countChars('他说：“好。” OK 42'), 9)
  const text = renderScanReport(scanText('他不是怕，而是恨。', {}), '第1章.md')
  assert.match(text, /第1章\.md/)
  assert.match(text, /\[必改\] 第1行/)
  assert.match(renderScanReport(scanText('他把门关上了。', {})), /没有命中/)
})
