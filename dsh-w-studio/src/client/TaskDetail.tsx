/** One task: goal and result first, revision links, related handoffs, then collapsible execution records. */
import { useState } from 'react'
import type { Project, StudioState, Task } from '../types.ts'
import { ArtifactList } from './ArtifactList.tsx'
import { Avatar, Busy, ReviewStatus, Section, TaskStatus } from './parts.tsx'
import { changeRequest, employeeOf, formatTime, resumeCommand, revisionOf, revisionsFor, taskPhase, usePending, waitingOn, type Command, type T } from './ui.ts'
import css from './Studio.module.css'

/** Selected task data and actions. */
export interface TaskDetailProps {
  task: Task
  tasks: Task[]
  state: StudioState
  project: Project
  busy: boolean
  t: T
  command: Command
  onSelect: (id: string) => void
  onEdit: () => void
}

/** Detail pane ordered by what a reviewer needs: outcome, revision chain, collaboration, execution. */
export function TaskDetail({ task, tasks, state, project, busy, t, command, onSelect, onEdit }: TaskDetailProps) {
  const [changes, setChanges] = useState('')
  const { pending, run } = usePending()
  const phase = taskPhase(task, tasks)
  const owner = employeeOf(state.employees, task.employeeId)
  const step = (value: Task): string => `#${tasks.indexOf(value) + 1}`
  const waiting = waitingOn(task, tasks)
  const original = revisionOf(task, tasks)
  const revisions = revisionsFor(task, tasks)
  const request = changeRequest(task, state.messages)
  const artifacts = state.artifacts.filter(file => file.taskId === task.id)
  const handoffs = state.messages.filter(message => message.taskId === task.id && message.id !== request?.id)
  const name = (id: string): string => id === 'user' ? t('user') : id === 'team' ? t('everyone') : employeeOf(state.employees, id)?.name ?? t('unknownEmployee')
  const link = (value: Task) => <button key={value.id} className={css.taskLink} onClick={() => { onSelect(value.id) }}>
    <b>{step(value)}</b>{value.title}<TaskStatus phase={taskPhase(value, tasks)} t={t} />
  </button>
  const canReview = task.status === 'completed' && task.reviewStatus !== 'superseded'
  return <article className={css.detailCard} aria-labelledby={`task-${task.id}`}>
    <header className={css.detailHead}>
      <div className={css.detailTitle}>
        <span className={css.stepLarge}>{step(task)}</span>
        <div>
          <h2 id={`task-${task.id}`}>{task.title}</h2>
          <p className={css.taskOwner}><Avatar id={task.employeeId} name={owner?.name} size="sm" />{owner?.name ?? t('unknownEmployee')}{owner?.role && <small> · {owner.role}</small>}</p>
        </div>
      </div>
      <div className={css.detailBadges}><TaskStatus phase={phase} t={t} /><ReviewStatus task={task} t={t} /></div>
      <div className={css.actions}>
        {task.status === 'pending' && <button className={css.ghost} onClick={onEdit}>{t('edit')}</button>}
        {['failed', 'cancelled', 'interrupted'].includes(task.status) && <button className={css.primary} disabled={busy} onClick={() => { void run('retry', () => command('retryTask', { id: task.id })) }}><Busy on={pending === 'retry'} />{t('retry')}</button>}
        {['pending', 'running'].includes(task.status) && <button className={css.ghostDanger} disabled={busy} onClick={() => { void run('cancel', () => command('cancelTask', { id: task.id })) }}><Busy on={pending === 'cancel'} />{t('cancel')}</button>}
      </div>
    </header>

    {task.error && <div className={css.alert} role="alert"><strong>{t('failureReason')}</strong><p>{task.error}</p></div>}
    {!!waiting.length && <div className={css.notice}><strong>{t('waitingTitle')}</strong><div className={css.linkList}>{waiting.map(link)}</div></div>}
    {task.status === 'running' && <div className={css.notice} data-tone="running"><strong>{t('runningNotice', { name: owner?.name ?? '' })}</strong>{task.startedAt && <p>{t('startedAt', { time: formatTime(task.startedAt) })}</p>}</div>}

    {original && <div className={css.revisionCard}>
      <strong>{t('revisionOf')}</strong>
      <div className={css.linkList}>{link(original)}</div>
      {request && <blockquote><small>{t('changeInstruction')}</small>{request.message}</blockquote>}
    </div>}
    {!!revisions.length && <div className={css.revisionCard} data-kind="superseded">
      <strong>{t('supersededBy')}</strong>
      <div className={css.linkList}>{revisions.map(link)}</div>
      {revisions.map(value => changeRequest(value, state.messages)).filter(Boolean).map(value => <blockquote key={value?.id}><small>{t('changeInstruction')}</small>{value?.message}</blockquote>)}
    </div>}

    <Section title={t('result')}>
      {task.result ? <pre className={css.report}>{task.result}</pre> : <p className={css.emptyInline}>{t('noResult')}</p>}
    </Section>
    <Section title={<>{t('artifacts')}{!!artifacts.length && <small> · {artifacts.length}</small>}</>}>
      <ArtifactList artifacts={artifacts} t={t} />
    </Section>

    {canReview && <Section title={t('reviewResult')}>
      <form className={css.reviewForm} onSubmit={(event) => {
        event.preventDefault()
        void run('changes', () => command('requestChanges', { id: task.id, instruction: changes })).then((ok) => { if (ok) setChanges('') })
      }}>
        <label className={css.field}><span>{t('changeInstruction')}</span><textarea required rows={3} placeholder={t('changePlaceholder')} value={changes} onChange={(event) => { setChanges(event.target.value) }} /></label>
        <div className={css.actions}>
          <button disabled={busy || project.status === 'running'}><Busy on={pending === 'changes'} />{t('requestChanges')}</button>
          <span className={css.muted}>{t(project.status === 'running' ? 'pauseBeforeChanges' : 'changesHelp')}</span>
        </div>
      </form>
    </Section>}

    <Section title={t('overview')}>
      <dl className={css.facts}>
        <dt>{t('instruction')}</dt><dd><pre className={css.report}>{task.instruction}</pre></dd>
        {!!task.dependsOn.length && <><dt>{t('dependencies')}</dt><dd className={css.linkList}>{task.dependsOn.map(id => tasks.find(value => value.id === id)).filter((value): value is Task => !!value).map(link)}</dd></>}
        {!!task.outputFiles.length && <><dt>{t('declaredFiles')}</dt><dd><ul className={css.pathList}>{task.outputFiles.map(file => <li key={file} className={css.mono}>{file}</li>)}</ul></dd></>}
        <dt>{t('attempt')}</dt><dd>{task.attempt}</dd>
        {task.startedAt && <><dt>{t('timeline')}</dt><dd>{formatTime(task.startedAt)}{task.finishedAt && ` → ${formatTime(task.finishedAt)}`}</dd></>}
      </dl>
    </Section>

    {!!handoffs.length && <Section title={t('relatedHandoffs')}>
      <ul className={css.miniTimeline}>{handoffs.map(message => <li key={message.id}>
        <p className={css.handoffMeta}><strong>{name(message.from)}</strong> → {name(message.to)} · <time dateTime={message.createdAt}>{formatTime(message.createdAt)}</time></p>
        <pre className={css.report}>{message.message}</pre>
      </li>)}</ul>
    </Section>}

    <details className={css.disclosure}>
      <summary>{t('executionInfo')}{!!task.nativeSessions.length && <small> · {t('sessionCount', { count: task.nativeSessions.length })}</small>}</summary>
      <div className={css.disclosureBody}>
        <p className={css.hint}>{t('nativeSessionHelp')}</p>
        {task.nativeSessions.map(session => <div key={`${session.id}-${session.attempt}`} className={css.session}>
          <p><strong>{t(session.engine)}</strong> · {t(session.continued ? 'continuedSession' : 'newSession')} · {t('attemptN', { n: session.attempt })}</p>
          <CopyLine text={resumeCommand(session)} t={t} />
          <p className={`${css.muted} ${css.mono}`}>{session.cwd}</p>
        </div>)}
        {!task.nativeSessions.length && <p className={css.muted}>{t('noSessions')}</p>}
        <h4>{t('assignment')}</h4>
        <pre className={css.report}>{task.assignment || task.instruction}</pre>
      </div>
    </details>
  </article>
}

/** Monospace command with a copy button. */
function CopyLine({ text, t }: { text: string; t: T }) {
  const [copied, setCopied] = useState(false)
  return <div className={css.copyLine}>
    <code>{text}</code>
    <button type="button" className={css.ghost} onClick={() => {
      void navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => { setCopied(false) }, 1500) })
    }}>{t(copied ? 'copied' : 'copy')}</button>
  </div>
}
