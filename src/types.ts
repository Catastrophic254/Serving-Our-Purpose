/**
 * Types for the Daily Standup for Music Artists applet.
 */

export interface ArtistProfile {
  name: string;
  role: string;
  genres: string[];
  mainGoal: string;
  currentProject: string;
}

export interface AIFeedback {
  producerNote: string;
  managerNote: string;
  creativePrompt: string;
  recommendedTasks: string[];
  timestamp: string;
}

export type FocusArea = 
  | 'songwriting' 
  | 'production' 
  | 'mixing-mastering' 
  | 'marketing-promo' 
  | 'booking-live' 
  | 'admin-business';

export interface StandupLog {
  id: string;
  date: string;
  accomplished: string;
  workingOn: string;
  blockers: string;
  creativeEnergy: number; // 1 to 5
  focusArea: FocusArea;
  aiFeedback?: AIFeedback;
}

export interface MusicTask {
  id: string;
  title: string;
  category: FocusArea;
  completed: boolean;
  dueDate?: string;
  associatedProject?: string;
}

export interface ReleaseProject {
  id: string;
  title: string;
  type: 'Single' | 'EP' | 'Album' | 'Music Video' | 'Other';
  releaseDate: string;
  status: 'planning' | 'writing' | 'recording' | 'mixing' | 'mastered' | 'campaign-active' | 'released';
  checklist: {
    id: string;
    text: string;
    completed: boolean;
  }[];
}
