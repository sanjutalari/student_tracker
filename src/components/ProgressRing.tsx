import React from 'react';
import { Sparkles } from 'lucide-react';

interface ProgressRingProps {
  progress?: number; // 0 - 100, default 79
  size?: number;     // 150
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress = 79,
  size = 150,
}) => {
  const strokeWidthOuter = 4;
  const strokeWidthInner = 10;
  const radiusOuter = (size - strokeWidthOuter * 2) / 2 - 4;
  const radiusInner = radiusOuter - 10;

  const circumferenceOuter = 2 * Math.PI * radiusOuter;
  const circumferenceInner = 2 * Math.PI * radiusInner;

  const strokeDashoffsetOuter = circumferenceOuter - (progress / 100) * circumferenceOuter;
  const strokeDashoffsetInner = circumferenceInner - (progress / 100) * circumferenceInner;

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Outer Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radiusOuter}
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth={strokeWidthOuter}
          fill="none"
        />
        {/* Outer Thin White Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radiusOuter}
          stroke="#FFFFFF"
          strokeWidth={strokeWidthOuter}
          strokeDasharray={circumferenceOuter}
          strokeDashoffset={strokeDashoffsetOuter}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-1000 ease-out"
        />

        {/* Inner Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radiusInner}
          stroke="rgba(232, 90, 158, 0.2)"
          strokeWidth={strokeWidthInner}
          fill="none"
        />
        {/* Inner Thick Pink Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radiusInner}
          stroke="#E85A9E"
          strokeWidth={strokeWidthInner}
          strokeDasharray={circumferenceInner}
          strokeDashoffset={strokeDashoffsetInner}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center White Disc with Pink Icon */}
      <div className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center transform active:scale-95 transition-transform">
        <Sparkles className="w-7 h-7 text-[#E85A9E]" />
      </div>
    </div>
  );
};
