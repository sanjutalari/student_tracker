import React from 'react';
import { Cpu, ArrowRight } from 'lucide-react';

interface CourseCardProps {
  title?: string;
  meta?: string;
  onContinue?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  title = 'AI & Algorithms Learning Hub',
  meta = '24 Modules • Core B.Tech CS',
  onContinue,
}) => {
  return (
    <div className="glass-panel p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:border-white/25">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* Glowing Neon AI Chip Illustration (Section 5.10 & 5.13) */}
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br from-[#120E24] to-[#1E1128] border border-cyan-400/30 flex items-center justify-center flex-shrink-0 relative overflow-hidden shadow-lg shadow-purple-500/10">
          {/* Subtle neon circuit radial glow */}
          <div className="absolute inset-0 bg-radial from-cyan-500/20 via-transparent to-transparent opacity-80" />
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#E85A9E]/30 rounded-full blur-xl" />

          {/* Stylized Chip Artwork */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-[#A8408F] to-cyan-400 p-0.5 shadow-md">
              <div className="w-full h-full bg-[#0F0A0E] rounded-[10px] flex items-center justify-center">
                <Cpu className="w-7 h-7 text-cyan-300 animate-pulse" />
              </div>
            </div>
            <span className="text-[10px] font-mono text-cyan-300/80 mt-2 tracking-widest uppercase">
              V-CORE AI
            </span>
          </div>
        </div>

        {/* Right Info */}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <span className="text-xs font-medium text-[#E85A9E] tracking-wider uppercase">
            Curriculum Accelerator
          </span>
          <h3 className="text-xl sm:text-2xl font-medium text-white tracking-tight leading-snug mt-1">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            {meta}
          </p>
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-3 text-xs text-white/70">
            <span className="w-2 h-2 rounded-full bg-[#3DDC5A]" />
            <span>Syllabus mapped to Vignan End-Sem Exams</span>
          </div>
        </div>
      </div>

      {/* Bottom Secondary CTA: Glass Pill (Section 5.10 & 5.11) */}
      <button
        onClick={onContinue}
        className="w-full mt-5 h-12 rounded-full glass-button text-white font-medium text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
      >
        <span>Continue Learning</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
