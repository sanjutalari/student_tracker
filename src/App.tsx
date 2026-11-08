import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight, BookOpen, Bookmark, CalendarDays, Check, CheckCircle2, ChevronRight, Clock3,
  Flame, GraduationCap, ListTodo, Mic, Pause, Play, Plus, RotateCcw, Sparkles,
  Target, Timer, TrendingUp, UserRound, Volume2, X, Zap, Bell,
} from 'lucide-react';

type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
type ClassItem = { id: string; day: Day; subject: string; start: string; end: string };
type Track = { id: string; name: string; reason: string; hours: number; spentMinutes: number; modules: string[]; completed: string[] };
type Task = { id: string; title: string; due: string; reminderTime?: string; done: boolean };
type Profile = { name: string; goal: string; targetDate: string; skillMinutes: number; classes: ClassItem[]; tracks: Track[]; tasks: Task[]; bookmarkedTrackIds: string[]; activityDates: string[]; setupComplete: boolean };
type Screen = 'overview' | 'planner' | 'roadmap' | 'progress' | 'coach' | 'tasks' | 'profile';
const DAYS: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const STORE_KEY = 'vignan-student-tracker-v2';
const blankProfile: Profile = { name: '', goal: '', targetDate: '', skillMinutes: 60, classes: [], tracks: [], tasks: [], bookmarkedTrackIds: [], activityDates: [], setupComplete: false };
const localDate = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

function roadmapFor(goal: string): Track[] {
  const text = goal.toLowerCase();
  const tracks = text.includes('placement') || text.includes('job') || text.includes('interview')
    ? [
        { name: 'Data structures & algorithms', reason: 'Build interview problem solving', hours: 30, modules: ['Complexity & arrays', 'Linked lists, stacks & queues', 'Trees and graphs', 'Dynamic programming'] },
        { name: 'Interview communication', reason: 'Explain your thinking clearly', hours: 12, modules: ['Project walkthrough', 'Behavioral stories', 'Mock interview practice'] },
        { name: 'Portfolio project', reason: 'Show applied engineering skills', hours: 18, modules: ['Choose a real problem', 'Build the core flow', 'Test and document', 'Publish your project'] },
      ]
    : text.includes('web') || text.includes('full stack') || text.includes('website')
      ? [
          { name: 'Web foundations', reason: 'Create accessible, responsive interfaces', hours: 16, modules: ['HTML structure', 'CSS layouts', 'JavaScript fundamentals'] },
          { name: 'React development', reason: 'Build interactive user experiences', hours: 24, modules: ['Components & state', 'Forms and validation', 'Data loading & errors'] },
          { name: 'Backend & deployment', reason: 'Ship a complete working product', hours: 24, modules: ['API design', 'Database basics', 'Security & deployment'] },
        ]
      : text.includes('data') || text.includes('ai') || text.includes('machine learning')
        ? [
            { name: 'Python & data foundations', reason: 'Prepare and understand real datasets', hours: 20, modules: ['Python essentials', 'NumPy & Pandas', 'Charts and exploration'] },
            { name: 'Machine learning', reason: 'Train and evaluate useful models', hours: 28, modules: ['Supervised learning', 'Model evaluation', 'Feature engineering'] },
            { name: 'Applied AI project', reason: 'Turn your learning into a demonstrable result', hours: 16, modules: ['Frame the problem', 'Build a baseline', 'Evaluate & present'] },
          ]
        : [
            { name: 'Core concepts', reason: 'Strengthen the foundations behind your goal', hours: 18, modules: ['Map the key concepts', 'Study core principles', 'Check your understanding'] },
            { name: 'Guided practice', reason: 'Build fluency by applying what you learn', hours: 24, modules: ['Worked examples', 'Independent practice', 'Review mistakes'] },
            { name: 'Capstone project', reason: 'Demonstrate your skills in a finished project', hours: 20, modules: ['Scope a small project', 'Build and refine', 'Present your result'] },
          ];
  return tracks.map((track, index) => ({ id: `track-${index + 1}`, ...track, spentMinutes: 0, completed: [] }));
}

function loadProfile(): Profile {
  try {
    const saved = localStorage.getItem(STORE_KEY);
    if (!saved) return blankProfile;
    const parsed = JSON.parse(saved);
    return { ...blankProfile, ...parsed, bookmarkedTrackIds: Array.isArray(parsed.bookmarkedTrackIds) ? parsed.bookmarkedTrackIds : [], activityDates: Array.isArray(parsed.activityDates) ? parsed.activityDates : [] };
  } catch { return blankProfile; }
}

function suggestedSkillWindow(classes: ClassItem[], day: Day, minutes: number) {
  const latestEnd = classes.filter((item) => item.day === day).reduce((latest, item) => Math.max(latest, Number(item.end.slice(0, 2)) * 60 + Number(item.end.slice(3, 5))), 0);
  const startAt = latestEnd ? Math.min(latestEnd + 30, 22 * 60) : 16 * 60;
  const endAt = Math.min(startAt + minutes, 23 * 60);
  const clock = (time: number) => `${String(Math.floor(time / 60)).padStart(2, '0')}:${String(time % 60).padStart(2, '0')}`;
  return `${clock(startAt)}–${clock(endAt)}`;
}

