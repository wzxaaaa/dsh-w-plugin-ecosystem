/**
 * dsh-w-deslop core — pure rules, prompt text and the deterministic scanner.
 *
 * The rules are distilled from the public "去 AI 味" skills (story-deslop from
 * oh-story, Humanizer-zh, de-ai-flavor). The scanner only reports; it never
 * decides that a text "is AI". High hits are formulaic shells that almost
 * never read well in fiction; advisory hits need a human read in context.
 */

export const LIMITS = Object.freeze({
  wordListEntries: 200,
  wordChars: 40,
  scanChars: 200_000,
  hits: 120,
  excerptChars: 60,
})

export function defaultConfig() {
  return { enabled: true, strict: false, autoCheck: true, extraBanned: [], whitelist: [] }
}

function normalizeWordList(value, name) {
  if (value === undefined || value === null) return []
  const source = typeof value === 'string' ? value.split(/\r?\n|[,，、]/) : value
  if (!Array.isArray(source)) throw new Error(`${name} must be a list of words`)
  const seen = new Set()
  const words = []
  for (const item of source) {
    if (typeof item !== 'string') throw new Error(`${name} entries must be strings`)
    const word = item.trim()
    if (word === '' || seen.has(word)) continue
    if (word.length > LIMITS.wordChars) throw new Error(`${name} entry "${word.slice(0, 12)}…" is longer than ${LIMITS.wordChars} characters`)
    seen.add(word)
    words.push(word)
  }
  if (words.length > LIMITS.wordListEntries) throw new Error(`${name} may hold at most ${LIMITS.wordListEntries} words`)
  return words
}

export function normalizeConfig(value) {
  const base = defaultConfig()
  if (value === undefined || value === null) return base
  if (typeof value !== 'object' || Array.isArray(value)) throw new Error('config must be an object')
  return {
    enabled: value.enabled === undefined ? base.enabled : value.enabled === true,
    strict: value.strict === true,
    autoCheck: value.autoCheck === undefined ? base.autoCheck : value.autoCheck === true,
    extraBanned: normalizeWordList(value.extraBanned, 'extraBanned'),
    whitelist: normalizeWordList(value.whitelist, 'whitelist'),
  }
}

// ---------------------------------------------------------------------------
// Rules
// ---------------------------------------------------------------------------

const BANNED_WORDS = [
  '仿佛', '犹如', '宛若', '宛如', '一丝', '一抹', '深吸一口气', '不禁', '映入眼帘',
  '眼中闪过', '眼底闪过', '嘴角勾起', '嘴角微扬', '嘴角上扬', '眉头微皱', '瞳孔微缩', '瞳孔收缩', '瞳孔一缩', '指节泛白',
  '心中一动', '心头一震', '心下了然', '心中暗道', '心底泛起', '心中一凛', '不由得', '心中涌起', '心头涌起',
  '不容置疑', '不容置喙', '不易察觉', '微不可察', '几不可闻', '显而易见', '毫无疑问', '不可否认', '前所未有',
  '不由自主', '情不自禁', '自然而然', '话锋一转', '取而代之的是', '五味杂陈', '百感交集',
]

const GENRE_CLICHES = ['恐怖如斯', '全场哗然', '众人震惊', '倒吸一口凉气', '此子断不可留', '散发着一股', '浑身散发着']

const WEAK_ADVERBS = ['缓缓', '微微', '轻轻', '淡淡']

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function wordsPattern(words) {
  return new RegExp(words.map(escapeRegExp).join('|'), 'g')
}

/**
 * Each rule: id, severity (high | advise), scope (all | narrative), label,
 * fix, and a global RegExp. Narrative-scope rules skip quoted dialogue.
 */
