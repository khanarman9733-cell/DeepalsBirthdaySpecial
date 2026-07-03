import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Wind, Music, Play, Square, RefreshCw, Volume2, Sparkles, AlertCircle } from "lucide-react";
import { audioSynth } from "./AudioSynth";

// Stars and coordinates for the Stardust Echo Harp (July Constellation: Lyra)
interface HarpStar {
  id: number;
  name: string;
  x: number; // percentage left
  y: number; // percentage top
  freq: number; // Hz
  color: string;
}

const HARP_STARS: HarpStar[] = [
  { id: 1, name: "Vega", x: 50, y: 15, freq: 523.25, color: "#C5A059" }, // High C
  { id: 2, name: "Sheliak", x: 30, y: 35, freq: 587.33, color: "#E0C28A" }, // D
  { id: 3, name: "Sulafat", x: 40, y: 65, freq: 659.25, color: "#C5A059" }, // E
  { id: 4, name: "Aladfar", x: 70, y: 35, freq: 783.99, color: "#E8D5B2" }, // G
  { id: 5, name: "Double Star", x: 60, y: 65, freq: 880.00, color: "#C5A059" }, // A
  { id: 6, name: "Chara", x: 20, y: 50, freq: 1046.50, color: "#F5F2ED" }, // High High C
  { id: 7, name: "Mizar", x: 80, y: 50, freq: 1174.66, color: "#F5F2ED" } // High High D
];

type BreathPhase = "idle" | "inhale" | "holdIn" | "exhale" | "holdOut";

