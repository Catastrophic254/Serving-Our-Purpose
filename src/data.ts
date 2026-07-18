import { ArtistProfile, StandupLog, MusicTask, ReleaseProject, FocusArea } from './types';

export const FOCUS_AREAS: Record<FocusArea, { label: string; icon: string; color: string; hoverColor: string; description: string }> = {
  songwriting: {
    label: 'Songwriting',
    icon: 'Music',
    color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    hoverColor: 'hover:bg-amber-500/20',
    description: 'Lyrics, chord progressions, melodies, and structural arrangements.'
  },
  production: {
    label: 'Music Production',
    icon: 'Sliders',
    color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    hoverColor: 'hover:bg-purple-500/20',
    description: 'Beatmaking, tracking, MIDI sequencing, synthesis, and sound design.'
  },
  'mixing-mastering': {
    label: 'Mixing & Mastering',
    icon: 'Activity',
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    hoverColor: 'hover:bg-blue-500/20',
    description: 'EQ, compression, spatial effects, volume balancing, and final mastering.'
  },
  'marketing-promo': {
    label: 'Marketing & Promo',
    icon: 'Megaphone',
    color: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    hoverColor: 'hover:bg-rose-500/20',
    description: 'Social media, mailing lists, press releases, pitch lists, and playlist submission.'
  },
  'booking-live': {
    label: 'Booking & Live',
    icon: 'Sparkles', // Let's use Sparkles or Music for live shows
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    hoverColor: 'hover:bg-emerald-500/20',
    description: 'Tour booking, gig rehearsals, stage set design, and merchandise preparation.'
  },
  'admin-business': {
    label: 'Admin & Business',
    icon: 'Briefcase',
    color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    hoverColor: 'hover:bg-cyan-500/20',
    description: 'PRO registrations, copyright filings, royalty tracking, and contract negotiations.'
  }
};

export const STANDARD_GENRES = [
  'Indie Pop / Dream Pop',
  'Synthwave / Retro Electro',
  'Hip-Hop / Rap / Boom Bap',
  'R&B / Neo-Soul',
  'Alternative Rock / Grunge',
  'Folk / Singer-Songwriter',
  'Cinematic Ambient / Electronic',
  'Jazz / Blues',
  'Metal / Hardcore',
  'Dance / House / Techno',
  'Reggae / Dub'
];

export const ARTIST_ROLES = [
  'Singer-Songwriter',
  'Music Producer / Beatmaker',
  'Vocalist',
  'Multi-Instrumentalist',
  'Mixing & Mastering Engineer',
  'Lyricist / Songwriter',
  'Band Member / Frontperson',
  'Independent Solo Artist'
];

export const INITIAL_PROFILE: ArtistProfile = {
  name: 'Luna Skye',
  role: 'Singer-Songwriter & Producer',
  genres: ['Indie Pop / Dream Pop', 'Synthwave / Retro Electro'],
  mainGoal: 'Complete the production of my 5-song "Neon Reflection" EP and plan a release strategy.',
  currentProject: 'Neon Reflection EP'
};

export const INITIAL_TASKS: MusicTask[] = [
  {
    id: 'task-1',
    title: 'Rewrite the second verse lyrics of "Midnight Ride" to feel more vivid',
    category: 'songwriting',
    completed: false,
    dueDate: '2026-07-19',
    associatedProject: 'Neon Reflection EP'
  },
  {
    id: 'task-2',
    title: 'Record scratch vocal takes for "Starlight Horizon" demo',
    category: 'production',
    completed: true,
    dueDate: '2026-07-16',
    associatedProject: 'Neon Reflection EP'
  },
  {
    id: 'task-3',
    title: 'De-ess the vocal track on lead single "Echoes of You"',
    category: 'mixing-mastering',
    completed: false,
    dueDate: '2026-07-20',
    associatedProject: 'Neon Reflection EP'
  },
  {
    id: 'task-4',
    title: 'Submit pitch details and lyrics for copyright registration',
    category: 'admin-business',
    completed: true,
    dueDate: '2026-07-15',
    associatedProject: 'Neon Reflection EP'
  },
  {
    id: 'task-5',
    title: 'Design initial canvas teaser animation for Spotify / Instagram Reels',
    category: 'marketing-promo',
    completed: false,
    dueDate: '2026-07-22',
    associatedProject: 'Neon Reflection EP'
  }
];

