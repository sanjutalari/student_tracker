import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  AlertTriangle,
  Upload,
  FileText,
  Filter,
  Bell,
  Sparkles,
  Zap,
  BookOpen,
} from 'lucide-react';
import {
  TaskItem,
  TimetableSlot,
  Assignment,
  HomeworkItem,
  StudyReminder,
  AfterCollegeScheduleBlock,
  SkillTracker,
} from '../types';
import { generateDaySpecificStudyPlan } from '../utils/studyPlanner';

interface DailyPlannerViewProps {
  tasks: TaskItem[];
  timetable: TimetableSlot[];
  assignments: Assignment[];
  homework: HomeworkItem[];
  reminders: StudyReminder[];
  afterCollegeSchedule: AfterCollegeScheduleBlock[];
  activeSkill: SkillTracker;
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Omit<TaskItem, 'id' | 'completed'>) => void;
  onSubmitAssignment: (assignmentId: string, fileName: string) => void;
  onToggleReminder: (reminderId: string) => void;
  onOpenCheckin: () => void;
  onOpenSkillTracker: () => void;
}

export const DailyPlannerView: React.FC<DailyPlannerViewProps> = ({
  tasks,
  timetable,
  assignments,
  homework,
  reminders,
  afterCollegeSchedule,
  activeSkill,
  onToggleTask,
  onAddTask,
  onSubmitAssignment,
  onToggleReminder,
  onOpenCheckin,
  onOpenSkillTracker,
}) => {
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');
  const [activeTab, setActiveTab] = useState<'planner' | 'tasks' | 'homework'>('planner');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('CS301 - DAA');
  const [newDueDate, setNewDueDate] = useState('2026-11-09');
  const [newDuration, setNewDuration] = useState('45');
  const [newPriority, setNewPriority] = useState<TaskItem['priority']>('medium');
  const [newCategory, setNewCategory] = useState<TaskItem['category']>('College assignments');

  // Assignment submission modal
  const [submittingAssignmentId, setSubmittingAssignmentId] = useState<string | null>(null);
  const [submissionFileName, setSubmissionFileName] = useState('');

  const filteredTimetable = timetable.filter((slot) => slot.day === selectedDay);

  // Dynamically generate day-specific study and skill schedule tailored to this day's classes
  const daySpecificSchedule = generateDaySpecificStudyPlan({
    dayName: selectedDay,
    classesForDay: filteredTimetable.map((slot) => ({
      subjectCode: slot.subjectCode,
      subjectName: slot.subjectName,
      startTime: slot.startTime,
      endTime: slot.endTime,
      faculty: slot.faculty,
    })),
    homeworkList: homework,
    activeSkill,
    studyStartTime: '16:00',
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      subject: newSubject,
      dueDate: newDueDate,
      estimatedMinutes: parseInt(newDuration, 10) || 30,
      priority: newPriority,
      category: newCategory,
    });

    setNewTitle('');
    setIsAddingTask(false);
  };

  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingAssignmentId || !submissionFileName) return;
    onSubmitAssignment(submittingAssignmentId, submissionFileName);
    setSubmittingAssignmentId(null);
    setSubmissionFileName('');
  };

  const filteredTasks = selectedCategory === 'all'
    ? tasks
    : tasks.filter((t) => t.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Top Banner: After-College Check-in Trigger */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#7E2548]/80 via-[#5A1830] to-[#1A1015] border border-[#E85A9E]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#E85A9E]/20 border border-[#E85A9E]/40 flex items-center justify-center text-[#E85A9E] flex-shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-white font-medium text-base sm:text-lg tracking-tight">
              After-College Daily Study & Skill Planning
            </h3>
            <p className="text-xs text-white/70">
              College ends at 3:30 PM. Tell the agent your homework by text or voice to generate today's study plan & reminders.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={onOpenCheckin}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-full bg-white text-neutral-900 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-neutral-100 shadow-md active:scale-95 transition-all"
          >
            <span>After-College Check-in</span>
          </button>
          <button
            type="button"
            onClick={onOpenSkillTracker}
            className="px-4 py-2.5 rounded-full glass-button text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-white/20"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Track Skills</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('planner')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'planner'
                ? 'bg-white text-neutral-900 shadow-md'
                : 'text-white/70 hover:text-white glass-button'
            }`}
          >
            Timetable & Study Schedule
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('homework')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'homework'
                ? 'bg-white text-neutral-900 shadow-md'
                : 'text-white/70 hover:text-white glass-button'
            }`}
          >
            Faculty Homework ({homework.filter((h) => !h.completed).length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'tasks'
                ? 'bg-white text-neutral-900 shadow-md'
                : 'text-white/70 hover:text-white glass-button'
            }`}
          >
            All Tasks ({tasks.filter((t) => !t.completed).length})
          </button>
        </div>

        {activeTab === 'tasks' && (
          <button
            type="button"
            onClick={() => setIsAddingTask(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E85A9E] text-white text-xs font-semibold hover:bg-[#d64a8d] transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Study Task</span>
          </button>
        )}
      </div>

      {/* PLANNER TAB */}
      {activeTab === 'planner' && (
        <div className="space-y-6">
          {/* Day Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const).map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedDay === day
                    ? 'bg-white/20 text-white border border-white/40 shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Official College Timetable */}
            <div className="glass-panel p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-medium text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#E85A9E]" />
                  <span>College Timetable ({selectedDay})</span>
                </h4>
                <span className="text-xs text-white/50">Vignan B.Tech CSE - Section B</span>
              </div>

              <div className="space-y-2.5">
                {filteredTimetable.map((slot) => (
                  <div
                    key={slot.id}
                    className="glass-tile p-3.5 flex items-center justify-between border-l-4 border-l-[#E85A9E]"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">
                          {slot.subjectCode}
                        </span>
                        <span className="text-xs text-white/70">
                          {slot.subjectName}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 mt-0.5">
                        {slot.faculty} • Room: {slot.room} • {slot.type}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-mono font-medium text-white/90">
                        {slot.startTime} - {slot.endTime}
                      </span>
                      <span className="block text-[10px] text-emerald-400 font-medium">
                        Period {slot.period}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Agent-Generated After-College Schedule */}
            <div className="glass-panel p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h4 className="text-white font-medium text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>After-College Timetable (Study & Skills)</span>
                </h4>
                <button
                  type="button"
                  onClick={onOpenCheckin}
                  className="text-xs text-[#E85A9E] hover:underline"
                >
                  Re-plan with Agent
                </button>
              </div>

              <div className="space-y-3">
                {daySpecificSchedule.map((block) => {
                  const borderColors = {
                    class_revision: 'border-l-indigo-400 bg-indigo-500/10',
                    skill_time: 'border-l-amber-400 bg-amber-500/10',
                    homework: 'border-l-[#E85A9E] bg-[#E85A9E]/10',
                    break: 'border-l-neutral-400 bg-white/5',
                    review: 'border-l-cyan-400 bg-cyan-500/10',
                  };

                  return (
                    <div
                      key={block.id}
                      className={`p-3.5 rounded-2xl border-l-4 border ${borderColors[block.type]} flex items-start justify-between text-xs`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{block.title}</span>
                          {block.type === 'skill_time' && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-400/25 text-amber-300 text-[10px] font-bold">
                              {activeSkill.name}
                            </span>
                          )}
                        </div>
                        <p className="text-white/60 mt-1 leading-relaxed">
                          {block.description}
                        </p>
                      </div>

                      <span className="font-mono text-white/90 font-medium whitespace-nowrap ml-2">
                        {block.startTime} - {block.endTime}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Active Reminders List */}
              <div className="pt-3 border-t border-white/10">
                <h5 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  <span>Scheduled Reminders for Today</span>
                </h5>

                <div className="space-y-1.5">
                  {reminders.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => onToggleReminder(r.id)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-colors ${
                        r.isCompleted
                          ? 'bg-white/5 border-white/5 opacity-50'
                          : 'bg-white/10 border-white/15 hover:bg-white/15'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {r.isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-[#3DDC5A] flex-shrink-0" />
                        ) : (
                          <Bell className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
                        )}
                        <span className={`truncate text-white ${r.isCompleted ? 'line-through text-white/50' : ''}`}>
                          {r.title}
                        </span>
                      </div>
                      <span className="font-mono text-white/80 font-medium whitespace-nowrap ml-2">
                        {r.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FACULTY HOMEWORK TAB */}
      {activeTab === 'homework' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/70 flex items-center justify-between">
            <span>
              All homework assigned by faculty is automatically synchronized with your after-college daily timetable.
            </span>
            <button
              type="button"
              onClick={onOpenCheckin}
              className="px-3 py-1.5 rounded-full bg-white text-neutral-900 font-semibold text-xs hover:bg-neutral-100"
            >
              Ask Agent to Plan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {homework.map((hw) => (
              <div key={hw.id} className="glass-panel p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#E85A9E] uppercase">
                      {hw.subject}
                    </span>
                    <span className="text-[11px] text-white/50">
                      Assigned by: {hw.assignedByFaculty}
                    </span>
                  </div>

                  <h4 className="text-base font-semibold text-white mt-1.5">
                    {hw.title}
                  </h4>

                  {hw.instructions && (
                    <p className="text-xs text-white/70 mt-2 p-3 rounded-xl bg-white/5 border border-white/10 leading-relaxed">
                      {hw.instructions}
                    </p>
                  )}

                  <div className="flex items-center gap-3 mt-3 text-xs text-white/50">
                    <span>Due: {hw.dueDate}</span>
                    <span>•</span>
                    <span>Est. Time: {hw.estimatedMinutes} mins</span>
                    {hw.reminderSet && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-400 font-medium flex items-center gap-1">
                          <Bell className="w-3 h-3" />
                          Reminder Active
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className={`text-xs font-semibold ${hw.completed ? 'text-[#3DDC5A]' : 'text-amber-400'}`}>
                    {hw.completed ? 'Completed' : 'Pending Completion'}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      // Toggle completed
                      hw.completed = !hw.completed;
                    }}
                    className="px-4 py-1.5 rounded-full glass-button text-xs font-semibold text-white hover:bg-white/20"
                  >
                    {hw.completed ? 'Mark Incomplete' : 'Mark Done'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ALL TASKS TAB */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-white/50 mr-1" />
            {['all', 'College assignments', 'Exam preparation', 'Coding practice', 'Skill development'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-white text-neutral-900 font-semibold'
                    : 'glass-button text-white/70 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Tasks' : cat}
              </button>
            ))}
          </div>

          <div className="space-y-2.5">
            {filteredTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => onToggleTask(t.id)}
                className={`glass-tile p-4 flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  t.completed ? 'opacity-60 bg-white/[0.03]' : 'hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <button type="button" className="text-white/70 hover:text-white">
                    {t.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-[#3DDC5A]" />
                    ) : (
                      <Circle className="w-5 h-5 text-white/40" />
                    )}
                  </button>
                  <div className="min-w-0">
                    <p className={`text-sm font-medium text-white ${t.completed ? 'line-through text-white/50' : ''}`}>
                      {t.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-white/50">
                      <span>{t.subject}</span>
                      <span>•</span>
                      <span>Est: {t.estimatedMinutes}m</span>
                      <span>•</span>
                      <span>Due: {t.dueDate}</span>
                    </div>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-semibold border bg-blue-500/20 text-blue-300 border-blue-500/40">
                  {t.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {isAddingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form
            onSubmit={handleCreateTask}
            className="w-full max-w-md rounded-3xl glass-panel p-6 border border-white/20 shadow-2xl space-y-4"
          >
            <h3 className="text-lg font-semibold text-white">Create Daily Study Task</h3>
            <div>
              <label className="text-xs text-white/70 block mb-1">Task Title:</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Revise Greedy MST (Prim & Kruskal)"
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-2 text-sm text-white focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/70 block mb-1">Subject:</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/20 rounded-2xl px-3 py-2 text-xs text-white"
                >
                  <option value="CS301 - DAA">CS301 - DAA</option>
                  <option value="CS302 - OS">CS302 - OS</option>
                  <option value="CS303 - CN">CS303 - CN</option>
                  <option value="CS304 - DBMS">CS304 - DBMS</option>
                  <option value="Placement Practice">Placement Practice</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-white/70 block mb-1">Due Date:</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/20 rounded-2xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingTask(false)}
                className="px-4 py-2 rounded-full glass-button text-xs text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-white text-neutral-900 text-xs font-semibold hover:bg-neutral-100"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
