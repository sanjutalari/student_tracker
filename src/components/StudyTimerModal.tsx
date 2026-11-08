import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  CheckCircle,
  GraduationCap,
  Zap,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudySessionRecord } from '../types';

interface StudyTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSession: (session: StudySessionRecord) => void;
}

export const StudyTimerModal: React.FC<StudyTimerModalProps> = ({
  isOpen,
  onClose,
  onSaveSession,
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('CS301 - DAA');
  const [studyTopic, setStudyTopic] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');

  const subjects = [
    'CS301 - DAA (Design & Analysis of Algorithms)',
    'CS302 - OS (Operating Systems)',
    'CS303 - CN (Computer Networks)',
    'CS304 - DBMS (Database Management Systems)',
    'Full-Stack Web Development (React & Node.js)',
    'Competitive Programming & DSA',
    'Machine Learning & Data Science',
    'Cloud Computing & DevOps',
  ];

  // Timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
    setStudyTopic('');
    setSessionNotes('');
  };

  const handleEndAndSave = () => {
    setIsActive(false);
    const durationMinutes = Math.max(1, Math.round(seconds / 60));
    // Calculate productivity focus based on uninterrupted time
    const focusScore = Math.min(98, 70 + Math.min(25, Math.floor(durationMinutes * 1.5)));

    const newRecord: StudySessionRecord = {
      id: `sess-${Date.now()}`,
      subject: selectedSubject,
      timestamp: 'Just now',
      durationMinutes,
      avgHeartRate: 0,
      avgFocusScore: focusScore,
      notes: studyTopic
        ? `Topic: ${studyTopic}. ${sessionNotes}`
        : sessionNotes || 'Dedicated academic study hour completed.',
    };

    onSaveSession(newRecord);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }

    resetTimer();
    onClose();
  };

  if (!isOpen) return null;

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-lg rounded-[32px] glass-panel p-6 border border-white/20 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#7E2548] to-[#E85A9E] flex items-center justify-center text-white shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-medium text-lg tracking-tight">
                Daily Study Hour Session
              </h3>
              <p className="text-xs text-white/50">
                Track your academic revision and skill learning time
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close timer"
            className="w-10 h-10 rounded-full glass-button flex items-center justify-center text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subject Select */}
        <div className="mt-5 space-y-3">
          <div>
            <label className="text-xs text-white/70 block mb-1.5 font-medium flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#E85A9E]" />
              Select Course or Skill Being Studied:
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/40"
            >
              {subjects.map((sub) => (
                <option key={sub} value={sub} className="bg-neutral-900 text-white">
                  {sub}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-white/70 block mb-1.5 font-medium flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Specific Topic or Concept:
            </label>
            <input
              type="text"
              value={studyTopic}
              onChange={(e) => setStudyTopic(e.target.value)}
              placeholder="e.g. Dijkstra's shortest path, Virtual memory, React hooks..."
              className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#E85A9E]"
            />
          </div>
        </div>

        {/* Large Digital Clock Face */}
        <div className="my-6 flex flex-col items-center justify-center">
          <div className="relative w-48 h-48 rounded-full border-4 border-white/10 flex items-center justify-center shadow-inner">
            <div
              className={`absolute inset-0 rounded-full border-4 border-[#E85A9E] border-t-transparent transition-all ${
                isActive ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '6s' }}
            />
            <div className="text-center">
              <span className="text-5xl font-mono font-medium tracking-wider text-white">
                {formatTime(seconds)}
              </span>
              <p className="text-xs text-white/60 mt-1 uppercase tracking-widest font-medium">
                {isActive ? 'Session in progress' : seconds > 0 ? 'Paused' : 'Ready'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick study status tiles */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="glass-tile p-3 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-[11px] text-white/50 block">Target Study Block</span>
              <span className="text-sm font-semibold text-white">45 - 60 Minutes</span>
            </div>
          </div>
          <div className="glass-tile p-3 flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-[#E85A9E]" />
            <div>
              <span className="text-[11px] text-white/50 block">Tuition Review</span>
              <span className="text-sm font-semibold text-white">Class Aligned</span>
            </div>
          </div>
        </div>

        {/* Session Notes input */}
        <div className="mb-5">
          <input
            type="text"
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
            placeholder="Add key formulas, summary notes, or doubts for faculty..."
            className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
          <button
            onClick={toggleTimer}
            className={`flex-1 py-3 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md ${
              isActive
                ? 'bg-amber-400 text-neutral-900 hover:bg-amber-300'
                : 'bg-white text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            {isActive ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isActive ? 'Pause' : seconds > 0 ? 'Resume' : 'Start Study Hour'}</span>
          </button>

          {seconds > 0 && (
            <button
              onClick={handleEndAndSave}
              className="px-5 py-3 rounded-full bg-[#3DDC5A] text-neutral-900 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-emerald-400 active:scale-95 transition-all shadow-md"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Complete & Log</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
