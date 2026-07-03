import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Volume1,
  Heart, 
  Sparkles, 
  Music,
  Disc,
  Minimize2,
  ListMusic,
  FolderOpen,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { audioSynth } from "./AudioSynth";
import { audioManager } from "./AudioManager";

export default function FloatingMusicPlayer() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [audioStates, setAudioStates] = useState(audioManager.getStates());
  const [showUploader, setShowUploader] = useState(false);
  const [localBgName, setLocalBgName] = useState("");
  const [localSpecialName, setLocalSpecialName] = useState("");

  const bgInputRef = useRef<HTMLInputElement>(null);
  const specialInputRef = useRef<HTMLInputElement>(null);

  // Subscribe to real-time audio state updates from the audio manager
  useEffect(() => {
    const unsubscribe = audioManager.subscribe(() => {
      setAudioStates(audioManager.getStates());
    });
    return unsubscribe;
  }, []);

  const {
    isBackgroundPlaying,
    isSpecialPlaying,
    isMuted,
    specialVolume,
    currentTime,
    duration,
    backgroundError,
    specialError
  } = audioStates;

  // Auto-expand uploader if audio files are missing so the user can easily drag/select them
  useEffect(() => {
    if ((backgroundError || specialError) && !isCollapsed) {
      setShowUploader(true);
    }
  }, [backgroundError, specialError, isCollapsed]);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleTogglePlay = () => {
    audioSynth.playChime();
    
    // Toggle active song depending on which one is playing
    if (audioStates.isSpecialPlaying) {
      audioManager.pauseSpecial();
    } else if (audioStates.isBackgroundPlaying) {
      audioManager.pauseBackground();
    } else {
      // Resume background by default
      audioManager.resumeBackground();
    }
  };

  const handlePlaySpecial = () => {
    audioSynth.playChime();
    audioManager.playSpecial();
  };

  const handleToggleMute = () => {
    audioSynth.playLowHum();
    audioManager.setMute(!audioStates.isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    audioManager.setSpecialVolume(vol);
    if (vol === 0) {
      audioManager.setMute(true);
    } else {
      audioManager.setMute(false);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    audioManager.seekSpecial(time);
  };

  // Load saved custom audio urls on mount
  useEffect(() => {
    const savedBgUrl = localStorage.getItem("wishverse_bg_music_url");
    const savedSpecialUrl = localStorage.getItem("wishverse_special_song_url");
    if (savedBgUrl) {
      audioManager.setBackgroundSource(savedBgUrl);
      setLocalBgName("Google Drive (Custom Background)");
    }
    
    if (audioManager.isBirthdayToday()) {
      setLocalSpecialName("Deepal's Birthday Song (Google Drive)");
    } else if (savedSpecialUrl) {
      audioManager.setSpecialSource(savedSpecialUrl);
      setLocalSpecialName("Google Drive (Custom Special Song)");
    }
  }, []);

  const [bgLinkText, setBgLinkText] = useState("");
  const [specialLinkText, setSpecialLinkText] = useState("");

  const handleApplyBgLink = () => {
    if (bgLinkText.trim()) {
      localStorage.setItem("wishverse_bg_music_url", bgLinkText.trim());
      audioManager.setBackgroundSource(bgLinkText.trim());
      setLocalBgName("Pasted Link (Background)");
      audioManager.startBackground(true);
      audioSynth.playChime();
    }
  };

  const handleApplySpecialLink = () => {
    if (specialLinkText.trim()) {
      localStorage.setItem("wishverse_special_song_url", specialLinkText.trim());
      audioManager.setSpecialSource(specialLinkText.trim());
      setLocalSpecialName("Pasted Link (Special Song)");
      audioSynth.playChime();
    }
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLocalBgName(file.name);
      const url = URL.createObjectURL(file);
      audioManager.setBackgroundSource(url);
      audioManager.startBackground(true);
      audioSynth.playChime();
    }
  };

  const handleSpecialUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLocalSpecialName(file.name);
      const url = URL.createObjectURL(file);
      audioManager.setSpecialSource(url);
      audioSynth.playChime();
    }
  };

  const isAnyPlaying = isBackgroundPlaying || isSpecialPlaying;

  return (
    <div className="fixed bottom-6 left-6 z-[100] select-none font-sans">
      <AnimatePresence mode="wait">
        {isCollapsed ? (
          /* COMPACT LOCKET / FLOATING GOLD DISC */
          <motion.button
            key="collapsed-locket"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => {
              audioSynth.playChime();
              setIsCollapsed(false);
            }}
            className="w-14 h-14 rounded-full border border-[#C5A059]/40 bg-[#050505]/95 backdrop-blur-md flex items-center justify-center relative shadow-[0_15px_35px_rgba(0,0,0,0.7)] cursor-pointer overflow-hidden group hover:border-[#C5A059] transition-all"
            title="Open Sanctuary Music Deck"
          >
            {/* Pulsing Aura */}
            {isAnyPlaying && (
              <span className="absolute inset-0 rounded-full bg-[#C5A059]/5 animate-ping pointer-events-none" />
            )}

            {/* Spinning Vinyl Disk */}
            <motion.div
              animate={{ rotate: isAnyPlaying ? 360 : 0 }}
              transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
              className="absolute inset-1.5 rounded-full border border-[#C5A059]/20 flex items-center justify-center bg-[#0d0d0f] relative"
            >
              <Disc className={`w-6 h-6 ${isSpecialPlaying ? "text-[#E6C587] animate-pulse" : isBackgroundPlaying ? "text-[#C5A059]" : "text-white/30"}`} />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-[#050505] border border-[#C5A059]/40" />
            </motion.div>

            {/* Micro Glow Dot */}
            {isAnyPlaying && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#C5A059] border border-black shadow-[0_0_8px_#C5A059]" />
            )}

            {/* Warning indicator if files are missing */}
            {(backgroundError || specialError) && (
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500/90 border border-black flex items-center justify-center text-[10px] text-black font-bold shadow-lg">
                !
              </span>
            )}
          </motion.button>
        ) : (
          /* APPLE MUSIC DESIGN SYSTEM - GLASS CONTROLLER */
          <motion.div
            key="expanded-apple-deck"
            initial={{ x: -40, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -40, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-80 rounded-3xl border border-white/10 bg-[#08080c]/90 backdrop-blur-2xl p-6 shadow-[0_30px_70px_rgba(0,0,0,0.9)] flex flex-col gap-5 relative overflow-hidden"
          >
            {/* Elegant glass details */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#C5A059]/20 rounded-tl-xl" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#C5A059]/20 rounded-br-xl" />

            {/* Title / Close Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="font-mono text-[9px] tracking-widest-plus text-[#C5A059] uppercase font-semibold">
                  Sanctuary Audio
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    audioSynth.playChime();
                    setShowUploader(!showUploader);
                  }}
                  className={`p-1 rounded-full border transition-all cursor-pointer ${
                    showUploader 
                      ? "border-[#C5A059] text-[#C5A059]" 
                      : "border-white/5 text-white/30 hover:text-white hover:border-white/20"
                  }`}
                  title="Local Audio Source Loader"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    audioSynth.playLowHum();
                    setIsCollapsed(true);
                  }}
                  className="p-1 rounded-full text-white/40 hover:text-[#C5A059] transition-all cursor-pointer"
                  title="Collapse Player"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Subtitle / Uploader Panel */}
            <AnimatePresence>
              {showUploader && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border border-[#C5A059]/30 bg-[#C5A059]/5 rounded-2xl p-4 overflow-hidden space-y-4"
                >
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-sans text-[11px] text-[#E6C587] font-medium leading-relaxed">
                        Aapke music files load karein. Aap local MP3 upload kar sakte hain ya Google Drive / Audio links paste kar sakte hain:
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Background Loop Source */}
                    <div className="space-y-1.5 border-b border-white/5 pb-3">
                      <label className="block text-[8px] font-mono uppercase text-white/50 tracking-wider">
                        1. Background Music (Looping)
                      </label>
                      
                      {/* URL input */}
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          placeholder="Paste Google Drive link..."
                          value={bgLinkText}
                          onChange={(e) => setBgLinkText(e.target.value)}
                          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-[10px] text-white/90 focus:outline-none focus:border-[#C5A059] placeholder:text-white/20 font-mono"
                        />
                        <button
                          onClick={handleApplyBgLink}
                          className="px-2.5 py-1 bg-[#C5A059]/10 border border-[#C5A059]/40 text-[#E6C587] text-[9px] font-mono rounded-lg hover:bg-[#C5A059]/20 transition-all cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-mono text-white/30 uppercase">Or</span>
                        <button
                          onClick={() => bgInputRef.current?.click()}
                          className="flex-1 py-1 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-left truncate text-[9px] font-mono text-white/60 flex items-center justify-between cursor-pointer"
                        >
                          <span className="truncate">
                            {localBgName || "Select background.mp3..."}
                          </span>
                          {localBgName ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 ml-2" />
                          ) : (
                            <FolderOpen className="w-3 h-3 text-white/30 shrink-0 ml-2" />
                          )}
                        </button>
                      </div>

                      <input
                        ref={bgInputRef}
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={handleBgUpload}
                      />
                    </div>

                    {/* Special Song Source */}
                    <div className="space-y-1.5">
                      <label className="block text-[8px] font-mono uppercase text-white/50 tracking-wider">
                        2. Special Birthday Song
                      </label>

                      {/* URL input */}
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          placeholder="Paste Google Drive link..."
                          value={specialLinkText}
                          onChange={(e) => setSpecialLinkText(e.target.value)}
                          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-[10px] text-white/90 focus:outline-none focus:border-[#C5A059] placeholder:text-white/20 font-mono"
                        />
                        <button
                          onClick={handleApplySpecialLink}
                          className="px-2.5 py-1 bg-[#C5A059]/10 border border-[#C5A059]/40 text-[#E6C587] text-[9px] font-mono rounded-lg hover:bg-[#C5A059]/20 transition-all cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-mono text-white/30 uppercase">Or</span>
                        <button
                          onClick={() => specialInputRef.current?.click()}
                          className="flex-1 py-1 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-left truncate text-[9px] font-mono text-white/60 flex items-center justify-between cursor-pointer"
                        >
                          <span className="truncate">
                            {localSpecialName || "Select special-song.mp3..."}
                          </span>
                          {localSpecialName ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 ml-2" />
                          ) : (
                            <FolderOpen className="w-3 h-3 text-white/30 shrink-0 ml-2" />
                          )}
                        </button>
                      </div>

                      <input
                        ref={specialInputRef}
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={handleSpecialUpload}
                      />
                    </div>

                    {specialError && (
                      <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-[10px] font-mono text-amber-200 leading-relaxed space-y-1">
                        <p className="font-bold text-[#C5A059] flex items-center gap-1.5 text-[11px]">
                          ⚠️ Google Drive Access Restricted
                        </p>
                        <p className="text-white/80">
                          Aapka Google Drive link private h. Isse fix karne ke liye:
                        </p>
                        <ol className="list-decimal pl-4 space-y-1 text-white/70">
                          <li>Google Drive me file par click karke <strong>Share</strong> select karein.</li>
                          <li>General Access ko <strong>"Anyone with the link"</strong> (Viewer) par change karein.</li>
                          <li>Naya link copy karke yahan paste karein.</li>
                        </ol>
                      </div>
                    )}
                  </div>

                  <p className="text-[8px] font-mono text-white/30 text-center uppercase tracking-wider">
                    Powered by Direct-Streaming Proxy
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Album Artwork & Metadata View */}
            <div className="space-y-4">
              {/* Premium Luxury Album Square Placeholder */}
              <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-[#12121e] via-[#050508] to-[#1e1a12] border border-white/5 relative overflow-hidden flex flex-col items-center justify-center shadow-inner group">
                {/* Glowing starry animated overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.05),transparent_75%)]" />
                
                {/* Visualizing particles */}
                <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
                  {isAnyPlaying && Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [-20, -120],
                        opacity: [0, 0.7, 0],
                        scale: [0.6, 1.2, 0.6]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 3 + i,
                        delay: i * 0.4,
                        ease: "linear"
                      }}
                      className="absolute w-1 h-1 rounded-full bg-[#C5A059]"
                      style={{
                        left: `${15 + i * 15}%`,
                        bottom: "10%"
                      }}
                    />
                  ))}
                </div>

                <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                  <motion.div 
                    animate={isAnyPlaying ? { scale: [1, 1.05, 1], rotate: 360 } : {}}
                    transition={isAnyPlaying ? { 
                      scale: { repeat: Infinity, duration: 2.0, ease: "easeInOut" },
                      rotate: { repeat: Infinity, duration: 24, ease: "linear" }
                    } : {}}
                    className="w-20 h-20 rounded-full bg-black border border-[#C5A059]/30 flex items-center justify-center shadow-lg relative"
                  >
                    <span className="font-serif text-2xl text-[#E6C587] font-semibold">D</span>
                    <div className="absolute w-4 h-4 rounded-full bg-[#08080c] border border-[#C5A059]/30" />
                  </motion.div>
                  
                  <div className="space-y-0.5">
                    <span className="font-mono text-[7px] uppercase tracking-widest text-[#C5A059]">Digital Souvenir</span>
                    <p className="font-serif text-xs text-white/40 italic">"Whispers of July"</p>
                  </div>
                </div>
              </div>

              {/* Title & Artist details */}
              <div className="text-center space-y-1">
                <h4 className="font-serif text-base text-[#F5F2ED] font-light tracking-wide truncate">
                  {isSpecialPlaying ? "Special Birthday Song" : isBackgroundPlaying ? "Solitude & Whispers" : "Audio Sanctuary"}
                </h4>
                <p className="font-mono text-[9px] text-white/40 uppercase tracking-widest">
                  {isSpecialPlaying ? "Handcrafted for Deepal" : isBackgroundPlaying ? "Felt Piano Ambient Suite" : "Silence"}
                </p>
              </div>
            </div>

            {/* "Play Special Song" Premium Button */}
            <div className="pt-1">
              <button
                onClick={handlePlaySpecial}
                className={`w-full py-3 rounded-xl border font-mono text-[10px] tracking-[0.2em] uppercase font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isSpecialPlaying 
                    ? "bg-[#C5A059]/10 border-[#C5A059] text-[#E6C587] shadow-[0_4px_15px_rgba(197,160,89,0.15)]"
                    : "border-[#C5A059]/40 bg-[#C5A059]/5 text-[#C5A059] hover:bg-[#C5A059]/10 hover:border-[#C5A059]"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isSpecialPlaying ? "fill-[#C5A059] text-[#C5A059] scale-110 animate-pulse" : ""}`} />
                {isSpecialPlaying ? "Playing Special Song" : "Play Special Song"}
              </button>
            </div>

            {/* Scrubbable Progress Bar (for Special Song) */}
            {isSpecialPlaying && (
              <div className="space-y-1.5 px-1 pt-1">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleProgressChange}
                  className="w-full accent-[#C5A059] h-1 bg-white/10 rounded-lg cursor-pointer appearance-none focus:outline-none"
                />
                <div className="flex justify-between text-[8px] font-mono text-white/40 uppercase tracking-widest">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            )}

            {/* Controls Bar */}
            <div className="flex flex-col gap-4 border-t border-white/5 pt-4">
              
              <div className="flex items-center justify-between">
                {/* Play/Pause Button */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleTogglePlay}
                    className="w-10 h-10 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/5 flex items-center justify-center text-[#C5A059] hover:bg-[#C5A059]/10 transition-colors cursor-pointer"
                    title={isAnyPlaying ? "Pause Playback" : "Resume Playback"}
                  >
                    {isAnyPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>

                  {/* Mute Button */}
                  <button
                    onClick={handleToggleMute}
                    className="p-2 rounded-full border border-white/10 bg-white/5 text-white/50 hover:text-[#C5A059] hover:border-[#C5A059]/30 transition-all cursor-pointer"
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                {/* Simulated Waveform state */}
                <div className="flex items-center gap-[2.5px] px-2 h-5">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: isAnyPlaying ? [4, 16, 6, 12, 4][i % 5] : 3
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.6 + (i % 3) * 0.2,
                        ease: "easeInOut"
                      }}
                      className={`w-[2px] rounded-full ${isSpecialPlaying ? "bg-[#E6C587]" : "bg-[#C5A059]/40"}`}
                    />
                  ))}
                </div>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-3 px-1">
                <button onClick={handleToggleMute} className="text-white/40 hover:text-white cursor-pointer">
                  {isMuted || specialVolume === 0 ? (
                    <VolumeX className="w-3.5 h-3.5" />
                  ) : specialVolume < 0.4 ? (
                    <Volume1 className="w-3.5 h-3.5 text-[#C5A059]" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-[#C5A059]" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={isMuted ? 0 : specialVolume}
                  onChange={handleVolumeChange}
                  className="flex-1 accent-[#C5A059] h-1 bg-white/10 rounded-lg cursor-pointer appearance-none focus:outline-none"
                />
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
