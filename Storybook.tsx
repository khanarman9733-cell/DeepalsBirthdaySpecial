import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Book, Edit2, Check, X, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { audioSynth } from "./AudioSynth";
import StoryPage from "./StoryPage";

interface ChapterPage {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  defaultContent: string;
  imageSrc?: string;
}

const DEFAULT_CHAPTER_PAGES: ChapterPage[] = [
  {
    id: 1,
    title: "A New Chapter Begins",
    subtitle: "Act I • The Awakening",
    content: "This page can be edited later. May this brand-new chapter in your book of life be filled with moments of silent discovery, peaceful triumphs, and paths paved with golden stardust.",
    defaultContent: "This page can be edited later. May this brand-new chapter in your book of life be filled with moments of silent discovery, peaceful triumphs, and paths paved with golden stardust.",
  },
  {
    id: 2,
    title: "Jaipur ki Woh November Wali Kahani",
    subtitle: "Act II • November Memories",
    content: "It was November in Jaipur. The event management hustle brought us together, but what I remember most isn't the work—it's the way we'd sneak away, laughing, forgetting all about the deadlines. Those days, chasing memories with you, remain the sweetest part of my story.",
    defaultContent: "It was November in Jaipur. The event management hustle brought us together, but what I remember most isn't the work—it's the way we'd sneak away, laughing, forgetting all about the deadlines. Those days, chasing memories with you, remain the sweetest part of my story.",
    imageSrc: "/deepal.jpg",
  },
  {
    id: 3,
    title: "Beautiful Wishes",
    subtitle: "Act III • Golden Array",
    content: "A collection of unspoken thoughts, carried by the night wind, wishing you perpetual laughter, absolute peace of mind, and the courage to paint your sky in any color you choose.",
    defaultContent: "A collection of unspoken thoughts, carried by the night wind, wishing you perpetual laughter, absolute peace of mind, and the courage to paint your sky in any color you choose.",
  },
  {
    id: 4,
    title: "Today's Smile",
    subtitle: "Act IV • Endless Radiance",
    content: "Look back at how far you have come with gentle pride. Let your smile be the lantern that clears away the shadows, knowing you are deeply appreciated for simply being who you are.",
    defaultContent: "Look back at how far you have come with gentle pride. Let your smile be the lantern that clears away the shadows, knowing you are deeply appreciated for simply being who you are.",
  },
];

