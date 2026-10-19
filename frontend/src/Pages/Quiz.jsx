import { useState, useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const FALLBACK_QUESTIONS = [
  {
    id: 1,
    question: "Who has the most beautiful and infectious smile in the world? 🌸",
    options: [
      { text: "Meri Muskan, without a doubt! 💖", isCorrect: true },
      { text: "Definitely Muskan 🎀", isCorrect: true },
      { text: "Only & Only Muskan! ✨", isCorrect: true },
    ],
    praise: "Hehe, 100% Correct! Tumhari muskurahat hi meri favorite cheez hai! 🥹",
  },
  {
    id: 2,
    question: "What is my absolute favorite thing about you? 🧸",
    options: [
      { text: "Your innocent, cute laugh 🌷", isCorrect: true },
      { text: "Your golden, caring heart 💖", isCorrect: true },
      { text: "Literally EVERYTHING about you! 🥰", isCorrect: true },
    ],
    praise: "Sahi jawaab! Tum jaisi ho, bilkul perfect ho meri Muskan. ❤️",
  },
  {
    id: 3,
    question: "Where is my favorite place in the entire world? 🌍",
    options: [
      { text: "Wherever you are 🏡", isCorrect: true },
      { text: "Right next to you 💕", isCorrect: true },
      { text: "Safe inside your heart 💌", isCorrect: true },
    ],
    praise: "Yes! Jahan tum ho, wahi mera sukoon hai. ✨",
  },
];

function Quiz({ quizzes: propQuizzes, onBack, onComplete }) {
  const [fetchedQuizzes, setFetchedQuizzes] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showPraise, setShowPraise] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!propQuizzes || propQuizzes.length === 0) {
      fetch(`${BACKEND_URL}/api/content`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.quizzes)) {
            setFetchedQuizzes(data.quizzes);
          }
        })
        .catch(() => {});
    }
  }, [propQuizzes]);

  const questionList =
    propQuizzes && propQuizzes.length > 0
      ? propQuizzes
      : fetchedQuizzes.length > 0
      ? fetchedQuizzes
      : FALLBACK_QUESTIONS;

  const safeIndex = currentQ >= questionList.length ? 0 : currentQ;
  const q = questionList[safeIndex] || FALLBACK_QUESTIONS[0];
  const progressPercent = ((safeIndex + 1) / questionList.length) * 100;

  const handleSelect = (index) => {
    setSelectedOption(index);
    setShowPraise(true);

    setTimeout(() => {
      if (safeIndex + 1 < questionList.length) {
        setCurrentQ((prev) => prev + 1);
        setSelectedOption(null);
        setShowPraise(false);
      } else {
        setIsCompleted(true);
      }
    }, 1100);
  };

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

      {/* Top Decoration */}
      <div className="text-xs tracking-widest text-[#e58bad] mb-2">
        ୨୧ ───── 🎯 ───── ୨୧
      </div>

      <p className="text-[10px] sm:text-[11px] font-bold tracking-[3px] uppercase text-[#b87993] mb-1">
        STEP 4: OUR LOVE QUIZ
      </p>

      <h1 className="font-['Dancing_Script'] text-5xl sm:text-6xl font-bold text-[#713c55] leading-tight mb-2 drop-shadow-xs">
        A Little Quiz For <span className="text-[#dc5b8e]">Muskan</span> 💖
      </h1>

      <p className="text-xs sm:text-sm leading-relaxed text-[#8a5d73] max-w-sm mx-auto mb-4 font-medium">
        Let's see how sweet your answers are! Har sawaal sirf tumhari
        muskurahat ke liye banaya gaya hai. 🌸
      </p>

      {/* Skip directly to songs shortcut */}
      <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-pink-100/80 px-3.5 py-1 border border-pink-200 shadow-xs">
        <span className="text-xs text-[#b24d77] font-semibold">
          Ready for songs?
        </span>
        <button
          type="button"
          onClick={onComplete}
          className="text-xs font-bold text-[#dc5b8e] hover:underline cursor-pointer flex items-center gap-1 active:scale-95"
        >
          <span>Jump To Music 🎵</span>
          <span>➔</span>
        </button>
      </div>

      {!isCompleted ? (
        <div className="space-y-4 max-w-md mx-auto">
          {/* Animated Cute Progress Bar */}
          <div className="space-y-1.5 px-1">
            <div className="flex justify-between items-center text-xs font-bold text-[#b87993]">
              <span>
                Question {safeIndex + 1} of {questionList.length} 🎀
              </span>
              <span>All Love Answers ❤️</span>
            </div>

            <div className="relative w-full h-2 rounded-full bg-pink-100 overflow-hidden border border-pink-200">
              <div
                className="h-full bg-gradient-to-r from-pink-400 via-rose-400 to-[#dc5b8e] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Question Box */}
          <div className="rounded-2xl border border-pink-200/90 bg-pink-50/70 p-4 shadow-xs">
            <h2 className="text-sm sm:text-base font-bold text-[#713c55] leading-snug">
              {q.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-2">
            {(q.options || []).map((opt, i) => {
              const optionText = typeof opt === "string" ? opt : opt.text;
              const isPicked = selectedOption === i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelect(i)}
                  disabled={showPraise}
                  className={`w-full text-left px-4 py-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer flex items-center justify-between active:scale-98 ${
                    isPicked
                      ? "border-emerald-400 bg-emerald-50 text-emerald-800 shadow-md scale-[1.02]"
                      : "border-pink-200/90 bg-white/95 text-[#713c55] hover:bg-pink-100/70 hover:border-pink-300 hover:shadow-xs"
                  }`}
                >
                  <span className="leading-snug pr-2">{optionText}</span>
                  <span className="flex-shrink-0 text-sm">
                    {isPicked ? "✅" : "♡"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Praise Popup */}
          {showPraise && (
            <div className="rounded-2xl border border-pink-300 bg-pink-100/90 p-3 text-xs sm:text-sm font-bold text-[#b54972] animate-pop shadow-xs">
              {q.praise ||
                "Hehe, 100% Correct! Tumhari muskurahat hi meri favorite cheez hai! 🥹"}
            </div>
          )}
        </div>
      ) : (
        /* Quiz Completed Celebration Card */
        <div className="rounded-2xl border border-pink-300 bg-gradient-to-b from-pink-50 to-white p-5 sm:p-7 shadow-lg animate-pop space-y-3.5 max-w-md mx-auto">
          <div className="text-4xl animate-bounce">🎉 💖 🌸 🧸</div>
          <h2 className="font-['Dancing_Script'] text-3xl sm:text-4xl font-bold text-[#dc5b8e]">
            100% Score! You Won My Heart! 🥰
          </h2>
          <p className="text-xs sm:text-sm text-[#713c55] font-medium leading-relaxed">
            Muskan, saare jawaab bilkul perfect the! Ab waqt hai tumhare special
            surprise ka — tumhare liye romantic songs playlist! 🎶
          </p>

          <button
            type="button"
            onClick={onComplete}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f089b0] via-[#dc5b8e] to-[#c9447a] py-3.5 px-6 text-sm sm:text-base font-bold text-white shadow-lg shadow-pink-400/40 hover:-translate-y-0.5 hover:shadow-xl active:scale-95 transition-all cursor-pointer"
          >
            <span>Open Songs Surprise Page</span>
            <span>🎵 ➔</span>
          </button>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="mt-6 flex items-center justify-between pt-3 border-t border-pink-100">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-semibold text-[#b87993] hover:text-[#713c55] transition-colors cursor-pointer inline-flex items-center gap-1 active:scale-95"
          >
            <span>←</span>
            <span>Back to Unlock</span>
          </button>
        )}

        <button
          type="button"
          onClick={onComplete}
          className="text-xs font-bold text-[#dc5b8e] hover:text-[#b54972] transition-colors cursor-pointer inline-flex items-center gap-1 ml-auto active:scale-95"
        >
          <span>Next: Songs Page</span>
          <span>➔</span>
        </button>
      </div>
    </section>
  );
}

export default Quiz;