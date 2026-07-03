import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Maximize2, X, Sparkles, Image, Compass, Heart } from "lucide-react";
import { audioSynth } from "./AudioSynth";

interface GalleryItem {
  id: number;
  title: string;
  theme: string; // colors
  desc: string;
  gridSpan: string; // Tailwind class for grid layout
  svgMarkup: React.ReactNode;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    title: "Cute Indian Boy",
    theme: "from-amber-600/20 to-[#C5A059]/10",
    desc: "A stylized illustration representing a cheerful young boy under a canopy of warm silver stars, holding a glowing paper locket.",
    gridSpan: "col-span-1 md:col-span-2 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full fill-current">
        <circle cx="50" cy="45" r="22" className="fill-white/10 stroke-[#C5A059]/40" strokeWidth="0.5" />
        <path d="M50 12 C58 12, 64 18, 62 26 C60 30, 68 32, 65 38 C60 45, 40 45, 35 38 C32 32, 40 30, 38 26 C36 18, 42 12, 50 12 Z" className="fill-[#C5A059]/20" />
        <path d="M50 48 Q50 65 35 75 Q20 85 20 110 L80 110 Q80 85 65 75 Q50 65 50 48 Z" className="fill-white/5 stroke-[#C5A059]/20" strokeWidth="0.5" />
        <circle cx="50" cy="85" r="6" className="fill-[#C5A059] animate-pulse" />
        <circle cx="25" cy="25" r="1.5" className="fill-white/60" />
        <circle cx="75" cy="30" r="1" className="fill-white/40" />
        <path d="M42 38 Q50 44 58 38" stroke="#C5A059" strokeWidth="1" fill="none" />
      </svg>
    )
  },
  {
    id: 2,
    title: "Cute Indian Girl",
    theme: "from-rose-500/20 to-[#C5A059]/10",
    desc: "A beautiful, minimalist silhouette of a smiling girl with elegant flowers in her braided hair, holding a golden lotus.",
    gridSpan: "col-span-1 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full fill-current">
        <circle cx="50" cy="45" r="20" className="fill-white/10 stroke-rose-400/30" strokeWidth="0.5" />
        <path d="M50 15 C62 15, 68 25, 66 35 C64 42, 68 45, 60 52 C52 58, 48 58, 40 52 C32 45, 36 42, 34 35 C32 25, 38 15, 50 15 Z" className="fill-rose-400/10" />
        {/* Hair Braids & Flowers */}
        <path d="M30 20 Q22 45 28 80 Q32 100 35 110" stroke="#C5A059" strokeOpacity={0.2} strokeWidth="2" fill="none" />
        <path d="M70 20 Q78 45 72 80 Q68 100 65 110" stroke="#C5A059" strokeOpacity={0.2} strokeWidth="2" fill="none" />
        <circle cx="31" cy="40" r="3" className="fill-[#C5A059]" />
        <circle cx="69" cy="45" r="3" className="fill-[#C5A059]" />
        <path d="M43 36 Q50 42 57 36" stroke="currentColor" strokeWidth="1" fill="none" />
        {/* Golden Lotus */}
        <path d="M50 78 C46 86, 38 86, 50 102 C62 86, 54 86, 50 78 Z" className="fill-[#C5A059]/30" />
      </svg>
    )
  },
  {
    id: 3,
    title: "Moonlight Walk",
    theme: "from-sky-900/20 to-indigo-950/10",
    desc: "An atmospheric illustration showing a crescent silver moon reflecting over a quiet trail paved with luminous stardust.",
    gridSpan: "col-span-1 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full fill-current">
        <path d="M75 25 A 25 25 0 1 0 35 65 A 28 28 0 1 1 75 25 Z" className="fill-[#F5F2ED]/80 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
        <path d="M10 110 Q50 90 90 110" stroke="#C5A059" strokeWidth="1" fill="none" />
        <circle cx="30" cy="100" r="1.5" className="fill-white/60 animate-pulse" />
        <circle cx="70" cy="98" r="1.5" className="fill-white/60 animate-pulse" />
        {/* Luminous path dots */}
        <line x1="10" y1="110" x2="90" y2="110" stroke="#C5A059" strokeWidth="0.5" strokeDasharray="2" />
      </svg>
    )
  },
  {
    id: 4,
    title: "Cherry Blossom Garden",
    theme: "from-rose-600/15 to-transparent",
    desc: "A soft visual poetry panel where delicate cherry blossom branches stretch across the moon, showering petals onto the ground.",
    gridSpan: "col-span-1 row-span-2",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full fill-current">
        <circle cx="50" cy="50" r="30" className="fill-white/[0.03] stroke-white/5" strokeWidth="1" />
        <path d="M0 20 Q40 40 50 75 Q60 110 40 120" stroke="#C5A059" strokeOpacity={0.3} strokeWidth="2" fill="none" />
        <path d="M50 75 Q75 60 90 40" stroke="#C5A059" strokeOpacity={0.25} strokeWidth="1.5" fill="none" />
        {/* Soft Pink Blossom Petals */}
        <circle cx="35" cy="35" r="4" className="fill-rose-400/40" />
        <circle cx="52" cy="73" r="3" className="fill-rose-300/50" />
        <circle cx="75" cy="55" r="5" className="fill-rose-400/30" />
        <circle cx="20" cy="65" r="3" className="fill-rose-300/40" />
        <circle cx="60" cy="90" r="4.5" className="fill-rose-400/35" />
        {/* Swirling petals */}
        <path d="M30 40 Q40 50 35 60" stroke="rose-400" strokeWidth="0.2" fill="none" className="opacity-40" />
      </svg>
    )
  },
  {
    id: 5,
    title: "Lantern Festival",
    theme: "from-amber-500/25 to-[#C5A059]/5",
    desc: "A rich array of glowing golden paper lanterns slowly ascending into the deep indigo evening sky.",
    gridSpan: "col-span-1 md:col-span-2 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full fill-current">
        {/* Multiple floating boxes of lanterns */}
        <rect x="25" y="60" width="12" height="18" rx="2" className="fill-[#C5A059]/40 stroke-[#C5A059]/50 animate-bounce" style={{ animationDuration: "3s" }} />
        <circle cx="31" cy="69" r="3" className="fill-white/90 animate-pulse" />

        <rect x="65" y="30" width="16" height="24" rx="3" className="fill-[#C5A059]/30 stroke-[#C5A059]/40 animate-bounce" style={{ animationDuration: "5s" }} />
        <circle cx="73" cy="42" r="4.5" className="fill-white/90 animate-pulse" />

        <rect x="45" y="80" width="10" height="15" rx="1.5" className="fill-[#C5A059]/50 stroke-[#C5A059]/60" />
        <circle cx="50" cy="87" r="2.5" className="fill-white/95" />

        <rect x="10" y="20" width="8" height="12" rx="1" className="fill-[#C5A059]/20 stroke-[#C5A059]/30" />
      </svg>
    )
  },
  {
    id: 6,
    title: "Birthday Balloons",
    theme: "from-[#C5A059]/20 to-transparent",
    desc: "Festive balloon outlines with long trailing stardust strings, carrying quiet birthday wishes.",
    gridSpan: "col-span-1 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full fill-current">
        <ellipse cx="40" cy="40" rx="15" ry="20" className="fill-[#C5A059]/20 stroke-[#C5A059]/40" strokeWidth="0.75" />
        <path d="M40 60 L40 110" stroke="#C5A059" strokeWidth="0.5" strokeDasharray="3" />
        <ellipse cx="60" cy="55" rx="12" ry="16" className="fill-white/5 stroke-white/20" strokeWidth="0.5" />
        <path d="M60 71 L60 110" stroke="white" strokeWidth="0.4" strokeDasharray="2" />
        <polygon points="40,60 38,64 42,64" className="fill-[#C5A059]" />
        <polygon points="60,71 58,74 62,74" className="fill-white/40" />
      </svg>
    )
  },
  {
    id: 7,
    title: "Night Sky",
    theme: "from-[#08080a] to-[#0d0d11]",
    desc: "An ornate map of the deep night sky, featuring intricate interconnected gold constellation lines.",
    gridSpan: "col-span-1 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full stroke-current fill-none" strokeWidth="0.5">
        <circle cx="50" cy="60" r="40" className="stroke-[#C5A059]/20" strokeDasharray="3" />
        <circle cx="50" cy="60" r="25" className="stroke-white/10" />
        <line x1="50" y1="20" x2="50" y2="100" className="stroke-[#C5A059]/10" />
        <line x1="10" y1="60" x2="90" y2="60" className="stroke-[#C5A059]/10" />
        {/* Constellation nodes */}
        <polyline points="25,40 40,30 60,35 75,50" className="stroke-[#C5A059]/50" />
        <circle cx="25" cy="40" r="1.5" className="fill-[#C5A059] stroke-none" />
        <circle cx="40" cy="30" r="1.5" className="fill-white stroke-none" />
        <circle cx="60" cy="35" r="1.5" className="fill-white stroke-none" />
        <circle cx="75" cy="50" r="2" className="fill-[#C5A059] stroke-none animate-ping" style={{ animationDuration: "2s" }} />
      </svg>
    )
  },
  {
    id: 8,
    title: "Stars",
    theme: "from-amber-500/10 to-transparent",
    desc: "A premium display of shining cosmic stars, radiating with pure stardust glare.",
    gridSpan: "col-span-1 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full fill-current">
        <path d="M50 15 L53 38 L75 41 L53 44 L50 67 L47 44 L25 41 L47 38 Z" className="fill-[#C5A059] drop-shadow-[0_0_12px_#C5A059]" />
        <circle cx="50" cy="41" r="5" className="fill-[#F5F2ED]" />
        <path d="M80 80 L81 90 L91 91 L81 92 L80 102 L79 92 L69 91 L79 90 Z" className="fill-[#C5A059]/60" />
        <circle cx="20" cy="85" r="2" className="fill-white/70 animate-pulse" />
        <circle cx="15" cy="25" r="1.5" className="fill-white/40" />
      </svg>
    )
  },
  {
    id: 9,
    title: "Rain",
    theme: "from-slate-800/20 to-transparent",
    desc: "Thin, parallel silver rain lines washing over a sleek dark glass canvas.",
    gridSpan: "col-span-1 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full stroke-current fill-none" strokeWidth="0.5">
        {Array.from({ length: 15 }).map((_, i) => {
          const x = 10 + (i * 7);
          const y = (i * 4) % 60;
          return (
            <line
              key={i}
              x1={x}
              y1={y}
              x2={x - 10}
              y2={y + 35}
              className="stroke-white/30"
              strokeDasharray="5,15"
            />
          );
        })}
        {/* Ripples */}
        <ellipse cx="30" cy="110" rx="10" ry="2" className="stroke-[#C5A059]/30" />
        <ellipse cx="70" cy="112" rx="14" ry="2.5" className="stroke-white/10" />
      </svg>
    )
  },
  {
    id: 10,
    title: "Cafe",
    theme: "from-amber-900/15 to-transparent",
    desc: "Cozy perspective of a steaming porcelain coffee mug resting beside a glass window with soft rain droplets.",
    gridSpan: "col-span-1 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full fill-current">
        {/* Window grid */}
        <line x1="50" y1="10" x2="50" y2="110" stroke="white/10" strokeWidth="0.5" />
        {/* Steaming Mug */}
        <path d="M30 65 L70 65 L66 100 L34 100 Z" className="fill-white/5 stroke-[#C5A059]/30" strokeWidth="1" />
        <path d="M70 73 C75 73, 78 78, 78 83 C78 88, 75 92, 70 92" stroke="#C5A059" strokeOpacity={0.3} strokeWidth="1" fill="none" />
        {/* Rising steam lines */}
        <path d="M42 55 Q46 45 42 35" stroke="#C5A059" strokeWidth="0.5" fill="none" className="opacity-60" />
        <path d="M52 57 Q56 47 52 37" stroke="#C5A059" strokeWidth="0.5" fill="none" className="opacity-60" />
        <path d="M60 55 Q56 45 60 35" stroke="#C5A059" strokeWidth="0.5" fill="none" className="opacity-40" />
      </svg>
    )
  },
  {
    id: 11,
    title: "Books",
    theme: "from-[#C5A059]/15 to-transparent",
    desc: "Stacked, heavy gold leather-bound volumes inside a quiet cozy reading space.",
    gridSpan: "col-span-1 md:col-span-2 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full stroke-current fill-none" strokeWidth="0.75">
        <rect x="25" y="85" width="50" height="15" rx="1.5" className="fill-white/5 stroke-[#C5A059]/40" />
        <rect x="28" y="70" width="44" height="15" rx="1.5" className="fill-white/5 stroke-[#C5A059]/50" />
        <rect x="32" y="55" width="36" height="15" rx="1.5" className="fill-white/5 stroke-white/20" />
        {/* Spine details */}
        <line x1="28" y1="92" x2="72" y2="92" className="stroke-[#C5A059]/20" />
        <line x1="31" y1="77" x2="69" y2="77" className="stroke-[#C5A059]/20" />
        {/* Bookmark ribbon */}
        <path d="M45 55 L45 85 L49 80 L53 85 L53 55" className="fill-[#C5A059]/20 stroke-[#C5A059]" strokeWidth="0.5" />
      </svg>
    )
  },
  {
    id: 12,
    title: "Music",
    theme: "from-purple-900/15 to-transparent",
    desc: "A delicate, vibrating luxury music wave, carrying quiet comforting melodies.",
    gridSpan: "col-span-1 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full stroke-current fill-none" strokeWidth="0.75">
        {Array.from({ length: 9 }).map((_, i) => {
          const x = 10 + (i * 10);
          const h = 20 + Math.sin(i * 0.8) * 35;
          return (
            <line
              key={i}
              x1={x}
              y1={60 - h / 2}
              x2={x}
              y2={60 + h / 2}
              className="stroke-[#C5A059]/50"
            />
          );
        })}
        {/* G Clef outline */}
        <path d="M75 30 C70 30, 68 35, 68 40 C68 55, 80 50, 75 75 C72 85, 60 85, 65 72" className="stroke-white/30" />
      </svg>
    )
  },
  {
    id: 13,
    title: "Butterflies",
    theme: "from-rose-500/15 to-transparent",
    desc: "Two stardust butterflies in gentle mid-flight, flapping wings in perfect synchronization.",
    gridSpan: "col-span-1 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full fill-current">
        <path d="M40 50C38 35 25 25 15 25C5 25 0 35 0 45C0 65 25 70 40 85C55 70 80 65 80 45C80 35 75 25 65 25C55 25 42 35 40 50Z" className="fill-[#C5A059]/20 stroke-[#C5A059]/40" strokeWidth="0.5" />
        <ellipse cx="40" cy="55" rx="1.5" ry="12" className="fill-white/80" />
        <path d="M34 45 Q20 30 18 45" stroke="#C5A059" strokeWidth="0.5" fill="none" />
        <path d="M46 45 Q60 30 62 45" stroke="#C5A059" strokeWidth="0.5" fill="none" />
      </svg>
    )
  },
  {
    id: 14,
    title: "Magical Garden",
    theme: "from-emerald-950/20 to-[#C5A059]/5",
    desc: "Intricate glowing organic vines, climbing slowly with bright seed pods radiating gold glare.",
    gridSpan: "col-span-1 row-span-2",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full stroke-current fill-none" strokeWidth="0.5">
        <path d="M20 120 Q50 60 30 10 Q60 40 80 120" className="stroke-[#C5A059]/30" />
        <path d="M30 10 Q10 40 10 90" className="stroke-[#C5A059]/20" />
        <circle cx="30" cy="10" r="3" className="fill-[#F5F2ED] stroke-none animate-ping" style={{ animationDuration: "3s" }} />
        {/* Glow leaves */}
        <path d="M35 70 Q55 55 45 50 Z" className="fill-[#C5A059]/15 stroke-[#C5A059]/40" />
        <path d="M25 90 Q5 80 15 70 Z" className="fill-white/5 stroke-white/25" />
      </svg>
    )
  },
  {
    id: 15,
    title: "Golden Sunset",
    theme: "from-amber-600/20 to-rose-700/10",
    desc: "A series of elegant, quiet horizontal light bars mimicking sunset reflections over clear horizons.",
    gridSpan: "col-span-1 md:col-span-2 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full fill-current">
        <circle cx="50" cy="65" r="28" className="fill-[#C5A059]/25 stroke-[#C5A059]/40" strokeWidth="0.5" />
        {/* Sunset horizon bars */}
        <rect x="10" y="65" width="80" height="2" className="fill-[#050505]" />
        <rect x="15" y="73" width="70" height="1.5" className="fill-[#C5A059]/40" />
        <rect x="25" y="80" width="50" height="1" className="fill-[#C5A059]/20" />
        <rect x="35" y="86" width="30" height="1" className="fill-white/20" />
      </svg>
    )
  },
  {
    id: 16,
    title: "Paper Airplane",
    theme: "from-blue-900/10 to-transparent",
    desc: "A crisp minimal origami dart soaring into a skyward direction, trailing stardust.",
    gridSpan: "col-span-1 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full fill-current">
        <path d="M15 80 L80 30 L55 85 L42 98 L40 85 Z" className="fill-white/10 stroke-[#C5A059]/40" strokeWidth="0.75" />
        <path d="M40 85 L80 30 L55 85 Z" className="fill-white/5 stroke-white/20" strokeWidth="0.5" />
        {/* Trail */}
        <path d="M10 95 Q13 90 15 80" stroke="#C5A059" strokeWidth="0.5" strokeDasharray="2" fill="none" />
      </svg>
    )
  },
  {
    id: 17,
    title: "Floating Clouds",
    theme: "from-sky-900/10 to-transparent",
    desc: "Gently overlapping vector cloud silhouettes under a crescent moon's warm embrace.",
    gridSpan: "col-span-1 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full stroke-current fill-none" strokeWidth="0.5">
        <path d="M30 80 C30 70, 45 65, 55 70 C65 60, 85 65, 85 80 Z" className="fill-white/5 stroke-white/20" />
        <path d="M15 90 C15 82, 28 78, 35 83 C42 75, 58 78, 58 90 Z" className="fill-[#C5A059]/10 stroke-[#C5A059]/30" />
        <circle cx="75" cy="35" r="1.5" className="fill-white/70 stroke-none" />
      </svg>
    )
  },
  {
    id: 18,
    title: "Fireflies",
    theme: "from-yellow-600/15 to-transparent",
    desc: "A brilliant swarm of high-frequency pulsing stardust dots floating above summer fields.",
    gridSpan: "col-span-1 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full fill-current">
        {Array.from({ length: 12 }).map((_, i) => {
          const x = 20 + Math.random() * 60;
          const y = 20 + Math.random() * 80;
          const r = 1 + Math.random() * 2;
          return (
            <g key={i} className="animate-pulse">
              <circle cx={x} cy={y} r={r} className="fill-[#C5A059]" />
              <circle cx={x} cy={y} r={r * 2.5} className="fill-[#C5A059]/10 stroke-none" />
            </g>
          );
        })}
      </svg>
    )
  },
  {
    id: 19,
    title: "Birthday Cake",
    theme: "from-[#C5A059]/25 to-transparent",
    desc: "A stylized tiered birthday cake silhouette, centering a single shining golden candle flame.",
    gridSpan: "col-span-1 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full fill-current">
        {/* Cake tiers */}
        <rect x="20" y="80" width="60" height="20" rx="2" className="fill-white/5 stroke-[#C5A059]/40" strokeWidth="0.75" />
        <rect x="30" y="60" width="40" height="20" rx="1.5" className="fill-white/5 stroke-white/20" strokeWidth="0.5" />
        {/* Candle */}
        <line x1="50" y1="60" x2="50" y2="40" stroke="#C5A059" strokeWidth="1.5" />
        {/* Flame */}
        <path d="M50 40 C47 35, 47 25, 50 20 C53 25, 53 35, 50 40 Z" className="fill-[#C5A059] drop-shadow-[0_0_8px_#C5A059]" />
      </svg>
    )
  },
  {
    id: 20,
    title: "Sky Lanterns",
    theme: "from-amber-600/15 to-transparent",
    desc: "A close proximity representation of soft, radiant orange floating lanterns ascending peacefully.",
    gridSpan: "col-span-1 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full fill-current">
        <path d="M40 30 L60 30 L65 55 L50 62 L35 55 Z" className="fill-[#C5A059]/25 stroke-[#C5A059]/40" strokeWidth="0.75" />
        <circle cx="50" cy="45" r="4" className="fill-white/90 animate-pulse" />
        <path d="M15 70 L30 70 L34 88 L22 93 L12 88 Z" className="fill-[#C5A059]/15 stroke-white/10" strokeWidth="0.5" />
      </svg>
    )
  },
  {
    id: 21,
    title: "Wishing Tree",
    theme: "from-emerald-900/10 to-transparent",
    desc: "An ornate silhouette of a wishing tree, with complex branches and glowing golden leaves.",
    gridSpan: "col-span-1 md:col-span-2 row-span-2",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full stroke-current fill-none" strokeWidth="0.5">
        <path d="M50 110 L50 70 Q40 50 25 45 Q40 60 48 70" className="stroke-[#C5A059]/40" strokeWidth="1.5" />
        <path d="M50 70 Q60 50 75 45 Q60 60 52 70" className="stroke-[#C5A059]/40" strokeWidth="1.5" />
        <path d="M50 85 Q30 75 20 85" className="stroke-white/15" />
        {/* Glow leaves */}
        <circle cx="25" cy="45" r="2.5" className="fill-[#C5A059] stroke-none animate-ping" style={{ animationDuration: "4s" }} />
        <circle cx="75" cy="45" r="2.5" className="fill-[#C5A059] stroke-none animate-ping" style={{ animationDuration: "3s" }} />
        <circle cx="50" cy="35" r="3" className="fill-[#F5F2ED] stroke-none" />
        <circle cx="35" cy="60" r="2" className="fill-white/60 stroke-none" />
        <circle cx="65" cy="60" r="2" className="fill-white/60 stroke-none" />
      </svg>
    )
  },
  {
    id: 22,
    title: "Shooting Star",
    theme: "from-[#C5A059]/20 to-transparent",
    desc: "A magnificent high-contrast diagonal meteor line shooting over silent dark spaces.",
    gridSpan: "col-span-1 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full fill-current">
        <line x1="85" y1="15" x2="20" y2="80" stroke="url(#shooting-grad)" strokeWidth="1.5" />
        <circle cx="20" cy="80" r="2.5" className="fill-white drop-shadow-[0_0_8px_white]" />
        <circle cx="50" cy="30" r="1" className="fill-white/30" />
        <defs>
          <linearGradient id="shooting-grad" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(197,160,89,0)" />
            <stop offset="100%" stopColor="rgba(197,160,89,1)" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    id: 23,
    title: "Dream Library",
    theme: "from-stone-900/20 to-transparent",
    desc: "Intricate silhouettes of arched windows and massive bookshelves inside an antique gallery.",
    gridSpan: "col-span-1 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full stroke-current fill-none" strokeWidth="0.5">
        <path d="M10 110 L10 40 C10 20, 90 20, 90 40 L90 110" className="stroke-[#C5A059]/30" strokeWidth="1" />
        <line x1="20" y1="60" x2="80" y2="60" className="stroke-white/10" />
        <line x1="20" y1="80" x2="80" y2="80" className="stroke-white/10" />
        <line x1="20" y1="100" x2="80" y2="100" className="stroke-white/10" />
        {/* Book contours */}
        <rect x="25" y="80" width="6" height="20" className="fill-white/5 stroke-[#C5A059]/20" />
        <rect x="31" y="85" width="8" height="15" className="fill-[#C5A059]/10 stroke-[#C5A059]/40" />
        <rect x="60" y="60" width="5" height="20" className="fill-white/5 stroke-white/20" />
      </svg>
    )
  },
  {
    id: 24,
    title: "Hot Chocolate",
    theme: "from-amber-950/20 to-transparent",
    desc: "A steaming mug of hot chocolate topped with beautiful dynamic foam swirls.",
    gridSpan: "col-span-1 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full fill-current">
        <path d="M35 50 C35 38, 65 38, 65 50 L60 90 L40 90 Z" className="fill-[#C5A059]/10 stroke-[#C5A059]/40" strokeWidth="0.75" />
        <path d="M65 58 C72 58, 75 62, 75 68 C75 74, 72 78, 65 78" stroke="#C5A059" strokeOpacity={0.3} strokeWidth="0.75" fill="none" />
        <ellipse cx="50" cy="50" rx="14" ry="4" className="fill-[#C5A059]/30 stroke-[#C5A059]/50" />
        <path d="M46 38 Q50 28 46 18 M54 38 Q58 30 54 20" stroke="white" strokeWidth="0.5" fill="none" className="opacity-40" />
      </svg>
    )
  },
  {
    id: 25,
    title: "Umbrella in Rain",
    theme: "from-blue-900/15 to-transparent",
    desc: "A highly protective vector dome umbrella shielding against falling silver rain lines.",
    gridSpan: "col-span-1 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full stroke-current fill-none" strokeWidth="0.5">
        <path d="M15 70 C15 35, 85 35, 85 70 Z" className="fill-[#C5A059]/10 stroke-[#C5A059]/40" strokeWidth="1" />
        <line x1="50" y1="40" x2="50" y2="100" className="stroke-white/30" />
        <path d="M50 100 C50 105, 55 105, 55 100" stroke="white" strokeWidth="0.75" />
        {/* Rain streaks */}
        <line x1="20" y1="20" x2="15" y2="35" className="stroke-white/30" />
        <line x1="80" y1="15" x2="75" y2="30" className="stroke-white/30" />
      </svg>
    )
  },
  {
    id: 26,
    title: "Snow Evening",
    theme: "from-sky-950/20 to-transparent",
    desc: "Symmetrical luxury crystal snowflakes floating peacefully in winter evening mist.",
    gridSpan: "col-span-1 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full stroke-current fill-none" strokeWidth="0.75">
        <circle cx="50" cy="60" r="2" className="fill-white stroke-none" />
        <line x1="50" y1="30" x2="50" y2="90" className="stroke-white/50" />
        <line x1="20" y1="60" x2="80" y2="60" className="stroke-white/50" />
        <line x1="28" y1="38" x2="72" y2="82" className="stroke-white/30" />
        <line x1="28" y1="82" x2="72" y2="38" className="stroke-white/30" />
        {/* Snow flurries */}
        <circle cx="25" cy="90" r="1" className="fill-white/40 stroke-none" />
        <circle cx="75" cy="30" r="1" className="fill-white/40 stroke-none" />
      </svg>
    )
  },
  {
    id: 27,
    title: "Flower Field",
    theme: "from-rose-950/15 to-[#C5A059]/5",
    desc: "A sprawling field of dynamic flower outlines swaying gently in the summer evening breeze.",
    gridSpan: "col-span-1 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full stroke-current fill-none" strokeWidth="0.5">
        <path d="M15 110 Q25 80 20 50" className="stroke-[#C5A059]/40" />
        <circle cx="20" cy="50" r="4" className="fill-[#C5A059]/20" />
        <path d="M45 110 Q40 70 50 60" className="stroke-white/20" />
        <circle cx="50" cy="60" r="3" className="fill-white/10" />
        <path d="M75 110 Q85 85 80 55" className="stroke-[#C5A059]/30" />
        <circle cx="80" cy="55" r="4" className="fill-[#C5A059]/30" />
      </svg>
    )
  },
  {
    id: 28,
    title: "River Reflection",
    theme: "from-teal-950/25 to-transparent",
    desc: "Quiet wavy horizontal lines reflecting the golden rays of the solar disk.",
    gridSpan: "col-span-1 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full stroke-current fill-none" strokeWidth="0.5">
        <circle cx="50" cy="50" r="22" className="fill-[#C5A059]/10 stroke-[#C5A059]/30" />
        {/* River Waves */}
        <path d="M10 70 Q30 65 50 70 T90 70" className="stroke-white/30" />
        <path d="M10 82 Q30 77 50 82 T90 82" className="stroke-[#C5A059]/40" />
        <path d="M15 95 Q35 90 55 95 T85 95" className="stroke-[#C5A059]/20" />
      </svg>
    )
  },
  {
    id: 29,
    title: "Mountain Sunrise",
    theme: "from-amber-800/15 to-transparent",
    desc: "Triangular peak contours centering a massive rising sun radiating solar warmth.",
    gridSpan: "col-span-1 md:col-span-2 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full stroke-current fill-none" strokeWidth="0.5">
        <circle cx="50" cy="65" r="25" className="fill-[#C5A059]/20 stroke-[#C5A059]/30" />
        {/* Mountain ranges */}
        <polygon points="10,100 45,50 70,100" className="fill-white/[0.02] stroke-white/30" strokeWidth="0.75" />
        <polygon points="35,100 65,65 95,100" className="fill-white/[0.01] stroke-white/20" />
        <line x1="5" y1="100" x2="95" y2="100" className="stroke-[#C5A059]/40" />
      </svg>
    )
  },
  {
    id: 30,
    title: "Cozy Room",
    theme: "from-[#C5A059]/15 to-transparent",
    desc: "Cozy elements of fireplace logs and warm, comforting interior lights.",
    gridSpan: "col-span-1 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full fill-current">
        <rect x="25" y="70" width="50" height="30" rx="3" className="fill-white/5 stroke-white/20" strokeWidth="0.5" />
        {/* Flame in fireplace */}
        <path d="M50 90 Q40 80 50 72 Q60 80 50 90" className="fill-[#C5A059]/50 animate-pulse" />
        {/* Lamp on the side */}
        <path d="M30 65 L40 65 L37 50 L33 50 Z" className="fill-[#C5A059]/20 stroke-[#C5A059]/40" strokeWidth="0.5" />
        <line x1="35" y1="65" x2="35" y2="70" stroke="#C5A059" strokeWidth="0.75" />
      </svg>
    )
  },
  {
    id: 31,
    title: "Whispering Pines",
    theme: "from-emerald-950/20 to-transparent",
    desc: "Intricate evergreen pine outlines stretching under a starry velvet backdrop.",
    gridSpan: "col-span-1 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full stroke-current fill-none" strokeWidth="0.5">
        <polygon points="50,25 35,55 65,55" className="fill-white/[0.02] stroke-[#C5A059]/30" />
        <polygon points="50,45 28,85 72,85" className="fill-white/[0.01] stroke-[#C5A059]/20" />
        <line x1="50" y1="85" x2="50" y2="105" className="stroke-[#C5A059]/40" strokeWidth="1.5" />
        <circle cx="25" cy="30" r="1" className="fill-white/40" />
      </svg>
    )
  },
  {
    id: 32,
    title: "Ocean Whispers",
    theme: "from-blue-950/25 to-transparent",
    desc: "Perfect parallel curling vector waves crowned by golden stardust foam.",
    gridSpan: "col-span-1 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full stroke-current fill-none" strokeWidth="0.5">
        <path d="M0 60 Q25 40 50 60 T100 60" className="stroke-white/20" />
        <path d="M0 75 Q25 55 50 75 T100 75" className="stroke-[#C5A059]/40" />
        <path d="M0 90 Q25 70 50 90 T100 90" className="stroke-[#C5A059]/20" />
        <circle cx="48" cy="45" r="1.5" className="fill-white/50" />
      </svg>
    )
  },
  {
    id: 33,
    title: "Autumn Leaves",
    theme: "from-amber-700/20 to-transparent",
    desc: "Intricately detailed maple leaves drifting on calm horizontal water lines.",
    gridSpan: "col-span-1 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full fill-current">
        <path d="M50 40 L53 52 L65 52 L56 60 L60 72 L50 64 L40 72 L44 60 L35 52 L47 52 Z" className="fill-[#C5A059]/35 stroke-[#C5A059]/50" strokeWidth="0.5" />
        <path d="M25 80 L27 86 L35 86 L29 90 L31 98 L25 93 L19 98 L21 90 L15 86 L23 86 Z" className="fill-[#C5A059]/15" />
      </svg>
    )
  },
  {
    id: 34,
    title: "Lavender Fields",
    theme: "from-indigo-900/15 to-transparent",
    desc: "Elegant violet lavender sprigs climbing vertically against a soft twilight sky.",
    gridSpan: "col-span-1 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full stroke-current fill-none" strokeWidth="0.5">
        <line x1="50" y1="110" x2="50" y2="30" className="stroke-white/20" />
        <ellipse cx="50" cy="35" rx="3" ry="5" className="fill-[#C5A059]/30 stroke-[#C5A059]/50" />
        <ellipse cx="44" cy="48" rx="2" ry="4" className="fill-white/10" />
        <ellipse cx="56" cy="52" rx="2" ry="4" className="fill-white/10" />
        <ellipse cx="50" cy="65" rx="3" ry="5" className="fill-[#C5A059]/20" />
      </svg>
    )
  },
  {
    id: 35,
    title: "Winter Cottage",
    theme: "from-sky-950/20 to-transparent",
    desc: "An A-frame forest locket cabin with a smoking chimney under the polar star.",
    gridSpan: "col-span-1 md:col-span-2 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full stroke-current fill-none" strokeWidth="0.5">
        {/* Pine trees */}
        <polygon points="25,90 15,60 35,60" className="fill-white/[0.01] stroke-white/10" />
        {/* A-frame cabin */}
        <polygon points="50,45 80,95 20,95" className="fill-white/5 stroke-[#C5A059]/40" strokeWidth="0.75" />
        <rect x="44" y="75" width="12" height="20" className="stroke-white/20 fill-none" />
        {/* Chimney steam */}
        <path d="M70 65 Q74 55 70 45" className="stroke-[#C5A059]/40" />
      </svg>
    )
  },
  {
    id: 36,
    title: "Dreamcatcher",
    theme: "from-[#C5A059]/15 to-transparent",
    desc: "Intricately woven hoop and trailing feathers catching peaceful thoughts.",
    gridSpan: "col-span-1 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full stroke-current fill-none" strokeWidth="0.5">
        <circle cx="50" cy="45" r="22" className="stroke-[#C5A059]/40" strokeWidth="0.75" />
        <circle cx="50" cy="45" r="10" className="stroke-[#C5A059]/20" strokeDasharray="2" />
        {/* Web paths */}
        <line x1="28" y1="45" x2="72" y2="45" className="stroke-white/10" />
        <line x1="50" y1="23" x2="50" y2="67" className="stroke-white/10" />
        {/* Feathers */}
        <path d="M50 67 Q46 87 50 105 Q54 87 50 67 Z" className="fill-white/5 stroke-white/20" />
        <path d="M35 60 Q30 75 32 90 Z" className="stroke-[#C5A059]/30" />
        <path d="M65 60 Q70 75 68 90 Z" className="stroke-[#C5A059]/30" />
      </svg>
    )
  },
  {
    id: 37,
    title: "Crystal Cave",
    theme: "from-indigo-950/20 to-transparent",
    desc: "Clustering sharp geometric sapphire crystal node paths glowing from within.",
    gridSpan: "col-span-1 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full stroke-current fill-none" strokeWidth="0.5">
        <polygon points="50,95 30,55 45,50 55,50 70,55" className="fill-white/[0.02] stroke-[#C5A059]/40" strokeWidth="0.75" />
        <polygon points="35,95 20,70 30,65" className="stroke-white/20" />
        <polygon points="65,95 80,70 70,65" className="stroke-white/20" />
        <circle cx="50" cy="45" r="2" className="fill-[#F5F2ED] stroke-none animate-ping" />
      </svg>
    )
  },
  {
    id: 38,
    title: "Lighthouse",
    theme: "from-amber-600/15 to-transparent",
    desc: "A beacon tower contour radiating an intense cone of searchlight over deep waters.",
    gridSpan: "col-span-1 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full stroke-current fill-none" strokeWidth="0.5">
        <rect x="42" y="50" width="16" height="50" className="fill-white/5 stroke-white/20" />
        <polygon points="50,32 58,50 42,50" className="fill-[#C5A059]/10 stroke-[#C5A059]/40" />
        {/* Rays */}
        <polygon points="50,41 0,15 0,55" className="fill-[#C5A059]/20 stroke-none" />
        <polygon points="50,41 100,15 100,55" className="fill-[#C5A059]/20 stroke-none" />
        <circle cx="50" cy="41" r="3" className="fill-white stroke-none" />
      </svg>
    )
  },
  {
    id: 39,
    title: "Secret Waterfall",
    theme: "from-teal-900/15 to-transparent",
    desc: "Perfect parallel vertical lines falling down into a swirling foam pool.",
    gridSpan: "col-span-1 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full stroke-current fill-none" strokeWidth="0.5">
        <line x1="35" y1="20" x2="35" y2="90" className="stroke-white/20" />
        <line x1="50" y1="15" x2="50" y2="90" className="stroke-[#C5A059]/40" strokeWidth="1" />
        <line x1="65" y1="20" x2="65" y2="90" className="stroke-white/20" />
        {/* Pool ripples */}
        <ellipse cx="50" cy="95" rx="25" ry="5" className="stroke-[#C5A059]/30" />
        <ellipse cx="50" cy="100" rx="35" ry="7" className="stroke-white/10" />
      </svg>
    )
  },
  {
    id: 40,
    title: "Golden Hour",
    theme: "from-[#C5A059]/20 to-transparent",
    desc: "A rich radial stardust sunset glow containing tiny bird outlines.",
    gridSpan: "col-span-1 md:col-span-2 row-span-1",
    svgMarkup: (
      <svg viewBox="0 0 100 120" className="w-full h-full fill-current">
        <circle cx="50" cy="80" r="38" className="fill-[#C5A059]/15 stroke-[#C5A059]/30" strokeWidth="0.5" />
        {/* Bird flight */}
        <path d="M35 45 Q40 40 45 45 Q50 40 55 45" stroke="#C5A059" strokeWidth="0.75" fill="none" />
        <path d="M60 30 Q63 26 66 30 Q69 26 72 30" stroke="white" strokeWidth="0.5" fill="none" className="opacity-60" />
      </svg>
    )
  }
];

