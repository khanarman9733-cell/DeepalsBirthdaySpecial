import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X, Heart, Star, Award, Gift } from "lucide-react";
import { WELCOME_BACK_MESSAGES } from "../data/dailyData";
import { audioSynth } from "./AudioSynth";

export default function WelcomeBack() {
  const [isVisible, setIsVisible] = useState(false);
  const [visits, setVisits] = useState(1);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [milestoneUnlocked, setMilestoneUnlocked] = useState<{ title: string; desc: string; icon: any } | null>(null);

  useEffect(() => {
    // 1. Session-based visit detection
    const isSessionActive = sessionStorage.getItem("deepal_session_active");
    let currentVisits = 1;

    const storedVisits = localStorage.getItem("deepal_total_visits");
    if (storedVisits) {
      currentVisits = parseInt(storedVisits, 10);
    }

    if (!isSessionActive) {
      // New visit! Increment counter
      currentVisits += 1;
      localStorage.setItem("deepal_total_visits", currentVisits.toString());
      sessionStorage.setItem("deepal_session_active", "true");
      
      // Select welcome message based on visits/rotation
      const msgIndex = (currentVisits - 1) % WELCOME_BACK_MESSAGES.length;
      setWelcomeMessage(WELCOME_BACK_MESSAGES[msgIndex]);
      setVisits(currentVisits);
      setIsVisible(true);

      // Play soft chime cue
      setTimeout(() => {
        audioSynth.playChime();
      }, 1500);

      // Check for milestones on this new visit
      checkMilestone(currentVisits);
    } else {
      setVisits(currentVisits);
      // Even if already visited this session, we can show a subtle indicator, but we keep the card closed unless they click a profile/milestone locket.
    }
  }, []);

  const checkMilestone = (numVisits: number) => {
    if (numVisits === 3) {
      setMilestoneUnlocked({
        title: "Visit 3: Stardust Butterfly Summoned",
        desc: "A glowing, interactive stardust butterfly is now drifting across your celestial background sky.",
        icon: Heart,
      });
    } else if (numVisits === 7) {
      setMilestoneUnlocked({
        title: "Visit 7: Ornate Gold Flower Bloom",
        desc: "Elegant golden vector flowers have bloomed in the corners of your digital sky, rotating with the solar winds.",
        icon: Gift,
      });
    } else if (numVisits === 15) {
      setMilestoneUnlocked({
        title: "Visit 15: Celestial Shower Boosted",
        desc: "The cosmic energy has condensed, causing shooting stars to flash across your sky twice as frequently.",
        icon: Star,
      });
    } else if (numVisits === 30) {
      setMilestoneUnlocked({
        title: "Visit 30: Hidden Chapters Unlocked",
        desc: "A rare and beautiful celestial illustration has been added to your sanctuary gallery archives.",
        icon: Award,
      });
    } else if (numVisits === 50) {
      setMilestoneUnlocked({
        title: "Visit 50: Magic Wish Lanterns",
        desc: "Golden floating wish lanterns have begun rising slowly from the horizon into your digital sky.",
        icon: Sparkles,
      });
    } else if (numVisits === 100) {
      setMilestoneUnlocked({
        title: "Visit 100: Total Celestial Radiance",
        desc: "You have reached full alignment. The entire sky has become permanently brighter, filled with pure stardust glow.",
        icon: Sparkles,
      });
    }
  };

  const handleDismiss = () => {
    audioSynth.playPianoNote(392.00, 1.5, 0.04); // soft G note
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md rounded-3xl border border-[#C5A059]/20 bg-gradient-to-b from-[#0b0b0b] to-[#050505] p-6 md:p-8 relative shadow-[0_50px_100px_rgba(0,0,0,0.95)] select-none text-center"
          >
            {/* Ornate corners */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[#C5A059]/30" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[#C5A059]/30" />

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-white/30 hover:text-white/70 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content layout */}
            <div className="flex flex-col items-center space-y-6 pt-4">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-[#C5A059]/20 animate-spin-slow" />
                <Heart className="w-4 h-4 text-[#C5A059]" />
              </div>

              <div className="space-y-1.5">
                <span className="font-mono text-[9px] tracking-[0.3em] text-[#C5A059] uppercase block font-medium">
                  Welcome Back • Visit #{visits}
                </span>
                <h3 className="font-serif text-2xl text-[#F5F2ED] font-light tracking-wide">
                  Deepal Sethiya
                </h3>
              </div>

              <div className="w-12 h-[0.5px] bg-[#C5A059]/30" />

              <p className="font-serif text-sm text-white/70 leading-relaxed max-w-sm italic">
                "{welcomeMessage || "I'm happy to see you again. Today's surprise is waiting."}"
              </p>

              {/* Milestone Notification inside card */}
              {milestoneUnlocked && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="w-full p-4 rounded-xl border border-[#C5A059]/30 bg-[#C5A059]/5 space-y-2 text-left"
                >
                  <div className="flex items-center gap-2">
                    {React.createElement(milestoneUnlocked.icon, { className: "w-4 h-4 text-[#C5A059] flex-shrink-0 animate-bounce" })}
                    <span className="font-mono text-[9px] tracking-wider text-[#C5A059] uppercase font-bold">
                      {milestoneUnlocked.title}
                    </span>
                  </div>
                  <p className="font-serif text-[11px] text-white/55 leading-normal italic">
                    {milestoneUnlocked.desc}
                  </p>
                </motion.div>
              )}

              {/* Action Button */}
              <button
                onClick={handleDismiss}
                className="w-full py-3.5 rounded-xl border border-[#C5A059]/30 bg-[#C5A059]/5 text-[#C5A059] font-mono text-[9px] tracking-[0.2em] uppercase transition-all hover:bg-[#C5A059]/10 cursor-pointer"
              >
                Enter Sanctuary
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
