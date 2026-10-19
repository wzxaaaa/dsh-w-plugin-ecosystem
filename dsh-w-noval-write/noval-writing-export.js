import { deflateRawSync } from 'node:zlib'
import { normalizeProject } from './noval-write-core.js'
import { auditNovel } from './noval-quality.js'

const LABELS = {
  title: '书名', genre: '题材', premise: '故事梗概', tone: '基调', pov: '叙事视角', targetWords: '目标字数', audience: '读者定位', contentRating: '内容边界', styleGuide: '行文要求', constraints: '创作约束', notes: '补充说明',
  themes: '主题', storyQuestion: '核心悬念', coreConflict: '核心冲突', protagonistGoal: '主角目标', stakes: '失败代价', antagonisticForce: '阻力来源', opening: '开局', midpoint: '中点转折', climax: '高潮', ending: '结局', subplots: '支线', foreshadowing: '伏笔', reveals: '信息揭示', pacing: '节奏', chapterPlan: '章节规划', outline: '全书大纲',
  era: '时代', chronology: '历史脉络', geography: '地理', environment: '环境', locations: '主要地点', rules: '世界规则', factions: '势力', politics: '政治', society: '社会', culture: '文化', economy: '经济', beliefs: '信仰', technology: '技术', conflicts: '世界矛盾', lore: '传说与背景',
  name: '姓名', aliases: '别名', gender: '性别', age: '年龄', identity: '身份', role: '故事职责', importance: '重要度', faction: '阵营', tags: '人设标签', status: '状态', appearance: '外貌', traits: '性格', contrast: '反差', background: '过往', goal: '目标', motivation: '动机', conflict: '冲突', values: '信念与底线', likes: '喜好', abilities: '能力', edge: '底牌', weaknesses: '弱点', secret: '秘密', knowledge: '已知信息', possessions: '持有物', voice: '语言风格', habits: '习惯', firstAppearance: '首次登场', arc: '人物弧光', fate: '结局走向', readerAppeal: '读者看点',
  label: '关系', kind: '类型', state: '关系状态', direction: '方向', strength: '强度', history: '关系沿革', dynamic: '相处方式', powerBalance: '权力平衡', publicFace: '表面关系', privateTruth: '真实关系', sharedSecret: '共同秘密', tension: '张力', turningPoints: '关系转折', futureDirection: '后续发展',
  number: '章号', summary: '概要', dialogueNotes: '对话与语言备注', endingHook: '收束与下一章衔接', manuscriptFile: '正文文件', time: '时间', location: '地点', povCharacterId: '视角人物', participants: '出场人物', beats: '行动与推进', emotionalTurn: '情绪转折', sensoryAnchor: '感官锚点', outcome: '场景结果', knowledgeChanges: '认知变化', propChanges: '道具变化', continuity: '连续性要求', nextHook: '场景衔接', setup: '埋设内容', truth: '隐藏真相', payoffPlan: '回收计划', resolution: '回收结果', plantedChapterId: '埋设章节', plannedPayoffChapterId: '计划回收章节', resolvedChapterId: '实际回收章节', characterIds: '相关人物', knownByIds: '知情人物',
  stages: '阶段', advance: '晋升条件', cost: '代价', gap: '等级差距', stage: '当前阶段', condition: '身体与状态', holdings: '持有物', revealed: '暴露信息', gained: '所得', lost: '所失', note: '原因与说明',
}
const ENUMS = { protagonist: '主角', core: '核心', major: '重要', supporting: '配角', minor: '次要', family: '亲缘', romance: '情感', ally: '友盟', mentor: '师徒／上下级', enemy: '敌对', rival: '竞争', interest: '利益', other: '其他', active: '明线', hidden: '暗线', planned: '计划中', ended: '已断', mutual: '双向', oneway: '单向', open: '未回收', partial: '部分回收', resolved: '已回收', dropped: '已放弃', foreshadowing: '伏笔', mystery: '悬念', promise: '承诺', chekhov: '关键道具', subplot: '支线' }
const enumKeys = new Set(['importance', 'kind', 'state', 'direction', 'status'])
const XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
// XML 1.0 cannot represent lone surrogates/control codes. Never silently drop user text.
function xml(value) {
  const s = String(value)
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]|[\ud800-\udfff]/u.test(s)) throw new Error('内容含 Word/Excel 不支持的字符，请改用 Markdown 或修正该字符。')
  return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}

