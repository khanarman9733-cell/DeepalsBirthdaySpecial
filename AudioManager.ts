/**
 * Premium Dual Music System - Audio Manager
 * Manages background.mp3 loop and special-song.mp3 playback with smooth crossfades and level adjustments.
 */

// Helper to convert Google Drive share links into server-side proxy URLs
export function convertGoogleDriveLink(url: string): string {
  if (!url) return url;
  if (url.includes("drive.google.com")) {
    // Matches /file/d/[ID]/view or similar
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `/api/audio-proxy?id=${match[1]}`;
    }
    // Matches query parameter id=[ID]
    const queryMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (queryMatch && queryMatch[1]) {
      return `/api/audio-proxy?id=${queryMatch[1]}`;
    }
  }
  return url;
}

class AudioManager {
  private backgroundAudio: HTMLAudioElement | null = null;
  private specialAudio: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private backgroundVolume: number = 0.4; // 40% volume
  private specialVolume: number = 0.6; // 60% volume for special song
  private isBackgroundPlaying: boolean = false;
  private isSpecialPlaying: boolean = false;
  private backgroundError: boolean = false;
  private specialError: boolean = false;
  
  // Custom subscribers for React re-renders
  private subscribers: Set<() => void> = new Set();

  public isBirthdayToday(): boolean {
    const today = new Date();
    // July is index 6 (0-indexed: Jan=0, Feb=1, ..., Jul=6)
    const isRealBirthday = today.getMonth() === 6 && today.getDate() === 31;
    
    // Support testing query parameter: ?test_birthday=true
    const isDebugBirthday = typeof window !== "undefined" && window.location.search.includes("test_birthday=true");
    
    return isRealBirthday || isDebugBirthday;
  }

  constructor() {
    if (typeof window !== "undefined") {
      // Set default sources or load from localStorage if previously configured
      const savedBg = localStorage.getItem("wishverse_bg_music_url");
      const savedSpecial = localStorage.getItem("wishverse_special_song_url");

      let defaultBgUrl = "";
      if (this.isBirthdayToday()) {
        defaultBgUrl = convertGoogleDriveLink("https://drive.google.com/file/d/1efS_O7KwX1rYx5SaqPy3oQ8uMxsbKTAn/view?usp=sharing");
      } else {
        defaultBgUrl = convertGoogleDriveLink(savedBg || "https://drive.google.com/file/d/1zgP3v47uN37aTbO2Z9qeW_13mfxoTtLM/view?usp=drive_link");
      }
      
      let defaultSpecialUrl = "";
      if (this.isBirthdayToday()) {
        defaultSpecialUrl = convertGoogleDriveLink("https://drive.google.com/file/d/1Bfz2tXx3NW-o3q_SR_Ms3jgNdKzoea5L/view?usp=drive_link");
      } else {
        defaultSpecialUrl = convertGoogleDriveLink(savedSpecial || "https://drive.google.com/file/d/1Jb83U322HAmYGnmCkr3kHYnsVxD-MerJ/view?usp=drive_link");
      }
      
      this.backgroundAudio = new Audio();
      this.backgroundAudio.src = defaultBgUrl;
      this.backgroundAudio.loop = true;
      this.backgroundAudio.volume = 0; // Starts at 0 for smooth fade-in
      
      this.specialAudio = new Audio();
      this.specialAudio.src = defaultSpecialUrl;
      this.specialAudio.volume = this.specialVolume;

      // Event listeners to notify subscribers
      this.backgroundAudio.addEventListener("play", () => {
        this.isBackgroundPlaying = true;
        this.notify();
      });
      this.backgroundAudio.addEventListener("pause", () => {
        this.isBackgroundPlaying = false;
        this.notify();
      });
      this.backgroundAudio.addEventListener("error", () => {
        // Only trigger error if the source is not empty/placeholder
        if (this.backgroundAudio?.src && !this.backgroundAudio.src.endsWith("/undefined")) {
          this.backgroundError = true;
        }
        this.notify();
      });

      this.specialAudio.addEventListener("play", () => {
        this.isSpecialPlaying = true;
        this.notify();
      });
      this.specialAudio.addEventListener("pause", () => {
        this.isSpecialPlaying = false;
        this.notify();
      });
      this.specialAudio.addEventListener("error", () => {
        if (this.specialAudio?.src && !this.specialAudio.src.endsWith("/undefined") && !this.specialAudio.src.endsWith("special-song.mp3")) {
          this.specialError = true;
        }
        this.notify();
      });
      
      // Automatically boost background music when special song finishes
      this.specialAudio.addEventListener("ended", () => {
        this.isSpecialPlaying = false;
        this.backgroundVolume = 0.4;
        if (this.backgroundAudio) {
          this.backgroundAudio.muted = this.isMuted;
          if (this.backgroundAudio.paused) {
            this.backgroundAudio.play()
              .then(() => {
                this.fadeAudio(this.backgroundAudio!, 0.4, 2000);
              })
              .catch((e) => console.warn("Failed to play bg audio on ended:", e));
          } else {
            this.fadeAudio(this.backgroundAudio, 0.4, 2000);
          }
        }
        this.notify();
      });

      this.specialAudio.addEventListener("timeupdate", () => {
        this.notify();
      });

      this.specialAudio.addEventListener("loadedmetadata", () => {
        this.notify();
      });
    }
  }

