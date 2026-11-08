import React, { useState, useEffect } from 'react';
import {
  Heart,
  Activity,
  Zap,
  Moon,
  Bluetooth,
  RefreshCw,
  Play,
  Sliders,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { WearableMetrics, WearableSimulationMode } from '../types';
import { getFatigueRisk } from '../utils/wearable';

interface WearableTelemetryCardProps {
  metrics: WearableMetrics;
  onUpdateMode: (mode: WearableSimulationMode) => void;
  onStartStudySession: () => void;
  onToggleConnection: () => void;
}

export const WearableTelemetryCard: React.FC<WearableTelemetryCardProps> = ({
  metrics,
  onUpdateMode,
  onStartStudySession,
  onToggleConnection,
}) => {
  const [activeMode, setActiveMode] = useState<WearableSimulationMode>('normal');
  const [recentBpm, setRecentBpm] = useState<number[]>([70, 72, 71, 74, 72, 73, 72]);

  // Append new heart rate point to sparkline
  useEffect(() => {
    setRecentBpm((prev) => [...prev.slice(-12), metrics.heartRate]);
  }, [metrics.heartRate]);

  const handleModeChange = (mode: WearableSimulationMode) => {
    setActiveMode(mode);
    onUpdateMode(mode);
  };

  const fatigue = getFatigueRisk(metrics.activeMinutesToday, metrics.stressScore);

  return (
    <div className="wearable-glow-card p-5 sm:p-6 transition-all duration-300">
      {/* Header Row: Device Brand & Bluetooth Status */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#E85A9E]/20 border border-[#E85A9E]/40 flex items-center justify-center text-[#E85A9E]">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-white text-base font-medium tracking-tight">
                {metrics.deviceName}
              </h3>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${
                  metrics.isConnected
                    ? 'bg-[#3DDC5A]/15 text-[#3DDC5A] border border-[#3DDC5A]/30'
                    : 'bg-red-500/15 text-red-400 border border-red-500/30'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    metrics.isConnected ? 'bg-[#3DDC5A]' : 'bg-red-400'
                  }`}
                />
                {metrics.isConnected ? 'SYNCED' : 'OFFLINE'}
              </span>
            </div>
            <p className="text-xs text-white/50">
              BLE 5.3 Low Energy • Battery: {metrics.batteryPct}%
            </p>
          </div>
        </div>

        {/* Action button to toggle / reconnect Bluetooth */}
        <button
          onClick={onToggleConnection}
          className="px-3 py-1.5 rounded-full glass-button text-xs font-medium text-white/80 hover:text-white flex items-center gap-1.5"
          title="Toggle BLE Connection"
        >
          <Bluetooth className="w-3.5 h-3.5 text-[#E85A9E]" />
          <span>{metrics.isConnected ? 'Disconnect' : 'Connect'}</span>
        </button>
      </div>

      {/* Main Grid: Biometric Telemetry */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-5">
        {/* Heart Rate Tile */}
        <div className="glass-tile p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-normal text-white/60">Heart Rate</span>
            <Heart className="w-4 h-4 text-[#E85A9E] animate-heart-pulse fill-[#E85A9E]/40" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-medium text-white tracking-tight">
              {metrics.heartRate}
            </span>
            <span className="text-xs text-white/50 font-normal">BPM</span>
          </div>
          {/* Mini Sparkline */}
          <div className="h-4 flex items-end gap-0.5 mt-2 opacity-80">
            {recentBpm.map((val, idx) => {
              const heightPct = Math.min(100, Math.max(20, (val - 50) * 2));
              return (
                <div
                  key={idx}
                  className="flex-1 rounded-t-sm bg-gradient-to-t from-[#E85A9E]/40 to-[#E85A9E]"
                  style={{ height: `${heightPct}%` }}
                />
              );
            })}
          </div>
        </div>

        {/* Focus Score Tile */}
        <div className="glass-tile p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-normal text-white/60">Cognitive Focus</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-medium text-white tracking-tight">
              {metrics.focusScore}%
            </span>
            <span className="text-[11px] text-[#3DDC5A] font-medium ml-1">
              {metrics.focusScore >= 75 ? 'Optimal' : metrics.focusScore >= 50 ? 'Steady' : 'Fatigued'}
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-[#E85A9E] h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${metrics.focusScore}%` }}
            />
          </div>
        </div>

        {/* HRV & Stress Tile */}
        <div className="glass-tile p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-normal text-white/60">HRV (Autonomic)</span>
            <Sliders className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-medium text-white tracking-tight">
              {metrics.hrvMs}
            </span>
            <span className="text-xs text-white/50 font-normal">ms</span>
          </div>
          <div className="text-[11px] text-white/60 mt-2 truncate">
            Stress index: <span className="text-white font-medium">{metrics.stressScore}/100</span>
          </div>
        </div>

        {/* Sleep & Restorative Tile */}
        <div className="glass-tile p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-normal text-white/60">Sleep Recovery</span>
            <Moon className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-medium text-white tracking-tight">
              {metrics.sleepHours}
            </span>
            <span className="text-xs text-white/50 font-normal">hrs</span>
          </div>
          <div className="text-[11px] text-white/60 mt-2">
            Restful index: <span className="text-[#3DDC5A] font-medium">{metrics.sleepQualityScore}%</span>
          </div>
        </div>
      </div>

      {/* Fatigue Warning or Status Banner */}
      <div
        className={`mt-4 p-3 rounded-2xl flex items-center justify-between gap-3 text-xs ${
          fatigue.risk === 'high'
            ? 'bg-rose-500/15 border border-rose-500/30 text-rose-200'
            : fatigue.risk === 'moderate'
            ? 'bg-amber-500/15 border border-amber-500/30 text-amber-200'
            : 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-200'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {fatigue.risk === 'high' ? (
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          )}
          <span className="truncate">{fatigue.message}</span>
        </div>
        <span className="font-semibold uppercase tracking-wider text-[10px] opacity-80 flex-shrink-0">
          Posture: {metrics.postureStatus}
        </span>
      </div>

      {/* Bottom Controls: Simulation Mode Selector & Study Session Trigger */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-white/50 mr-1 hidden sm:inline">Telemetry Simulation:</span>
          {(['normal', 'deep_focus', 'stress_cram', 'fatigue'] as WearableSimulationMode[]).map(
            (mode) => (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                  activeMode === mode
                    ? 'bg-[#E85A9E] text-white shadow-sm font-semibold'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {mode === 'deep_focus'
                  ? 'Deep Focus'
                  : mode === 'stress_cram'
                  ? 'Exam Cram'
                  : mode === 'fatigue'
                  ? 'Fatigue Alert'
                  : 'Normal'}
              </button>
            )
          )}
        </div>

        <button
          onClick={onStartStudySession}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-neutral-900 text-xs font-semibold hover:bg-neutral-100 active:scale-95 transition-all shadow-md ml-auto"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Start Wearable Study Session</span>
        </button>
      </div>
    </div>
  );
};
