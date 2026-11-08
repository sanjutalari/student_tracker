import React from 'react';
import { GraduationCap } from 'lucide-react';

interface AmberMentorBannerProps {
  onAskNow: () => void;
  title?: string;
  subtitle?: string;
}

export const AmberMentorBanner: React.FC<AmberMentorBannerProps> = ({
  onAskNow,
  title = 'AI Tuition Teacher & Study Coach',
  subtitle = 'Reviewing your daily timetable, reminding you of homework, and upscaling your skills',
}) => {
  return (
    <div
      className="amber-banner p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 transition-transform active:scale-[0.99] cursor-pointer"
      onClick={onAskNow}
    >
      {/* Left: 3D Tuition Teacher Mascot in glass container */}
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <div className="w-14 h-14 rounded-2xl bg-black/30 border border-white/25 flex items-center justify-center flex-shrink-0 shadow-inner relative overflow-hidden">
          <svg viewBox="0 0 48 48" className="w-10 h-10">
            {/* Academic mortarboard & hoodie */}
            <path
              d="M10 38 C10 20 14 10 24 10 C34 10 38 20 38 38 C32 41 16 41 10 38 Z"
              fill="#2A2428"
            />
            {/* Hood opening */}
            <ellipse cx="24" cy="25" rx="10" ry="12" fill="#0F0A0E" />
            {/* Visor face */}
            <rect x="16" y="18" width="16" height="13" rx="6" fill="#151515" />
            {/* Glowing friendly eyes */}
            <circle cx="20" cy="24" r="2.2" fill="#E85A9E" className="animate-pulse" />
            <circle cx="28" cy="24" r="2.2" fill="#E85A9E" className="animate-pulse" />
            {/* Teacher Mortarboard cap */}
            <polygon points="24,6 40,13 24,20 8,13" fill="#D9759F" opacity="0.9" />
          </svg>
        </div>

        {/* Center: Title + Subtitle */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-white/90" />
            <h3 className="text-xl sm:text-2xl font-medium text-white tracking-tight leading-tight truncate">
              {title}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-white/85 mt-0.5 line-clamp-2 leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: Compact White Pill CTA Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onAskNow();
        }}
        className="px-5 py-2.5 rounded-full bg-white text-[#111111] text-sm font-semibold tracking-normal hover:bg-neutral-100 active:scale-95 transition-all shadow-md flex-shrink-0 whitespace-nowrap"
      >
        Ask Tuition Teacher
      </button>
    </div>
  );
};
