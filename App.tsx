/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Heart, Volume2, VolumeX, Compass, Anchor, Moon } from "lucide-react";
import WelcomeExperience from "./components/WelcomeExperience";
import BackgroundElements from "./components/BackgroundElements";
import LandingHero from "./components/LandingHero";
import CelestialOrb from "./components/CelestialOrb";
import TodaysSurprise from "./components/TodaysSurprise";
import DailyExperience from "./components/DailyExperience";
import ConstellationMap from "./components/ConstellationMap";
import Storybook from "./components/Storybook";
import AIGallery from "./components/AIGallery";
import AIDreamGallery from "./components/AIDreamGallery";
import ArmaanNote from "./components/ArmaanNote";
import WishRitual from "./components/WishRitual";
import { audioSynth } from "./components/AudioSynth";
import { audioManager } from "./components/AudioManager";
import WelcomeBack from "./components/WelcomeBack";
import WishJar from "./components/WishJar";
import FloatingMusicPlayer from "./components/FloatingMusicPlayer";
import BirthdaySanctuary from "./components/BirthdaySanctuary";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");
  const [giftEntered, setGiftEntered] = useState(false);
  const [zoomActive, setZoomActive] = useState(false);

  const handleOpen = (mutedState: boolean) => {
    setIsMuted(mutedState);
    setIsOpen(true);
    audioManager.setMute(mutedState);
    // Start the real Google Drive background music loop immediately upon entering
    if (!mutedState) {
      audioManager.startBackground();
    }
  };

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioSynth.setMute(nextMuted);
    audioManager.setMute(nextMuted);
    
    if (!nextMuted) {
      audioSynth.playChime();
      audioManager.startBackground();
    } else {
      audioManager.pauseBackground();
      audioManager.pauseSpecial();
    }
  };

  // Monitor scroll to update active navigation segment
  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 300;
      const sections = ["hero", "todays-surprise", "daily-experience", "constellation", "storybook", "gallery", "dream-gallery", "letter", "wish-ritual", "birthday-sanctuary"];
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  // Register gentle exit confirmation warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const msg = "Thank you for visiting. Come back tomorrow. A new surprise will be waiting.";
      e.preventDefault();
      e.returnValue = msg;
      return msg;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      audioSynth.playChime();
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen text-[#F5F2ED] font-sans selection:bg-[#C5A059]/20 selection:text-[#F5F2ED]">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="portal-gate"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <WelcomeExperience onEnter={handleOpen} />
          </motion.div>
        ) : (
          <motion.div
            key="cosmos-world"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="relative min-h-screen w-full"
          >
            {/* Immersive Animated Stars, Fireflies, and Particles background */}
            <BackgroundElements zoomActive={zoomActive} />

            <AnimatePresence mode="wait">
              {!giftEntered ? (
                <motion.div
                  key="landing-hero-container"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 1.15, filter: "blur(10px)" }}
                  transition={{ duration: 2.8, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10 w-full"
                >
                  <LandingHero
                    onEnterGift={() => {
                      setZoomActive(true);
                      setTimeout(() => {
                        setGiftEntered(true);
                        setZoomActive(false);
                      }, 3200); // Wait for the cinematic 3.2s star zoom
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="main-experience"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 2.0, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10 w-full"
                >
                  {/* Floating Welcome Back Card with visitor tracking */}
                  <WelcomeBack />
                  {/* Floating Luxury Header / Navigation */}
                  <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl bg-[#050505]/80 border border-white/10 rounded-full px-6 py-3 backdrop-blur-xl flex items-center justify-between shadow-[0_20px_50px_-10px_rgba(0,0,0,0.9)]">
                    {/* Left Brand Identity */}
                    <button 
                      onClick={() => scrollToSection("hero")}
                      className="flex items-center gap-2 text-left focus:outline-none cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-full border border-[#C5A059]/40 flex items-center justify-center bg-[#050505]">
                        <span className="font-serif text-[10px] text-[#C5A059] font-bold">D</span>
                      </div>
                      <span className="font-serif text-[11px] tracking-widest text-[#F5F2ED] uppercase">
                        Deepal • MMXXVI
                      </span>
                    </button>

                    {/* Center Menu Links */}
                    <nav className="hidden sm:flex items-center gap-4">
                      {[
                        { label: "Surprise", target: "todays-surprise" },
                        { label: "Ritual", target: "daily-experience" },
                        { label: "Star Chart", target: "constellation" },
                        { label: "Storybook", target: "storybook" },
                        { label: "Gallery", target: "gallery" },
                        { label: "Dream Gallery", target: "dream-gallery" },
                        { label: "Letter", target: "letter" },
                        { label: "Wishes", target: "wish-ritual" },
                        { label: "Sanctuary", target: "birthday-sanctuary" }
                      ].map((item) => {
                        const isActive = activeSection === item.target;
                        return (
                          <button
                            key={item.target}
                            onClick={() => scrollToSection(item.target)}
                            className={`font-mono text-[9px] tracking-widest-plus uppercase transition-colors duration-300 cursor-pointer ${
                              isActive ? "text-[#C5A059] font-medium" : "text-white/40 hover:text-[#F5F2ED]"
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </nav>

                    {/* Right Audio Controller */}
                    <button
                      onClick={toggleSound}
                      className="p-1.5 rounded-full border border-white/10 bg-white/5 text-[#F5F2ED]/60 hover:text-[#C5A059] transition-colors cursor-pointer"
                      title={isMuted ? "Unmute sounds" : "Mute sounds"}
                    >
                      {isMuted ? (
                        <VolumeX className="w-3.5 h-3.5" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 text-[#C5A059] animate-pulse" />
                      )}
                    </button>
                  </header>

                  {/* Act II: Hero Opening Title Card (Immersive UI Spec layout) */}
                  <section 
                    id="hero"
                    className="relative w-full min-h-screen flex flex-col justify-center items-center px-6 md:px-16 pt-24 select-none overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.03),transparent_70%)] pointer-events-none" />
                    
                    <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 relative">
                      
                      {/* Left Side: Typography */}
                      <div className="lg:col-span-7 flex flex-col text-left space-y-6">
                        <span className="text-[12px] uppercase tracking-[0.5em] text-[#C5A059] font-medium block">
                          Celebrating the Essence of
                        </span>
                        
                        <h1 className="font-serif text-[64px] md:text-[100px] leading-[0.85] font-light tracking-tighter text-[#F5F2ED]">
                          Deepal<br/>
                          <span className="italic ml-16 md:ml-24 gold-gradient">Sethiya</span>
                        </h1>

                        <p className="font-serif italic text-white/60 text-base md:text-lg max-w-lg pt-4 leading-relaxed font-light">
                          “May the stars always map themselves to match your courage, and may your paths always lead to gentle, radiant light.”
                        </p>

                        <div className="flex gap-4 pt-6 text-[9px] font-mono tracking-widest-plus text-white/30 uppercase">
                          <span>Respect</span>
                          <span>•</span>
                          <span>Gratitude</span>
                          <span>•</span>
                          <span>Presence</span>
                        </div>
                      </div>

                      {/* Right Side: Celestial Orb Countdown Locket */}
                      <div className="lg:col-span-5 relative w-full flex justify-center">
                        <CelestialOrb />
                      </div>

                    </div>

                    {/* Lower Section: Philosophy of Light (Glass Panel) */}
                    <div className="max-w-6xl w-full mt-16 z-10">
                      <div className="glass-panel p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex-1 text-left space-y-2">
                          <h2 className="font-serif text-xl md:text-2xl italic text-[#F5F2ED]">The Philosophy of Light</h2>
                          <p className="text-xs md:text-sm text-white/50 leading-relaxed font-light max-w-2xl">
                            Every movement in this digital sanctuary is designed to mirror the grace you bring into the world. Minimal. Intentional. Extraordinary. Built on respect, kindness, and shared silences.
                          </p>
                        </div>
                        <button
                          onClick={() => scrollToSection("constellation")}
                          className="w-24 h-24 rounded-full border border-[#C5A059]/20 flex items-center justify-center relative flex-none hover:border-[#C5A059]/50 transition-all duration-500 group cursor-pointer"
                        >
                          <div className="absolute inset-1.5 border border-[#C5A059]/40 rounded-full flex items-center justify-center group-hover:scale-95 transition-transform duration-500">
                            <div className="text-[10px] uppercase tracking-widest font-bold gold-gradient group-hover:tracking-widest-plus transition-all duration-500">
                              Enter
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Decorative bottom margin */}
                    <div className="h-16" />
                  </section>

                  {/* Act II-A: Today's Surprise */}
                  <section id="todays-surprise" className="relative z-10">
                    <TodaysSurprise />
                    <WishJar />
                  </section>

                  {/* Act II-B: Daily Experience */}
                  <section id="daily-experience" className="relative z-10">
                    <DailyExperience />
                  </section>

                  {/* Act III: Quality Constellations */}
                  <section id="constellation" className="relative z-10">
                    <ConstellationMap />
                  </section>

                  {/* Act IV: Interactive Storybook */}
                  <section id="storybook" className="relative z-10">
                    <Storybook />
                  </section>

                  {/* Act V: Curated Masterpieces (Gallery) */}
                  <section id="gallery" className="relative z-10">
                    <AIGallery />
                  </section>

                  {/* Act V-B: The AI Dream Gallery of 50 Celestial Wishes */}
                  <section id="dream-gallery" className="relative z-10">
                    <AIDreamGallery />
                  </section>

                  {/* Act V: Armaan's typographic letter of gratitude */}
                  <section id="letter" className="relative z-10">
                    <ArmaanNote />
                  </section>

                  {/* Act VI: Interactive Wish Lantern Release */}
                  <section id="wish-ritual" className="relative z-10">
                    <WishRitual />
                  </section>

                  {/* Act VII: The Final Birthday Sanctuary */}
                  <section id="birthday-sanctuary" className="relative z-10">
                    <BirthdaySanctuary />
                  </section>

                  {/* Premium Luxury Footer */}
                  <footer className="bg-[#050505] border-t border-white/10 py-16 px-6 text-center text-white/40 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto space-y-6 relative z-10 select-none">
                      <div className="flex justify-center items-center gap-2 mb-2">
                        <div className="w-8 h-[1px] bg-[#C5A059]/30" />
                        <Heart className="w-4 h-4 text-[#C5A059] animate-pulse" />
                        <div className="w-8 h-[1px] bg-[#C5A059]/30" />
                      </div>
                      
                      <h4 className="font-serif text-2xl text-[#F5F2ED] tracking-wider font-light italic">
                        Deepal, Happy Birthday.
                      </h4>
                      
                      <p className="font-sans text-[11px] leading-relaxed max-w-sm mx-auto tracking-wide font-light text-white/50">
                        This custom digital universe is completed under the silver stars of July. Made as a pure, respectful celebration of an unforgettable presence in my life.
                      </p>

                      <div className="pt-8 text-[9px] font-mono tracking-widest-plus uppercase flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 text-white/30">
                        <span>DESIGNED BY ARMAAN</span>
                        <span className="hidden sm:inline">//</span>
                        <span>EST. MMXXVI</span>
                      </div>
                    </div>
                  </footer>

                  {/* Floating Music Player */}
                  <FloatingMusicPlayer />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
