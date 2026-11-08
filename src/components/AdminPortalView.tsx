import React from 'react';
import {
  Building2,
  Users,
  GraduationCap,
  Calendar,
  Layers,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export const AdminPortalView: React.FC = () => {
  const stats = [
    { label: 'Total Enrolled Students', value: '1,420', sub: 'CSE Department' },
    { label: 'Full-Time Faculty', value: '64', sub: 'PhD & Research Guides' },
    { label: 'Active Sections', value: '4', sub: 'Sections A, B, C, D' },
    { label: 'Average Department Attendance', value: '86.4%', sub: 'Safe institutional zone' },
  ];

  const facultyAllocations = [
    { code: 'CS301', name: 'Design & Analysis of Algorithms', faculty: 'Dr. K. Sravan', credits: 4, section: 'Sec B' },
    { code: 'CS302', name: 'Operating Systems', faculty: 'Dr. K. Sravan', credits: 3, section: 'Sec B' },
    { code: 'CS303', name: 'Computer Networks', faculty: 'Prof. M. Lakshmi', credits: 3, section: 'Sec B' },
    { code: 'CS304', name: 'Database Management Systems', faculty: 'Dr. P. Ramesh', credits: 4, section: 'Sec B' },
    { code: 'CS305', name: 'Web Technologies & Cloud', faculty: 'Prof. Ananya Rao', credits: 3, section: 'Sec B' },
  ];

  const auditEvents = [
    { time: '10:45 AM Today', action: 'Dean of Academics published End-Sem 2026 Examination Guidelines', user: 'dean.acad@vignan.ac.in' },
    { time: '09:15 AM Today', action: 'Dr. K. Sravan submitted Period 1 Attendance for CS301 (Sec B)', user: 'sravan.k@vignan.ac.in' },
    { time: 'Yesterday', action: 'Wearable BLE Telemetry Gateway connected to Campus Cloud cluster', user: 'iot.admin@vignan.ac.in' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Admin Summary Banner */}
      <div className="glass-panel p-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold text-[#E85A9E] uppercase tracking-wider">
            Vignan University Administration Portal
          </span>
          <h2 className="text-2xl font-medium text-white tracking-tight mt-0.5">
            Institutional Operations & ERP
          </h2>
          <p className="text-xs text-white/60 mt-1">
            VFSTR Vadlamudi Campus • School of Computing & Informatics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Academic Term 2026-27 Active</span>
          </span>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => (
          <div key={idx} className="glass-tile p-4">
            <span className="text-xs font-normal text-white/60 block">{item.label}</span>
            <span className="text-3xl font-medium text-white tracking-tight mt-1 block">
              {item.value}
            </span>
            <span className="text-[11px] text-white/40 mt-1 block">{item.sub}</span>
          </div>
        ))}
      </div>

      {/* Hierarchy & Faculty Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#E85A9E]" />
              <span>Current Faculty Course Allocations (Semester 6)</span>
            </h3>
            <span className="text-xs text-white/50">Section B</span>
          </div>

          <div className="space-y-2.5">
            {facultyAllocations.map((fa, idx) => (
              <div
                key={idx}
                className="glass-tile p-3.5 flex items-center justify-between text-xs transition-colors hover:bg-white/10"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{fa.code}</span>
                    <span className="text-white/80">{fa.name}</span>
                  </div>
                  <span className="text-white/50 mt-0.5 block">
                    Allocated Faculty: <strong className="text-white font-medium">{fa.faculty}</strong> • {fa.credits} Credits
                  </span>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/80 font-medium text-[11px]">
                  {fa.section}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Institutional Structure & Audit Log */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>Campus Hierarchy</span>
            </h3>

            <div className="space-y-2 text-xs text-white/80 mb-6">
              <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between">
                <span>Institution:</span>
                <span className="font-medium text-white">Vignan University</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between">
                <span>Campus:</span>
                <span className="font-medium text-white">Vadlamudi Main Campus</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between">
                <span>Department:</span>
                <span className="font-medium text-white">Computer Science & Eng.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between">
                <span>Active Semester:</span>
                <span className="font-medium text-white">Year 3 / Sem 6</span>
              </div>
            </div>

            <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
              Recent System Audit Log
            </h4>
            <div className="space-y-2">
              {auditEvents.map((evt, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-white/5 text-[11px] text-white/70">
                  <span className="font-semibold text-white block">{evt.action}</span>
                  <span className="text-white/40 block mt-0.5">
                    {evt.time} • {evt.user}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
