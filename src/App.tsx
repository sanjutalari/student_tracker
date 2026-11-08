import React, { useState, useEffect } from 'react';
import {
  Header,
} from './components/Header';
import { MauveHeroCard } from './components/MauveHeroCard';
import { SemicircleGauge } from './components/SemicircleGauge';
import { StatTile } from './components/StatTile';
import { AmberMentorBanner } from './components/AmberMentorBanner';
import { StudySkillHubCard } from './components/StudySkillHubCard';
import { CourseCard } from './components/CourseCard';
import { AiAssistantModal } from './components/AiAssistantModal';
import { StudyTimerModal } from './components/StudyTimerModal';
import { QuizModal } from './components/QuizModal';
import { DailyPlannerView } from './components/DailyPlannerView';
import { AttendanceDetailsModal } from './components/AttendanceDetailsModal';
import { NotificationsModal } from './components/NotificationsModal';
import { GoalsModal } from './components/GoalsModal';
import { FacultyPortalView } from './components/FacultyPortalView';
import { MentorPortalView } from './components/MentorPortalView';
import { AdminPortalView } from './components/AdminPortalView';
import { AfterCollegeCheckinModal } from './components/AfterCollegeCheckinModal';
import { SkillTimeTrackerModal } from './components/SkillTimeTrackerModal';

