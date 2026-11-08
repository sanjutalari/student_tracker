import React, { useState } from 'react';
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  BookOpen,
  Award,
  Send,
  Check,
  PlusCircle,
  FilePlus,
} from 'lucide-react';
import { FacultyProfile, Assignment, HomeworkItem } from '../types';

interface FacultyPortalViewProps {
  faculty: FacultyProfile;
  assignments: Assignment[];
  onGradeAssignment: (assignmentId: string, marks: number, grade: string, feedback: string) => void;
  onAssignHomework?: (homework: HomeworkItem) => void;
}

export const FacultyPortalView: React.FC<FacultyPortalViewProps> = ({
  faculty,
  assignments,
  onGradeAssignment,
  onAssignHomework,
}) => {
  const [selectedClass, setSelectedClass] = useState('CS301 - DAA (Sec B)');
  const [attendanceDate, setAttendanceDate] = useState('2026-11-08');
  const [attendancePeriod, setAttendancePeriod] = useState('1');

  // Enrolled students for Section B
  const [studentsRoster, setStudentsRoster] = useState([
    { regNo: '211FA04001', name: 'Rahul Varma', status: 'Present' },
    { regNo: '211FA04002', name: 'Priya Sharma', status: 'Present' },
    { regNo: '211FA04003', name: 'Aditya Reddy', status: 'Present' },
    { regNo: '211FA04004', name: 'Sneha Patel', status: 'Absent' },
    { regNo: '211FA04005', name: 'Karthik Raju', status: 'Present' },
    { regNo: '211FA04006', name: 'Divya Rao', status: 'Late' },
  ]);

  const [attendanceSubmitted, setAttendanceSubmitted] = useState(false);

  // Grading modal state
  const [gradingAssignmentId, setGradingAssignmentId] = useState<string | null>(null);
  const [gradeMarks, setGradeMarks] = useState(19);
  const [gradeLetter, setGradeLetter] = useState('A+');
  const [gradeFeedback, setGradeFeedback] = useState('Well executed algorithmic proof and clean code.');

  // Create Homework state
  const [isCreatingHw, setIsCreatingHw] = useState(false);
  const [hwSubject, setHwSubject] = useState('CS301 - DAA');
  const [hwTitle, setHwTitle] = useState('');
  const [hwInstructions, setHwInstructions] = useState('');
  const [hwDueDate, setHwDueDate] = useState('2026-11-09');
  const [hwMinutes, setHwMinutes] = useState('45');
  const [hwAssignedSuccess, setHwAssignedSuccess] = useState(false);

  const toggleStudentStatus = (regNo: string) => {
    setStudentsRoster((prev) =>
      prev.map((s) => {
        if (s.regNo === regNo) {
          const nextStatus = s.status === 'Present' ? 'Absent' : s.status === 'Absent' ? 'Late' : 'Present';
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  const handleMarkAllPresent = () => {
    setStudentsRoster((prev) => prev.map((s) => ({ ...s, status: 'Present' })));
  };

  const handleSubmitAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    setAttendanceSubmitted(true);
    setTimeout(() => setAttendanceSubmitted(false), 4000);
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingAssignmentId) return;
    onGradeAssignment(gradingAssignmentId, gradeMarks, gradeLetter, gradeFeedback);
    setGradingAssignmentId(null);
  };

  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwTitle.trim()) return;

    if (onAssignHomework) {
      onAssignHomework({
        id: `hw-fac-${Date.now()}`,
        title: hwTitle.trim(),
        subject: hwSubject,
        assignedByFaculty: faculty.name,
        dueDate: hwDueDate,
        estimatedMinutes: parseInt(hwMinutes, 10) || 45,
        reminderSet: true,
        completed: false,
        instructions: hwInstructions.trim(),
      });
    }

    setHwAssignedSuccess(true);
    setTimeout(() => {
      setHwAssignedSuccess(false);
      setIsCreatingHw(false);
      setHwTitle('');
      setHwInstructions('');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Faculty Header Card */}
      <div className="glass-panel p-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={faculty.avatarUrl}
            alt={faculty.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-white/30"
          />
          <div>
            <span className="text-[11px] font-semibold text-[#E85A9E] uppercase tracking-wider">
              {faculty.designation} • {faculty.department}
            </span>
            <h2 className="text-2xl font-medium text-white tracking-tight mt-0.5">
              {faculty.name}
            </h2>
            <p className="text-xs text-white/60 mt-1">
              Faculty ID: {faculty.facultyId} • {faculty.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCreatingHw(true)}
            className="px-4 py-2 rounded-full bg-[#E85A9E] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-[#d64a8d] shadow-md transition-all active:scale-95"
          >
            <FilePlus className="w-4 h-4" />
            <span>Assign Homework to Students</span>
          </button>
        </div>
      </div>

      {/* Homework Creation Drawer */}
      {isCreatingHw && (
        <form
          onSubmit={handleCreateHomework}
          className="p-6 rounded-3xl glass-panel border border-[#E85A9E]/40 space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div>
              <h3 className="text-base font-semibold text-white">
                Assign Today's After-College Homework
              </h3>
              <p className="text-xs text-white/60">
                This will automatically schedule reminders and feed into the student's study timetable.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsCreatingHw(false)}
              className="text-white/60 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-white/70 block mb-1">Subject:</label>
              <select
                value={hwSubject}
                onChange={(e) => setHwSubject(e.target.value)}
                className="w-full bg-neutral-900 border border-white/20 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="CS301 - DAA">CS301 - Design & Analysis of Algorithms</option>
                <option value="CS302 - OS">CS302 - Operating Systems</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-white/70 block mb-1">Homework Title:</label>
              <input
                type="text"
                required
                value={hwTitle}
                onChange={(e) => setHwTitle(e.target.value)}
                placeholder="e.g. Implement Dijkstra Algorithm & write proof"
                className="w-full bg-neutral-900 border border-white/20 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs text-white/70 block mb-1">Due Date & Est. Time:</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={hwDueDate}
                  onChange={(e) => setHwDueDate(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/20 rounded-xl px-2 py-2 text-xs text-white"
                />
                <input
                  type="number"
                  value={hwMinutes}
                  onChange={(e) => setHwMinutes(e.target.value)}
                  placeholder="Mins"
                  className="w-20 bg-neutral-900 border border-white/20 rounded-xl px-2 py-2 text-xs text-white text-center"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs text-white/70 block mb-1">Instructions / Problem Details:</label>
            <textarea
              rows={2}
              value={hwInstructions}
              onChange={(e) => setHwInstructions(e.target.value)}
              placeholder="State test cases, graph weights, and expected submission format..."
              className="w-full bg-neutral-900 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-white text-neutral-900 text-xs font-semibold hover:bg-neutral-100 shadow-md"
            >
              {hwAssignedSuccess ? 'Assigned & Reminders Scheduled!' : 'Broadcast Homework & Reminders'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Recording Module (Section 8.6) */}
        <div className="lg:col-span-2 glass-panel p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-white/10">
            <div>
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#E85A9E]" />
                <span>Class Attendance Roster</span>
              </h3>
              <p className="text-xs text-white/50">
                Official period recording for Vignan academic records.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleMarkAllPresent}
                className="px-3 py-1.5 rounded-full glass-button text-xs text-white/80 hover:text-white"
              >
                Mark All Present
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmitAttendance} className="space-y-4">
            {/* Filter controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-white/60 block mb-1">Class / Section:</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/20 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="CS301 - DAA (Sec B)">CS301 - DAA (Sec B)</option>
                  <option value="CS302 - OS (Sec B)">CS302 - OS (Sec B)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-white/60 block mb-1">Date:</label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/20 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-white/60 block mb-1">Period:</label>
                <select
                  value={attendancePeriod}
                  onChange={(e) => setAttendancePeriod(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/20 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="1">Period 1 (08:15 - 09:15)</option>
                  <option value="2">Period 2 (09:15 - 10:15)</option>
                  <option value="3">Period 3 (10:30 - 11:30)</option>
                  <option value="5">Period 5 Lab (01:30 - 03:30)</option>
                </select>
              </div>
            </div>

            {/* Students table */}
            <div className="space-y-2 mt-4 max-h-80 overflow-y-auto pr-1">
              {studentsRoster.map((s) => (
                <div
                  key={s.regNo}
                  className="glass-tile p-3 flex items-center justify-between text-xs transition-colors"
                >
                  <div>
                    <span className="font-semibold text-white block">{s.name}</span>
                    <span className="text-[11px] text-white/50">{s.regNo}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleStudentStatus(s.regNo)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        s.status === 'Present'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : s.status === 'Absent'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {s.status === 'Present' && <CheckCircle className="w-3.5 h-3.5" />}
                      {s.status === 'Absent' && <XCircle className="w-3.5 h-3.5" />}
                      {s.status === 'Late' && <Clock className="w-3.5 h-3.5" />}
                      <span>{s.status}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit button */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-white/60">
                Present: {studentsRoster.filter((s) => s.status === 'Present').length} / {studentsRoster.length}
              </span>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-white text-neutral-900 text-xs font-semibold flex items-center gap-2 hover:bg-neutral-100 active:scale-95 transition-all shadow-md"
              >
                {attendanceSubmitted ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Attendance Submitted!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Official Attendance</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Pending Evaluations Module (Section 8.7) */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-1">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Assignment Evaluations</span>
            </h3>
            <p className="text-xs text-white/50 mb-4">
              Review submissions from B.Tech students.
            </p>

            <div className="space-y-3">
              {assignments.map((asg) => (
                <div key={asg.id} className="glass-tile p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#E85A9E]">
                      {asg.subjectCode}
                    </span>
                    <span className="text-[10px] text-white/50">{asg.status}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white mt-1 leading-snug">
                    {asg.title}
                  </h4>

                  {asg.status === 'Submitted' ? (
                    <button
                      onClick={() => {
                        setGradingAssignmentId(asg.id);
                        setGradeMarks(asg.maxMarks - 2);
                      }}
                      className="mt-3 w-full py-1.5 rounded-full bg-white text-neutral-900 text-[11px] font-semibold hover:bg-neutral-100"
                    >
                      Evaluate Submission
                    </button>
                  ) : asg.status === 'Evaluated' ? (
                    <div className="mt-2 text-[11px] text-emerald-400 font-medium">
                      Marks: {asg.marksObtained}/{asg.maxMarks} (Grade: {asg.grade})
                    </div>
                  ) : (
                    <span className="mt-2 block text-[11px] text-amber-400">
                      Pending student submission
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grading Modal */}
      {gradingAssignmentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form
            onSubmit={handleSaveGrade}
            className="w-full max-w-md rounded-3xl glass-panel p-6 border border-white/20 shadow-2xl space-y-4"
          >
            <h3 className="text-lg font-semibold text-white">Evaluate Student Submission</h3>
            <p className="text-xs text-white/60">
              Rahul Varma (211FA04001) - Attached File: rahul_dbms_er_v1.pdf
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/70 block mb-1">Marks Obtained (Max 30):</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={gradeMarks}
                  onChange={(e) => setGradeMarks(parseInt(e.target.value, 10))}
                  className="w-full bg-neutral-900 border border-white/20 rounded-2xl px-4 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs text-white/70 block mb-1">Letter Grade:</label>
                <select
                  value={gradeLetter}
                  onChange={(e) => setGradeLetter(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/20 rounded-2xl px-3 py-2 text-xs text-white"
                >
                  <option value="O">O (Outstanding)</option>
                  <option value="A+">A+ (Excellent)</option>
                  <option value="A">A (Very Good)</option>
                  <option value="B+">B+ (Good)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-white/70 block mb-1">Feedback to Student:</label>
              <textarea
                rows={3}
                value={gradeFeedback}
                onChange={(e) => setGradeFeedback(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-2xl p-3 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setGradingAssignmentId(null)}
                className="px-4 py-2 rounded-full glass-button text-xs text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[#3DDC5A] text-neutral-900 text-xs font-semibold hover:bg-emerald-400"
              >
                Publish Marks & Feedback
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
