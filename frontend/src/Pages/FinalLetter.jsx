import { useState, useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const DEFAULT_LETTER = {
  quote: "You are the sweetest chapter in my life's story, Muskan. 🌷",
  paragraphs: [
    "Meri Pyaari Muskan,",
    "Pata hai, is poori duniya mein arbon log hain, lekin mere liye sabse special aur sabse pyaari sirf aur sirf tum ho. Tumhari ek choti si hansi mere poore din ki thakan mita deti hai.",
    "Yeh website sirf code nahi hai — yeh ek chhota sa aaina hai yeh dikhane ke liye ke tum mere liye kitni anmol ho. Chahe zindagi mein kaisa bhi waqt ho, main hamesha chahta hoon ke tumhari pyari si muskan hamesha aise hi barkaraar rahe. 🥹✨",
    "Thank you for simply being in this world, and thank you for being the reason behind so many genuine smiles. Stay happy, stay blessed, and never forget how deeply you are cherished! ❤️",
  ],
};

function FinalLetter({ finalLetter: propLetter, onBack, onRestart }) {
  const [hasHugged, setHasHugged] = useState(false);
  const [hugParticles, setHugParticles] = useState([]);
  const [fetchedLetter, setFetchedLetter] = useState(null);

  useEffect(() => {
    if (!propLetter) {
      fetch(`${BACKEND_URL}/api/content`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.settings?.finalLetter) {
            setFetchedLetter(data.settings.finalLetter);
          }
        })
        .catch(() => {});
    }
  }, [propLetter]);

  const activeLetter = propLetter || fetchedLetter || DEFAULT_LETTER;
  const quote = activeLetter.quote || DEFAULT_LETTER.quote;
  const paragraphs =
    activeLetter.paragraphs && activeLetter.paragraphs.length > 0
      ? activeLetter.paragraphs
      : DEFAULT_LETTER.paragraphs;

  const greeting = paragraphs[0] || "Meri Pyaari Muskan,";
  const bodyParagraphs = paragraphs.slice(1);

  const handleSendHug = (e) => {
    setHasHugged(true);

    const burst = [0, 1, 2, 3].map((i) => ({
      id: Date.now() + i,
      x: 35 + i * 15,
      y: 50,
      emoji: ["🧸", "💖", "🌸", "🤗"][i],
    }));

    setHugParticles(burst);
    setTimeout(() => {
      setHugParticles([]);
    }, 1500);
  };

  return (
    <section className="relative z-10 w-full max-w-[620px] rounded-3xl border border-white/95 bg-white/90 px-4 py-7 sm:px-9 sm:py-10 text-center shadow-2xl shadow-rose-200/50 backdrop-blur-xl transition-all duration-300 overflow-hidden">
      {/* Ambient glows */}
      <div
        className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-44 w-72 rounded-full bg-gradient-to-b from-pink-300/35 to-transparent blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 -right-10 h-44 w-44 rounded-full bg-purple-200/30 blur-2xl"
        aria-hidden="true"
      />

      {/* Floating Hug Emojis */}
      {hugParticles.map((p) => (
        <span
          key={p.id}
          className="pointer-events-none absolute text-3xl select-none animate-bounce z-30"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        >
          {p.emoji}
        </span>
      ))}

      {/* Top Ribbon */}
      <div className="text-xs tracking-widest text-[#e58bad] mb-2">
        ୨୧ ───── 💌 ───── ୨୧
      </div>

      <p className="text-[10px] sm:text-[11px] font-bold tracking-[3px] uppercase text-[#b87993] mb-1">
        STEP 6: A HEARTFELT LETTER
      </p>

      <h1 className="font-['Dancing_Script'] text-5xl sm:text-6xl font-bold text-[#713c55] leading-tight mb-2 drop-shadow-xs">
        To My Dearest <span className="text-[#dc5b8e]">Muskan</span> 🌸
      </h1>

      <p className="text-xs sm:text-sm text-[#8a5d73] max-w-sm mx-auto mb-5 font-medium">
        Every single word here comes straight from the bottom of my heart. 💖
      </p>

      {/* Cute Letter Stationery Card */}
      <div className="relative rounded-3xl border border-pink-200/90 bg-gradient-to-b from-[#fffbfc] via-pink-50/50 to-white p-5 sm:p-7 text-left shadow-lg shadow-pink-100/70 space-y-3.5">
        {/* Wax Seal Stamp */}
        <div className="flex justify-center -mt-9 sm:-mt-11 mb-1">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-tr from-rose-600 via-pink-600 to-rose-500 text-white shadow-lg shadow-rose-400/40 border-2 border-white text-xl animate-pulse">
            💌
          </div>
        </div>

        <p className="font-['Dancing_Script'] text-2xl sm:text-3xl font-bold text-[#dc5b8e] text-center pt-1">
          {greeting}
        </p>

        <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-[#713c55] font-medium">
          {bodyParagraphs.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {/* Highlight quote badge */}
        {quote && (
          <div className="rounded-2xl border border-pink-200 bg-pink-100/60 p-3 sm:p-4 text-center my-2 shadow-xs">
            <p className="font-['Dancing_Script'] text-lg sm:text-xl font-bold text-[#b54972] leading-snug">
              "{quote}"
            </p>
          </div>
        )}

        {/* Interactive Virtual Warm Hug Button */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={handleSendHug}
            className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all shadow-xs active:scale-95 cursor-pointer ${
              hasHugged
                ? "bg-rose-100 text-rose-700 border border-rose-300 scale-105"
                : "bg-pink-100 text-[#b24d77] border border-pink-200 hover:bg-pink-200"
            }`}
          >
            <span>
              {hasHugged
                ? "Virtual Warm Hug Sent! 🤗💕"
                : "Send A Virtual Warm Hug 🧸"}
            </span>
          </button>
        </div>
      </div>

      {/* Navigation & Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto rounded-full border border-pink-200 bg-white/95 px-5 py-2.5 text-xs sm:text-sm font-bold text-[#b87993] hover:text-[#713c55] hover:border-pink-300 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            ← Back to Songs Playlist 🎵
          </button>
        )}

        {onRestart && (
          <button
            type="button"
            onClick={onRestart}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#f089b0] via-[#dc5b8e] to-[#c9447a] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-pink-400/35 hover:-translate-y-0.5 hover:shadow-xl active:scale-95 transition-all cursor-pointer"
          >
            <span>Start Journey From Beginning</span>
            <span>♡</span>
          </button>
        )}
      </div>

      {/* Bottom Signature */}
      <p className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-[#b28b9e]">
        <span>Forever & always sealed with love, just for Muskan</span>
        <span className="text-rose-500 font-bold">♥</span>
      </p>
    </section>
  );
}

export default FinalLetter;