import React from 'react';
import { Bell, ArrowLeft, Shield, GraduationCap, Users, UserCheck } from 'lucide-react';
import { UserRole, StudentProfile } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  student: StudentProfile;
  activeTab: string;
  onBack?: () => void;
  showBack?: boolean;
  unreadCount?: number;
  onOpenNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  student,
  activeTab,
  onBack,
  showBack = false,
  unreadCount = 2,
  onOpenNotifications,
}) => {
  return (
    <header className="sticky top-0 z-30 px-4 sm:px-6 py-3 backdrop-blur-xl bg-[#0F0A0E]/70 border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Back or Brand Title */}
        <div className="flex items-center gap-3">
          {showBack ? (
            <button
              onClick={onBack}
              aria-label="Go back"
              className="w-12 h-12 rounded-full glass-button flex items-center justify-center text-white cursor-pointer active:scale-95 transition-transform"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7E2548] to-[#E85A9E] flex items-center justify-center shadow-lg shadow-[#E85A9E]/20 border border-white/20">
                <span className="font-extrabold text-white text-lg tracking-wider">V</span>
              </div>
              <div>
                <h1 className="text-white text-base sm:text-lg font-semibold tracking-tight leading-none">
                  Vignan ERP
                </h1>
                <span className="text-[11px] text-white/50 tracking-wide font-medium">
                  {currentRole.toUpperCase()} PORTAL
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Center: Role Switcher Tabs */}
        <div className="flex items-center bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md">
          <button
            onClick={() => onRoleChange('student')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              currentRole === 'student'
                ? 'bg-white text-neutral-900 shadow-md font-semibold'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Student</span>
          </button>
          <button
            onClick={() => onRoleChange('faculty')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              currentRole === 'faculty'
                ? 'bg-white text-neutral-900 shadow-md font-semibold'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Faculty</span>
          </button>
          <button
            onClick={() => onRoleChange('mentor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              currentRole === 'mentor'
                ? 'bg-white text-neutral-900 shadow-md font-semibold'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mentor</span>
          </button>
          <button
            onClick={() => onRoleChange('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              currentRole === 'admin'
                ? 'bg-white text-neutral-900 shadow-md font-semibold'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>

        {/* Right: Notifications & Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenNotifications}
            aria-label="Open notifications"
            className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full glass-button flex items-center justify-center text-white cursor-pointer active:scale-95 transition-transform"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-[#E85A9E] ring-2 ring-[#0F0A0E] animate-pulse" />
            )}
          </button>

          <div className="flex items-center gap-2 pl-1">
            <div className="relative">
              <img
                src={student.avatarUrl}
                alt={student.name}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-white/70 shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#3DDC5A] ring-2 ring-[#0F0A0E]" />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-medium text-white leading-tight">{student.name}</p>
              <p className="text-[11px] text-white/50">{student.regNo}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
