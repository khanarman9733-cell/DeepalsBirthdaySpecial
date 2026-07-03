import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Heart, Info, RotateCcw } from "lucide-react";
import { DAILY_WISHES } from "../data/dailyData";
import { audioSynth } from "./AudioSynth";

interface FloatingStar {
  id: number;
  x: number; // percentage left
  y: number; // percentage top
  scale: number;
  speed: number;
}

export default function WishJar() {
  const [stars, setStars] = useState<FloatingStar[]>([]);
  const [activeWish, setActiveWish] = useState<string | null>(null);
  const [isPouring, setIsPouring] = useState(false);
  const [releasedStar, setReleasedStar] = useState<{ x: number; y: number } | null>(null);

  // Initialize swirling stars inside the glass jar
  useEffect(() => {
    const jarStars = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: 15 + Math.random() * 70,
      y: 35 + Math.random() * 55,
      scale: 0.5 + Math.random() * 0.8,
      speed: 1.5 + Math.random() * 2,
    }));
    setStars(jarStars);
  }, []);

  const handleOpenWish = () => {
    if (isPouring) return;
    
    // Play warm piano sequence & chime
    audioSynth.playPianoNote(329.63, 1.8, 0.05); // E4 note
    setTimeout(() => {
      audioSynth.playPianoNote(493.88, 2.0, 0.06); // B4 note
      audioSynth.playChime();
    }, 250);

    setIsPouring(true);
    setReleasedStar({ x: 50, y: 30 }); // position near the top cork

    // Random wish from 365 selection
    const now = new Date();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const wishIndex = (dayOfYear + stars.length) % DAILY_WISHES.length;
    const selectedWish = DAILY_WISHES[wishIndex];

    setTimeout(() => {
      setActiveWish(selectedWish);
      setReleasedStar(null);
      setIsPouring(false);
    }, 1200);
  };

  const handleAnotherWish = () => {
    audioSynth.playChime();
    const randIndex = Math.floor(Math.random() * DAILY_WISHES.length);
    setActiveWish(DAILY_WISHES[randIndex]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-16 text-center select-none relative z-10">
      
      {/* Visual Separation Divider */}
      <div className="w-24 h-[0.5px] bg-[#C5A059]/30 mx-auto mb-16" />

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Visual Glass Jar */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-64 h-80 flex flex-col items-center">
            
            {/* The Luxury Glass Bottle Frame */}
            <div className="relative w-48 h-72 border-[1.5px] border-white/10 rounded-t-[40px] rounded-b-[30px] bg-gradient-to-b from-white/5 to-white/[0.01] shadow-[0_40px_80px_rgba(0,0,0,0.85)] flex flex-col items-center justify-end p-4 relative overflow-hidden backdrop-blur-md">
              
              {/* Glass Reflection Highlight */}
              <div className="absolute top-0 left-6 w-[2px] h-full bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-60" />
              <div className="absolute top-10 right-4 w-4 h-48 border-r border-white/10 rounded-full opacity-30 filter blur-[1px]" />

              {/* Cork Neck Lid */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-14 h-4 bg-[#8F6C27]/50 border border-[#8F6C27]/30 rounded-t-md" />
              
              {/* Floating Swirling Wishes inside the Bottle */}
              <div className="absolute inset-0 pointer-events-none">
                {stars.map((star) => (
                  <motion.div
                    key={star.id}
                    animate={{
                      y: [0, -15, 15, 0],
                      x: [0, 8, -8, 0],
                      scale: [star.scale, star.scale * 1.3, star.scale],
                      opacity: [0.3, 0.9, 0.3],
                    }}
                    transition={{
                      duration: 4 + star.speed,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      position: "absolute",
                      left: `${star.x}%`,
                      top: `${star.y}%`,
                    }}
                    className="text-[#C5A059] filter drop-shadow-[0_0_5px_rgba(197,160,89,0.8)]"
                  >
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </motion.div>
                ))}
              </div>

              {/* Liquid gold energy base */}
              <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-[#C5A059]/10 to-transparent blur-[2px]" />
              
              {/* Label Tag on Glass Jar */}
              <div className="border border-[#C5A059]/30 bg-[#080808]/90 px-3 py-1.5 rounded-md relative z-10 shadow-lg text-center select-none transform rotate-[-2deg] mb-12">
                <span className="font-mono text-[7px] text-[#C5A059] tracking-[0.25em] uppercase block font-bold">
                  Celestial Wishes
                </span>
                <span className="font-serif text-[8px] text-[#F5F2ED] italic">
                  deepal's sanctuary
                </span>
              </div>
            </div>

            {/* Rising Exploding Star Animation */}
            {releasedStar && (
              <motion.div
                initial={{ opacity: 1, scale: 1.2, x: 0, y: 0 }}
                animate={{ opacity: 0, scale: 3.5, y: -200 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute top-0 text-[#C5A059] pointer-events-none filter drop-shadow-[0_0_15px_#C5A059]"
              >
                <Sparkles className="w-8 h-8 animate-spin" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Column: Interaction details & revealed wish */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
          <div className="space-y-2">
            <span className="font-mono text-[9px] tracking-[0.35em] text-[#C5A059] uppercase block font-medium">
              The Jar of Whispered Hope
            </span>
            <h3 className="font-serif text-3xl text-[#F5F2ED] font-light tracking-wide">
              The Wish Jar
            </h3>
            <p className="font-serif text-sm text-white/50 leading-relaxed font-light italic">
              A luxury glass jar filled with swirling glowing stardust. Reach inside and pull out one heartfelt wish dedicated to your light.
            </p>
          </div>

          <button
            onClick={handleOpenWish}
            disabled={isPouring}
            className="px-8 py-3.5 rounded-xl border border-[#C5A059]/30 bg-[#C5A059]/5 hover:bg-[#C5A059]/15 text-[#C5A059] font-mono text-[9px] tracking-widest uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer disabled:opacity-40"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            {isPouring ? "Drawing Star..." : "✨ Open Today's Wish"}
          </button>

          {/* Reveal Card */}
          <AnimatePresence mode="wait">
            {activeWish && (
              <motion.div
                key={activeWish}
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-sm rounded-2xl border border-white/5 bg-[#080808]/60 p-6 relative shadow-xl backdrop-blur-sm"
              >
                {/* Micro ornament */}
                <div className="absolute top-2 right-2 text-[#C5A059]/15 text-[28px] font-serif">“</div>
                
                <div className="space-y-4">
                  <p className="font-serif text-base text-[#F5F2ED]/90 leading-relaxed italic pr-6 text-left">
                    {activeWish}
                  </p>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-white/5">
                    <span className="font-mono text-[8px] text-[#C5A059] uppercase tracking-widest">
                      Deepal's Celestial Card
                    </span>
                    <button
                      onClick={handleAnotherWish}
                      className="text-white/30 hover:text-[#C5A059] transition-colors flex items-center gap-1 font-mono text-[7px] tracking-wider uppercase cursor-pointer"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      Another Wish
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
