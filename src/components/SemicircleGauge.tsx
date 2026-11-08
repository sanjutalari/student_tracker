import React from 'react';
import { StatTile } from './StatTile';

interface SemicircleGaugeProps {
  progress?: number; // e.g. 68
  label?: string;    // e.g. 'Good'
  stat1: { label1: string; label2?: string; value: string | number; onClick?: () => void };
  stat2: { label1: string; label2?: string; value: string | number; onClick?: () => void };
}

export const SemicircleGauge: React.FC<SemicircleGaugeProps> = ({
  progress = 68,
  label = 'Good',
  stat1,
  stat2,
}) => {
  // Semicircle geometry (180 degrees)
  const width = 280;
  const height = 150;
  const strokeWidth = 8;
  const radius = width / 2 - strokeWidth;
  const arcLength = Math.PI * radius;
  const strokeDashoffset = arcLength - (progress / 100) * arcLength;

  return (
    <div className="glass-panel p-6 flex flex-col items-center">
      {/* Semicircle Gauge */}
      <div className="relative flex flex-col items-center select-none" style={{ width, height: 160 }}>
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible"
        >
          {/* Background Track Arc */}
          <path
            d={`M ${strokeWidth} ${height} A ${radius} ${radius} 0 0 1 ${width - strokeWidth} ${height}`}
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Progress Arc */}
          <path
            d={`M ${strokeWidth} ${height} A ${radius} ${radius} 0 0 1 ${width - strokeWidth} ${height}`}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={strokeWidth}
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Labels */}
        <div className="absolute bottom-2 flex flex-col items-center text-center">
          <span className="text-sm font-normal text-white/60 uppercase tracking-wider mb-0.5">
            {label}
          </span>
          <div className="flex items-baseline">
            <span className="text-5xl font-medium tracking-tight text-white">{progress}%</span>
            <span className="text-sm font-normal text-white/40 ml-1">/100%</span>
          </div>
        </div>
      </div>

      {/* Two Nested Stat Tiles at the Bottom (Section 5.6 & 5.7) */}
      <div className="grid grid-cols-2 gap-3 w-full mt-6">
        <StatTile
          labelLine1={stat1.label1}
          labelLine2={stat1.label2}
          value={stat1.value}
          onClick={stat1.onClick}
        />
        <StatTile
          labelLine1={stat2.label1}
          labelLine2={stat2.label2}
          value={stat2.value}
          onClick={stat2.onClick}
        />
      </div>
    </div>
  );
};
