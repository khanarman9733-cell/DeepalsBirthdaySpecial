/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, MailOpen, Volume2, VolumeX, ChevronDown } from "lucide-react";
import { audioSynth } from "./AudioSynth";

interface LetterEntranceProps {
  onOpen: (isMuted: boolean) => void;
}

export default function LetterEntrance({ onOpen }: LetterEntranceProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hoveredSeal, setHoveredSeal] = useState(false);

  const handleOpen = () => {
    setIsOpened(true);
    // Unmute in synthesizer
    audioSynth.setMute(isMuted);
    audioSynth.playChime();
    // Delay triggering completion to allow unfolding animation to play
    setTimeout(() => {
      onOpen(isMuted);
    }, 2200);
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMute = !isMuted;
    setIsMuted(newMute);
    audioSynth.setMute(newMute);
    if (!newMute) {
      audioSynth.playLowHum();
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#050505] flex items-center justify-center overflow-hidden px-4 py-12 select-none">
      {/* Background Subtle Sparkles */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.03),transparent_60%)] pointer-events-none" />
      
      {/* Sound Toggle (Top-Right) */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={toggleSound}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-[#050505]/80 text-[#F5F2ED]/60 hover:text-[#C5A059] hover:border-[#C5A059]/30 transition-all duration-300 backdrop-blur-md text-xs tracking-widest-plus uppercase cursor-pointer"
          title={isMuted ? "Unmute Cinematic Sound" : "Mute Sound"}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-white/40" />
              <span>Sound Off</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#C5A059] animate-pulse" />
              <span className="text-[#C5A059]">Sound On</span>
            </>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.div
            key="envelope-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, y: -40 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl aspect-[1.4/1] md:aspect-[1.6/1] bg-[#0c0c0e] luxury-border rounded-2xl shadow-[0_30px_100px_-20px_rgba(0,0,0,0.9)] p-[1px] overflow-hidden"
          >
            {/* Inner Border / Luxury Trim */}
            <div className="w-full h-full rounded-[14px] bg-[#050505] p-8 flex flex-col justify-between items-center relative overflow-hidden">
              
              {/* Corner Ornaments */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[#C5A059]/30 rounded-tl-sm pointer-events-none" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#C5A059]/30 rounded-tr-sm pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[#C5A059]/30 rounded-bl-sm pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[#C5A059]/30 rounded-br-sm pointer-events-none" />

              {/* Header / Chapter Mark */}
              <div className="text-center">
                <span className="font-mono text-[9px] tracking-widest-plus text-[#C5A059]/60 uppercase block mb-1">
                  Act I • The Sealed Letter
                </span>
                <div className="w-6 h-[1px] bg-[#C5A059]/30 mx-auto" />
              </div>

              {/* Main Address */}
              <div className="text-center my-6 z-10">
                <motion.h1 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 1 }}
                  className="font-serif text-3xl md:text-4xl text-[#F5F2ED] font-light tracking-wide"
                >
                  Deepal Sethiya
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 1 }}
                  className="font-mono text-[10px] tracking-widest-plus text-[#C5A059]/60 uppercase mt-3"
                >
                  A Birthday Keepsake
                </motion.p>
              </div>

              {/* Wax Seal / Unfold Trigger */}
              <div className="relative flex flex-col items-center z-20">
                <motion.button
                  onClick={handleOpen}
                  onMouseEnter={() => {
                    setHoveredSeal(true);
                    if (!isMuted) audioSynth.playLowHum();
                  }}
                  onMouseLeave={() => setHoveredSeal(false)}
                  className="relative group cursor-pointer focus:outline-none"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Outer Seal Ripple */}
                  <div className="absolute -inset-4 rounded-full bg-[#C5A059]/5 blur-md group-hover:bg-[#C5A059]/15 transition-all duration-500" />
                  
                  {/* Wax Seal Ring */}
                  <div className="w-16 h-16 rounded-full bg-[radial-gradient(ellipse_at_top_left,#9a7a35,#70531c)] border border-[#C5A059]/40 shadow-[0_4px_20px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.15)] flex items-center justify-center relative overflow-hidden">
                    {/* Golden Inner Crest */}
                    <div className="w-11 h-11 rounded-full border border-white/10 bg-[#050505]/40 flex items-center justify-center shadow-inner">
                      <Sparkles className="w-4.5 h-4.5 text-[#C5A059] group-hover:rotate-12 transition-transform duration-500" />
                    </div>
                  </div>
                </motion.button>
                <span className="font-mono text-[9px] tracking-widest-plus text-white/40 uppercase mt-4 transition-all duration-300 group-hover:text-[#C5A059]">
                  {hoveredSeal ? "Break the Seal" : "Click to Open"}
                </span>
              </div>

              {/* Signature / Footer */}
              <div className="text-center z-10">
                <span className="font-mono text-[9px] tracking-widest-plus text-white/30 uppercase">
                  From Armaan
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="unfolding-letter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#050505] flex items-center justify-center px-4"
          >
            {/* Cinematic Unfolding Simulation */}
            <motion.div
              initial={{ scaleY: 0.01, scaleX: 0.8, opacity: 0.5 }}
              animate={{ 
                scaleY: [0.01, 0.05, 1, 1], 
                scaleX: [0.8, 1, 1, 1], 
                opacity: 1 
              }}
              transition={{ 
                duration: 1.8, 
                times: [0, 0.2, 0.7, 1], 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="w-full max-w-2xl bg-[#050505]/90 border border-[#C5A059]/20 rounded-xl p-10 md:p-16 backdrop-blur-xl relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9)] flex flex-col justify-center items-center overflow-hidden"
            >
              {/* Fine gold lines forming a frame */}
              <div className="absolute inset-4 border border-white/5 pointer-events-none" />
              <div className="absolute inset-6 border border-[#C5A059]/10 pointer-events-none" />

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1.2 }}
                className="text-center z-10 space-y-6"
              >
                <MailOpen className="w-8 h-8 text-[#C5A059] mx-auto stroke-[1]" />
                
                <h2 className="font-serif text-4xl font-normal tracking-wide text-[#F5F2ED]">
                  Deepal,
                </h2>
                
                <p className="font-serif text-lg md:text-xl leading-relaxed text-[#F5F2ED]/80 max-w-lg mx-auto font-light">
                  Today, a tiny pocket of the starry sky has aligned to celebrate you. 
                  This is a quiet space built with care, gratitude, and creativity—dedicated 
                  entirely to making you smile.
                </p>

                <p className="font-mono text-[10px] tracking-widest-plus text-[#C5A059]/60 uppercase pt-4 animate-pulse">
                  Scroll or Proceed to Enter
                </p>

                <ChevronDown className="w-5 h-5 text-white/30 mx-auto mt-4 animate-bounce" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
