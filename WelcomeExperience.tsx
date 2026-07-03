import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
import { audioSynth } from "./AudioSynth";
import { audioManager } from "./AudioManager";

interface WelcomeExperienceProps {
  onEnter: (isMuted: boolean) => void;
}

export default function WelcomeExperience({ onEnter }: WelcomeExperienceProps) {
  const [started, setStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [heartAssembled, setHeartAssembled] = useState(false);
  const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);
  const [textVisible, setTextVisible] = useState(false);
  const timeoutRefs = React.useRef<number[]>([]);

  // Generate gentle celestial star particles on mount
  useEffect(() => {
    const starArray = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.8 + 0.4,
      delay: Math.random() * 4,
    }));
    setStars(starArray);

    return () => {
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, []);

  const handleStart = (mute: boolean) => {
    setIsMuted(mute);
    audioSynth.setMute(mute);
    audioManager.setMute(mute);
    if (!mute) {
      audioManager.initializeAudioOnUserInteraction();
      audioSynth.playChime();
    }
    setStarted(true);

    const isRevisit = typeof window !== "undefined" && sessionStorage.getItem("deepal_session_active") === "true";
    
    // Set active session now so subsequent reloads are immediately recognized as revisits
    if (typeof window !== "undefined") {
      sessionStorage.setItem("deepal_session_active", "true");
    }

    const delay = isRevisit ? 1200 : 7800;

    const t1 = window.setTimeout(() => {
      setTextVisible(true);
    }, isRevisit ? 200 : 1500);

    const t2 = window.setTimeout(() => {
      setHeartAssembled(true);
    }, isRevisit ? 600 : 5000);

    const t3 = window.setTimeout(() => {
      onEnter(mute);
    }, delay);

    timeoutRefs.current = [t1, t2, t3];
  };

  const handleSkip = () => {
    audioSynth.playChime();
    timeoutRefs.current.forEach(clearTimeout);
    onEnter(isMuted);
  };

  return (
    <div className="relative w-full h-screen bg-[#050505] flex flex-col items-center justify-center overflow-hidden px-6 select-none">
      
      {/* Background Subtle Nebulae */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-[#C5A059]/[0.02] rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-rose-500/[0.01] rounded-full blur-[120px]" />
      </div>

      <AnimatePresence mode="wait">
        {!started ? (
          /* ACT I: The Invitation Card (User Gesture Required for Audio) */
          <motion.div
            key="invitation-gate"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md p-8 rounded-3xl border border-white/5 bg-[#080808]/40 backdrop-blur-md flex flex-col items-center text-center space-y-8 shadow-[0_30px_70px_rgba(0,0,0,0.95)] relative z-10"
          >
            {/* Elegant luxury circular frame */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-[#C5A059]/20 animate-spin-slow" />
              <div className="absolute inset-2 rounded-full border border-dashed border-[#C5A059]/10" />
              <Sparkles className="w-5 h-5 text-[#C5A059]" />
            </div>

            <div className="space-y-3">
              <span className="font-mono text-[9px] tracking-[0.35em] text-[#C5A059] uppercase block font-medium">
                The Celebration of Deepal
              </span>
              <h1 className="font-serif text-3xl text-[#F5F2ED] font-light tracking-widest leading-none">
                DEEPAL'S WISHVERSE
              </h1>
              <p className="font-mono text-[8px] text-white/30 tracking-[0.2em] uppercase">
                EST. MMXXVI • FOR DEEPAL SETHIYA
              </p>
            </div>

            <div className="w-16 h-[0.5px] bg-[#C5A059]/30" />

            {/* Selection Buttons */}
            <div className="w-full space-y-4 pt-2">
              <button
                onClick={() => handleStart(false)}
                className="w-full py-4 rounded-xl border border-[#C5A059]/30 bg-[#C5A059]/[0.02] text-[#C5A059] font-mono text-[10px] tracking-[0.25em] uppercase font-medium overflow-hidden transition-all duration-500 cursor-pointer hover:border-[#C5A059] hover:bg-[#C5A059]/5 hover:text-[#F5F2ED] flex items-center justify-center gap-2"
              >
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                Begin with Soundscape
              </button>
              <button
                onClick={() => handleStart(true)}
                className="w-full py-4 rounded-xl border border-white/5 bg-transparent text-white/40 font-mono text-[9px] tracking-[0.25em] uppercase transition-all duration-500 cursor-pointer hover:border-white/10 hover:text-[#F5F2ED] flex items-center justify-center gap-2"
              >
                <VolumeX className="w-3.5 h-3.5" />
                Begin Silently
              </button>
            </div>

            <span className="font-mono text-[7px] text-white/20 tracking-widest uppercase">
              *Optimal experience with audio active*
            </span>
          </motion.div>
        ) : (
          /* ACT II: The High-Fidelity Preloader Animation */
          <motion.div
            key="preloader-experience"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="w-full max-w-xl flex flex-col items-center justify-center text-center space-y-12 relative z-10"
          >
            {/* Golden Twinkling Particles Layer */}
            <div className="absolute inset-0 pointer-events-none overflow-visible">
              {stars.slice(0, 30).map((star) => (
                <motion.div
                  key={star.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 2.5 + Math.random() * 2.5,
                    repeat: Infinity,
                    delay: star.delay,
                    ease: "easeInOut",
                  }}
                  style={{
                    position: "absolute",
                    left: `${star.x}%`,
                    top: `${star.y - 30}%`,
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                  }}
                  className="rounded-full bg-[#C5A059]"
                />
              ))}
            </div>

            {/* Glowing Golden Heart slowly forms */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              
              {/* Outer pulsing glow */}
              <motion.div
                animate={heartAssembled ? {
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.45, 0.2]
                } : {}}
                transition={{
                  duration: 2.0,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -inset-6 rounded-full bg-[#C5A059]/15 blur-xl pointer-events-none"
              />

              <svg
                className="w-16 h-16 text-[#C5A059] drop-shadow-[0_0_15px_rgba(197,160,89,0.55)]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Hollow heart drawing slowly */}
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 4.8, ease: [0.25, 1, 0.5, 1] }}
                  d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
                  fill={heartAssembled ? "rgba(197, 160, 89, 0.12)" : "rgba(197, 160, 89, 0)"}
                  style={{ transition: "fill 2.5s ease-in-out" }}
                />
              </svg>

              {/* Emerging particles rising from the forming heart */}
              <div className="absolute inset-0 pointer-events-none overflow-visible">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15, scale: 0.4 }}
                    animate={{ opacity: [0, 0.9, 0], y: -35, scale: [0.4, 1.2, 0.4] }}
                    transition={{
                      duration: 2.2 + Math.random() * 1.2,
                      repeat: Infinity,
                      delay: idx * 0.35,
                      ease: "easeOut"
                    }}
                    className="absolute w-1 h-1 rounded-full bg-[#C5A059]"
                    style={{
                      left: `${25 + Math.random() * 50}%`,
                      top: "20%",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Display: "For someone who deserves something made with care." */}
            <div className="min-h-[60px] px-4">
              <AnimatePresence>
                {textVisible && (
                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                    className="font-serif text-lg md:text-xl text-[#F5F2ED]/90 tracking-wide font-light italic max-w-sm leading-relaxed"
                  >
                    "For Deepal, who brings light to every November."
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Skip Intro Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              whileHover={{ opacity: 0.85, scale: 1.05 }}
              onClick={handleSkip}
              className="px-5 py-2.5 rounded-full border border-[#C5A059]/20 bg-[#C5A059]/5 text-[#C5A059] font-mono text-[9px] tracking-widest-plus uppercase transition-all cursor-pointer hover:bg-[#C5A059]/10 mt-4 z-20"
            >
              Skip Intro
            </motion.button>

            {/* Subtle luxury brand identifier at the bottom */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              transition={{ delay: 2.5, duration: 2.0 }}
              className="absolute bottom-10"
            >
              <span className="font-mono text-[8px] tracking-[0.25em] text-white/50 uppercase">
                Preparing Celestial Spheres • MMXXVI
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