import {
  initialStudent,
  initialFaculty,
  initialMentor,
  initialWearable,
  initialTimetable,
  initialTasks,
  initialAssignments,
  initialAttendance,
  initialGoals,
  initialAnnouncements,
  initialSkills,
  initialHomework,
  initialReminders,
} from './data/mockData';
import {
  UserRole,
  WearableMetrics,
  WearableSimulationMode,
  TaskItem,
  Assignment,
  StudySessionRecord,
  Goal,
  SkillTracker,
  HomeworkItem,
  StudyReminder,
  AfterCollegeScheduleBlock,
} from './types';
import { stepWearableSimulation } from './utils/wearable';
import {
  generateAfterCollegeSchedule,
  generateDaySpecificStudyPlan,
  calculateSkillProgression,
} from './utils/studyPlanner';
import {
  Calendar,
  CheckSquare,
  Award,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  Bell,
  CheckCircle2,
  Mic,
} from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [activeTab, setActiveTab] = useState<'overview' | 'planner'>('overview');

  // Application Data States
  const [student, setStudent] = useState(initialStudent);
  const [faculty, setFaculty] = useState(initialFaculty);
  const [mentor, setMentor] = useState(initialMentor);
  const [wearable, setWearable] = useState<WearableMetrics>(initialWearable);
  const [simulationMode, setSimulationMode] = useState<WearableSimulationMode>('normal');
  const [timetable, setTimetable] = useState(initialTimetable);
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [attendance, setAttendance] = useState(initialAttendance);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);

  // New Dedicated After-College Planning & Skill States
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'>('Monday');
  const [skills, setSkills] = useState<SkillTracker[]>(initialSkills);
  const [activeSkillId, setActiveSkillId] = useState<string>('sk-1');
  const [homework, setHomework] = useState<HomeworkItem[]>(initialHomework);
  const [reminders, setReminders] = useState<StudyReminder[]>(initialReminders);

  const activeSkill = skills.find((s) => s.id === activeSkillId) || skills[0];

  // Dynamically filter classes for currently selected day
  const classesToday = timetable.filter((slot) => slot.day === selectedDay);

  const [afterCollegeSchedule, setAfterCollegeSchedule] = useState<AfterCollegeScheduleBlock[]>(() =>
    generateDaySpecificStudyPlan({
      dayName: 'Monday',
      classesForDay: initialTimetable
        .filter((slot) => slot.day === 'Monday')
        .map((slot) => ({
          subjectCode: slot.subjectCode,
          subjectName: slot.subjectName,
          startTime: slot.startTime,
          endTime: slot.endTime,
          faculty: slot.faculty,
        })),
      homeworkList: initialHomework,
      activeSkill: initialSkills[0],
      studyStartTime: '16:00',
    })
  );

  // Recalculate evening study & skill plan whenever the selected day, classes, or homework change
  useEffect(() => {
    const dayClasses = timetable
      .filter((slot) => slot.day === selectedDay)
      .map((slot) => ({
        subjectCode: slot.subjectCode,
        subjectName: slot.subjectName,
        startTime: slot.startTime,
        endTime: slot.endTime,
        faculty: slot.faculty,
      }));

    const newPlan = generateDaySpecificStudyPlan({
      dayName: selectedDay,
      classesForDay: dayClasses,
      homeworkList: homework,
      activeSkill,
      studyStartTime: '16:00',
    });
    setAfterCollegeSchedule(newPlan);
  }, [selectedDay, timetable, homework, activeSkill]);

  // Modals visibility
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState(false);
  const [isAfterCollegeCheckinOpen, setIsAfterCollegeCheckinOpen] = useState(false);
  const [isSkillTrackerOpen, setIsSkillTrackerOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | undefined>(undefined);

  // Wearable Real-time Telemetry Simulation Loop
  useEffect(() => {
    if (!wearable.isConnected) return;

    const interval = setInterval(() => {
      setWearable((prev) => stepWearableSimulation(prev, simulationMode));
    }, 3000);

    return () => clearInterval(interval);
  }, [wearable.isConnected, simulationMode]);

  // Task toggler
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (newTask: Omit<TaskItem, 'id' | 'completed'>) => {
    const item: TaskItem = {
      ...newTask,
      id: `tsk-${Date.now()}`,
      completed: false,
    };
    setTasks((prev) => [item, ...prev]);
  };

  const handleSubmitAssignment = (assignmentId: string, fileName: string) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId
          ? {
              ...a,
              status: 'Submitted',
              submittedFile: fileName,
              submittedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
            }
          : a
      )
    );
  };

  const handleGradeAssignment = (
    assignmentId: string,
    marks: number,
    grade: string,
    feedback: string
  ) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId
          ? {
              ...a,
              status: 'Evaluated',
              marksObtained: marks,
              grade,
              feedback,
            }
          : a
      )
    );
  };

  const handleSaveStudySession = (newSession: StudySessionRecord) => {
    setWearable((prev) => ({
      ...prev,
      activeMinutesToday: prev.activeMinutesToday + newSession.durationMinutes,
    }));
  };

  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const updatedMilestones = g.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const completedCount = updatedMilestones.filter((m) => m.completed).length;
        const progressPct = Math.round((completedCount / updatedMilestones.length) * 100);
        return {
          ...g,
          milestones: updatedMilestones,
          progressPct,
        };
      })
    );
  };

  const handleAddGoal = (newGoal: Omit<Goal, 'id' | 'progressPct'>) => {
    const item: Goal = {
      ...newGoal,
      id: `goal-${Date.now()}`,
      progressPct: 0,
    };
    setGoals((prev) => [item, ...prev]);
  };

  const handleOpenAiWithPrompt = (prompt: string) => {
    setAiInitialPrompt(prompt);
    setIsAiModalOpen(true);
  };

  // When student completes After-College Check-in with the Agent
  const handleScheduleGenerated = (
    newSchedule: AfterCollegeScheduleBlock[],
    newHomework: HomeworkItem[],
    newReminders: StudyReminder[]
  ) => {
    setAfterCollegeSchedule(newSchedule);
    setHomework((prev) => [...newHomework, ...prev]);
    setReminders((prev) => [...newReminders, ...prev]);
  };

  // When student finishes a dedicated Skill Learning Session
  const handleSkillSessionComplete = (
    skillId: string,
    minutes: number,
    topicLearned: string,
    focusScore: number
  ) => {
    setSkills((prev) =>
      prev.map((s) => {
        if (s.id !== skillId) return s;
        const { newCompletedHours, newMasteryPercentage } = calculateSkillProgression(
          s,
          minutes,
          focusScore
        );
        const newLog = {
          id: `sk-log-${Date.now()}`,
          date: 'Today',
          minutes,
          topic: topicLearned,
          focusScore,
          notes: `Mastered topic with ${focusScore}% focus score.`,
        };
        const updatedTopics = s.topicsCovered.includes(topicLearned)
          ? s.topicsCovered
          : [topicLearned, ...s.topicsCovered];

        return {
          ...s,
          completedHours: newCompletedHours,
          masteryPercentage: newMasteryPercentage,
          topicsCovered: updatedTopics,
          recentSessions: [newLog, ...s.recentSessions],
        };
      })
    );

    // Also update student active study minutes
    setWearable((prev) => ({
      ...prev,
      activeMinutesToday: prev.activeMinutesToday + minutes,
    }));
  };

  // When faculty assigns homework
  const handleFacultyAssignHomework = (newHw: HomeworkItem) => {
    setHomework((prev) => [newHw, ...prev]);
    // Create reminder for student
    const newRem: StudyReminder = {
      id: `rem-fac-${Date.now()}`,
      time: '18:30',
      title: `Faculty Homework Due: ${newHw.title} (${newHw.subject})`,
      category: 'homework',
      isCompleted: false,
      createdAt: 'Assigned by Faculty just now',
    };
    setReminders((prev) => [newRem, ...prev]);
  };

  const handleToggleReminder = (remId: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === remId ? { ...r, isCompleted: !r.isCompleted } : r))
    );
  };

  return (
    <div className="min-h-screen aurora-bg-dashboard text-white flex flex-col selection:bg-[#E85A9E] selection:text-white">
      {/* Top Universal Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        student={student}
        activeTab={activeTab}
        showBack={activeTab !== 'overview'}
        onBack={() => setActiveTab('overview')}
        unreadCount={announcements.filter((a) => a.isUrgent).length}
        onOpenNotifications={() => setIsNotificationsModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-7">
        {/* ========================================================= */}
        {/* 1. STUDENT VIEW */}
        {/* ========================================================= */}
        {currentRole === 'student' && (
          <>
            {activeTab === 'overview' ? (
              <div className="space-y-7">
                {/* AFTER-COLLEGE AGENT PROACTIVE CHECK-IN HERO BANNER */}
                <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#7E2548]/90 via-[#4A1628] to-[#1A1015] border border-[#E85A9E]/40 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-[#E85A9E]/15 rounded-full blur-3xl pointer-events-none" />

                  <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                    <div className="flex items-start gap-4">
                      <div className="w-13 h-13 rounded-2xl bg-[#E85A9E]/25 border border-[#E85A9E]/50 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                        <Sparkles className="w-7 h-7 text-[#E85A9E] animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                            Daily After-College Study Planner
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#3DDC5A]" />
                          <span className="text-[11px] text-[#3DDC5A] font-semibold">Classes ended at 3:30 PM</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-medium text-white tracking-tight mt-0.5">
                          "What works do you have today, Rahul?"
                        </h2>
                        <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-2xl leading-relaxed">
                          Tell the agent your assignments or voice text them. Aurora plans your daily class revision, allocates dedicated skill time ({activeSkill.name}), and schedules study reminders.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setIsAfterCollegeCheckinOpen(true)}
                        className="flex-1 sm:flex-initial px-6 py-3 rounded-full bg-white text-neutral-900 font-bold text-sm flex items-center justify-center gap-2 hover:bg-neutral-100 shadow-xl active:scale-95 transition-all cursor-pointer"
                      >
                        <Mic className="w-4 h-4 text-[#E85A9E]" />
                        <span>After-College Check-in (Voice/Text)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsSkillTrackerOpen(true)}
                        className="px-4 py-3 rounded-full glass-button text-xs font-semibold text-white/90 hover:text-white flex items-center gap-1.5 hover:bg-white/20 whitespace-nowrap"
                      >
                        <Zap className="w-4 h-4 text-amber-300" />
                        <span>Track Skills ({activeSkill.masteryPercentage}%)</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Display Headline */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-[#E85A9E] tracking-wider uppercase">
                      Vignan Academic Dashboard • Sec B
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-medium text-white tracking-tight leading-tight mt-0.5">
                      Track Your Learning Journey Easily
                    </h2>
                  </div>

                  {/* Navigation Pill Bar */}
                  <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab('planner')}
                      className="px-4 py-2 rounded-full glass-button text-xs font-semibold text-white/90 hover:text-white flex items-center gap-2 whitespace-nowrap active:scale-95"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#E85A9E]" />
                      <span>Timetable & Planner</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSkillTrackerOpen(true)}
                      className="px-4 py-2 rounded-full glass-button text-xs font-semibold text-white/90 hover:text-white flex items-center gap-2 whitespace-nowrap active:scale-95"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Skill Tracker</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsQuizModalOpen(true)}
                      className="px-4 py-2 rounded-full glass-button text-xs font-semibold text-white/90 hover:text-white flex items-center gap-2 whitespace-nowrap active:scale-95"
                    >
                      <CheckSquare className="w-3.5 h-3.5 text-purple-400" />
                      <span>Practice Quiz</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAttendanceModalOpen(true)}
                      className="px-4 py-2 rounded-full glass-button text-xs font-semibold text-white/90 hover:text-white flex items-center gap-2 whitespace-nowrap active:scale-95"
                    >
                      <Award className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Attendance (89%)</span>
                    </button>
                  </div>
                </div>

                {/* Top Row: Mauve Hero Card (Section 5.5) + Semicircle Gauge (Section 5.6) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Mauve Hero Card (79% Progress Ring) */}
                  <MauveHeroCard
                    percentage={79}
                    label="Academic Mastery"
                    subtext="You're doing great in Algorithms & Systems"
                    onContinue={() => setIsGoalsModalOpen(true)}
                  />

                  {/* Semicircle Gauge Card (68% with 2 nested stat tiles) */}
                  <SemicircleGauge
                    progress={68}
                    label="Good"
                    stat1={{
                      label1: 'Courses',
                      label2: 'Completed',
                      value: 125,
                      onClick: () => setIsGoalsModalOpen(true),
                    }}
                    stat2={{
                      label1: 'Daily',
                      label2: 'Streak',
                      value: 87,
                      onClick: () => handleOpenAiWithPrompt('Analyze my daily streak and weekly study time'),
                    }}
                  />
                </div>

                {/* Center Row: Daily Study Hour & Skill Upscaling Hub */}
                <StudySkillHubCard
                  selectedDay={selectedDay}
                  onSelectDay={setSelectedDay}
                  activeSkill={activeSkill}
                  classesToday={classesToday}
                  homeworkToday={homework}
                  studyMinutesToday={wearable.activeMinutesToday}
                  onStartStudySession={() => setIsTimerModalOpen(true)}
                  onOpenSkillTracker={() => setIsSkillTrackerOpen(true)}
                  onOpenCheckin={() => setIsAfterCollegeCheckinOpen(true)}
                />

                {/* DEDICATED SKILL TIME & AFTER-COLLEGE SCHEDULE PREVIEW CARD */}
                <div className="glass-panel p-5 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div>
                      <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">
                        Today's Dedicated Skill & Study Blocks
                      </span>
                      <h3 className="text-xl font-medium text-white tracking-tight mt-0.5">
                        Skill Time: {activeSkill.name} ({activeSkill.masteryPercentage}% Mastered)
                      </h3>
                      <p className="text-xs text-white/60 mt-0.5">
                        Current Topic: <strong className="text-white">{activeSkill.currentTopic}</strong> • Completed: {activeSkill.completedHours}h / {activeSkill.targetHours}h
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsSkillTrackerOpen(true)}
                        className="px-4 py-2 rounded-full bg-amber-400 text-neutral-900 font-bold text-xs flex items-center gap-1.5 hover:bg-amber-300 shadow-md transition-all"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>Log Skill Session</span>
                      </button>
                    </div>
                  </div>

                  {/* Scheduled After-College Blocks */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {afterCollegeSchedule.slice(1, 4).map((block) => (
                      <div
                        key={block.id}
                        className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-white/70 font-semibold">{block.startTime} - {block.endTime}</span>
                            <span className="text-[10px] text-amber-300 uppercase font-bold">{block.type.replace('_', ' ')}</span>
                          </div>
                          <p className="font-semibold text-white mt-1.5">{block.title}</p>
                          <p className="text-white/50 text-[11px] mt-1 leading-relaxed">{block.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Active Reminders Row */}
                  <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-amber-400 animate-pulse" />
                      <span className="text-white font-medium">Scheduled Reminders for Tonight:</span>
                      <span className="text-white/60">
                        {reminders.filter((r) => !r.isCompleted).length} pending
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('planner')}
                      className="text-xs text-[#E85A9E] hover:underline flex items-center gap-1"
                    >
                      <span>View Full Evening Timetable</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Amber AI Mentor Promo Banner (Section 5.9) */}
                <AmberMentorBanner
                  onAskNow={() => handleOpenAiWithPrompt('What should I study today based on my timetable and focus?')}
                  title="Ask AI Mentor"
                  subtitle="Get exam guidance, revision plans, and timetable-aware answers"
                />

                {/* Metric Tiles with Icon (Section 5.8) + Course Card (Section 5.10) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Metric Tile: Time Remaining */}
                  <div className="glass-tile p-5 flex flex-col justify-between" style={{ minHeight: '170px' }}>
                    <div className="w-12 h-12 rounded-full glass-button flex items-center justify-center text-white/90 mb-4">
                      <Clock className="w-5 h-5 text-[#E85A9E]" />
                    </div>
                    <div>
                      <span className="text-4xl font-medium text-white tracking-tight block">
                        6h 45 m
                      </span>
                      <span className="text-sm font-normal text-white/60 mt-1 block">
                        Remaining Weekly Study Target
                      </span>
                    </div>
                  </div>

                  {/* Metric Tile: Lessons Count */}
                  <div className="glass-tile p-5 flex flex-col justify-between" style={{ minHeight: '170px' }}>
                    <div className="w-12 h-12 rounded-full glass-button flex items-center justify-center text-white/90 mb-4">
                      <Award className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <span className="text-4xl font-medium text-white tracking-tight block">
                        24
                      </span>
                      <span className="text-sm font-normal text-white/60 mt-1 block">
                        Lessons Completed This Term
                      </span>
                    </div>
                  </div>

                  {/* AI Learning Hub Card (Section 5.10) */}
                  <div className="lg:col-span-1">
                    <CourseCard
                      title="AI Learning Hub"
                      meta="24 Lessons • Core B.Tech"
                      onContinue={() => setIsQuizModalOpen(true)}
                    />
                  </div>
                </div>

                {/* Pinned Primary CTA Button: Continue Learning (Section 5.11) */}
                <div className="pt-2 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setIsTimerModalOpen(true)}
                    className="w-full sm:w-auto sm:min-w-[320px] h-13 px-8 rounded-full bg-white text-[#111111] font-semibold text-base flex items-center justify-center gap-2 hover:bg-neutral-100 active:scale-95 transition-all shadow-xl"
                  >
                    <span>Continue Learning</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Daily Planner & Tasks Full View */
              <DailyPlannerView
                tasks={tasks}
                timetable={timetable}
                assignments={assignments}
                homework={homework}
                reminders={reminders}
                afterCollegeSchedule={afterCollegeSchedule}
                activeSkill={activeSkill}
                onToggleTask={handleToggleTask}
                onAddTask={handleAddTask}
                onSubmitAssignment={handleSubmitAssignment}
                onToggleReminder={handleToggleReminder}
                onOpenCheckin={() => setIsAfterCollegeCheckinOpen(true)}
                onOpenSkillTracker={() => setIsSkillTrackerOpen(true)}
              />
            )}
          </>
        )}

        {/* ========================================================= */}
        {/* 2. FACULTY VIEW */}
        {/* ========================================================= */}
        {currentRole === 'faculty' && (
          <FacultyPortalView
            faculty={faculty}
            assignments={assignments}
            onGradeAssignment={handleGradeAssignment}
            onAssignHomework={handleFacultyAssignHomework}
          />
        )}

        {/* ========================================================= */}
        {/* 3. MENTOR / COUNSELOR VIEW */}
        {/* ========================================================= */}
        {currentRole === 'mentor' && (
          <MentorPortalView mentor={mentor} />
        )}

        {/* ========================================================= */}
        {/* 4. ADMIN VIEW */}
        {/* ========================================================= */}
        {currentRole === 'admin' && (
          <AdminPortalView />
        )}
      </main>

      {/* Footer Branding */}
      <footer className="mt-auto py-5 border-t border-white/5 text-center text-xs text-white/40">
        <p>Vignan University Academic Learning Platform • Daily Study Hour Planner & Skill Upscaling Hub</p>
      </footer>

      {/* Floating Action Button for AI Mentor (Section 5.11 FAB) */}
      <button
        type="button"
        onClick={() => handleOpenAiWithPrompt('What should I focus on right now?')}
        aria-label="Ask Aurora AI Mentor"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-tr from-[#7E2548] to-[#E85A9E] text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/30"
        title="Open Aurora AI Mentor"
      >
        <svg viewBox="0 0 48 48" className="w-8 h-8">
          <path d="M12 36 C12 22 16 14 24 14 C32 14 36 22 36 36 Z" fill="#2A1B25" />
          <rect x="17" y="21" width="14" height="10" rx="5" fill="#111" />
          <circle cx="20" cy="26" r="1.8" fill="#3DDC5A" />
          <circle cx="28" cy="26" r="1.8" fill="#3DDC5A" />
        </svg>
      </button>

      {/* ========================================================= */}
      {/* INTERACTIVE MODALS */}
      {/* ========================================================= */}
      <AfterCollegeCheckinModal
        isOpen={isAfterCollegeCheckinOpen}
        onClose={() => setIsAfterCollegeCheckinOpen(false)}
        activeSkill={activeSkill}
        wearable={wearable}
        onScheduleGenerated={handleScheduleGenerated}
      />

      <SkillTimeTrackerModal
        isOpen={isSkillTrackerOpen}
        onClose={() => setIsSkillTrackerOpen(false)}
        skills={skills}
        wearable={wearable}
        onSkillSessionComplete={handleSkillSessionComplete}
      />

      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => {
          setIsAiModalOpen(false);
          setAiInitialPrompt(undefined);
        }}
        student={student}
        activeSkill={activeSkill}
        homework={homework}
        classesToday={classesToday}
        initialPrompt={aiInitialPrompt}
      />

      <StudyTimerModal
        isOpen={isTimerModalOpen}
        onClose={() => setIsTimerModalOpen(false)}
        onSaveSession={handleSaveStudySession}
      />

      <QuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
      />

      <AttendanceDetailsModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        attendanceData={attendance}
      />

      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        announcements={announcements}
      />

      <GoalsModal
        isOpen={isGoalsModalOpen}
        onClose={() => setIsGoalsModalOpen(false)}
        goals={goals}
        onToggleMilestone={handleToggleMilestone}
        onAddGoal={handleAddGoal}
      />
    </div>
  );
}
