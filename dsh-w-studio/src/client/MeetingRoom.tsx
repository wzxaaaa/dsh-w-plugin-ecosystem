/** Meeting room: the user, as client, discusses requirements with invited employees, then turns minutes into a project. */
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { Employee, Meeting, MeetingMinutes, StudioState, StudioWorkspace } from '../types.ts'
import { Avatar, Busy, EngineTag } from './parts.tsx'
import { employeeOf, formatTime, resumeCommand, usePending, type Command, type T } from './ui.ts'
import css from './Studio.module.css'

/** Workspace meetings plus navigation into a created project. */
export interface MeetingRoomProps {
  state: StudioState
  workspace: StudioWorkspace
  busy: boolean
  error: string
  t: T
  command: Command
  onOpenProject: (id: string) => void
}
const statusKey = { open: 'meetingOpen', drafting: 'meetingDrafting', review: 'meetingReview', closed: 'meetingClosed' } as const

/** Meeting list beside the selected meeting's thread. */
export function MeetingRoom({ state, workspace, busy, error, t, command, onOpenProject }: MeetingRoomProps) {
  const meetings = state.meetings.filter(value => value.workspaceId === workspace.id)
  const [selected, setSelected] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const meeting = meetings.find(value => value.id === selected) ?? meetings.at(-1)
  const name = (id: string): string => employeeOf(state.employees, id)?.name ?? t('unknownEmployee')
  return <div className={css.workArea}>
    <section className={css.listPane} aria-label={t('meetingsTab')}>
      <div className={css.paneHead}>
        <div><h2>{t('meetingsTab')}</h2><p className={css.muted}>{t('meetingSummary', { open: meetings.filter(value => value.status !== 'closed').length, total: meetings.length })}</p></div>
        <button className={css.primary} onClick={() => { setCreating(true) }}>{t('newMeeting')}</button>
      </div>
      <ul className={css.roster}>
        {[...meetings].reverse().map(value => {
          const last = value.messages.at(-1)
          return <li key={value.id}><button className={css.meetingItem} aria-current={meeting?.id === value.id && !creating ? 'true' : undefined} onClick={() => { setSelected(value.id); setCreating(false) }}>
            <span className={css.meetingItemHead}><strong>{value.title}</strong><span className={css.badge} data-meeting={value.status}><i aria-hidden="true" />{t(statusKey[value.status])}</span></span>
            <span className={css.avatarStack}>{value.attendeeIds.map(id => <Avatar key={id} id={id} name={name(id)} size="sm" />)}</span>
            <small>{last ? `${last.from === 'user' ? t('user') : name(last.from)}：${last.message.slice(0, 60)}` : t('meetingNoMessages')}</small>
            {value.speaking && <small className={css.reason} data-kind="speaking">{t('speakingNow', { name: name(value.speaking) })}</small>}
          </button></li>
        })}
      </ul>
      {!meetings.length && <div className={css.emptyState}><strong>{t('noMeetingsTitle')}</strong><p>{t('noMeetings')}</p></div>}
      <p className={css.footnote}>{t('meetingHelp')}</p>
    </section>
    <div className={css.detailPane}>
      {creating || !meeting
        ? <MeetingForm state={state} workspace={workspace} busy={busy} error={error} t={t} command={command} first={!meetings.length}
          onDone={(id) => { setCreating(false); setSelected(id) }} />
        : <MeetingThread key={meeting.id} meeting={meeting} state={state} busy={busy} error={error} t={t} command={command} onOpenProject={onOpenProject} />}
    </div>
  </div>
}