export const INITIAL_LOGS: StandupLog[] = [
  {
    id: 'log-1',
    date: '2026-07-16',
    accomplished: 'Completed the rough arrangement for "Starlight Horizon" and recorded a clean guide vocal track. Configured sidechain compression on the bassline to sit better with the kick drum.',
    workingOn: 'Start layering synthesizers for the second chorus of "Starlight Horizon" to lift the energy. Clean up vocal sibilance on "Echoes of You" using custom de-esser settings.',
    blockers: 'Slightly stuck on the synth leads - feeling a bit generic right now. Need a fresh sound design approach or some analog warmth.',
    creativeEnergy: 4,
    focusArea: 'production',
    aiFeedback: {
      producerNote: 'Your focus on vocal arrangement and low-end spacing ("Starlight Horizon") is spot on. For your synth lead blocker: instead of piling on more plugins, try layering a subtle square wave transposed down an octave with a slow filter LFO, then feed it into a tape saturation emulation. Keep the performance human by slightly nudging the MIDI notes off-grid.',
      managerNote: 'Getting a clean lead vocal is great! As you prepare sibilance cleanup for "Echoes of You", document this behind-the-scenes engineering process. A 15-second screen recording showing a "before and after" de-essing on your DAW can make for highly engaging, technical Instagram Reels for your producer audience.',
      creativePrompt: 'Design a single patch on your favorite synth using ONLY 2 oscillators and no presets. Spend 15 minutes finding a bizarre sound, and write a simple 4-bar melody around it. Don\'t judge it, just record it.',
      recommendedTasks: [
        'Layer a square-wave octave synth underneath the main lead of "Starlight Horizon"',
        'Export a 15-second teaser clip of "Starlight Horizon" bassline for TikTok / Instagram Reels'
      ],
      timestamp: '2026-07-16T18:30:00.000Z'
    }
  },
  {
    id: 'log-2',
    date: '2026-07-15',
    accomplished: 'Fleshed out the chord progression for a new song concept tentatively called "Velvet Waves". Registered copyright and metadata sheet for "Echoes of You" Single.',
    workingOn: 'Draft the lyric sheet for "Velvet Waves" focusing on a retro-nostalgic seaside theme. Begin laying out the drum patterns.',
    blockers: 'Struggling with the lyrical bridge - cannot find the right metaphor to connect the verses to the hook.',
    creativeEnergy: 3,
    focusArea: 'songwriting',
    aiFeedback: {
      producerNote: 'A retro-nostalgic seaside vibe has great potential for dreamy Synthwave! For the bridge lyrics: rather than searching for direct metaphors, write down a list of 10 concrete, physical objects from a retro beach memory (e.g., disposable camera, fading polaroid, cold salt air, rusted boardwalk). Let the items themselves do the heavy lifting of the emotion.',
      managerNote: 'Admin day! Registering copyrights is excellent discipline. Since the lyric sheet is underway, think about SEO-rich descriptors. When uploading "Velvet Waves" lyrics later to Genius or Bandcamp, make sure to add metadata for tags like Dream Pop, Retro, and Indie.',
      creativePrompt: 'Lyrical constraints breed creativity. Write a bridge where every single line MUST contain a specific reference to a physical texture (e.g. rough, cold, smooth, metallic).',
      recommendedTasks: [
        'Write down a list of 10 sensory physical objects to spark lyrics for "Velvet Waves"',
        'Program a simple linndrum-style guide beat for "Velvet Waves" arrangement'
      ],
      timestamp: '2026-07-15T19:15:00.000Z'
    }
  }
];

export const INITIAL_PROJECTS: ReleaseProject[] = [
  {
    id: 'project-1',
    title: 'Neon Reflection EP',
    type: 'EP',
    releaseDate: '2026-10-15',
    status: 'mixing',
    checklist: [
      { id: 'chk-1', text: 'Songwriting & demo arrangement for 5 tracks', completed: true },
      { id: 'chk-2', text: 'Final vocal and live instrument recordings', completed: true },
      { id: 'chk-3', text: 'Full mixing and audio mastering process', completed: false },
      { id: 'chk-4', text: 'Design front cover art and promotional posters', completed: false },
      { id: 'chk-5', text: 'Upload to distributor & schedule Spotify editorial pitch', completed: false },
      { id: 'chk-6', text: 'Prepare press release & build radio/playlist contact list', completed: false }
    ]
  }
];
