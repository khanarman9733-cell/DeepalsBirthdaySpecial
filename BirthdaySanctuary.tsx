import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Sparkles, Clock, Star, Volume2, VolumeX, Eye, ArrowRight, Heart } from "lucide-react";
import { audioSynth } from "./AudioSynth";
import { audioManager } from "./AudioManager";
import { DAILY_MESSAGES } from "../data/dailyData";
import WishTree from "./WishTree";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  type: "gold" | "petal" | "firework" | "butterfly" | "star";
  angle?: number;
  spin?: number;
  swingSpeed?: number;
  swingRange?: number;
  swingSeed?: number;
}

interface StarNode {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  alpha: number;
}

export default function BirthdaySanctuary() {
  const [nowDate, setNowDate] = useState(new Date());
  const [phase, setPhase] = useState<"countdown" | "cinematic_fade" | "heartbeat" | "explosion" | "celebration" | "forever">("countdown");
  const [isMuted, setIsMuted] = useState(true);
  const [currentWish, setCurrentWish] = useState<string | null>(null);
  const [unlockedByTarget, setUnlockedByTarget] = useState(false);

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // References for Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Audio Context check
  useEffect(() => {
    audioSynth.setMute(isMuted);
  }, [isMuted]);

  // Target Date: 31 July 2026, 00:00:00 in Local Time
  const targetDate = new Date(2026, 6, 31, 0, 0, 0); // Note: Month is 0-indexed (6 is July)

  // Track if we are already in Forever Mode (previously unlocked)
  useEffect(() => {
    const isUnlockedBefore = localStorage.getItem("deepal_birthday_unlocked") === "true";
    if (isUnlockedBefore) {
      setPhase("forever");
    }
  }, []);

  // Update Countdown and detect Target Reach
  useEffect(() => {
    if (phase === "forever") return;

    const timer = setInterval(() => {
      const current = new Date();
      setNowDate(current);
      const diff = targetDate.getTime() - current.getTime();

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setUnlockedByTarget(true);
        // Automatically trigger cinematic sequence!
        triggerReveal();
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  // Triggering the sequence
  const triggerReveal = () => {
    // 1. Stop background music loop first, let things settle
    audioSynth.stopPianoLoop();
    setPhase("cinematic_fade");

    // Play low hum drone
    setTimeout(() => {
      audioSynth.playLowHum();
    }, 500);

    // 2. Slow fade to absolute darkness (2.5 seconds)
    setTimeout(() => {
      setPhase("heartbeat");
      // Double heartbeat sound
      audioSynth.playHeartbeat();
    }, 2500);

    // 3. Keep heartbeat pulsing, then a second louder heartbeat
    setTimeout(() => {
      audioSynth.playHeartbeat();
    }, 3800);

    // 4. The single golden star explodes!
    setTimeout(() => {
      setPhase("explosion");
      audioSynth.playWishRelease();
      audioSynth.playChime();
    }, 4800);

    // 5. Enter active magical celebration with soft piano loops
    setTimeout(() => {
      setPhase("celebration");
      audioManager.startBackground();
    }, 5800);
  };

  const skipToForever = () => {
    localStorage.setItem("deepal_birthday_unlocked", "true");
    setPhase("forever");
    audioManager.startBackground();
  };

  // Canvas Particle Animation Engine
  useEffect(() => {
    if (phase !== "celebration" && phase !== "forever") {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        width = window.innerWidth;
        height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    const particles: Particle[] = [];
    const constellationStars: StarNode[] = [];

    // Create target positions for Constellation Heart
    const heartNodesCount = 36;
    const heartCenterY = height * 0.38;
    const heartCenterX = width * 0.5;
    const heartScale = Math.min(width, height) * 0.22;

    for (let i = 0; i < heartNodesCount; i++) {
      const t = (i / heartNodesCount) * Math.PI * 2;
      // Parametric heart formula
      const hx = 16 * Math.sin(t) ** 3;
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

      const targetX = heartCenterX + (hx / 16) * heartScale;
      const targetY = heartCenterY + (hy / 16) * heartScale;

      const startX = Math.random() * width;
      const startY = Math.random() * height;

      constellationStars.push({
        x: startX,
        y: startY,
        targetX,
        targetY,
        size: 1.5 + Math.random() * 2,
        alpha: 0.2 + Math.random() * 0.6,
      });
    }

    // Helper functions for spawner
    const spawnGoldParticle = (x: number, y: number, spread: number = 3) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * spread + 0.5;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        size: Math.random() * 2.5 + 0.8,
        color: `rgba(${200 + Math.floor(Math.random() * 55)}, ${170 + Math.floor(Math.random() * 50)}, ${80 + Math.floor(Math.random() * 40)}, ${0.7 + Math.random() * 0.3})`,
        alpha: 1,
        life: 0,
        maxLife: 150 + Math.random() * 100,
        type: "gold",
      });
    };

    const spawnRosePetal = () => {
      particles.push({
        x: Math.random() * width,
        y: -20,
        vx: (Math.random() * 1.2 - 0.6),
        vy: Math.random() * 1.5 + 0.8,
        size: Math.random() * 5 + 4,
        color: `rgba(${230 + Math.floor(Math.random() * 25)}, ${120 + Math.floor(Math.random() * 30)}, ${140 + Math.floor(Math.random() * 30)}, ${0.6 + Math.random() * 0.4})`,
        alpha: 1,
        life: 0,
        maxLife: 300 + Math.random() * 200,
        type: "petal",
        angle: Math.random() * Math.PI * 2,
        spin: Math.random() * 0.02 - 0.01,
        swingSpeed: 0.01 + Math.random() * 0.02,
        swingRange: 20 + Math.random() * 30,
        swingSeed: Math.random() * 1000,
      });
    };

    const spawnButterfly = () => {
      particles.push({
        x: Math.random() * width,
        y: height + 20,
        vx: (Math.random() * 0.8 - 0.4),
        vy: -(Math.random() * 1.0 + 0.6),
        size: Math.random() * 4 + 3,
        color: `rgba(${197}, ${160}, ${89}, ${0.5 + Math.random() * 0.4})`,
        alpha: 1,
        life: 0,
        maxLife: 250 + Math.random() * 150,
        type: "butterfly",
        angle: Math.random() * Math.PI * 2,
        swingSpeed: 0.03 + Math.random() * 0.03,
        swingRange: 15 + Math.random() * 15,
        swingSeed: Math.random() * 1000,
      });
    };

    const spawnFirework = () => {
      const fx = Math.random() * width;
      const fy = Math.random() * (height * 0.4) + height * 0.1;
      const count = 35 + Math.floor(Math.random() * 25);
      const hues = [
        { r: 197, g: 160, b: 89 }, // Luxury Gold
        { r: 244, g: 143, b: 177 }, // Rose Pink
        { r: 144, g: 202, b: 249 }, // Celestial Blue
        { r: 255, g: 224, b: 130 }, // Cream Gold
      ];
      const hue = hues[Math.floor(Math.random() * hues.length)];

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4.5 + 1;
        particles.push({
          x: fx,
          y: fy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2 + 1,
          color: `rgba(${hue.r}, ${hue.g}, ${hue.b}, 1)`,
          alpha: 1,
          life: 0,
          maxLife: 60 + Math.random() * 40,
          type: "firework",
        });
      }
    };

    // Spawn initial particles
    if (phase === "celebration") {
      // Explode first batch at the center of screen
      for (let i = 0; i < 200; i++) {
        spawnGoldParticle(width / 2, height / 2, 8);
      }
    }

    // Firefly / Ambient star array
    const ambientStars: Array<{ x: number; y: number; size: number; speed: number; phase: number }> = [];
    for (let i = 0; i < 150; i++) {
      ambientStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        speed: 0.005 + Math.random() * 0.015,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let frameCount = 0;

    // Loop
    const loop = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      // 1. Render ambient starry background
      ambientStars.forEach((star) => {
        star.phase += star.speed;
        const pulseAlpha = 0.15 + Math.sin(star.phase) * 0.5;
        ctx.fillStyle = `rgba(245, 242, 237, ${pulseAlpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Spawn elements dynamically over time
      if (frameCount % 6 === 0) {
        spawnRosePetal();
      }
      if (frameCount % 18 === 0) {
        spawnButterfly();
      }
      if (frameCount % 120 === 0) {
        spawnFirework();
      }

      // Spawns ambient gold glitter dust
      if (Math.random() < 0.3) {
        spawnGoldParticle(Math.random() * width, Math.random() * height, 1);
      }

      // 3. Draw & update Constellation Stars
      constellationStars.forEach((star, index) => {
        // Slowly interpolate towards heart target
        const dx = star.targetX - star.x;
        const dy = star.targetY - star.y;
        star.x += dx * 0.02;
        star.y += dy * 0.02;

        ctx.fillStyle = `rgba(197, 160, 89, ${star.alpha + Math.sin(frameCount * 0.03 + index) * 0.1})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw connecting lines with faint alpha
        if (index > 0) {
          const prev = constellationStars[index - 1];
          const dist = Math.hypot(star.x - prev.x, star.y - prev.y);
          if (dist < 55) {
            ctx.strokeStyle = `rgba(197, 160, 89, ${0.12 * (1 - dist / 55)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(prev.x, prev.y);
            ctx.stroke();
          }
        }
      });

      // Connect last node to first to close the heart outline
      if (constellationStars.length > 0) {
        const first = constellationStars[0];
        const last = constellationStars[constellationStars.length - 1];
        const dist = Math.hypot(first.x - last.x, first.y - last.y);
        if (dist < 60) {
          ctx.strokeStyle = `rgba(197, 160, 89, ${0.15 * (1 - dist / 60)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(first.x, first.y);
          ctx.lineTo(last.x, last.y);
          ctx.stroke();
        }
      }

      // 4. Update and Render Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        // Apply physics based on particle type
        if (p.type === "petal") {
          p.x += p.vx + Math.sin((frameCount + (p.swingSeed || 0)) * (p.swingSpeed || 0.02)) * 0.4;
          p.y += p.vy;
          if (p.angle !== undefined && p.spin !== undefined) {
            p.angle += p.spin;
          }
        } else if (p.type === "butterfly") {
          p.x += p.vx + Math.sin((frameCount + (p.swingSeed || 0)) * (p.swingSpeed || 0.05)) * 0.7;
          p.y += p.vy;
        } else if (p.type === "firework") {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.04; // gravity drift
          p.alpha = 1 - p.life / p.maxLife;
        } else {
          // Standard gold dust drift
          p.x += p.vx;
          p.y += p.vy;
          p.alpha = 1 - p.life / p.maxLife;
        }

        // Render shapes
        ctx.save();
        ctx.globalAlpha = p.alpha;

        if (p.type === "petal") {
          // Draw organic rose petal shape
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle || 0);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(p.size, -p.size, p.size * 1.5, p.size, 0, p.size * 1.5);
          ctx.bezierCurveTo(-p.size * 1.5, p.size, -p.size, -p.size, 0, -p.size);
          ctx.closePath();
          ctx.fill();
        } else if (p.type === "butterfly") {
          // Draw organic fluttering butterfly shape
          ctx.translate(p.x, p.y);
          // Flutter motion frequency
          const wingFlap = Math.abs(Math.sin(frameCount * 0.15 + (p.swingSeed || 0)));
          ctx.fillStyle = p.color;

          // Draw wings
          ctx.beginPath();
          // Left wings
          ctx.ellipse(-p.size * 0.8 * wingFlap, -p.size * 0.5, p.size * wingFlap, p.size * 0.6, Math.PI / 6, 0, Math.PI * 2);
          ctx.ellipse(-p.size * 0.6 * wingFlap, p.size * 0.2, p.size * 0.7 * wingFlap, p.size * 0.4, -Math.PI / 6, 0, Math.PI * 2);
          // Right wings
          ctx.ellipse(p.size * 0.8 * wingFlap, -p.size * 0.5, p.size * wingFlap, p.size * 0.6, -Math.PI / 6, 0, Math.PI * 2);
          ctx.ellipse(p.size * 0.6 * wingFlap, p.size * 0.2, p.size * 0.7 * wingFlap, p.size * 0.4, Math.PI / 6, 0, Math.PI * 2);
          ctx.fill();

          // Body line
          ctx.strokeStyle = "rgba(245, 242, 237, 0.4)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(0, p.size);
          ctx.stroke();
        } else {
          // Standard circular sparkle/explosion spark
          ctx.fillStyle = p.color;
          ctx.shadowBlur = p.type === "firework" ? 5 : 2;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [phase]);

  // Handle star clicking in Forever/Final Sky Mode
  const handleStarClick = () => {
    const randomIndex = Math.floor(Math.random() * DAILY_MESSAGES.length);
    const wish = DAILY_MESSAGES[randomIndex];
    setCurrentWish(wish);
    audioSynth.playChime();
  };

  return (
    <div className="relative min-h-[600px] w-full bg-black/10 text-white overflow-hidden py-16 px-6">
      {/* Fullscreen Cinematic overlay elements */}
      <AnimatePresence>
        {phase === "cinematic_fade" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
            className="fixed inset-0 bg-[#000000] z-[100] flex items-center justify-center pointer-events-auto"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2.2, times: [0, 0.2, 0.8, 1] }}
              className="font-serif text-[#C5A059] italic text-lg tracking-widest uppercase"
            >
              The stars are aligning...
            </motion.p>
          </motion.div>
        )}

        {phase === "heartbeat" && (
          <motion.div
            initial={{ opacity: 1 }}
            className="fixed inset-0 bg-black z-[100] flex items-center justify-center pointer-events-auto"
          >
            {/* The single golden pulsing light */}
            <motion.div
              animate={{
                scale: [1, 1.4, 1.1, 1.6, 1],
                opacity: [0.6, 1, 0.7, 1, 0.6],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-200 shadow-[0_0_40px_#C5A059]"
            />
          </motion.div>
        )}

        {phase === "explosion" && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="fixed inset-0 bg-white z-[101] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Main interactive Canvas covering full background during Celebration and Forever */}
      {(phase === "celebration" || phase === "forever") && (
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />
      )}

      <div className="max-w-4xl mx-auto relative z-10 select-none">
        {/* Countdown Phase */}
        {phase === "countdown" && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-3xl bg-white/[0.01] border border-white/5 backdrop-blur-md p-8 md:p-12 text-center space-y-8 shadow-2xl overflow-hidden"
          >
            {/* Ambient gold glow glow inside card */}
            <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/5 text-[#C5A059] text-[10px] uppercase tracking-widest-plus">
                <Clock className="w-3.5 h-3.5" />
                <span>The Golden Portal</span>
              </div>
              <h2 className="font-serif text-3xl md:text-5xl text-[#F5F2ED] tracking-wide font-light">
                "Every beautiful moment is <span className="text-[#C5A059] italic font-normal">worth waiting</span> for."
              </h2>
              <p className="font-mono text-white/40 tracking-wider text-[11px] uppercase">
                See you on 31 July 2026.
              </p>
            </div>

            {/* Countdown Grid with glowing letters */}
            <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
              {[
                { label: "DAYS", value: timeLeft.days },
                { label: "HOURS", value: timeLeft.hours },
                { label: "MINUTES", value: timeLeft.minutes },
                { label: "SECONDS", value: timeLeft.seconds },
              ].map((item, idx) => (
                <div key={idx} className="relative rounded-xl border border-white/5 bg-black/20 p-4 backdrop-blur-sm shadow-inner group">
                  <span className="block font-serif text-3xl md:text-5xl text-[#C5A059] font-light tracking-wide text-shadow-gold">
                    {String(item.value).padStart(2, "0")}
                  </span>
                  <span className="block font-mono text-[9px] text-white/30 tracking-widest pt-1.5 uppercase">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Premium Lock Display */}
            <div className="border-t border-white/5 pt-8 flex flex-col items-center gap-4">
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center text-white/60 shadow-lg"
                >
                  <Lock className="w-5 h-5 text-[#C5A059]" />
                </motion.div>
                <span className="absolute inset-0 rounded-full border border-[#C5A059]/20 animate-ping pointer-events-none" />
              </div>
              <p className="font-sans text-sm text-white/60 leading-relaxed font-light max-w-md">
                The Birthday Chapter remains locked. This surprise opens automatically on 31 July 2026.
              </p>
            </div>


          </motion.div>
        )}

        {/* Celebration Sequence Phase */}
        {phase === "celebration" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-12 text-center"
          >
            {/* The Constellation Title Header */}
            <div className="space-y-3 relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="text-shadow-gold text-[#C5A059] font-serif text-3xl md:text-5xl font-light tracking-widest-plus py-2 select-none uppercase"
              >
                ✨ Happy Birthday ✨
              </motion.div>
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.8 }}
                className="font-serif text-4xl md:text-7xl text-[#F5F2ED] font-light tracking-wide italic"
              >
                Deepal Sethiya
              </motion.h1>
            </div>

            {/* Mute Control to enjoy soft synth loop */}
            <div className="flex justify-center">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="py-2 px-4 rounded-full border border-white/5 bg-black/40 backdrop-blur-md text-white/70 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-mono tracking-widest"
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>UNMUTE CELEBRATION PIANO</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#C5A059] animate-bounce" />
                    <span>MUTED</span>
                  </>
                )}
              </button>
            </div>

            {/* The Elegant Birthday Letter */}
            <div className="max-w-2xl mx-auto text-left relative rounded-3xl bg-black/60 border border-white/5 backdrop-blur-lg p-8 md:p-12 shadow-2xl space-y-6 select-text leading-relaxed">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="font-serif text-xl text-[#F5F2ED]"
              >
                Dear Deepal,
              </motion.p>

              <div className="space-y-4 font-sans text-sm md:text-base text-white/80 font-light font-sans">
                {[
                  "Today is finally here.",
                  "I wanted to create something that would stay longer than flowers or a gift.",
                  "This little universe was made with time, creativity and warm wishes.",
                  "I hope this birthday brings you peace, happiness, good health, beautiful memories and countless reasons to smile.",
                  "May your dreams grow.",
                  "May your heart stay happy.",
                  "May every new day bring something wonderful into your life.",
                ].map((sentence, idx) => (
                  <motion.p
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.0 + idx * 0.8, duration: 1.0 }}
                  >
                    {sentence}
                  </motion.p>
                ))}
              </div>

              <div className="space-y-1 border-t border-white/5 pt-6 text-right">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 8.5 }}
                  className="font-serif text-[#C5A059] italic text-base"
                >
                  With warm wishes,
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 9.2 }}
                  className="font-serif text-lg text-[#F5F2ED] tracking-wider"
                >
                  Armaan
                </motion.p>
              </div>

              <div className="pt-8 flex justify-center">
                <motion.button
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 10.2 }}
                  onClick={skipToForever}
                  className="py-3 px-8 rounded-full border border-[#C5A059]/40 bg-gradient-to-r from-[#C5A059]/10 to-transparent hover:from-[#C5A059]/20 text-white font-mono text-xs tracking-widest-plus flex items-center gap-2 group transition-all"
                >
                  <span>ENTER MEMORY SPACE</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Forever Digital Memory Space Phase */}
        {phase === "forever" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-16"
          >
            {/* Header displaying Thank You */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] text-white/40 text-[10px] uppercase tracking-widest-plus">
                <Star className="w-3 h-3 text-[#C5A059] animate-spin" />
                <span>Memory Space</span>
              </div>
              <h2 className="font-serif text-3xl md:text-5xl text-[#F5F2ED] tracking-wide font-light">
                Thank <span className="text-[#C5A059] italic font-normal">You</span> For Visiting
              </h2>
              <p className="font-mono text-[#C5A059] tracking-wider text-[11px] uppercase">
                The magical garden remains open forever.
              </p>
            </div>

            {/* Mute toggle for background soft piano loop */}
            <div className="flex justify-center">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="py-2 px-4 rounded-full border border-white/5 bg-black/40 backdrop-blur-md text-white/70 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-mono tracking-widest"
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>ACTIVATE PIANO MELODY</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#C5A059] animate-bounce" />
                    <span>MUTED</span>
                  </>
                )}
              </button>
            </div>

            {/* Interactive Final Sky (Click star for a positive wish) */}
            <div className="rounded-3xl border border-white/5 bg-black/40 backdrop-blur-md p-8 md:p-12 shadow-2xl relative overflow-hidden select-none">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="text-center space-y-6 relative z-10">
                <h3 className="font-serif text-2xl text-[#F5F2ED] font-light tracking-wide">
                  The <span className="text-[#C5A059] italic font-normal">Final Celestial</span> Sky
                </h3>
                <p className="font-sans text-sm text-white/60 leading-relaxed font-light max-w-md mx-auto">
                  Click the celestial sky button below to catch a drifting shooting star. Each star carries a warm positive wish to keep you company.
                </p>

                {/* Shooting Star Trigger Button */}
                <div className="pt-4 flex justify-center">
                  <button
                    onClick={handleStarClick}
                    className="relative py-4 px-8 rounded-full border border-[#C5A059]/40 bg-[#C5A059]/5 hover:bg-[#C5A059]/15 text-[#F5F2ED] text-xs font-mono tracking-widest transition-all duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(197,160,89,0.15)] group"
                  >
                    <Star className="w-4 h-4 text-[#C5A059] animate-pulse group-hover:scale-125 transition-transform" />
                    <span>CATCH A STAR</span>
                  </button>
                </div>

                {/* Displaying Current Wish */}
                <AnimatePresence mode="wait">
                  {currentWish && (
                    <motion.div
                      key={currentWish}
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="mt-8 p-6 rounded-2xl border border-[#C5A059]/20 bg-gradient-to-b from-[#C5A059]/5 to-transparent text-center max-w-lg mx-auto"
                    >
                      <p className="font-serif text-[#F5F2ED] italic text-lg md:text-xl leading-relaxed">
                        "{currentWish}"
                      </p>
                      <div className="flex justify-center items-center gap-1.5 mt-4">
                        <Heart className="w-3 h-3 text-rose-400 animate-pulse" />
                        <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase">
                          Celestially Yours
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* The Magical Wish Tree is integrated directly here in the Forever Space */}
            <WishTree />
          </motion.div>
        )}
      </div>
    </div>
  );
}
