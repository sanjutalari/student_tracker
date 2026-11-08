import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface StatTileProps {
  labelLine1: string;
  labelLine2?: string;
  value: string | number;
  subValue?: string;
  onClick?: () => void;
  accentColor?: string;
}

export const StatTile: React.FC<StatTileProps> = ({
  labelLine1,
  labelLine2,
  value,
  subValue,
  onClick,
  accentColor,
}) => {
  return (
    <div
      onClick={onClick}
      className={`glass-tile p-5 flex flex-col justify-between transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:bg-white/10 active:scale-[0.98]' : ''
      }`}
      style={{ minHeight: '120px' }}
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-2">
        <div className="text-sm font-normal text-white/70 leading-snug">
          <div>{labelLine1}</div>
          {labelLine2 && <div>{labelLine2}</div>}
        </div>

        {onClick && (
          <button
            type="button"
            aria-label={`Open details for ${labelLine1}`}
            className="w-8 h-8 rounded-full glass-button flex items-center justify-center text-white/90 hover:text-white transition-colors"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Bottom Big Metric */}
      <div className="mt-3 flex items-baseline gap-1.5">
        <span
          className="text-4xl font-medium tracking-tight text-white"
          style={accentColor ? { color: accentColor } : undefined}
        >
          {value}
        </span>
        {subValue && (
          <span className="text-sm font-normal text-white/50">{subValue}</span>
        )}
      </div>
    </div>
  );
};
