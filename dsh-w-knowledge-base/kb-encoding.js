/**
 * dsh-w-knowledge-base — text encoding detection.
 *
 * Real-world novel .txt files are frequently GBK / GB2312 / GB18030 (and
 * occasionally Big5 or UTF-16), not UTF-8. Reading those bytes as UTF-8 turns a
 * whole book into mojibake, so every file the import path touches is decoded
 * here first: BOMs win outright, otherwise a strict UTF-8 probe decides, and
 * only a non-UTF-8 file falls through to statistical detection.
 *
 * This module takes a Buffer and returns text; it never touches the filesystem,
 * so it stays unit-testable with a hand-built Buffer.
 */

import jschardet from 'jschardet'
import iconv from 'iconv-lite'

/** Bytes scanned by the statistical detector; a book's first chunk is plenty. */
export const DETECT_SAMPLE_BYTES = 64 * 1024
/** Encoding assumed for an undecodable Chinese file: GB18030 is a superset of GBK/GB2312. */
export const DEFAULT_CHINESE_ENCODING = 'gb18030'

/**
 * Map a jschardet encoding name onto an iconv-lite codec name, folding the
 * whole GB family onto GB18030 (its superset) so a mis-labelled GBK file still
 * decodes cleanly.
 * @param {string} name - the detector's encoding label.
 * @returns {string} an iconv-lite codec name.
 */
export function normalizeEncoding(name) {
  const lower = String(name ?? '').trim().toLowerCase().replace(/[_\s]+/g, '-')
  if (lower === '' || lower === 'ascii') return 'utf-8'
  if (lower === 'utf-8' || lower === 'utf8') return 'utf-8'
  if (lower === 'gb2312' || lower === 'gbk' || lower === 'gb18030' || lower === 'x-gbk') return 'gb18030'
  if (lower === 'big5' || lower === 'big-5' || lower === 'big5-hkscs') return 'big5'
  if (lower === 'utf-16le' || lower === 'utf-16') return 'utf-16le'
  if (lower === 'utf-16be') return 'utf-16be'
  if (lower === 'windows-1252' || lower === 'iso-8859-1' || lower === 'latin1') return 'win1252'
  if (lower === 'shift-jis' || lower === 'shift_jis' || lower === 'sjis') return 'shift_jis'
  if (lower === 'euc-jp' || lower === 'euc-kr') return lower
  return lower
}

/**
 * Decide whether a Buffer is valid UTF-8. Valid multi-byte UTF-8 almost never
 * occurs by accident in a GBK stream, so a clean strict decode is a reliable
 * "this really is UTF-8" signal.
 * @param {Buffer} buffer - the bytes to probe.
 * @returns {boolean} true when the bytes decode as strict UTF-8.
 */
export function looksUtf8(buffer) {
  try {
    new TextDecoder('utf-8', { fatal: true }).decode(buffer)
    return true
  } catch {
    return false
  }
}

/**
 * Detect the encoding of a byte Buffer and decode it to a JavaScript string.
 * @param {Buffer} buffer - the raw file bytes.
 * @returns {{ text: string, encoding: string }} the decoded text and the codec used.
 */
export function detectAndDecode(buffer) {
  if (!Buffer.isBuffer(buffer)) {
    return { text: String(buffer ?? ''), encoding: 'utf-8' }
  }
  if (buffer.length === 0) return { text: '', encoding: 'utf-8' }
  // Byte-order marks are unambiguous: honour them before anything else.
  if (buffer.length >= 3 && buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
    return { text: buffer.slice(3).toString('utf8'), encoding: 'utf-8' }
  }
  if (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xfe) {
    return { text: iconv.decode(buffer.slice(2), 'utf-16le'), encoding: 'utf-16le' }
  }
  if (buffer.length >= 2 && buffer[0] === 0xfe && buffer[1] === 0xff) {
    return { text: iconv.decode(buffer.slice(2), 'utf-16be'), encoding: 'utf-16be' }
  }
  // A clean strict UTF-8 decode is the most reliable positive signal.
  if (looksUtf8(buffer)) return { text: buffer.toString('utf8'), encoding: 'utf-8' }
  // Not UTF-8: let the statistical detector name a legacy codec, defaulting to
  // GB18030 (the dominant Chinese .txt encoding) when it is unsure.
  let detected
  try {
    detected = jschardet.detect(buffer.slice(0, DETECT_SAMPLE_BYTES))
  } catch {
    detected = null
  }
  const encoding = detected && detected.encoding && detected.confidence >= 0.5
    ? normalizeEncoding(detected.encoding)
    : DEFAULT_CHINESE_ENCODING
  const codec = iconv.encodingExists(encoding) ? encoding : DEFAULT_CHINESE_ENCODING
  return { text: iconv.decode(buffer, codec), encoding: codec }
}

export default detectAndDecode