function patternRules(config) {
  const rules = [
    {
      id: 'not-but', severity: 'high', scope: 'all', label: '「不是A，而是B」句式',
      fix: '删掉否定的那一半，直接写 B。',
      pattern: /(?<![是要可])不是[^，。！？；\n“”「」"]{1,24}[，,]\s*(?:也不是[^，。！？；\n“”「」"]{1,24}[，,]\s*)?而是/g,
    },
    {
      id: 'banned-word', severity: 'high', scope: 'all', label: 'AI 高频套词',
      fix: '删掉；确需保留信息时改成具体动作、台词或后果，不换同义词。',
      pattern: wordsPattern(BANNED_WORDS),
    },
    {
      id: 'genre-cliche', severity: 'high', scope: 'all', label: '网文陈词',
      fix: '写具体的人被震住的样子（手里的东西、退一步、说不出话），不用概括。',
      pattern: wordsPattern(GENRE_CLICHES),
    },
    {
      id: 'carrying-adverbial', severity: 'high', scope: 'all', label: '「，带着一丝……」万能状语',
      fix: '删掉状语留主句，或换成一个具体动作。',
      pattern: /[，,]\s*带着(?:一丝|一抹|几分|些许|一股|淡淡的|不易察觉的)/g,
    },
    {
      id: 'voice-template', severity: 'high', scope: 'all', label: '声音/语气模板',
      fix: '直接写台词本身，让读者从话里听出语气。',
      pattern: /声音不大[，,]\s*却|(?:语气|声音)(?:平静得|毫无波澜|平静无波|听不出(?:任何)?情绪|平淡得)/g,
    },
    {
      id: 'god-view', severity: 'high', scope: 'narrative', label: '上帝视角 / 解释腔',
      fix: '删掉。只写视角人物此刻知道的；因果让读者从动作和台词里自己拼。',
      pattern: /[他她]不知道的是|殊不知|冥冥之中|仿佛预示着|多年以后|之所以[^。！？\n]{0,30}是因为|这意味着/g,
    },
    {
      id: 'tell-emotion', severity: 'advise', scope: 'narrative', label: '告知式情绪',
      fix: '有具体原因时可以直写；否则改成选择、台词或后果，不要给情绪配套式动作。',
      pattern: /[他她我]们?(?:感到|感觉到|意识到)|显得(?:有些|有点|十分|格外)?/g,
    },
    {
      id: 'summary', severity: 'advise', scope: 'narrative', label: '总结 / 升华句',
      fix: '删掉定性，改成角色当下要处理的具体事。',
      pattern: /终于明白|这才意识到|这一刻|从这一刻(?:开始|起)|才刚刚开始|命运[^。！？\n]{0,8}(?:齿轮|棋局|獠牙|安排)|注定(?:无人|要|了)|一切都(?:变了|不一样了)/g,
    },
    {
      id: 'essay-connective', severity: 'advise', scope: 'narrative', label: '论文腔连接词',
      fix: '删掉，或换成口语连接。',
      pattern: /不难看出|由此可见|综上所述|总而言之|于是乎|与此同时|诚然|值得一提的是/g,
    },
  ]
  if (config.strict) {
    rules.push({
      id: 'dash-pause', severity: 'high', scope: 'all', label: '破折号 / 省略号硬造停顿',
      fix: '改用句号、逗号、短句或一个动作来断开。',
      pattern: /——|……/g,
    })
  }
  if (config.extraBanned.length > 0) {
    rules.push({
      id: 'custom-banned', severity: 'high', scope: 'all', label: '自定义禁用词',
      fix: '按你自己的规则替换。',
      pattern: wordsPattern(config.extraBanned),
    })
  }
  return rules
}

// ---------------------------------------------------------------------------
// Scanner
// ---------------------------------------------------------------------------

/** Mask quoted dialogue with spaces so narrative rules keep offsets intact. */
function maskDialogue(text) {
  return text.replace(/“[^”\n]*”|「[^」\n]*」|"[^"\n]*"/g, match => ' '.repeat(match.length))
}

function lineStarts(text) {
  const starts = [0]
  for (let index = 0; index < text.length; index++) if (text[index] === '\n') starts.push(index + 1)
  return starts
}

