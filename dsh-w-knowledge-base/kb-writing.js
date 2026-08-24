/**
 * dsh-w-knowledge-base — writing mode.
 *
 * The knowledge base has two modes. "assistant" is the original durable memory
 * for an agent's own findings (unchanged). "writing" turns the same machinery
 * into a prose style corpus: you feed in real, human-written novels, and when
 * the model drafts a scene it retrieves human passages of the same kind to
 * borrow their texture — the practical antidote to the flat "AI flavour" that
 * un-anchored generation drifts into.
 *
 * Everything here is pure text: the mode's system prompt, the default banned
 * cliché list, and the helpers that parse and render it. No filesystem, no
 * clock, so it is unit-testable in isolation; index.js persists the list.
 */

/** The two knowledge-base modes. */
export const MODES = Object.freeze(['assistant', 'writing'])
/** Prompt section order for the writing protocol: same tool-guidance band as assistant mode. */
export const WRITING_GUIDANCE_ORDER = 150
/** Runtime-context order for the banned-phrase list: right after the style index. */
export const BANNED_CONTEXT_ORDER = 520
/** Hard cap on banned phrases, so a runaway list cannot flood the prompt. */
export const MAX_BANNED_PHRASES = 200
/** Hard cap on one banned phrase. */
export const MAX_BANNED_PHRASE_CHARS = 40
/** File name of the per-corpus banned-phrase list. */
export const BANNED_FILE = 'banned-phrases.txt'

/**
 * A starter list of the phrases that most reliably mark Chinese AI-written
 * prose: canned four-character emotion summaries, stock facial "micro-actions",
 * essay-style connectors. The user edits this freely; it is only a seed.
 */
export const DEFAULT_BANNED_PHRASES = Object.freeze([
  '五味杂陈',
  '百感交集',
  '心中五味杂陈',
  '嘴角勾起一抹弧度',
  '嘴角勾起',
  '勾起一抹',
  '眼中闪过一丝',
  '眼底闪过',
  '深吸一口气',
  '不由得',
  '情不自禁',
  '不禁',
  '仿佛整个世界都',
  '空气仿佛凝固',
  '时间仿佛静止',
  '一股暖流涌上心头',
  '这一刻',
  '那一抹',
  '淡淡地说道',
  '淡淡一笑',
  '苦笑一声',
  '挑了挑眉',
  '心中暗道',
  '殊不知',
  '散发着……的气息',
  '……的存在',
  '无论如何',
  '总而言之',
  '值得一提的是',
  '不得不说',
])

/**
 * The writing-mode system prompt. Written to be read every turn: it is the main
 * lever against generic output, so it is concrete about what to do instead of
 * naming an emotion or reaching for a stock phrase, and it teaches the retrieval
 * workflow that puts real human prose in front of the model before it drafts.
 * @param {string} displayRoot - user-facing style-corpus location.
 * @param {boolean} [hasBanned] - whether a non-empty banned list is injected too.
 * @returns {string} the section text.
 */
export function writingGuidanceText(displayRoot, hasBanned = false) {
  const lines = [
    '# 写作模式 · 文风素材库',
    '',
    '你现在处于写作模式。' + displayRoot + ' 下是一个**人类作者写的**小说素材库，用 `kb_search` / `kb_read` 检索，用 `kb_import` 喂入新的参考小说。'
      + '它的用途只有一个：在你动笔前，让真人写的文字给你做语感锚点，压掉 AI 腔。',
    '',
    '**动笔前的检索流程**：写每一场戏之前，先用 `kb_search` 描述这场戏——地点、情绪、是对白为主还是白描为主、叙述视角，'
      + '拉出 2–3 段同类的真人段落，读它的**句子节奏、用词密度、以及它怎么留白**。学它的手感，不要照搬它的情节或句子。',
    '',
    '**落笔时避开 AI 腔**：',
    '- 用具体的动作、感官细节和潜台词表现情绪，**不要直接命名情绪**，更不要用四字成语概括（如"五味杂陈""百感交集"）。',
    '- 长短句交错，别让每句都是同一种匀速的"主谓宾＋的地得"节奏。',
    '- 少用"仿佛/宛如……一般"这类兜底比喻；要用比喻就用新鲜的、贴这个人物的。',
    '- 删掉解释性的过渡和总结（"总之""无论如何""这一刻""值得一提的是"）；让画面和对白自己承担信息。',
    '- 对话里让潜台词干活，别让人物把心里想的直接说白或独白出来。',
    hasBanned
      ? '- 遵守下方注入的**禁用套路表**：里面列的表达一律换成具体的动作、感官或潜台词。'
      : '- 可以维护一张禁用套路表（面板里编辑），把你最反感的 AI 腔词列进去，它会一并注入到这里。',
    '',
    '素材是用来学**怎么写**的，不是用来抄**写了什么**的——借语感，不搬情节。',
  ]
  return lines.filter((line) => line !== null).join('\n')
}