interface MeetingFormProps {
  state: StudioState
  workspace: StudioWorkspace
  busy: boolean
  error: string
  t: T
  command: Command
  first: boolean
  /** Called with the created meeting id, or null when cancelled. */
  onDone: (id: string | null) => void
  meeting?: Meeting
}
/** Create a meeting, or edit the title, agenda, host, and attendees of an open one. */
function MeetingForm({ state, workspace, busy, error, t, command, first, onDone, meeting }: MeetingFormProps) {
  const enabled = state.employees.filter(employee => employee.enabled || meeting?.attendeeIds.includes(employee.id))
  const [title, setTitle] = useState(meeting?.title ?? '')
  const [agenda, setAgenda] = useState(meeting?.agenda ?? '')
  const [hostId, setHostId] = useState<string>(meeting?.hostId ?? enabled[0]?.id ?? '')
  const [attendees, setAttendees] = useState<string[]>(meeting?.attendeeIds ?? enabled.map(employee => employee.id))
  const [failed, setFailed] = useState(false)
  const { pending, run } = usePending()
  const id = useId()
  const chosen = [...new Set([hostId, ...attendees])].filter(Boolean)
  return <form className={css.editorCard} aria-labelledby={`${id}-title`} onSubmit={(event) => {
    event.preventDefault()
    const input = { title, agenda, hostId, attendeeIds: chosen }
    void run('save', () => command(meeting ? 'updateMeeting' : 'createMeeting', meeting ? { ...input, id: meeting.id } : { ...input, workspaceId: workspace.id })).then((ok) => {
      setFailed(!ok)
      if (!ok) return
      onDone(meeting ? meeting.id : null)
    })
  }}>
    <header className={css.detailHead}><div>
      <h2 id={`${id}-title`}>{t(meeting ? 'editAttendees' : 'newMeeting')}</h2>
      {!meeting && <p className={css.muted}>{t(first ? 'meetingIntro' : 'meetingHelp')}</p>}
    </div></header>
    <label className={css.field}><span>{t('meetingTitle')}</span><input required value={title} placeholder={t('meetingTitlePlaceholder')} onChange={(event) => { setTitle(event.target.value) }} /></label>
    <label className={css.field}><span>{t('agenda')}</span><textarea rows={3} value={agenda} placeholder={t('agendaPlaceholder')} onChange={(event) => { setAgenda(event.target.value) }} /></label>
    <label className={css.field}><span>{t('host')}</span><select required value={hostId} onChange={(event) => { setHostId(event.target.value) }}>
      {enabled.map(employee => <option key={employee.id} value={employee.id}>{employee.name}{employee.role && ` · ${employee.role}`}</option>)}
    </select><small className={css.muted}>{t('hostHelp')}</small></label>
    <fieldset className={css.teamPicker}>
      <legend>{t('attendees')} <small>· {t('selectedCount', { count: chosen.length })}</small></legend>
      {enabled.map(employee => {
        const isHost = employee.id === hostId
        const checked = isHost || attendees.includes(employee.id)
        return <label key={employee.id} data-checked={checked}>
          <input type="checkbox" checked={checked} disabled={isHost} onChange={(event) => {
            setAttendees(event.target.checked ? [...attendees, employee.id] : attendees.filter(value => value !== employee.id))
          }} />
          <span className={css.order}>{isHost ? '★' : ''}</span>
          <Avatar id={employee.id} name={employee.name} size="sm" />
          <span className={css.rosterText}><strong>{employee.name}</strong><small>{employee.role || t('noRole')}{isHost && ` · ${t('hostTag')}`}</small></span>
          <EngineTag engine={employee.engine} t={t} />
        </label>
      })}
      {!enabled.length && <p className={css.inlineError}>{t('noEnabledEmployees')}</p>}
    </fieldset>
    <footer className={css.formFooter}>
      <div className={css.actions}>
        <button className={css.primary} disabled={busy || !hostId}><Busy on={pending === 'save'} />{t(meeting ? 'saveAttendees' : 'startMeeting')}</button>
        {(meeting || !first) && <button type="button" className={css.ghost} onClick={() => { onDone(null) }}>{t('cancelAction')}</button>}
      </div>
      {failed && <p className={css.formStatus} data-state="error" role="alert">{error || t('failure')}</p>}
    </footer>
  </form>
}

