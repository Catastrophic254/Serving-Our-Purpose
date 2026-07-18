import React, { useState } from 'react';
import { MusicTask, FocusArea } from '../types';
import { FOCUS_AREAS } from '../data';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TaskBoardProps {
  tasks: MusicTask[];
  onToggleTask: (id: string) => void;
  onAddTask: (title: string, category: FocusArea, dueDate?: string) => void;
  onDeleteTask: (id: string) => void;
}

export default function TaskBoard({ tasks, onToggleTask, onAddTask, onDeleteTask }: TaskBoardProps) {
  const [filter, setFilter] = useState<FocusArea | 'all'>('all');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<FocusArea>('songwriting');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const filteredTasks = tasks.filter((t) => filter === 'all' || t.category === filter);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask(newTaskTitle.trim(), newTaskCategory, newTaskDueDate || undefined);
    setNewTaskTitle('');
    setNewTaskDueDate('');
    setIsAdding(false);
  };

  return (
    <div className="bg-[#0e0e0e] border border-white/10 rounded-none p-6 flex flex-col h-full relative" id="music-taskboard">
      {/* Visual Accent Corner */}
      <div className="absolute top-0 right-0 w-3 h-3 bg-[#ff4d00]" />

      <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#ff4d00] font-bold border border-[#ff4d00]/30 px-1.5 py-0.5 bg-[#ff4d00]/5">TSK</span>
          <h3 className="font-black text-white text-xs uppercase tracking-[0.3em]">STUDIO BACKLOG</h3>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-black px-4 py-2 rounded-none transition-all cursor-pointer ${
            isAdding 
              ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-750' 
              : 'bg-[#ff4d00] hover:bg-[#e04400] text-black'
          }`}
        >
          {isAdding ? <Icons.X className="w-3 h-3" /> : <Icons.Plus className="w-3 h-3" />}
          {isAdding ? 'CANCEL' : 'NEW TASK'}
        </button>
      </div>

      {/* Quick Add Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-5 border-b border-white/10 pb-5"
            onSubmit={handleSubmit}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-[9px] text-white/50 uppercase tracking-[0.2em] mb-1.5 font-bold">TASK DESCRIPTION</label>
                <input
                  type="text"
                  placeholder="e.g., Mix lead vocal track in chorus..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-none px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4d00] placeholder-zinc-600 font-sans"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] text-white/50 uppercase tracking-[0.2em] mb-1.5 font-bold">FOCUS CATEGORY</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value as FocusArea)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-none px-3 py-2 text-xs text-white/80 focus:outline-none focus:border-[#ff4d00] font-sans"
                  >
                    {Object.entries(FOCUS_AREAS).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] text-white/50 uppercase tracking-[0.2em] mb-1.5 font-bold">DUE DATE</label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-none px-3 py-1.5 text-xs text-white/80 focus:outline-none focus:border-[#ff4d00] font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="bg-white hover:bg-zinc-200 text-black text-[10px] uppercase tracking-widest font-black px-5 py-2.5 rounded-none cursor-pointer transition-colors"
                >
                  CREATE TASK
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Focus Area Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3.5 mb-4 scrollbar-none border-b border-white/10">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 text-[10px] uppercase tracking-widest rounded-none font-black shrink-0 cursor-pointer transition-all border ${
            filter === 'all'
              ? 'bg-white text-black border-white'
              : 'bg-transparent text-white/40 hover:text-white/80 border-white/10'
          }`}
        >
          ALL ({tasks.length})
        </button>
        {Object.entries(FOCUS_AREAS).map(([key, value]) => {
          const count = tasks.filter((t) => t.category === key).length;
          return (
            <button
              key={key}
              onClick={() => setFilter(key as FocusArea)}
              className={`px-3.5 py-1.5 text-[10px] uppercase tracking-widest rounded-none font-black shrink-0 cursor-pointer transition-all border ${
                filter === key
                  ? 'bg-[#ff4d00] text-black border-[#ff4d00]'
                  : 'bg-transparent text-white/40 hover:text-white/80 border-white/10'
              }`}
            >
              {value.label.split(' ')[0]} ({count})
            </button>
          );
        })}
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto max-h-[350px] pr-1 space-y-2.5">
        <AnimatePresence initial={false}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => {
              const meta = FOCUS_AREAS[task.category];
              const IconComponent = (Icons[meta.icon as keyof typeof Icons] || Icons.Music) as React.ComponentType<any>;
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className={`flex items-start justify-between gap-3 p-4 rounded-none border transition-all text-left ${
                    task.completed
                      ? 'bg-zinc-900/10 border-white/5 opacity-40'
                      : 'bg-zinc-900/40 border-white/10 border-l-2 border-l-[#ff4d00] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="mt-0.5 text-white/40 hover:text-[#ff4d00] transition-colors cursor-pointer focus:outline-none shrink-0"
                    >
                      {task.completed ? (
                        <div className="w-4 h-4 bg-[#ff4d00] border border-[#ff4d00] flex items-center justify-center">
                          <Icons.Check className="w-3 h-3 text-black stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 border border-white/40 hover:border-[#ff4d00] transition-colors" />
                      )}
                    </button>
                    <div className="flex-grow min-w-0">
                      <p
                        className={`text-sm text-white font-light tracking-wide break-words ${
                          task.completed ? 'line-through text-white/30 font-extralight' : ''
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-3 mt-2 font-mono text-[9px] text-white/40 uppercase tracking-widest">
                        <span className="inline-flex items-center gap-1">
                          <IconComponent className="w-2.5 h-2.5 text-[#ff4d00]" />
                          {meta.label}
                        </span>
                        {task.dueDate && (
                          <span className="inline-flex items-center gap-1">
                            <Icons.Calendar className="w-2.5 h-2.5" />
                            {task.dueDate}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="text-white/20 hover:text-red-500 p-1.5 rounded-none hover:bg-white/5 transition-all cursor-pointer focus:outline-none"
                    title="Delete task"
                  >
                    <Icons.Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-white/5">
              <Icons.Inbox className="w-8 h-8 text-white/10 mb-3" />
              <p className="text-[10px] uppercase tracking-widest text-white/30">Backlog is empty</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