/**
 * Parse a banned-phrase list from its file text: one phrase per line, `#`
 * comments and blank lines ignored, de-duplicated and bounded.
 * @param {unknown} text - the file text.
 * @returns {string[]} the cleaned phrase list.
 */
export function parseBannedList(text) {
  const raw = String(text ?? '').replace(/\r\n/g, '\n').split('\n')
  const seen = new Set()
  const phrases = []
  for (const line of raw) {
    const trimmed = line.trim()
    if (trimmed === '' || trimmed.startsWith('#')) continue
    const phrase = trimmed.slice(0, MAX_BANNED_PHRASE_CHARS).trim()
    if (phrase === '' || seen.has(phrase)) continue
    seen.add(phrase)
    phrases.push(phrase)
    if (phrases.length >= MAX_BANNED_PHRASES) break
  }
  return phrases
}

/**
 * Render a banned-phrase list back to file text.
 * @param {string[]} phrases - the phrases to write.
 * @returns {string} the file text, newline-terminated.
 */
export function formatBannedList(phrases) {
  const clean = parseBannedList((Array.isArray(phrases) ? phrases : []).join('\n'))
  const header = '# 禁用套路表 —— 写作模式下注入，让模型避开这些被写烂的 AI 腔表达。\n# 一行一个，# 开头是注释。\n'
  return header + clean.join('\n') + (clean.length > 0 ? '\n' : '')
}

/**
 * The runtime-context block that injects the banned phrases into the prompt.
 * @param {string[]} phrases - the active banned phrases.
 * @returns {string} the injected text, or an empty string when the list is empty.
 */
export function bannedPromptText(phrases) {
  const clean = Array.isArray(phrases) ? phrases.filter((phrase) => typeof phrase === 'string' && phrase.trim() !== '') : []
  if (clean.length === 0) return ''
  return '禁用套路表（写作时避开这些被过度使用的表达，换成具体的动作、感官细节或潜台词）：\n'
    + clean.map((phrase) => '· ' + phrase).join('\n')
}

/**
 * The live style-corpus index injected each turn in writing mode. It advertises
 * the corpus and re-states the workflow rather than dumping passages (that would
 * waste the very context the retrieval is meant to fill on demand).
 * @param {string} displayRoot - the style-corpus location.
 * @param {number} total - number of passages in the corpus.
 * @param {Array<{ tag: string, count: number }>} sources - source tags (book slugs), most passages first.
 * @param {number} [maxSources] - how many source tags to name.
 * @returns {string} the index text.
 */
export function styleIndexText(displayRoot, total, sources = [], maxSources = 8) {
  const header = '文风素材库（写作模式）位于 ' + displayRoot
  if (!Number.isFinite(total) || total <= 0) {
    return header + '：还是空的。用 kb_import 喂一本参考小说（支持 GBK/UTF-8 的 .txt，会自动按章切段）后再动笔。'
  }
  const named = sources
    .filter((entry) => entry && typeof entry.tag === 'string' && entry.tag !== 'import')
    .slice(0, Math.max(1, maxSources))
    .map((entry) => entry.tag + '(' + entry.count + ')')
  const tail = named.length > 0 ? '素材标签：' + named.join('、') + '。' : ''
  return header + '：共 ' + total + ' 段真人参考文字。' + tail
    + '动笔写一场戏前，先用 kb_search 描述这场戏（情绪/动作/对白密度/视角）拉 2–3 段同类段落找语感，模仿手感而非情节。'
}

/**
 * Normalize a mode string to one of {@link MODES}, defaulting to assistant.
 * @param {unknown} value - candidate mode.
 * @returns {'assistant' | 'writing'} the normalized mode.
 */
export function normalizeMode(value) {
  return value === 'writing' ? 'writing' : 'assistant'
}