/** One ordered reading model feeds every format, independent of the paginated AI view. */
export function writingDocument(projectValue, kind, revision = 0) {
  if (!['outline', 'detail'].includes(kind)) throw new Error('kind must be outline or detail')
  const project = normalizeProject(projectValue)
  const quality = auditNovel(project, { scope: kind })
  const title = `${project.title || '未命名小说'} · ${kind === 'outline' ? '大纲' : '细纲'}`
  const blocks = []
  let volume = '', chapter = ''
  const heading = (text, level = 1) => blocks.push({ type: 'heading', text, level, volume, chapter })
  const field = (label, value, required = false) => {
    if ((value === '' || value == null || (Array.isArray(value) && !value.length)) && !required) return
    blocks.push({ type: 'field', label, text: Array.isArray(value) ? value.join('、') : String(value || '【待补充】'), volume, chapter })
  }
  const characters = new Map(project.characters.map(c => [c.id, c.name || c.id]))
  const chapterNames = new Map(project.volumes.flatMap(v => v.chapters.map(c => [c.id, `${v.title || v.id} / ${c.number || ''} ${c.title || c.id}`.trim()])))
  const show = (key, value) => {
    if (key === 'povCharacterId') return characters.get(value) || value
    if (['characterIds', 'knownByIds'].includes(key)) return value.map(id => characters.get(id) || id)
    if (key.endsWith('ChapterId')) return chapterNames.get(value) || value
    return enumKeys.has(key) ? ENUMS[value] || value : value
  }
  const record = (data, skip = []) => {
    for (const [key, value] of Object.entries(data)) {
      if (key === 'id' || skip.includes(key)) continue
      if (key === 'customFields') { for (const [name, text] of Object.entries(value || {})) field(name, text); continue }
      if (LABELS[key] && (typeof value === 'string' || Array.isArray(value))) field(LABELS[key], show(key, value))
    }
  }
  heading('使用说明')
  field('用途', '供作者对照手写正文。保持原有卷章顺序，空缺会标为【待补充】；导出不生成或改写故事。')
  field('来源', `已保存版本 ${revision}；${project.volumes.length} 卷，${project.volumes.reduce((n, v) => n + v.chapters.length, 0)} 章。`)
  if (quality.issues.length) {
    heading('写作前待核对')
    for (const issue of quality.issues) field(issue.path, `${issue.severity === 'warning' ? '提示' : '待补充'}：${issue.message}`)
  }
  if (kind === 'outline') {
    heading('全书设定')
    record(project, ['characters', 'relationships', 'volumes', 'threads', 'progress'])
    field('类型补充', project.genreProfile.type)
    record(project.genreProfile)
    heading('故事主线')
    for (const [key, value] of Object.entries(project.plot)) field(LABELS[key] || key, value, ['opening', 'coreConflict', 'climax', 'ending'].includes(key))
    heading('世界设定'); record(project.world)
    heading('人物与关系')
    for (const c of project.characters) { heading(c.name || c.id, 2); record(c) }
    for (const r of project.relationships) { heading(`${characters.get(r.fromId) || r.fromId} → ${characters.get(r.toId) || r.toId}`, 2); record(r) }
    if (project.progression.systems.length) {
      heading('成长体系')
      for (const system of project.progression.systems) { heading(system.name || system.id, 2); field('说明', system.notes); for (const tier of system.tiers) { heading(tier.name || tier.id, 3); record(tier) } }
    }
  }
  heading(kind === 'outline' ? '分卷与章纲' : '逐章写作细纲')
  for (const v of project.volumes) {
    volume = v.title || v.id; chapter = ''
    heading(volume, 1)
    field('本卷概要', v.summary, true)
    field('计划／已有章数', `${v.plannedChapterCount || '未确定'} / ${v.chapters.length}`)
    record(v, ['title', 'summary', 'chapters'])
    for (const c of v.chapters) {
      chapter = `${c.number ? (/^第.*章$/u.test(c.number) ? c.number : `第${c.number}章`) + ' ' : ''}${c.title || c.id}`
      heading(chapter, 2)
      field('章节概要', c.summary, true)
      field('目标字数', c.targetWords)
      if (kind === 'outline') { field('收束与下一章衔接', c.endingHook); continue }
      record(c, ['number', 'title', 'summary', 'targetWords', 'events', 'scenes'])
      if (!c.events.length) field('事件推进', '', true)
      c.events.forEach((event, i) => field(`事件 ${i + 1}`, event, true))
      if (!c.scenes.length) field('场景拆分', '', true)
      c.scenes.forEach((scene, i) => {
        heading(`场景 ${i + 1} · ${scene.title || '未命名场景'}`, 3)
        record(scene, ['title', 'goal', 'conflict', 'beats', 'outcome'])
        for (const key of ['goal', 'conflict', 'beats', 'outcome']) field(LABELS[key], scene[key], true)
      })
      for (const thread of project.threads.filter(t => [t.plantedChapterId, t.plannedPayoffChapterId, t.resolvedChapterId, ...t.beats.map(b => b.chapterId)].includes(c.id))) {
        heading(`本章线索 · ${thread.title || thread.id}`, 3); record(thread)
        thread.beats.filter(b => b.chapterId === c.id).forEach(b => field('本章呼应', b.note, true))
      }
      for (const r of project.progression.records.filter(r => r.chapterId === c.id)) {
        heading(`本章人物变化 · ${characters.get(r.characterId) || r.characterId}`, 3)
        const system = project.progression.systems.find(s => s.id === r.systemId)
        field('体系／等级', [system?.name || r.systemId, system?.tiers.find(t => t.id === r.tierId)?.name || r.tierId].filter(Boolean).join(' / '))
        record(r)
      }
      field('手写备注', '________________________________________________')
    }
  }
  volume = ''; chapter = ''
  if (project.threads.length) {
    heading('线索总表')
    for (const t of project.threads) { heading(t.title || t.id, 2); record(t); t.beats.forEach(b => field(chapterNames.get(b.chapterId) || b.chapterId || '呼应', b.note)) }
  }
  return { title, blocks, quality }
}

