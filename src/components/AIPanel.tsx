import React from 'react';
import { AIFeedback } from '../types';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';

interface AIPanelProps {
  feedback?: AIFeedback;
  isLoading: boolean;
  onImportTasks: (tasks: string[]) => void;
  artistName: string;
}

export default function AIPanel({ feedback, isLoading, onImportTasks, artistName }: AIPanelProps) {
  if (isLoading) {
    return (
      <div className="bg-[#0e0e0e] border border-white/10 rounded-none p-6 flex flex-col items-center justify-center text-center py-20 relative overflow-hidden" id="ai-panel-loading">
        <div className="absolute top-[-100px] right-[-50px] text-[300px] font-black text-white/[0.015] leading-none select-none pointer-events-none">REC</div>
        <div className="relative mb-5">
          <Icons.Disc className="w-12 h-12 text-[#ff4d00] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-none animate-ping" />
          </div>
        </div>
        <h4 className="font-black text-white text-xs uppercase tracking-[0.3em] mb-2">AI PRODUCER ANALYZING...</h4>
        <p className="text-xs text-white/50 max-w-sm px-4 leading-relaxed font-light">
          Compiling audio engineering tips, song writing directions, and marketing campaign guidelines from your daily tracks.
        </p>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="bg-[#0e0e0e] border border-white/10 rounded-none p-6 flex flex-col items-center justify-center text-center py-14 relative" id="ai-panel-empty">
        <div className="absolute top-0 right-0 w-3 h-3 bg-white/20" />
        <div className="w-12 h-12 rounded-none bg-zinc-950 border border-white/10 flex items-center justify-center mb-4">
          <Icons.Sparkles className="w-5 h-5 text-white/40" />
        </div>
        <h4 className="font-black text-white text-xs uppercase tracking-[0.3em] mb-2">AWAITING DAILY STANDUP</h4>
        <p className="text-xs text-white/50 max-w-sm px-4 mb-5 font-light leading-relaxed">
          Log what you did yesterday and what you are focusing on today to generate bespoke master-track suggestions and marketing milestones.
        </p>
        <div className="text-[9px] text-white/40 border border-white/10 rounded-none px-3 py-1 bg-zinc-950 font-mono uppercase tracking-widest">
          AI PRODUCER CONSOLE v1.1
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0e0e0e] border border-white/10 rounded-none overflow-hidden relative text-left"
      id="ai-panel-content"
    >
      <div className="absolute top-0 right-0 w-3 h-3 bg-[#ff4d00]" />

      {/* Panel Top Strip */}
      <div className="bg-zinc-950 px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#ff4d00]/10 border border-[#ff4d00]/20 rounded-none">
            <Icons.Sparkles className="w-4 h-4 text-[#ff4d00]" />
          </div>
          <div>
            <h3 className="font-black text-white text-xs uppercase tracking-[0.25em]">STUDIO CONSULTATION</h3>
            <p className="text-[9px] text-white/40 uppercase font-mono tracking-widest mt-0.5">GENERATED FOR {artistName}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] bg-[#ff4d00]/10 text-[#ff4d00] px-2.5 py-1 rounded-none font-mono font-bold border border-[#ff4d00]/20 tracking-wider">
          <span className="w-1 h-1 bg-[#ff4d00] rounded-full animate-pulse" />
          ACTIVE
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 1. Producer Note (Creative/Technical) */}
        <div className="flex items-start gap-4">
          <div className="p-2 bg-[#ff4d00]/10 border border-[#ff4d00]/20 rounded-none shrink-0">
            <Icons.Sliders className="w-4 h-4 text-[#ff4d00]" />
          </div>
          <div className="space-y-1.5 flex-1">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#ff4d00]">AI EXECUTIVE PRODUCER</h4>
            <p className="text-sm text-white font-light leading-relaxed">{feedback.producerNote}</p>
          </div>
        </div>

        {/* 2. Manager Note (Business/Promo) */}
        <div className="flex items-start gap-4 pt-5 border-t border-white/5">
          <div className="p-2 bg-white/5 border border-white/10 rounded-none shrink-0">
            <Icons.Megaphone className="w-4 h-4 text-white" />
          </div>
          <div className="space-y-1.5 flex-1">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/60">AI BAND MANAGER</h4>
            <p className="text-sm text-white font-light leading-relaxed">{feedback.managerNote}</p>
          </div>
        </div>

        {/* 3. Creative Prompt Card */}
        <div className="bg-[#141414] border border-white/5 rounded-none p-5 mt-4 relative">
          <div className="flex items-center gap-2 mb-2.5">
            <Icons.Zap className="w-4 h-4 text-[#ff4d00]" />
            <h5 className="text-[9px] font-mono font-black uppercase tracking-[0.2em] text-[#ff4d00]/80">CREATIVE EXPERIMENT</h5>
          </div>
          <p className="text-xs text-white/90 italic leading-relaxed font-light">
            "{feedback.creativePrompt}"
          </p>
        </div>

        {/* 4. Suggested Tasks */}
        {feedback.recommendedTasks && feedback.recommendedTasks.length > 0 && (
          <div className="pt-5 border-t border-white/5 space-y-3.5">
            <div className="flex items-center justify-between">
              <h5 className="text-[9px] font-mono font-black uppercase tracking-widest text-white/40">ACTIONABLE NEXT STEPS</h5>
              <button
                onClick={() => onImportTasks(feedback.recommendedTasks)}
                className="text-[9px] font-bold text-[#ff4d00] hover:text-[#ff4d00]/85 tracking-widest transition-colors flex items-center gap-1 cursor-pointer uppercase focus:outline-none"
              >
                <Icons.Download className="w-3 h-3" /> IMPORT STEPS
              </button>
            </div>
            <div className="space-y-2">
              {feedback.recommendedTasks.map((taskText, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 px-4 py-3 bg-zinc-950 border border-white/5 rounded-none text-xs text-white/70 font-light"
                >
                  <div className="w-1.5 h-1.5 bg-[#ff4d00] shrink-0" />
                  <span>{taskText}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