export default function DailyExperience() {
  const [activeTab, setActiveTab] = useState<"breath" | "harp">("breath");
  
  // 1. Celestial Breath Mandala State
  const [breathPhase, setBreathPhase] = useState<BreathPhase>("idle");
  const [breathProgress, setBreathProgress] = useState(0);
  const breathIntervalRef = useRef<any>(null);

  // 2. Stardust Echo Harp State
  const [isRecording, setIsRecording] = useState(false);
  const [recordedNotes, setRecordedNotes] = useState<{ freq: number; delay: number }[]>([]);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [activeHarpStar, setActiveHarpStar] = useState<number | null>(null);
  const [harpRipples, setHarpRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const recordStartTimeRef = useRef<number>(0);

  // 1. BREATHING MANDALA LOGIC
  const startBreathingSession = () => {
    if (breathPhase !== "idle") return;
    
    // Play initial serene low hum to ground the focus
    audioSynth.playLowHum();
    setBreathPhase("inhale");
    setBreathProgress(0);
  };

  const stopBreathingSession = () => {
    setBreathPhase("idle");
    setBreathProgress(0);
    if (breathIntervalRef.current) {
      clearInterval(breathIntervalRef.current);
      breathIntervalRef.current = null;
    }
  };

  useEffect(() => {
    if (breathPhase === "idle") {
      if (breathIntervalRef.current) {
        clearInterval(breathIntervalRef.current);
        breathIntervalRef.current = null;
      }
      return;
    }

    let secondsInPhase = 0;
    const phaseDuration = 4; // 4s box breathing (Inhale, Hold, Exhale, Hold)

    breathIntervalRef.current = setInterval(() => {
      secondsInPhase += 0.1;
      const pct = (secondsInPhase / phaseDuration) * 100;
      setBreathProgress(Math.min(pct, 100));

      if (secondsInPhase >= phaseDuration) {
        secondsInPhase = 0;
        setBreathProgress(0);

        setBreathPhase((prev) => {
          if (prev === "inhale") {
            // Transition Inhale -> Hold (Play major locket sound)
            audioSynth.playChime();
            return "holdIn";
          } else if (prev === "holdIn") {
            // Transition Hold -> Exhale (Play soft lower felt note)
            audioSynth.playPianoNote(196.00, 3.5, 0.05); // Low G
            return "exhale";
          } else if (prev === "exhale") {
            // Transition Exhale -> Hold (Play warm low hum drone)
            audioSynth.playLowHum();
            return "holdOut";
          } else if (prev === "holdOut") {
            // Loop back to Inhale (Play rising arpeggio start note)
            audioSynth.playPianoNote(329.63, 2.5, 0.07); // E4 note
            return "inhale";
          }
          return "idle";
        });
      }
    }, 100);

    return () => {
      if (breathIntervalRef.current) {
        clearInterval(breathIntervalRef.current);
      }
    };
  }, [breathPhase]);

  // Clean up breathing loop on unmount
  useEffect(() => {
    return () => {
      if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
    };
  }, []);

  const getBreathInstructions = () => {
    switch (breathPhase) {
      case "inhale":
        return {
          title: "Inhale",
          text: "Breathe in the golden stardust, feeling your chest expand with warmth...",
          scale: 1.4,
          glow: "rgba(197, 160, 89, 0.25)"
        };
      case "holdIn":
        return {
          title: "Hold",
          text: "Let the quiet light fill your mind, resting in complete tranquility...",
          scale: 1.4,
          glow: "rgba(197, 160, 89, 0.4)"
        };
      case "exhale":
        return {
          title: "Exhale",
          text: "Slowly release all tension, whispering out any lingering worries...",
          scale: 0.9,
          glow: "rgba(197, 160, 89, 0.1)"
        };
      case "holdOut":
        return {
          title: "Hold",
          text: "Dwell in the pure, spacious silence before the next breath...",
          scale: 0.8,
          glow: "rgba(0, 0, 0, 0)"
        };
      default:
        return {
          title: "Ritual of Breath",
          text: "Tap the star below to begin a luxury box-breathing cycle synced with celestial tones.",
          scale: 1.0,
          glow: "rgba(197, 160, 89, 0.05)"
        };
    }
  };

  const breathSpecs = getBreathInstructions();

  // 2. HARP LOGIC
  const triggerHarpStar = (star: HarpStar) => {
    if (isPlayingBack) return;

    setActiveHarpStar(star.id);
    audioSynth.playPianoNote(star.freq, 2.5, 0.09);

    // Create a dynamic ripple
    setHarpRipples((prev) => [
      ...prev,
      { id: Date.now(), x: star.x, y: star.y }
    ]);

    // Record note if active
    if (isRecording) {
      const timeOffset = Date.now() - recordStartTimeRef.current;
      setRecordedNotes((prev) => [...prev, { freq: star.freq, delay: timeOffset }]);
    }

    // Reset glow indicator
    setTimeout(() => {
      setActiveHarpStar(null);
    }, 400);
  };

  const startRecordingHarp = () => {
    setRecordedNotes([]);
    setIsRecording(true);
    recordStartTimeRef.current = Date.now();
    // Play warm cue note
    audioSynth.playPianoNote(220, 1.5, 0.05);
  };

  const stopRecordingHarp = () => {
    setIsRecording(false);
    if (recordedNotes.length === 0) return;
  };

  const playHarpEchoSequence = () => {
    if (recordedNotes.length === 0 || isPlayingBack) return;
    setIsPlayingBack(true);

    // Sequence play with tape delay arpeggiation
    recordedNotes.forEach((note, idx) => {
      setTimeout(() => {
        // Trigger primary note
        audioSynth.playPianoNote(note.freq, 2.5, 0.08);
        
        // Find star index to create ripple
        const matchingStar = HARP_STARS.find((s) => s.freq === note.freq);
        if (matchingStar) {
          setHarpRipples((prev) => [
            ...prev,
            { id: Date.now() + idx, x: matchingStar.x, y: matchingStar.y }
          ]);
        }

        // Echo 1: Standard delay (repeating 400ms later at half volume)
        setTimeout(() => {
          audioSynth.playPianoNote(note.freq, 1.8, 0.04);
        }, 400);

        // Echo 2: Deep space feedback (repeating 800ms later at quarter volume)
        setTimeout(() => {
          audioSynth.playPianoNote(note.freq, 1.2, 0.02);
        }, 800);

        // Terminate play state at sequence end
        if (idx === recordedNotes.length - 1) {
          setTimeout(() => {
            setIsPlayingBack(false);
          }, 1200);
        }
      }, note.delay);
    });
  };

  // Keep ripples cleanup active
  useEffect(() => {
    if (harpRipples.length > 20) {
      setHarpRipples((prev) => prev.slice(5));
    }
  }, [harpRipples]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16 md:py-24 select-none relative z-10 text-center">
      
      {/* Upper header */}
      <div className="space-y-3 mb-10">
        <span className="font-mono text-[9px] tracking-[0.35em] text-[#C5A059] uppercase block font-medium">
          Presence and Mindfulness
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#F5F2ED] font-light tracking-widest uppercase">
          Daily Experience
        </h2>
        <p className="font-mono text-[9px] text-white/30 tracking-[0.2em] uppercase max-w-md mx-auto leading-relaxed">
          Ground yourself in the cosmic flow. Take a mindful moment with interactive soundscapes or slow breathing rituals.
        </p>
        <div className="w-12 h-[0.5px] bg-[#C5A059]/40 mx-auto mt-4" />
      </div>

      {/* Tabs Selector */}
      <div className="flex justify-center gap-4 mb-12">
        <button
          onClick={() => {
            stopBreathingSession();
            setActiveTab("breath");
          }}
          className={`px-6 py-2.5 rounded-full border font-mono text-[9px] tracking-[0.2em] uppercase transition-all duration-500 flex items-center gap-2 cursor-pointer ${
            activeTab === "breath"
              ? "bg-[#C5A059]/10 border-[#C5A059] text-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.15)]"
              : "border-white/5 bg-transparent text-white/40 hover:text-white/70 hover:border-white/10"
          }`}
        >
          <Wind className="w-3.5 h-3.5" />
          Breathing Mandala
        </button>
        <button
          onClick={() => {
            stopBreathingSession();
            setActiveTab("harp");
          }}
          className={`px-6 py-2.5 rounded-full border font-mono text-[9px] tracking-[0.2em] uppercase transition-all duration-500 flex items-center gap-2 cursor-pointer ${
            activeTab === "harp"
              ? "bg-[#C5A059]/10 border-[#C5A059] text-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.15)]"
              : "border-white/5 bg-transparent text-white/40 hover:text-white/70 hover:border-white/10"
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          Stardust Echo Harp
        </button>
      </div>

      {/* Tab Panels */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-center min-h-[460px]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: BREATHING MANDALA */}
          {activeTab === "breath" && (
            <motion.div
              key="breath-panel"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6 }}
              className="w-full flex flex-col items-center justify-center space-y-10"
            >
              
              {/* The Breathing Center Piece */}
              <div className="relative w-72 h-72 flex items-center justify-center">
                
                {/* Background breathing glow */}
                <motion.div
                  animate={{
                    scale: breathSpecs.scale,
                    opacity: breathPhase === "idle" ? 0.05 : [0.15, 0.35, 0.15],
                  }}
                  transition={{
                    duration: breathPhase === "idle" ? 3.0 : 4.0,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{ backgroundColor: breathSpecs.glow }}
                  className="absolute inset-[-20px] rounded-full blur-2xl transition-colors duration-1000 pointer-events-none"
                />

                {/* Concentric rotating geometric lines */}
                <motion.div
                  animate={{ rotate: breathPhase === "idle" ? 30 : 360 }}
                  transition={{
                    duration: breathPhase === "idle" ? 40 : 16,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0 rounded-full border border-dashed border-[#C5A059]/10 flex items-center justify-center"
                >
                  <div className="w-64 h-64 rounded-full border border-[#C5A059]/5 flex items-center justify-center" />
                </motion.div>

                {/* Progress Circle Border */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                  <motion.circle
                    cx="144"
                    cy="144"
                    r="120"
                    fill="none"
                    stroke="rgba(197, 160, 89, 0.05)"
                    strokeWidth="1.5"
                  />
                  {breathPhase !== "idle" && (
                    <circle
                      cx="144"
                      cy="144"
                      r="120"
                      fill="none"
                      stroke="#C5A059"
                      strokeWidth="2.5"
                      strokeDasharray="753.9"
                      strokeDashoffset={753.9 - (753.9 * breathProgress) / 100}
                      className="transition-all duration-100 ease-linear"
                    />
                  )}
                </svg>

                {/* Breathing Core - Mandala Star */}
                <motion.button
                  animate={{
                    scale: breathSpecs.scale,
                    rotate: breathPhase !== "idle" ? [0, 4, 0] : 0,
                  }}
                  transition={{ duration: 4.0, ease: "easeInOut" }}
                  onClick={breathPhase === "idle" ? startBreathingSession : stopBreathingSession}
                  className="relative w-40 h-40 rounded-full bg-[#050505] border border-[#C5A059]/40 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(197,160,89,0.1),inset_0_2px_4px_rgba(255,255,255,0.05)] cursor-pointer group hover:border-[#C5A059]/80 transition-colors duration-500 select-none focus:outline-none"
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={breathPhase}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col items-center text-center space-y-1.5"
                    >
                      <Sparkles className={`w-5 h-5 text-[#C5A059] ${
                        breathPhase !== "idle" ? "animate-spin-slow" : "group-hover:rotate-12 transition-transform duration-500"
                      }`} />
                      
                      <span className="font-serif text-lg text-[#F5F2ED] font-light tracking-wide">
                        {breathSpecs.title}
                      </span>
                      
                      <span className="font-mono text-[7px] text-white/40 tracking-[0.2em] uppercase">
                        {breathPhase === "idle" ? "Start Ritual" : "Stop Ritual"}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </motion.button>

                {/* Orbiting Stardust Dots (during session) */}
                {breathPhase !== "idle" && (
                  <div className="absolute inset-4 pointer-events-none">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          rotate: 360,
                        }}
                        transition={{
                          duration: 6 + i * 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute inset-0 flex items-start justify-center"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] shadow-[0_0_6px_#C5A059]" />
                      </motion.div>
                    ))}
                  </div>
                )}

              </div>

              {/* Instructions and Narratives */}
              <div className="max-w-md space-y-2 min-h-[70px]">
                <p className="font-serif text-base text-[#F5F2ED] tracking-wide font-light">
                  {breathSpecs.title}
                </p>
                <p className="font-serif text-xs text-white/50 leading-relaxed font-light italic">
                  "{breathSpecs.text}"
                </p>
              </div>

            </motion.div>
          )}

          {/* TAB 2: STARDUST ECHO HARP */}
          {activeTab === "harp" && (
            <motion.div
              key="harp-panel"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6 }}
              className="w-full flex flex-col md:flex-row gap-8 items-center"
            >
              
              {/* Left Side: Harp Play Area (Interactive Constellation) */}
              <div className="flex-1 w-full aspect-square md:aspect-[1.1] rounded-3xl border border-white/5 bg-black/40 backdrop-blur-md relative overflow-hidden p-6 shadow-[0_30px_60px_rgba(0,0,0,0.85)]">
                
                {/* Interactive Ripples Render */}
                {harpRipples.map((r) => (
                  <motion.div
                    key={r.id}
                    initial={{ scale: 0, opacity: 0.8 }}
                    animate={{ scale: 5, opacity: 0 }}
                    transition={{ duration: 1.6, ease: "easeOut" }}
                    style={{
                      position: "absolute",
                      left: `${r.x}%`,
                      top: `${r.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    className="w-12 h-12 rounded-full border border-[#C5A059]/40 pointer-events-none"
                  />
                ))}

                {/* Constellation Connecting Threads (SVG) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {/* Drawing connecting lines between adjacent stars in Lyra constellation */}
                  <line x1="50%" y1="15%" x2="30%" y2="35%" stroke="rgba(197, 160, 89, 0.15)" strokeWidth="0.75" />
                  <line x1="30%" y1="35%" x2="40%" y2="65%" stroke="rgba(197, 160, 89, 0.15)" strokeWidth="0.75" />
                  <line x1="40%" y1="65%" x2="60%" y2="65%" stroke="rgba(197, 160, 89, 0.15)" strokeWidth="0.75" />
                  <line x1="60%" y1="65%" x2="70%" y2="35%" stroke="rgba(197, 160, 89, 0.15)" strokeWidth="0.75" />
                  <line x1="70%" y1="35%" x2="50%" y2="15%" stroke="rgba(197, 160, 89, 0.15)" strokeWidth="0.75" />
                  <line x1="30%" y1="35%" x2="20%" y2="50%" stroke="rgba(197, 160, 89, 0.1)" strokeWidth="0.5" strokeDasharray="3" />
                  <line x1="70%" y1="35%" x2="80%" y2="50%" stroke="rgba(197, 160, 89, 0.1)" strokeWidth="0.5" strokeDasharray="3" />
                </svg>

                {/* Celestial Stars */}
                {HARP_STARS.map((star) => {
                  const isActive = activeHarpStar === star.id;
                  return (
                    <button
                      key={star.id}
                      onClick={() => triggerHarpStar(star)}
                      style={{
                        position: "absolute",
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        transform: "translate(-50%, -50%)",
                        WebkitTapHighlightColor: "transparent"
                      }}
                      className="group flex flex-col items-center focus:outline-none cursor-pointer"
                      aria-label={`Play star chime of ${star.name}`}
                    >
                      {/* Outer Ring Glow */}
                      <motion.div
                        animate={isActive ? {
                          scale: [1, 1.6, 1],
                        } : {}}
                        transition={{ duration: 0.4 }}
                        className="w-10 h-10 rounded-full border border-white/0 group-hover:border-white/5 flex items-center justify-center relative transition-colors duration-500"
                      >
                        {/* Dynamic Core */}
                        <div
                          style={{ boxShadow: isActive ? `0 0 16px ${star.color}` : "none" }}
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all duration-500 ${
                            isActive
                              ? "bg-white scale-125 border-white"
                              : "bg-[#050505] border-[#C5A059]/60 group-hover:bg-[#C5A059]/20"
                          }`}
                        >
                          <div className="w-1 h-1 rounded-full bg-white/60" />
                        </div>
                      </motion.div>

                      {/* Star Identifier Label */}
                      <span className="font-mono text-[7px] text-white/30 tracking-widest uppercase mt-0.5 group-hover:text-[#C5A059] transition-colors duration-300">
                        {star.name}
                      </span>
                    </button>
                  );
                })}

                {/* Lower watermark */}
                <div className="absolute bottom-4 left-6">
                  <span className="font-mono text-[6px] tracking-widest text-white/20 uppercase">
                    Constellation Lyra • Chord Harp
                  </span>
                </div>

              </div>

              {/* Right Side: Recording and Composition Controls */}
              <div className="w-full md:w-80 flex flex-col space-y-6 text-left">
                
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <div className="space-y-1.5">
                    <span className="font-mono text-[8px] tracking-[0.25em] text-[#C5A059] uppercase font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                      Melody Composer
                    </span>
                    <p className="font-serif text-[11px] text-white/40 italic">
                      Tap the constellation stars on the left to play chimes. Record a sequence and release it as a cosmic stardust wave.
                    </p>
                  </div>

                  {/* Buttons controls */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    
                    {!isRecording ? (
                      <button
                        onClick={startRecordingHarp}
                        disabled={isPlayingBack}
                        className="py-3 rounded-xl border border-[#C5A059]/30 bg-[#C5A059]/5 hover:bg-[#C5A059]/10 text-[#C5A059] font-mono text-[9px] tracking-widest uppercase font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        Record
                      </button>
                    ) : (
                      <button
                        onClick={stopRecordingHarp}
                        className="py-3 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-mono text-[9px] tracking-widest uppercase font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
                      >
                        <Square className="w-3 h-3 fill-current" />
                        Stop
                      </button>
                    )}

                    <button
                      onClick={playHarpEchoSequence}
                      disabled={isRecording || isPlayingBack || recordedNotes.length === 0}
                      className="py-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-[#F5F2ED] font-mono text-[9px] tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <RefreshCw className={`w-3 h-3 ${isPlayingBack ? "animate-spin" : ""}`} />
                      Echo Release
                    </button>

                  </div>

                  {/* Recorded Notes Tracker */}
                  <div className="pt-4 border-t border-white/5">
                    <span className="font-mono text-[7px] text-white/30 tracking-wider uppercase block mb-2">
                      Recorded Waves ({recordedNotes.length} / 12)
                    </span>

                    {recordedNotes.length === 0 ? (
                      <div className="py-4 border border-dashed border-white/5 rounded-lg text-center">
                        <span className="font-serif text-[10px] text-white/20 italic">
                          No chimes recorded yet.
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                        {recordedNotes.map((note, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 rounded bg-white/[0.04] border border-white/5 font-mono text-[8px] text-[#C5A059]"
                          >
                            ⭐ {(note.delay / 1000).toFixed(1)}s
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                <div className="flex gap-2.5 p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                  <AlertCircle className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                  <span className="font-serif text-[10px] text-white/40 leading-relaxed italic">
                    "Every melody you play is carried back into the background universe as a quiet memory of this day."
                  </span>
                </div>

              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
