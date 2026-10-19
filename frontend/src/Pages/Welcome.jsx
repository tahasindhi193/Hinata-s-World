import { useState } from "react";

const DEFAULT_SWEET_THOUGHTS = [
  "Muskan, your smile genuinely lights up my whole universe. 🌸✨",
  "Out of all the stars in the sky, you shine the brightest. 🌙💖",
  "Having you in this world makes every single day special. 🧸💌",
  "Your happiness is my absolute favorite thing in the world. 🥹❤️",
  "A sweet reminder: You are deeply cherished and truly irreplaceable. 🎀🌸",
  "You make ordinary moments feel like pure magic. ✨🌷",
];

const FLOATING_EMOJIS = ["💖", "✨", "🌸", "💕", "🌷", "🎀", "🧸", "💌"];

function Welcome({ thoughts: propThoughts, onContinue }) {
  const [particles, setParticles] = useState([]);
  const [thoughtIndex, setThoughtIndex] = useState(0);
  const [showSecretThought, setShowSecretThought] = useState(false);
  const [isIconBouncing, setIsIconBouncing] = useState(false);

  const thoughtsList =
    propThoughts && propThoughts.length > 0 ? propThoughts : DEFAULT_SWEET_THOUGHTS;

  // Spawn floating heart or sparkle when card is clicked
  const handleCardClick = (e) => {
    if (e.target.closest("button")) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const randomEmoji =
      FLOATING_EMOJIS[Math.floor(Math.random() * FLOATING_EMOJIS.length)];

    const newParticle = {
      id: Date.now() + Math.random(),
      x,
      y,
      emoji: randomEmoji,
    };

    setParticles((prev) => [...prev.slice(-10), newParticle]);

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 1000);
  };

  const handleNextThought = (e) => {
    e.stopPropagation();
    setThoughtIndex((prev) => (prev + 1) % thoughtsList.length);
  };

  const handleIconClick = (e) => {
    e.stopPropagation();
    setIsIconBouncing(true);
    setTimeout(() => setIsIconBouncing(false), 500);

    const rect = e.currentTarget.getBoundingClientRect();
    const cardRect = e.currentTarget.closest("section").getBoundingClientRect();
    const centerX = rect.left - cardRect.left + rect.width / 2;
    const centerY = rect.top - cardRect.top + rect.height / 2;

    const burst = [0, 1, 2].map((i) => ({
      id: Date.now() + i,
      x: centerX + (i - 1) * 22,
      y: centerY - 15,
      emoji: ["💌", "💖", "✨"][i],
    }));

    setParticles((prev) => [...prev, ...burst]);
    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !burst.some((b) => b.id === p.id))
      );
    }, 1000);
  };

  return (
    <section
      onClick={handleCardClick}
      className="relative z-10 w-full max-w-[580px] rounded-3xl border border-white/95 bg-white/90 px-4 py-7 sm:px-9 sm:py-10 text-center shadow-2xl shadow-rose-200/50 backdrop-blur-xl transition-all duration-300 hover:shadow-rose-300/60 overflow-hidden select-none cursor-pointer"
    >
      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-44 w-72 rounded-full bg-gradient-to-b from-pink-300/35 to-transparent blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 -right-10 h-44 w-44 rounded-full bg-purple-200/30 blur-2xl"
        aria-hidden="true"
      />

      {/* Click floating particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-2xl select-none animate-bounce z-20"
          style={{ left: `${p.x}px`, top: `${p.y}px` }}
          aria-hidden="true"
        >
          {p.emoji}
        </span>
      ))}

      {/* Top Ribbon Badge */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 mb-4 rounded-full bg-gradient-to-r from-pink-100/90 via-rose-100/90 to-pink-100/90 border border-pink-200/80 text-[11px] font-bold tracking-widest text-[#be185d] uppercase shadow-xs">
        <span>🎀</span>
        <span>A Special Delivery For Muskan</span>
        <span>🎀</span>
      </div>

      {/* Interactive Cute Envelope Icon */}
      <div
        className="relative mx-auto mb-3 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center cursor-pointer group"
        onClick={handleIconClick}
        title="Tap me for love! ♡"
      >
        <span
          className="absolute inset-0 rounded-full border border-pink-400/30 animate-ping pointer-events-none"
          aria-hidden="true"
        />
        <span
          className="absolute inset-[-4px] rounded-full border border-dashed border-pink-300/70 animate-spin [animation-duration:16s] pointer-events-none"
          aria-hidden="true"
        />

        <div
          className={`relative flex h-18 w-18 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 via-rose-100 to-pink-50 text-3xl sm:text-4xl shadow-lg shadow-pink-200/60 transition-transform duration-300 group-hover:scale-110 active:scale-95 ${
            isIconBouncing ? "scale-125 rotate-12" : ""
          }`}
        >
          <span>💌</span>
          <span
            className="absolute -top-1 -right-1 text-xs sm:text-sm animate-pulse"
            aria-hidden="true"
          >
            ✨
          </span>
          <span
            className="absolute -bottom-1 -left-1 text-xs sm:text-sm animate-bounce"
            aria-hidden="true"
          >
            💗
          </span>
        </div>
      </div>

      {/* Small Pre-heading */}
      <p className="text-[10px] sm:text-[11px] font-bold tracking-[3px] uppercase text-[#b87993] mb-1">
        Dedicated with all my heart to
      </p>

      {/* Main Romantic Heading */}
      <h1 className="font-['Dancing_Script'] text-5xl sm:text-6xl md:text-7xl font-bold text-[#713c55] leading-tight mb-2 drop-shadow-xs">
        Meri{" "}
        <span className="text-[#dc5b8e]">
          Muskan
          <span className="text-2xl sm:text-3xl align-super ml-1" aria-hidden="true">
            ✨
          </span>
        </span>
      </h1>

      {/* Romantic Description */}
      <p className="text-xs sm:text-sm leading-relaxed text-[#8a5d73] max-w-md mx-auto mb-4 font-medium">
        In a world full of billions of people,{" "}
        <strong className="text-[#be185d] font-bold">
          you're my favorite story
        </strong>
        . 🌸 So I built this cozy little corner of the internet, just to bring
        a genuine smile to your face. ❤️
      </p>

      {/* Aesthetic Feature Badges */}
      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-4">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-50/90 border border-pink-200/80 text-[11px] sm:text-xs font-semibold text-[#8c4c68] shadow-xs">
          <span>🎀</span> Handcrafted With Love
        </span>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-50/90 border border-pink-200/80 text-[11px] sm:text-xs font-semibold text-[#8c4c68] shadow-xs">
          <span>✨</span> Made Only For You
        </span>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-50/90 border border-pink-200/80 text-[11px] sm:text-xs font-semibold text-[#8c4c68] shadow-xs">
          <span>🌸</span> Smile Guaranteed
        </span>
      </div>

      {/* Interactive Secret Thought Capsule */}
      <div
        className={`mx-auto mb-4 max-w-md rounded-2xl p-3.5 transition-all duration-300 ${
          showSecretThought
            ? "bg-pink-100/75 border border-pink-300 shadow-sm"
            : "bg-pink-50/70 border border-dashed border-pink-300/80 hover:bg-pink-100/60"
        }`}
      >
        {!showSecretThought ? (
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 text-xs sm:text-sm font-bold text-[#b24d77] hover:text-[#8a3057] transition-colors cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setShowSecretThought(true);
            }}
          >
            <span>💌</span>
            <span>Tap here for a sweet secret thought... 💭</span>
          </button>
        ) : (
          <div className="space-y-2">
            <p className="font-['Dancing_Script'] text-xl sm:text-2xl font-bold text-[#a43a67] leading-snug">
              "{thoughtsList[thoughtIndex]}"
            </p>

            {/* Heart Dot Indicator */}
            <div className="flex items-center justify-center gap-1 pt-0.5">
              {thoughtsList.map((_, i) => (
                <span
                  key={i}
                  className={`inline-block h-1.5 rounded-full transition-all duration-300 ${
                    i === thoughtIndex
                      ? "w-4 bg-[#dc5b8e]"
                      : "w-1.5 bg-pink-300/70"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-bold text-[#b24d77] border border-pink-200 hover:bg-[#dc5b8e] hover:text-white transition-all shadow-xs cursor-pointer active:scale-95"
              onClick={handleNextThought}
            >
              <span>Read Another Thought ♡</span>
            </button>
          </div>
        )}
      </div>

      {/* Cute Decorative Ribbon Divider */}
      <div className="my-3 text-xs tracking-widest text-[#e58bad]">
        ୨୧ ─── ♡ ─── ୨୧
      </div>

      {/* Prompt Question */}
      <p className="mb-3.5 flex items-center justify-center gap-1 text-xs sm:text-sm font-semibold text-[#7a4661]">
        <span>Are you ready for your surprise?</span>
        <span>🥹</span>
      </p>

      {/* Primary Call to Action Button */}
      <button
        type="button"
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#f089b0] via-[#dc5b8e] to-[#c9447a] px-8 py-3.5 text-sm sm:text-base font-bold text-white shadow-lg shadow-pink-400/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-pink-400/50 active:scale-95 cursor-pointer group"
        onClick={onContinue}
      >
        <span>Open Your Surprise</span>
        <span className="text-lg transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">
          💝
        </span>
      </button>

      {/* Bottom Signature */}
      <p className="mt-5 flex items-center justify-center gap-1 text-[11px] text-[#b28b9e]">
        <span>Sealed with endless love, just for Muskan</span>
        <span className="text-rose-500 font-bold">♥</span>
      </p>
    </section>
  );
}

export default Welcome;

