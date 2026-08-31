import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function AudioAmbiance() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Elegant French accordion/cafe style track loop (SoundHelix light acoustic instrumental)
    audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Audio playback failed:", err);
        });
    }
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="fixed bottom-24 right-4 z-40 md:bottom-6 md:right-6">
      <div className="flex items-center gap-2 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md px-3 py-2 rounded-full border border-stone-200 dark:border-stone-800 shadow-lg">
        <button
          onClick={togglePlayback}
          className={`p-2 rounded-full flex items-center justify-center transition-all duration-300 ${
            isPlaying 
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 shadow-inner' 
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-300'
          }`}
          aria-label={isPlaying ? "Désactiver l'ambiance sonore" : "Activer l'ambiance sonore"}
          title={isPlaying ? "Désactiver l'ambiance sonore" : "Activer l'ambiance sonore"}
        >
          {isPlaying ? (
            <Volume2 className="h-4 w-4 animate-pulse" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </button>

        {isPlaying && (
          <div className="flex items-center gap-1.5 pr-1 animate-fade-in">
            <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400 select-none">
              Musique
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-600 focus:outline-none"
              title="Volume de l'ambiance sonore"
            />
          </div>
        )}
      </div>
    </div>
  );
}