function App() {
  const [profile, setProfile] = useState<Profile>(loadProfile);
  const [screen, setScreen] = useState<Screen>('overview');
  const [day, setDay] = useState<Day>(DAYS[(new Date().getDay() + 6) % 7]);
  const [notice, setNotice] = useState('');
  const [newClass, setNewClass] = useState({ day: 'Monday' as Day, subject: '', start: '09:00', end: '10:00' });
  const [newTask, setNewTask] = useState('');
  const [newTaskDue, setNewTaskDue] = useState(localDate());
  const [newTaskReminder, setNewTaskReminder] = useState('18:00');
  const [activeTrack, setActiveTrack] = useState('track-1');
  const [sessionMinutes, setSessionMinutes] = useState('30');
  const [sessionTopic, setSessionTopic] = useState('');
  const [sessionOpen, setSessionOpen] = useState(false);
  const [coachQuestion, setCoachQuestion] = useState('');
  const [coachMessages, setCoachMessages] = useState<{ role: 'student' | 'coach'; text: string }[]>([]);
  const [coachBusy, setCoachBusy] = useState(false);
  const [setupOriginalGoal, setSetupOriginalGoal] = useState('');
  const [sessionRunning, setSessionRunning] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [voiceListening, setVoiceListening] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(profile)); }
    catch { setNotice('Your browser could not save this update. Check its available storage.'); }
  }, [profile]);
  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(''), 3200);
    return () => window.clearTimeout(timeout);
  }, [notice]);
  useEffect(() => {
    if (!sessionRunning) return;
    const timer = window.setInterval(() => setSessionSeconds((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(timer);
  }, [sessionRunning]);

  const totalMinutes = profile.tracks.reduce((sum, track) => sum + track.spentMinutes, 0);
  const totalRoadmapHours = profile.tracks.reduce((sum, track) => sum + track.hours, 0);
  const completedModules = profile.tracks.reduce((sum, track) => sum + track.completed.length, 0);
  const allModules = profile.tracks.reduce((sum, track) => sum + track.modules.length, 0);
  const weeklyProgress = totalRoadmapHours ? Math.min(100, Math.round(totalMinutes / (totalRoadmapHours * 60) * 100)) : 0;
  const studyStreak = useMemo(() => {
    const dates = new Set(profile.activityDates);
    let streak = 0;
    const cursor = new Date();
    if (!dates.has(localDate(cursor))) cursor.setDate(cursor.getDate() - 1);
    while (dates.has(localDate(cursor))) { streak += 1; cursor.setDate(cursor.getDate() - 1); }
    return streak;
  }, [profile.activityDates]);
  const todayClasses = useMemo(() => profile.classes.filter((item) => item.day === day).sort((a, b) => a.start.localeCompare(b.start)), [profile.classes, day]);
  const skillWindow = suggestedSkillWindow(profile.classes, day, profile.skillMinutes);

  const update = (changes: Partial<Profile>) => setProfile((current) => ({ ...current, ...changes }));
  const saveSetup = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile.name.trim() || !profile.goal.trim()) return;
    if (!profile.classes.length) { setNotice('Add at least one college class so Aura can plan around your timetable.'); return; }
    const tracks = setupOriginalGoal && setupOriginalGoal !== profile.goal ? roadmapFor(profile.goal) : profile.tracks.length ? profile.tracks : roadmapFor(profile.goal);
    update({ name: profile.name.trim(), goal: profile.goal.trim(), tracks, setupComplete: true });
    setSetupOriginalGoal('');
    setNotice('Your learning plan is ready. You can adjust it any time.');
  };
  const addClass = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newClass.subject.trim() || newClass.end <= newClass.start) return;
    update({ classes: [...profile.classes, { ...newClass, subject: newClass.subject.trim(), id: crypto.randomUUID() }] });
    setNewClass((current) => ({ ...current, subject: '' }));
  };
  const addTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTask.trim()) return;
    update({ tasks: [{ id: crypto.randomUUID(), title: newTask.trim(), due: newTaskDue, reminderTime: newTaskReminder, done: false }, ...profile.tasks] });
    setNewTask('');
  };
  const toggleTask = (id: string) => update({ tasks: profile.tasks.map((task) => task.id === id ? { ...task, done: !task.done } : task) });
  const toggleModule = (trackId: string, module: string) => update({ tracks: profile.tracks.map((track) => track.id !== trackId ? track : { ...track, completed: track.completed.includes(module) ? track.completed.filter((item) => item !== module) : [...track.completed, module] }) });
  const recordSession = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const minutes = Number(sessionMinutes);
    if (!minutes || minutes < 5 || minutes > 240 || !sessionTopic.trim()) return;
    update({ tracks: profile.tracks.map((track) => track.id === activeTrack ? { ...track, spentMinutes: track.spentMinutes + minutes } : track), activityDates: [...new Set([...profile.activityDates, localDate()])] });
    setSessionOpen(false);
    setSessionTopic('');
    setNotice(`${minutes} minutes added to your learning progress.`);
  };
  const saveTimedSession = () => {
    const minutes = Math.floor(sessionSeconds / 60);
    if (minutes < 1) { setNotice('Study for at least one minute before saving a session.'); return; }
    update({ tracks: profile.tracks.map((track) => track.id === activeTrack ? { ...track, spentMinutes: track.spentMinutes + minutes } : track), activityDates: [...new Set([...profile.activityDates, localDate()])] });
    setSessionRunning(false);
    setSessionSeconds(0);
    setNotice(`${minutes} minutes added to your learning progress.`);
  };
  const toggleBookmark = (trackId: string) => update({ bookmarkedTrackIds: profile.bookmarkedTrackIds.includes(trackId) ? profile.bookmarkedTrackIds.filter((id) => id !== trackId) : [...profile.bookmarkedTrackIds, trackId] });
  const startVoiceInput = (onText: (value: string) => void) => {
    type Recognition = { lang: string; interimResults: boolean; onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null; onerror: (() => void) | null; onend: (() => void) | null; start: () => void };
    const speechWindow = window as Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
    const SpeechRecognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) { setNotice('Voice input is not supported by this browser.'); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = navigator.language || 'en-US';
    recognition.interimResults = false;
    recognition.onresult = (event) => { const transcript = event.results[0]?.[0]?.transcript; if (transcript) onText(transcript); };
    recognition.onerror = () => { setVoiceListening(false); setNotice('Voice input ended. You can type your note instead.'); };
    recognition.onend = () => setVoiceListening(false);
    setVoiceListening(true);
    recognition.start();
  };
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) { setNotice('Read aloud is not supported by this browser.'); return; }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  };
  const askCoach = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const prompt = coachQuestion.trim();
    if (!prompt || coachBusy) return;
    setCoachQuestion('');
    setCoachMessages((messages) => [...messages, { role: 'student', text: prompt }]);
    setCoachBusy(true);
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, context: { goal: profile.goal, skillMinutes: profile.skillMinutes, classesToday: profile.classes.filter((item) => item.day === day), tracks: profile.tracks.map(({ name, modules, completed }) => ({ name, modules, completed })), openTasks: profile.tasks.filter((task) => !task.done).map((task) => task.title) } }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The coach could not answer right now.');
      setCoachMessages((messages) => [...messages, { role: 'coach', text: data.reply }]);
    } catch (error) {
      setCoachMessages((messages) => [...messages, { role: 'coach', text: error instanceof Error ? error.message : 'The coach could not answer right now.' }]);
    } finally { setCoachBusy(false); }
  };

  if (!profile.setupComplete) return <Setup profile={profile} onChange={update} onSubmit={saveSetup} />;

  return (
    <div className="app-shell min-h-screen text-white">
      <header className="app-header">
        <div className="header-inner">
          <a className="brand" href="#home" onClick={(event) => { event.preventDefault(); setScreen('overview'); }} aria-label="Student Tracker home">
            <span className="brand-mark"><GraduationCap size={21} /></span><span><strong>Trackwell</strong><small>Student learning tracker</small></span>
          </a>
          <nav aria-label="Main navigation" className="desktop-nav">
            {([['overview', 'Learn'], ['progress', 'Progress'], ['planner', 'Flow'], ['coach', 'AI Mentor'], ['tasks', 'Tasks'], ['profile', 'Profile']] as const).map(([key, label]) => <button key={key} className={`nav-link ${screen === key ? 'active' : ''}`} onClick={() => setScreen(key)}>{label}</button>)}
          </nav>
          <div className="header-actions"><button className="notification-button" aria-label={`${profile.tasks.filter((task) => !task.done && task.due <= localDate()).length} tasks due or overdue`} title="Open tasks and reminders" onClick={() => setScreen('tasks')}><Bell size={17} />{profile.tasks.some((task) => !task.done && task.due <= localDate()) && <span />}</button><button className="profile-chip" onClick={() => setScreen('profile')}><span className="avatar">{profile.name.slice(0, 1).toUpperCase()}</span><span>{profile.name}</span><UserRound size={16} /></button></div>
        </div>
      </header>

      <main className="page-wrap">
        {screen === 'overview' && <>
          <section className="welcome-row"><div><p className="eyebrow">YOUR LEARNING SPACE</p><h1>Good to see you, {profile.name.split(' ')[0]}.</h1><p className="subhead">A clear plan for your classes, your goal, and the time you put in.</p></div><button className="primary-button" onClick={() => setScreen('planner')}><CalendarDays size={17} /> View my week</button></section>
          <section className="goal-strip"><div className="goal-icon"><Target size={22} /></div><div className="goal-copy"><span>Your goal</span><strong>{profile.goal}</strong><small>{profile.targetDate ? `Target date · ${new Date(`${profile.targetDate}T00:00:00`).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}` : 'Your roadmap adapts as you make progress'}</small></div><button className="text-button" onClick={() => setScreen('roadmap')}>Open learning path <ArrowRight size={15} /></button></section>
          <section className="aura-banner"><span className="aura-avatar"><Sparkles size={23} /></span><div><strong>Aura, your study agent</strong><span>Plan tonight’s study, ask about a topic, or get a practice quiz grounded in your goal and timetable.</span></div><button className="primary-button" onClick={() => setScreen('coach')}>Ask Aura <ArrowRight size={15} /></button></section>
          <section className="stats-grid" aria-label="Learning summary">
            <Stat icon={<Clock3 size={18} />} label="Learning time" value={`${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`} note="time you have logged" />
            <Stat icon={<TrendingUp size={18} />} label="Roadmap progress" value={`${weeklyProgress}%`} note={`${completedModules} of ${allModules} steps completed`} />
            <Stat icon={<CheckCircle2 size={18} />} label="To do" value={`${profile.tasks.filter((task) => !task.done).length}`} note="open personal study tasks" />
            <Stat icon={<Flame size={18} />} label="Study streak" value={`${studyStreak} day${studyStreak === 1 ? '' : 's'}`} note="days with logged learning" />
          </section>
          <div className="content-grid">
            <section className="panel schedule-panel"><div className="section-heading"><div><p className="eyebrow">YOUR COLLEGE DAY</p><h2>Today’s timetable</h2></div><button className="quiet-button" onClick={() => setScreen('planner')}>Edit timetable <ChevronRight size={15} /></button></div>
              <DayPicker day={day} onSelect={setDay} />
              {todayClasses.length ? <div className="timeline">{todayClasses.map((item, index) => <div className="timeline-item" key={item.id}><div className="time-col">{item.start}<span>{item.end}</span></div><div className={`timeline-dot ${index === 0 ? 'current' : ''}`} /><div className="class-detail"><strong>{item.subject}</strong><span>{item.day} class</span></div></div>)}</div> : <div className="empty-state"><CalendarDays size={22} /><strong>No classes added for {day}</strong><span>Add your college timetable so your study plan fits around it.</span><button className="text-button" onClick={() => setScreen('planner')}>Add classes <ArrowRight size={15} /></button></div>}
            </section>
            <section className="panel focus-panel"><div className="section-heading"><div><p className="eyebrow">DAILY SKILL HOUR · {day.toUpperCase()}</p><h2>Build toward your goal</h2></div><span className="round-icon amber"><Zap size={18} /></span></div><p className="panel-description">Your plan reserves <b>{profile.skillMinutes} minutes</b> a day for focused skill practice. Suggested time today: <b>{skillWindow}</b>.</p>
              {profile.tracks.slice(0, 2).map((track, index) => <div className="track-preview" key={track.id}><span className={`track-index tint-${index}`}>{index + 1}</span><div><strong>{track.name}</strong><small>{track.reason}</small></div><span className="track-hours">{track.hours}h</span></div>)}
              <button className="primary-button full-button" onClick={() => { setActiveTrack(profile.tracks[0]?.id ?? ''); setSessionOpen(true); }}><Timer size={16} /> Log a learning session</button>
            </section>
          </div>
          <section className="panel task-panel"><div className="section-heading"><div><p className="eyebrow">KEEP MOVING</p><h2>Homework & study reminders</h2></div></div><form className="add-task" onSubmit={addTask}><label className="sr-only" htmlFor="new-task">Add homework or a study task</label><input id="new-task" value={newTask} onChange={(event) => setNewTask(event.target.value)} placeholder="Add homework or a study task" /><label className="sr-only" htmlFor="new-task-due">Due date</label><input id="new-task-due" type="date" value={newTaskDue} onChange={(event) => setNewTaskDue(event.target.value)} /><button type="submit" aria-label="Add task"><Plus size={17} /></button></form>{profile.tasks.length ? <div className="task-list">{profile.tasks.map((task) => <button key={task.id} className={`task-row ${task.done ? 'done' : ''}`} onClick={() => toggleTask(task.id)}><span className="check-circle">{task.done && <Check size={13} />}</span><span className="task-title">{task.title}<small className="task-due">Due {new Date(`${task.due}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</small></span><small>{task.done ? 'Done' : 'Mark complete'}</small></button>)}</div> : <p className="muted-copy">Add assignments, revision, and practice tasks you want to remember.</p>}</section>
        </>}

        {screen === 'planner' && <><PageTitle eyebrow="MAKE SPACE FOR LEARNING" title="Your week, at a glance" description="College, revision, breaks, and skill practice in one student-owned plan." /><section className="panel"><div className="section-heading"><div><p className="eyebrow">COLLEGE TIMETABLE</p><h2>Classes by day</h2></div><span className="round-icon"><CalendarDays size={18} /></span></div><DayPicker day={day} onSelect={setDay} /><div className="class-list">{todayClasses.map((item) => <div className="class-row" key={item.id}><span className="class-time">{item.start} – {item.end}</span><strong>{item.subject}</strong><button aria-label={`Remove ${item.subject}`} onClick={() => update({ classes: profile.classes.filter((entry) => entry.id !== item.id) })}><X size={15} /></button></div>)}{!todayClasses.length && <p className="muted-copy">No classes for {day} yet.</p>}</div><form className="class-form" onSubmit={addClass}><label>Day<select value={newClass.day} onChange={(event) => setNewClass({ ...newClass, day: event.target.value as Day })}>{DAYS.map((item) => <option key={item}>{item}</option>)}</select></label><label>Class or subject<input required maxLength={80} value={newClass.subject} onChange={(event) => setNewClass({ ...newClass, subject: event.target.value })} placeholder="e.g. Data structures" /></label><label>Starts<input required type="time" value={newClass.start} onChange={(event) => setNewClass({ ...newClass, start: event.target.value })} /></label><label>Ends<input required type="time" value={newClass.end} onChange={(event) => setNewClass({ ...newClass, end: event.target.value })} /></label><button className="primary-button" type="submit"><Plus size={16} /> Add class</button></form></section><section className="panel timer-panel"><div className="timer-head"><span className="round-icon amber"><Timer size={19} /></span><div><p className="eyebrow">FOCUS SESSION · SUGGESTED {skillWindow}</p><h2>{profile.tracks.find((track) => track.id === activeTrack)?.name || 'Choose a learning track'}</h2><span>Work on one roadmap lesson during your {profile.skillMinutes}-minute skill hour.</span></div></div><div className="timer-display">{String(Math.floor(sessionSeconds / 3600)).padStart(2, '0')}:{String(Math.floor((sessionSeconds % 3600) / 60)).padStart(2, '0')}:{String(sessionSeconds % 60).padStart(2, '0')}</div><div className="timer-actions"><button className="primary-button" onClick={() => setSessionRunning((running) => !running)}>{sessionRunning ? <Pause size={16} /> : <Play size={16} />}{sessionRunning ? 'Pause session' : 'Start skill session'}</button><button className="quiet-button" disabled={Math.floor(sessionSeconds / 60) < 1} onClick={saveTimedSession}>Finish & log time</button><button className="quiet-button" onClick={() => { setSessionRunning(false); setSessionSeconds(0); }}>Reset</button></div></section><section className="plan-note"><Sparkles size={18} /><p><strong>Suggested skill hour · {skillWindow}</strong><span>Your daily {profile.skillMinutes} minute slot moves to 30 minutes after your last class on {day}. Adjust your timetable and the suggestion updates.</span></p><button className="text-button" onClick={() => setScreen('roadmap')}>View learning path <ArrowRight size={15} /></button></section></>}

        {screen === 'tasks' && <><PageTitle eyebrow="YOUR EVENING CHECK-IN" title="What needs your attention?" description="Add homework and study tasks, choose a due date, and keep your academic queue in one place." /><section className="panel checkin-panel"><div className="aura-checkin"><span className="aura-avatar"><Sparkles size={21} /></span><div><strong>Aura is ready for your check-in</strong><span>Tell the study agent what you need to finish. You can type or use voice input.</span></div></div><form className="task-entry" onSubmit={addTask}><label className="sr-only" htmlFor="task-title">Homework or study task</label><textarea id="task-title" value={newTask} onChange={(event) => setNewTask(event.target.value)} placeholder="e.g. Finish the graph assignment and review OS synchronization" maxLength={180} rows={2} /><div className="task-entry-options"><label>Due date<input type="date" value={newTaskDue} onChange={(event) => setNewTaskDue(event.target.value)} /></label><label>Reminder time<input type="time" value={newTaskReminder} onChange={(event) => setNewTaskReminder(event.target.value)} /></label><button className="voice-button" type="button" onClick={() => startVoiceInput((text) => setNewTask((current) => `${current}${current ? ' ' : ''}${text}`))}><Mic size={16} /> {voiceListening ? 'Listening…' : 'Speak task'}</button><button className="primary-button" type="submit"><Plus size={16} /> Add to my tasks</button></div></form></section><section className="panel task-panel"><div className="section-heading"><div><p className="eyebrow">PERSONAL ACADEMIC QUEUE</p><h2>Homework & reminders</h2></div><span className="task-count">{profile.tasks.filter((task) => !task.done).length} open</span></div>{profile.tasks.length ? <div className="task-list">{[...profile.tasks].sort((a, b) => a.done === b.done ? a.due.localeCompare(b.due) : a.done ? 1 : -1).map((task) => <button key={task.id} className={`task-row ${task.done ? 'done' : ''}`} onClick={() => toggleTask(task.id)}><span className="check-circle">{task.done && <Check size={13} />}</span><span className="task-title">{task.title}<small className="task-due">Due {new Date(`${task.due}T00:00:00`).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} · Reminder {task.reminderTime || '18:00'}</small></span><small>{task.done ? 'Complete' : task.due < localDate() ? 'Overdue · mark done' : 'Mark complete'}</small></button>)}</div> : <div className="empty-state"><ListTodo size={23} /><strong>Your task list is clear</strong><span>Tasks you add at check-in will appear here with their due dates.</span></div>}</section><section className="plan-note"><Clock3 size={18} /><p><strong>Protected skill time · {skillWindow}</strong><span>Your {profile.skillMinutes}-minute roadmap practice is planned around {day}’s classes.</span></p><button className="text-button" onClick={() => setScreen('planner')}>Open Flow <ArrowRight size={15} /></button></section></>}

        {screen === 'profile' && <><PageTitle eyebrow="YOUR PRIVATE LEARNING SPACE" title="Your profile" description="Your goals, timetable, and study progress are saved in this browser." /><section className="panel profile-card"><div className="profile-identity"><span className="profile-avatar">{profile.name.slice(0, 1).toUpperCase()}</span><div><p className="eyebrow">STUDENT PROFILE</p><h2>{profile.name}</h2><span>Personal learning tracker</span></div><button className="primary-button" onClick={() => { setSetupOriginalGoal(profile.goal); update({ setupComplete: false }); }}>Edit setup</button></div><div className="profile-details"><div><span>Learning goal</span><strong>{profile.goal}</strong></div><div><span>Target date</span><strong>{profile.targetDate ? new Date(`${profile.targetDate}T00:00:00`).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'Not set'}</strong></div><div><span>College classes saved</span><strong>{profile.classes.length}</strong></div><div><span>Daily skill practice</span><strong>{profile.skillMinutes} minutes</strong></div></div></section><section className="stats-grid profile-stats"><Stat icon={<Clock3 size={18} />} label="Learning time" value={`${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`} note="logged across your skills" /><Stat icon={<Flame size={18} />} label="Study streak" value={`${studyStreak} day${studyStreak === 1 ? '' : 's'}`} note="consecutive days with activity" /><Stat icon={<Bookmark size={18} />} label="Saved skills" value={`${profile.bookmarkedTrackIds.length}`} note="bookmarked learning tracks" /></section><section className="panel privacy-card"><CheckCircle2 size={19} /><div><strong>Your workspace stays on this device</strong><span>This app has no faculty or mentor view. Anyone who can use this browser profile can still access its local data.</span></div></section><button className="quiet-button reset-button" onClick={() => { if (window.confirm('This clears your saved timetable, tasks, and progress from this browser. Continue?')) { localStorage.removeItem(STORE_KEY); setProfile(blankProfile); } }}><RotateCcw size={15} /> Clear my local data</button></>}

        {screen === 'roadmap' && <><PageTitle eyebrow="YOUR PERSONAL ROADMAP" title="Small steps toward a bigger goal" description={`Built around “${profile.goal}”. Work through one topic at a time and record the time you spend.`} /><div className="roadmap-top"><div className="panel roadmap-summary"><div className="progress-ring" style={{ '--progress': `${weeklyProgress * 3.6}deg` } as React.CSSProperties}><span>{weeklyProgress}%</span></div><div><p className="eyebrow">YOUR LEARNING PROGRESS</p><h2>{Math.floor(totalMinutes / 60)} hours logged</h2><p className="muted-copy">{completedModules} of {allModules} learning steps complete</p></div></div><div className="panel skill-hour-box"><span className="round-icon amber"><Zap size={18} /></span><p className="eyebrow">DAILY SKILL HOUR</p><strong>{profile.skillMinutes} minutes</strong><span>Suggested today · {skillWindow}</span><select aria-label="Choose a skill for your session" value={activeTrack} onChange={(event) => setActiveTrack(event.target.value)}>{profile.tracks.map((track) => <option key={track.id} value={track.id}>{track.name}</option>)}</select><button className="primary-button" onClick={() => { setSessionSeconds(0); setSessionRunning(true); setScreen('planner'); }}><Play size={16} /> Start a focus session</button></div></div><div className="roadmap-list">{profile.tracks.map((track, index) => { const firstOpen = track.modules.find((module) => !track.completed.includes(module)); const isBookmarked = profile.bookmarkedTrackIds.includes(track.id); return <section className="panel roadmap-card" key={track.id}><div className="roadmap-heading"><span className={`roadmap-number tint-${index % 3}`}>{String(index + 1).padStart(2, '0')}</span><div><p className="eyebrow">{track.hours} HOURS PLANNED · {track.modules.length} LESSONS</p><h2>{track.name}</h2><span>{track.reason}</span></div><div className="track-progress-label">{Math.min(100, Math.round(track.spentMinutes / (track.hours * 60) * 100))}%<small>{track.spentMinutes} min logged</small></div><button className={`bookmark-button ${isBookmarked ? 'saved' : ''}`} aria-label={isBookmarked ? 'Remove saved skill' : 'Save skill'} title={isBookmarked ? 'Saved' : 'Save skill'} onClick={() => toggleBookmark(track.id)}><Bookmark size={17} fill={isBookmarked ? 'currentColor' : 'none'} /></button></div><div className="course-next"><span className="eyebrow">NEXT MILESTONE</span><strong>{firstOpen || 'All lessons complete'}</strong><button className="text-button" onClick={() => { setActiveTrack(track.id); setScreen('planner'); }}>{firstOpen ? 'Study this next' : 'Review your progress'} <ArrowRight size={14} /></button></div><div className="module-list">{track.modules.map((module, step) => { const done = track.completed.includes(module); return <button className={`module-row ${done ? 'complete' : ''}`} key={module} onClick={() => toggleModule(track.id, module)}><span className="module-check">{done ? <Check size={14} /> : <span>{step + 1}</span>}</span><span>{module}</span><small>{done ? 'Complete' : 'Mark done'}</small></button>; })}</div></section>; })}</div></>}

        {screen === 'progress' && <><PageTitle eyebrow="YOUR CONSISTENCY, MADE VISIBLE" title="Progress you can build on" description="Your learning record stays in this browser and belongs to you." /><section className="stats-grid progress-stats"><Stat icon={<Clock3 size={18} />} label="Time invested" value={`${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`} note="across all roadmap skills" /><Stat icon={<BookOpen size={18} />} label="Topics completed" value={`${completedModules}/${allModules}`} note="check them off in your learning path" /><Stat icon={<Target size={18} />} label="Goal target" value={profile.targetDate ? new Date(`${profile.targetDate}T00:00:00`).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'In progress'} note="your own goal, at your pace" /></section><section className="panel"><div className="section-heading"><div><p className="eyebrow">SKILL BREAKDOWN</p><h2>Hours by learning track</h2></div></div>{profile.tracks.map((track) => { const pct = Math.min(100, Math.round(track.spentMinutes / (track.hours * 60) * 100)); return <div className="progress-row" key={track.id}><div><strong>{track.name}</strong><span>{(track.spentMinutes / 60).toFixed(1)} of {track.hours} hours</span></div><div className="progress-bar"><span style={{ width: `${pct}%` }} /></div><b>{pct}%</b></div>; })}</section><button className="quiet-button reset-button" onClick={() => { if (window.confirm('This clears your saved timetable, tasks, and progress from this browser. Continue?')) { localStorage.removeItem(STORE_KEY); setProfile(blankProfile); } }}><RotateCcw size={15} /> Clear my local data</button></>}

        {screen === 'coach' && <><PageTitle eyebrow="YOUR STUDY AGENT · AURA" title="Ask Aura about your next step" description="Aura can use your goal, classes, learning path, and open tasks to plan study time, explain concepts, or make practice questions." /><section className="panel coach-panel"><div className="coach-intro"><span className="aura-avatar small"><Sparkles size={20} /></span><div><strong>Aura · your student study agent</strong><span>Uses the learning context you provided. Your academic details are never invented.</span></div></div><div className="coach-messages" aria-live="polite">{coachMessages.length === 0 && <div className="coach-empty"><p>Pick a starting point, or ask Aura anything about your learning.</p><div>{['Plan my study time around classes', 'Generate a quiz on my current skill', 'Show me a mind map for this topic', 'Practice questions for my goal', 'Help me break down my goal'].map((suggestion) => <button key={suggestion} onClick={() => setCoachQuestion(suggestion)}>{suggestion}<ArrowRight size={13} /></button>)}</div></div>}{coachMessages.map((message, index) => <div className={`coach-bubble ${message.role}`} key={`${message.role}-${index}`}><span>{message.role === 'student' ? 'You' : 'Aura'}</span><p>{message.text}</p>{message.role === 'coach' && <div className="response-actions"><button type="button" onClick={() => speakText(message.text)} aria-label="Read answer aloud"><Volume2 size={14} /> Read aloud</button>{['👍', '💡', '❤️'].map((emoji) => <button type="button" key={emoji} aria-label={`React ${emoji}`} onClick={() => setNotice(`Thanks for your feedback ${emoji}`)}>{emoji}</button>)}</div>}</div>)}{coachBusy && <div className="coach-thinking">Aura is putting together a useful answer…</div>}</div><div className="coach-suggestions">{['Generate Quiz', 'Show Mind Map', 'Learn with Voice', 'Practice Questions'].map((prompt) => <button key={prompt} onClick={() => setCoachQuestion(`Please help me: ${prompt.toLowerCase()} for my current learning goal.`)}>{prompt}</button>)}</div><form className="coach-form" onSubmit={askCoach}><label className="sr-only" htmlFor="coach-question">Ask Aura</label><textarea id="coach-question" value={coachQuestion} onChange={(event) => setCoachQuestion(event.target.value)} maxLength={1200} rows={2} placeholder="Ask Aura about your goal, classes, or what to learn next…" /><button className="voice-button" type="button" aria-label={voiceListening ? 'Listening' : 'Use voice input'} onClick={() => startVoiceInput((text) => setCoachQuestion((current) => `${current}${current ? ' ' : ''}${text}`))}><Mic size={18} /></button><button type="submit" className="primary-button" disabled={coachBusy || !coachQuestion.trim()}>Ask Aura <ArrowRight size={15} /></button></form><p className="coach-disclosure">AI suggestions can be wrong. Check important academic details against your course materials. Voice input uses your browser’s speech recognition when available.</p></section></>}
      </main>

      <nav className="mobile-nav" aria-label="Mobile navigation">{([['overview', 'Learn', <GraduationCap size={18} />], ['progress', 'Progress', <TrendingUp size={18} />], ['planner', 'Flow', <CalendarDays size={18} />], ['coach', 'AI Mentor', <Sparkles size={18} />], ['tasks', 'Tasks', <ListTodo size={18} />], ['profile', 'Profile', <UserRound size={18} />]] as [Screen, string, React.ReactNode][]).map(([key, label, icon]) => <button key={key} className={screen === key ? 'active' : ''} onClick={() => setScreen(key)}>{icon}<span>{label}</span></button>)}</nav>
      {notice && <div role="status" className="toast"><CheckCircle2 size={17} />{notice}</div>}
      {sessionOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSessionOpen(false); }}><form className="session-modal" onSubmit={recordSession}><button type="button" className="modal-close" aria-label="Close" onClick={() => setSessionOpen(false)}><X size={18} /></button><span className="round-icon amber"><Zap size={18} /></span><p className="eyebrow">SKILL PRACTICE</p><h2>Log a learning session</h2><p className="muted-copy">A little focused practice adds up. Record what you worked on.</p><label>Learning track<select value={activeTrack} onChange={(event) => setActiveTrack(event.target.value)}>{profile.tracks.map((track) => <option value={track.id} key={track.id}>{track.name}</option>)}</select></label><label>What did you learn?<input required maxLength={100} value={sessionTopic} onChange={(event) => setSessionTopic(event.target.value)} placeholder="e.g. Binary search" /></label><label>Minutes studied<input required min="5" max="240" type="number" value={sessionMinutes} onChange={(event) => setSessionMinutes(event.target.value)} /></label><button className="primary-button full-button" type="submit">Save learning time <ArrowRight size={16} /></button></form></div>}
      <footer className="page-footer">Your schedule and progress are saved on this device.</footer>
    </div>
  );
}

function Setup({ profile, onChange, onSubmit }: { profile: Profile; onChange: (changes: Partial<Profile>) => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  const [classDraft, setClassDraft] = useState({ day: 'Monday' as Day, subject: '', start: '09:00', end: '10:00' });
  const addFirstClass = () => { if (!classDraft.subject.trim() || classDraft.end <= classDraft.start) return; onChange({ classes: [...profile.classes, { ...classDraft, subject: classDraft.subject.trim(), id: crypto.randomUUID() }] }); setClassDraft((current) => ({ ...current, subject: '' })); };
  return <main className="setup-shell"><a className="brand setup-brand"><span className="brand-mark"><GraduationCap size={21} /></span><span><strong>Trackwell</strong><small>Student learning tracker</small></span></a><div className="setup-layout"><section className="setup-intro"><p className="eyebrow">YOUR STUDY AGENT · AURA</p><h1>Your goals.<br />Your timetable.<br /><span>Your next step.</span></h1><p>Aura starts by learning your college schedule and the goal you care about. Then it builds a roadmap with time for the skills you need.</p><div className="setup-points"><span><CheckCircle2 size={17} /> Made for your personal progress</span><span><CheckCircle2 size={17} /> A daily hour for skill building</span><span><CheckCircle2 size={17} /> Your information stays in this browser</span></div></section><form className="setup-card" onSubmit={onSubmit}><div className="setup-title"><span className="round-icon"><Sparkles size={19} /></span><div><p className="eyebrow">STEP 1 WITH AURA</p><h2>Tell Aura about your routine</h2></div></div><label>Your name<input required maxLength={60} value={profile.name} onChange={(event) => onChange({ name: event.target.value })} placeholder="How should we call you?" /></label><label>What goal are you working toward?<textarea required maxLength={240} rows={2} value={profile.goal} onChange={(event) => onChange({ goal: event.target.value })} placeholder="For example: prepare for software placements, build a web app, learn data science…" /></label><label>When would you like to reach it? <span className="optional">Optional</span><input type="date" min={new Date().toISOString().slice(0, 10)} value={profile.targetDate} onChange={(event) => onChange({ targetDate: event.target.value })} /></label><div className="setup-schedule"><div className="setup-schedule-heading"><div><h3>Your college timetable</h3><p>Add the classes that shape your week.</p></div><CalendarDays size={19} /></div><div className="setup-class-list">{profile.classes.map((item) => <div className="setup-class" key={item.id}><span>{item.day.slice(0, 3)}</span><strong>{item.subject}</strong><small>{item.start}–{item.end}</small><button type="button" aria-label={`Remove ${item.subject}`} onClick={() => onChange({ classes: profile.classes.filter((entry) => entry.id !== item.id) })}><X size={14} /></button></div>)}</div><div className="setup-class-form"><select aria-label="Class day" value={classDraft.day} onChange={(event) => setClassDraft({ ...classDraft, day: event.target.value as Day })}>{DAYS.map((item) => <option key={item}>{item}</option>)}</select><input aria-label="Class or subject" maxLength={80} value={classDraft.subject} onChange={(event) => setClassDraft({ ...classDraft, subject: event.target.value })} placeholder="Class or subject" /><input aria-label="Class start time" type="time" value={classDraft.start} onChange={(event) => setClassDraft({ ...classDraft, start: event.target.value })} /><input aria-label="Class end time" type="time" value={classDraft.end} onChange={(event) => setClassDraft({ ...classDraft, end: event.target.value })} /><button type="button" title="Add class" aria-label="Add class" onClick={addFirstClass}><Plus size={17} /></button></div><span className="optional">Add your remaining classes later from My Week.</span></div><label className="minutes-setting">Daily skill practice <span>{profile.skillMinutes} min / day</span><input type="range" min="30" max="120" step="15" value={profile.skillMinutes} onChange={(event) => onChange({ skillMinutes: Number(event.target.value) })} /><small>We’ll reserve this time for the skills your goal needs.</small></label><button type="submit" className="primary-button full-button setup-submit">Create my learning plan with Aura <ArrowRight size={17} /></button><p className="privacy-note">Your timetable and progress stay on this device.</p></form></div></main>;
}

function Stat({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: string; note: string }) { return <div className="panel stat-card"><span className="round-icon">{icon}</span><span className="stat-label">{label}</span><strong>{value}</strong><small>{note}</small></div>; }
function DayPicker({ day, onSelect }: { day: Day; onSelect: (day: Day) => void }) { return <div className="day-picker">{DAYS.map((item) => <button key={item} onClick={() => onSelect(item)} className={day === item ? 'selected' : ''}><span>{item.slice(0, 3)}</span><small>{item.slice(0, 1)}</small></button>)}</div>; }
function PageTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) { return <div className="page-title"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>; }

export default App;
