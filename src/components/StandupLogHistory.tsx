import React, { useState } from 'react';
import { StandupLog } from '../types';
import FocusAreaBadge from './FocusAreaBadge';
import * as Icons from 'lucide-react';

interface StandupLogHistoryProps {
  logs: StandupLog[];
  onSelectLog: (log: StandupLog) => void;
  selectedLogId?: string;
}

export default function StandupLogHistory({ logs, onSelectLog, selectedLogId }: StandupLogHistoryProps) {
  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter(
    (l) =>
      l.accomplished.toLowerCase().includes(search.toLowerCase()) ||
      l.workingOn.toLowerCase().includes(search.toLowerCase()) ||
      l.blockers.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#0e0e0e] border border-white/10 rounded-none p-6 flex flex-col h-full relative" id="standup-history">
      {/* Visual Accent Corner */}
      <div className="absolute top-0 right-0 w-3 h-3 bg-[#ff4d00]" />

      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-white/10">
        <span className="text-[10px] font-mono text-[#ff4d00] font-bold border border-[#ff4d00]/30 px-1.5 py-0.5 bg-[#ff4d00]/5">JRN</span>
        <h3 className="font-black text-white text-xs uppercase tracking-[0.3em]">STUDIO JOURNAL</h3>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <Icons.Search className="absolute left-3.5 top-3 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="SEARCH JOURNAL ENTRIES..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-950 border border-white/10 rounded-none pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 font-mono tracking-wider focus:outline-none focus:border-[#ff4d00]"
        />
      </div>

      {/* Log Feed */}
      <div className="flex-1 overflow-y-auto max-h-[360px] space-y-3.5 pr-1">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log) => {
            const isSelected = selectedLogId === log.id;
            const dateObj = new Date(log.date);
            const formattedDate = dateObj.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              timeZone: 'UTC' // past logs use UTC date formatting
            });

            return (
              <button
                key={log.id}
                onClick={() => onSelectLog(log)}
                className={`w-full text-left p-4 rounded-none transition-all cursor-pointer focus:outline-none border-t-0 border-r-0 border-b-0 ${
                  isSelected
                    ? 'bg-zinc-900/60 border-l-[3px] border-l-[#ff4d00] border-zinc-900'
                    : 'bg-zinc-950/30 border-l-[3px] border-l-white/10 hover:bg-zinc-950/60 hover:border-l-white/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">{formattedDate}</span>
                  <div className="flex items-center gap-2">
                    {/* Energy level visual */}
                    <span className="flex items-center gap-0.5 text-[9px] font-mono text-[#ff4d00] font-bold">
                      <Icons.Zap className="w-3 h-3 fill-[#ff4d00]/20 text-[#ff4d00]" />
                      {log.creativeEnergy}/5
                    </span>
                    <FocusAreaBadge area={log.focusArea} showIcon={false} className="text-[8px] py-0 px-2" />
                  </div>
                </div>

                <div className="space-y-1 mt-3">
                  <span className="text-[9px] font-mono font-black text-white/40 uppercase block tracking-widest">YESTERDAY // ACCOMPLISHED</span>
                  <p className="text-xs text-white/70 font-light leading-relaxed line-clamp-2">
                    {log.accomplished}
                  </p>
                </div>

                {log.blockers && (
                  <div className="mt-3 text-[9px] font-mono text-white/50 border-l border-[#ff4d00] pl-2 max-w-full truncate">
                    <span className="text-[#ff4d00] font-black mr-1">BLOCKER:</span> {log.blockers}
                  </div>
                )}
              </button>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-white/5">
            <Icons.Layers className="w-8 h-8 text-white/10 mb-3" />
            <p className="text-[10px] uppercase tracking-widest text-white/30">No matching entries</p>
          </div>
        )}
      </div>
    </div>
  );
}

