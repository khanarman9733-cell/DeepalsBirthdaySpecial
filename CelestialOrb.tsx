import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Compass, Sparkles } from "lucide-react";
import { audioSynth } from "./AudioSynth";

export default function CelestialOrb() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isBirthday: false
  });

  const [clickCount, setClickCount] = useState(0);

  // Countdown timer to 31st July 2026
  useEffect(() => {
    const targetDate = new Date("July 31, 2026 00:00:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isBirthday: true });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds, isBirthday: false });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOrbClick = () => {
    setClickCount((prev) => prev + 1);
    
    // Choose a premium pentatonic scale frequency for highly pleasing musical feedback
    const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C D E G A C
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    
    // Play sound
    audioSynth.playChime();
    audioSynth.playPianoNote(randomNote, 2.8, 0.09);
  };

  return (
    <div className="relative w-full max-w-[380px] flex flex-col items-center">
      
      {/* Outer Premium Glass Frame Container */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        onClick={handleOrbClick}
        className="relative w-full aspect-[0.85] rounded-tr-[120px] rounded-bl-[50px] bg-gradient-to-b from-white/5 to-white/[0.01] border border-[#C5A059]/20 p-6 md:p-8 flex flex-col justify-between items-center shadow-[0_40px_100px_rgba(0,0,0,0.95)] overflow-hidden cursor-pointer group"
      >
        
        {/* Ambient background glow behind the locket */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.06),transparent_70%)] pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
        
        {/* Subtle decorative gold threads */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-[#C5A059]/30 rounded-tl-xl pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-[#C5A059]/30 rounded-br-xl pointer-events-none" />

        {/* Locket Header */}
        <div className="w-full flex justify-between items-center z-10">
          <span className="font-mono text-[8px] tracking-widest-plus text-white/30 uppercase">
            Orb of Intention
          </span>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
            <span className="font-mono text-[8px] tracking-widest text-[#C5A059] uppercase">
              MMXXVI
            </span>
          </div>
        </div>

        {/* Floating Rotating Celestial Rings and Core */}
        <div className="relative w-44 h-44 flex items-center justify-center my-4 z-10">
          
          {/* Ring 1: Outer Rotating Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-[#C5A059]/30 flex items-center justify-center"
          >
            {/* Tiny stardust dot on the ring */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#C5A059] shadow-[0_0_8px_#C5A059]" />
          </motion.div>

          {/* Ring 2: Counter rotating ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
            className="absolute inset-3 rounded-full border border-double border-[#C5A059]/15 flex items-center justify-center"
          />

          {/* Ring 3: Innermost golden guide */}
          <div className="absolute inset-8 rounded-full border border-white/5" />

          {/* Golden Core: Glowing Orb */}
          <motion.div
            animate={{
              scale: [1, 1.05, 0.98, 1],
              opacity: [0.8, 0.95, 0.85, 0.8]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-20 h-20 rounded-full bg-gradient-to-b from-[#C5A059]/20 to-[#8F6C27]/10 border border-[#C5A059]/45 flex items-center justify-center shadow-[0_0_30px_rgba(197,160,89,0.25),inset_0_1px_3px_rgba(255,255,255,0.2)]"
          >
            <Compass className="w-6 h-6 text-[#C5A059] group-hover:rotate-45 transition-transform duration-700 ease-out" />
          </motion.div>

          {/* Click pulse effect helper */}
          {clickCount > 0 && (
            <motion.div
              key={clickCount}
              initial={{ scale: 0.6, opacity: 0.8 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute w-12 h-12 rounded-full border border-[#C5A059] pointer-events-none"
            />
          )}
        </div>

        {/* Locket Footer - Live Countdown */}
        <div className="w-full space-y-3 z-10 text-center">
          <div className="w-12 h-[0.5px] bg-[#C5A059]/40 mx-auto" />
          
          <span className="font-mono text-[8px] tracking-widest-plus text-white/40 uppercase block">
            {timeLeft.isBirthday ? "The Celebration is Live" : "Countdown to July 31"}
          </span>

          {timeLeft.isBirthday ? (
            <div className="flex flex-col items-center justify-center py-1">
              <span className="font-serif text-lg text-[#C5A059] tracking-wider animate-pulse font-light">
                Happy Birthday Deepal!
              </span>
              <span className="font-mono text-[7px] text-white/30 tracking-widest uppercase mt-1">
                May your universe align beautifully
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 px-1">
              {/* Days */}
              <div className="flex flex-col">
                <span className="font-mono text-base md:text-lg text-[#F5F2ED] font-light tracking-wide">
                  {timeLeft.days.toString().padStart(2, "0")}
                </span>
                <span className="font-mono text-[6px] tracking-widest text-white/30 uppercase mt-0.5">
                  Days
                </span>
              </div>
              {/* Hours */}
              <div className="flex flex-col">
                <span className="font-mono text-base md:text-lg text-[#F5F2ED] font-light tracking-wide">
                  {timeLeft.hours.toString().padStart(2, "0")}
                </span>
                <span className="font-mono text-[6px] tracking-widest text-white/30 uppercase mt-0.5">
                  Hours
                </span>
              </div>
              {/* Mins */}
              <div className="flex flex-col">
                <span className="font-mono text-base md:text-lg text-[#F5F2ED] font-light tracking-wide">
                  {timeLeft.minutes.toString().padStart(2, "0")}
                </span>
                <span className="font-mono text-[6px] tracking-widest text-white/30 uppercase mt-0.5">
                  Mins
                </span>
              </div>
              {/* Secs */}
              <div className="flex flex-col">
                <span className="font-mono text-base md:text-lg text-[#C5A059] font-medium tracking-wide">
                  {timeLeft.seconds.toString().padStart(2, "0")}
                </span>
                <span className="font-mono text-[6px] tracking-widest text-white/30 uppercase mt-0.5">
                  Secs
                </span>
              </div>
            </div>
          )}

          <div className="text-[7px] font-mono tracking-widest text-white/20 uppercase pt-1">
            *Click the orb to synchronize the chords*
          </div>
        </div>

      </motion.div>
    </div>
  );
}
