import React from 'react';
import { BookOpen } from 'lucide-react';
import { ProgressRing } from './ProgressRing';

interface MauveHeroCardProps {
  percentage?: number;
  label?: string;
  subtext?: string;
  onContinue?: () => void;
}

export const MauveHeroCard: React.FC<MauveHeroCardProps> = ({
  percentage = 79,
  label = 'Academic Mastery',
  subtext = "You're doing great",
  onContinue,
}) => {
  return (
    <div className="mauve-hero-card p-6 relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between gap-4">
        {/* Left side content */}
        <div className="flex flex-col justify-between self-stretch">
          {/* Top chip */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/30 text-white w-fit shadow-sm">
            <BookOpen className="w-4 h-4 text-white" />
            <span className="text-xs font-medium tracking-wide uppercase">{label}</span>
          </div>

          {/* Bottom metric */}
          <div className="mt-8">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl sm:text-6xl font-medium text-white tracking-tight">
                {percentage}%
              </span>
            </div>
            <p className="text-sm font-normal text-white/90 mt-1 tracking-wide">
              {subtext}
            </p>
          </div>
        </div>

        {/* Right side progress ring */}
        <div className="flex-shrink-0 cursor-pointer" onClick={onContinue} title="Click to view learning roadmaps">
          <ProgressRing progress={percentage} size={145} />
        </div>
      </div>
    </div>
  );
};
