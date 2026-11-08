import React, { useState, useEffect } from 'react';
import {
  X,
  Zap,
  Clock,
  CheckCircle2,
  Play,
  Pause,
  Award,
  Layers,
  Heart,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SkillTracker, WearableMetrics } from '../types';
import { calculateSkillProgression } from '../utils/studyPlanner';

interface SkillTimeTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  skills: SkillTracker[];
  wearable: WearableMetrics;
  onSkillSessionComplete: (
    skillId: string,
    minutes: number,
    topicLearned: string,
    focusScore: number
  ) => void;
}

export const SkillTimeTrackerModal: React.FC<SkillTimeTrackerModalProps> = ({
  isOpen,
  onClose,
  skills,
  wearable,
  onSkillSessionComplete,
}) => {
  const [selectedSkillId, setSelectedSkillId] = useState(skills[0]?.id || 'sk-1');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [sessionTopic, setSessionTopic] = useState('');

  const currentSkill = skills.find((s) => s.id === selectedSkillId) || skills[0];

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  if (!isOpen) return null;

  const handleFinishSkillSession = () => {
    setIsTimerRunning(false);
    const durationMinutes = Math.max(1, Math.round(timerSeconds / 60));
    const topic = sessionTopic.trim() || currentSkill.currentTopic;

    onSkillSessionComplete(currentSkill.id, durationMinutes, topic, wearable.focusScore);

    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}

    setTimerSeconds(0);
    setSessionTopic('');
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-[32px] glass-panel p-6 border border-white/20 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                Dedicated Skill Development
              </span>
              <h3 className="text-white font-medium text-lg tracking-tight">
                Skill Time & Competency Tracker
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close skill tracker"
            className="w-10 h-10 rounded-full glass-button flex items-center justify-center text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Skill Selector Pills */}
        <div className="my-4 flex items-center gap-2 overflow-x-auto pb-1">
          {skills.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedSkillId(s.id);
                setTimerSeconds(0);
                setIsTimerRunning(false);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSkillId === s.id
                  ? 'bg-amber-400 text-neutral-900 shadow-md font-bold'
                  : 'glass-button text-white/70 hover:text-white'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Active Skill Overview Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/15 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-medium text-amber-300">
                Category: {currentSkill.category}
              </span>
              <h4 className="text-xl font-medium text-white tracking-tight mt-0.5">
                {currentSkill.name}
              </h4>
              <p className="text-xs text-white/60 mt-0.5">
                Current Learning Focus: <strong className="text-white">{currentSkill.currentTopic}</strong>
              </p>
            </div>

            <div className="text-right">
              <span className="text-3xl font-medium text-amber-300">
                {currentSkill.masteryPercentage}%
              </span>
              <span className="text-xs text-white/50 block">Mastery Index</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs text-white/70 mb-1">
              <span>{currentSkill.completedHours} Hours Completed</span>
              <span>Target: {currentSkill.targetHours} Hours</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-[#E85A9E] transition-all duration-700"
                style={{ width: `${currentSkill.masteryPercentage}%` }}
              />
            </div>
          </div>

          {/* Topics Covered */}
          <div>
            <span className="text-xs font-semibold text-white/70 block mb-1.5">
              Verified Topics Mastered in this Skill:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-white/80">
              {currentSkill.topicsCovered.map((topic, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3DDC5A] flex-shrink-0" />
                  <span>{topic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Skill Session Timer Widget */}
        <div className="mt-5 p-5 rounded-3xl glass-tile border border-amber-400/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5 uppercase">
              <Clock className="w-4 h-4" />
              <span>Record Live Skill Study Session</span>
            </span>
            <span className="text-xs text-white/60">
              Wearable Focus: <strong className="text-white">{wearable.focusScore}%</strong>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-4xl font-mono font-medium text-white tracking-wider">
                {formatTime(timerSeconds)}
              </div>
              <span className="text-[11px] text-white/50">
                {isTimerRunning ? 'Logging skill learning time...' : 'Timer paused'}
              </span>
            </div>

            <div className="flex-1 max-w-sm w-full">
              <input
                type="text"
                value={sessionTopic}
                onChange={(e) => setSessionTopic(e.target.value)}
                placeholder={`Topic: e.g. ${currentSkill.currentTopic}`}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md ${
                  isTimerRunning
                    ? 'bg-amber-400 text-neutral-900'
                    : 'bg-white text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isTimerRunning ? 'Pause' : timerSeconds > 0 ? 'Resume' : 'Start'}</span>
              </button>

              {timerSeconds > 0 && (
                <button
                  type="button"
                  onClick={handleFinishSkillSession}
                  className="px-4 py-2 rounded-full bg-[#3DDC5A] text-neutral-900 text-xs font-semibold hover:bg-emerald-400 transition-colors shadow-md"
                >
                  Save Log
                </button>
              )}
            </div>
          </div>
        </div>

        {/* History of Past Sessions */}
        <div className="mt-5">
          <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#E85A9E]" />
            <span>Recent Skill Learning History</span>
          </h4>

          <div className="space-y-2">
            {currentSkill.recentSessions.map((sess) => (
              <div
                key={sess.id}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-white block">{sess.topic}</span>
                  <span className="text-[11px] text-white/50">{sess.notes}</span>
                </div>
                <div className="text-right whitespace-nowrap ml-3">
                  <span className="font-semibold text-amber-300 block">
                    {sess.minutes} mins
                  </span>
                  <span className="text-[10px] text-emerald-400">
                    Focus: {sess.focusScore}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-white text-neutral-900 text-xs font-semibold hover:bg-neutral-100"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
