import React, { useState } from 'react';
import { ReleaseProject } from '../types';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';

interface ReleaseChecklistProps {
  project: ReleaseProject;
  onToggleChecklistItem: (projectId: string, itemId: string) => void;
  onAddChecklistItem: (projectId: string, text: string) => void;
  onChangeProjectStatus: (projectId: string, status: ReleaseProject['status']) => void;
}

export default function ReleaseChecklist({
  project,
  onToggleChecklistItem,
  onAddChecklistItem,
  onChangeProjectStatus
}: ReleaseChecklistProps) {
  const [newCheckItemText, setNewCheckItemText] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);

  const completedCount = project.checklist.filter((item) => item.completed).length;
  const totalCount = project.checklist.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCheckItemText.trim()) return;
    onAddChecklistItem(project.id, newCheckItemText.trim());
    setNewCheckItemText('');
    setIsAddingItem(false);
  };

  // Status human mapping
  const statusLabels: Record<ReleaseProject['status'], string> = {
    planning: 'Planning',
    writing: 'Writing & Demos',
    recording: 'Recording Stems',
    mixing: 'Mixing & Mastering',
    mastered: 'Mastered & Ready',
    'campaign-active': 'Promo Campaign Active',
    released: 'Released'
  };

  return (
    <div className="bg-[#0e0e0e] border border-white/10 rounded-none p-6 flex flex-col h-full relative" id="release-tracker">
      {/* Visual Accent Corner */}
      <div className="absolute top-0 right-0 w-3 h-3 bg-[#ff4d00]" />

      {/* Header info */}
      <div className="flex items-start justify-between mb-4 pb-3 border-b border-white/10">
        <div>
          <span className="text-[9px] uppercase font-bold tracking-[0.25em] text-white/50 block">
            {project.type} CAMPAIGN
          </span>
          <h3 className="font-black text-white text-lg tracking-tight mt-1 uppercase">{project.title}</h3>
        </div>
        <div className="text-right">
          <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-0.5">Release Date</span>
          <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 justify-end">
            <Icons.Calendar className="w-3 h-3 text-[#ff4d00]" />
            {project.releaseDate || 'TBD'}
          </span>
        </div>
      </div>

      {/* Progress slider / status selectors */}
      <div className="bg-[#141414] rounded-none p-4 border border-white/5 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-white/60">LAUNCH PREP</span>
          <span className="text-xs font-mono font-black text-[#ff4d00]">{progressPercent}%</span>
        </div>
        <div className="w-full bg-zinc-900 h-1.5 rounded-none overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            className="h-full bg-[#ff4d00]"
          />
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-white/5">
          <span className="text-[10px] uppercase font-mono text-white/40 tracking-wider">CAMPAIGN STATUS</span>
          <select
            value={project.status}
            onChange={(e) => onChangeProjectStatus(project.id, e.target.value as ReleaseProject['status'])}
            className="bg-zinc-950 border border-white/10 text-xs text-white uppercase font-mono tracking-wide rounded-none px-2.5 py-1.5 focus:outline-none focus:border-[#ff4d00] cursor-pointer"
          >
            {Object.entries(statusLabels).map(([key, value]) => (
              <option key={key} value={key} className="bg-zinc-950 text-white uppercase">
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Checklist items */}
      <div className="flex-1 overflow-y-auto max-h-[220px] space-y-2 pr-1 mb-4">
        {project.checklist.map((item) => (
          <div
            key={item.id}
            onClick={() => onToggleChecklistItem(project.id, item.id)}
            className={`flex items-start gap-3 p-3 rounded-none cursor-pointer border transition-all text-left ${
              item.completed
                ? 'bg-zinc-900/10 border-white/5 opacity-40'
                : 'bg-zinc-900/30 border-white/10 hover:border-white/20'
            }`}
          >
            <button className="mt-0.5 text-white/30 focus:outline-none shrink-0">
              {item.completed ? (
                <div className="w-4 h-4 bg-[#ff4d00]/20 border border-[#ff4d00] flex items-center justify-center">
                  <Icons.Check className="w-3 h-3 text-[#ff4d00] stroke-[3]" />
                </div>
              ) : (
                <div className="w-4 h-4 border border-white/20" />
              )}
            </button>
            <span className={`text-sm text-white font-light tracking-wide break-words ${item.completed ? 'line-through text-white/30 font-extralight' : ''}`}>
              {item.text}
            </span>
          </div>
        ))}
      </div>

      {/* Add Custom Checklist Item */}
      <div>
        {isAddingItem ? (
          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g., Book photographer..."
              value={newCheckItemText}
              onChange={(e) => setNewCheckItemText(e.target.value)}
              className="flex-1 bg-zinc-950 border border-white/10 rounded-none px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff4d00] placeholder-zinc-600 font-sans"
              required
              autoFocus
            />
            <button
              type="submit"
              className="bg-[#ff4d00] hover:bg-[#e04400] text-black text-[10px] uppercase tracking-widest font-black px-4 py-2 rounded-none cursor-pointer transition-colors shrink-0"
            >
              ADD
            </button>
            <button
              type="button"
              onClick={() => setIsAddingItem(false)}
              className="text-white/40 hover:text-white px-2 text-xs"
            >
              ✕
            </button>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingItem(true)}
            className="w-full text-center py-2.5 border border-dashed border-white/10 hover:border-white/30 rounded-none text-[10px] uppercase tracking-widest font-black text-white/50 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Icons.Plus className="w-3.5 h-3.5" /> ADD MILESTONE
          </button>
        )}
      </div>
    </div>
  );
}