function markdown(doc) {
  return `# ${doc.title}\n\n` + doc.blocks.map(b => b.type === 'heading' ? `${'#'.repeat(b.level + 1)} ${b.text}\n` : `**${b.label}**\n\n${b.text}\n`).join('\n')
}

// Minimal standards-based OOXML packages, no external executable or CDN dependency.
function crc32(bytes) {
  let crc = 0xffffffff
  for (const byte of bytes) { crc ^= byte; for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0) }
  return (crc ^ 0xffffffff) >>> 0
}
function zip(files) {
  const local = [], central = []; let offset = 0
  for (const [name, value] of Object.entries(files)) {
    const filename = Buffer.from(name), data = Buffer.from(value), compressed = deflateRawSync(data), crc = crc32(data)
    const h = Buffer.alloc(30); h.writeUInt32LE(0x04034b50); h.writeUInt16LE(20, 4); h.writeUInt16LE(0x800, 6); h.writeUInt16LE(8, 8); h.writeUInt16LE(33, 12); h.writeUInt32LE(crc, 14); h.writeUInt32LE(compressed.length, 18); h.writeUInt32LE(data.length, 22); h.writeUInt16LE(filename.length, 26)
    const c = Buffer.alloc(46); c.writeUInt32LE(0x02014b50); c.writeUInt16LE(20, 4); c.writeUInt16LE(20, 6); c.writeUInt16LE(0x800, 8); c.writeUInt16LE(8, 10); c.writeUInt16LE(33, 14); c.writeUInt32LE(crc, 16); c.writeUInt32LE(compressed.length, 20); c.writeUInt32LE(data.length, 24); c.writeUInt16LE(filename.length, 28); c.writeUInt32LE(offset, 42)
    local.push(h, filename, compressed); central.push(c, filename); offset += h.length + filename.length + compressed.length
  }
  const directory = Buffer.concat(central), end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50); end.writeUInt16LE(central.length / 2, 8); end.writeUInt16LE(central.length / 2, 10); end.writeUInt32LE(directory.length, 12); end.writeUInt32LE(offset, 16)
  return Buffer.concat([...local, directory, end])
}
const REL_NS = 'http://schemas.openxmlformats.org/package/2006/relationships'
const OFFICE_REL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
function packageTypes(overrides) { return XML + `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>${overrides.map(([name, type]) => `<Override PartName="/${name}" ContentType="${type}"/>`).join('')}</Types>` }
function relationships(items) { return XML + `<Relationships xmlns="${REL_NS}">${items.map(([id, type, target]) => `<Relationship Id="${id}" Type="${OFFICE_REL}/${type}" Target="${target}"/>`).join('')}</Relationships>` }
function docx(doc) {
  const ns = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
  const p = (text, style = '') => `<w:p><w:pPr>${style ? `<w:pStyle w:val="${style}"/>` : ''}</w:pPr><w:r><w:t xml:space="preserve">${xml(text)}</w:t></w:r></w:p>`
  const body = p(doc.title, 'Title') + doc.blocks.map(b => b.type === 'heading' ? p(b.text, `Heading${b.level}`) : p(b.label, 'Label') + b.text.split(/\r?\n/u).map(line => p(line)).join('')).join('')
  const styles = XML + `<w:styles xmlns:w="${ns}"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:eastAsia="Microsoft YaHei"/><w:sz w:val="22"/><w:lang w:val="zh-CN" w:eastAsia="zh-CN"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="100" w:line="300" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>${[['Title', '36'], ['Heading1', '30'], ['Heading2', '26'], ['Heading3', '23'], ['Label', '22']].map(([id, size], i) => `<w:style w:type="paragraph" w:styleId="${id}"><w:name w:val="${id}"/><w:pPr><w:keepNext/><w:spacing w:before="${i === 0 ? 0 : 200}" w:after="100"/>${id.startsWith('Heading') ? `<w:outlineLvl w:val="${Number(id.at(-1)) - 1}"/>` : ''}</w:pPr><w:rPr><w:b/><w:sz w:val="${size}"/><w:color w:val="${i < 4 ? '243C50' : '445566'}"/></w:rPr></w:style>`).join('')}</w:styles>`
  return zip({
    '[Content_Types].xml': packageTypes([['word/document.xml', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml'], ['word/styles.xml', 'application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml']]),
    '_rels/.rels': relationships([['rId1', 'officeDocument', 'word/document.xml']]),
    'word/_rels/document.xml.rels': relationships([['rId1', 'styles', 'styles.xml']]),
    'word/styles.xml': styles,
    'word/document.xml': XML + `<w:document xmlns:w="${ns}"><w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="567" w:footer="567" w:gutter="0"/></w:sectPr></w:body></w:document>`,
  })
}

/** Split long cells into visible continuation rows; never hit Excel's 32767-character limit. */
export function spreadsheetRows(doc) {
  const wrap = (text, width) => String(text).split(/\r?\n/u).flatMap(line => {
    const chars = Array.from(line), parts = []
    if (!chars.length) return ['']
    for (let i = 0; i < chars.length; i += width) parts.push(chars.slice(i, i + width).join(''))
    return parts
  })
  const rows = [[wrap(doc.title, 80).join('\n'), '', '', '', ''], ['卷', '章', '项目', '完整内容（长段落分续行）', '手写备注']]
  for (const b of doc.blocks) {
    const values = [b.volume, b.chapter, b.type === 'heading' ? '【' + b.text + '】' : b.label, b.type === 'heading' ? '' : b.text, '']
    const columns = values.map((value, i) => wrap(value, [9, 12, 13, 42, 13][i]))
    const length = Math.max(...columns.map(lines => lines.length))
    for (let i = 0; i < length; i += 5) {
      rows.push(columns.map((lines, col) => {
        // Short identifying labels repeat on continuation rows; long labels continue
        // without clipping, just like the prose column.
        if (col < 3 && lines.length <= 5) return lines.join('\n') + (i && col === 2 ? '（续）' : '')
        return lines.slice(i, i + 5).join('\n')
      }))
    }
  }
  return rows
}
function xlsx(doc) {
  const ns = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
  const rows = spreadsheetRows(doc)
  if (rows.length > 1_048_576) throw new Error('导出超过 Excel 行数上限，请改用 Markdown 或 Word。')
  const sheet = XML + `<worksheet xmlns="${ns}"><sheetViews><sheetView workbookViewId="0"><pane ySplit="2" topLeftCell="A3" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols><col min="1" max="1" width="20" customWidth="1"/><col min="2" max="2" width="26" customWidth="1"/><col min="3" max="3" width="28" customWidth="1"/><col min="4" max="4" width="90" customWidth="1"/><col min="5" max="5" width="28" customWidth="1"/></cols><sheetData>${rows.map((row, i) => `<row r="${i + 1}" ht="${i === 1 ? 30 : Math.min(380, Math.max(42, Math.max(...row.map(s => String(s).split('\n').length)) * 19 + 10))}" customHeight="1">${row.map((value, j) => `<c r="${String.fromCharCode(65 + j)}${i + 1}" s="${i < 2 ? 1 : 0}" t="inlineStr"><is><t xml:space="preserve">${xml(value)}</t></is></c>`).join('')}</row>`).join('')}</sheetData><mergeCells count="1"><mergeCell ref="A1:E1"/></mergeCells><pageMargins left="0.3" right="0.3" top="0.5" bottom="0.5" header="0.2" footer="0.2"/><pageSetup orientation="landscape" paperSize="9" fitToWidth="1" fitToHeight="0"/></worksheet>`
  const styles = XML + `<styleSheet xmlns="${ns}"><fonts count="2"><font><sz val="11"/><name val="Microsoft YaHei"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Microsoft YaHei"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF243C50"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`
  return zip({
    '[Content_Types].xml': packageTypes([['xl/workbook.xml', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml'], ['xl/worksheets/sheet1.xml', 'application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml'], ['xl/styles.xml', 'application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml']]),
    '_rels/.rels': relationships([['rId1', 'officeDocument', 'xl/workbook.xml']]),
    'xl/workbook.xml': XML + `<workbook xmlns="${ns}" xmlns:r="${OFFICE_REL}"><sheets><sheet name="写作参考" sheetId="1" r:id="rId1"/></sheets><definedNames><definedName name="_xlnm.Print_Titles" localSheetId="0">'写作参考'!$1:$2</definedName></definedNames></workbook>`,
    'xl/_rels/workbook.xml.rels': relationships([['rId1', 'worksheet', 'worksheets/sheet1.xml'], ['rId2', 'styles', 'styles.xml']]),
    'xl/styles.xml': styles, 'xl/worksheets/sheet1.xml': sheet,
  })
}

export function exportWritingDocument(project, kind, format, revision = 0) {
  if (!['md', 'docx', 'xlsx'].includes(format)) throw new Error('format must be md, docx or xlsx')
  const doc = writingDocument(project, kind, revision)
  const bytes = format === 'md' ? Buffer.from(markdown(doc)) : format === 'docx' ? docx(doc) : xlsx(doc)
  const name = Array.from((project.title || '未命名小说').replace(/[\\/:*?"<>|\x00-\x1f]/gu, '-').replace(/[. ]+$/u, '')).slice(0, 60).join('') || 'novel'
  return { filename: `${name}-${kind === 'outline' ? '大纲' : '细纲'}.${format}`, mime: { md: 'text/markdown;charset=utf-8', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }[format], base64: bytes.toString('base64'), bytes: bytes.length, revision, issues: doc.quality.issues.length }
}
