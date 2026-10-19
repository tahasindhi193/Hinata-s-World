import { useState, useRef, useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const FALLBACK_SONGS = [
  {
    id: 1,
    title: "Tum Se Hi",
    movie: "Jab We Met",
    artist: "Mohit Chauhan, Pritam",
    tag: "Our Special Song 🌸",
    emoji: "💖",
    src: "/songs/romantic-melody.mp3",
    lyrics: "Aadha sa vaada, aadhe se tum... Meri har khushi tum se hi hai! ✨",
    dedication:
      "Har pal jo tumhare saath guzarta hai, wahi meri zindagi ka sabse khoobsurat lamha hai.",
  },
  {
    id: 2,
    title: "Raataan Lambiyan",
    movie: "Shershaah",
    artist: "Jubin Nautiyal, Asees Kaur",
    tag: "Late Night Thoughts 🌙",
    emoji: "💌",
    src: "/songs/cozy-love-beats.mp3",
    lyrics: "Kaatan kaise raataan o saawre... Jiya nahi jaata sun baawre! 🧸",
    dedication:
      "Raat ho ya din, bas ek tumhara pyaara sa khayal mere dil mein muskurata hai.",
  },
  {
    id: 3,
    title: "Pehla Nasha",
    movie: "Jo Jeeta Wohi Sikandar",
    artist: "Udit Narayan, Sadhana Sargam",
    tag: "Timeless Romance 🌷",
    emoji: "🎀",
    src: "/songs/romantic-melody.mp3",
    lyrics: "Pehla nasha, pehla khumaar... Naya pyaar hai, naya intezaar! 🥹",
    dedication:
      "Tum meri pehli, aakhri aur hamesha ki sabse pyaari pasand ho, Meri Muskan.",
  },
  {
    id: 4,
    title: "Muskan's Cozy Melody",
    movie: "Acoustic Love Lo-Fi",
    artist: "Made Specially For You",
    tag: "Peaceful Vibing 🎧",
    emoji: "✨",
    src: "/songs/cozy-love-beats.mp3",
    lyrics: "Close your eyes, feel the peace, and know how deeply you are loved. 🌸",
    dedication:
      "Jab bhi thak jao ya udaas ho, yeh sun lena aur yaad rakhna main hamesha tumhare saath hoon.",
  },
];

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

function getYouTubeId(url) {
  if (!url) return null;
  const regExp =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

function normalizeAudioUrl(url) {
  if (!url) return "";
  const trimmed = url.trim();

  const driveMatch =
    trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (driveMatch && trimmed.includes("drive.google.com")) {
    return `https://docs.google.com/uc?export=download&id=${driveMatch[1]}`;
  }

  return trimmed;
}

function Surprise({ songs: propSongs, onBack, onNext }) {
  const [fetchedSongs, setFetchedSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [hasError, setHasError] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    if (!propSongs || propSongs.length === 0) {
      fetch(`${BACKEND_URL}/api/content`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.songs)) {
            setFetchedSongs(data.songs);
          }
        })
        .catch(() => {});
    }
  }, [propSongs]);

  const songList =
    propSongs && propSongs.length > 0
      ? propSongs
      : fetchedSongs.length > 0
      ? fetchedSongs
      : FALLBACK_SONGS;

  const safeIndex = currentSongIndex >= songList.length ? 0 : currentSongIndex;
  const activeSong = songList[safeIndex] || FALLBACK_SONGS[0];

  const youtubeId = getYouTubeId(activeSong?.src);
  const normalizedSrc = normalizeAudioUrl(activeSong?.src);

  // Sync audio source when song changes
  useEffect(() => {
    setHasError(false);
    setCurrentTime(0);
    setDuration(0);

    if (youtubeId) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      return;
    }

    if (!audioRef.current || !normalizedSrc) return;
    audioRef.current.src = normalizedSrc;
    audioRef.current.load();

    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.warn("Playback error:", err);
        setIsPlaying(false);
      });
    }
  }, [safeIndex, normalizedSrc, youtubeId]);

  // Volume & Mute handling
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (youtubeId) {
      setIsPlaying((prev) => !prev);
      setHasError(false);
      return;
    }

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setHasError(false);
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Audio play prevented:", err);
          setHasError(true);
          setIsPlaying(false);
        });
    }
  };

  const handleSelectSong = (index) => {
    if (index === safeIndex) {
      togglePlay();
    } else {
      setCurrentSongIndex(index);
      setIsPlaying(true);
    }
  };

  const handleNextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % songList.length);
  };

  const handlePrevSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + songList.length) % songList.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSongEnded = () => {
    if (isLooping) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      handleNextSong();
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section className="relative z-10 w-full max-w-[640px] rounded-3xl border border-white/95 bg-white/90 px-4 py-7 sm:px-8 sm:py-9 shadow-2xl shadow-rose-200/50 backdrop-blur-xl transition-all duration-300 overflow-hidden">
      {/* Hidden Native Audio Element for MP3 / Direct Links */}
      {!youtubeId && (
        <audio
          ref={audioRef}
          src={normalizedSrc}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleSongEnded}
          onError={() => {
            if (isPlaying) setHasError(true);
          }}
          preload="metadata"
        />
      )}

      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-44 w-72 rounded-full bg-gradient-to-b from-pink-300/35 to-transparent blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 -right-10 h-44 w-44 rounded-full bg-purple-200/30 blur-2xl"
        aria-hidden="true"
      />

      {/* Top Badge */}
      <div className="text-center mb-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-pink-100/90 via-rose-100/90 to-pink-100/90 border border-pink-200/80 text-[11px] font-bold tracking-widest text-[#be185d] uppercase shadow-xs">
          <span>🎵</span>
          <span>DEDICATED PLAYLIST FOR MUSKAN</span>
          <span>🎵</span>
        </div>
      </div>

      {/* Heading */}
      <div className="text-center mb-4 sm:mb-6">
        <h1 className="font-['Dancing_Script'] text-5xl sm:text-6xl font-bold text-[#713c55] leading-tight mb-1 drop-shadow-xs">
          Songs For <span className="text-[#dc5b8e]">My Muskan</span> 💖
        </h1>
        <p className="text-xs sm:text-sm leading-relaxed text-[#8a5d73] max-w-sm mx-auto font-medium">
          Har gaana sirf tumhari muskurahat aur tumhari pyaari si baaton ke naam
          hai. Click any track to play together! 🎶
        </p>
      </div>

      {/* --- FEATURED CUTE VINYL MUSIC PLAYER CARD --- */}
      <div className="relative mb-5 overflow-hidden rounded-3xl border border-pink-200/90 bg-gradient-to-br from-pink-50/90 via-white to-rose-50/90 p-4 sm:p-6 shadow-lg shadow-pink-100/80">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
          {/* Animated Spinning Retro-Cute Vinyl Disk */}
          <div className="relative flex-shrink-0">
            <div
              className={`relative flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-full bg-gradient-to-tr from-gray-900 via-neutral-800 to-gray-900 p-2 shadow-xl shadow-pink-300/40 transition-transform ${
                isPlaying ? "animate-[spin_4s_linear_infinite]" : "rotate-0"
              }`}
            >
              {/* Vinyl Groove Rings */}
              <div className="absolute inset-2 rounded-full border border-neutral-700/50" />
              <div className="absolute inset-4 rounded-full border border-neutral-700/40" />
              <div className="absolute inset-6 rounded-full border border-neutral-700/30" />

              {/* Center Vinyl Label */}
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#f089b0] via-[#dc5b8e] to-[#c9447a] text-white shadow-inner border border-pink-300">
                <span className="text-lg sm:text-xl">
                  {activeSong.emoji || "💖"}
                </span>
              </div>
            </div>

            {isPlaying && (
              <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-xs text-white shadow-md animate-bounce border-2 border-white">
                ♫
              </span>
            )}
          </div>

          {/* Active Song Information & Visualizer */}
          <div className="flex-1 text-center sm:text-left min-w-0 w-full">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mb-1">
              <span className="rounded-full bg-pink-100 px-2.5 py-0.5 text-[10px] font-bold text-[#dc5b8e]">
                {activeSong.tag || "Our Special Song 🌸"}
              </span>
              <span className="text-[11px] font-medium text-[#b87993]">
                {activeSong.movie}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-[#713c55] truncate">
              {activeSong.title}
            </h2>
            <p className="text-xs text-[#926a7e] mb-1 font-medium truncate">
              {activeSong.artist}
            </p>

            {activeSong.lyrics && (
              <p className="font-['Dancing_Script'] text-base sm:text-lg text-[#dc5b8e] font-bold italic leading-snug line-clamp-2">
                "{activeSong.lyrics}"
              </p>
            )}

            {/* Sound Wave Equalizer Bars */}
            <div className="mt-2 flex items-center justify-center sm:justify-start gap-1 h-3.5">
              {[40, 95, 60, 100, 75, 45, 85].map((height, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full bg-gradient-to-t from-pink-400 to-rose-500 transition-all duration-300 ${
                    isPlaying ? "animate-pulse" : "h-1 opacity-40"
                  }`}
                  style={{
                    height: isPlaying ? `${height}%` : "3px",
                    animationDelay: `${i * 120}ms`,
                  }}
                />
              ))}
              <span className="ml-2 text-[10px] sm:text-[11px] font-semibold text-[#b87993]">
                {isPlaying ? "Playing for Muskan..." : "Paused ♡"}
              </span>
            </div>
          </div>
        </div>

        {/* Embedded YouTube Player (if link is from YouTube) */}
        {youtubeId && isPlaying && (
          <div className="mt-4 overflow-hidden rounded-2xl border border-pink-200 shadow-inner">
            <iframe
              width="100%"
              height="160"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&loop=${
                isLooping ? 1 : 0
              }&playlist=${youtubeId}`}
              title={activeSong.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* --- Progress Bar (for direct MP3 links) --- */}
        {!youtubeId && (
          <div className="mt-4 space-y-1">
            <div className="relative flex items-center">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-pink-200/80 rounded-lg appearance-none cursor-pointer accent-[#dc5b8e] focus:outline-none"
                style={{
                  background: `linear-gradient(to right, #dc5b8e ${progressPercent}%, #fbcfe8 ${progressPercent}%)`,
                }}
              />
            </div>

            <div className="flex justify-between text-[10px] sm:text-[11px] font-semibold text-[#b87993]">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}

        {/* --- Main Cute Audio Controls --- */}
        <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-pink-100">
          {/* Loop toggle */}
          <button
            type="button"
            onClick={() => setIsLooping(!isLooping)}
            className={`p-2 rounded-full transition-colors cursor-pointer active:scale-95 ${
              isLooping
                ? "bg-pink-100 text-[#dc5b8e]"
                : "text-gray-400 hover:text-[#dc5b8e]"
            }`}
            title={isLooping ? "Repeat is ON" : "Repeat is OFF"}
          >
            <span className="text-sm">🔁</span>
          </button>

          {/* Center Playback Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={handlePrevSong}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 shadow-xs hover:text-[#dc5b8e] hover:shadow-md transition-all active:scale-95 cursor-pointer border border-pink-100"
              title="Previous song"
            >
              ⏮
            </button>

            <button
              type="button"
              onClick={togglePlay}
              className="flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-gradient-to-r from-[#f089b0] via-[#dc5b8e] to-[#c9447a] text-white shadow-lg shadow-pink-400/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title={isPlaying ? "Pause" : "Play"}
            >
              <span className="text-xl ml-0.5">{isPlaying ? "⏸" : "▶"}</span>
            </button>

            <button
              type="button"
              onClick={handleNextSong}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 shadow-xs hover:text-[#dc5b8e] hover:shadow-md transition-all active:scale-95 cursor-pointer border border-pink-100"
              title="Next song"
            >
              ⏭
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="text-sm text-gray-500 hover:text-[#dc5b8e] cursor-pointer p-1"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted || volume === 0 ? "🔇" : "🔊"}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-12 sm:w-16 h-1 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-[#dc5b8e]"
              title="Volume control"
            />
          </div>
        </div>

        {hasError && (
          <div className="mt-3 rounded-2xl bg-rose-50 border border-rose-200 p-2.5 text-center text-xs text-rose-600">
            ⚠️ Yeh link direct audio (.mp3) ya YouTube link nahi hai, ya aapke{" "}
            <code>public/songs/</code> folder mein file mojood nahi hai.
          </div>
        )}
      </div>

      {/* --- PLAYLIST ITEMS SECTION --- */}
      <div className="mb-5 space-y-2">
        <div className="flex items-center justify-between px-1 text-xs font-bold uppercase tracking-wider text-[#b87993]">
          <span>Muskan's Playlist ({songList.length})</span>
          <span>Click to Play 🎧</span>
        </div>

        {songList.map((song, index) => {
          const isSelected = index === safeIndex;
          const isCurrentPlaying = isSelected && isPlaying;

          return (
            <div
              key={song._id || song.id || index}
              onClick={() => handleSelectSong(index)}
              className={`group flex items-center justify-between gap-3 rounded-2xl p-3 transition-all duration-300 cursor-pointer active:scale-98 ${
                isSelected
                  ? "border-2 border-pink-400 bg-pink-100/80 shadow-md shadow-pink-200/50 scale-[1.01]"
                  : "border border-pink-100 bg-white/80 hover:bg-pink-50/80 hover:border-pink-200 hover:shadow-xs"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-lg shadow-xs transition-transform ${
                    isCurrentPlaying
                      ? "bg-gradient-to-br from-pink-400 to-rose-400 text-white scale-105"
                      : "bg-pink-100 text-[#713c55] group-hover:scale-105"
                  }`}
                >
                  {isCurrentPlaying ? "♫" : song.emoji || "💖"}
                </div>

                <div className="text-left min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3
                      className={`text-xs sm:text-sm font-bold truncate ${
                        isSelected ? "text-[#dc5b8e]" : "text-[#713c55]"
                      }`}
                    >
                      {song.title}
                    </h3>
                    <span className="rounded-full bg-pink-50 px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold text-[#b54972] border border-pink-200/60 hidden sm:inline-block">
                      {song.tag || "Our Special Song 🌸"}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#926a7e] font-medium truncate">
                    {song.movie || song.artist}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="hidden md:block text-right max-w-[180px]">
                  <p className="text-[10px] text-[#b87993] italic truncate">
                    {song.dedication}
                  </p>
                </div>

                <button
                  type="button"
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all shadow-xs ${
                    isCurrentPlaying
                      ? "bg-[#dc5b8e] text-white scale-105 shadow-pink-300"
                      : "bg-white text-[#dc5b8e] group-hover:bg-[#dc5b8e] group-hover:text-white border border-pink-200"
                  }`}
                >
                  {isCurrentPlaying ? "⏸" : "▶"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- Heartfelt Dedication Box --- */}
      {activeSong.dedication && (
        <div className="mb-5 rounded-2xl border border-pink-200/90 bg-gradient-to-b from-pink-50/80 to-white/95 p-3.5 sm:p-4 text-center shadow-xs">
          <p className="text-xs font-bold text-[#dc5b8e] uppercase tracking-wider mb-1">
            💌 Love Note For Muskan
          </p>
          <p className="text-xs sm:text-sm text-[#713c55] font-medium leading-relaxed italic">
            "{activeSong.dedication}"
          </p>
        </div>
      )}

      {/* --- Navigation Buttons --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-pink-100">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-semibold text-[#b87993] hover:text-[#713c55] transition-colors cursor-pointer inline-flex items-center gap-1 active:scale-95"
          >
            <span>←</span>
            <span>Back to Quiz</span>
          </button>
        )}

        {onNext && (
          <button
            type="button"
            onClick={onNext}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f089b0] via-[#dc5b8e] to-[#c9447a] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-pink-400/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95 cursor-pointer ml-auto"
          >
            <span>Read Final Secret Letter</span>
            <span>💌</span>
          </button>
        )}
      </div>

      <p className="mt-4 flex items-center justify-center gap-1 text-[11px] text-[#b28b9e]">
        <span>Curated with all my love, exclusively for Muskan</span>
        <span className="text-rose-500 font-bold">♥</span>
      </p>
    </section>
  );
}

export default Surprise;