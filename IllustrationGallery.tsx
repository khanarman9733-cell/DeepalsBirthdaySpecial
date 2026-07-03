/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Sparkles, Compass, Lightbulb, Heart, ArrowLeft, ArrowRight } from "lucide-react";
import { audioSynth } from "./AudioSynth";

interface Chapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  image: string;
  quote: string;
  symbolism: string;
  description: string;
  colorTheme: string;
}

const CHAPTERS: Chapter[] = [
  {
    id: "moonlight_garden",
    number: "01",
    title: "The Golden Canopy",
    subtitle: "Growth & Beautiful Beginnings",
    image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=800",
    quote: "“In the garden of your life, may every quiet dream find soil, and every blossom find its light.”",
    symbolism: "The Golden Blossom",
    description: "This chapter symbolizes the grace of gentle growth. Just as golden blossoms bloom quietly under the silver light of the moon, your new year is a landscape of brand-new paths, rich inspirations, and peaceful moments of realization.",
    colorTheme: "from-amber-500/10 to-transparent"
  },
  {
    id: "lanterns_hope",
    number: "02",
    title: "The Lanterns Ascent",
    subtitle: "Spreading Light & Warmth",
    image: "https://images.unsplash.com/photo-1507504038482-7621abf8c325?q=80&w=800",
    quote: "“Your presence is a quiet lamp. You do not shout; you simply shine and make the road visible.”",
    symbolism: "The River Lantern",
    description: "Symbolizing your natural ability to uplift and brighten the spirits of those around you. These rising lanterns represent our warmest, most sincere wishes floating up to the heavens, wishing you complete health, endless joy, and peace.",
    colorTheme: "from-orange-500/10 to-transparent"
  },
  {
    id: "reading_sanctuary",
    number: "03",
    title: "The Reading Sanctuary",
    subtitle: "A Haven of Thought & Clarity",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800",
    quote: "“A calm mind is the ultimate temple of peace. Within books and quiet thoughts, we find our truth.”",
    symbolism: "The Candlelit Book",
    description: "Representing the elegant depth of your mind. We wish you quiet afternoons of peaceful reading, cozy candlelit corners where time slows down, and a sanctuary of thoughts where you can always return to find absolute mental clarity and rest.",
    colorTheme: "from-zinc-500/10 to-transparent"
  },
  {
    id: "cosmic_wish",
    number: "04",
    title: "The Cosmic Alignment",
    subtitle: "The Infinity of Warm Wishes",
    image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=800",
    quote: "“We are all connected under the same sky, but some people make the darkness feel extraordinarily beautiful.”",
    symbolism: "The Connected Constellation",
    description: "Symbolizing that the sincere wishes we hold for you are woven directly into the fabrics of the stars. May you always feel supported by true, respectful regard, and may the universe open its vast horizons for your creative endeavors.",
    colorTheme: "from-purple-500/10 to-transparent"
  }
];

