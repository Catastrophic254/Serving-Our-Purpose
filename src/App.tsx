import React, { useState, useEffect } from 'react';
import { ArtistProfile, StandupLog, MusicTask, ReleaseProject, FocusArea } from './types';
import {
  FOCUS_AREAS,
  STANDARD_GENRES,
  ARTIST_ROLES,
  INITIAL_PROFILE,
  INITIAL_TASKS,
  INITIAL_LOGS,
  INITIAL_PROJECTS
} from './data';
import FocusAreaBadge from './components/FocusAreaBadge';
import TaskBoard from './components/TaskBoard';
import ReleaseChecklist from './components/ReleaseChecklist';
import AIPanel from './components/AIPanel';
import StandupLogHistory from './components/StandupLogHistory';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // --- Persistent States ---
  const [profile, setProfile] = useState<ArtistProfile>(() => {
    const saved = localStorage.getItem('standup_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [logs, setLogs] = useState<StandupLog[]>(() => {
    const saved = localStorage.getItem('standup_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  const [tasks, setTasks] = useState<MusicTask[]>(() => {
    const saved = localStorage.getItem('standup_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [releaseProject, setReleaseProject] = useState<ReleaseProject>(() => {
    const saved = localStorage.getItem('standup_project');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS[0];
  });

  // --- UI/Interaction States ---
  const [selectedLog, setSelectedLog] = useState<StandupLog | undefined>(() => {
    const savedLogs = localStorage.getItem('standup_logs');
    const parsedLogs = savedLogs ? JSON.parse(savedLogs) : INITIAL_LOGS;
    return parsedLogs.length > 0 ? parsedLogs[0] : undefined;
  });

  const [formAccomplished, setFormAccomplished] = useState('');
  const [formWorkingOn, setFormWorkingOn] = useState('');
  const [formBlockers, setFormBlockers] = useState('');
  const [formFocusArea, setFormFocusArea] = useState<FocusArea>('production');
  const [formCreativeEnergy, setFormCreativeEnergy] = useState<number>(4);

  const [isSubmittingLog, setIsSubmittingLog] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Profile Edit fields
  const [editName, setEditName] = useState(profile.name);
  const [editRole, setEditRole] = useState(profile.role);
  const [editMainGoal, setEditMainGoal] = useState(profile.mainGoal);
  const [editProject, setEditProject] = useState(profile.currentProject);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(profile.genres);

  // --- Effects for Storage Synchronization ---
  useEffect(() => {
    localStorage.setItem('standup_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('standup_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('standup_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('standup_project', JSON.stringify(releaseProject));
  }, [releaseProject]);

  // --- Toast Trigger helper ---
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // --- Streak Calculator ---
  const calculateStreak = (logsList: StandupLog[]): number => {
    if (logsList.length === 0) return 0;
    
    // Sort logs by date descending (YYYY-MM-DD)
    const sorted = [...logsList].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const latestLogDate = new Date(sorted[0].date);
    latestLogDate.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - latestLogDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) {
      return 0; // Broken streak, latest is older than yesterday
    }
    
    let lastDate = latestLogDate;
    streak = 1;
    for (let i = 1; i < sorted.length; i++) {
      const currentLogDate = new Date(sorted[i].date);
      currentLogDate.setHours(0, 0, 0, 0);
      const dateDiff = lastDate.getTime() - currentLogDate.getTime();
      const dayDiff = Math.ceil(dateDiff / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        streak++;
        lastDate = currentLogDate;
      } else if (dayDiff > 1) {
        break; // gap detected
      }
    }
    return streak;
  };

  const streakCount = calculateStreak(logs);

  // --- Task Operations ---
  const handleToggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    triggerToast('Task state updated.');
  };

  const handleAddTask = (title: string, category: FocusArea, dueDate?: string) => {
    const newTask: MusicTask = {
      id: `task-${Date.now()}`,
      title,
      category,
      completed: false,
      dueDate,
      associatedProject: profile.currentProject
    };
    setTasks(prev => [newTask, ...prev]);
    triggerToast('Added task to backlog.');
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    triggerToast('Task deleted.');
  };

  // --- Release Project Operations ---
  const handleToggleChecklistItem = (projectId: string, itemId: string) => {
    if (projectId !== releaseProject.id) return;
    setReleaseProject(prev => ({
      ...prev,
      checklist: prev.checklist.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    }));
  };

  const handleAddChecklistItem = (projectId: string, text: string) => {
    if (projectId !== releaseProject.id) return;
    const newItem = {
      id: `chk-${Date.now()}`,
      text,
      completed: false
    };
    setReleaseProject(prev => ({
      ...prev,
      checklist: [...prev.checklist, newItem]
    }));
    triggerToast('Added campaign milestone.');
  };

  const handleChangeProjectStatus = (projectId: string, status: ReleaseProject['status']) => {
    if (projectId !== releaseProject.id) return;
    setReleaseProject(prev => ({ ...prev, status }));
    triggerToast(`Campaign status updated to: ${status}`);
  };

  // --- AI Suggested Tasks Import ---
  const handleImportSuggestedTasks = (suggested: string[]) => {
    const newTasks: MusicTask[] = suggested.map((text, index) => ({
      id: `task-${Date.now()}-${index}`,
      title: text,
      category: formFocusArea,
      completed: false,
      associatedProject: profile.currentProject
    }));
    setTasks(prev => [...newTasks, ...prev]);
    triggerToast(`Imported ${suggested.length} actionable tasks into studio board.`);
  };

  // --- Standup Submission (AI API Call) ---
  const handleStandupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAccomplished.trim() || !formWorkingOn.trim()) {
      triggerToast('Please describe what you did and today\'s plan!');
      return;
    }

    setIsSubmittingLog(true);
    // Smooth scroll to top of consultation panel so they see the review load
    const consultationPanel = document.getElementById('ai-panel-loading') || document.getElementById('ai-panel-content') || document.getElementById('ai-panel-empty');
    if (consultationPanel) {
      consultationPanel.scrollIntoView({ behavior: 'smooth' });
    }

    try {
      const todayString = new Date().toISOString().split('T')[0];

      // Submit to full-stack Gemini endpoint
      const response = await fetch('/api/gemini/standup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          artistProfile: profile,
          accomplished: formAccomplished,
          workingOn: formWorkingOn,
          blockers: formBlockers,
          focusArea: formFocusArea,
          creativeEnergy: formCreativeEnergy
        })
      });

      if (!response.ok) {
        throw new Error('API server returned error code ' + response.status);
      }

      const feedbackData = await response.json();

      const newLog: StandupLog = {
        id: `log-${Date.now()}`,
        date: todayString,
        accomplished: formAccomplished.trim(),
        workingOn: formWorkingOn.trim(),
        blockers: formBlockers.trim(),
        creativeEnergy: formCreativeEnergy,
        focusArea: formFocusArea,
        aiFeedback: feedbackData
      };

      // Add to list and select it
      const updatedLogs = [newLog, ...logs];
      setLogs(updatedLogs);
      setSelectedLog(newLog);

      // Clear form
      setFormAccomplished('');
      setFormWorkingOn('');
      setFormBlockers('');
      setFormCreativeEnergy(4);

      triggerToast('Standup published. AI Executive Producer reviewed your track.');
    } catch (err: any) {
      console.error('Failed to submit standup:', err);
      triggerToast('AI server error. Standup saved locally with fallback recommendations.');
      
      // Fallback local mock save so they never lose work!
      const todayString = new Date().toISOString().split('T')[0];
      const localFeedback = {
        producerNote: `Your recording session needs structured depth. Keep backing up your project vocals and check low-mids in your mix. Ensure sibilance (the harsh "S" frequencies) is tamed around 5kHz-8kHz.`,
        managerNote: `Consistency in your release planner is key. Schedule weekly behind-the-scenes teasers for ${profile.genres[0]} listeners on social media.`,
        creativePrompt: `Mute the main melody instrument and write a totally separate bassline rhythm to fit underneath the vocal track to unlock fresh movement.`,
        recommendedTasks: [
          `Test your mixing track output on alternative speaker monitors.`,
          `Draft standard lyrics and copyright metadata for your future single.`
        ],
        timestamp: new Date().toISOString()
      };

      const fallbackLog: StandupLog = {
        id: `log-fallback-${Date.now()}`,
        date: todayString,
        accomplished: formAccomplished.trim(),
        workingOn: formWorkingOn.trim(),
        blockers: formBlockers.trim(),
        creativeEnergy: formCreativeEnergy,
        focusArea: formFocusArea,
        aiFeedback: localFeedback
      };

      setLogs(prev => [fallbackLog, ...prev]);
      setSelectedLog(fallbackLog);
      
      setFormAccomplished('');
      setFormWorkingOn('');
      setFormBlockers('');
    } finally {
      setIsSubmittingLog(false);
    }
  };

  // --- Profile Editing ---
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ArtistProfile = {
      name: editName.trim() || 'Luna Skye',
      role: editRole.trim() || 'Artist',
      genres: selectedGenres.length > 0 ? selectedGenres : ['Indie Pop'],
      mainGoal: editMainGoal.trim() || 'Release an EP',
      currentProject: editProject.trim() || 'New EP'
    };
    
    setProfile(updated);
    
    // Also update current project name inside active release checklists
    if (updated.currentProject !== profile.currentProject) {
      setReleaseProject(prev => ({
        ...prev,
        title: updated.currentProject
      }));
    }

    setIsEditingProfile(false);
    triggerToast('Artist profile updated.');
  };

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  // --- Backup Mechanics (JSON) ---
  const handleExportData = () => {
    const dataStr = JSON.stringify({
      profile,
      logs,
      tasks,
      releaseProject
    }, null, 2);
    
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profile.name.replace(/\s+/g, '_')}_Studio_Journal_Backup.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast('Studio Journal exported successfully.');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.logs) {
          setLogs(parsed.logs);
          if (parsed.logs.length > 0) {
            setSelectedLog(parsed.logs[0]);
          }
        }
        if (parsed.tasks) setTasks(parsed.tasks);
        if (parsed.releaseProject) setReleaseProject(parsed.releaseProject);
        
        triggerToast('Studio Journal backup imported successfully.');
      } catch (err) {
        console.error(err);
        triggerToast('Failed to parse file. Make sure it is a valid backup JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetToDefaults = () => {
    if (window.confirm('This will restore all default templates. Proceed?')) {
      localStorage.clear();
      setProfile(INITIAL_PROFILE);
      setLogs(INITIAL_LOGS);
      setSelectedLog(INITIAL_LOGS[0]);
      setTasks(INITIAL_TASKS);
      setReleaseProject(INITIAL_PROJECTS[0]);
      triggerToast('Studio Console reset to default session.');
    }
  };

  const artistFirstName = profile.name.split(' ')[0] || 'LUNA';
  const artistLastName = profile.name.split(' ').slice(1).join(' ') || 'SKYE';

  return (
    <div className="min-h-screen bg-[#080808] text-[#f2f2f2] font-sans selection:bg-[#ff4d00] selection:text-black overflow-x-hidden relative" id="main-layout">
      {/* Background Graphic Element - Large low opacity watermark */}
      <div className="absolute top-[80px] right-[-100px] text-[350px] sm:text-[450px] font-black text-white/[0.015] leading-none select-none pointer-events-none uppercase tracking-tighter z-0">
        REC
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#ff4d00] border border-white/20 text-black text-xs px-5 py-3 font-mono font-bold tracking-wider rounded-none shadow-2xl flex items-center gap-2"
          >
            <Icons.Sparkles className="w-4 h-4 text-black" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Navigation - Industrial Swiss Style */}
      <header className="border-b border-white/10 bg-[#080808]/90 backdrop-blur-md sticky top-0 z-30 py-4 px-4 sm:px-6 lg:px-8" id="header-nav">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-5">
          
          {/* Left Title details */}
          <div className="flex flex-col text-left">
            <span className="text-[9px] uppercase tracking-[0.35em] text-white/50 mb-1 font-mono font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-[#ff4d00] animate-pulse shrink-0" />
              ARTIST STANDUP CONSOLE v1.1
            </span>
            <span className="text-xl font-black tracking-tight uppercase font-sans">
              DAILY RECAP / STUDIO SYNC
            </span>
          </div>

          {/* Quick Stats, Streak and utilities */}
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-start md:justify-end">
            
            {/* Streak meter widget */}
            {streakCount > 0 ? (
              <div className="flex items-center gap-2 bg-[#ff4d00]/10 border border-[#ff4d00]/30 text-[#ff4d00] px-4 py-2 rounded-none text-xs font-mono font-bold tracking-wider">
                <Icons.Flame className="w-4 h-4 text-[#ff4d00]" />
                <span>STREAK: {streakCount} DAYS</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-zinc-900/50 border border-white/5 text-white/40 px-4 py-2 rounded-none text-xs font-mono tracking-wider">
                <Icons.Activity className="w-3.5 h-3.5" />
                <span>0-DAY STREAK</span>
              </div>
            )}

            {/* Portability tools */}
            <div className="flex items-center gap-2 font-mono">
              <button
                onClick={handleExportData}
                className="bg-transparent hover:bg-white hover:text-black border border-white/20 text-white px-3.5 py-2 rounded-none text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5 cursor-pointer transition-all focus:outline-none"
                title="Backup Journal"
              >
                <Icons.UploadCloud className="w-3.5 h-3.5" /> BACKUP
              </button>
              
              <label className="bg-transparent hover:bg-white hover:text-black border border-white/20 text-white px-3.5 py-2 rounded-none text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5 cursor-pointer transition-all focus:outline-none">
                <Icons.DownloadCloud className="w-3.5 h-3.5" /> RESTORE
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleResetToDefaults}
                className="text-white/30 hover:text-[#ff4d00] p-2 border border-transparent hover:border-white/10 transition-all cursor-pointer focus:outline-none"
                title="Reset Session"
              >
                <Icons.RotateCcw className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Artist Name - Hero Section (Stunning big typography) */}
        <div className="relative mb-14 text-left">
          <h1 className="text-[56px] sm:text-[90px] md:text-[120px] font-black leading-[0.85] tracking-tighter uppercase break-words font-sans">
            {artistFirstName} <br/> 
            <span className="text-transparent text-stroke select-none">
              {artistLastName}
            </span>
          </h1>
          
          {/* Aesthetic speed dial / focus indicator */}
          <div className="absolute top-0 right-0 hidden lg:flex w-44 h-44 border border-white/10 rounded-full items-center justify-center">
            <div className="text-center p-3">
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-mono font-bold mb-1">SESSION VIBE</p>
              <p className="text-2xl font-serif italic text-white/95">Inspired</p>
              <p className="text-[10px] mt-2 font-mono text-[#ff4d00] font-bold tracking-widest">
                120 BPM // 44.1kHz
              </p>
            </div>
          </div>
        </div>

        {/* Primary Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Profile Details & active Logger */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. Artist Profile Card */}
            <section className="bg-[#0e0e0e] border border-white/10 rounded-none p-6 relative overflow-hidden text-left" id="profile-section">
              <div className="absolute top-0 right-0 w-3 h-3 bg-[#ff4d00]" />
              
              {!isEditingProfile ? (
                <div className="relative">
                  <div className="flex items-start justify-between pb-4 border-b border-white/5">
                    <div className="flex items-center gap-4 text-left">
                      {/* Avatar design - bold high contrast */}
                      <div className="w-12 h-12 bg-[#ff4d00] text-black font-black text-xl flex items-center justify-center rounded-none border border-[#ff4d00] font-mono shadow-lg">
                        {artistFirstName[0]}
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tight font-sans">{profile.name}</h2>
                        <p className="text-xs text-[#ff4d00] font-mono uppercase tracking-widest font-bold">{profile.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setEditName(profile.name);
                        setEditRole(profile.role);
                        setEditMainGoal(profile.mainGoal);
                        setEditProject(profile.currentProject);
                        setSelectedGenres(profile.genres);
                        setIsEditingProfile(true);
                      }}
                      className="text-white/40 hover:text-white bg-white/5 border border-white/10 hover:border-white/30 px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase rounded-none cursor-pointer transition-all"
                      title="Edit Profile"
                    >
                      EDIT PROFILE
                    </button>
                  </div>

                  <div className="mt-5 space-y-4 font-mono text-left">
                    <div>
                      <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold block mb-1">CURRENT RECORD PROJECT</span>
                      <span className="text-sm text-white font-bold tracking-wide flex items-center gap-2 uppercase font-sans">
                        <Icons.Disc className="w-4 h-4 text-[#ff4d00] animate-spin" />
                        {profile.currentProject || 'No active project'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-1 font-bold">SESSION VISION & TARGET</span>
                      <p className="text-xs text-white/80 leading-relaxed font-sans font-light italic">
                        "{profile.mainGoal}"
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {profile.genres.map((g, idx) => (
                        <span key={idx} className="bg-zinc-950 text-white/60 text-[9px] font-mono uppercase tracking-wider px-3 py-1 border border-white/5 rounded-none font-bold">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Profile Editing Form Inline */
                <form onSubmit={handleSaveProfile} className="relative space-y-5 text-left">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h3 className="font-black text-xs text-white uppercase tracking-[0.2em]">UPDATE ARTIST DECK</h3>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="text-white/45 hover:text-white text-xs font-mono font-bold"
                    >
                      CANCEL
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] text-white/50 uppercase tracking-[0.15em] mb-1.5 font-bold font-mono">Artist / Project Name</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 rounded-none px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#ff4d00] font-sans"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-white/50 uppercase tracking-[0.15em] mb-1.5 font-bold font-mono">Artist Main Role</label>
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 rounded-none px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#ff4d00] font-sans"
                      >
                        {ARTIST_ROLES.map((role) => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] text-white/50 uppercase tracking-[0.15em] mb-1.5 font-bold font-mono">Current Release/Campaign Title</label>
                      <input
                        type="text"
                        value={editProject}
                        onChange={(e) => setEditProject(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 rounded-none px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#ff4d00] font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-white/50 uppercase tracking-[0.15em] mb-1.5 font-bold font-mono">Release Milestone Date</label>
                      <input
                        type="date"
                        value={releaseProject.releaseDate}
                        onChange={(e) => setReleaseProject(prev => ({ ...prev, releaseDate: e.target.value }))}
                        className="w-full bg-zinc-950 border border-white/10 rounded-none px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#ff4d00] font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] text-white/50 uppercase tracking-[0.15em] mb-1.5 font-bold font-mono">Main Goal / Target Vision</label>
                    <textarea
                      value={editMainGoal}
                      onChange={(e) => setEditMainGoal(e.target.value)}
                      rows={2}
                      className="w-full bg-zinc-950 border border-white/10 rounded-none px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff4d00] resize-none font-sans font-light leading-relaxed"
                      required
                    />
                  </div>

                  {/* Genres choice */}
                  <div>
                    <label className="block text-[9px] text-white/50 uppercase tracking-[0.15em] mb-2 font-bold font-mono">Studio Tag Genres</label>
                    <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto border border-white/10 p-3 rounded-none bg-zinc-950">
                      {STANDARD_GENRES.map((g) => {
                        const isSelected = selectedGenres.includes(g);
                        return (
                          <button
                            key={g}
                            type="button"
                            onClick={() => handleGenreToggle(g)}
                            className={`px-3 py-1 text-[9px] uppercase font-mono font-bold border transition-all cursor-pointer rounded-none ${
                              isSelected
                                ? 'bg-[#ff4d00] text-black border-[#ff4d00]'
                                : 'bg-transparent text-white/40 border-white/10 hover:border-white/30'
                            }`}
                          >
                            {g}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-white/5">
                    <button
                      type="submit"
                      className="bg-white hover:bg-zinc-200 text-black text-[10px] uppercase tracking-widest font-black px-5 py-3 rounded-none cursor-pointer transition-colors"
                    >
                      SAVE PROFILE CHANGES
                    </button>
                  </div>
                </form>
              )}
            </section>
            
            {/* 2. Daily Standup Logger Form */}
            <section className="bg-[#0e0e0e] border border-white/10 rounded-none p-6 relative" id="standup-form">
              <div className="absolute top-0 right-0 w-3 h-3 bg-[#ff4d00]" />

              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-white/10">
                <span className="text-[10px] font-mono text-[#ff4d00] font-bold border border-[#ff4d00]/30 px-1.5 py-0.5 bg-[#ff4d00]/5">LOG</span>
                <h3 className="font-black text-white text-xs uppercase tracking-[0.3em]">PUBLISH DAILY STANDUP</h3>
              </div>

              <form onSubmit={handleStandupSubmit} className="space-y-5 text-left">
                {/* 1. What was done yesterday */}
                <div>
                  <label className="block text-[9px] text-white/50 uppercase tracking-[0.15em] font-mono font-bold mb-2">
                    YESTERDAY // WORK ACCOMPLISHED & SOUND PROGRESS
                  </label>
                  <textarea
                    rows={2}
                    value={formAccomplished}
                    onChange={(e) => setFormAccomplished(e.target.value)}
                    placeholder="e.g., Programmed synthesized bass loops on lead single; sent copyright form metadata sheet..."
                    className="w-full bg-zinc-950 border border-white/10 rounded-none px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ff4d00] placeholder-zinc-600 leading-relaxed font-sans font-light"
                    required
                  />
                </div>

                {/* 2. Today's focus plans */}
                <div>
                  <label className="block text-[9px] text-white/50 uppercase tracking-[0.15em] font-mono font-bold mb-2">
                    TODAY // STRATEGIC OBJECTIVE & STUDIO FOCUS
                  </label>
                  <textarea
                    rows={2}
                    value={formWorkingOn}
                    onChange={(e) => setFormWorkingOn(e.target.value)}
                    placeholder="e.g., Record backing vocal harmonies for the chorus; design instagram reels canvas teaser..."
                    className="w-full bg-zinc-950 border border-white/10 rounded-none px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ff4d00] placeholder-zinc-600 leading-relaxed font-sans font-light"
                    required
                  />
                </div>

                {/* 3. Blockers */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[9px] text-white/50 uppercase tracking-[0.15em] font-mono font-bold">
                      SPEEDBUMPS // BLOCKERS & TECHNICAL NOISE
                    </label>
                    <span className="text-[8px] text-white/30 uppercase font-mono">OPTIONAL</span>
                  </div>
                  <input
                    type="text"
                    value={formBlockers}
                    onChange={(e) => setFormBlockers(e.target.value)}
                    placeholder="e.g., Finding clean presets; bridge transition arrangement feels clunky; delayed flight..."
                    className="w-full bg-zinc-950 border border-white/10 rounded-none px-4 py-3 text-xs text-white focus:outline-none focus:border-[#ff4d00] placeholder-zinc-600 font-sans font-light"
                  />
                </div>

                {/* 4. Focus Area Selector Grid */}
                <div>
                  <label className="block text-[9px] text-white/50 uppercase tracking-[0.15em] font-mono font-bold mb-3">
                    PRIMARY STUDIO DISCIPLINE
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(FOCUS_AREAS).map(([key, value]) => {
                      const isSelected = formFocusArea === key;
                      const IconComponent = (Icons[value.icon as keyof typeof Icons] || Icons.Music) as React.ComponentType<any>;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFormFocusArea(key as FocusArea)}
                          className={`p-3.5 rounded-none border text-left flex items-start gap-3 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#ff4d00]/5 border-[#ff4d00]'
                              : 'bg-zinc-950/40 border-white/5 hover:border-white/15'
                          }`}
                        >
                          <div className={`p-2 rounded-none shrink-0 ${isSelected ? 'bg-[#ff4d00]/10 text-[#ff4d00]' : 'bg-zinc-900 text-white/40'}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className={`text-[11px] font-bold block uppercase tracking-wider ${isSelected ? 'text-[#ff4d00]' : 'text-white/80'}`}>
                              {value.label}
                            </span>
                            <span className="text-[9px] text-white/40 line-clamp-1 leading-none mt-1 font-light">
                              {value.description}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Creative Energy Level waves */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-[9px] text-white/50 uppercase tracking-[0.15em] font-mono font-bold">
                      CREATIVE ENERGY BANDWIDTH
                    </label>
                    <span className="text-[10px] font-mono font-bold text-[#ff4d00] flex items-center gap-1.5">
                      <Icons.Zap className="w-3.5 h-3.5 text-[#ff4d00]" />
                      {formCreativeEnergy === 1 && 'MIN (1/5)'}
                      {formCreativeEnergy === 2 && 'MELLOW (2/5)'}
                      {formCreativeEnergy === 3 && 'STEADY (3/5)'}
                      {formCreativeEnergy === 4 && 'INSPIRED (4/5)'}
                      {formCreativeEnergy === 5 && 'HYPER-FOCUS (5/5)'}
                    </span>
                  </div>
                  {/* Tactical selector blocks */}
                  <div className="flex gap-2.5">
                    {[1, 2, 3, 4, 5].map((level) => {
                      const isActive = formCreativeEnergy >= level;
                      const isCurrent = formCreativeEnergy === level;
                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setFormCreativeEnergy(level)}
                          className={`flex-1 h-10 rounded-none border flex flex-col items-center justify-center cursor-pointer transition-all focus:outline-none ${
                            isActive
                              ? isCurrent
                                ? 'bg-[#ff4d00]/15 border-[#ff4d00] text-[#ff4d00] font-black'
                                : 'bg-[#ff4d00]/5 border-[#ff4d00]/20 text-[#ff4d00]/70'
                              : 'bg-zinc-950 border-white/5 text-white/30 hover:text-white/50'
                          }`}
                        >
                          <span className="text-xs font-mono font-bold">{level}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submission button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmittingLog}
                    className={`w-full py-4 px-5 rounded-none text-xs font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none ${
                      isSubmittingLog
                        ? 'bg-zinc-850 text-white/30 border border-white/10'
                        : 'bg-[#ff4d00] hover:bg-[#e04400] text-black border border-[#ff4d00]'
                    }`}
                  >
                    {isSubmittingLog ? (
                      <>
                        <Icons.Loader2 className="w-4 h-4 animate-spin" />
                        AI EXECUTIVE PRODUCER REVIEWING MASTERTRACK...
                      </>
                    ) : (
                      <>
                        <Icons.Send className="w-3.5 h-3.5" />
                        PUBLISH STANDUP & SYNC WITH EXECUTIVE AI
                      </>
                    )}
                  </button>
                </div>
              </form>
            </section>

          </div>

          {/* RIGHT COLUMN: AI Panel, Task Board, checklists, history logs */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* 1. AI Studio Consultation Panel */}
            <AIPanel
              feedback={selectedLog?.aiFeedback}
              isLoading={isSubmittingLog}
              onImportTasks={handleImportSuggestedTasks}
              artistName={profile.name}
            />

            {/* 2. Studio Backlog Tasks Board */}
            <TaskBoard
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
            />

            {/* 3. Release Milestones Campaign planner */}
            <ReleaseChecklist
              project={releaseProject}
              onToggleChecklistItem={handleToggleChecklistItem}
              onAddChecklistItem={handleAddChecklistItem}
              onChangeProjectStatus={handleChangeProjectStatus}
            />

            {/* 4. Studio Journal list of past logs */}
            <StandupLogHistory
              logs={logs}
              onSelectLog={(log) => setSelectedLog(log)}
              selectedLogId={selectedLog?.id}
            />

          </div>

        </div>
      </main>

      {/* Industrial minimalist footer */}
      <footer className="border-t border-white/10 bg-[#080808] py-12 mt-20 relative z-10" id="footer">
        <p className="text-[10px] uppercase tracking-widest text-white/30">
          DAILY STANDUP SYNC ENGINE &bull; FOR INDEPENDENT MUSIC ARTISTS
        </p>
        <div className="flex items-center justify-center gap-2.5 text-[9px] text-[#ff4d00] mt-3 font-mono font-bold tracking-wider uppercase">
          <span>PORT: 3000</span>
          <span>//</span>
          <span>GEMINI MODEL: 3.5-FLASH</span>
          <span>//</span>
          <span>STATUS: STREAMING LIVE</span>
        </div>
      </footer>
    </div>
  );
}

