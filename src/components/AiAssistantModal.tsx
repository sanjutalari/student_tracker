import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Plus,
  CheckCheck,
  Sparkles,
  Bot,
  GraduationCap,
} from 'lucide-react';
import { StudentProfile, SkillTracker, HomeworkItem, TimetableSlot } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedAction?: string;
}

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  activeSkill: SkillTracker;
  homework: HomeworkItem[];
  classesToday: TimetableSlot[];
  initialPrompt?: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  student,
  activeSkill,
  homework,
  classesToday,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: `Hello ${student.name}! I'm your AI Tuition Teacher. I've reviewed your college timetable for today (${classesToday.map(c => c.subjectCode).join(', ')}). I'm here to schedule your evening study hours, remind you of homework, and help upscale your skills in **${activeSkill.name}**. What would you like to focus on right now?`,
      timestamp: '4:15 PM',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedChips = [
    "Plan tonight's study hour schedule",
    "Review today's DAA lecture notes",
    'What homework do I have due tonight?',
    `Upscale my skills in ${activeSkill.name}`,
    'Explain Page Replacement algorithms',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          context: {
            student,
            activeSkill,
            homework: homework.map((h) => h.title),
            classesToday: classesToday.map((c) => `${c.subjectCode}: ${c.subjectName}`),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const data = await response.json();
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'I processed your request based on your academic calendar.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      // High quality tuition teacher fallback
      const fallbackAi: Message = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `Here is your Tuition Study Plan for tonight:\n\n1. **Class Revision (4:30 PM - 5:15 PM)**: Review today's DAA lecture on Dijkstra's Shortest Path algorithm and check relaxation conditions.\n2. **Skill Upscaling (5:30 PM - 6:30 PM)**: 1 Hour dedicated on **${activeSkill.name}** (Topic: ${activeSkill.currentTopic}).\n3. **Homework Session (6:30 PM - 7:30 PM)**: Solve the Dijkstra C++ problem set and prepare your OS lab report.\n\nWould you like me to quiz you on today's algorithm proofs?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackAi]);
    } finally {
      setIsLoading(false);
    }
  };

  // Web Speech API: Voice Input (STT)
  const toggleSpeechRecognition = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your question.');
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
        setInputValue(transcript);
        handleSendMessage(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  // Text-To-Speech (TTS)
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-2xl h-[90vh] max-h-[820px] rounded-[32px] glass-panel flex flex-col overflow-hidden border border-white/20 shadow-2xl relative">
        {/* Background Aurora glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#A8408F]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#7E2548]/30 rounded-full blur-3xl pointer-events-none" />

        {/* Chat Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-black/50 border border-white/20 flex items-center justify-center relative shadow-md">
              <GraduationCap className="w-6 h-6 text-[#E85A9E]" />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#3DDC5A] ring-2 ring-[#0F0A0E]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-white text-base sm:text-lg font-semibold tracking-tight">
                  Prof. Aurora
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E85A9E]/20 text-[#E85A9E] border border-[#E85A9E]/30">
                  AI TUITION TEACHER
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#3DDC5A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3DDC5A] animate-pulse" />
                <span>Online • Reviewing Timetable & Upscaling Skills</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close tuition teacher"
            className="w-11 h-11 rounded-full glass-button flex items-center justify-center text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 relative z-10">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
              >
                {/* Timestamp header */}
                <div className="flex items-center gap-1.5 text-[11px] text-white/50 mb-1 px-1">
                  <span>{msg.timestamp}</span>
                  {isUser && <CheckCheck className="w-3.5 h-3.5 text-[#3DDC5A]" />}
                </div>

                <div className="flex items-end gap-2.5 max-w-[88%] sm:max-w-[80%]">
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-black/40 border border-white/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-[#E85A9E]" />
                    </div>
                  )}

                  <div
                    className={`p-4 rounded-[22px] text-sm leading-relaxed ${
                      isUser
                        ? 'bg-white text-[#111111] shadow-lg font-normal rounded-br-md'
                        : 'bg-white/10 backdrop-blur-md text-white border border-white/15 shadow-md rounded-bl-md'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>
                  </div>
                </div>

                {/* Reaction Bar */}
                {!isUser && (
                  <div className="mt-2 ml-10 flex items-center gap-1 bg-white/90 px-3 py-1 rounded-full shadow-md text-neutral-800 text-xs w-fit">
                    <button
                      onClick={() => speakText(msg.text)}
                      className="p-1 hover:text-[#E85A9E] transition-colors"
                      title="Read aloud"
                    >
                      {isSpeaking ? (
                        <VolumeX className="w-3.5 h-3.5 text-[#E85A9E]" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <span className="w-px h-3 bg-neutral-300 mx-1" />
                    <button className="hover:scale-125 transition-transform px-1">👍</button>
                    <button className="hover:scale-125 transition-transform px-1">💡</button>
                    <button className="hover:scale-125 transition-transform px-1">🔥</button>
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3 text-xs text-white/70 ml-10">
              <div className="w-2 h-2 rounded-full bg-[#E85A9E] animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-white animate-bounce delay-100" />
              <div className="w-2 h-2 rounded-full bg-[#3DDC5A] animate-bounce delay-200" />
              <span>Tuition Teacher is reviewing your schedule and preparing explanations...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Chips */}
        <div className="px-4 py-2 border-t border-white/10 relative z-10">
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[11px] font-medium text-white/40 uppercase tracking-widest">
              Tuition Topics
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="flex flex-wrap gap-1.5 py-1 max-h-20 overflow-y-auto">
            {suggestedChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(chip)}
                className="px-3 py-1.5 rounded-full glass-button text-xs text-white/80 hover:text-white hover:bg-white/15 transition-all text-left"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-white/10 flex items-center gap-2 relative z-10 bg-[#0F0A0E]/80">
          <div className="flex-1 relative flex items-center bg-white/10 rounded-full border border-white/15 pl-2 pr-3 py-1.5 focus-within:border-white/40 transition-colors">
            <button
              type="button"
              onClick={() => handleSendMessage("What are my study priorities for tonight's classes?")}
              className="w-8 h-8 rounded-full bg-[#D9759F] text-white flex items-center justify-center flex-shrink-0 hover:bg-[#E85A9E] active:scale-95 transition-all shadow-sm"
              title="Add tuition context"
            >
              <Plus className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
              placeholder="Ask your tuition teacher about homework, topics, or skills..."
              className="flex-1 bg-transparent px-3 text-sm text-white placeholder-white/40 focus:outline-none"
            />

            <button
              type="button"
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isLoading}
              className="w-8 h-8 rounded-full bg-white text-neutral-900 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none hover:bg-neutral-200 active:scale-95 transition-all shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={toggleSpeechRecognition}
            aria-label="Voice input"
            className={`w-11 h-11 rounded-full glass-button flex items-center justify-center text-white transition-all ${
              isListening
                ? 'bg-red-500 text-white animate-pulse ring-2 ring-red-400'
                : 'hover:bg-white/20'
            }`}
            title="Speak to Tuition Teacher"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-[#E85A9E]" />}
          </button>
        </div>
      </div>
    </div>
  );
};