export default function IllustrationGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleChapterSelect = (index: number) => {
    setActiveIndex(index);
    audioSynth.playChime();
    
    // Smooth scroll the selected thumb into focus on mobile
    if (scrollContainerRef.current) {
      const cardWidth = 280; // Approximate thumb width
      scrollContainerRef.current.scrollTo({
        left: index * cardWidth - 40,
        behavior: "smooth"
      });
    }
  };

  const nextChapter = () => {
    const nextIdx = (activeIndex + 1) % CHAPTERS.length;
    handleChapterSelect(nextIdx);
  };

  const prevChapter = () => {
    const prevIdx = (activeIndex - 1 + CHAPTERS.length) % CHAPTERS.length;
    handleChapterSelect(prevIdx);
  };

  const current = CHAPTERS[activeIndex];

  return (
    <section className="relative w-full min-h-screen bg-[#050505] py-24 px-6 md:px-12 flex flex-col justify-center overflow-hidden border-b border-white/5 select-none">
      
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#C5A059]/[0.015] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-zinc-500/[0.01] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full z-10">
        
        {/* Header Section */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-mono text-[10px] tracking-widest-plus text-[#C5A059]/70 uppercase block mb-3">
              Chapter II • Chapters of Care
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-[#F5F2ED] font-light tracking-wide max-w-xl leading-tight">
              Four Symbolic Wishes <br />
              <span className="text-white/40 italic">For Your Journey</span>
            </h2>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <button
              onClick={prevChapter}
              className="p-3 rounded-full border border-white/10 bg-white/5 text-[#F5F2ED]/60 hover:text-[#C5A059] hover:border-[#C5A059]/30 transition-all duration-300 cursor-pointer"
              aria-label="Previous Chapter"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs text-white/40 tracking-widest px-2">
              {current.number} / {CHAPTERS.length.toString().padStart(2, '0')}
            </span>
            <button
              onClick={nextChapter}
              className="p-3 rounded-full border border-white/10 bg-white/5 text-[#F5F2ED]/60 hover:text-[#C5A059] hover:border-[#C5A059]/30 transition-all duration-300 cursor-pointer"
              aria-label="Next Chapter"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Central Display: Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch mb-16">
          
          {/* Left Side: Editorial Image Block */}
          <div className="lg:col-span-6 relative aspect-[4/3] lg:aspect-auto min-h-[350px] md:min-h-[450px] rounded-2xl overflow-hidden border border-white/10 bg-[#0c0c0e] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full"
              >
                {/* Fallback image with premium filter & gradient */}
                <img
                  src={current.image}
                  alt={current.title}
                  className="w-full h-full object-cover object-center filter saturate-[0.8] brightness-[0.65] contrast-[1.05]"
                  referrerPolicy="no-referrer"
                />
                {/* Vignette & Color Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${current.colorTheme} via-transparent to-transparent`} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(5,5,5,0.95))] pointer-events-none" />
                
                {/* Chapter Stamp overlay */}
                <div className="absolute top-6 left-6 flex items-center gap-2">
                  <div className="w-8 h-[1px] bg-[#C5A059]/40" />
                  <span className="font-mono text-[9px] text-[#C5A059] tracking-widest-plus uppercase">
                    Wish Chapter {current.number}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Side: Editorial Prose */}
          <div className="lg:col-span-6 flex flex-col justify-between py-2 pl-0 lg:pl-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                {/* Subtitle & Title */}
                <div>
                  <span className="font-mono text-[9px] tracking-widest-plus text-[#C5A059]/80 uppercase block mb-2">
                    {current.subtitle}
                  </span>
                  <h3 className="font-serif text-3xl md:text-4xl text-[#F5F2ED] font-light tracking-wide leading-tight">
                    {current.title}
                  </h3>
                </div>

                {/* Decorative Separator */}
                <div className="w-16 h-[0.5px] bg-[#C5A059]/40" />

                {/* Description Prose */}
                <div className="space-y-4">
                  <p className="font-serif text-base md:text-lg italic text-[#F5F2ED]/70 leading-relaxed font-light pl-4 border-l border-[#C5A059]/40">
                    {current.quote}
                  </p>
                  <p className="font-sans text-xs md:text-sm text-white/50 leading-relaxed font-light tracking-wide">
                    {current.description}
                  </p>
                </div>

                {/* Symbolism Pill */}
                <div className="flex items-center gap-2 pt-2">
                  <span className="font-mono text-[8px] tracking-widest-plus text-white/40 uppercase">Symbolic Token:</span>
                  <span className="px-3.5 py-1.5 rounded-full border border-[#C5A059]/25 bg-[#C5A059]/5 font-mono text-[9px] text-[#C5A059] tracking-widest uppercase">
                    {current.symbolism}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom mini-tabs selection */}
            <div className="mt-12 lg:mt-0 pt-6 border-t border-white/5">
              <span className="font-mono text-[8px] tracking-widest-plus text-white/30 uppercase block mb-3">
                Jump to Chapter
              </span>
              <div 
                ref={scrollContainerRef}
                className="flex gap-3 overflow-x-auto no-scrollbar pb-2"
              >
                {CHAPTERS.map((chap, idx) => {
                  const isActive = activeIndex === idx;
                  return (
                    <button
                      key={chap.id}
                      onClick={() => handleChapterSelect(idx)}
                      className={`flex-none text-left p-3.5 rounded-xl border transition-all duration-300 w-[140px] md:w-[155px] cursor-pointer ${
                        isActive
                          ? "bg-[#050505] border-[#C5A059]/40 shadow-lg animate-pulse"
                          : "bg-[#050505]/20 border-white/5 hover:border-white/15"
                      }`}
                    >
                      <span className="font-mono text-[9px] text-white/20 block mb-1">
                        {chap.number}
                      </span>
                      <span className={`font-serif text-[11px] block truncate transition-colors ${
                        isActive ? "text-[#C5A059]" : "text-white/40"
                      }`}>
                        {chap.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
