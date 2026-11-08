import React, { useState } from 'react';
import {
  UserCheck,
  Zap,
  AlertTriangle,
  MessageSquare,
  CheckCircle,
  Clock,
  Eye,
  BookOpen,
  Calendar,
  Bell,
  X,
  Send,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { MentorProfile } from '../types';

interface MentorPortalViewProps {
  mentor: MentorProfile;
}

interface MenteeDetailed {
  regNo: string;
  name: string;
  department: string;
  cgpa: number;
  attendancePct: number;
  attendanceStatus: 'safe' | 'warning' | 'critical';
  studyFocus: number;
  afterCollegeHoursToday: number;
  activeSkill: string;
  skillHours: number;
  skillMastery: number;
  currentSkillTopic: string;
  pendingHomeworkCount: number;
  homeworkList: string[];
  remindersActive: number;
  lastMeeting: string;
  counselorNotes: string;
}

export const MentorPortalView: React.FC<MentorPortalViewProps> = ({ mentor }) => {
  const [mentees, setMentees] = useState<MenteeDetailed[]>([
    {
      regNo: '211FA04001',
      name: 'Rahul Varma',
      department: 'Computer Science & Engineering (Sec B)',
      cgpa: 8.84,
      attendancePct: 89,
      attendanceStatus: 'safe',
      studyFocus: 84,
      afterCollegeHoursToday: 2.5,
      activeSkill: 'Full-Stack React & Node.js',
      skillHours: 34.5,
      skillMastery: 68,
      currentSkillTopic: 'React Custom Hooks & Context API',
      pendingHomeworkCount: 2,
      homeworkList: ['DAA Dijkstra Shortest Path Problem Set', 'OS Virtual Memory Lab Questions'],
      remindersActive: 3,
      lastMeeting: '2026-10-28',
      counselorNotes: 'High focus stamina during evening revision blocks. Strong progress on React & cloud skills.',
    },
    {
      regNo: '211FA04002',
      name: 'Priya Sharma',
      department: 'Computer Science & Engineering (Sec B)',
      cgpa: 8.42,
      attendancePct: 82,
      attendanceStatus: 'safe',
      studyFocus: 78,
      afterCollegeHoursToday: 2.0,
      activeSkill: 'Data Structures in Java',
      skillHours: 52.0,
      skillMastery: 76,
      currentSkillTopic: 'Red-Black Trees & Binary Heaps',
      pendingHomeworkCount: 1,
      homeworkList: ['CN Subnetting & CIDR Calculation Assignment'],
      remindersActive: 2,
      lastMeeting: '2026-10-25',
      counselorNotes: 'Consistent daily problem solver. Recommended to schedule evening skill time right after college revision.',
    },
    {
      regNo: '211FA04003',
      name: 'Aditya Reddy',
      department: 'Computer Science & Engineering (Sec B)',
      cgpa: 7.65,
      attendancePct: 69,
      attendanceStatus: 'warning',
      studyFocus: 58,
      afterCollegeHoursToday: 1.0,
      activeSkill: 'Cloud & DevOps Essentials',
      skillHours: 18.0,
      skillMastery: 42,
      currentSkillTopic: 'Docker Containers & Multi-stage builds',
      pendingHomeworkCount: 3,
      homeworkList: ['DBMS 3NF Normalization Schema', 'OS Page Replacement Algorithms', 'DAA Graph Search'],
      remindersActive: 4,
      lastMeeting: '2026-10-18',
      counselorNotes: 'Needs support aligning daily college timetable revision with after-college study hours. Attendance warning flag active.',
    },
  ]);

  const [inspectingMentee, setInspectingMentee] = useState<MenteeDetailed | null>(null);
  const [counselorMessage, setCounselorMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!counselorMessage.trim() || !inspectingMentee) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setCounselorMessage('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Counselor Header */}
      <div className="glass-panel p-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold text-[#E85A9E] uppercase tracking-wider">
            Student Guidance & Mentorship Portal
          </span>
          <h2 className="text-2xl font-medium text-white tracking-tight mt-0.5">
            Counselor Focus & Learning Dashboard
          </h2>
          <p className="text-xs text-white/60 mt-1">
            Lead Counselor: <strong className="text-white">{mentor.name}</strong> • Vignan CSE Department
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>Average Mentee Focus: 73%</span>
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-amber-500/15 text-amber-300 text-xs font-semibold border border-amber-500/30">
            1 Student Needs Attendance Support
          </span>
        </div>
      </div>

      {/* Main Student Monitoring Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {mentees.map((student) => {
          const isAtRisk = student.attendanceStatus !== 'safe';

          return (
            <div
              key={student.regNo}
              className={`glass-panel p-5 flex flex-col justify-between transition-all ${
                isAtRisk ? 'border-amber-500/40 bg-white/[0.04]' : 'hover:border-white/30'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/50">{student.regNo}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      student.attendanceStatus === 'safe'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {student.attendancePct}% Attendance
                  </span>
                </div>

                <h3 className="text-lg font-medium text-white mt-1">{student.name}</h3>
                <p className="text-xs text-white/60">CGPA: {student.cgpa} / 10</p>

                {/* Focus & Study Hour Performance Dashboard */}
                <div className="mt-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-white/70">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      Study Focus Index
                    </span>
                    <span className={`font-semibold ${
                      student.studyFocus >= 75 ? 'text-[#3DDC5A]' : 'text-amber-400'
                    }`}>
                      {student.studyFocus}% {student.studyFocus >= 75 ? '(High Focus)' : '(Moderate)'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-white/70">
                      <Clock className="w-3.5 h-3.5 text-[#E85A9E]" />
                      Study Hours Today
                    </span>
                    <span className="text-white font-medium">
                      {student.afterCollegeHoursToday}h logged
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-white/70">
                      <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                      Skill Learning
                    </span>
                    <span className="text-amber-300 font-medium">
                      {student.skillMastery}% ({student.activeSkill})
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-white/70">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      Homework & Reminders
                    </span>
                    <span className="text-white/80">
                      {student.pendingHomeworkCount} pending • {student.remindersActive} reminders
                    </span>
                  </div>
                </div>

                {/* Counselor Notes */}
                <div className="mt-3 text-xs text-white/70 leading-relaxed italic bg-black/20 p-2.5 rounded-xl border border-white/5">
                  "{student.counselorNotes}"
                </div>
              </div>

              {/* View Deep Details Action */}
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-white/40">
                  Last: {student.lastMeeting}
                </span>

                <button
                  type="button"
                  onClick={() => setInspectingMentee(student)}
                  className="px-4 py-1.5 rounded-full bg-white text-neutral-900 text-xs font-semibold flex items-center gap-1.5 hover:bg-neutral-100 transition-colors shadow-sm cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Student Data</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Counselor Deep-Dive Modal */}
      {inspectingMentee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-[32px] glass-panel p-6 border border-white/20 shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[11px] font-semibold text-[#E85A9E] uppercase tracking-wider">
                  Counselor Student Inspection
                </span>
                <h3 className="text-white font-medium text-xl tracking-tight mt-0.5">
                  {inspectingMentee.name} ({inspectingMentee.regNo})
                </h3>
                <p className="text-xs text-white/60">
                  {inspectingMentee.department} • CGPA: {inspectingMentee.cgpa}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setInspectingMentee(null)}
                aria-label="Close inspection"
                className="w-10 h-10 rounded-full glass-button flex items-center justify-center text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comprehensive Focus & Academic Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="glass-tile p-3">
                <span className="text-xs text-white/60 block">Study Focus</span>
                <span className="text-2xl font-bold text-[#3DDC5A] block mt-1">
                  {inspectingMentee.studyFocus}%
                </span>
                <span className="text-[10px] text-white/40">Study Hour Stamina</span>
              </div>
              <div className="glass-tile p-3">
                <span className="text-xs text-white/60 block">Daily Study</span>
                <span className="text-2xl font-bold text-[#E85A9E] block mt-1">
                  {inspectingMentee.afterCollegeHoursToday}h
                </span>
                <span className="text-[10px] text-white/40">Logged Today</span>
              </div>
              <div className="glass-tile p-3">
                <span className="text-xs text-white/60 block">Skill Hours</span>
                <span className="text-2xl font-bold text-amber-300 block mt-1">
                  {inspectingMentee.skillHours}h
                </span>
                <span className="text-[10px] text-white/40">{inspectingMentee.skillMastery}% Mastery</span>
              </div>
              <div className="glass-tile p-3">
                <span className="text-xs text-white/60 block">Attendance</span>
                <span className="text-2xl font-bold text-white block mt-1">
                  {inspectingMentee.attendancePct}%
                </span>
                <span className="text-[10px] text-emerald-400">
                  {inspectingMentee.attendanceStatus === 'safe' ? 'Safe Zone' : 'Needs Support'}
                </span>
              </div>
            </div>

            {/* Dedicated Skill Learning Breakdown */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                  Active Skill Learning Program
                </h4>
                <span className="text-xs text-amber-400 font-bold">
                  {inspectingMentee.skillMastery}% Mastered
                </span>
              </div>
              <div className="text-sm font-semibold text-white">
                {inspectingMentee.activeSkill}
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                Current Learning Topic: <strong className="text-white">{inspectingMentee.currentSkillTopic}</strong>. The student has completed {inspectingMentee.skillHours} hours of practical exercises.
              </p>
            </div>

            {/* Daily Homework & Work Reminders */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h4 className="text-xs font-semibold text-[#E85A9E] uppercase tracking-wider">
                Daily Homework & Pending Works
              </h4>
              <ul className="space-y-1.5 text-xs text-white/80">
                {inspectingMentee.homeworkList.map((hw, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E85A9E]" />
                    <span>{hw}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-white/50 pt-1">
                {inspectingMentee.remindersActive} active reminders set on student's tuition coach timetable.
              </p>
            </div>

            {/* Send Supportive Remark or Reminder */}
            <form onSubmit={handleSendMessage} className="space-y-3 pt-2 border-t border-white/10">
              <label className="text-xs text-white/80 font-medium block">
                Send Counselor Feedback or Supportive Study Directive:
              </label>
              <textarea
                rows={3}
                required
                value={counselorMessage}
                onChange={(e) => setCounselorMessage(e.target.value)}
                placeholder="e.g. Great progress on React hooks! Make sure you finish the DAA Dijkstra problem set during tonight's study hour."
                className="w-full bg-white/5 border border-white/15 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-[#E85A9E]"
              />

              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-400">
                  {messageSent ? '✓ Sent to student dashboard notification feed!' : ''}
                </span>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-[#3DDC5A] text-neutral-900 text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-400 transition-colors shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Study Directive</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
