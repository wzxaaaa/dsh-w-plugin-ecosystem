/** Recorded result files with downloads and in-place previews read from the artifact endpoint. */
import { useEffect, useState } from 'react'
import type { Artifact } from '../types.ts'
import { artifactUrl, fileKind, formatSize, imageType, previewableText, type FileKind, type T } from './ui.ts'
import css from './Studio.module.css'

const order: FileKind[] = ['image', 'document', 'web', 'code', 'data', 'other']
const textLimit = 64 * 1024

/** Group results by kind; images load as thumbnails, text opens on demand. */
export function ArtifactList({ artifacts, t }: { artifacts: Artifact[]; t: T }) {
  if (!artifacts.length) return <p className={css.emptyInline}>{t('noArtifacts')}</p>
  const sorted = [...artifacts].sort((a, b) => order.indexOf(fileKind(a.name)) - order.indexOf(fileKind(b.name)))
  return <ul className={css.fileGrid}>{sorted.map(file => <ArtifactItem key={file.id} file={file} t={t} />)}</ul>
}

function ArtifactItem({ file, t }: { file: Artifact; t: T }) {
  const kind = fileKind(file.name)
  const type = imageType(file.name)
  const [image, setImage] = useState('')
  const [text, setText] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    if (!type || file.size > 8 * 1024 * 1024) return
    const controller = new AbortController()
    let url = ''
    void fetch(artifactUrl(file), { signal: controller.signal, credentials: 'same-origin' })
      .then(async (response) => {
        if (!response.ok) throw new Error(String(response.status))
        url = URL.createObjectURL(new Blob([await response.arrayBuffer()], { type }))
        setImage(url)
      }).catch(() => { if (!controller.signal.aborted) setFailed(true) })
    return () => { controller.abort(); if (url) URL.revokeObjectURL(url) }
  }, [file.id, type])
  const toggle = (): void => {
    setOpen(value => !value)
    if (text !== null) return
    void fetch(artifactUrl(file), { credentials: 'same-origin' }).then(async (response) => {
      if (!response.ok) throw new Error(String(response.status))
      const body = await response.text()
      setText(body.length > textLimit ? `${body.slice(0, textLimit)}\n…` : body)
    }).catch(() => { setFailed(true) })
  }
  const base = file.name.split(/[\\/]/).at(-1) ?? file.name
  const folder = file.name.slice(0, file.name.length - base.length)
  return <li className={css.fileCard} data-kind={kind}>
    {image && <a className={css.thumb} href={image} target="_blank" rel="noreferrer"><img src={image} alt={base} onError={() => { setImage(''); setFailed(true) }} /></a>}
    <div className={css.fileRow}>
      <span className={css.fileIcon} data-kind={kind} aria-hidden="true">{t(`kind_${kind}` as const)}</span>
      <span className={css.fileName}>
        <strong title={file.name}>{base}</strong>
        <small>{folder && <span className={css.mono}>{folder} · </span>}{formatSize(file.size)} · <span className={css.mono} title={file.sha256}>{file.sha256.slice(0, 10)}</span></small>
      </span>
      <span className={css.fileActions}>
        {previewableText(file) && <button className={css.ghost} aria-expanded={open} onClick={toggle}>{t(open ? 'hidePreview' : 'preview')}</button>}
        <a className={css.linkButton} href={artifactUrl(file)} download>{t('download')}</a>
      </span>
    </div>
    {failed && <p className={css.inlineError}>{t('previewFailed')}</p>}
    {open && <pre className={css.codePreview}>{text ?? t('loading')}</pre>}
  </li>
}
