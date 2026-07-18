import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy initialisation of Gemini client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Simple health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Standup review endpoint using Gemini API with intelligent local fallback
app.post('/api/gemini/standup', async (req, res) => {
  try {
    const { artistProfile, accomplished, workingOn, blockers, focusArea, creativeEnergy } = req.body;

    if (!artistProfile || !accomplished || !workingOn || !focusArea) {
      return res.status(400).json({ error: 'Missing required standup fields.' });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Return high-quality, simulated music-industry feedback customized to their input
      console.log('No Gemini API key detected. Using high-fidelity local music-industry generator.');
      const simulatedFeedback = generateSimulatedFeedback(
        artistProfile,
        accomplished,
        workingOn,
        blockers,
        focusArea,
        creativeEnergy
      );
      return res.json(simulatedFeedback);
    }

    const systemInstruction = `You are a legendary Music Executive Producer, Master Mix Engineer, and Artist Manager combined.
Your tone is authentic, inspiring, highly constructive, and specific to the music industry. You despise generic business jargon.
When addressing artists, you give them practical production hacks, creative songwriting breakthroughs, and actionable marketing steps.
Always speak to the artist's listed genres, their role, and current goal. Keep your notes compact but highly valuable.`;

    const prompt = `Review the daily standup details for this music artist:
Artist Name: ${artistProfile.name}
Role: ${artistProfile.role}
Genres: ${artistProfile.genres.join(', ')}
Main Goal: ${artistProfile.mainGoal}
Current Project: ${artistProfile.currentProject}

Focus Area for today: ${focusArea}
Creative Energy Level (1-5): ${creativeEnergy}/5

What they accomplished yesterday:
"${accomplished}"

What they are working on today:
"${workingOn}"

Their current creative, technical, or business blockers:
"${blockers || 'No active blockers listed.'}"

Generate feedback structured strictly according to the requested JSON format. Include:
1. producerNote: Technical or creative advice about arrangement, sound design, recording, or engineering. Reference their specific genre and instruments.
2. managerNote: Career, marketing, release campaign, social media teaser, or administrative tips. Keep it realistic and independent-friendly.
3. creativePrompt: A 5-minute exercise or songwriting constraint to shake off blockers and jumpstart today's session.
4. recommendedTasks: An array of 1 to 2 very clear, short, actionable tasks they should add to their daily board.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            producerNote: {
              type: Type.STRING,
              description: 'Insightful creative or technical recording/mixing feedback.',
            },
            managerNote: {
              type: Type.STRING,
              description: 'Strategic music marketing, planning, or booking feedback.',
            },
            creativePrompt: {
              type: Type.STRING,
              description: 'A 5-minute creative prompt or constraint to try right now.',
            },
            recommendedTasks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '1 to 2 precise, actionable tasks to add to their todo list.',
            }
          },
          required: ['producerNote', 'managerNote', 'creativePrompt', 'recommendedTasks'],
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response received from Gemini.');
    }

    const data = JSON.parse(responseText);
    return res.json(data);

  } catch (error: any) {
    console.error('Error during Gemini API execution:', error);
    return res.status(500).json({
      error: 'Failed to generate feedback via Gemini API.',
      details: error.message || error,
      fallbackUsed: true,
      data: generateSimulatedFeedback(
        req.body.artistProfile || { name: 'Luna Skye', genres: ['Pop'], role: 'Artist' },
        req.body.accomplished || 'Writing music.',
        req.body.workingOn || 'Finishing song.',
        req.body.blockers || '',
        req.body.focusArea || 'songwriting',
        req.body.creativeEnergy || 3
      )
    });
  }
});

// High-Fidelity Music-Industry Simulation Engine for Setup-Free Testing
function generateSimulatedFeedback(
  profile: any,
  accomplished: string,
  workingOn: string,
  blockers: string,
  focusArea: string,
  energy: number
) {
  const genresStr = profile.genres?.join(' & ') || 'Music';
  
  let producerNote = `Excellent work in the studio yesterday! Spacing and low-end clarity are critical when working with ${genresStr}. To make your current work on "${workingOn}" translate perfectly across car speakers and studio monitors, check your mid-frequency range. Sometimes cutting 200Hz to 250Hz on guitars or synth pads slightly will instantly make room for your lead vocals or main melodic line to breathe.`;
  
  let managerNote = `Staying disciplined in your daily workspace is how great catalogs are built. For your goal ("${profile.mainGoal}"), remember that release momentum starts long before release day. Take a brief 10-second screen capture of your arrangement window, or film a close-up of your hands on your midi controller/instrument. Teasing these early stages builds immense curiosity on TikTok and Instagram.`;
  
  let creativePrompt = `Spend the first 10 minutes of today's session writing down 10 stream-of-consciousness words that capture the precise visual aesthetic or cinematic color palette of your current song. Use these words as search queries to find inspiration, or as absolute lyrical rules for your next section.`;
  
  let recommendedTasks = [
    `Perform a A/B reference test of your track against a commercial ${profile.genres?.[0] || 'indie'} release.`,
    `Draft a 1-sentence storyline description of the track for your future distributor pitch.`
  ];

  // Tailor feedback to Focus Area
  if (focusArea === 'songwriting') {
    producerNote = `When writing new hooks or lyrics for ${genresStr}, melody simplicity is your secret weapon. If you are feeling blocked on a section, try the "gibberish vocal trick": record yourself singing nonsense syllables over your chord loop to discover the absolute natural flow and rhythm first, then replace those phonetics with your actual lyrics.`;
    creativePrompt = `Write down 3 alternative titles for "${profile.currentProject || 'your track'}". Pick the most evocative one and write a 4-line chorus hook where each line MUST end on a word describing a physical texture.`;
    recommendedTasks = [
      `Map out the full structural anatomy of your song (e.g. Intro-Verse-Chorus-Verse-Chorus-Bridge-Chorus-Outro).`,
      `Record a simple voice memo of three different chorus vocal melodies to select the catchiest hook.`
    ];
  } else if (focusArea === 'production') {
    producerNote = `Your production approach on ${genresStr} relies heavily on mood. To add organic texture and avoid that "in-the-box" feeling, try using your phone's microphone to record an ambient field recording (keys jingling, footsteps, rain, room tone) and blend it extremely quietly in the background sidechained to your kick drum.`;
    creativePrompt = `Choose ONE instrument track or synthesizer in your project. Apply a heavy filter LFO and a retro chorus effect to it, and dial the mix to 100% wet. Force yourself to build the next section's groove around this new texture.`;
    recommendedTasks = [
      `Audit your arrangement: mute 2 non-essential tracks during the verses to make the chorus hit with maximum impact.`,
      `Create a dedicated "Aesthetic Sound FX" return track to handle reverb throws and spatial delays.`
    ];
  } else if (focusArea === 'mixing-mastering') {
    producerNote = `For a professional mix, dynamic range is your friend. Before overloading your master chain with limiters, ensure your instrument tracks aren't fighting for the exact same frequencies. Solos and lead vocals belong in the 1kHz to 3kHz spot, while kick and bass require clear separation around 60Hz and 120Hz. Use sidechain dynamic EQ to automate this space.`;
    creativePrompt = `Turn off your computer monitor or close your eyes for 3 minutes while listening to your latest mix in loop mode. Focus purely on whether the vocal feels "too close" or "too far" relative to the snare drum. Use only your ears, not your meters!`;
    recommendedTasks = [
      `Export raw vocal stems to clean up background breaths, lip-smacks, and low-end rumble below 80Hz.`,
      `Set up a parallel compression auxiliary track for your drums or lead vocals to add punch and presence.`
    ];
  } else if (focusArea === 'marketing-promo') {
    managerNote = `Modern music promotion is about human connection. Don't just post "my single is out now." Share the authentic story of why you wrote it, what it means to you, or even a hilarious mistake you made in the studio. Creating a mailing list page now on Mailchimp or Substack ensures you actually own your connection to your listeners.`;
    creativePrompt = `Write down 3 specific blog/influencer/playlist names that cover artists similar to Luna Skye. Spend 5 minutes listening to their curated tracks to identify exactly why your upcoming single fits their target vibe.`;
    recommendedTasks = [
      `Draft a compelling 150-word "elevator pitch" biography specifically highlighting your unique sound in ${genresStr}.`,
      `Schedule a teaser audio export (15-20 seconds) with a beautiful visual background for pre-save announcements.`
    ];
  } else if (focusArea === 'booking-live') {
    managerNote = `Live gigs are the ultimate way to convert casual listeners into superfans. Even if you are booking small coffee houses or local bars, make your stage show memorable. Design a simple backdrop, bring an aesthetic lamp for the stage, and ensure you have a large, clear QR code sign at your merch table linking to your Spotify or link-in-bio.`;
    creativePrompt = `Do a 5-minute timed rehearsal of your song intro, including your verbal stage introduction to the audience. Practice saying it naturally with confidence and pacing!`;
    recommendedTasks = [
      `Draft a polite, professional booking email template containing your live video links, social counts, and contact info.`,
      `Design or update a clean merch display flyer with a QR code and newsletter sign-up incentive.`
    ];
  } else if (focusArea === 'admin-business') {
    managerNote = `The creative side is nothing without the business foundation. Ensure your song split-sheets are signed with any co-writers before submitting to distributors. Also, sign up with your local Performing Rights Organisation (such as ASCAP, BMI, PRS, or APRA) and SoundExchange to claim all mechanical, performance, and digital broadcast royalties.`;
    creativePrompt = `Write down a list of every creative contributor on your current project. Draft a simple split-sheet detailing writing, production, and mechanical percentages to keep everyone aligned.`;
    recommendedTasks = [
      `Create or update a central spreadsheet containing all metadata for your tracks: ISRC codes, writers, lyrics, and publisher details.`,
      `Verify that your distributor profiles (Spotify for Artists, Apple Music for Artists) are linked and fully branded.`
    ];
  }

  // Handle Specific Blockers if provided
  if (blockers && blockers.trim() !== '') {
    const lowerBlocker = blockers.toLowerCase();
    if (lowerBlocker.includes('writer') || lowerBlocker.includes('lyrics') || lowerBlocker.includes('melody') || lowerBlocker.includes('idea')) {
      creativePrompt = `You are facing creative writer's block. To unlock your brain: open a random book, article, or song lyric page. Pick the 3rd word on the 5th line, and the 8th word on the 10th line. You must write a 4-line verse that incorporates both words beautifully.`;
    } else if (lowerBlocker.includes('mix') || lowerBlocker.includes('sound') || lowerBlocker.includes('vocal') || lowerBlocker.includes('drums')) {
      producerNote = `Technical blockages can be frustrating. Try the "less is more" rule. Duplicate your session as a backup, then delete or completely mute 3 tracks that are not doing heavy emotional lifting. Listen to the track again - you'll likely find that the core message is now punchier and easier to balance in the mix!`;
    } else if (lowerBlocker.includes('time') || lowerBlocker.includes('focus') || lowerBlocker.includes('energy') || lowerBlocker.includes('motivation')) {
      creativePrompt = `Time and focus blocks require micro-gains. Set a timer for EXACTLY 10 minutes. Your only task is to open your DAW/notebook and edit or write exactly ONE element. When the timer rings, you are allowed to stop. Usually, this sparks momentum!`;
    }
  }

  return {
    producerNote,
    managerNote,
    creativePrompt,
    recommendedTasks,
    timestamp: new Date().toISOString()
  };
}

// Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