interface MeetingThreadProps {
  meeting: Meeting
  state: StudioState
  busy: boolean
  error: string
  t: T
  command: Command
  onOpenProject: (id: string) => void
}
/** Group-chat thread with mention chips, live speaker indicator, and the minutes stage. */
function MeetingThread({ meeting, state, busy, error, t, command, onOpenProject }: MeetingThreadProps) {
  const [message, setMessage] = useState('')
  const [mentions, setMentions] = useState<string[]>([])
  const [editing, setEditing] = useState(false)
  const [confirmEnd, setConfirmEnd] = useState(false)
  const [failed, setFailed] = useState(false)
  const { pending, run } = usePending()
  const list = useRef<HTMLOListElement>(null)
  const stick = useRef(true)
  const employee = (id: string): Employee | undefined => employeeOf(state.employees, id)
  const name = (id: string): string => id === 'user' ? t('client') : employee(id)?.name ?? t('unknownEmployee')
  const project = meeting.projectId ? state.projects.find(value => value.id === meeting.projectId) : undefined
  const active = meeting.speaking !== null || meeting.queue.length > 0
  // A queued speaker is shown at once so sending never leaves a silent gap before the turn starts.
  const next = meeting.speaking ?? (meeting.status === 'drafting' ? meeting.hostId : meeting.queue[0])
  // Follow new messages only while the reader is already at the bottom of the thread.
  useLayoutEffect(() => {
    const node = list.current?.closest('main')
    if (node && stick.current) node.scrollTop = node.scrollHeight
  }, [meeting.messages.length, meeting.speaking])
  useEffect(() => {
    const node = list.current?.closest('main')
    if (!node) return
    const update = (): void => { stick.current = node.scrollHeight - node.scrollTop - node.clientHeight < 160 }
    node.addEventListener('scroll', update, { passive: true })
    return () => { node.removeEventListener('scroll', update) }
  }, [])
  const act = (key: string, action: string) => (): void => { void run(key, () => command(action, { id: meeting.id })).then((ok) => { setFailed(!ok) }) }
  const send = (): void => {
    if (!message.trim()) return
    stick.current = true
    void run('send', () => command('meetingMessage', { id: meeting.id, message, mentions })).then((ok) => {
      setFailed(!ok)
      if (ok) { setMessage(''); setMentions([]) }
    })
  }
  if (editing) return <MeetingForm state={state} workspace={state.workspaces.find(value => value.id === meeting.workspaceId)!} busy={busy} error={error} t={t}
    command={command} first={false} meeting={meeting} onDone={() => { setEditing(false) }} />
  return <article className={css.meetingCard} aria-labelledby={`meeting-${meeting.id}`}>
    <header className={css.meetingHead}>
      <div className={css.meetingTitle}>
        <h2 id={`meeting-${meeting.id}`}>{meeting.title}</h2>
        <span className={css.badge} data-meeting={meeting.status}><i aria-hidden="true" />{t(statusKey[meeting.status])}</span>
      </div>
      {meeting.agenda && <p className={css.agenda}>{meeting.agenda}</p>}
      <ul className={css.attendeeRow}>{meeting.attendeeIds.map(id => <li key={id} data-host={id === meeting.hostId}>
        <Avatar id={id} name={name(id)} size="sm" /><span>{name(id)}</span>{id === meeting.hostId && <em>{t('hostTag')}</em>}
      </li>)}</ul>
      <div className={css.actions}>
        {meeting.status === 'open' && <button className={css.primary} disabled={busy || active || !meeting.messages.length} title={active ? t('waitForSpeaker') : undefined} onClick={act('minutes', 'draftMinutes')}><Busy on={pending === 'minutes'} />{t('draftMinutes')}</button>}
        {meeting.status === 'open' && <button className={css.ghost} disabled={busy} onClick={() => { setEditing(true) }}>{t('editAttendees')}</button>}
        {active && <button className={css.ghostDanger} disabled={busy} onClick={act('stop', 'stopMeeting')}><Busy on={pending === 'stop'} />{t('stopSpeaking')}</button>}
        {meeting.status !== 'closed' && (confirmEnd
          ? <><button className={css.dangerSolid} disabled={busy} onClick={() => { setConfirmEnd(false); act('end', 'closeMeeting')() }}>{t('confirmEnd')}</button><button className={css.ghost} onClick={() => { setConfirmEnd(false) }}>{t('cancelAction')}</button></>
          : <button className={css.ghost} disabled={busy} onClick={() => { setConfirmEnd(true) }}>{t('endMeeting')}</button>)}
        {project && <button className={css.primary} onClick={() => { onOpenProject(project.id) }}>{t('viewProject')}</button>}
      </div>
    </header>

    {meeting.error && <div className={css.alert} role="alert"><p>{meeting.error}</p></div>}

    <ol className={css.chat} ref={list} aria-live="polite">
      {!meeting.messages.length && <li className={css.chatEmpty}>{t('meetingEmpty', { host: name(meeting.hostId) })}</li>}
      {meeting.messages.map((value) => {
        const own = value.from === 'user'
        const person = own ? undefined : employee(value.from)
        return <li key={value.id} className={css.bubbleRow} data-own={own}>
          {own ? <span className={css.avatar} data-tone="user" data-size="md" aria-hidden="true">{t('userInitial')}</span> : <Avatar id={value.from} name={person?.name} />}
          <div className={css.bubbleBody}>
            <p className={css.bubbleMeta}>
              <strong>{name(value.from)}</strong>
              {person?.role && <span>{person.role}</span>}
              {value.from === meeting.hostId && <em>{t('hostTag')}</em>}
              <time dateTime={value.createdAt}>{formatTime(value.createdAt)}</time>
            </p>
            <div className={css.bubble}>
              {!!value.mentions.length && <p className={css.mentionLine}>{value.mentions.map(id => <span key={id}>@{name(id)}</span>)}</p>}
              <p className={css.report}>{value.message}</p>
            </div>
            {value.nativeSession && <details className={css.sessionNote}><summary>{t(value.nativeSession.engine)} · {t('nativeSession')}</summary><code>{resumeCommand(value.nativeSession)}</code></details>}
          </div>
        </li>
      })}
      {next && <li className={css.bubbleRow}>
        <Avatar id={next} name={name(next)} />
        <div className={css.bubbleBody}><div className={css.typing} role="status">
          <span className={css.dots} aria-hidden="true"><i /><i /><i /></span>
          {t(meeting.status === 'drafting' ? 'draftingNow' : meeting.speaking ? 'speakingNow' : 'aboutToSpeak', { name: name(next) })}
          {meeting.queue.length > (meeting.speaking ? 0 : 1) && <small> · {t('upNext', { names: meeting.queue.slice(meeting.speaking ? 0 : 1).map(name).join('、') })}</small>}
        </div></div>
      </li>}
    </ol>

    {meeting.status === 'open' && <form className={css.chatComposer} onSubmit={(event) => { event.preventDefault(); send() }}>
      <div className={css.mentionChips} role="group" aria-label={t('mention')}>
        <span className={css.muted}>{t('mention')}</span>
        {meeting.attendeeIds.map(id => <button type="button" key={id} className={css.filter} aria-pressed={mentions.includes(id)}
          onClick={() => { setMentions(mentions.includes(id) ? mentions.filter(value => value !== id) : [...mentions, id]) }}>@{name(id)}</button>)}
      </div>
      <textarea aria-label={t('composerPlaceholder')} placeholder={t('composerPlaceholder')} rows={3} value={message}
        onChange={(event) => { setMessage(event.target.value) }}
        onKeyDown={(event) => { if (event.key === 'Enter' && (event.ctrlKey || event.metaKey) && !event.nativeEvent.isComposing) { event.preventDefault(); send() } }} />
      <div className={css.composerFoot}>
        <p className={css.muted}>{mentions.length ? t('mentionReply', { names: mentions.map(name).join('、') }) : t('hostReply', { name: name(meeting.hostId) })} · {t('sendShortcut')}</p>
        <button className={css.primary} disabled={busy || !message.trim()}><Busy on={pending === 'send'} />{t('sendMessage')}</button>
      </div>
      {failed && <p className={css.formStatus} data-state="error" role="alert">{error || t('failure')}</p>}
    </form>}
    {meeting.status === 'review' && meeting.minutes && <MinutesEditor meeting={meeting} minutes={meeting.minutes} state={state} busy={busy} error={error} t={t} command={command} />}
    {meeting.status === 'closed' && meeting.minutes && <MinutesView minutes={meeting.minutes} name={name} t={t} />}
    {failed && meeting.status !== 'open' && <p className={css.formStatus} data-state="error" role="alert">{error || t('failure')}</p>}
  </article>
}

