import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, HelpCircle, RefreshCw, Bird } from "lucide-react";
import { audioSynth } from "./AudioSynth";

export default function WishTree() {
  const [visits, setVisits] = useState<number>(1);
  const [showTooltip, setShowTooltip] = useState(false);
  const [justWatered, setJustWatered] = useState(false);

  // Load visits from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem("deepal_birthday_tree_visits");
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 365) {
        setVisits(parsed);
      }
    } else {
      localStorage.setItem("deepal_birthday_tree_visits", "1");
    }
  }, []);

  const saveVisits = (v: number) => {
    setVisits(v);
    localStorage.setItem("deepal_birthday_tree_visits", v.toString());
  };

  const handleWater = () => {
    if (visits < 365) {
      const next = visits + 1;
      saveVisits(next);
      audioSynth.playChime();
      setJustWatered(true);
      setTimeout(() => setJustWatered(false), 800);
    } else {
      audioSynth.playWishRelease();
    }
  };

  const handleComplete = () => {
    saveVisits(365);
    audioSynth.playWishRelease();
    audioSynth.playChime();
  };

  const handleReset = () => {
    saveVisits(1);
    audioSynth.playLowHum();
  };

  // Generate 365 deterministic leaf positions on the SVG tree branches
  const leafPositions = useMemo(() => {
    const leaves: Array<{
      x: number;
      y: number;
      scale: number;
      delay: number;
      angle: number;
      color: string;
    }> = [];

    // Deterministic random generator based on seed
    let seed = 42;
    const rand = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    // Main branches definitions to attach leaves
    // Branch coordinate intervals where leaves can sprout
    const branches = [
      // Left major branch: trunk divides at x:150, y:280
      { startX: 150, startY: 280, endX: 80, endY: 200, count: 60 },
      { startX: 80, startY: 200, endX: 40, endY: 140, count: 40 },
      // Right major branch
      { startX: 150, startY: 280, endX: 220, endY: 190, count: 60 },
      { startX: 220, startY: 190, endX: 260, endY: 130, count: 40 },
      // Center/top branches
      { startX: 150, startY: 240, endX: 150, endY: 120, count: 65 },
      { startX: 150, startY: 120, endX: 100, endY: 60, count: 50 },
      { startX: 150, startY: 120, endX: 200, endY: 60, count: 50 },
    ];

    branches.forEach((b) => {
      for (let i = 0; i < b.count; i++) {
        const t = rand(); // parametric position along branch
        // Add random spread perpendicular to the branch direction
        const dx = b.endX - b.startX;
        const dy = b.endY - b.startY;
        const len = Math.sqrt(dx * dx + dy * dy);
        const perpX = -dy / len;
        const perpY = dx / len;

        const spreadAmount = rand() * 45 - 22.5; // spread from branch
        const x = b.startX + dx * t + perpX * spreadAmount;
        const y = b.startY + dy * t + perpY * spreadAmount;

        // Angle of leaf orientation
        const angle = rand() * 360;
        const scale = 0.5 + rand() * 0.7;
        const delay = rand() * 0.5;

        // Luxe shades of gold and soft copper
        const golds = ["#C5A059", "#D4AF37", "#E6C687", "#AA7C11", "#F3E5AB"];
        const color = golds[Math.floor(rand() * golds.length)];

        leaves.push({ x, y, scale, delay, angle, color });
      }
    });

    // Make sure we have exactly 365 leaves
    while (leaves.length < 365) {
      leaves.push({
        x: 150 + (rand() * 160 - 80),
        y: 120 + (rand() * 120 - 60),
        scale: 0.6 + rand() * 0.5,
        delay: rand() * 0.4,
        angle: rand() * 360,
        color: "#C5A059",
      });
    }

    return leaves.slice(0, 365);
  }, []);

  const isCompleted = visits === 365;

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-16 relative">
      <div className="relative rounded-3xl bg-white/[0.01] border border-white/5 backdrop-blur-md p-8 md:p-12 overflow-hidden shadow-2xl">
        {/* Soft Background Radial Light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Text & Interactive Column */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left select-none">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/5 text-[#C5A059] text-[10px] uppercase tracking-widest-plus">
              <Sparkles className="w-3 h-3 text-[#C5A059] animate-pulse" />
              <span>Act VII: The Wish Tree</span>
            </div>

            <div className="space-y-3">
              <h3 className="font-serif text-3xl md:text-4xl text-[#F5F2ED] tracking-wide font-light">
                The Magical <span className="text-[#C5A059] italic font-normal">Glowing</span> Tree
              </h3>
              <p className="font-sans text-sm text-white/60 leading-relaxed font-light">
                A living symbol of wishes. Each daily visit sprouts one glowing golden leaf upon the branches. When completed with 365 leaves, the tree transforms into full magical bloom.
              </p>
            </div>

            {/* Visit Progress bar */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs font-mono text-white/40">
                <span>GROWTH STATUS</span>
                <span className="text-[#C5A059] font-medium">{visits} / 365 Leaves</span>
              </div>
              <div className="h-[2px] bg-white/10 rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#AA7C11] via-[#C5A059] to-[#F3E5AB] shadow-[0_0_10px_#C5A059]"
                  initial={{ width: 0 }}
                  animate={{ width: `${(visits / 365) * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Interactive Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 pt-4">
              <button
                onClick={handleWater}
                className="relative py-3.5 px-6 rounded-full border border-[#C5A059]/30 bg-gradient-to-r from-[#C5A059]/5 to-transparent hover:from-[#C5A059]/15 hover:to-[#C5A059]/5 text-[#F5F2ED] text-xs font-mono tracking-widest transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(197,160,89,0.15)] group"
              >
                <span className="relative">
                  {isCompleted ? "TREE FULLY GROWN" : "WATER THE TREE"}
                </span>
                {!isCompleted && (
                  <span className="text-[10px] text-white/40 group-hover:text-[#C5A059] transition-colors">
                    (+1 Visit)
                  </span>
                )}
                {justWatered && (
                  <motion.span
                    initial={{ y: 0, opacity: 1 }}
                    animate={{ y: -15, opacity: 0 }}
                    className="absolute text-amber-300 font-bold font-mono text-xs"
                  >
                    +1 Leaf
                  </motion.span>
                )}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={handleComplete}
                  disabled={isCompleted}
                  className="flex-1 py-2 px-4 rounded-full border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] disabled:opacity-40 text-white/60 hover:text-[#F5F2ED] text-[10px] font-mono tracking-wider transition-colors duration-200"
                >
                  COMPLETE (365)
                </button>
                <button
                  onClick={handleReset}
                  className="p-2 rounded-full border border-white/5 bg-white/[0.02] hover:bg-rose-950/20 hover:border-rose-900/30 text-white/40 hover:text-rose-400 transition-all duration-200"
                  title="Reset Tree Progress"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right SVG Tree Column */}
          <div className="lg:col-span-7 flex justify-center items-center relative">
            {/* Completion fireworks/glow backdrop */}
            <AnimatePresence>
              {isCompleted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-none flex justify-center items-center"
                >
                  <div className="w-80 h-80 rounded-full bg-gradient-radial from-amber-400/10 to-transparent blur-2xl animate-pulse" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tree SVG */}
            <div className="w-full max-w-[320px] md:max-w-[380px] h-[340px] relative">
              <svg viewBox="0 0 300 360" className="w-full h-full drop-shadow-lg overflow-visible">
                {/* SVG Filter for golden glow */}
                <defs>
                  <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id="super-glow" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="7" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Ground Mound */}
                <ellipse cx="150" cy="335" rx="65" ry="5" className="fill-white/[0.03] stroke-white/5" strokeWidth="0.5" />
                <ellipse cx="150" cy="335" rx="45" ry="3" className="fill-[#C5A059]/10" />

                {/* Tree Trunk and Main Branches */}
                <path
                  d="M144 335 C145 310, 142 290, 145 280 C148 270, 153 270, 155 280 C158 290, 155 310, 156 335 Z"
                  className="fill-[#2D2316] stroke-[#C5A059]/20"
                  strokeWidth="0.5"
                />
                
                {/* Tree Structure (Branches) */}
                <g className="stroke-[#2D2316] fill-none" strokeLinecap="round">
                  {/* Left branch */}
                  <path d="M146 285 Q135 250 115 220 Q105 205 80 200" strokeWidth="5" />
                  <path d="M115 220 Q105 180 85 160" strokeWidth="3" />
                  <path d="M80 200 Q55 170 40 140" strokeWidth="2.5" />
                  {/* Right branch */}
                  <path d="M154 285 Q165 245 195 215 Q205 205 220 190" strokeWidth="5" />
                  <path d="M195 215 Q210 180 235 155" strokeWidth="3" />
                  <path d="M220 190 Q245 165 260 130" strokeWidth="2.5" />
                  {/* Middle major trunk extension */}
                  <path d="M150 280 Q150 210 150 120" strokeWidth="4.5" />
                  <path d="M150 190 Q130 140 100 110" strokeWidth="3.2" />
                  <path d="M150 170 Q175 125 200 95" strokeWidth="3.2" />
                  <path d="M150 120 Q130 90 100 60" strokeWidth="2" />
                  <path d="M150 120 Q170 90 200 60" strokeWidth="2" />
                </g>

                {/* Delicate highlights on wood */}
                <g className="stroke-[#C5A059]/30 fill-none" strokeWidth="0.5" strokeLinecap="round">
                  <path d="M149 330 Q148 290 148 280 Q142 260 122 235 Q110 220 85 203" />
                  <path d="M151 330 Q152 290 152 280 Q160 255 185 225 Q198 215 215 198" />
                  <path d="M150 270 L150 135" />
                </g>

                {/* 365 Sprouting Golden Leaves */}
                <g className="transition-all duration-500">
                  {leafPositions.map((leaf, index) => {
                    const isSprouted = index < visits;
                    return (
                      <g key={index} className="transition-all duration-500">
                        {isSprouted && (
                          <motion.path
                            d="M0 -3 C2 -3, 3 -1, 0 5 C-3 -1, -2 -3, 0 -3 Z"
                            transform={`translate(${leaf.x}, ${leaf.y}) rotate(${leaf.angle}) scale(${leaf.scale * 0.8})`}
                            fill={leaf.color}
                            className="transition-colors duration-500 hover:fill-white cursor-pointer origin-center"
                            style={{
                              filter: isCompleted ? "url(#gold-glow)" : "none",
                            }}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: leaf.scale * 0.8, opacity: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 100,
                              damping: 10,
                              delay: justWatered && index === visits - 1 ? 0 : leaf.delay,
                            }}
                            title={`Leaf #${index + 1}`}
                          />
                        )}
                      </g>
                    );
                  })}
                </g>

                {/* Flowers Bloom when Completed (Visits === 365) */}
                <AnimatePresence>
                  {isCompleted && (
                    <g className="origin-center" style={{ filter: "url(#super-glow)" }}>
                      {/* Flower 1 */}
                      <motion.g
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", delay: 0.1 }}
                        transform="translate(40, 140)"
                      >
                        <circle cx="0" cy="0" r="3.5" className="fill-rose-400" />
                        <circle cx="-3" cy="0" r="2.5" className="fill-rose-300" />
                        <circle cx="3" cy="0" r="2.5" className="fill-rose-300" />
                        <circle cx="0" cy="-3" r="2.5" className="fill-rose-300" />
                        <circle cx="0" cy="3" r="2.5" className="fill-rose-300" />
                        <circle cx="0" cy="0" r="1.2" className="fill-yellow-200" />
                      </motion.g>

                      {/* Flower 2 */}
                      <motion.g
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", delay: 0.3 }}
                        transform="translate(260, 130)"
                      >
                        <circle cx="0" cy="0" r="3.5" className="fill-rose-400" />
                        <circle cx="-3" cy="0" r="2.5" className="fill-rose-300" />
                        <circle cx="3" cy="0" r="2.5" className="fill-rose-300" />
                        <circle cx="0" cy="-3" r="2.5" className="fill-rose-300" />
                        <circle cx="0" cy="3" r="2.5" className="fill-rose-300" />
                        <circle cx="0" cy="0" r="1.2" className="fill-yellow-200" />
                      </motion.g>

                      {/* Flower 3 */}
                      <motion.g
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.3, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", delay: 0.5 }}
                        transform="translate(150, 65)"
                      >
                        <circle cx="0" cy="0" r="3.5" className="fill-amber-400" />
                        <circle cx="-3" cy="0" r="2.5" className="fill-amber-300" />
                        <circle cx="3" cy="0" r="2.5" className="fill-amber-300" />
                        <circle cx="0" cy="-3" r="2.5" className="fill-amber-300" />
                        <circle cx="0" cy="3" r="2.5" className="fill-amber-300" />
                        <circle cx="0" cy="0" r="1.2" className="fill-white" />
                      </motion.g>

                      {/* Flower 4 */}
                      <motion.g
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.0, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", delay: 0.7 }}
                        transform="translate(100, 110)"
                      >
                        <circle cx="0" cy="0" r="3.5" className="fill-rose-400" />
                        <circle cx="-3" cy="0" r="2.5" className="fill-rose-300" />
                        <circle cx="3" cy="0" r="2.5" className="fill-rose-300" />
                        <circle cx="0" cy="-3" r="2.5" className="fill-rose-300" />
                        <circle cx="0" cy="3" r="2.5" className="fill-rose-300" />
                        <circle cx="0" cy="0" r="1.2" className="fill-yellow-200" />
                      </motion.g>

                      {/* Flower 5 */}
                      <motion.g
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.0, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", delay: 0.9 }}
                        transform="translate(200, 95)"
                      >
                        <circle cx="0" cy="0" r="3.5" className="fill-amber-400" />
                        <circle cx="-3" cy="0" r="2.5" className="fill-amber-300" />
                        <circle cx="3" cy="0" r="2.5" className="fill-amber-300" />
                        <circle cx="0" cy="-3" r="2.5" className="fill-amber-300" />
                        <circle cx="0" cy="3" r="2.5" className="fill-amber-300" />
                        <circle cx="0" cy="0" r="1.2" className="fill-white" />
                      </motion.g>
                    </g>
                  )}
                </AnimatePresence>

                {/* Animated Tiny Birds resting on branches when completed */}
                <AnimatePresence>
                  {isCompleted && (
                    <g>
                      {/* Bird Left */}
                      <motion.g
                        initial={{ opacity: 0, y: -20, scale: 0 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ type: "spring", stiffness: 80, delay: 1.2 }}
                        transform="translate(82, 155)"
                        className="cursor-pointer"
                        title="A tiny bird resting on the branch"
                        onClick={() => audioSynth.playChime()}
                      >
                        {/* Little bird SVG */}
                        <path d="M-5 -2 Q-7 -7 -3 -9 Q1 -11 5 -7 Q10 -6 12 -2 Q10 2 6 2 Q2 2 -1 0 Q-3 0 -5 -2 Z" className="fill-amber-200" />
                        <circle cx="3" cy="-7" r="0.7" className="fill-black" />
                        <path d="M5 -7 L7 -6.5 L5 -6 Z" className="fill-[#AA7C11]" /> {/* Beak */}
                        <path d="M-2 1 Q-3 5 -2 8 M1 1 Q0 5 1 8" stroke="#C5A059" strokeWidth="0.5" /> {/* Legs */}
                        <motion.path
                          d="M-2 -3 Q2 -5 3 -2"
                          className="fill-none stroke-amber-100"
                          strokeWidth="0.75"
                          animate={{ rotate: [0, -10, 0] }}
                          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        /> {/* Wing */}
                      </motion.g>

                      {/* Bird Right */}
                      <motion.g
                        initial={{ opacity: 0, y: -20, scale: 0 }}
                        animate={{ opacity: 1, y: 0, scale: -1 }} // mirrored scale x
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ type: "spring", stiffness: 80, delay: 1.5 }}
                        transform="translate(225, 178)"
                        className="cursor-pointer"
                        title="A little companion keeping watch"
                        onClick={() => audioSynth.playChime()}
                      >
                        <path d="M-5 -2 Q-7 -7 -3 -9 Q1 -11 5 -7 Q10 -6 12 -2 Q10 2 6 2 Q2 2 -1 0 Q-3 0 -5 -2 Z" className="fill-amber-200" />
                        <circle cx="3" cy="-7" r="0.7" className="fill-black" />
                        <path d="M5 -7 L7 -6.5 L5 -6 Z" className="fill-[#AA7C11]" />
                        <path d="M-2 1 Q-3 5 -2 8 M1 1 Q0 5 1 8" stroke="#C5A059" strokeWidth="0.5" />
                        <motion.path
                          d="M-2 -3 Q2 -5 3 -2"
                          className="fill-none stroke-amber-100"
                          strokeWidth="0.75"
                          animate={{ rotate: [0, 8, 0] }}
                          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                        />
                      </motion.g>
                    </g>
                  )}
                </AnimatePresence>
              </svg>

              {/* Float sparkles inside completed tree */}
              {isCompleted && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 rounded-full bg-amber-200 shadow-[0_0_8px_#F5F2ED]"
                      style={{
                        left: `${15 + Math.random() * 70}%`,
                        top: `${15 + Math.random() * 55}%`,
                      }}
                      animate={{
                        y: [-10, -50],
                        opacity: [0, 1, 0],
                        scale: [0.6, 1.2, 0.4],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2.5 + Math.random() * 2,
                        delay: i * 0.4,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
