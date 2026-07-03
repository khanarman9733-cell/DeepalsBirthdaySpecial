/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Sun, Heart, Moon, Smile, ArrowRight, Compass } from "lucide-react";
import { ConstellationStar } from "../types";
import { audioSynth } from "./AudioSynth";

const QUALITIES: ConstellationStar[] = [
  {
    id: "grace",
    name: "Grace",
    title: "The Quiet Stillness of Grace",
    coordinates: { x: 25, y: 32 },
    description: "Grace is not about standing out, but being remembered. Deepal, you possess an innate, quiet elegance that brings a calm and dignified peace to any conversation, grounding those around you.",
    quote: "“Elegance is the only beauty that never fades.”",
    icon: "Compass"
  },
  {
    id: "warmth",
    name: "Warmth",
    title: "A Hearth in the Winter Sky",
    coordinates: { x: 50, y: 15 },
    description: "Some people carry natural sunlight in their presence. Your warmth makes your presence feel like a soft, reliable shelter. You make everyone feel heard, welcomed, and deeply valued.",
    quote: "“To be warm-hearted is to carry an invisible lamp.”",
    icon: "Sun"
  },
  {
    id: "sincerity",
    name: "Sincerity",
    title: "The Golden Thread of Trust",
    coordinates: { x: 75, y: 28 },
    description: "In a world of fast-moving dynamics, sincerity remains the ultimate luxury. Your honest care, genuine loyalty, and pure intentions make your presence an absolute and enduring treasure.",
    quote: "“Sincerity is the face of the soul.”",
    icon: "Heart"
  },
  {
    id: "wisdom",
    name: "Wisdom",
    title: "The Calm Lake of Wisdom",
    coordinates: { x: 62, y: 72 },
    description: "True wisdom is listening with patience, understanding without immediate judgment, and spreading quiet clarity. Your thoughtful perspective adds depth and steady balance to everything.",
    quote: "“Silence is the quiet garden where wisdom grows.”",
    icon: "Moon"
  },
  {
    id: "joy",
    name: "Joy",
    title: "The Meadow of Shared Smiles",
    coordinates: { x: 38, y: 65 },
    description: "Your laughter has an effortless and genuine charm. You find appreciation in the simple details, reminding everyone of the profound beauty of just being present in the moment.",
    quote: "“Joy is the simplest form of gratitude.”",
    icon: "Smile"
  }
];

