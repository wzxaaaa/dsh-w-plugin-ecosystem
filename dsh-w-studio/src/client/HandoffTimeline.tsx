/** Project handoffs as a timeline of sender, recipient, related task, and time, with a composer. */
import { useState } from 'react'
import type { Project, StudioState } from '../types.ts'
import { Avatar, Busy } from './parts.tsx'
import { employeeOf, formatTime, usePending, type Command, type T } from './ui.ts'
import css from './Studio.module.css'

/** Handoffs of one project plus a jump into the task board. */
export interface HandoffTimelineProps {
  state: StudioState
  project: Project
  busy: boolean
  error: string
  t: T
  command: Command
  onOpenTask: (id: string) => void
}

/** Only human-readable final messages appear here; native reasoning is never part of the record. */
export function HandoffTimeline({ state, project, busy, error, t, command, onOpenTask }: HandoffTimelineProps) {
  const [message, setMessage] = useState('')
  const [recipient, setRecipient] = useState('team')
  const [person, setPerson] = useState('all')
  const [failed, setFailed] = useState(false)
  const { pending, run } = usePending()
  const tasks = state.tasks.filter(task => task.projectId === project.id)
  const all = state.messages.filter(value => value.projectId === project.id)
  const shown = person === 'all' ? all : all.filter(value => value.from === person || value.to === person || (value.to === 'team' && person !== 'user'))
  const name = (id: string): string => id === 'user' ? t('user') : id === 'team' ? t('everyone') : employeeOf(state.employees, id)?.name ?? t('unknownEmployee')
  const people = [...new Set(all.flatMap(value => [value.from, value.to]))].filter(id => id !== 'team')
  return <div className={css.handoffs}>
    <form className={css.composer} onSubmit={(event) => {
      event.preventDefault()
      void run('send', () => command('message', { projectId: project.id, to: recipient, message })).then((ok) => { setFailed(!ok); if (ok) setMessage('') })
    }}>
      <div className={css.composerHead}>
        <h2>{t('newInstruction')}</h2>
        <label className={css.inlineField}><span>{t('to')}</span><select value={recipient} onChange={(event) => { setRecipient(event.target.value) }}>
          <option value="team">{t('everyone')}</option>
          {state.employees.map(employee => <option key={employee.id} value={employee.id}>{employee.name}{employee.role && ` · ${employee.role}`}</option>)}
        </select></label>
      </div>
      <textarea aria-label={t('message')} placeholder={t('message')} required rows={3} value={message} onChange={(event) => { setMessage(event.target.value) }} />
      <div className={css.composerFoot}>
        <p className={css.muted}>{t('noReasoning')}</p>
        <button className={css.primary} disabled={busy || !message.trim()}><Busy on={pending === 'send'} />{t('send')}</button>
      </div>
      {failed && <p className={css.formStatus} data-state="error" role="alert">{error || t('failure')}</p>}
    </form>

    <div className={css.timelineHead}>
      <h2>{t('messages')} <small className={css.muted}>· {all.length}</small></h2>
      {people.length > 1 && <label className={css.inlineField}><span>{t('filterPerson')}</span><select value={person} onChange={(event) => { setPerson(event.target.value) }}>
        <option value="all">{t('everyone')}</option>
        {people.map(id => <option key={id} value={id}>{name(id)}</option>)}
      </select></label>}
    </div>
    <ol className={css.timeline}>
      {shown.map((value) => {
        const task = value.taskId ? tasks.find(item => item.id === value.taskId) : undefined
        return <li key={value.id} data-from={value.from === 'user' ? 'user' : 'employee'}>
          <span className={css.timelineDot}>{value.from === 'user' ? <span className={css.avatar} data-tone="user" data-size="md" aria-hidden="true">{t('userInitial')}</span> : <Avatar id={value.from} name={name(value.from)} />}</span>
          <div className={css.timelineCard}>
            <p className={css.handoffMeta}>
              <strong>{name(value.from)}</strong><span aria-hidden="true">→</span><span>{name(value.to)}</span>
              <time dateTime={value.createdAt}>{formatTime(value.createdAt)}</time>
            </p>
            {task && <button className={css.taskChip} onClick={() => { onOpenTask(task.id) }}>#{tasks.indexOf(task) + 1} {task.title}</button>}
            <pre className={css.report}>{value.message}</pre>
          </div>
        </li>
      })}
    </ol>
    {!all.length && <div className={css.emptyState}><p>{t('noMessages')}</p></div>}
  </div>
}
