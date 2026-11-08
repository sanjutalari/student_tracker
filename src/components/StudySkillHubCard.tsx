import React from 'react';
import {
  BookOpen,
  Zap,
  CheckCircle2,
  Clock,
  Play,
  Calendar,
  Layers,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';
import { SkillTracker, TimetableSlot, HomeworkItem } from '../types';

interface StudySkillHubCardProps {
  selectedDay: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  onSelectDay: (day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday') => void;
  activeSkill: SkillTracker;
  classesToday: TimetableSlot[];
  homeworkToday: HomeworkItem[];
  studyMinutesToday: number;
  onStartStudySession: () => void;
  onOpenSkillTracker: () => void;
  onOpenCheckin: () => void;
}

export const StudySkillHubCard: React.FC<StudySkillHubCardProps> = ({
  selectedDay,
  onSelectDay,
  activeSkill,
  classesToday,
  homeworkToday,
  studyMinutesToday,
  onStartStudySession,
  onOpenSkillTracker,
  onOpenCheckin,
}) => {
  const days: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'> = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const targetMinutes = 210; // 3.5 hours evening target
  const studyHoursDisplay = `${Math.floor(studyMinutesToday / 60)}h ${studyMinutesToday % 60}m`;
  const studyProgressPct = Math.min(100, Math.round((studyMinutesToday / targetMinutes) * 100));

  const completedHwCount = homeworkToday.filter((h) => h.completed).length;

  return (
    <div className="glass-panel p-5 sm:p-6 transition-all duration-300 border border-white/20">
      {/* Header: Title & Dynamic Day-of-the-Week Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7E2548] to-[#E85A9E] flex items-center justify-center text-white shadow-md">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-white text-base sm:text-lg font-medium tracking-tight">
                Daily Study Hour & Skill Upscaling Hub
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                DAY-ADAPTIVE
              </span>
            </div>
            <p className="text-xs text-white/50">
              Study plan and skill hours dynamically adjust according to today's college timetable
            </p>
          </div>
        </div>

        {/* Dynamic Day Selector (Day changes the day of the week according to class timetable) */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10 overflow-x-auto max-w-full">
          {days.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => onSelectDay(day)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDay === day
                  ? 'bg-white text-neutral-900 shadow-md font-bold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Study & Skill Metrics (Purely Tracking Study, Skills, and What He's Studying) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-5">
        {/* Metric 1: Today's Study Hour Goal */}
        <div className="glass-tile p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-normal text-white/60">Today's Study Hours</span>
            <Clock className="w-4 h-4 text-[#E85A9E]" />
          </div>
          <div className="mt-2">
            <span className="text-3xl font-medium text-white tracking-tight">
              {studyHoursDisplay}
            </span>
            <span className="text-[11px] text-white/50 block mt-0.5">
              Goal: 3h 30m / evening
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-[#E85A9E] h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${studyProgressPct}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Active Skill Being Upscaled */}
        <div
          onClick={onOpenSkillTracker}
          className="glass-tile p-4 flex flex-col justify-between cursor-pointer hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-normal text-white/60">Active Skill Upscaling</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <span className="text-lg font-semibold text-white tracking-tight line-clamp-1">
              {activeSkill.name}
            </span>
            <span className="text-xs text-amber-300 font-medium block mt-0.5">
              {activeSkill.masteryPercentage}% Mastery • {activeSkill.completedHours}h logged
            </span>
          </div>
          <span className="text-[10px] text-white/40 block mt-2 truncate">
            Topic: {activeSkill.currentTopic}
          </span>
        </div>

        {/* Metric 3: Today's Academic Classes to Revise */}
        <div className="glass-tile p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-normal text-white/60">
              {selectedDay}'s Classes
            </span>
            <BookOpen className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2">
            <span className="text-3xl font-medium text-white tracking-tight">
              {classesToday.length}
            </span>
            <span className="text-xs text-white/50 font-normal ml-1">Classes</span>
            <p className="text-[11px] text-white/70 mt-1 line-clamp-1">
              {classesToday.map((c) => c.subjectCode).join(', ') || 'No classes today'}
            </p>
          </div>
          <span className="text-[10px] text-cyan-300 block mt-2">
            Mapped for evening revision
          </span>
        </div>

        {/* Metric 4: Daily Homework & Works */}
        <div className="glass-tile p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-normal text-white/60">Homework & Works</span>
            <CheckCircle2 className="w-4 h-4 text-[#3DDC5A]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-medium text-white tracking-tight">
              {completedHwCount}
            </span>
            <span className="text-sm text-white/50 font-normal">
              / {homeworkToday.length} Done
            </span>
          </div>
          <div className="text-[11px] text-white/60 mt-2 truncate">
            {homeworkToday.length - completedHwCount > 0 ? (
              <span className="text-amber-400 font-medium">
                {homeworkToday.length - completedHwCount} works due tonight
              </span>
            ) : (
              <span className="text-emerald-400 font-medium">All works completed!</span>
            )}
          </div>
        </div>
      </div>

      {/* Tuition Teacher Daily Advice & Timetable Alignment */}
      <div className="mt-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#E85A9E] animate-ping" />
          <span className="text-white/85">
            <strong>Tuition Teacher Schedule ({selectedDay}):</strong> Classes ended at 3:30 PM.
            Tonight's study hour focuses on{' '}
            <strong className="text-white">
              {classesToday.slice(0, 2).map((c) => c.subjectName).join(' & ') || 'Course Consolidation'}
            </strong>{' '}
            followed by 1 hour dedicated skill time on{' '}
            <strong className="text-amber-300">{activeSkill.name}</strong>.
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenCheckin}
          className="text-xs text-[#E85A9E] hover:underline font-semibold whitespace-nowrap ml-auto"
        >
          Check-in with Tuition Teacher →
        </button>
      </div>

      {/* Bottom Actions */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSkillTracker}
            className="px-4 py-2 rounded-full glass-button text-xs text-white/80 hover:text-white flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-amber-300" />
            <span>Manage Skills ({activeSkill.name})</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onStartStudySession}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-neutral-900 text-xs font-bold hover:bg-neutral-100 active:scale-95 transition-all shadow-md ml-auto"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Start Study Hour Session</span>
        </button>
      </div>
    </div>
  );
};
