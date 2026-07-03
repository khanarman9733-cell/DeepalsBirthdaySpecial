/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Send, Flame, Gift, ArrowUp } from "lucide-react";
import { audioSynth } from "./AudioSynth";

interface FloatingLantern {
  id: string;
  text: string;
  x: number; // Percentage horizontal position (5 - 95)
  duration: number; // Float duration in seconds
  scale: number;
}

const PRESET_BLESSINGS = [
  "May your journey be filled with quiet clarity, deep peace, and pure laughter.",
  "May every path you walk open a magnificent new horizon of inspiration.",
  "May you always be surrounded by genuine, respectful, and steady care.",
  "May you find endless joy in quiet books, warm tea, and serene moonlight.",
  "May your health be robust, your spirit light, and your dreams infinite."
];

export default function WishRitual() {
  const [inputText, setInputText] = useState("");
  const [activeLanterns, setActiveLanterns] = useState<FloatingLantern[]>([]);
  const [releasedWishesCount, setReleasedWishesCount] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

  // Auto-clean lanterns that have finished floating to keep DOM light
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeLanterns.length === 0) return;
      const now = Date.now();
      setActiveLanterns((prev) =>
        prev.filter((l) => {
          // Keep if spawned less than 15s ago
          const timestamp = parseInt(l.id.split("-")[1]);
          return now - timestamp < 15000;
        })
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [activeLanterns]);

  const releaseLantern = (textToRelease: string) => {
    if (!textToRelease.trim()) return;

    audioSynth.playWishRelease();
    
    const newLantern: FloatingLantern = {
      id: `lantern-${Date.now()}-${Math.random()}`,
      text: textToRelease,
      x: 10 + Math.random() * 80, // Bound between 10% and 90%
      duration: 12 + Math.random() * 4, // 12-16 seconds float time
      scale: 0.8 + Math.random() * 0.4
    };

    setActiveLanterns((prev) => [newLantern, ...prev]);
    setReleasedWishesCount((prev) => prev + 1);
    setInputText("");
    setSelectedPreset(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    releaseLantern(inputText);
  };

  const handlePresetSelect = (idx: number) => {
    setSelectedPreset(idx);
    setInputText(PRESET_BLESSINGS[idx]);
    audioSynth.playChime();
  };

  return (
    <section className="relative w-full min-h-screen bg-[#050505] py-24 px-6 md:px-12 flex flex-col justify-center overflow-hidden select-none">
      
      {/* Floating Lanterns Render Field (Strictly absolute inside section) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        <AnimatePresence>
          {activeLanterns.map((lantern) => (
            <motion.div
              key={lantern.id}
              initial={{ y: "100vh", x: `${lantern.x}vw`, opacity: 0, scale: 0.5 }}
              animate={{
                y: "-20vh",
                x: [
                  `${lantern.x}vw`,
                  `${lantern.x + (Math.random() * 10 - 5)}vw`,
                  `${lantern.x + (Math.random() * 20 - 10)}vw`,
                  `${lantern.x + (Math.random() * 10 - 5)}vw`
                ],
                opacity: [0, 1, 1, 0.8, 0],
                scale: [0.5, lantern.scale, lantern.scale * 1.1, lantern.scale * 0.6]
              }}
              exit={{ opacity: 0 }}
              transition={{
                y: { duration: lantern.duration, ease: "linear" },
                x: { duration: lantern.duration, ease: "easeInOut" },
                opacity: { duration: lantern.duration, times: [0, 0.1, 0.6, 0.8, 1] },
                scale: { duration: lantern.duration, times: [0, 0.1, 0.7, 0.9, 1] }
              }}
              className="absolute w-24 md:w-32 flex flex-col items-center justify-center text-center"
            >
              {/* Lantern Glow Circle */}
              <div className="relative w-10 h-14 md:w-12 md:h-16 rounded-t-full rounded-b-2xl bg-[radial-gradient(ellipse_at_center,#FFFDF0,#C5A059,#8F6C27)] shadow-[0_0_25px_#C5A059,inset_0_2px_4px_rgba(255,255,255,0.4)] flex items-end justify-center pb-2">
                {/* Simulated flickering flame inside */}
                <motion.div
                  animate={{ scaleY: [1, 1.3, 0.9, 1.2, 1], scaleX: [1, 0.9, 1.1, 0.9, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-2.5 h-4 bg-orange-500 rounded-full filter blur-[1px] shadow-[0_0_10px_#ea580c]"
                />
              </div>

              {/* Lantern Hanging Wish Note */}
              <div className="mt-2 bg-[#050505]/95 border border-[#C5A059]/30 px-2.5 py-1.5 rounded-lg shadow-lg max-w-[120px] md:max-w-[150px]">
                <p className="font-serif text-[8px] md:text-[9px] text-[#F5F2ED] leading-tight tracking-wide line-clamp-2">
                  {lantern.text}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Editorial Text Column */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <span className="font-mono text-[10px] tracking-widest-plus text-[#C5A059]/70 uppercase block mb-3">
              Act IV • Ritual of Wishes
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-[#F5F2ED] font-light tracking-wide leading-tight">
              Release Your <br />
              <span className="text-white/40 italic">Birthday Blessings</span>
            </h2>
            <p className="font-sans text-xs md:text-sm text-white/50 max-w-md mt-4 tracking-wide leading-relaxed font-light">
              In Indian tradition, releasing a floating lantern by the river represents sending pure intentions directly into the cosmos, carrying wishes of happiness and health. 
              <br /><br />
              Deepal, select a pre-composed blessing from Armaan or type your own secret aspiration for the upcoming year. Press release, and watch it rise.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <span className="font-mono text-[8px] text-white/40 tracking-widest-plus uppercase block mb-1">Ritual Status</span>
              <span className="font-mono text-xs text-[#C5A059] font-medium flex items-center gap-1.5 uppercase tracking-widest">
                <Flame className="w-3.5 h-3.5 animate-pulse text-[#C5A059]" /> Active
              </span>
            </div>
            <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <span className="font-mono text-[8px] text-white/40 tracking-widest-plus uppercase block mb-1">Lanterns Released</span>
              <span className="font-mono text-base text-[#F5F2ED] font-semibold">
                {releasedWishesCount}
              </span>
            </div>
          </div>
        </div>

        {/* Right Ritual Interactive Column */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-8 md:p-10 rounded-3xl relative shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]">
            
            {/* Fine Border Accents */}
            <div className="absolute inset-4 border border-white/5 rounded-2xl pointer-events-none" />

            {/* Inner Content */}
            <div className="space-y-8 relative z-10">
              
              {/* Preset Blessings Column */}
              <div>
                <span className="font-mono text-[9px] tracking-widest-plus text-white/40 uppercase block mb-3.5">
                  Select a Birthday Blessing
                </span>
                <div className="flex flex-col gap-2.5">
                  {PRESET_BLESSINGS.map((blessing, idx) => {
                    const isSelected = selectedPreset === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handlePresetSelect(idx)}
                        className={`text-left p-3.5 rounded-xl border font-sans text-xs leading-relaxed transition-all duration-300 flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? "bg-[#050505] border-[#C5A059]/40 text-[#C5A059] shadow-md translate-x-1"
                            : "bg-[#050505]/30 border-white/5 text-white/60 hover:border-white/15"
                        }`}
                      >
                        <Gift className={`w-4 h-4 mt-0.5 flex-none ${isSelected ? "text-[#C5A059]" : "text-white/30"}`} />
                        <span className="font-light tracking-wide">{blessing}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Input Custom Wish Form */}
              <form onSubmit={handleFormSubmit} className="space-y-4 pt-4 border-t border-white/5">
                <label className="font-mono text-[9px] tracking-widest-plus text-white/40 uppercase block">
                  Or Compose a Secret Aspiration
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      setSelectedPreset(null);
                    }}
                    maxLength={100}
                    placeholder="Type your silent wish for your new year here..."
                    className="w-full bg-[#050505] border border-white/10 rounded-xl px-5 py-4 text-xs text-[#F5F2ED] placeholder-white/20 focus:outline-none focus:border-[#C5A059]/40 transition-colors pr-16 font-sans font-light tracking-wide"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[9px] text-white/30">
                    {inputText.length}/100
                  </div>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="w-full bg-gradient-to-r from-[#C5A059] to-[#8F6C27] disabled:from-white/5 disabled:to-white/5 disabled:border-white/5 disabled:text-white/20 border border-[#C5A059]/20 text-[#050505] font-mono text-[10px] tracking-widest-plus uppercase font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg cursor-pointer hover:saturate-[1.15] active:scale-[0.98]"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>Release Wish into the Cosmos</span>
                </button>
              </form>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