export default function ConstellationMap() {
  const [selectedStar, setSelectedStar] = useState<ConstellationStar | null>(null);
  const [hoveredStar, setHoveredStar] = useState<string | null>(null);

  const handleStarClick = (star: ConstellationStar) => {
    setSelectedStar(star);
    audioSynth.playChime();
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Compass": return <Compass className="w-5 h-5 text-[#C5A059]" />;
      case "Sun": return <Sun className="w-5 h-5 text-[#C5A059]" />;
      case "Heart": return <Heart className="w-5 h-5 text-[#C5A059]" />;
      case "Moon": return <Moon className="w-5 h-5 text-[#C5A059]" />;
      case "Smile": return <Smile className="w-5 h-5 text-[#C5A059]" />;
      default: return <Sparkles className="w-5 h-5 text-[#C5A059]" />;
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-[#050505] py-24 px-6 md:px-12 flex flex-col justify-center overflow-hidden border-b border-white/5 select-none">
      
      {/* Editorial Watermark Grid Background */}
      <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-6 grid-rows-6 pointer-events-none opacity-[0.02]">
        {Array.from({ length: 36 }).map((_, i) => (
          <div key={i} className="border-t border-l border-[#C5A059]/30 w-full h-full" />
        ))}
      </div>

      {/* Stars Background Simulation */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.02),transparent_70%)] pointer-events-none" />

      {/* Header Typography */}
      <div className="max-w-7xl mx-auto w-full z-10 mb-12">
        <span className="font-mono text-[10px] tracking-widest-plus text-[#C5A059]/70 uppercase block mb-3">
          Chapter I • Stellar Alignment
        </span>
        <h2 className="font-serif text-3xl md:text-5xl text-[#F5F2ED] font-light tracking-wide max-w-xl leading-tight">
          The Constellation <br />
          <span className="text-white/40 italic">of Your Qualities</span>
        </h2>
        <p className="font-sans text-xs text-white/50 max-w-md mt-4 tracking-wide leading-relaxed font-light">
          Deepal, you are defined not by a single light, but by a quiet constellation of beautiful qualities. Click on each glowing star to reveal the threads of our genuine connection.
        </p>
      </div>

      {/* The Map Arena */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        
        {/* Constellation Canvas Side */}
        <div className="lg:col-span-7 bg-[#050505]/60 border border-white/10 rounded-2xl aspect-[1.3/1] md:aspect-[1.5/1] relative p-4 backdrop-blur-sm overflow-hidden shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9)]">
          
          {/* Constellation Grid Markings */}
          <div className="absolute inset-4 border border-white/5 rounded-xl pointer-events-none" />
          <div className="absolute top-6 left-6 font-mono text-[8px] text-white/30 tracking-widest-plus">LAT: 20° 26' N / LON: 73° 51' E</div>
          <div className="absolute bottom-6 right-6 font-mono text-[8px] text-white/30 tracking-widest-plus">MAP-INDEX: DEEPAL-97</div>

          {/* SVG Connecting Lines - Dynamic Draw */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {QUALITIES.map((star, i) => {
              if (i === QUALITIES.length - 1) {
                // Connect last back to first to complete a premium geometric crown
                const nextStar = QUALITIES[0];
                return (
                  <motion.line
                    key={`line-loop`}
                    x1={`${star.coordinates.x}%`}
                    y1={`${star.coordinates.y}%`}
                    x2={`${nextStar.coordinates.x}%`}
                    y2={`${nextStar.coordinates.y}%`}
                    className="stroke-[#C5A059]/20"
                    strokeWidth="0.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 3, delay: 1 }}
                  />
                );
              }
              const nextStar = QUALITIES[i + 1];
              return (
                <motion.line
                  key={`line-${i}`}
                  x1={`${star.coordinates.x}%`}
                  y1={`${star.coordinates.y}%`}
                  x2={`${nextStar.coordinates.x}%`}
                  y2={`${nextStar.coordinates.y}%`}
                  className="stroke-[#C5A059]/20"
                  strokeWidth="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3, delay: 1 }}
                />
              );
            })}
            
            {/* active connection halo from selected star */}
            {selectedStar && (
              QUALITIES.map((star) => {
                if (star.id === selectedStar.id) return null;
                return (
                  <motion.line
                    key={`active-line-${star.id}`}
                    x1={`${selectedStar.coordinates.x}%`}
                    y1={`${selectedStar.coordinates.y}%`}
                    x2={`${star.coordinates.x}%`}
                    y2={`${star.coordinates.y}%`}
                    className="stroke-[#C5A059]/40"
                    strokeWidth="0.75"
                    strokeDasharray="4 4"
                    initial={{ pathOffset: 0 }}
                    animate={{ pathOffset: -10 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  />
                );
              })
            )}
          </svg>

          {/* Render Individual Stars */}
          {QUALITIES.map((star) => {
            const isSelected = selectedStar?.id === star.id;
            const isHovered = hoveredStar === star.id;

            return (
              <div
                key={star.id}
                style={{
                  position: "absolute",
                  left: `${star.coordinates.x}%`,
                  top: `${star.coordinates.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className="z-10"
              >
                <button
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoveredStar(star.id)}
                  onMouseLeave={() => setHoveredStar(null)}
                  className="relative group focus:outline-none focus:ring-0 cursor-pointer"
                  aria-label={`Select star of ${star.name}`}
                >
                  {/* Outer Pulsing Glow */}
                  <motion.div
                    animate={
                      isSelected
                        ? { scale: [1, 1.4, 1], opacity: [0.3, 0.8, 0.3] }
                        : isHovered
                        ? { scale: 1.2, opacity: 0.5 }
                        : { scale: 1, opacity: 0.2 }
                    }
                    transition={{ repeat: isSelected ? Infinity : 0, duration: 2 }}
                    className="absolute -inset-4 rounded-full bg-[#C5A059]/40 blur-md pointer-events-none"
                  />

                  {/* Core Star */}
                  <motion.div
                    animate={isSelected ? { scale: 1.25 } : { scale: 1 }}
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-500 relative border ${
                      isSelected
                        ? "bg-[#C5A059] border-[#F9F295] shadow-[0_0_15px_#C5A059]"
                        : isHovered
                        ? "bg-[#C5A059]/60 border-[#C5A059]"
                        : "bg-[#050505] border-white/20"
                    }`}
                  >
                    {/* Tiny Center White Core */}
                    <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-[#C5A059]"}`} />
                  </motion.div>

                  {/* Hover Floating Tag */}
                  <AnimatePresence>
                    {(isHovered || isSelected) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: -24, scale: 1 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.3 }}
                        className="absolute left-1/2 -translate-x-1/2 bg-[#050505] border border-white/10 text-[#C5A059] px-2.5 py-1 rounded-md text-[9px] tracking-widest-plus uppercase font-mono shadow-xl whitespace-nowrap"
                      >
                        {star.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            );
          })}
        </div>

        {/* Editorial Information Display Side */}
        <div className="lg:col-span-5 h-full flex flex-col justify-center min-h-[360px]">
          <AnimatePresence mode="wait">
            {selectedStar ? (
              <motion.div
                key={selectedStar.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="glass-panel p-8 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-[0_30px_70px_rgba(0,0,0,0.8)]"
              >
                {/* Thin golden glow frame inside */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#C5A059]/5 blur-3xl rounded-full" />
                
                <div className="space-y-6">
                  {/* Category Stamp */}
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      {getIconComponent(selectedStar.icon)}
                    </div>
                    <div>
                      <span className="font-mono text-[8px] tracking-widest-plus text-white/40 uppercase block">
                        Constellation Node
                      </span>
                      <span className="font-mono text-[10px] tracking-widest text-[#C5A059] font-semibold uppercase">
                        {selectedStar.name}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-3">
                    <h3 className="font-serif text-2xl text-[#F5F2ED] font-light tracking-wide leading-snug">
                      {selectedStar.title}
                    </h3>
                    <p className="font-sans text-[13px] leading-relaxed text-white/60 font-light">
                      {selectedStar.description}
                    </p>
                  </div>

                  {/* Elegant Quote Block */}
                  <div className="border-l border-[#C5A059]/40 pl-4 py-1 italic text-[#C5A059] text-sm font-serif font-light">
                    {selectedStar.quote}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-mono tracking-widest-plus uppercase text-white/30">
                  <span>CHAPTER I</span>
                  <span>CONNECTION • RESPECT</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-dashed border-white/10 rounded-2xl p-10 text-center flex flex-col items-center justify-center space-y-4 py-16"
              >
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-[#C5A059]/60">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-white/80 font-light tracking-wider">
                    An Unaligned Sky
                  </h4>
                  <p className="font-sans text-[11px] text-white/40 max-w-[240px] mx-auto leading-relaxed mt-1 font-light">
                    Click any golden star on the left constellation chart to reveal the depth of each attribute.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
