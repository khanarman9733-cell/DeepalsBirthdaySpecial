import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  type: "star" | "firefly" | "gold_dust" | "heart" | "butterfly" | "lantern";
}

export default function BackgroundElements({ zoomActive = false }: { zoomActive?: boolean }) {
  const [elements, setElements] = useState<Particle[]>([]);
  const [shootingStar, setShootingStar] = useState<{ x: number; y: number; active: boolean } | null>(null);
  const [visits, setVisits] = useState<number>(1);

  useEffect(() => {
    // Safely retrieve visits from localStorage
    const storedVisits = localStorage.getItem("deepal_total_visits");
    const totalVisits = storedVisits ? parseInt(storedVisits, 10) : 1;
    setVisits(totalVisits);

    // Build static-ish celestial layers with slow animations
    const generated: Particle[] = [];
    
    // 1. Stars (Deep layer, flickering)
    for (let i = 0; i < 40; i++) {
      generated.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.5 + 0.5,
        delay: Math.random() * 10,
        duration: 4 + Math.random() * 6,
        type: "star",
      });
    }

    // 2. Fireflies (Floating, drifting green-gold)
    for (let i = 0; i < 15; i++) {
      generated.push({
        id: 100 + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 5,
        duration: 10 + Math.random() * 10,
        type: "firefly",
      });
    }

    // 3. Gold particles (Soft rising dust)
    for (let i = 0; i < 25; i++) {
      generated.push({
        id: 200 + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.8,
        delay: Math.random() * 4,
        duration: 12 + Math.random() * 12,
        type: "gold_dust",
      });
    }

    // 4. Soft floating hearts (Ultra subtle, tiny)
    for (let i = 0; i < 8; i++) {
      generated.push({
        id: 300 + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 3,
        delay: Math.random() * 6,
        duration: 15 + Math.random() * 15,
        type: "heart",
      });
    }

    // MILESTONE 3: Floating Butterflies appear
    if (totalVisits >= 3) {
      for (let i = 0; i < 6; i++) {
        generated.push({
          id: 400 + i,
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
          size: Math.random() * 12 + 14, // Larger than stars/fireflies
          delay: Math.random() * 5,
          duration: 16 + Math.random() * 12,
          type: "butterfly",
        });
      }
    }

    // MILESTONE 50: Magical floating lanterns appear
    if (totalVisits >= 50) {
      for (let i = 0; i < 5; i++) {
        generated.push({
          id: 500 + i,
          x: Math.random() * 90 + 5,
          y: Math.random() * 80 + 10,
          size: Math.random() * 16 + 18,
          delay: Math.random() * 8,
          duration: 20 + Math.random() * 15,
          type: "lantern",
        });
      }
    }

    setElements(generated);

    // MILESTONE 15: Shooting stars appear much more frequently
    const shootInterval = totalVisits >= 15 ? 8000 : 24000;

    const shootTicker = setInterval(() => {
      setShootingStar({
        x: Math.random() * 60 + 10,
        y: Math.random() * 30 + 5,
        active: true,
      });

      setTimeout(() => {
        setShootingStar(null);
      }, 1500);
    }, shootInterval + Math.random() * 6000);

    return () => clearInterval(shootTicker);
  }, []);

  // MILESTONE 100: Brightness coefficient
  const isSkyBrighter = visits >= 100;
  const glowOpacityMultiplier = isSkyBrighter ? 2.5 : 1.0;

  return (
    <motion.div
      animate={{
        scale: zoomActive ? 1.8 : 1,
        filter: zoomActive ? "brightness(1.6) blur(0.5px)" : "brightness(1) blur(0px)",
      }}
      transition={{
        duration: 3.5,
        ease: [0.16, 1, 0.3, 1], // Smooth luxury cubic easing
      }}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      {/* Absolute dark base overlay */}
      <div className="absolute inset-0 bg-[#050505]" />

      {/* Luxury color gradient drops / glow bubbles */}
      <div 
        style={{ opacity: glowOpacityMultiplier }}
        className="absolute top-1/4 left-10 w-[40vw] h-[40vw] bg-[#C5A059]/[0.015] rounded-full blur-[120px] transition-opacity duration-1000" 
      />
      <div 
        style={{ opacity: glowOpacityMultiplier }}
        className="absolute bottom-1/4 right-10 w-[50vw] h-[50vw] bg-[#8F6C27]/[0.01] rounded-full blur-[140px] transition-opacity duration-1000" 
      />
      <div 
        style={{ opacity: glowOpacityMultiplier }}
        className="absolute top-2/3 left-1/2 -translate-x-1/2 w-[60vw] h-[30vw] bg-rose-500/[0.007] rounded-full blur-[150px] transition-opacity duration-1000" 
      />

      {/* Slow Moving Cloud Layer (Aesthetic Nebula) */}
      <motion.div
        animate={{
          x: [-20, 20, -20],
          y: [-10, 10, -10],
          opacity: isSkyBrighter ? [0.06, 0.12, 0.06] : [0.03, 0.06, 0.03]
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-1/4 w-[70%] h-[50%] bg-[#C5A059] rounded-full blur-[180px] pointer-events-none transition-opacity duration-1000"
      />

      {/* MILESTONE 7: Golden Flower Blooms in the corners of the digital sky */}
      {visits >= 7 && (
        <>
          {/* Bottom Left Corner Bloom */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.35, scale: 1, rotate: 360 }}
            transition={{
              opacity: { duration: 2.0 },
              scale: { duration: 2.5, ease: "easeOut" },
              rotate: { duration: 120, repeat: Infinity, ease: "linear" }
            }}
            className="absolute bottom-6 left-6 w-32 h-32 text-[#C5A059]/30 origin-center pointer-events-none"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
              <path d="M50 15 C45 25 35 25 50 45 C65 25 55 25 50 15 Z" />
              <path d="M50 85 C45 75 35 75 50 55 C65 75 55 75 50 85 Z" />
              <path d="M15 50 C25 45 25 35 45 50 C25 65 25 55 15 50 Z" />
              <path d="M85 50 C75 45 75 35 55 50 C75 65 75 55 85 50 Z" />
              <path d="M25 25 C33 33 33 43 45 45 C33 47 33 57 25 65 Z" className="opacity-80" />
              <path d="M75 25 C67 33 67 43 55 45 C67 47 67 57 75 65 Z" className="opacity-80" />
              <circle cx="50" cy="50" r="6" className="fill-[#F5F2ED]" />
              <circle cx="50" cy="50" r="12" stroke="#C5A059" strokeWidth="1" fill="none" className="animate-ping" style={{ animationDuration: "3s" }} />
            </svg>
          </motion.div>
          {/* Top Right Corner Bloom */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.3, scale: 0.9, rotate: -360 }}
            transition={{
              opacity: { duration: 2.0 },
              scale: { duration: 2.5, ease: "easeOut" },
              rotate: { duration: 160, repeat: Infinity, ease: "linear" }
            }}
            className="absolute top-20 right-6 w-24 h-24 text-[#C5A059]/30 origin-center pointer-events-none"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
              <path d="M50 15 C45 25 35 25 50 45 C65 25 55 25 50 15 Z" />
              <path d="M50 85 C45 75 35 75 50 55 C65 75 55 75 50 85 Z" />
              <path d="M15 50 C25 45 25 35 45 50 C25 65 25 55 15 50 Z" />
              <path d="M85 50 C75 45 75 35 55 50 C75 65 75 55 85 50 Z" />
              <circle cx="50" cy="50" r="5" className="fill-[#F5F2ED]" />
            </svg>
          </motion.div>
        </>
      )}

      {/* Stars & Gold Particles Render */}
      {elements.map((el) => {
        if (el.type === "star") {
          return (
            <motion.div
              key={el.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: isSkyBrighter ? [0.2, 1.0, 0.2] : [0.1, 0.9, 0.1] }}
              transition={{
                duration: el.duration,
                repeat: Infinity,
                delay: el.delay,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                left: `${el.x}%`,
                top: `${el.y}%`,
                width: `${el.size}px`,
                height: `${el.size}px`,
              }}
              className="rounded-full bg-[#F5F2ED]"
            />
          );
        }

        if (el.type === "firefly") {
          return (
            <motion.div
              key={el.id}
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 0.6, 0.6, 0],
                x: [0, Math.random() * 40 - 20, Math.random() * 80 - 40, 0],
                y: [0, -Math.random() * 30 - 10, -Math.random() * 60 - 20, 0],
              }}
              transition={{
                duration: el.duration,
                repeat: Infinity,
                delay: el.delay,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                left: `${el.x}%`,
                top: `${el.y}%`,
                width: `${el.size}px`,
                height: `${el.size}px`,
              }}
              className="rounded-full bg-[#C5A059]/40 blur-[0.5px] shadow-[0_0_8px_#C5A059]"
            />
          );
        }

        if (el.type === "gold_dust") {
          return (
            <motion.div
              key={el.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{
                opacity: [0, 0.5, 0.5, 0],
                y: [40, -100],
                x: [0, Math.random() * 40 - 20],
              }}
              transition={{
                duration: el.duration,
                repeat: Infinity,
                delay: el.delay,
                ease: "linear",
              }}
              style={{
                position: "absolute",
                left: `${el.x}%`,
                top: `${el.y}%`,
                width: `${el.size}px`,
                height: `${el.size}px`,
              }}
              className="rounded-full bg-[#C5A059]/40"
            />
          );
        }

        if (el.type === "heart") {
          return (
            <motion.div
              key={el.id}
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{
                opacity: [0, 0.3, 0.3, 0],
                y: [20, -60],
                scale: [0.6, 1.1, 0.7],
                rotate: [0, Math.random() * 30 - 15],
              }}
              transition={{
                duration: el.duration,
                repeat: Infinity,
                delay: el.delay,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                left: `${el.x}%`,
                top: `${el.y}%`,
              }}
              className="text-[#C5A059]/20 flex items-center justify-center pointer-events-none"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </motion.div>
          );
        }

        if (el.type === "butterfly") {
          return (
            <motion.div
              key={el.id}
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 0.65, 0.65, 0],
                x: [0, Math.random() * 120 - 60, Math.random() * 240 - 120, 0],
                y: [0, -Math.random() * 80 - 20, -Math.random() * 160 - 40, 0],
              }}
              transition={{
                duration: el.duration,
                repeat: Infinity,
                delay: el.delay,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                left: `${el.x}%`,
                top: `${el.y}%`,
                width: `${el.size}px`,
                height: `${el.size}px`,
              }}
              className="pointer-events-none text-[#C5A059]/40 drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]"
            >
              <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                <path d="M12 10C11.5 6 8 4 5 4C2 4 1 6 1 9C1 14 7 15 12 19C17 15 23 14 23 9C23 6 22 4 19 4C16 4 12.5 6 12 10Z" />
                {/* Flapping wing motion embedded as a minor scale oscillation */}
                <animateTransform 
                  attributeName="transform" 
                  type="scale" 
                  values="1 1; 0.2 1; 1 1" 
                  dur="0.4s" 
                  repeatCount="indefinite" 
                />
              </svg>
            </motion.div>
          );
        }

        if (el.type === "lantern") {
          return (
            <motion.div
              key={el.id}
              initial={{ opacity: 0, y: 150 }}
              animate={{
                opacity: [0, 0.6, 0.6, 0],
                y: [150, -250],
                x: [0, Math.random() * 40 - 20],
              }}
              transition={{
                duration: el.duration,
                repeat: Infinity,
                delay: el.delay,
                ease: "linear",
              }}
              style={{
                position: "absolute",
                left: `${el.x}%`,
                top: `${el.y}%`,
                width: `${el.size}px`,
                height: `${el.size * 1.4}px`,
              }}
              className="pointer-events-none text-[#C5A059]/30 drop-shadow-[0_0_12px_rgba(197,160,89,0.6)] flex items-center justify-center"
            >
              <svg viewBox="0 0 24 34" className="w-full h-full fill-current">
                {/* Ornate lantern shape */}
                <path d="M12 2 L14 5 L18 5 L20 10 L20 24 L16 29 L8 29 L4 24 L4 10 L6 5 L10 5 Z" />
                <rect x="10" y="29" width="4" height="3" className="fill-[#8F6C27]" />
                <circle cx="12" cy="16" r="4" className="fill-white/80 animate-pulse" />
              </svg>
            </motion.div>
          );
        }

        return null;
      })}

      {/* Occasional Shooting Star Render */}
      {shootingStar && shootingStar.active && (
        <motion.div
          initial={{ x: `${shootingStar.x}%`, y: `${shootingStar.y}%`, width: 0, opacity: 1 }}
          animate={{
            x: [`${shootingStar.x}%`, `${shootingStar.x + 18}%`],
            y: [`${shootingStar.y}%`, `${shootingStar.y + 12}%`],
            width: [0, 150, 0],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            height: "1.5px",
            background: "linear-gradient(to right, rgba(245, 242, 237, 1), rgba(197, 160, 89, 0))",
            transform: "rotate(30deg)",
            transformOrigin: "left center",
          }}
          className="blur-[0.5px]"
        />
      )}
    </motion.div>
  );
}

