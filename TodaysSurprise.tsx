import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Gift, Lock, Sparkles, Heart, Calendar, Send, Compass, RotateCcw, Award } from "lucide-react";
import { getSurpriseForIndex, DAILY_MESSAGES, DailySurpriseItem } from "../data/dailyData";
import { audioSynth } from "./AudioSynth";

export default function TodaysSurprise() {
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [surprise, setSurprise] = useState<DailySurpriseItem | null>(null);
  const [viewedSurprises, setViewedSurprises] = useState<number[]>([]);
  const [unlockedCount, setUnlockedCount] = useState(1);
  const [butterflyPos, setButterflyPos] = useState({ x: 150, y: 150 });
  const [flowerBloomPct, setFlowerBloomPct] = useState(0);
  const [isStarShowerActive, setIsStarShowerActive] = useState(false);
  const [ambientHue, setAmbientHue] = useState<string | null>(null);
  const [stardustParticles, setStardustParticles] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Determine the day-of-year index (0-364) to serve the correct daily surprise automatically
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const calculatedIndex = dayOfYear % 365;

    setCurrentDayIndex(calculatedIndex);

    // Load progress from LocalStorage
    const storedProgress = localStorage.getItem("deepal_viewed_surprises");
    let viewedList: number[] = [];
    if (storedProgress) {
      viewedList = JSON.parse(storedProgress);
    }

    if (!viewedList.includes(calculatedIndex)) {
      viewedList.push(calculatedIndex);
      localStorage.setItem("deepal_viewed_surprises", JSON.stringify(viewedList));
    }

    setViewedSurprises(viewedList);
    setUnlockedCount(viewedList.length);

    // Load the day's surprise
    const dailySurprise = getSurpriseForIndex(calculatedIndex);
    setSurprise(dailySurprise);
  }, []);

  const handleInteractiveTrigger = () => {
    audioSynth.playChime();
    
    // Create gold stardust trail
    const particles = Array.from({ length: 25 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
    }));
    setStardustParticles(particles);
    setTimeout(() => setStardustParticles([]), 2000);

    if (surprise?.type === "shooting_star") {
      setIsStarShowerActive(true);
      // Play high pitch notes mimicking meteor fall
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          audioSynth.playPianoNote(880 + i * 110, 1.2, 0.05);
        }, i * 120);
      }
      setTimeout(() => setIsStarShowerActive(false), 3000);
    } else if (surprise?.type === "color_bg") {
      const hues = [
        "rgba(197, 160, 89, 0.1)",  // Golden
        "rgba(244, 63, 94, 0.08)",  // Soft rose
        "rgba(168, 85, 247, 0.08)", // Amethyst purple
        "rgba(14, 165, 233, 0.08)", // Solar blue
      ];
      const randomHue = hues[Math.floor(Math.random() * hues.length)];
      setAmbientHue(randomHue);
    }
  };

  // Safe tracking for cursor follower in the butterfly interactive mode
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (surprise?.type !== "butterfly" || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Smooth trailing effect
    setButterflyPos({ x, y });
  };

  // Reset or browse previous surprises as a premium feature
  const handleRandomSurprise = () => {
    audioSynth.playPianoNote(293.66, 2.0, 0.07); // D note
    const randIndex = Math.floor(Math.random() * 365);
    const prevSurprise = getSurpriseForIndex(randIndex);
    setSurprise(prevSurprise);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16 md:py-24 text-center select-none relative z-10">
      
      {/* Editorial Title */}
      <div className="space-y-3 mb-10">
        <span className="font-mono text-[9px] tracking-[0.35em] text-[#C5A059] uppercase block font-medium">
          A Sanctuary of Daily Care
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#F5F2ED] font-light tracking-widest uppercase">
          ✨ Deepal's Surprise
        </h2>
        <p className="font-mono text-[9px] text-white/30 tracking-[0.2em] uppercase max-w-md mx-auto leading-relaxed">
          A little surprise prepared especially for today. Featuring 365 unique experiences designed with luxury care and precision.
        </p>
        <div className="w-12 h-[0.5px] bg-[#C5A059]/40 mx-auto mt-4" />
      </div>

      {/* Progress Metric Badge */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C5A059]/10 bg-[#C5A059]/[0.02] backdrop-blur-md">
          <Award className="w-3.5 h-3.5 text-[#C5A059]" />
          <span className="font-mono text-[8px] text-[#C5A059] uppercase tracking-widest">
            Surprise Journey: {unlockedCount} / 365 Unlocked
          </span>
        </div>
      </div>

      {/* The Core Surprise Glass Card */}
      <AnimatePresence mode="wait">
        {surprise && (
          <motion.div
            key={surprise.id}
            ref={containerRef}
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: ambientHue ? `radial-gradient(circle at center, ${ambientHue}, rgba(8,8,8,0.95))` : "",
            }}
            className="w-full max-w-3xl mx-auto rounded-3xl border border-[#C5A059]/20 bg-[#080808]/80 p-8 md:p-12 relative shadow-[0_45px_100px_rgba(0,0,0,0.95)] backdrop-blur-xl overflow-hidden min-h-[420px] flex flex-col justify-between"
          >
            {/* Ambient Background Glow Layer */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.02),transparent_60%)] pointer-events-none" />

            {/* Custom Stardust Particle Trail inside the Card */}
            {stardustParticles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 0, scale: 0.2, y: -50 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                }}
                className="rounded-full bg-[#C5A059] shadow-[0_0_8px_#C5A059] pointer-events-none"
              />
            ))}

            {/* Top Bar (Meta Details) */}
            <div className="flex justify-between items-center pb-4 border-b border-white/5 relative z-10">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="font-mono text-[8px] tracking-[0.2em] text-[#C5A059] uppercase">
                  Chapter {surprise.id} • {surprise.extraMeta}
                </span>
              </div>
              <span className="font-mono text-[8px] text-white/30 uppercase tracking-widest">
                AUTOMATIC RELEASE
              </span>
            </div>

            {/* Main Interactive Surprise Panel */}
            <div className="py-8 flex flex-col items-center justify-center space-y-6 relative z-10 flex-1">
              
              {/* INTERACTIVE COMPONENT 1: The Blooming Lotus Flower */}
              {surprise.type === "flower" && (
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <motion.div
                    onHoverStart={() => {
                      setFlowerBloomPct(100);
                      audioSynth.playPianoNote(440.00, 2.5, 0.08); // soft A note
                    }}
                    onHoverEnd={() => setFlowerBloomPct(0)}
                    onClick={() => {
                      setFlowerBloomPct(100);
                      audioSynth.playChime();
                    }}
                    className="cursor-pointer select-none origin-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                  >
                    <svg viewBox="0 0 100 100" className="w-36 h-36 text-[#C5A059]">
                      {/* Blooming animated vector rose petals */}
                      {Array.from({ length: 8 }).map((_, idx) => {
                        const angle = (idx * 360) / 8;
                        return (
                          <motion.path
                            key={idx}
                            d="M50 50 C40 30 30 30 50 15 C70 30 60 30 50 50"
                            fill="rgba(197, 160, 89, 0.15)"
                            stroke="currentColor"
                            strokeWidth="0.5"
                            style={{ originX: "50px", originY: "50px" }}
                            animate={{
                              rotate: angle,
                              scale: flowerBloomPct > 0 ? 1.25 : 1,
                            }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                          />
                        );
                      })}
                      <circle cx="50" cy="50" r="8" className="fill-[#F5F2ED]" />
                    </svg>
                  </motion.div>
                  <span className="absolute bottom-[-15px] font-mono text-[7px] text-white/30 uppercase tracking-widest">
                    *Hover or tap to make the golden petals expand*
                  </span>
                </div>
              )}

              {/* INTERACTIVE COMPONENT 2: Floating Butterfly Follower */}
              {surprise.type === "butterfly" && (
                <div className="relative w-full h-40 border border-dashed border-white/5 rounded-2xl flex items-center justify-center overflow-hidden bg-black/20">
                  <motion.div
                    style={{
                      position: "absolute",
                      left: butterflyPos.x - 24,
                      top: butterflyPos.y - 24,
                    }}
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="w-12 h-12 text-[#C5A059] drop-shadow-[0_0_12px_#C5A059] pointer-events-none"
                  >
                    <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                      <path d="M12 10C11.5 6 8 4 5 4C2 4 1 6 1 9C1 14 7 15 12 19C17 15 23 14 23 9C23 6 22 4 19 4C16 4 12.5 6 12 10Z" />
                      <animateTransform 
                        attributeName="transform" 
                        type="scale" 
                        values="1 1; 0.3 1; 1 1" 
                        dur="0.4s" 
                        repeatCount="indefinite" 
                      />
                    </svg>
                  </motion.div>
                  <span className="font-serif text-[10px] text-white/30 italic">
                    Move cursor across this panel to lead the stardust butterfly.
                  </span>
                </div>
              )}

              {/* INTERACTIVE COMPONENT 3: Shooting Star Skyward Launch */}
              {surprise.type === "shooting_star" && (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full border border-dashed border-[#C5A059]/40 flex items-center justify-center mx-auto bg-[#C5A059]/5 relative">
                    <Sparkles className={`w-6 h-6 text-[#C5A059] ${isStarShowerActive ? "animate-spin" : ""}`} />
                  </div>
                  <button
                    onClick={handleInteractiveTrigger}
                    className="px-6 py-2.5 rounded-xl border border-[#C5A059]/30 bg-[#C5A059]/5 hover:bg-[#C5A059]/15 text-[#C5A059] font-mono text-[9px] tracking-widest uppercase transition-all duration-300 cursor-pointer flex items-center gap-2 mx-auto"
                  >
                    ⭐ Launch Meteor Shower
                  </button>
                  {isStarShowerActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-serif text-[10px] text-[#C5A059] italic text-center"
                    >
                      Meteors are flashing across your background sky!
                    </motion.div>
                  )}
                </div>
              )}

              {/* INTERACTIVE COMPONENT 4: Beautiful AI Mandala Illustration */}
              {surprise.type === "illustration" && (
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-[#C5A059]/10 animate-pulse" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="w-28 h-28 text-[#C5A059]"
                  >
                    <svg viewBox="0 0 100 100" className="w-full h-full stroke-current fill-none" strokeWidth="0.5">
                      <circle cx="50" cy="50" r="45" strokeDasharray="3" />
                      <circle cx="50" cy="50" r="35" />
                      <circle cx="50" cy="50" r="25" strokeDasharray="1" />
                      <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18" className="opacity-45" />
                      <polygon points="50,20 80,50 50,80 20,50" />
                      <polygon points="50,10 90,50 50,90 10,50" className="opacity-30" />
                      <circle cx="50" cy="50" r="5" className="fill-current" />
                    </svg>
                  </motion.div>
                </div>
              )}

              {/* INTERACTIVE COMPONENT 5: Background Glow Hue Slider */}
              {surprise.type === "color_bg" && (
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full border border-white/10 mx-auto bg-gradient-to-tr from-rose-500/20 via-[#C5A059]/20 to-sky-500/20 animate-pulse" />
                  <button
                    onClick={handleInteractiveTrigger}
                    className="px-6 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 font-mono text-[9px] tracking-widest uppercase transition-all duration-300 cursor-pointer flex items-center gap-2 mx-auto"
                  >
                    🎨 Align Ambient Background Hue
                  </button>
                  <span className="font-mono text-[7px] text-white/30 uppercase tracking-widest block">
                    Shifting the sanctuary background into warm custom cosmic colors.
                  </span>
                </div>
              )}

              {/* INTERACTIVE COMPONENT 6: Ornate Handwritten Scroll / Note */}
              {surprise.type === "note" && (
                <div className="w-full max-w-lg p-6 rounded-2xl border border-[#C5A059]/20 bg-[#C5A059]/5 relative font-serif text-base text-[#F5F2ED]/90 leading-relaxed font-light italic">
                  <div className="absolute top-2 left-2 text-[#C5A059]/20 text-[24px]">“</div>
                  <p className="px-6 py-2 text-justify md:text-center">
                    {surprise.content}
                  </p>
                  <div className="absolute bottom-2 right-2 text-[#C5A059]/20 text-[24px]">”</div>
                </div>
              )}

              {/* DEFAULT SURPRISE INTERACTION (Fallback/Note Display) */}
              {surprise.type !== "note" && surprise.type !== "butterfly" && surprise.type !== "flower" && (
                <div className="max-w-lg space-y-3">
                  <h4 className="font-serif text-2xl text-[#F5F2ED] font-light tracking-wide italic">
                    {surprise.title}
                  </h4>
                  <p className="font-serif text-sm text-white/60 leading-relaxed font-light italic">
                    "{surprise.content}"
                  </p>
                </div>
              )}

            </div>

            {/* Bottom Actions Panel */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-white/5 gap-4 relative z-10">
              <div className="text-left">
                <span className="font-mono text-[8px] text-white/30 uppercase block">
                  Today's Subtitle
                </span>
                <span className="font-serif text-xs text-[#C5A059] italic">
                  {surprise.subtitle}
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleInteractiveTrigger}
                  className="px-5 py-2.5 rounded-xl border border-[#C5A059]/30 bg-[#C5A059]/5 hover:bg-[#C5A059]/10 text-[#C5A059] font-mono text-[8px] tracking-widest uppercase font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  Interact Star
                </button>
                <button
                  onClick={handleRandomSurprise}
                  className="px-5 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/90 font-mono text-[8px] tracking-widest uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Compass className="w-3 h-3" />
                  Explore Galaxy
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
