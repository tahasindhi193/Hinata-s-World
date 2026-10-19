import { useState, useEffect, useCallback } from "react";
import Welcome from "./Pages/Welcome.jsx";
import Envelope from "./Pages/Envelope.jsx";
import Unlock from "./Pages/Unlock.jsx";
import Quiz from "./Pages/Quiz.jsx";
import Surprise from "./Pages/Surprise.jsx";
import FinalLetter from "./Pages/FinalLetter.jsx";
import AdminPanel from "./Admin Panel/AdminPanel.jsx";
import "./index.css";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const STEPS = [
  { id: "welcome", label: "Welcome", icon: "💌", short: "1" },
  { id: "envelope", label: "Envelope", icon: "✉️", short: "2" },
  { id: "unlock", label: "Passcode", icon: "🔐", short: "3" },
  { id: "quiz", label: "Love Quiz", icon: "🎯", short: "4" },
  { id: "surprise", label: "Songs", icon: "🎵", short: "5" },
  { id: "finalLetter", label: "Final Letter", icon: "📜", short: "6" },
  { id: "admin", label: "Admin", icon: "⚙️", short: "★" },
];

const TAP_EMOJIS = ["💖", "✨", "🌸", "💕", "🌷", "🎀", "🧸", "💌", "🍓", "🤍"];

