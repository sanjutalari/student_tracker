import React, { useState } from 'react';
import {
  X,
  Mic,
  MicOff,
  Send,
  Calendar,
  Clock,
  Bell,
  CheckCircle2,
  Sparkles,
  Bot,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  HomeworkItem,
  SkillTracker,
  StudyReminder,
  AfterCollegeScheduleBlock,
  WearableMetrics,
} from '../types';
import {
  parseHomeworkFromVoiceText,
  generateAfterCollegeSchedule,
} from '../utils/studyPlanner';

interface AfterCollegeCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSkill: SkillTracker;
  wearable: WearableMetrics;
  onScheduleGenerated: (
    schedule: AfterCollegeScheduleBlock[],
    newHomework: HomeworkItem[],
    newReminders: StudyReminder[]
  ) => void;
}

export const AfterCollegeCheckinModal: React.FC<AfterCollegeCheckinModalProps> = ({
  isOpen,
  onClose,
  activeSkill,
  wearable,
  onScheduleGenerated,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    schedule: AfterCollegeScheduleBlock[];
    homework: HomeworkItem[];
    reminders: StudyReminder[];
  } | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    'I have DAA Dijkstra problem set, OS lab questions, and 1 hour of React skill practice',
    'Finish DBMS 3NF schema and revise today’s Operating Systems lecture',
    'Practice 3 LeetCode dynamic programming questions and review Computer Networks',
  ];

  // Speech-to-text with Web Speech API
  const handleToggleMic = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your works.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleProcessWorks = () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);

    setTimeout(() => {
      // 1. Parse homework from text/voice
      const parsedItems = parseHomeworkFromVoiceText(inputText);

      const newHomeworkList: HomeworkItem[] = parsedItems.map((p, idx) => ({
        id: `hw-voice-${idx}-${Date.now()}`,
        title: p.title,
        subject: p.subject,
        assignedByFaculty: 'Dr. K. Sravan',
        dueDate: '2026-11-08',
        estimatedMinutes: p.estimatedMinutes,
        reminderSet: true,
        completed: false,
      }));

      // 2. Generate optimized after-college timetable
      const schedule = generateAfterCollegeSchedule({
        collegeEndTime: '15:30', // College ends at 3:30 PM
        classesAttendedToday: ['CS301 - DAA', 'CS302 - OS'],
        homeworkList: newHomeworkList,
        activeSkill,
      });

      // 3. Create automatic reminders for the student
      const reminders: StudyReminder[] = [
        {
          id: `rem-rev-${Date.now()}`,
          time: '16:15',
          title: 'Daily Class Revision: DAA & OS Lectures',
          category: 'class_revision',
          isCompleted: false,
          createdAt: 'Just now by Aurora Agent',
        },
        {
          id: `rem-sk-${Date.now()}`,
          time: '17:30',
          title: `Dedicated Skill Time: ${activeSkill.name}`,
          category: 'skill_time',
          isCompleted: false,
          createdAt: 'Just now by Aurora Agent',
        },
        ...newHomeworkList.map((hw, idx) => ({
          id: `rem-hw-${idx}-${Date.now()}`,
          time: idx === 0 ? '18:45' : '19:45',
          title: `Homework: ${hw.title}`,
          category: 'homework' as const,
          isCompleted: false,
          createdAt: 'Just now by Aurora Agent',
        })),
      ];

      setGeneratedResult({ schedule, homework: newHomeworkList, reminders });
      setIsProcessing(false);

      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    }, 800);
  };

  const handleConfirmSchedule = () => {
    if (!generatedResult) return;
    onScheduleGenerated(
      generatedResult.schedule,
      generatedResult.homework,
      generatedResult.reminders
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-[32px] glass-panel p-6 border border-white/20 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#7E2548] to-[#E85A9E] flex items-center justify-center border border-white/20 shadow-md">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#E85A9E] uppercase tracking-wider">
                Post-College Planning Agent
              </span>
              <h3 className="text-white font-medium text-lg tracking-tight">
                After-College Check-in & Timetable Setup
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close after college check-in"
            className="w-10 h-10 rounded-full glass-button flex items-center justify-center text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!generatedResult ? (
          <div className="mt-5 space-y-5">
            {/* Agent Greeting Callout */}
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-white/90 leading-relaxed">
                <strong className="text-white block mb-0.5 font-medium">
                  "Welcome back, Rahul! College classes ended at 3:30 PM."
                </strong>
                What homework, assignments, or works do you have today? You can type or click the microphone to tell me by voice. I will build your evening timetable and set active reminders for you.
              </div>
            </div>

            {/* Input with Voice Button */}
            <div className="space-y-2">
              <label className="text-xs text-white/70 font-medium block">
                Tell the agent your works today (Text or Voice):
              </label>

              <div className="relative">
                <textarea
                  rows={3}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="e.g. I have DAA assignment from Dr. Sravan, OS lab report questions, and want to practice React coding..."
                  className="w-full bg-white/5 border border-white/20 rounded-2xl p-4 pr-14 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/40 leading-relaxed"
                />

                {/* Voice Input Mic Button */}
                <button
                  type="button"
                  onClick={handleToggleMic}
                  aria-label="Voice input"
                  className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse ring-2 ring-rose-400'
                      : 'glass-button text-white/80 hover:text-white'
                  }`}
                  title={isListening ? 'Listening... click to stop' : 'Click to speak homework'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#E85A9E]" />}
                </button>
              </div>

              {isListening && (
                <div className="flex items-center gap-2 text-xs text-rose-300 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span>Listening... Speak your assignments and study goals.</span>
                </div>
              )}
            </div>

            {/* Quick Preset Buttons */}
            <div>
              <span className="text-[11px] font-medium text-white/50 block mb-2">
                Or click a quick preset:
              </span>
              <div className="space-y-1.5">
                {quickPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInputText(p)}
                    className="w-full text-left p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/75 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    "{p}"
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleProcessWorks}
                disabled={!inputText.trim() || isProcessing}
                className="w-full py-3.5 rounded-full bg-white text-neutral-900 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-neutral-100 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.99] transition-all shadow-lg"
              >
                {isProcessing ? (
                  <span>Agent is analyzing timetable & setting reminders...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Plan Study Time & Set Reminders</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Result View */
          <div className="mt-5 space-y-5 animate-fade-in">
            <div className="p-4 rounded-2xl bg-[#3DDC5A]/15 border border-[#3DDC5A]/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#3DDC5A]" />
                <div>
                  <h4 className="text-white text-sm font-semibold">
                    Evening Timetable & Reminders Ready!
                  </h4>
                  <p className="text-xs text-white/70">
                    Calculated based on today's classes and dedicated skill time.
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-[#3DDC5A]/20 text-[#3DDC5A] text-xs font-bold">
                {generatedResult.reminders.length} Reminders Set
              </span>
            </div>

            {/* Generated Timetable */}
            <div>
              <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#E85A9E]" />
                <span>Tonight's After-College Schedule</span>
              </h4>

              <div className="space-y-2">
                {generatedResult.schedule.map((block) => {
                  const borderColors = {
                    class_revision: 'border-l-indigo-400 bg-indigo-500/10',
                    skill_time: 'border-l-amber-400 bg-amber-500/10',
                    homework: 'border-l-[#E85A9E] bg-[#E85A9E]/10',
                    break: 'border-l-neutral-400 bg-white/5',
                    review: 'border-l-cyan-400 bg-cyan-500/10',
                  };

                  return (
                    <div
                      key={block.id}
                      className={`p-3 rounded-2xl border-l-4 border ${borderColors[block.type]} flex items-start justify-between text-xs`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{block.title}</span>
                          {block.type === 'skill_time' && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                              Tracked Skill
                            </span>
                          )}
                        </div>
                        <p className="text-white/60 mt-0.5">{block.description}</p>
                      </div>

                      <span className="font-mono text-white/90 font-medium whitespace-nowrap ml-2">
                        {block.startTime} - {block.endTime}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Scheduled Reminders */}
            <div>
              <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-amber-400" />
                <span>Scheduled Application Reminders</span>
              </h4>

              <div className="space-y-1.5">
                {generatedResult.reminders.map((r) => (
                  <div
                    key={r.id}
                    className="glass-tile p-3 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <Bell className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      <span className="text-white font-medium">{r.title}</span>
                    </div>
                    <span className="font-mono text-[#E85A9E] font-semibold">
                      {r.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action to Apply */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setGeneratedResult(null)}
                className="px-4 py-2 rounded-full glass-button text-xs text-white"
              >
                Edit Works
              </button>

              <button
                type="button"
                onClick={handleConfirmSchedule}
                className="px-6 py-2.5 rounded-full bg-white text-neutral-900 text-xs font-semibold hover:bg-neutral-100 shadow-md"
              >
                Apply to My Schedule & Reminders
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