  public subscribe(callback: () => void) {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notify() {
    this.subscribers.forEach((cb) => cb());
  }

  // Getters for Audio elements for progress/time tracking
  public getBackground() {
    return this.backgroundAudio;
  }

  public getSpecial() {
    return this.specialAudio;
  }

  public getStates() {
    return {
      isBackgroundPlaying: this.isBackgroundPlaying,
      isSpecialPlaying: this.isSpecialPlaying,
      isMuted: this.isMuted,
      specialVolume: this.specialVolume,
      currentTime: this.specialAudio ? this.specialAudio.currentTime : 0,
      duration: this.specialAudio && !isNaN(this.specialAudio.duration) ? this.specialAudio.duration : 0,
      backgroundError: this.backgroundError,
      specialError: this.specialError,
    };
  }

  // Set local browser file fallback sources
  public setBackgroundSource(src: string) {
    if (this.backgroundAudio) {
      const parsedSrc = convertGoogleDriveLink(src);
      const currentSrc = this.backgroundAudio.src;

      // Resolve parsedSrc to absolute URL to compare properly
      let resolvedParsed = parsedSrc;
      if (typeof window !== "undefined" && !parsedSrc.startsWith("http")) {
        const link = document.createElement("a");
        link.href = parsedSrc;
        resolvedParsed = link.href;
      }

      if (currentSrc !== resolvedParsed) {
        this.backgroundAudio.src = parsedSrc;
        this.backgroundError = false;
        this.notify();
      }
    }
  }

  public setSpecialSource(src: string) {
    if (this.specialAudio) {
      const parsedSrc = convertGoogleDriveLink(src);
      const currentSrc = this.specialAudio.src;

      // Resolve parsedSrc to absolute URL to compare properly
      let resolvedParsed = parsedSrc;
      if (typeof window !== "undefined" && !parsedSrc.startsWith("http")) {
        const link = document.createElement("a");
        link.href = parsedSrc;
        resolvedParsed = link.href;
      }

      if (currentSrc !== resolvedParsed) {
        this.specialAudio.src = parsedSrc;
        this.specialError = false;
        this.notify();
      }
    }
  }

  // Fade action helper
  private fadeAudio(audio: HTMLAudioElement, targetVolume: number, duration: number, onComplete?: () => void) {
    const startVolume = audio.volume;
    const diff = targetVolume - startVolume;
    const steps = 20;
    const stepTime = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const currentVol = startVolume + (diff * (currentStep / steps));
      audio.volume = Math.max(0, Math.min(1, currentVol));

      if (currentStep >= steps) {
        clearInterval(interval);
        audio.volume = targetVolume;
        if (onComplete) onComplete();
      }
    }, stepTime);
  }

  // Starts both background softly and special song fully on initial click (Begin with Soundscape)
  public initializeAudioOnUserInteraction() {
    if (this.isMuted) return;
    
    // Play background music at an extremely soft background volume (0.04) first
    if (this.backgroundAudio) {
      this.backgroundAudio.muted = this.isMuted;
      this.backgroundAudio.volume = 0;
      
      // Force reload to refresh socket connections and clear browser preloading lock
      try {
        const currentSrc = this.backgroundAudio.src;
        this.backgroundAudio.src = currentSrc;
        this.backgroundAudio.load();
      } catch (err) {
        console.warn("Failed to reload background audio on gesture:", err);
      }

      this.backgroundAudio.play()
        .then(() => {
          this.fadeAudio(this.backgroundAudio!, 0.2, 2000);
        })
        .catch((e) => {
          console.warn("Background audio play failed on init:", e);
        });
    }

    // Play special birthday song immediately at full volume
    if (this.specialAudio) {
      this.specialAudio.muted = this.isMuted;
      this.specialAudio.volume = this.specialVolume;

      // Force reload to refresh socket connections and clear browser preloading lock
      try {
        const currentSrc = this.specialAudio.src;
        this.specialAudio.src = currentSrc;
        this.specialAudio.load();
      } catch (err) {
        console.warn("Failed to reload special audio on gesture:", err);
      }

      this.specialAudio.play()
        .then(() => {
          this.isSpecialPlaying = true;
          this.notify();
        })
        .catch((e) => {
          console.warn("Special audio play failed on init:", e);
        });
    }
  }

  // Starts the background loop with a smooth 2-second fade-in
  public startBackground(forcePauseSpecial: boolean = false) {
    if (!this.backgroundAudio) return;
    
    // Do not play if muted globally
    this.backgroundAudio.muted = this.isMuted;
    
    // If the special song is currently active and playing, and we are NOT forcing a pause, we let it be
    if (this.specialAudio && !this.specialAudio.paused && !forcePauseSpecial) {
      // Make sure background is playing softly at 0.04 volume in the background as an ambient layer
      if (this.backgroundAudio.paused) {
        this.backgroundAudio.volume = 0;
        this.backgroundAudio.play()
          .then(() => {
            this.fadeAudio(this.backgroundAudio!, 0.2, 2000);
          })
          .catch((e) => {
            console.warn("Background music autoplay deferred:", e);
          });
      }
      return;
    }
    
    // Otherwise, pause special song if it's currently running
    if (this.specialAudio && !this.specialAudio.paused) {
      this.specialAudio.pause();
    }

    if (this.isBackgroundPlaying && !this.backgroundAudio.paused) return;

    this.backgroundAudio.play()
      .then(() => {
        this.fadeAudio(this.backgroundAudio!, this.backgroundVolume, 2000);
        this.isBackgroundPlaying = true;
        this.notify();
      })
      .catch((e) => {
        console.warn("Background music autoplay was deferred or blocked by browser:", e);
        try {
          this.backgroundAudio!.load();
          this.backgroundAudio!.play()
            .then(() => {
              this.fadeAudio(this.backgroundAudio!, this.backgroundVolume, 2000);
              this.isBackgroundPlaying = true;
              this.notify();
            })
            .catch((err) => console.warn("Background fallback play failed:", err));
        } catch (loadErr) {
          console.warn("Failed to reload background audio on fail:", loadErr);
        }
      });
    
    this.notify();
  }

  // Pauses background music with a smooth 1-second fade-out
  public pauseBackground() {
    if (!this.backgroundAudio || this.backgroundAudio.paused) return;

    this.fadeAudio(this.backgroundAudio, 0, 1000, () => {
      this.backgroundAudio?.pause();
      this.notify();
    });
  }

  // Plays special song, fading background music down instead of pausing
  public playSpecial() {
    if (!this.specialAudio) return;

    // Fade background music down to 20% instead of 15%
    if (this.backgroundAudio && !this.backgroundAudio.paused) {
      this.fadeAudio(this.backgroundAudio, 0.2, 1000);
    }
    
    this.playSpecialSongDirect();
  }

  private playSpecialSongDirect() {
    if (!this.specialAudio) return;
    this.specialAudio.muted = this.isMuted;
    this.specialAudio.volume = this.specialVolume;
    
    this.specialAudio.play()
      .then(() => {
        this.isSpecialPlaying = true;
        this.notify();
      })
      .catch((e) => {
        console.warn("Special song playback deferred:", e);
        try {
          this.specialAudio!.load();
          this.specialAudio!.play()
            .then(() => {
              this.isSpecialPlaying = true;
              this.notify();
            })
            .catch((err) => console.warn("Special fallback play failed:", err));
        } catch (loadErr) {
          console.warn("Failed to reload special audio on fail:", loadErr);
        }
      });
  }

  // Pauses special song
  public pauseSpecial() {
    if (!this.specialAudio || this.specialAudio.paused) return;
    this.specialAudio.pause();

    // Fade background music back up to normal volume
    if (this.backgroundAudio && !this.backgroundAudio.paused) {
      this.fadeAudio(this.backgroundAudio, this.backgroundVolume, 1000);
    }
    this.notify();
  }

  // Seek special song
  public seekSpecial(time: number) {
    if (!this.specialAudio) return;
    this.specialAudio.currentTime = time;
    this.notify();
  }

  // Volume adjuster for special song
  public setSpecialVolume(vol: number) {
    this.specialVolume = vol;
    if (this.specialAudio) {
      this.specialAudio.volume = vol;
    }
    this.notify();
  }

  // Resumes background music with a 1.5-second fade-in
  public resumeBackground() {
    if (!this.backgroundAudio) return;
    if (this.isMuted) return;

    this.backgroundAudio.muted = false;
    this.backgroundAudio.play()
      .then(() => {
        this.fadeAudio(this.backgroundAudio!, this.backgroundVolume, 1500);
      })
      .catch((e) => {
        console.warn("Failed to resume background audio:", e);
      });
    this.notify();
  }

  // Mute toggle for all audio players
  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.backgroundAudio) {
      this.backgroundAudio.muted = muted;
    }
    if (this.specialAudio) {
      this.specialAudio.muted = muted;
    }
    this.notify();
  }
}

export const audioManager = new AudioManager();