interface MinutesEditorProps {
  meeting: Meeting
  minutes: MeetingMinutes
  state: StudioState
  busy: boolean
  error: string
  t: T
  command: Command
}
/** Editable host minutes; confirming creates a project whose tasks run in the listed order. */
function MinutesEditor({ meeting, minutes, state, busy, error, t, command }: MinutesEditorProps) {
  const [draft, setDraft] = useState({ ...minutes, decisionsText: minutes.decisions.join('\n') })
  const [cwd, setCwd] = useState('')
  const [sessionMode, setSessionMode] = useState<'employee-project' | 'new-task'>('employee-project')
  const [failed, setFailed] = useState(false)
  const [saved, setSaved] = useState(false)
  const { pending, run } = usePending()
  const id = useId()
  const candidates = state.employees.filter(employee => employee.enabled && meeting.attendeeIds.includes(employee.id))
  const workspace = state.workspaces.find(value => value.id === meeting.workspaceId)
  const value = (): MeetingMinutes => ({ summary: draft.summary, projectName: draft.projectName, objective: draft.objective,
    acceptanceCriteria: draft.acceptanceCriteria, tasks: draft.tasks, decisions: draft.decisionsText.split('\n').map(line => line.trim()).filter(Boolean) })
  const setTask = (index: number, patch: Partial<MeetingMinutes['tasks'][number]>): void => {
    setSaved(false)
    setDraft({ ...draft, tasks: draft.tasks.map((task, position) => position === index ? { ...task, ...patch } : task) })
  }
  const move = (index: number, offset: number): void => {
    const tasks = [...draft.tasks]
    const [task] = tasks.splice(index, 1)
    if (task) tasks.splice(index + offset, 0, task)
    setDraft({ ...draft, tasks })
  }
  const field = (key: 'summary' | 'objective' | 'acceptanceCriteria' | 'decisionsText', label: Parameters<T>[0], rows: number) => <label className={css.field}>
    <span>{t(label)}</span><textarea rows={rows} value={draft[key]} onChange={(event) => { setSaved(false); setDraft({ ...draft, [key]: event.target.value }) }} />
  </label>
  const complete = !!draft.projectName.trim() && !!draft.objective.trim() && draft.tasks.length > 0 && draft.tasks.every(task => task.title.trim() && task.instruction.trim())
  return <section className={css.minutes} aria-labelledby={`${id}-title`}>
    <header className={css.blockHead}><h2 id={`${id}-title`}>{t('minutes')}</h2><span className={css.muted}>{t('minutesHelp')}</span></header>
    {field('summary', 'summary', 4)}
    {field('decisionsText', 'decisions', 3)}
    <div className={css.fieldPair}>
      <label className={css.field}><span>{t('projectName')}</span><input required value={draft.projectName} onChange={(event) => { setSaved(false); setDraft({ ...draft, projectName: event.target.value }) }} /></label>
      <label className={css.field}><span>{t('projectDirectory')}</span><input className={css.mono} placeholder={workspace?.path} value={cwd} onChange={(event) => { setCwd(event.target.value) }} /></label>
    </div>
    {field('objective', 'objective', 2)}
    {field('acceptanceCriteria', 'acceptanceCriteria', 3)}
    <fieldset className={css.minutesTasks}>
      <legend>{t('minutesTasks')}</legend>
      {draft.tasks.map((task, index) => <div key={index} className={css.minutesTask}>
        <span className={css.step}>{index + 1}</span>
        <div className={css.minutesTaskFields}>
          <div className={css.fieldPair}>
            <label className={css.field}><span>{t('assignee')}</span><select value={task.employeeId} onChange={(event) => { setTask(index, { employeeId: event.target.value as typeof task.employeeId }) }}>
              {candidates.map(employee => <option key={employee.id} value={employee.id}>{employee.name}{employee.role && ` · ${employee.role}`}</option>)}
            </select></label>
            <label className={css.field}><span>{t('taskTitle')}</span><input required value={task.title} onChange={(event) => { setTask(index, { title: event.target.value }) }} /></label>
          </div>
          <label className={css.field}><span>{t('instruction')}</span><textarea required rows={2} value={task.instruction} onChange={(event) => { setTask(index, { instruction: event.target.value }) }} /></label>
        </div>
        <div className={css.minutesTaskActions}>
          <button type="button" className={css.ghost} aria-label={t('moveUp')} disabled={index === 0} onClick={() => { move(index, -1) }}>↑</button>
          <button type="button" className={css.ghost} aria-label={t('moveDown')} disabled={index === draft.tasks.length - 1} onClick={() => { move(index, 1) }}>↓</button>
          <button type="button" className={css.ghostDanger} aria-label={t('removeTask')} onClick={() => { setDraft({ ...draft, tasks: draft.tasks.filter((_, position) => position !== index) }) }}>×</button>
        </div>
      </div>)}
      {!draft.tasks.length && <p className={css.emptyInline}>{t('noMinutesTasks')}</p>}
      <button type="button" className={css.ghost} disabled={!candidates.length} onClick={() => {
        const first = candidates[0]
        if (first) setDraft({ ...draft, tasks: [...draft.tasks, { employeeId: first.id, title: '', instruction: '' }] })
      }}>+ {t('addMinutesTask')}</button>
    </fieldset>
    <fieldset className={css.optionCards}>
      <legend>{t('sessionMode')}</legend>
      {(['employee-project', 'new-task'] as const).map(mode => <label key={mode}>
        <input type="radio" name={`${id}-session`} checked={sessionMode === mode} onChange={() => { setSessionMode(mode) }} />
        <span><strong>{t(mode === 'employee-project' ? 'employeeSession' : 'freshSession')}</strong><small>{t(mode === 'employee-project' ? 'employeeSessionHelp' : 'freshSessionHelp')}</small></span>
      </label>)}
    </fieldset>
    <footer className={css.formFooter}>
      <div className={css.actions}>
        <button className={css.primary} disabled={busy || !complete} onClick={() => {
          void run('project', () => command('meetingProject', { id: meeting.id, minutes: value(), cwd, sessionMode })).then((ok) => { setFailed(!ok) })
        }}><Busy on={pending === 'project'} />{t('createFromMinutes')}</button>
        <button className={css.ghost} disabled={busy} onClick={() => {
          void run('save', () => command('saveMinutes', { id: meeting.id, minutes: value() })).then((ok) => { setFailed(!ok); setSaved(ok) })
        }}><Busy on={pending === 'save'} />{t('saveMinutes')}</button>
        <button className={css.ghost} disabled={busy} onClick={() => { void run('resume', () => command('resumeMeeting', { id: meeting.id })).then((ok) => { setFailed(!ok) }) }}>{t('resumeMeeting')}</button>
      </div>
      <p className={css.formStatus} role="status" data-state={failed ? 'error' : saved ? 'ok' : 'idle'}>
        {failed ? error || t('failure') : saved ? t('settingsSaved') : complete ? '' : t('minutesIncomplete')}
      </p>
    </footer>
  </section>
}

