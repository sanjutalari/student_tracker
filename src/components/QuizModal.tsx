import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sampleQuizQuestions } from '../data/mockData';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = sampleQuizQuestions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < sampleQuizQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      if (score + (selectedOption === currentQ.correctIndex ? 1 : 0) >= 3) {
        try {
          confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
        } catch (e) {}
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-lg rounded-[32px] glass-panel p-6 border border-white/20 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-[11px] font-medium text-[#E85A9E] tracking-wider uppercase">
              Vignan Quick Assessment
            </span>
            <h3 className="text-white font-medium text-lg tracking-tight">
              {currentQ.subject} Practice Test
            </h3>
          </div>

          <button
            onClick={onClose}
            aria-label="Close quiz"
            className="w-10 h-10 rounded-full glass-button flex items-center justify-center text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isFinished ? (
          <div className="mt-5">
            {/* Progress indicator */}
            <div className="flex items-center justify-between text-xs text-white/60 mb-2 font-medium">
              <span>Question {currentIndex + 1} of {sampleQuizQuestions.length}</span>
              <span>Score: {score}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 mb-6 overflow-hidden">
              <div
                className="bg-[#E85A9E] h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / sampleQuizQuestions.length) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <p className="text-white text-base sm:text-lg font-medium leading-relaxed mb-6">
              {currentQ.question}
            </p>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, idx) => {
                let btnStyle = 'bg-white/5 border-white/10 text-white/90 hover:bg-white/10';
                if (isAnswered) {
                  if (idx === currentQ.correctIndex) {
                    btnStyle = 'bg-emerald-500/25 border-emerald-400 text-emerald-200';
                  } else if (idx === selectedOption) {
                    btnStyle = 'bg-rose-500/25 border-rose-400 text-rose-200';
                  } else {
                    btnStyle = 'bg-white/5 border-white/5 text-white/40 opacity-50';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-2xl border text-sm font-normal transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && idx === currentQ.correctIndex && (
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 ml-2" />
                    )}
                    {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box when answered */}
            {isAnswered && (
              <div className="mt-4 p-3.5 rounded-2xl bg-white/5 border border-white/15 text-xs text-white/80 leading-relaxed">
                <span className="font-semibold text-white block mb-0.5">Explanation:</span>
                {currentQ.explanation}
              </div>
            )}

            {/* Next Question CTA */}
            {isAnswered && (
              <button
                onClick={handleNext}
                className="w-full mt-5 py-3 rounded-full bg-white text-neutral-900 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-neutral-100 active:scale-95 transition-all shadow-md"
              >
                <span>{currentIndex + 1 < sampleQuizQuestions.length ? 'Next Question' : 'Finish Quiz'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="w-20 h-20 rounded-full bg-[#E85A9E]/20 mx-auto flex items-center justify-center text-[#E85A9E] mb-4">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-semibold text-white tracking-tight">
              Test Completed!
            </h4>
            <p className="text-white/60 text-sm mt-1">
              You scored <span className="text-white font-bold text-lg">{score}</span> out of{' '}
              <span className="text-white font-bold text-lg">{sampleQuizQuestions.length}</span>
            </p>

            <p className="text-xs text-white/70 mt-4 max-w-xs mx-auto">
              {score >= 3
                ? 'Great mastery! Your algorithmic and OS concepts are in great shape for the upcoming Mid-2 exams.'
                : 'Good attempt. We recommend reviewing Dynamic Programming and Page Replacement topics with the AI Mentor.'}
            </p>

            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={handleRestart}
                className="px-5 py-2.5 rounded-full glass-button text-xs font-semibold text-white flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Quiz</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-white text-neutral-900 text-xs font-semibold hover:bg-neutral-100"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
