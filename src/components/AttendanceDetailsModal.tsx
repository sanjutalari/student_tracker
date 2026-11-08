import React from 'react';
import { X, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { AttendanceItem } from '../types';
import { calculateSubjectAttendance, calculateOverallAttendance } from '../utils/academic';

interface AttendanceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendanceData: AttendanceItem[];
}

export const AttendanceDetailsModal: React.FC<AttendanceDetailsModalProps> = ({
  isOpen,
  onClose,
  attendanceData,
}) => {
  if (!isOpen) return null;

  const overall = calculateOverallAttendance(
    attendanceData.map((a) => ({
      subjectCode: a.subjectCode,
      subjectName: a.subjectName,
      attendedHours: a.attendedHours,
      totalHours: a.totalHours,
    }))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-[32px] glass-panel p-6 border border-white/20 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-[11px] font-semibold text-[#E85A9E] uppercase tracking-wider">
              Vignan University Attendance Portal
            </span>
            <h3 className="text-white font-medium text-xl tracking-tight mt-0.5">
              Subject-wise Attendance Breakdown
            </h3>
          </div>

          <button
            onClick={onClose}
            aria-label="Close attendance modal"
            className="w-10 h-10 rounded-full glass-button flex items-center justify-center text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overall Summary Card */}
        <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-white/10 to-white/5 border border-white/15 flex items-center justify-between">
          <div>
            <span className="text-xs text-white/60 block">Overall Aggregate Attendance</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-medium text-white">{overall.overallPercentage}%</span>
              <span className="text-xs text-white/50">
                ({overall.totalAttended} / {overall.totalHours} Hours)
              </span>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                overall.status === 'safe'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}
            >
              {overall.status === 'safe' ? 'Eligible for Examinations' : 'Attendance Shortage Warning'}
            </span>
            <span className="text-[11px] text-white/50 block mt-1">
              Minimum 75% required by Vignan policy
            </span>
          </div>
        </div>

        {/* Subjects list */}
        <div className="space-y-3">
          {attendanceData.map((item) => {
            const stats = calculateSubjectAttendance(item.attendedHours, item.totalHours);

            return (
              <div key={item.subjectCode} className="glass-tile p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-[#E85A9E] uppercase">
                      {item.subjectCode}
                    </span>
                    <h4 className="text-sm font-semibold text-white mt-0.5">
                      {item.subjectName}
                    </h4>
                    <p className="text-xs text-white/50 mt-0.5">
                      Faculty: {item.facultyName} • Attended: {item.attendedHours} / {item.totalHours} classes
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-medium text-white block">
                      {stats.percentage}%
                    </span>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold mt-0.5 ${
                        stats.status === 'safe'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {stats.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-white/10 rounded-full h-1.5 my-3 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      stats.status === 'safe' ? 'bg-[#3DDC5A]' : 'bg-amber-400'
                    }`}
                    style={{ width: `${stats.percentage}%` }}
                  />
                </div>

                {/* Safety Rule Note */}
                <div className="flex items-center justify-between text-[11px] text-white/70 pt-2 border-t border-white/5">
                  {stats.canBunkCount > 0 ? (
                    <span className="text-emerald-400">
                      ✓ You can safely miss up to {stats.canBunkCount} upcoming classes.
                    </span>
                  ) : stats.classesNeededFor75 > 0 ? (
                    <span className="text-amber-400">
                      ⚠ Need to attend next {stats.classesNeededFor75} consecutive classes to reach 75%.
                    </span>
                  ) : (
                    <span>Right on the 75% boundary threshold.</span>
                  )}

                  <div className="flex items-center gap-1">
                    {item.recentSessions.map((sess, idx) => (
                      <span
                        key={idx}
                        title={`${sess.date}: ${sess.status}`}
                        className={`w-2.5 h-2.5 rounded-full ${
                          sess.status === 'Present'
                            ? 'bg-[#3DDC5A]'
                            : sess.status === 'Absent'
                            ? 'bg-rose-500'
                            : 'bg-amber-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-white text-neutral-900 text-xs font-semibold hover:bg-neutral-100"
          >
            Close Attendance
          </button>
        </div>
      </div>
    </div>
  );
};
