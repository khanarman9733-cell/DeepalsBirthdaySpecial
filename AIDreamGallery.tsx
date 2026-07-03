import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  BookOpen, 
  LayoutGrid, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Edit3, 
  Check, 
  X, 
  Image as ImageIcon, 
  Compass, 
  Maximize2, 
  Undo2, 
  Eye, 
  Heart 
} from "lucide-react";
import { audioSynth } from "./AudioSynth";
import { DREAM_ITEMS, DreamItem } from "../data/dreamData";

export default function AIDreamGallery() {
  // Local state initialized from localStorage if available, else fallback to standard DREAM_ITEMS
  const [items, setItems] = useState<DreamItem[]>([]);
  const [activeTab, setActiveTab] = useState<"storybook" | "grid">("storybook");
  const [categoryFilter, setCategoryFilter] = useState<"All" | "Astral" | "Ethereal" | "Magic" | "Whispers">("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Storybook view states
  const [storybookIndex, setStorybookIndex] = useState(0);
  
  // Modal / Detail state
  const [selectedItem, setSelectedItem] = useState<DreamItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editStory, setEditStory] = useState("");
  const [editPrompt, setEditPrompt] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");

  // Load and sync localStorage
  useEffect(() => {
    const saved = localStorage.getItem("deepal_dream_gallery");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        setItems(DREAM_ITEMS);
      }
    } else {
      setItems(DREAM_ITEMS);
    }
  }, []);

  // Save changes helper
  const saveToLocalStorage = (updatedItems: DreamItem[]) => {
    setItems(updatedItems);
    localStorage.setItem("deepal_dream_gallery", JSON.stringify(updatedItems));
  };

  // Sound triggering functions
  const handlePageTurn = () => {
    audioSynth.playLowHum();
  };

  const handleSelectItem = (item: DreamItem) => {
    audioSynth.playChime();
    setSelectedItem(item);
    // Sync temporary edit fields
    setEditTitle(item.title);
    setEditStory(item.story);
    setEditPrompt(item.prompt);
    setEditImageUrl(item.customImageUrl || "");
    setIsEditing(false);
  };

  // Next / Prev actions for Storybook
  const nextStory = () => {
    if (storybookIndex < items.length - 1) {
      setStorybookIndex(storybookIndex + 1);
      handlePageTurn();
    } else {
      setStorybookIndex(0); // Loop back
      handlePageTurn();
    }
  };

  const prevStory = () => {
    if (storybookIndex > 0) {
      setStorybookIndex(storybookIndex - 1);
      handlePageTurn();
    } else {
      setStorybookIndex(items.length - 1); // Loop to end
      handlePageTurn();
    }
  };

  // Submit edits
  const handleSaveEdits = () => {
    if (!selectedItem) return;

    const updated = items.map((item) => {
      if (item.id === selectedItem.id) {
        return {
          ...item,
          title: editTitle,
          story: editStory,
          prompt: editPrompt,
          customImageUrl: editImageUrl.trim() ? editImageUrl : undefined
        };
      }
      return item;
    });

    saveToLocalStorage(updated);
    audioSynth.playChime();
    setIsEditing(false);
    
    // Update active selected item view
    const currentUpdated = updated.find((i) => i.id === selectedItem.id);
    if (currentUpdated) {
      setSelectedItem(currentUpdated);
    }
  };

  // Reset a specific item back to its default story/prompt/artwork
  const handleResetItem = (id: number) => {
    const original = DREAM_ITEMS.find((item) => item.id === id);
    if (!original) return;

    const updated = items.map((item) => {
      if (item.id === id) {
        return { ...original };
      }
      return item;
    });

    saveToLocalStorage(updated);
    audioSynth.playChime();
    
    // Sync states
    setEditTitle(original.title);
    setEditStory(original.story);
    setEditPrompt(original.prompt);
    setEditImageUrl("");
    
    const currentUpdated = updated.find((i) => i.id === id);
    if (currentUpdated) {
      setSelectedItem(currentUpdated);
    }
  };

  // Filtered lists for the Grid mode
  const filteredItems = items.filter((item) => {
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.story.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Render abstract luxury vector canvas
  const renderAbstractPlaceholder = (seedColor: string, title: string, index: number) => {
    // Generate organic positions based on index
    const shapeCount = 3 + (index % 3);
    const scaleFactor = 1 + (index % 4) * 0.1;

    return (
      <div 
        className="w-full h-full relative overflow-hidden flex items-center justify-center bg-[#07070b]"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(20, 20, 35, 0.6) 0%, rgba(4, 4, 7, 0.95) 100%)`
        }}
      >
        {/* Sacred Geometry / Star Orbits */}
        <div className="absolute inset-0 flex items-center justify-center opacity-25">
          <svg viewBox="0 0 200 200" className="w-4/5 h-4/5 text-[#C5A059] animate-[spin_60s_linear_infinite]">
            <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 5" />
            {/* Constellation line links */}
            <line x1="100" y1="30" x2="100" y2="170" stroke="currentColor" strokeWidth="0.25" />
            <line x1="30" y1="100" x2="170" y2="100" stroke="currentColor" strokeWidth="0.25" />
            <polygon points="100,45 145,100 100,155 55,100" fill="none" stroke="currentColor" strokeWidth="0.25" />
          </svg>
        </div>

        {/* Ambient colored star glow */}
        <div 
          className="absolute w-44 h-44 rounded-full filter blur-[60px] opacity-20 mix-blend-screen animate-pulse"
          style={{ backgroundColor: seedColor }}
        />

        {/* Glowing floating nodes */}
        {Array.from({ length: shapeCount }).map((_, i) => {
          const rotation = i * (360 / shapeCount) + (index * 15);
          const distance = 30 + (i * 12);
          const size = 3 + (i % 3) * 2;
          return (
            <div
              key={i}
              className="absolute rounded-full shadow-[0_0_12px_currentColor]"
              style={{
                color: seedColor,
                backgroundColor: seedColor,
                width: `${size}px`,
                height: `${size}px`,
                transform: `rotate(${rotation}deg) translate(${distance}px) rotate(-${rotation}deg)`,
                opacity: 0.3 + (i * 0.15)
              }}
            />
          );
        })}

        {/* Star Sparkle Centerpiece */}
        <div className="relative flex flex-col items-center space-y-3 z-10">
          <Sparkles className="w-10 h-10 text-[#C5A059] animate-pulse" style={{ color: seedColor }} />
          <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/30 select-none">
            Dream #{index + 1}
          </span>
        </div>

        {/* Diagonal Light Sweep Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent -translate-x-full animate-[shimmer_8s_infinite] pointer-events-none" />
      </div>
    );
  };

  const currentStorybookItem = items[storybookIndex];

  return (
    <div className="py-24 px-6 md:px-16 max-w-7xl mx-auto space-y-16 select-none relative overflow-hidden">
      
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(230,197,135,0.02),transparent_70%)] pointer-events-none" />

      {/* Title & Concept Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#C5A059]/20 bg-[#0c0c14]/40 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059]">Bespoke Digital Gift</span>
        </div>
        <h2 className="font-serif text-4xl md:text-6xl font-light tracking-tight text-[#F5F2ED]">
          The AI <span className="italic gold-gradient">Dream Gallery</span>
        </h2>
        <p className="text-xs md:text-sm text-white/50 leading-relaxed font-light max-w-2xl mx-auto">
          Fifty beautiful, imaginary moments and stellar wishes handcrafted for you, Deepal. Over time, you can replace every placeholder with your own personalized AI-generated art to build your lifetime fantasy chronicle.
        </p>

        {/* Premium View Switcher */}
        <div className="flex justify-center gap-4 pt-6">
          <button
            onClick={() => { audioSynth.playLowHum(); setActiveTab("storybook"); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full border text-[10px] font-mono uppercase tracking-widest-plus transition-all duration-500 cursor-pointer ${
              activeTab === "storybook"
                ? "bg-[#C5A059] border-[#C5A059] text-[#050505] shadow-[0_4px_20px_rgba(197,160,89,0.25)]"
                : "border-white/10 bg-white/5 text-white/50 hover:text-white hover:border-white/20"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Storybook Mode
          </button>
          <button
            onClick={() => { audioSynth.playLowHum(); setActiveTab("grid"); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full border text-[10px] font-mono uppercase tracking-widest-plus transition-all duration-500 cursor-pointer ${
              activeTab === "grid"
                ? "bg-[#C5A059] border-[#C5A059] text-[#050505] shadow-[0_4px_20px_rgba(197,160,89,0.25)]"
                : "border-white/10 bg-white/5 text-white/50 hover:text-white hover:border-white/20"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Chronicle Grid
          </button>
        </div>
      </div>

      {/* STORYBOOK VIEW MODE */}
      <AnimatePresence mode="wait">
        {activeTab === "storybook" && currentStorybookItem && (
          <motion.div
            key="storybook-mode"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-5xl mx-auto"
          >
            <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.85)] grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
              
              {/* Left Side: Artwork Visualizer with Expand option */}
              <div className="lg:col-span-7 h-[300px] lg:h-auto relative group">
                {currentStorybookItem.customImageUrl ? (
                  <img
                    src={currentStorybookItem.customImageUrl}
                    alt={currentStorybookItem.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  />
                ) : (
                  renderAbstractPlaceholder(
                    currentStorybookItem.defaultSeedColor, 
                    currentStorybookItem.title, 
                    currentStorybookItem.id - 1
                  )
                )}

                {/* Stardust glow accent overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                
                {/* Visual Frame Branding */}
                <div className="absolute top-6 left-6 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: currentStorybookItem.defaultSeedColor }} />
                  <span className="font-mono text-[9px] text-white/50 uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full backdrop-blur-md border border-white/5">
                    {currentStorybookItem.category} • Wish #{currentStorybookItem.id}
                  </span>
                </div>

                {/* Maximizer overlay */}
                <button
                  onClick={() => handleSelectItem(currentStorybookItem)}
                  className="absolute bottom-6 right-6 p-3 rounded-full bg-black/60 border border-white/10 hover:border-[#C5A059] text-white hover:text-[#C5A059] opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md cursor-pointer"
                  title="Expand & Customize"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Right Side: Poetic Story description */}
              <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between space-y-8 bg-[#07070b]/90 backdrop-blur-xl relative">
                
                {/* Book design elements */}
                <div className="absolute top-0 right-12 w-[1px] h-20 bg-gradient-to-b from-[#C5A059]/20 to-transparent" />
                
                <div className="space-y-6">
                  <div className="flex items-center gap-1.5 text-[#C5A059] text-[10px] font-mono uppercase tracking-[0.25em]">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Imaginary Chronicle</span>
                  </div>
                  
                  <h3 className="font-serif text-3xl md:text-4xl text-[#F5F2ED] font-light leading-tight">
                    {currentStorybookItem.title}
                  </h3>
                  
                  <p className="font-serif italic text-white/70 text-base md:text-lg leading-relaxed font-light">
                    “{currentStorybookItem.story}”
                  </p>

                  <div className="pt-4 border-t border-white/5 space-y-2">
                    <span className="block font-mono text-[8px] uppercase tracking-widest text-[#C5A059]/60">AI Generation Prompt</span>
                    <p className="text-[11px] font-mono text-white/40 leading-relaxed font-light italic select-text">
                      {currentStorybookItem.prompt}
                    </p>
                  </div>
                </div>

                <div className="space-y-6 pt-4">
                  {/* Action row */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleSelectItem(currentStorybookItem)}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-[#C5A059]/30 hover:border-[#C5A059] bg-[#C5A059]/5 hover:bg-[#C5A059]/10 text-xs font-mono uppercase tracking-widest text-[#C5A059] transition-all duration-300 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit Wish Details
                    </button>
                  </div>

                  {/* Navigation controls */}
                  <div className="flex items-center justify-between border-t border-white/10 pt-6">
                    <button
                      onClick={prevStory}
                      className="p-3 rounded-full border border-white/10 hover:border-[#C5A059] hover:bg-white/5 transition-all duration-300 text-white/60 hover:text-[#C5A059] cursor-pointer"
                      aria-label="Previous Page"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <span className="font-mono text-xs text-white/30 tracking-widest">
                      PAGE <span className="text-[#C5A059] font-medium">{storybookIndex + 1}</span> OF {items.length}
                    </span>

                    <button
                      onClick={nextStory}
                      className="p-3 rounded-full border border-white/10 hover:border-[#C5A059] hover:bg-white/5 transition-all duration-300 text-white/60 hover:text-[#C5A059] cursor-pointer"
                      aria-label="Next Page"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHRONICLE GRID VIEW MODE */}
      <AnimatePresence mode="wait">
        {activeTab === "grid" && (
          <motion.div
            key="grid-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Search & Category filter panel */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[#08080c]/60 border border-white/5 p-4 rounded-2xl backdrop-blur-xl">
              
              {/* Categories */}
              <div className="flex flex-wrap gap-2 justify-center">
                {(["All", "Astral", "Ethereal", "Magic", "Whispers"] as const).map((cat) => {
                  const isSelected = categoryFilter === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => { audioSynth.playLowHum(); setCategoryFilter(cat); }}
                      className={`px-4 py-2 rounded-full border text-[10px] font-mono uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? "bg-[#C5A059]/20 border-[#C5A059] text-[#C5A059]"
                          : "border-white/5 bg-transparent text-white/40 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Minimal Search box */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Search 50 magical dreams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#050505]/80 border border-white/10 rounded-full pl-11 pr-5 py-2.5 text-xs font-sans tracking-wide text-white focus:outline-none focus:border-[#C5A059] transition-all"
                />
              </div>

            </div>

            {/* Results counter */}
            <div className="flex items-center justify-between px-2 text-[10px] font-mono uppercase tracking-widest text-white/30">
              <span>Displaying {filteredItems.length} of {items.length} moments</span>
              {searchQuery && <span>Filter active</span>}
            </div>

            {/* Grid Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: Math.min(index * 0.03, 0.4) }}
                  className="group rounded-2xl border border-white/5 bg-[#08080c]/40 hover:border-[#C5A059]/30 transition-all duration-500 overflow-hidden relative flex flex-col justify-between h-[340px] cursor-pointer shadow-lg backdrop-blur-md focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                >
                  {/* Top image placeholder */}
                  <div className="h-44 w-full relative overflow-hidden bg-[#050505]">
                    {item.customImageUrl ? (
                      <img
                        src={item.customImageUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                      />
                    ) : (
                      renderAbstractPlaceholder(item.defaultSeedColor, item.title, item.id - 1)
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-transparent to-transparent opacity-90" />
                    
                    <span className="absolute top-4 left-4 font-mono text-[8px] tracking-widest bg-black/60 border border-white/5 px-2.5 py-1 rounded-full text-white/60">
                      #{item.id}
                    </span>
                  </div>

                  {/* Text Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <span className="font-mono text-[8px] uppercase tracking-widest text-[#C5A059]">
                        {item.category}
                      </span>
                      <h4 className="font-serif text-lg text-white font-medium group-hover:text-[#C5A059] transition-colors line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="font-serif italic text-xs text-white/50 leading-relaxed font-light line-clamp-2">
                        “{item.story}”
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[9px] font-mono uppercase text-white/30 tracking-widest">
                      <span>Click to view</span>
                      <Maximize2 className="w-3 h-3 text-[#C5A059]/60 group-hover:text-[#C5A059] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>

                </motion.div>
              ))}
            </div>

            {/* Empty result indicator */}
            {filteredItems.length === 0 && (
              <div className="text-center py-24 space-y-4">
                <Compass className="w-12 h-12 text-[#C5A059]/40 mx-auto animate-pulse" />
                <p className="font-serif text-lg italic text-white/40">"The cosmic dust swept empty. No dreams found matching."</p>
                <button
                  onClick={() => { setSearchQuery(""); setCategoryFilter("All"); }}
                  className="px-5 py-2 rounded-full border border-white/10 text-[10px] font-mono uppercase tracking-widest text-[#C5A059] hover:bg-white/5 transition-all"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* DETAIL VIEW & CUSTOMIZATION DRAWER MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            key="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
          >
            {/* Modal Body Container */}
            <motion.div
              initial={{ scale: 0.95, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="bg-[#08080c] border border-white/10 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 min-h-[500px]"
            >
              
              {/* Left Column: Huge visual frame */}
              <div className="md:col-span-6 relative bg-black flex items-center justify-center h-[260px] md:h-auto">
                {selectedItem.customImageUrl ? (
                  <img
                    src={selectedItem.customImageUrl}
                    alt={selectedItem.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  renderAbstractPlaceholder(selectedItem.defaultSeedColor, selectedItem.title, selectedItem.id - 1)
                )}
                
                {/* Visual guidelines */}
                <div className="absolute inset-0 border-[16px] border-[#08080c] pointer-events-none" />
                <div className="absolute inset-[17px] border border-white/5 pointer-events-none" />
              </div>

              {/* Right Column: Information & Form */}
              <div className="md:col-span-6 p-8 flex flex-col justify-between space-y-6 relative">
                
                {/* Header Close triggers */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#C5A059]">
                      Chamber #{selectedItem.id} • {selectedItem.category}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-1.5 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Edit Form vs Preview Detail */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-6 max-h-[360px]">
                  {!isEditing ? (
                    /* Read Mode */
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-serif text-3xl font-light text-white leading-snug">
                          {selectedItem.title}
                        </h3>
                        <p className="font-serif italic text-base text-white/80 leading-relaxed font-light mt-3">
                          “{selectedItem.story}”
                        </p>
                      </div>

                      <div className="space-y-2 bg-[#050505]/40 p-4 rounded-xl border border-white/5">
                        <span className="block font-mono text-[8px] uppercase tracking-widest text-[#C5A059]">
                          AI Image Generation Prompt
                        </span>
                        <p className="text-xs font-mono text-white/50 leading-relaxed select-text italic">
                          {selectedItem.prompt}
                        </p>
                      </div>

                      {selectedItem.customImageUrl && (
                        <div className="text-[10px] font-mono uppercase tracking-wider text-green-400/80 flex items-center gap-1.5 bg-green-500/5 px-3 py-1.5 rounded-lg border border-green-500/10">
                          <Check className="w-3.5 h-3.5" />
                          <span>Custom AI Art Active</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Write Mode */
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="block font-mono text-[8px] uppercase tracking-widest text-[#C5A059]">
                          Wish Title
                        </label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2 text-xs font-sans tracking-wide text-white focus:outline-none focus:border-[#C5A059] transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block font-mono text-[8px] uppercase tracking-widest text-[#C5A059]">
                          Short Story / Wish Whisper
                        </label>
                        <textarea
                          rows={3}
                          value={editStory}
                          onChange={(e) => setEditStory(e.target.value)}
                          className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-serif italic text-white focus:outline-none focus:border-[#C5A059] transition-all resize-none leading-relaxed"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block font-mono text-[8px] uppercase tracking-widest text-[#C5A059]">
                          Ideal AI Generation Prompt
                        </label>
                        <textarea
                          rows={2}
                          value={editPrompt}
                          onChange={(e) => setEditPrompt(e.target.value)}
                          className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2 text-xs font-mono text-white/70 focus:outline-none focus:border-[#C5A059] transition-all resize-none leading-relaxed"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block font-mono text-[8px] uppercase tracking-widest text-[#C5A059]">
                          Custom Image URL (Paste URL of your AI Art)
                        </label>
                        <div className="relative">
                          <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/30" />
                          <input
                            type="text"
                            placeholder="https://images.unsplash.com/... or your custom link"
                            value={editImageUrl}
                            onChange={(e) => setEditImageUrl(e.target.value)}
                            className="w-full bg-[#050505] border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-xs font-sans text-white focus:outline-none focus:border-[#C5A059] transition-all"
                          />
                        </div>
                        <p className="text-[10px] text-white/30 leading-snug font-light">
                          Generate art using Midjourney, Stable Diffusion, or Gemini, upload it online, and paste the direct link here. Leave empty to use the luxury vector placeholder.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="border-t border-white/5 pt-5 flex items-center justify-between gap-3">
                  {/* Reset original data */}
                  <button
                    onClick={() => handleResetItem(selectedItem.id)}
                    className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-white/30 hover:text-red-400 transition-colors cursor-pointer"
                    title="Restore default wish text & placeholder"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    Reset Wish
                  </button>

                  <div className="flex gap-2">
                    {!isEditing ? (
                      <button
                        onClick={() => { audioSynth.playLowHum(); setIsEditing(true); }}
                        className="flex items-center gap-1.5 px-5 py-2 rounded-full border border-white/10 hover:border-[#C5A059] text-[10px] font-mono uppercase tracking-widest text-white hover:text-[#C5A059] transition-all cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Customize
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 rounded-full border border-white/5 hover:border-white/10 text-[10px] font-mono uppercase tracking-widest text-white/40 hover:text-white transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveEdits}
                          className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#C5A059] hover:bg-[#C5A059]/90 text-[10px] font-mono uppercase tracking-widest text-[#050505] font-medium transition-all cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Save Details
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
