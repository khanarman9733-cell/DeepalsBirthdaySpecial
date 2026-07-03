import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Mail, Sparkles, RefreshCw, MailOpen } from "lucide-react";
import { audioSynth } from "./AudioSynth";

export default function ArmaanNote() {
  const [isOpen, setIsOpen] = useState(false);
  const [startTypewriter, setStartTypewriter] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const fullLines = [
    "Dear Deepal,",
    "",
    "Yaad hai Jaipur ka wo November?",
    "",
    "Event management ki wo bhag-daur... aur uss sab ke bich, tumhare saath bitaye wo lamhe.",
    "",
    "Sach kahun toh, kaam se zyada toh mujhe tumhare piche ghumna aur tumhari wo natkhat shararatein pasand thi.",
    "",
    "Tumhara wo chhota-mota gussa, kabhi kabhi ignore kar dena, aur fir wo cute sa face... sab kuch bohot pyaara hai.",
    "",
    "Boss ne alag kar diya tha, par yaadein aaj bhi taaza hain.",
    "",
    "Tumhe bas ye batana tha ki tum bohot khaas ho mere liye.",
    "",
    "Happy Birthday!",
    "",
    "Warm wishes,",
    "Armaan"
  ];

  // Typewriter effect logic
  useEffect(() => {
    if (!startTypewriter) return;

    let charIndex = 0;
    let lineIdx = 0;
    let currentTextAccumulator = "";

    const typeChar = () => {
      if (lineIdx >= fullLines.length) {
        return; // Done typing
      }

      const currentLine = fullLines[lineIdx];
      
      if (charIndex < currentLine.length) {
        const char = currentLine[charIndex];
        currentTextAccumulator += char;
        setDisplayedText(currentTextAccumulator);
        charIndex++;

        // Play soft typing click sound
        if (char !== " ") {
          audioSynth.playPianoNote(440 + Math.random() * 200, 0.05, 0.02);
        }

        setTimeout(typeChar, 35);
      } else {
        // Line completed, move to next line
        currentTextAccumulator += "\n";
        setDisplayedText(currentTextAccumulator);
        lineIdx++;
        charIndex = 0;
        setTimeout(typeChar, 250); // Delay between lines
      }
    };

    // Begin typing
    typeChar();

    return () => {
      // Cleanup
    };
  }, [startTypewriter]);

  const handleOpenLetter = () => {
    audioSynth.playChime();
    audioSynth.playPianoNote(261.63, 1.5, 0.05); // Play warm note
    setIsOpen(true);
    
    // Trigger typewriter animation after the slide-up animation completes
    setTimeout(() => {
      setStartTypewriter(true);
    }, 1200);
  };

  const handleReset = () => {
    audioSynth.playPianoNote(293.66, 1, 0.03);
    setIsOpen(false);
    setStartTypewriter(false);
    setDisplayedText("");
  };

  return (
    <section className="relative w-full min-h-screen bg-[#050505] py-28 px-6 md:px-12 flex flex-col justify-center items-center overflow-hidden border-b border-white/5 select-none">
      
      {/* Decorative ambient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.02),transparent_60%)] pointer-events-none" />
      
      {/* Editorial Frame Layout */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/20 to-transparent" />
      
      <div className="max-w-3xl w-full z-10 relative text-center">
        
        {/* Editorial Stamp */}
        <div className="text-center mb-12">
          <span className="font-mono text-[10px] tracking-widest-plus text-[#C5A059]/70 uppercase block mb-3">
            Act VI • A Note of Sincerity
          </span>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <Heart className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="font-mono text-[8px] tracking-widest-plus text-white/50 uppercase">Respect & Gratitude</span>
          </div>
        </div>

        <div className="relative min-h-[550px] flex items-center justify-center">
          
          <AnimatePresence mode="wait">
            {!isOpen ? (
              /* LUXURY SEALED ENVELOPE */
              <motion.div
                key="sealed-envelope"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-lg aspect-[1.6/1] rounded-2xl border border-[#C5A059]/30 bg-[#0d0d0f] p-8 relative shadow-[0_40px_80px_rgba(0,0,0,0.95)] flex flex-col justify-between items-center group overflow-hidden"
              >
                {/* Gold corner highlights */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[#C5A059]/20" />
                <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#C5A059]/20" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[#C5A059]/20" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[#C5A059]/20" />

                {/* Decorative postmark */}
                <div className="absolute top-6 right-8 border border-[#C5A059]/10 rounded-full w-12 h-12 flex items-center justify-center font-mono text-[6px] text-[#C5A059]/30 tracking-widest uppercase rotate-12">
                  JULY 2026
                </div>

                <div className="text-center pt-4">
                  <span className="font-mono text-[8px] text-white/30 uppercase tracking-[0.2em]">
                    STRICTLY CONFIDENTIAL
                  </span>
                  <h3 className="font-serif text-2xl text-[#F5F2ED] tracking-wide mt-2 font-light">
                    For Deepal Sethiya
                  </h3>
                </div>

                {/* Wax Seal Button */}
                <button
                  onClick={handleOpenLetter}
                  className="relative group/seal cursor-pointer focus:outline-none flex flex-col items-center"
                >
                  {/* Glowing wax seal circle */}
                  <div className="absolute -inset-3 rounded-full bg-[#C5A059]/10 blur-md group-hover/seal:bg-[#C5A059]/20 transition-all duration-500" />
                  
                  {/* Crimson Wax Seal look with Gold Stamp */}
                  <div className="w-14 h-14 rounded-full bg-[radial-gradient(ellipse_at_top_left,#9a7a35,#70531c)] border border-[#C5A059]/40 shadow-[0_4px_15px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.15)] flex items-center justify-center relative overflow-hidden">
                    <div className="w-9 h-9 rounded-full border border-white/10 bg-[#050505]/40 flex items-center justify-center shadow-inner">
                      <Mail className="w-4 h-4 text-[#C5A059]" />
                    </div>
                  </div>
                  <span className="font-mono text-[9px] text-[#C5A059] tracking-widest-plus uppercase mt-3 group-hover/seal:text-[#F5F2ED] transition-colors">
                    Open Letter
                  </span>
                </button>

                <div className="pb-2">
                  <span className="font-mono text-[8px] text-white/30 uppercase tracking-widest">
                    HAND-SEALED BY ARMAAN
                  </span>
                </div>
              </motion.div>
            ) : (
              /* OPENED UNFOLDED PARCHMENT PAPER */
              <motion.div
                key="unfolded-letter"
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-2xl bg-gradient-to-b from-[#161619] to-[#0d0d10] border border-[#C5A059]/25 rounded-3xl p-8 md:p-16 relative shadow-[0_40px_90px_-20px_rgba(0,0,0,0.95)] overflow-hidden"
              >
                {/* Simulated deckled edge / parchment shadow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.01),transparent_85%)] pointer-events-none" />

                {/* Fine gold lines forming a frame */}
                <div className="absolute inset-4 border border-white/5 pointer-events-none" />
                <div className="absolute inset-6 border border-[#C5A059]/10 pointer-events-none" />

                {/* Ornate corners */}
                <div className="absolute top-8 left-8 w-6 h-6 border-t border-l border-[#C5A059]/30" />
                <div className="absolute top-8 right-8 w-6 h-6 border-t border-r border-[#C5A059]/30" />
                <div className="absolute bottom-8 left-8 w-6 h-6 border-b border-l border-[#C5A059]/30" />
                <div className="absolute bottom-8 right-8 w-6 h-6 border-b border-r border-[#C5A059]/30" />

                {/* Letter Header */}
                <div className="flex justify-between items-center mb-8 relative z-10 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2">
                    <MailOpen className="w-4 h-4 text-[#C5A059]" />
                    <span className="font-mono text-[8px] tracking-widest text-[#C5A059] uppercase">The Sincere Chronicle</span>
                  </div>
                  <button
                    onClick={handleReset}
                    className="p-1.5 rounded-full border border-white/10 bg-white/5 text-white/40 hover:text-[#C5A059] hover:border-[#C5A059]/30 transition-all cursor-pointer"
                    title="Seal letter again"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>

                {/* Typewriter prose display container */}
                <div className="text-left font-serif min-h-[300px] whitespace-pre-wrap leading-relaxed text-[#F5F2ED]/95 tracking-wide text-base md:text-lg font-light relative z-10 pt-2 selection:bg-[#C5A059]/20">
                  {displayedText}
                  
                  {/* Cursor symbol pulsing */}
                  {startTypewriter && displayedText.length < fullLines.join("\n").length + 20 && (
                    <span className="inline-block w-1.5 h-4 bg-[#C5A059] ml-1 animate-pulse" />
                  )}
                </div>

                {/* Sign-off Seal Detail */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: startTypewriter && displayedText.length > 250 ? 1 : 0 }}
                  transition={{ duration: 1.5 }}
                  className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10"
                >
                  <span className="font-mono text-[8px] text-white/30 tracking-widest uppercase">
                    CRAFTED WITH INTENTIONALITY
                  </span>
                  <span className="font-serif text-sm text-[#C5A059] italic">
                    With warmest wishes, Armaan
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
