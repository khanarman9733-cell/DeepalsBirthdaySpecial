import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";
import TypewriterIntro from "./TypewriterIntro";
import { audioSynth } from "./AudioSynth";
import { audioManager } from "./AudioManager";

interface LandingHeroProps {
  onEnterGift: () => void;
}

export default function LandingHero({ onEnterGift }: LandingHeroProps) {
  const [typingDone, setTypingDone] = useState(false);
  const [rippleActive, setRippleActive] = useState(false);
  const [ripplePos, setRipplePos] = useState({ x: 0, y: 0 });

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Generate ripple center coordinates relative to the button
    const rect = e.currentTarget.getBoundingClientRect();
    setRipplePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setRippleActive(true);

    // Stop synthesized loops & trigger premium high-fidelity background soundtrack
    audioSynth.stopPianoLoop();
    audioSynth.playChime();
    audioManager.startBackground();

    // Trigger transition parent callback
    setTimeout(() => {
      onEnterGift();
    }, 600);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 md:px-12 py-16 overflow-hidden">
      
      {/* Background glow behind titles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[600px] aspect-square bg-[radial-gradient(circle,rgba(197,160,89,0.04),transparent_65%)] pointer-events-none" />

      {/* Main Luxury Frame */}
      <div className="w-full max-w-4xl flex flex-col items-center text-center space-y-12 md:space-y-16 z-10 select-none">
        
        {/* Editorial Headers */}
        <div className="space-y-4 md:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-2"
          >
            <h1 className="font-serif text-[48px] sm:text-[72px] md:text-[96px] text-[#F5F2ED] font-light tracking-widest leading-none drop-shadow-sm">
              The Wishverse
            </h1>
            <p className="font-mono text-[9px] sm:text-[10px] text-[#C5A059] tracking-[0.4em] uppercase font-light">
              A story born in the cold November of Jaipur
            </p>
          </motion.div>

          {/* Luxury Separator */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.3 }}
            transition={{ delay: 0.6, duration: 2.0, ease: "easeOut" }}
            className="w-24 h-[0.5px] bg-[#C5A059] mx-auto origin-center"
          />

          {/* Created especially for Deepal Sethiya */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-1"
          >
            <span className="font-mono text-[8px] sm:text-[9px] text-white/30 tracking-[0.3em] uppercase block font-light">
              Created especially for
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#F5F2ED] font-light tracking-wide leading-tight">
              Deepal Sethiya
            </h2>
            <span className="font-serif italic text-xs text-[#C5A059]/80 tracking-[0.15em] block font-light mt-1">
              By Armaan
            </span>
          </motion.div>
        </div>

        {/* Narrative / Typewriter Section */}
        <div className="w-full max-w-lg border-t border-b border-white/[0.03] py-8 px-4 flex flex-col justify-center min-h-[220px]">
          <TypewriterIntro onComplete={() => setTypingDone(true)} />
        </div>

        {/* Enter Gift Button container */}
        <div className="h-20 flex items-center justify-center relative">
          <AnimatePresence>
            {typingDone && (
              <motion.button
                key="enter-gift-btn"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                onClick={handleButtonClick}
                className="relative group px-10 py-5 rounded-2xl border border-[#C5A059]/30 bg-[#050505]/60 text-[#C5A059] font-mono text-xs tracking-[0.25em] uppercase font-semibold overflow-hidden shadow-[0_20px_50px_-15px_rgba(197,160,89,0.2)] cursor-pointer hover:border-[#C5A059] hover:text-[#F5F2ED] transition-all duration-700 select-none"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                {/* 1. Glass reflection sheen */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1200ms] ease-in-out pointer-events-none" />

                {/* 2. Soft golden glow behind button on hover */}
                <div className="absolute -inset-1 bg-[#C5A059]/10 rounded-2xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-700 pointer-events-none" />

                {/* 3. Ripple animation on click */}
                {rippleActive && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0.8 }}
                    animate={{ scale: 6, opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    onAnimationComplete={() => setRippleActive(false)}
                    style={{
                      position: "absolute",
                      left: ripplePos.x,
                      top: ripplePos.y,
                      transform: "translate(-50%, -50%)",
                      width: "40px",
                      height: "40px",
                    }}
                    className="rounded-full bg-[#C5A059]/35 pointer-events-none"
                  />
                )}

                <span className="relative z-10 flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#C5A059] group-hover:rotate-12 transition-transform duration-500" />
                  Enter The Wishverse
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Decorative corners for editorial look */}
      <div className="absolute top-8 left-8 w-12 h-[0.5px] bg-white/5 pointer-events-none" />
      <div className="absolute top-8 left-8 w-[0.5px] h-12 bg-white/5 pointer-events-none" />
      <div className="absolute top-8 right-8 w-12 h-[0.5px] bg-white/5 pointer-events-none" />
      <div className="absolute top-8 right-8 w-[0.5px] h-12 bg-white/5 pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-12 h-[0.5px] bg-white/5 pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-[0.5px] h-12 bg-white/5 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-12 h-[0.5px] bg-white/5 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-[0.5px] h-12 bg-white/5 pointer-events-none" />
    </div>
  );
}