function App() {
  const [currentPage, setCurrentPage] = useState("welcome");
  const [globalParticles, setGlobalParticles] = useState([]);
  const [siteData, setSiteData] = useState({
    songs: [],
    quizzes: [],
    settings: null,
    envelope: null,
  });

  // Backend data fetch
  const fetchLiveContent = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/content`);
      const data = await res.json();
      if (data.success) {
        setSiteData({
          songs: data.songs || [],
          quizzes: data.quizzes || [],
          settings: data.settings || null,
          envelope: data.envelope || null,
        });
      }
    } catch (err) {
      console.warn("Backend connect nahi ho saka, fallback data active hai:", err);
    }
  }, []);

  useEffect(() => {
    fetchLiveContent();
  }, [fetchLiveContent, currentPage]);

  // Screen-wide heart & sparkle tap burst for Muskan
  const handleGlobalClick = (e) => {
    // Avoid double bursts when clicking buttons
    if (e.target.closest("button") || e.target.closest("input") || e.target.closest("textarea")) {
      return;
    }

    const randomEmoji = TAP_EMOJIS[Math.floor(Math.random() * TAP_EMOJIS.length)];
    const id = Date.now() + Math.random();

    setGlobalParticles((prev) => [
      ...prev.slice(-15),
      {
        id,
        x: e.clientX,
        y: e.clientY,
        emoji: randomEmoji,
      },
    ]);

    setTimeout(() => {
      setGlobalParticles((prev) => prev.filter((p) => p.id !== id));
    }, 1000);
  };

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentPage);
  const activeStepObj = STEPS[currentStepIndex] || STEPS[0];

  return (
    <main
      onClick={handleGlobalClick}
      className="relative min-h-screen w-full flex flex-col justify-between items-center px-3 py-4 sm:px-6 sm:py-8 overflow-x-hidden bg-gradient-to-br from-[#fff0f5] via-[#ffe4ee] to-[#fff5f9]"
    >
      {/* Background ambient decorative glows */}
      <div className="pointer-events-none fixed -top-28 -left-28 h-96 w-96 rounded-full bg-pink-300/35 blur-3xl animate-pulse-glow" />
      <div className="pointer-events-none fixed -bottom-32 -right-28 h-[28rem] w-[28rem] rounded-full bg-purple-300/30 blur-3xl animate-pulse-glow" />
      <div className="pointer-events-none fixed top-1/2 -right-24 h-80 w-80 rounded-full bg-rose-200/35 blur-3xl" />
      <div className="pointer-events-none fixed bottom-1/3 -left-20 h-72 w-72 rounded-full bg-pink-200/30 blur-3xl" />

      {/* Floating cute ambient stickers with gentle floating animations */}
      <div className="pointer-events-none fixed top-[6%] left-[4%] text-2xl sm:text-3xl animate-float-slow select-none opacity-70">
        🎀
      </div>
      <div className="pointer-events-none fixed top-[18%] right-[5%] text-2xl sm:text-3xl animate-float-reverse select-none opacity-65">
        🌸
      </div>
      <div className="pointer-events-none fixed bottom-[16%] left-[5%] text-2xl sm:text-3xl animate-float-slow select-none opacity-70">
        🧸
      </div>
      <div className="pointer-events-none fixed bottom-[12%] right-[6%] text-2xl sm:text-3xl animate-float-reverse select-none opacity-65">
        🍓
      </div>
      <div className="pointer-events-none fixed top-[45%] left-[2%] text-lg sm:text-xl animate-pulse select-none opacity-50">
        ✨
      </div>
      <div className="pointer-events-none fixed top-[42%] right-[3%] text-lg sm:text-xl animate-pulse select-none opacity-50">
        💖
      </div>

      {/* Global Click Tap Heart Particles */}
      {globalParticles.map((p) => (
        <span
          key={p.id}
          className="pointer-events-none fixed z-50 text-2xl sm:text-3xl select-none animate-heart-float"
          style={{ left: `${p.x}px`, top: `${p.y}px` }}
        >
          {p.emoji}
        </span>
      ))}

      {/* --- TOP CUTE NAVIGATION / STEPPER BAR --- */}
      <header className="relative z-30 w-full max-w-2xl mx-auto mb-4 sm:mb-6 flex flex-col items-center">
        {/* Mobile Mini Step Indicator Pill */}
        <div className="sm:hidden mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-pink-200 shadow-xs backdrop-blur-md text-[11px] font-bold text-[#b54972]">
          <span>{activeStepObj.icon}</span>
          <span>
            {currentPage === "admin"
              ? "Admin Dashboard"
              : `Step ${currentStepIndex + 1} of 6: ${activeStepObj.label}`}
          </span>
        </div>

        {/* Stepper Navigation Container */}
        <nav
          aria-label="Surprise Steps"
          className="w-full max-w-full overflow-x-auto no-scrollbar py-1 px-2 flex items-center justify-start sm:justify-center"
        >
          <div className="inline-flex items-center gap-1 sm:gap-2 rounded-full border border-pink-200/90 bg-white/85 p-1.5 shadow-md shadow-pink-200/40 backdrop-blur-md mx-auto">
            {STEPS.map((step, idx) => {
              const isActive = currentPage === step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentPage(step.id)}
                  className={`flex items-center gap-1 sm:gap-1.5 rounded-full px-2.5 sm:px-3.5 py-1.5 text-xs font-bold transition-all duration-300 cursor-pointer whitespace-nowrap active:scale-95 ${
                    isActive
                      ? "bg-gradient-to-r from-[#f089b0] via-[#dc5b8e] to-[#c9447a] text-white shadow-md shadow-pink-400/40 scale-105"
                      : "text-[#713c55] hover:bg-pink-100/70 hover:text-[#dc5b8e]"
                  }`}
                  title={`Go to ${step.label}`}
                >
                  <span className="text-sm">{step.icon}</span>
                  <span className="hidden md:inline-block">{step.label}</span>
                  <span className="md:hidden text-[11px] font-semibold">
                    {step.label === "Songs" ? "Music" : step.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      {/* --- MAIN PAGE CONTENT CONTAINER --- */}
      <div className="relative z-20 w-full flex-1 flex items-center justify-center my-auto">
        {/* 1. Welcome Page */}
        {currentPage === "welcome" && (
          <Welcome
            thoughts={siteData.settings?.welcomeThoughts}
            onContinue={() => setCurrentPage("envelope")}
          />
        )}

        {/* 2. Envelope Letter Page */}
        {currentPage === "envelope" && (
          <Envelope
            envelopeData={siteData.envelope}
            onBack={() => setCurrentPage("welcome")}
            onNext={() => setCurrentPage("unlock")}
          />
        )}

        {/* 3. Unlock Password Page */}
        {currentPage === "unlock" && (
          <Unlock
            passwords={siteData.settings?.passwords}
            onBack={() => setCurrentPage("envelope")}
            onUnlock={() => setCurrentPage("quiz")}
          />
        )}

        {/* 4. Quiz Page */}
        {currentPage === "quiz" && (
          <Quiz
            quizzes={siteData.quizzes}
            onBack={() => setCurrentPage("unlock")}
            onComplete={() => setCurrentPage("surprise")}
          />
        )}

        {/* 5. Songs / Music Surprise Page */}
        {currentPage === "surprise" && (
          <Surprise
            songs={siteData.songs}
            onBack={() => setCurrentPage("quiz")}
            onNext={() => setCurrentPage("finalLetter")}
          />
        )}

        {/* 6. Final Heartfelt Letter Page */}
        {currentPage === "finalLetter" && (
          <FinalLetter
            finalLetter={siteData.settings?.finalLetter}
            onBack={() => setCurrentPage("surprise")}
            onRestart={() => setCurrentPage("welcome")}
          />
        )}

        {/* 7. Admin Panel */}
        {currentPage === "admin" && (
          <AdminPanel
            onDataChange={fetchLiveContent}
            onBack={() => {
              fetchLiveContent();
              setCurrentPage("welcome");
            }}
          />
        )}
      </div>

      {/* --- FOOTER & QUICK ADMIN ACCESS SHORTCUT --- */}
      <footer className="relative z-30 w-full mt-4 sm:mt-6 flex items-center justify-between px-2 max-w-2xl">
        <p className="text-[11px] font-medium text-[#b58097] flex items-center gap-1">
          <span>Made with</span>
          <span className="text-rose-500 animate-pulse">💖</span>
          <span>for Meri Muskan</span>
        </p>

        <button
          type="button"
          onClick={() =>
            setCurrentPage((prev) => (prev === "admin" ? "welcome" : "admin"))
          }
          className="flex items-center gap-1 rounded-full border border-pink-200/90 bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-[#a85077] shadow-xs backdrop-blur-md hover:bg-pink-100 hover:text-[#713c55] transition active:scale-95 cursor-pointer"
          title="Toggle Admin Panel"
        >
          <span>⚙️</span>
          <span>{currentPage === "admin" ? "Exit Admin" : "Admin"}</span>
        </button>
      </footer>
    </main>
  );
}

export default App;