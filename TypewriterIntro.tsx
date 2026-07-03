import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

interface TypewriterIntroProps {
  onComplete: () => void;
}

const lines = [
  "Hi Deepal,",
  "This isn't something I bought.",
  "It's something I created.",
  "With patience.",
  "With creativity.",
  "And with lots of good wishes."
];

export default function TypewriterIntro({ onComplete }: TypewriterIntroProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedTexts, setDisplayedTexts] = useState<string[]>(Array(lines.length).fill(""));
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    let lineIdx = 0;
    let charIdx = 0;
    let timer: any = null;

    const typeChar = () => {
      if (lineIdx >= lines.length) {
        setIsTypingComplete(true);
        onComplete();
        return;
      }

      const fullLineText = lines[lineIdx];
      
      if (charIdx < fullLineText.length) {
        // Append next character
        setDisplayedTexts((prev) => {
          const updated = [...prev];
          updated[lineIdx] = fullLineText.slice(0, charIdx + 1);
          return updated;
        });
        charIdx++;
        // Natural speed variation for luxury organic feel
        const typingSpeed = 40 + Math.random() * 30; // 40-70ms per character
        timer = setTimeout(typeChar, typingSpeed);
      } else {
        // Line complete. Pause after every sentence!
        lineIdx++;
        charIdx = 0;
        // Pause duration: 1200ms for short, 1800ms for long sentences
        const pauseDuration = lineIdx === 1 ? 1000 : 1600;
        timer = setTimeout(typeChar, pauseDuration);
        setCurrentLineIndex(lineIdx);
      }
    };

    // Begin typing sequence after a soft initial delay
    const initialDelay = setTimeout(() => {
      typeChar();
    }, 1200);

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className="w-full max-w-lg mx-auto text-left space-y-4 font-serif select-none py-4">
      {lines.map((_, idx) => {
        const text = displayedTexts[idx];
        const isCurrentLine = idx === currentLineIndex;
        const isLineStarted = text.length > 0;

        return (
          <div key={idx} className="min-h-[28px] md:min-h-[34px] flex items-center relative">
            {isLineStarted && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className={`text-base md:text-lg tracking-wide leading-relaxed ${
                  idx === 0 
                    ? "text-[#C5A059] font-medium text-lg md:text-xl" 
                    : "text-[#F5F2ED]/70 font-light"
                }`}
              >
                {text}
                
                {/* Blink/Breathe Cursor at the current line's end */}
                {isCurrentLine && !isTypingComplete && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-block w-1.5 h-4 bg-[#C5A059] ml-1.5 rounded-sm align-middle"
                  />
                )}
              </motion.p>
            )}
          </div>
        );
      })}
    </div>
  );
}