export default function Storybook() {
  const [pages, setPages] = useState<ChapterPage[]>(DEFAULT_CHAPTER_PAGES);
  const [activePageIndex, setActivePageIndex] = useState(0); // 0 = Closed cover, 1 = Ch 1 & 2, 2 = Ch 3 & 4, 3 = Back cover
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("deepal_storybook_chapters_v2");
    if (stored) {
      try {
        setPages(JSON.parse(stored));
      } catch (e) {
        // Fallback
      }
    }
  }, []);

  const handleSave = (id: number) => {
    audioSynth.playChime();
    const updated = pages.map((p) => (p.id === id ? { ...p, content: editValue } : p));
    setPages(updated);
    localStorage.setItem("deepal_storybook_chapters_v2", JSON.stringify(updated));
    setIsEditing(null);
  };

  const handleStartEdit = (page: ChapterPage) => {
    audioSynth.playPianoNote(392, 1.2, 0.05);
    setIsEditing(page.id);
    setEditValue(page.content);
  };

  const handleOpenBook = () => {
    audioSynth.playPianoNote(261.63, 2, 0.08); // middle C
    setIsOpen(true);
    setActivePageIndex(1);
  };

  const handleCloseBook = () => {
    audioSynth.playPianoNote(196, 2, 0.08); // G3
    setIsOpen(false);
    setActivePageIndex(0);
    setIsEditing(null);
  };

  const turnPageNext = () => {
    if (activePageIndex < 2) {
      audioSynth.playPianoNote(329.63, 1.5, 0.06); // E4
      setActivePageIndex(activePageIndex + 1);
      setIsEditing(null);
    } else {
      handleCloseBook();
    }
  };

  const turnPagePrev = () => {
    if (activePageIndex > 1) {
      audioSynth.playPianoNote(293.66, 1.5, 0.06); // D4
      setActivePageIndex(activePageIndex - 1);
      setIsEditing(null);
    } else {
      handleCloseBook();
    }
  };

  // Render left and right page contents for the active spread
  // spread index 1: Ch 1 (left) and Ch 2 (right)
  // spread index 2: Ch 3 (left) and Ch 4 (right)
  const leftPage = pages[(activePageIndex - 1) * 2];
  const rightPage = pages[(activePageIndex - 1) * 2 + 1];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-20 text-center select-none relative z-10">
      
      {/* Editorial Title */}
      <div className="space-y-3 mb-12">
        <span className="font-mono text-[9px] tracking-[0.35em] text-[#C5A059] uppercase block font-medium">
          Act IV • Interactive Storybook
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#F5F2ED] font-light tracking-widest uppercase">
          📖 The Book of Deepal
        </h2>
        <p className="font-mono text-[9px] text-white/30 tracking-[0.2em] uppercase max-w-md mx-auto leading-relaxed">
          Walk inside a beautiful digital storybook. Pages open naturally with premium texture, soft lighting shadows, and editable parchment panels.
        </p>
        <div className="w-12 h-[0.5px] bg-[#C5A059]/40 mx-auto mt-4" />
      </div>

      <div className="relative w-full max-w-4xl mx-auto min-h-[500px] flex items-center justify-center">
        
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* CLOSED BOOK COVER */
            <motion.div
              key="closed-cover"
              initial={{ opacity: 0, scale: 0.95, rotateY: 0 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotateY: -90 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={handleOpenBook}
              className="w-[320px] sm:w-[360px] h-[480px] rounded-r-3xl rounded-l-md border-y border-r border-[#C5A059]/30 bg-gradient-to-r from-[#141416] via-[#1a1a1d] to-[#0b0b0c] relative shadow-[10px_30px_70px_rgba(0,0,0,0.95)] cursor-pointer flex flex-col justify-between p-8 overflow-hidden group select-none origin-left transform-gpu"
              style={{ perspective: 1500 }}
            >
              {/* Gold Filigree Borders */}
              <div className="absolute top-4 left-4 right-4 bottom-4 border border-[#C5A059]/15 rounded-2xl pointer-events-none" />
              <div className="absolute top-6 left-6 right-6 bottom-6 border border-[#C5A059]/5 rounded-xl pointer-events-none" />

              {/* Spine texture highlight */}
              <div className="absolute top-0 left-0 w-3 h-full bg-gradient-to-r from-black/60 to-transparent border-r border-white/5" />

              {/* Top Ornate Logo */}
              <div className="flex flex-col items-center mt-6 relative z-10">
                <div className="w-10 h-10 rounded-full border border-[#C5A059]/30 flex items-center justify-center mb-2 bg-[#C5A059]/5">
                  <Book className="w-4 h-4 text-[#C5A059] group-hover:rotate-12 transition-transform duration-500" />
                </div>
                <span className="font-mono text-[8px] tracking-[0.3em] text-[#C5A059] uppercase block font-medium">
                  Volume I • Limited Edition
                </span>
              </div>

              {/* Main Typography */}
              <div className="space-y-2 relative z-10">
                <span className="font-mono text-[9px] tracking-[0.4em] text-white/30 uppercase block">
                  A Custom Chronicle
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl text-[#F5F2ED] font-light tracking-wide leading-tight">
                  THE STORY OF<br />
                  <span className="italic text-[#C5A059]">DEEPAL</span>
                </h3>
                <div className="w-8 h-[1px] bg-[#C5A059]/40 mx-auto mt-4" />
              </div>

              {/* Bottom Details */}
              <div className="flex flex-col items-center mb-4 relative z-10">
                <span className="font-mono text-[8px] text-[#C5A059] tracking-widest uppercase">
                  Open Chronicle
                </span>
                <span className="font-serif text-[10px] text-white/40 italic mt-1 group-hover:text-white/80 transition-colors duration-300">
                  *Tap to open custom pages*
                </span>
              </div>

              {/* Soft gold glint hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#C5A059]/0 via-[#C5A059]/[0.02] to-[#C5A059]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </motion.div>
          ) : (
            /* OPEN BOOK SPREAD */
            <motion.div
              key="open-spread"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-gradient-to-b from-[#141416] to-[#0a0a0c] rounded-3xl border border-[#C5A059]/25 shadow-[0_50px_100px_rgba(0,0,0,0.95)] relative overflow-hidden"
            >
              {/* Book Spine Shadow in the center (Visible on desktop) */}
              <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-black/40 via-black/80 to-black/40 border-x border-white/5 z-20 pointer-events-none" />

              {/* LEFT PAGE spread */}
              <div className="relative p-8 sm:p-12 min-h-[440px] flex flex-col justify-between text-left bg-gradient-to-b from-[#161619] to-[#0e0e11] border-r border-black/50 overflow-hidden transform-gpu">
                {/* Parchment texture shadow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.01),transparent_85%)] pointer-events-none" />
                
                {/* Ornate corner line */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/10" />

                <div className="space-y-6 relative z-10 pt-2">
                  <span className="font-mono text-[8px] tracking-[0.25em] text-[#C5A059] uppercase block font-medium">
                    {leftPage.subtitle}
                  </span>
                  
                  <h4 className="font-serif text-2xl text-[#F5F2ED] font-light tracking-wide leading-tight">
                    {leftPage.title}
                  </h4>
                  <div className="w-12 h-[0.5px] bg-[#C5A059]/30" />

                  {/* Left Page content is read-only illustration or editable as well */}
                  <StoryPage
                    imageSrc={leftPage.imageSrc || ""}
                    title={leftPage.title}
                    content={leftPage.content}
                  />
                  {isEditing === leftPage.id ? (
                    <div className="space-y-4">
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full h-32 p-3 bg-black/60 border border-[#C5A059]/30 rounded-lg text-xs font-serif text-[#F5F2ED] focus:outline-none focus:border-[#C5A059] leading-relaxed resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(leftPage.id)}
                          className="px-3 py-1.5 rounded bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] font-mono text-[9px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3 h-3" /> Save
                        </button>
                        <button
                          onClick={() => setIsEditing(null)}
                          className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-white/50 font-mono text-[9px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3 h-3" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="font-serif text-sm text-white/70 leading-relaxed italic font-light">
                        "{leftPage.content}"
                      </p>
                      <button
                        onClick={() => handleStartEdit(leftPage)}
                        className="inline-flex items-center gap-1 text-[#C5A059] opacity-40 hover:opacity-100 transition-opacity font-mono text-[8px] uppercase tracking-widest cursor-pointer"
                      >
                        <Edit2 className="w-2.5 h-2.5" /> Edit Page
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-6 flex justify-between items-center relative z-10 border-t border-white/5 mt-8">
                  <span className="font-mono text-[8px] text-white/30 uppercase tracking-widest">
                    Page {leftPage.id * 2 - 1}
                  </span>
                  <button
                    onClick={handleCloseBook}
                    className="font-mono text-[8px] text-white/30 hover:text-[#C5A059] transition-colors uppercase tracking-widest cursor-pointer"
                  >
                    Close Locket
                  </button>
                </div>
              </div>

              {/* RIGHT PAGE spread */}
              <div className="relative p-8 sm:p-12 min-h-[440px] flex flex-col justify-between text-left bg-gradient-to-b from-[#141416] to-[#0a0a0c] overflow-hidden transform-gpu">
                {/* Parchment texture shadow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.01),transparent_85%)] pointer-events-none" />
                
                {/* Ornate corner line */}
                <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/10" />

                <div className="space-y-6 relative z-10 pt-2">
                  <span className="font-mono text-[8px] tracking-[0.25em] text-[#C5A059] uppercase block font-medium">
                    {rightPage.subtitle}
                  </span>
                  
                  <h4 className="font-serif text-2xl text-[#F5F2ED] font-light tracking-wide leading-tight">
                    {rightPage.title}
                  </h4>
                  <div className="w-12 h-[0.5px] bg-[#C5A059]/30" />

                  {/* Right Page content is read-only illustration or editable as well */}
                  <StoryPage
                    imageSrc={rightPage.imageSrc || ""}
                    title={rightPage.title}
                    content={rightPage.content}
                  />
                  {isEditing === rightPage.id ? (
                    <div className="space-y-4">
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full h-32 p-3 bg-black/60 border border-[#C5A059]/30 rounded-lg text-xs font-serif text-[#F5F2ED] focus:outline-none focus:border-[#C5A059] leading-relaxed resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(rightPage.id)}
                          className="px-3 py-1.5 rounded bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] font-mono text-[9px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3 h-3" /> Save
                        </button>
                        <button
                          onClick={() => setIsEditing(null)}
                          className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-white/50 font-mono text-[9px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3 h-3" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="font-serif text-sm text-white/70 leading-relaxed italic font-light">
                        "{rightPage.content}"
                      </p>
                      <button
                        onClick={() => handleStartEdit(rightPage)}
                        className="inline-flex items-center gap-1 text-[#C5A059] opacity-40 hover:opacity-100 transition-opacity font-mono text-[8px] uppercase tracking-widest cursor-pointer"
                      >
                        <Edit2 className="w-2.5 h-2.5" /> Edit Page
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-6 flex justify-between items-center relative z-10 border-t border-white/5 mt-8">
                  <span className="font-mono text-[8px] text-[#C5A059] uppercase tracking-widest font-bold">
                    Deepal's Sanctuary
                  </span>
                  <span className="font-mono text-[8px] text-white/30 uppercase tracking-widest">
                    Page {rightPage.id * 2}
                  </span>
                </div>

                {/* Turn Page navigation controls positioned perfectly inside spread corners */}
                <div className="absolute bottom-4 right-1/2 translate-x-1/2 flex items-center gap-6 z-30">
                  <button
                    onClick={turnPagePrev}
                    disabled={activePageIndex === 1}
                    className="p-1.5 rounded-full border border-white/10 bg-black/40 text-white/50 hover:text-[#C5A059] hover:border-[#C5A059]/30 disabled:opacity-20 disabled:pointer-events-none cursor-pointer transition-colors duration-300"
                    title="Previous Spread"
                  >
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                  <span className="font-mono text-[8px] text-white/40 uppercase tracking-widest">
                    Spread {activePageIndex} / 2
                  </span>
                  <button
                    onClick={turnPageNext}
                    className="p-1.5 rounded-full border border-white/10 bg-black/40 text-white/50 hover:text-[#C5A059] hover:border-[#C5A059]/30 cursor-pointer transition-colors duration-300"
                    title={activePageIndex === 2 ? "Close Book" : "Next Spread"}
                  >
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
