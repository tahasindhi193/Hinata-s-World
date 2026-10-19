import { useState } from "react";

// Accepted passwords (trimmed and lowercased)
const DEFAULT_PASSWORDS = [
  "muskan",
  "meri muskan",
  "cutie",
  "cutie pie",
  "love",
  "pyaar",
  "jaan",
  "smile",
  "princess",
  "143",
];

const FUNNY_MESSAGES = [
  "Oops, Meri Muskan! Try Again. 🥹",
  "Arey meri cutie pie, itna mushkil password nahi hai! 🙈",
  "Galat ho gaya! Ek baar phir try karo na please... 🥺",
  "Hint: Tumhara pyaara sa naam hi dil ki chabi hai! 🎀",
  "Socho socho... Kis ke liye yeh website banayi hai? 💕",
];

function Unlock({ passwords: propPasswords, onUnlock, onBack }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const acceptedList =
    propPasswords && propPasswords.length > 0
      ? propPasswords.map((p) => p.trim().toLowerCase())
      : DEFAULT_PASSWORDS;

  const validateAndUnlock = (inputVal) => {
    const cleanInput = inputVal.trim().toLowerCase();

    if (acceptedList.includes(cleanInput)) {
      setIsSuccess(true);
      setErrorMessage("");
      setTimeout(() => {
        if (onUnlock) onUnlock();
      }, 1500);
    } else {
      setIsShaking(true);
      const nextAttempt = attempts + 1;
      setAttempts(nextAttempt);

      const msgIndex = Math.min(nextAttempt - 1, FUNNY_MESSAGES.length - 1);
      setErrorMessage(FUNNY_MESSAGES[msgIndex]);

      setTimeout(() => {
        setIsShaking(false);
      }, 500);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateAndUnlock(password);
  };

  const handleChipClick = (word) => {
    setPassword(word);
    setErrorMessage("");
    validateAndUnlock(word);
  };

  return (
    <section className="relative z-10 w-full max-w-[560px] rounded-3xl border border-white/95 bg-white/90 px-4 py-7 sm:px-9 sm:py-10 text-center shadow-2xl shadow-rose-200/50 backdrop-blur-xl transition-all duration-300 overflow-hidden">
      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-44 w-72 rounded-full bg-gradient-to-b from-pink-300/35 to-transparent blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 -right-10 h-44 w-44 rounded-full bg-purple-200/30 blur-2xl"
        aria-hidden="true"
      />

      {/* Success Confetti Emojis */}
      {isSuccess && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
          <span className="absolute top-8 left-8 text-3xl animate-bounce">
            🎉
          </span>
          <span className="absolute top-10 right-10 text-3xl animate-bounce [animation-delay:200ms]">
            💖
          </span>
          <span className="absolute bottom-10 left-10 text-3xl animate-bounce [animation-delay:400ms]">
            ✨
          </span>
          <span className="absolute bottom-8 right-8 text-3xl animate-bounce [animation-delay:300ms]">
            🌸
          </span>
        </div>
      )}

      {/* Top Decoration */}
      <div className="text-xs tracking-widest text-[#e58bad] mb-2">
        ୨୧ ───── 🔐 ───── ୨୧
      </div>

      <p className="text-[10px] sm:text-[11px] font-bold tracking-[3px] uppercase text-[#b87993] mb-1">
        SECRET PASSCODE REQUIRED
      </p>

      {/* Main Heading */}
      <h1 className="font-['Dancing_Script'] text-5xl sm:text-6xl font-bold text-[#713c55] leading-tight mb-2 drop-shadow-xs">
        Unlock Your <span className="text-[#dc5b8e]">Surprise</span>
      </h1>

      <p className="text-xs sm:text-sm leading-relaxed text-[#8a5d73] max-w-sm mx-auto mb-5 font-medium">
        Meri Muskan, enter the secret password to open your special quiz and
        heartfelt surprises! 💌
      </p>

      {/* Animated Lock Icon */}
      <div className="relative mx-auto mb-5 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center">
        <span
          className={`absolute inset-0 rounded-full border transition-all duration-500 pointer-events-none ${
            isSuccess
              ? "border-emerald-400/50 bg-emerald-100/40 animate-ping"
              : "border-pink-300/40 animate-pulse"
          }`}
          aria-hidden="true"
        />

        <div
          className={`relative flex h-18 w-18 sm:h-20 sm:w-20 items-center justify-center rounded-full text-3xl sm:text-4xl shadow-lg transition-all duration-500 ${
            isSuccess
              ? "bg-gradient-to-br from-emerald-100 to-teal-50 shadow-emerald-200/60 scale-110"
              : isShaking
              ? "bg-gradient-to-br from-rose-100 to-red-50 shadow-rose-200/60 scale-95"
              : "bg-gradient-to-br from-pink-100 via-rose-100 to-pink-50 shadow-pink-200/60"
          }`}
        >
          {isSuccess ? "🔓" : isShaking ? "🥺" : "🔐"}
          {isSuccess && (
            <span className="absolute -top-1 -right-1 text-sm animate-bounce">
              ✨
            </span>
          )}
        </div>
      </div>

      {/* Success Notification */}
      {isSuccess ? (
        <div className="mb-5 rounded-2xl border border-emerald-300 bg-emerald-50/90 p-5 shadow-md animate-pop">
          <p className="text-2xl mb-1">🎉</p>
          <h2 className="font-['Dancing_Script'] text-3xl font-bold text-emerald-700">
            Yay! Password Accepted!
          </h2>
          <p className="text-xs sm:text-sm text-emerald-600 font-semibold mt-1">
            Meri Muskan ke liye Quiz khul raha hai... 🥰💖
          </p>
        </div>
      ) : (
        /* Password Form */
        <form onSubmit={handleSubmit} className="space-y-3.5 max-w-sm mx-auto">
          <div className={`relative ${isShaking ? "animate-shake" : ""}`}>
            {/* Input icon */}
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-pink-400 pointer-events-none">
              🔑
            </span>

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
              placeholder="Enter secret password..."
              className="w-full rounded-full border border-pink-200/90 bg-white/95 py-3.5 pl-11 pr-12 text-base text-[#713c55] placeholder:text-pink-300/80 shadow-inner focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-300/40 transition-all font-sans"
              autoFocus
            />

            {/* Toggle show/hide password */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-base text-pink-400 hover:text-pink-600 transition-colors cursor-pointer"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Funny Error Message */}
          {errorMessage && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-2.5 text-xs sm:text-sm font-semibold text-rose-600 shadow-xs animate-shake">
              {errorMessage}
            </div>
          )}

          {/* Unlock Submit Button */}
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f089b0] via-[#dc5b8e] to-[#c9447a] py-3.5 px-6 text-sm sm:text-base font-bold text-white shadow-lg shadow-pink-400/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-pink-400/50 active:scale-95 cursor-pointer group"
          >
            <span>Unlock Surprise</span>
            <span className="transition-transform duration-300 group-hover:rotate-12 group-hover:scale-125">
              🔓
            </span>
          </button>
        </form>
      )}

      {/* Cute Interactive Hint & Quick Autofill Chips */}
      {!isSuccess && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b87993] hover:text-[#dc5b8e] transition-colors cursor-pointer"
          >
            <span>💡</span>
            <span>{showHint ? "Hide hint" : "Need a little hint?"}</span>
          </button>

          {showHint && (
            <div className="mt-2.5 mx-auto max-w-xs rounded-2xl border border-pink-200 bg-pink-50/90 p-3 text-xs text-[#8c4c68] shadow-xs animate-pop">
              <p className="mb-2 font-medium">
                🌸 Tap below to auto-unlock effortlessly:
              </p>
              <div className="flex flex-wrap justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleChipClick("muskan")}
                  className="rounded-full bg-white px-3 py-1 font-bold text-[#dc5b8e] border border-pink-200 hover:bg-[#dc5b8e] hover:text-white transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  muskan 🌸
                </button>
                <button
                  type="button"
                  onClick={() => handleChipClick("cutie")}
                  className="rounded-full bg-white px-3 py-1 font-bold text-[#dc5b8e] border border-pink-200 hover:bg-[#dc5b8e] hover:text-white transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  cutie 🎀
                </button>
                <button
                  type="button"
                  onClick={() => handleChipClick("love")}
                  className="rounded-full bg-white px-3 py-1 font-bold text-[#dc5b8e] border border-pink-200 hover:bg-[#dc5b8e] hover:text-white transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  love 💖
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Back Button */}
      {onBack && !isSuccess && (
        <div className="mt-5">
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-semibold text-[#b87993] hover:text-[#713c55] transition-colors cursor-pointer inline-flex items-center gap-1 active:scale-95"
          >
            <span>←</span>
            <span>Go Back</span>
          </button>
        </div>
      )}

      {/* Bottom Footer Note */}
      <p className="mt-4 flex items-center justify-center gap-1 text-[11px] text-[#b28b9e]">
        <span>Guarded with love, exclusively for Muskan</span>
        <span className="text-rose-500">♥</span>
      </p>
    </section>
  );
}

export default Unlock;