/** Read-only minutes of an ended meeting. */
function MinutesView({ minutes, name, t }: { minutes: MeetingMinutes; name: (id: string) => string; t: T }) {
  return <section className={css.minutes}>
    <header className={css.blockHead}><h2>{t('minutes')}</h2></header>
    <dl className={css.facts}>
      <dt>{t('summary')}</dt><dd><p className={css.report}>{minutes.summary}</p></dd>
      {!!minutes.decisions.length && <><dt>{t('decisionsShort')}</dt><dd><ul className={css.pathList}>{minutes.decisions.map((value, index) => <li key={index}>· {value}</li>)}</ul></dd></>}
      <dt>{t('projectName')}</dt><dd>{minutes.projectName}</dd>
      <dt>{t('objective')}</dt><dd><p className={css.report}>{minutes.objective}</p></dd>
      {minutes.acceptanceCriteria && <><dt>{t('acceptanceCriteria')}</dt><dd><p className={css.report}>{minutes.acceptanceCriteria}</p></dd></>}
      {!!minutes.tasks.length && <><dt>{t('minutesTasks')}</dt><dd><ol className={css.pathList}>{minutes.tasks.map((task, index) => <li key={index}><b>#{index + 1}</b> {task.title} · {name(task.employeeId)}</li>)}</ol></dd></>}
    </dl>
  </section>
}
