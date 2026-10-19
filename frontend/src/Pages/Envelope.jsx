import { useState, useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Envelope({ envelopeData: propEnvelope, onBack, onNext }) {
  const [isOpen, setIsOpen] = useState(false);
  const [fetchedEnvelope, setFetchedEnvelope] = useState(null);

  useEffect(() => {
    if (!propEnvelope) {
      fetch(`${BACKEND_URL}/api/content`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.envelope) {
            setFetchedEnvelope(data.envelope);
          }
        })
        .catch(() => {});
    }
  }, [propEnvelope]);

  const env = propEnvelope || fetchedEnvelope || {};
  const receiver = env.receiver || "Muskan";
  const paragraphs = env.fullMessage
    ? env.fullMessage.split("\n").filter((p) => p.trim() !== "")
    : [
        "Pata Hai, Main Tumhare Liye Kuch Special Banana Chahta Tha. Kuch Aisa Jo Sirf Tumhara Ho.",
        "Isliye Yeh Chhoti Si Website Banayi Hai. Iske Har Page Mein Ek Chhoti Si Surprise Aur Mere Dil Ki Ek Baat Tumhara Intezaar Kar Rahi Hai. 🥹",
        "Toh Chalo, Meri Muskan... Abhi Toh Surprise Shuru Hua Hai! 💌",
      ];

  return (
    <section className="relative z-10 w-full max-w-[580px] rounded-3xl border border-white/95 bg-white/90 px-4 py-7 sm:px-9 sm:py-10 text-center shadow-2xl shadow-rose-200/50 backdrop-blur-xl transition-all duration-300 overflow-hidden">
      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-44 w-72 rounded-full bg-gradient-to-b from-pink-300/35 to-transparent blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 -right-10 h-44 w-44 rounded-full bg-purple-200/30 blur-2xl"
        aria-hidden="true"
      />

      {/* Top Ribbon */}
      <div className="text-xs tracking-widest text-[#e58bad] mb-2">
        ୨୧ ───── ♡ ───── ୨୧
      </div>

      <p className="text-[10px] sm:text-[11px] font-bold tracking-[3px] uppercase text-[#b87993] mb-1">
        {env.title || "A LITTLE LETTER FOR YOU"}
      </p>

      <h1 className="font-['Dancing_Script'] text-5xl sm:text-6xl font-bold text-[#713c55] leading-tight mb-2 drop-shadow-xs">
        Hey, <span className="text-[#dc5b8e]">{receiver}!</span>
      </h1>

      <p className="text-xs sm:text-sm leading-relaxed text-[#8a5d73] max-w-sm mx-auto mb-5 font-medium">
        Someone has something sweet to tell you...
        <br />
        Will you open your little letter? 🥹
      </p>

      {/* --- CUTE INTERACTIVE ENVELOPE GRAPHIC --- */}
      <div className="relative mx-auto my-2 flex flex-col items-center justify-center">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group relative cursor-pointer focus:outline-none transition-transform duration-300 hover:scale-105 active:scale-95"
          aria-label={isOpen ? "Close letter" : "Open letter"}
        >
          {/* Main Envelope Body */}
          <div
            className={`relative h-36 w-60 sm:h-44 sm:w-72 rounded-2xl bg-gradient-to-br from-pink-300 via-rose-300 to-pink-400 p-1.5 shadow-xl shadow-pink-300/40 transition-all duration-500 flex items-center justify-center ${
              isOpen ? "ring-4 ring-pink-200" : ""
            }`}
          >
            {/* Inner cute folded card */}
            <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-gradient-to-b from-white to-pink-50 p-4 border border-white/80 shadow-inner">
              <span
                className={`text-4xl sm:text-5xl transition-transform duration-500 ${
                  isOpen ? "scale-125 rotate-12" : "group-hover:scale-110"
                }`}
              >
                {isOpen ? "💌" : "✉️"}
              </span>

              <span className="mt-2 text-xs sm:text-sm font-bold text-[#b24d77] tracking-wide">
                {isOpen ? "Letter Opened! ♡" : env.letterPreview || "Tap To Open ♡"}
              </span>

              <span className="text-[10px] text-pink-400 font-medium">
                For My {receiver} 🎀
              </span>
            </div>

            {/* Pulsing Heart Wax Seal */}
            {!isOpen && (
              <span className="absolute -top-3 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-sm text-white shadow-md shadow-rose-300 animate-pulse border-2 border-white">
                ♥
              </span>
            )}
          </div>
        </button>

        <p className="text-xs font-semibold text-[#b87993] mt-3">
          {isOpen
            ? "A little message, just for you... 💕"
            : "Tap The Envelope To Open It ♡"}
        </p>
      </div>

      {/* --- REVEALED LETTER MESSAGE (STATIONERY STYLE) --- */}
      {isOpen && (
        <div className="mt-5 rounded-2xl border border-pink-200/90 bg-gradient-to-b from-[#fffbfc] via-pink-50/60 to-white p-5 sm:p-7 text-left shadow-lg shadow-pink-100 transition-all duration-500 animate-pop">
          {/* Decorative Top Stamp */}
          <div className="flex items-center justify-between border-b border-pink-200/60 pb-3 mb-4">
            <span className="text-xs font-bold text-[#b54972] tracking-wider uppercase">
              💌 Handcrafted Letter
            </span>
            <span className="text-sm">🌸</span>
          </div>

          <h2 className="font-['Dancing_Script'] text-3xl sm:text-4xl font-bold text-[#dc5b8e] text-center mb-4">
            Meri Pyaari {receiver} ❤️
          </h2>

          <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-[#713c55] font-medium">
            {paragraphs.map((p, index) => (
              <p
                key={index}
                className={
                  index === paragraphs.length - 1
                    ? "font-bold text-[#b54972] pt-1"
                    : ""
                }
              >
                {p}
              </p>
            ))}
          </div>

          {/* Next Step Call to Action */}
          <div className="mt-6 text-center">
            <button
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f089b0] via-[#dc5b8e] to-[#c9447a] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-pink-400/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95 cursor-pointer"
              onClick={onNext}
            >
              <span>Next Surprise</span>
              <span>♡</span>
            </button>
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="mt-5">
        <button
          type="button"
          className="text-xs font-semibold text-[#b87993] hover:text-[#713c55] transition-colors cursor-pointer inline-flex items-center gap-1 active:scale-95"
          onClick={onBack}
        >
          <span>←</span>
          <span>Go Back</span>
        </button>
      </div>

      <p className="mt-4 flex items-center justify-center gap-1 text-[11px] text-[#b28b9e]">
        <span>Made With Love, Just For You</span>
        <span className="text-rose-500">♥</span>
      </p>
    </section>
  );
}

export default Envelope;