export default function AIGallery() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const handleOpenItem = (item: GalleryItem) => {
    audioSynth.playChime();
    setSelectedItem(item);
  };

  const handleCloseItem = () => {
    audioSynth.playPianoNote(349.23, 1.2, 0.04); // F4 note
    setSelectedItem(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-20 select-none relative z-10">
      
      {/* Editorial Title */}
      <div className="space-y-3 mb-12 text-center">
        <span className="font-mono text-[9px] tracking-[0.35em] text-[#C5A059] uppercase block font-medium">
          Act V • Curated Masterpieces
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#F5F2ED] font-light tracking-widest uppercase">
          🎨 The Gallery of Light
        </h2>
        <p className="font-mono text-[9px] text-white/30 tracking-[0.2em] uppercase max-w-md mx-auto leading-relaxed">
          An interactive sanctuary hosting 40 hand-drawn vector illustrations. Click any locket to unlock high-fidelity details and meditational summaries.
        </p>
        <div className="w-12 h-[0.5px] bg-[#C5A059]/40 mx-auto mt-4" />
      </div>

      {/* Masonry Layout Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 items-stretch">
        {GALLERY_ITEMS.map((item) => (
          <motion.div
            key={item.id}
            onClick={() => handleOpenItem(item)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleOpenItem(item);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`View artwork of ${item.title}`}
            className={`${item.gridSpan} rounded-2xl border border-white/5 bg-[#08080a]/60 hover:border-[#C5A059]/40 transition-all duration-500 overflow-hidden group cursor-pointer relative flex flex-col justify-between p-6 shadow-xl backdrop-blur-md focus:outline-none focus:ring-1 focus:ring-[#C5A059]`}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* Background color gradient glow */}
            <div className={`absolute inset-0 bg-gradient-to-tr ${item.theme} via-transparent to-transparent opacity-30 group-hover:opacity-75 transition-opacity duration-700 pointer-events-none`} />

            {/* Sweep light glare reflection */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

            {/* Vector Illustration Header Stage */}
            <div className="w-full aspect-[5/4] flex items-center justify-center p-2 mb-4 relative z-10 text-[#C5A059]/40 group-hover:text-[#C5A059]/90 group-hover:scale-105 transition-all duration-700">
              {item.svgMarkup}
            </div>

            {/* Meta details footer */}
            <div className="border-t border-white/5 pt-3 flex justify-between items-end relative z-10">
              <div className="text-left">
                <span className="font-mono text-[7px] text-white/30 uppercase tracking-widest block mb-0.5">
                  Art {item.id.toString().padStart(2, '0')}
                </span>
                <span className="font-serif text-sm text-[#F5F2ED] font-light tracking-wide group-hover:text-[#C5A059] transition-colors">
                  {item.title}
                </span>
              </div>
              <Maximize2 className="w-3.5 h-3.5 text-white/20 group-hover:text-[#C5A059] transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* FULLSCREEN ART VIEWER MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl rounded-3xl border border-[#C5A059]/35 bg-gradient-to-b from-[#0e0e11] to-[#050505] p-8 md:p-12 relative shadow-[0_50px_100px_rgba(0,0,0,0.95)] overflow-hidden"
            >
              {/* Ornate corner line accents */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-[#C5A059]/30" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[#C5A059]/30" />

              {/* Close button */}
              <button
                onClick={handleCloseItem}
                className="absolute top-6 right-6 p-2 rounded-full border border-white/10 bg-white/5 text-white/50 hover:text-[#C5A059] transition-colors cursor-pointer"
                aria-label="Close Viewer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
                
                {/* Left Side: High Fidelity Vector Stage */}
                <div className="aspect-square flex items-center justify-center rounded-2xl bg-black/40 border border-white/5 p-6 text-[#C5A059] relative overflow-hidden shadow-inner">
                  <div className={`absolute inset-0 bg-gradient-to-tr ${selectedItem.theme} opacity-40`} />
                  <div className="relative z-10 w-full h-full flex items-center justify-center scale-110">
                    {selectedItem.svgMarkup}
                  </div>
                </div>

                {/* Right Side: Editorial Prose */}
                <div className="flex flex-col text-left justify-between space-y-6">
                  <div className="space-y-3">
                    <span className="font-mono text-[9px] tracking-[0.25em] text-[#C5A059] uppercase block font-medium">
                      Exhibition Item {selectedItem.id.toString().padStart(2, '0')}
                    </span>
                    <h3 className="font-serif text-3xl text-[#F5F2ED] font-light tracking-wide leading-tight">
                      {selectedItem.title}
                    </h3>
                    <div className="w-12 h-[0.5px] bg-[#C5A059]/40" />
                    <p className="font-serif text-sm text-white/70 leading-relaxed italic font-light">
                      "{selectedItem.desc}"
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/5 space-y-4">
                    <div className="flex items-center gap-2 text-white/40 font-mono text-[8px] uppercase tracking-widest">
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>100% Vector Rendering</span>
                    </div>
                    <button
                      onClick={handleCloseItem}
                      className="w-full py-3 rounded-xl border border-[#C5A059]/30 bg-[#C5A059]/5 text-[#C5A059] font-mono text-[9px] tracking-[0.2em] uppercase transition-all hover:bg-[#C5A059]/10 cursor-pointer text-center"
                    >
                      Close Exhibition
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