function lineOf(starts, offset) {
  let low = 0
  let high = starts.length - 1
  while (low < high) {
    const mid = (low + high + 1) >> 1
    if (starts[mid] <= offset) low = mid
    else high = mid - 1
  }
  return low + 1
}

function excerptAt(text, offset, length) {
  const radius = Math.max(0, Math.floor((LIMITS.excerptChars - length) / 2))
  let start = Math.max(0, offset - radius)
  let end = Math.min(text.length, offset + length + radius)
  const lineStart = text.lastIndexOf('\n', offset - 1) + 1
  const lineEnd = text.indexOf('\n', offset + length)
  start = Math.max(start, lineStart)
  if (lineEnd !== -1) end = Math.min(end, lineEnd)
  return (start > lineStart ? '…' : '') + text.slice(start, end).trim() + (lineEnd !== -1 && end < lineEnd ? '…' : '')
}

/** Count prose characters the way Chinese writers do: every CJK char and full-width mark, each latin word or number. */
export function countChars(text) {
  const cjk = text.match(/[㐀-鿿豈-﫿　-〿＀-￯“”‘’]/g)
  const latin = text.match(/[A-Za-z0-9]+/g)
  return (cjk ? cjk.length : 0) + (latin ? latin.length : 0)
}

function narrativeSentences(masked) {
  return masked
    .split(/[。！？!?\n]+/)
    .map(sentence => sentence.replace(/\s+/g, ''))
    .filter(sentence => sentence.length > 0 && !/^#/.test(sentence))
}

/** Three or more consecutive clauses opening with the same two characters. */
function findParallelism(text, masked) {
  const hits = []
  const sentencePattern = /[^。！？!?\n]+/g
  let match
  while ((match = sentencePattern.exec(masked)) !== null) {
    const clauses = []
    const clausePattern = /[^，,；;、]+/g
    let clause
    while ((clause = clausePattern.exec(match[0])) !== null) {
      const trimmed = clause[0].trimStart()
      // "他看着A，看着B，看着C": a leading pronoun subject does not break the run.
      const body = trimmed.replace(/^[他她我你它]们?/, '')
      if (body.length >= 3) clauses.push({ head: body.slice(0, 2), offset: match.index + clause.index + (clause[0].length - trimmed.length) })
      else clauses.push({ head: null, offset: match.index + clause.index })
    }
    for (let index = 0; index + 2 < clauses.length; index++) {
      const head = clauses[index].head
      if (head && clauses[index + 1].head === head && clauses[index + 2].head === head) {
        hits.push({ offset: clauses[index].offset, length: 2 })
        break
      }
    }
  }
  return hits
}

function narrativeParagraphs(text) {
  const paragraphs = []
  const pattern = /[^\n]+/g
  let match
  while ((match = pattern.exec(text)) !== null) {
    const body = match[0].trim()
    if (body === '' || body.startsWith('#')) continue
    paragraphs.push({ offset: match.index, text: match[0] })
  }
  return paragraphs
}

/**
 * Scan prose for AI-flavored shells.
 * @param {string} text - chapter or passage.
 * @param {object} [configInput] - plugin config (strict mode, custom lists).
 * @returns {{ summary, stats, hits }}
 */
export function scanText(text, configInput) {
  if (typeof text !== 'string') throw new Error('text must be a string')
  if (text.length > LIMITS.scanChars) throw new Error(`text exceeds ${LIMITS.scanChars} characters; scan one chapter at a time`)
  const config = normalizeConfig(configInput)
  const whitelist = new Set(config.whitelist)
  const masked = maskDialogue(text)
  const starts = lineStarts(text)
  const hits = []
  const seen = new Map()

  function push(rule, offset, length, extra) {
    const match = text.slice(offset, offset + length)
    if (whitelist.has(match)) return
    // One span is reported once; a must-fix rule replaces an advisory claim.
    const key = `${offset}:${length}`
    const claimed = seen.get(key)
    if (claimed !== undefined && !(claimed.severity === 'advise' && rule.severity === 'high')) return
    const hit = {
      rule: rule.id,
      severity: rule.severity,
      label: rule.label,
      line: lineOf(starts, offset),
      match,
      excerpt: excerptAt(text, offset, length),
      fix: rule.fix,
      ...extra,
    }
    if (claimed !== undefined) hits[hits.indexOf(claimed)] = hit
    else hits.push(hit)
    seen.set(key, hit)
  }

  const rules = patternRules(config)
  for (const rule of rules) {
    const source = rule.scope === 'narrative' ? masked : text
    rule.pattern.lastIndex = 0
    let match
    while ((match = rule.pattern.exec(source)) !== null) {
      if (match[0].length === 0) { rule.pattern.lastIndex++; continue }
      push(rule, match.index, match[0].length)
    }
  }

  // A chapter that closes on a summary or a god-view forecast.
  const endingRule = { id: 'ending-sublimation', severity: 'high', label: '章尾总结 / 升华 / 预告', fix: '章尾用一个动作、一句台词或一个具体悬念收住。' }
  const endingPattern = /终于明白|这才意识到|这一刻|注定|才刚刚开始|[他她]不知道的是|殊不知|更大的(?:风暴|危机)|命运|从今以后|新的篇章|翻开(?:了)?新的一页/g
  // Only a real chapter has an ending; in a short excerpt every line is "last".
  const paragraphs = narrativeParagraphs(masked)
  for (const paragraph of paragraphs.length >= 3 ? paragraphs.slice(-2) : []) {
    endingPattern.lastIndex = 0
    const match = endingPattern.exec(paragraph.text)
    if (match) push(endingRule, paragraph.offset + match.index, match[0].length)
  }

  const parallelRule = { id: 'triple-parallel', severity: 'advise', label: '三连排比', fix: '只留最有力的一项。' }
  for (const hit of findParallelism(text, masked)) push(parallelRule, hit.offset, hit.length)

  // Density and rhythm.
  const chars = countChars(text)
  const perThousand = chars > 0 ? 1000 / chars : 0
  let weakCount = 0
  for (const adverb of WEAK_ADVERBS) {
    if (whitelist.has(adverb)) continue
    weakCount += text.split(adverb).length - 1
  }
  const weakDensity = Math.round(weakCount * perThousand * 10) / 10
  if (chars >= 300 && weakDensity > 3) {
    const first = WEAK_ADVERBS.map(adverb => text.indexOf(adverb)).filter(index => index >= 0).sort((a, b) => a - b)[0] ?? 0
    push({ id: 'weak-adverb-density', severity: 'advise', label: '弱化副词过密', fix: '缓缓、微微、轻轻、淡淡合计每千字不超过 3 个；成串出现时删掉大半。' }, first, 2, { count: weakCount, perThousand: weakDensity })
  }

  const sentences = narrativeSentences(masked)
  const lengths = sentences.map(sentence => countChars(sentence))
  const averageSentence = lengths.length > 0 ? Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length * 10) / 10 : 0
  const shortRatio = lengths.length > 0 ? Math.round(lengths.filter(length => length <= 6).length / lengths.length * 100) / 100 : 0
  if (lengths.length >= 20 && averageSentence < 12 && shortRatio > 0.45) {
    push({ id: 'telegraph', severity: 'advise', label: '电报体（句子碎成提纲）', fix: '非重拍的叙述句写回自然长句：一句 20-30 字，串起 2-4 个动作，保留的、了、就等连接。' }, 0, 0, { averageSentence, shortRatio })
  }

  const quoted = (text.match(/“[^”\n]*”|「[^」\n]*」|"[^"\n]*"/g) || []).reduce((sum, quote) => sum + countChars(quote), 0)

  hits.sort((a, b) => (a.severity === b.severity ? a.line - b.line : a.severity === 'high' ? -1 : 1))
  const high = hits.filter(hit => hit.severity === 'high').length
  const advise = hits.length - high
  const truncated = hits.length > LIMITS.hits
  return {
    summary: {
      chars,
      high,
      advise,
      truncated,
      verdict: high > 0 ? '需要修改' : advise > 5 ? '可以接受，建议通读复核' : '良好',
    },
    stats: {
      averageSentence,
      shortSentenceRatio: shortRatio,
      weakAdverbs: weakCount,
      weakAdverbsPerThousand: weakDensity,
      dialogueRatio: chars > 0 ? Math.round(quoted / chars * 100) / 100 : 0,
    },
    hits: truncated ? hits.slice(0, LIMITS.hits) : hits,
  }
}

/** One compact line per hit for model-facing tool output. */
export function renderScanReport(report, source) {
  const lines = [
    `去AI味扫描${source ? `（${source}）` : ''}：${report.summary.verdict}；${report.summary.chars} 字，必改 ${report.summary.high} 处，建议复核 ${report.summary.advise} 处${report.summary.truncated ? `（只列前 ${LIMITS.hits} 处）` : ''}。`,
    `节奏：叙述句平均 ${report.stats.averageSentence} 字，短句占比 ${Math.round(report.stats.shortSentenceRatio * 100)}%，弱化副词每千字 ${report.stats.weakAdverbsPerThousand} 个，对话占比 ${Math.round(report.stats.dialogueRatio * 100)}%。`,
  ]
  if (report.hits.length === 0) {
    lines.push('没有命中。仍需通读一遍，看有没有作者跳出来解释、替读者下结论的句子。')
    return lines.join('\n')
  }
  for (const hit of report.hits) {
    const tag = hit.severity === 'high' ? '必改' : '复核'
    lines.push(`- [${tag}] 第${hit.line}行 ${hit.label}${hit.match ? `「${hit.match}」` : ''}：${hit.excerpt} → ${hit.fix}`)
  }
  lines.push('处理原则：只改表达，不改剧情、设定、伏笔和人物信息释放；不新增原文没有的情节、物件或动作；复核项按语境判断，有功能的写法可以保留。')
  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Prompt
// ---------------------------------------------------------------------------

/** System prompt section for a conversation writing a bound novel. */
export function buildRulesPrompt(configInput) {
  const config = normalizeConfig(configInput)
  const banned = [...BANNED_WORDS, ...GENRE_CLICHES, ...config.extraBanned].filter(word => !config.whitelist.includes(word))
  const lines = [
    '# 去 AI 味写作规则（dsh-w-deslop）',
    '',
    '写小说正文时遵守以下规则。它们约束表达，不改变剧情、设定和用户的创作意图。',
    '',
    '## 视角与叙述',
    '- 锁定深度限知视角：只写视角人物此刻看得见、听得见、想得到的。每句都问一次：这是角色在经历，还是作者在讲解？',
    '- 不解释因果（之所以……是因为、这意味着、原来），不剧透（他不知道的是、殊不知、多年以后），不替读者下结论或给角色定性。',
    '- 新设定、新功法、新法宝首次出现，用角色撞上的可感后果带出，不整段讲来历和原理；也不能只甩一个生词让读者读懵。',
    '',
    '## 章尾',
    '- 禁止总结、感悟、升华和预告（终于明白、这一夜注定无人入眠、更大的风暴即将来临、属于他的反击才刚刚开始）。用一个动作、一句台词或一个具体悬念收住。',
    '',
    '## 句式',
    '- 不写「不是A，而是B」，直接写 B。',
    '- 不写「，带着一丝……」式万能状语，不写「声音不大，却带着……」「语气平静得……」，直接写台词。',
    '- 少写「他感到」「她意识到」「显得」：情绪有具体原因时可以直写，否则用选择、台词、后果展示；不要给每个情绪配一个套式动作。',
    '- 不凑三连排比，只留最有力的一项。不用「不难看出」「由此可见」「与此同时」「于是乎」这类论文腔连接。',
    '',
    '## 套词',
    `- 禁用：${banned.join('、')}。`,
    '- 缓缓、微微、轻轻、淡淡合计每千字不超过 3 个。',
    '- 身体细节做删除测试：删掉后不影响选择、关系、动作结果的，就删；不换成同义动作。身体状态造成后果的（伤让他握不住剑）要保留。',
    '- 比喻少而准，优先生活化、贴角色的比喻；不用万能文学比喻，不在段尾用比喻替读者总结。',
    '',
    '## 节奏',
    '- 叙述以逗号长句为主：一句 20-30 字，串起 2-4 个动作或信息，逗号之间 8-12 字。',
    '- 短句只用于动作、情绪、悬念的重拍，用完回到正常句长。保留的、了、就、已经等自然连接，不写电报体。',
    '- 不为反检测乱倒装、硬加口误、强制每句换行或凑对话占比。',
    '',
    '## 对话与场面',
    '- 对话口语化，宗主、散修、凡人掌柜、少年弟子说话方式要明显不同；解释性对白压成冲突、回避或半句话。',
    '- 震惊分层写：写具体某个人手里的东西、退的那一步、说不出的话，不写「全场哗然」「众人震惊」。',
    '- 打斗写策略、地形、功法克制和代价，不写流水账。',
  ]
  if (config.strict) {
    lines.push('- 严格模式：正文（含对话）不用破折号和省略号造停顿，改用句号、逗号、短句或动作断开。')
  }
  if (config.autoCheck) {
    lines.push(
      '',
      '## 保存前自查',
      '- 写完一章、调用 novel_save_chapter 保存之前，先把完整正文传给 deslop_scan(text) 扫描。',
      '- 「必改」项全部处理后再保存；「复核」项按语境判断，有功能的写法可以保留。修改只动表达，不改剧情、设定、伏笔和人物信息释放。',
      '- 不要把扫描报告贴给用户，除非用户要求；直接交付修改后的正文。',
    )
  }
  return lines.join('\n')
}

/** Follow-up message queued by /deslop. */
export function buildRevisePrompt(filename) {
  const target = filename
    ? `小说文件夹里的「${filename}」`
    : '最近写完或保存的一章（用 novel_outline_read 找到最近关联的正文文件；找不到就问我是哪个文件）'
  return [
    `请对${target}做一次去 AI 味修改：`,
    `1. 先调用 deslop_scan${filename ? `(filename: "${filename}")` : ''} 扫描；`,
    '2. 按「去 AI 味写作规则」处理全部「必改」项，「复核」项按语境判断；',
    '3. 只改表达，不改剧情、设定、伏笔和人物信息释放的节奏，不新增原文没有的情节、物件或动作；',
    '4. 改完通读一遍，读起来像提纲的地方把非重拍句恢复成自然白话；',
    '5. 用 novel_save_chapter（overwrite: true，保留原来的 chapter_id）写回同一个文件，然后简短告诉我改了哪几类问题。',
  ].join('\n')
}

/** Parse `/deslop [filename]`. */
export function parseDeslopCommand(rawInput) {
  const text = typeof rawInput === 'string' ? rawInput.trim() : ''
  if (text === '') return { kind: 'revise', filename: null }
  if (text === 'status') return { kind: 'status' }
  return { kind: 'revise', filename: text }
}

/** A chapter filename inside the bound novel folder: one segment, .md/.txt. */
export function normalizeChapterFilename(value) {
  if (typeof value !== 'string') throw new Error('filename must be a string')
  let name = value.trim()
  if (name === '') throw new Error('filename must not be empty')
  if (/[\\/]/.test(name) || name === '.' || name === '..' || name.includes('\0') || /^[A-Za-z]:/.test(name)) {
    throw new Error('filename must be a single file name inside the novel folder, without directories')
  }
  if (!/\.(md|txt)$/i.test(name)) name += '.md'
  return name
}
