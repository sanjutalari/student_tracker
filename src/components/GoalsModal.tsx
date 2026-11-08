import React, { useState } from 'react';
import {
  X,
  Target,
  CheckCircle2,
  Circle,
  ExternalLink,
  Plus,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Goal } from '../types';

interface GoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  goals: Goal[];
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onAddGoal: (goal: Omit<Goal, 'id' | 'progressPct'>) => void;
}

export const GoalsModal: React.FC<GoalsModalProps> = ({
  isOpen,
  onClose,
  goals,
  onToggleMilestone,
  onAddGoal,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Goal['category']>('Academic');
  const [newTargetDate, setNewTargetDate] = useState('2026-12-30');
  const [milestonesInput, setMilestonesInput] = useState('');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const milestones = milestonesInput
      .split('\n')
      .filter((line) => line.trim())
      .map((title, idx) => ({
        id: `m-new-${idx}-${Date.now()}`,
        title: title.trim(),
        completed: false,
      }));

    onAddGoal({
      title: newTitle.trim(),
      category: newCategory,
      targetDate: newTargetDate,
      milestones: milestones.length > 0 ? milestones : [{ id: `m-1-${Date.now()}`, title: 'Initial milestone', completed: false }],
    });

    setNewTitle('');
    setMilestonesInput('');
    setIsAdding(false);
  };

  const handleMilestoneClick = (goalId: string, milestoneId: string, currentCompleted: boolean) => {
    onToggleMilestone(goalId, milestoneId);
    if (!currentCompleted) {
      try {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
      } catch (e) {}
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-[32px] glass-panel p-6 border border-white/20 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#E85A9E]/20 flex items-center justify-center text-[#E85A9E]">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-medium text-lg tracking-tight">
                Academic & Skill Milestones
              </h3>
              <p className="text-xs text-white/50">Track long-term career and curriculum competencies</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-3.5 py-1.5 rounded-full bg-[#E85A9E] text-white text-xs font-semibold hover:bg-[#d64a8d] flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Goal</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close goals"
              className="w-9 h-9 rounded-full glass-button flex items-center justify-center text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isAdding && (
          <form onSubmit={handleCreate} className="my-4 p-4 rounded-2xl bg-white/5 border border-white/15 space-y-3">
            <h4 className="text-sm font-semibold text-white">Create New Learning Goal</h4>
            <div>
              <label className="text-xs text-white/70 block mb-1">Goal Title:</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Master Operating Systems & Concurrency"
                className="w-full bg-neutral-900 border border-white/20 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/70 block mb-1">Category:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-neutral-900 border border-white/20 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Academic">Academic</option>
                  <option value="Skill">Skill</option>
                  <option value="Placement">Placement</option>
                  <option value="Project">Project</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-white/70 block mb-1">Target Completion Date:</label>
                <input
                  type="date"
                  value={newTargetDate}
                  onChange={(e) => setNewTargetDate(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/20 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-white/70 block mb-1">
                Milestones (one per line):
              </label>
              <textarea
                rows={2}
                value={milestonesInput}
                onChange={(e) => setMilestonesInput(e.target.value)}
                placeholder="Read Chapter 3 on Semaphores&#10;Implement Producer-Consumer problem"
                className="w-full bg-neutral-900 border border-white/20 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3.5 py-1.5 rounded-full glass-button text-xs text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-full bg-white text-neutral-900 text-xs font-semibold hover:bg-neutral-100"
              >
                Save Goal
              </button>
            </div>
          </form>
        )}

        {/* Goals List */}
        <div className="space-y-4 mt-4">
          {goals.map((goal) => {
            const completedCount = goal.milestones.filter((m) => m.completed).length;
            const progress = goal.milestones.length > 0
              ? Math.round((completedCount / goal.milestones.length) * 100)
              : 0;

            return (
              <div key={goal.id} className="glass-tile p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-semibold text-[#E85A9E] uppercase tracking-wider">
                      {goal.category} • Target: {goal.targetDate}
                    </span>
                    <h4 className="text-base font-semibold text-white mt-0.5 leading-snug">
                      {goal.title}
                    </h4>
                  </div>
                  <span className="text-xl font-medium text-white">
                    {progress}%
                  </span>
                </div>

                <div className="w-full bg-white/10 rounded-full h-1.5 my-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-[#E85A9E] h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Milestones checklist */}
                <div className="space-y-2 mt-3">
                  {goal.milestones.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => handleMilestoneClick(goal.id, m.id, m.completed)}
                      className="flex items-center gap-2.5 text-xs text-white/80 cursor-pointer hover:text-white"
                    >
                      {m.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-[#3DDC5A] flex-shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-white/40 flex-shrink-0" />
                      )}
                      <span className={m.completed ? 'line-through text-white/50' : ''}>
                        {m.title}
                      </span>
                    </div>
                  ))}
                </div>

                {goal.evidenceUrl && (
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-white/50">Verified Project Evidence:</span>
                    <a
                      href={goal.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#E85A9E] hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>View GitHub Repository</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <button
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
