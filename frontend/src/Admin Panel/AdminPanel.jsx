import { useState, useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AdminPanel({ onBack, onDataChange }) {
    const [pin, setPin] = useState(sessionStorage.getItem("admin_pin") || "");
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [loginError, setLoginError] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [activeTab, setActiveTab] = useState("songs");
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ text: "", type: "" });

    // Data state
    const [songs, setSongs] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [settings, setSettings] = useState({
        welcomeThoughts: "",
        passwords: "",
        finalQuote: "",
        finalParagraphs: "",
        envelopeMessage: "",
        newAdminPin: "",
    });

    // Form states
    const [songForm, setSongForm] = useState({
        title: "",
        artist: "",
        movie: "",
        src: "",
        tag: "Our Special Song 🌸",
        emoji: "💖",
        lyrics: "",
        dedication: "",
    });

    const [quizForm, setQuizForm] = useState({
        question: "",
        opt1: "",
        opt2: "",
        opt3: "",
        praise:
            "Hehe, 100% Correct! Tumhari muskurahat hi meri favorite cheez hai! 🥹",
    });

    const notify = (text, type = "success") => {
        setNotification({ text, type });
        setTimeout(() => setNotification({ text: "", type: "" }), 3500);
    };

    const loadData = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${BACKEND_URL}/api/content`);
            const data = await res.json();

            if (data.success) {
                setSongs(data.songs || []);
                setQuizzes(data.quizzes || []);
                setSettings((prev) => ({
                    ...prev,
                    welcomeThoughts: (data.settings?.welcomeThoughts || []).join(", "),
                    passwords: (data.settings?.passwords || []).join(", "),
                    finalQuote: data.settings?.finalLetter?.quote || "",
                    finalParagraphs: (data.settings?.finalLetter?.paragraphs || []).join(
                        "\n\n"
                    ),
                    envelopeMessage: data.envelope?.fullMessage || "",
                }));
            }
        } catch (err) {
            notify("Backend se data load nahi ho saka!", "error");
        } finally {
            setLoading(false);
        }
    };

    // Verify saved PIN in sessionStorage on mount
    useEffect(() => {
        const savedPin = sessionStorage.getItem("admin_pin");
        if (savedPin) {
            fetch(`${BACKEND_URL}/api/admin/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-pin": savedPin,
                },
            })
                .then((r) => r.json())
                .then((data) => {
                    if (data.success) {
                        setIsUnlocked(true);
                        loadData();
                    } else {
                        sessionStorage.removeItem("admin_pin");
                    }
                })
                .catch(() => { });
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError("");
        if (!pin.trim()) return;

        try {
            setVerifying(true);
            const res = await fetch(`${BACKEND_URL}/api/admin/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-pin": pin.trim(),
                },
            });
            const data = await res.json();

            if (res.ok && data.success) {
                sessionStorage.setItem("admin_pin", pin.trim());
                setIsUnlocked(true);
                loadData();
                notify("Admin unlocked successfully! 🔐");
            } else {
                setLoginError(data.message || "❌ Galat Admin Password!");
            }
        } catch (err) {
            setLoginError("⚠️ Server se connect nahi ho saka!");
        } finally {
            setVerifying(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem("admin_pin");
        setPin("");
        setIsUnlocked(false);
    };

    const handleAddSong = async (e) => {
        e.preventDefault();
        if (!songForm.title || !songForm.src) {
            return notify("Song Title aur Audio Link/Path zaroori hai!", "error");
        }

        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/songs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-pin": pin,
                },
                body: JSON.stringify(songForm),
            });
            const data = await res.json();

            if (data.success) {
                setSongs((prev) => [data.song, ...prev]);
                setSongForm({
                    title: "",
                    artist: "",
                    movie: "",
                    src: "",
                    tag: "Our Special Song 🌸",
                    emoji: "💖",
                    lyrics: "",
                    dedication: "",
                });
                if (onDataChange) onDataChange();
                notify("Gaana add ho gaya! 🎵");
            } else {
                notify(data.message || "Failed to add song", "error");
            }
        } catch (err) {
            notify("Network error aayi song add karne mein", "error");
        }
    };

    const handleDeleteSong = async (id) => {
        if (!window.confirm("Kya aap yeh gaana delete karna chahte hain?")) return;
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/songs/${id}`, {
                method: "DELETE",
                headers: { "x-admin-pin": pin },
            });
            const data = await res.json();
            if (data.success) {
                setSongs((prev) => prev.filter((s) => s._id !== id && s.id !== id));
                if (onDataChange) onDataChange();
                notify("Song delete ho gaya!");
            } else {
                notify(data.message, "error");
            }
        } catch (err) {
            notify("Error deleting song", "error");
        }
    };

    const handleAddQuiz = async (e) => {
        e.preventDefault();
        if (!quizForm.question || !quizForm.opt1) {
            return notify("Question aur kam az kam 1 Option lazmi hai!", "error");
        }

        const payload = {
            question: quizForm.question,
            options: [
                { text: quizForm.opt1, isCorrect: true },
                { text: quizForm.opt2, isCorrect: true },
                { text: quizForm.opt3, isCorrect: true },
            ].filter((o) => o.text.trim() !== ""),
            praise: quizForm.praise,
        };

        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/quizzes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-pin": pin,
                },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (data.success) {
                setQuizzes((prev) => [data.quiz, ...prev]);
                setQuizForm({
                    question: "",
                    opt1: "",
                    opt2: "",
                    opt3: "",
                    praise:
                        "Hehe, 100% Correct! Tumhari muskurahat hi meri favorite cheez hai! 🥹",
                });
                if (onDataChange) onDataChange();
                notify("Quiz question add ho gaya! 🎯");
            } else {
                notify(data.message, "error");
            }
        } catch (err) {
            notify("Error adding quiz", "error");
        }
    };

    const handleDeleteQuiz = async (id) => {
        if (!window.confirm("Question delete karna chahte hain?")) return;
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/quizzes/${id}`, {
                method: "DELETE",
                headers: { "x-admin-pin": pin },
            });
            const data = await res.json();
            if (data.success) {
                setQuizzes((prev) => prev.filter((q) => q._id !== id && q.id !== id));
                if (onDataChange) onDataChange();
                notify("Quiz question delete ho gaya!");
            } else {
                notify(data.message, "error");
            }
        } catch (err) {
            notify("Error deleting quiz", "error");
        }
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                welcomeThoughts: settings.welcomeThoughts
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                passwords: settings.passwords
                    .split(",")
                    .map((p) => p.trim().toLowerCase())
                    .filter(Boolean),
                finalLetter: {
                    quote: settings.finalQuote,
                    paragraphs: settings.finalParagraphs
                        .split("\n")
                        .map((p) => p.trim())
                        .filter(Boolean),
                },
                newAdminPin: settings.newAdminPin.trim() || undefined,
            };

            const [resSettings] = await Promise.all([
                fetch(`${BACKEND_URL}/api/admin/settings`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-admin-pin": pin,
                    },
                    body: JSON.stringify(payload),
                }),
                fetch(`${BACKEND_URL}/api/envelope`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "x-admin-pin": pin,
                    },
                    body: JSON.stringify({ fullMessage: settings.envelopeMessage }),
                }),
            ]);

            const data = await resSettings.json();
            if (data.success) {
                if (settings.newAdminPin && settings.newAdminPin.trim().length >= 6) {
                    const updatedPin = settings.newAdminPin.trim();
                    setPin(updatedPin);
                    sessionStorage.setItem("admin_pin", updatedPin);
                    setSettings((prev) => ({ ...prev, newAdminPin: "" }));
                }
                if (onDataChange) onDataChange();
                notify("Settings, Letters aur Password update ho gaye! ✨");
            } else {
                notify(data.message, "error");
            }
        } catch (err) {
            notify("Error saving settings", "error");
        }
    };

    // PIN Lock Screen
    if (!isUnlocked) {
        return (
            <section className="relative z-10 w-full max-w-[460px] rounded-3xl border border-white/95 bg-white/90 px-4 py-8 sm:px-9 text-center shadow-2xl shadow-rose-200/50 backdrop-blur-xl transition-all duration-300">
                <div className="text-4xl mb-3 animate-pulse">🔐</div>
                <h2 className="font-['Dancing_Script'] text-4xl font-bold text-[#713c55] mb-1">
                    Protected Admin Portal
                </h2>
                <p className="text-xs text-[#8a5d73] max-w-xs mx-auto mb-6 font-medium">
                    Sirf authorized admin hi songs, quizzes aur letters edit kar sakta hai.
                </p>

                <form onSubmit={handleLogin} className="space-y-3.5 max-w-sm mx-auto">
                    <input
                        type="password"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="Enter Strong Admin Password"
                        className="w-full rounded-full border border-pink-200/90 bg-white px-5 py-3 text-base sm:text-sm text-[#713c55] text-center tracking-wider focus:outline-none focus:ring-2 focus:ring-pink-300/40 font-sans shadow-inner"
                        autoFocus
                    />

                    {loginError && (
                        <p className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-2xl py-2 px-3 animate-shake">
                            {loginError}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={verifying}
                        className="w-full rounded-full bg-gradient-to-r from-[#f089b0] via-[#dc5b8e] to-[#c9447a] py-3 text-sm font-bold text-white shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-60 active:scale-95"
                    >
                        {verifying ? "Verifying Password..." : "Unlock Dashboard ➔"}
                    </button>
                </form>

                {onBack && (
                    <button
                        type="button"
                        onClick={onBack}
                        className="mt-6 text-xs font-semibold text-[#b87993] hover:text-[#713c55] underline cursor-pointer active:scale-95"
                    >
                        ← Back to Website
                    </button>
                )}
            </section>
        );
    }

    return (
        <section className="relative z-10 w-full max-w-[850px] rounded-3xl border border-white/95 bg-white/90 px-4 py-6 sm:px-8 sm:py-8 text-left shadow-2xl shadow-rose-200/50 backdrop-blur-xl max-h-[86vh] overflow-y-auto">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between border-b border-pink-100 pb-3.5 mb-4 gap-2">
                <div>
                    <h1 className="font-['Dancing_Script'] text-3xl sm:text-4xl font-bold text-[#dc5b8e]">
                        Surprise Control Center 🌸
                    </h1>
                    <p className="text-xs text-[#8a5d73] font-medium mt-0.5">
                        Real-time updates for Muskan's surprises
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="text-xs font-bold text-[#dc5b8e] border border-pink-200 rounded-full px-3.5 py-1.5 hover:bg-pink-50 transition cursor-pointer active:scale-95"
                        >
                            View Website ➔
                        </button>
                    )}
                    <button
                        onClick={handleLogout}
                        className="text-xs font-semibold text-rose-500 hover:text-rose-700 underline cursor-pointer px-1 active:scale-95"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Notification alert */}
            {notification.text && (
                <div
                    className={`mb-4 rounded-2xl p-3 text-xs font-bold flex justify-between items-center transition-all ${
                        notification.type === "error"
                            ? "bg-rose-100 border border-rose-200 text-rose-700"
                            : "bg-emerald-100 border border-emerald-200 text-emerald-700"
                    }`}
                >
                    <span>{notification.text}</span>
                    <button
                        onClick={() => setNotification({ text: "", type: "" })}
                        className="text-xs font-bold ml-2 p-1 cursor-pointer"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Tab navigation */}
            <div className="flex gap-2 border-b border-pink-100 pb-3 mb-5 overflow-x-auto no-scrollbar text-xs sm:text-sm">
                <button
                    onClick={() => setActiveTab("songs")}
                    className={`px-3.5 py-1.5 rounded-full font-bold transition whitespace-nowrap cursor-pointer active:scale-95 ${
                        activeTab === "songs"
                            ? "bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-xs"
                            : "text-[#713c55] hover:bg-pink-50"
                    }`}
                >
                    🎵 Songs ({songs.length})
                </button>
                <button
                    onClick={() => setActiveTab("quizzes")}
                    className={`px-3.5 py-1.5 rounded-full font-bold transition whitespace-nowrap cursor-pointer active:scale-95 ${
                        activeTab === "quizzes"
                            ? "bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-xs"
                            : "text-[#713c55] hover:bg-pink-50"
                    }`}
                >
                    🎯 Quizzes ({quizzes.length})
                </button>
                <button
                    onClick={() => setActiveTab("letters")}
                    className={`px-3.5 py-1.5 rounded-full font-bold transition whitespace-nowrap cursor-pointer active:scale-95 ${
                        activeTab === "letters"
                            ? "bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-xs"
                            : "text-[#713c55] hover:bg-pink-50"
                    }`}
                >
                    📜 Letters & Security
                </button>
            </div>

            {loading && (
                <p className="text-center text-xs font-semibold text-pink-400 py-4 animate-pulse">
                    Fetching live data from Backend...
                </p>
            )}

            {/* TAB 1: SONGS */}
            {activeTab === "songs" && (
                <div className="space-y-5">
                    <form
                        onSubmit={handleAddSong}
                        className="rounded-3xl border border-pink-200 bg-pink-50/60 p-4 sm:p-5 space-y-3 text-xs sm:text-sm"
                    >
                        <h3 className="font-bold text-[#b24d77] uppercase tracking-wider text-xs">
                            ➕ Add New Track
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <input
                                placeholder="Song Title (e.g. Tum Se Hi)"
                                value={songForm.title}
                                onChange={(e) =>
                                    setSongForm({ ...songForm, title: e.target.value })
                                }
                                className="p-2.5 rounded-2xl border border-pink-200 bg-white text-base sm:text-xs focus:outline-pink-400"
                            />
                            <input
                                placeholder="Artist (e.g. Mohit Chauhan)"
                                value={songForm.artist}
                                onChange={(e) =>
                                    setSongForm({ ...songForm, artist: e.target.value })
                                }
                                className="p-2.5 rounded-2xl border border-pink-200 bg-white text-base sm:text-xs focus:outline-pink-400"
                            />
                            <input
                                placeholder="Movie / Album"
                                value={songForm.movie}
                                onChange={(e) =>
                                    setSongForm({ ...songForm, movie: e.target.value })
                                }
                                className="p-2.5 rounded-2xl border border-pink-200 bg-white text-base sm:text-xs focus:outline-pink-400"
                            />
                            <input
                                placeholder="Audio URL (.mp3, YouTube, or /songs/...)"
                                value={songForm.src}
                                onChange={(e) =>
                                    setSongForm({ ...songForm, src: e.target.value })
                                }
                                className="p-2.5 rounded-2xl border border-pink-200 bg-white text-base sm:text-xs focus:outline-pink-400"
                            />
                            <input
                                placeholder="Tag (e.g. Our Special Song 🌸)"
                                value={songForm.tag}
                                onChange={(e) =>
                                    setSongForm({ ...songForm, tag: e.target.value })
                                }
                                className="p-2.5 rounded-2xl border border-pink-200 bg-white text-base sm:text-xs focus:outline-pink-400"
                            />
                            <input
                                placeholder="Emoji (e.g. 💖)"
                                value={songForm.emoji}
                                onChange={(e) =>
                                    setSongForm({ ...songForm, emoji: e.target.value })
                                }
                                className="p-2.5 rounded-2xl border border-pink-200 bg-white text-base sm:text-xs focus:outline-pink-400"
                            />
                            <input
                                placeholder="Short Romantic Lyrics"
                                value={songForm.lyrics}
                                onChange={(e) =>
                                    setSongForm({ ...songForm, lyrics: e.target.value })
                                }
                                className="p-2.5 rounded-2xl border border-pink-200 bg-white sm:col-span-2 text-base sm:text-xs focus:outline-pink-400"
                            />
                            <textarea
                                placeholder="Dedication message for Muskan..."
                                value={songForm.dedication}
                                onChange={(e) =>
                                    setSongForm({ ...songForm, dedication: e.target.value })
                                }
                                className="p-2.5 rounded-2xl border border-pink-200 bg-white sm:col-span-2 text-base sm:text-xs focus:outline-pink-400"
                                rows={2}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-[#f089b0] via-[#dc5b8e] to-[#c9447a] text-white font-bold text-xs shadow-xs hover:shadow-md cursor-pointer active:scale-95"
                        >
                            Add Song To Live Playlist
                        </button>
                    </form>

                    <div className="space-y-2">
                        <h4 className="text-xs font-bold text-[#713c55] uppercase tracking-wider">
                            Current Songs ({songs.length})
                        </h4>
                        {songs.map((song) => (
                            <div
                                key={song._id || song.id}
                                className="flex items-center justify-between p-3 rounded-2xl border border-pink-100 bg-white hover:bg-pink-50/30 transition shadow-xs gap-2"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs sm:text-sm font-bold text-[#713c55] truncate">
                                        {song.emoji} {song.title}{" "}
                                        <span className="text-[11px] font-normal text-[#926a7e]">
                                            • {song.movie || song.artist}
                                        </span>
                                    </p>
                                    <p className="text-[11px] text-[#b87993] truncate italic">
                                        {song.dedication || song.src}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDeleteSong(song._id || song.id)}
                                    className="text-xs text-rose-500 hover:text-rose-700 font-bold p-1 cursor-pointer flex-shrink-0 active:scale-95"
                                >
                                    Delete ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 2: QUIZZES */}
            {activeTab === "quizzes" && (
                <div className="space-y-5">
                    <form
                        onSubmit={handleAddQuiz}
                        className="rounded-3xl border border-pink-200 bg-pink-50/60 p-4 sm:p-5 space-y-3 text-xs sm:text-sm"
                    >
                        <h3 className="font-bold text-[#b24d77] uppercase tracking-wider text-xs">
                            ➕ Add Quiz Question
                        </h3>
                        <div className="space-y-2.5">
                            <input
                                placeholder="Question text for Muskan..."
                                value={quizForm.question}
                                onChange={(e) =>
                                    setQuizForm({ ...quizForm, question: e.target.value })
                                }
                                className="w-full p-2.5 rounded-2xl border border-pink-200 bg-white text-base sm:text-xs focus:outline-pink-400"
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <input
                                    placeholder="Option 1"
                                    value={quizForm.opt1}
                                    onChange={(e) =>
                                        setQuizForm({ ...quizForm, opt1: e.target.value })
                                    }
                                    className="p-2.5 rounded-2xl border border-pink-200 bg-white text-base sm:text-xs focus:outline-pink-400"
                                />
                                <input
                                    placeholder="Option 2"
                                    value={quizForm.opt2}
                                    onChange={(e) =>
                                        setQuizForm({ ...quizForm, opt2: e.target.value })
                                    }
                                    className="p-2.5 rounded-2xl border border-pink-200 bg-white text-base sm:text-xs focus:outline-pink-400"
                                />
                                <input
                                    placeholder="Option 3"
                                    value={quizForm.opt3}
                                    onChange={(e) =>
                                        setQuizForm({ ...quizForm, opt3: e.target.value })
                                    }
                                    className="p-2.5 rounded-2xl border border-pink-200 bg-white text-base sm:text-xs focus:outline-pink-400"
                                />
                            </div>
                            <input
                                placeholder="Praise popup when clicked"
                                value={quizForm.praise}
                                onChange={(e) =>
                                    setQuizForm({ ...quizForm, praise: e.target.value })
                                }
                                className="w-full p-2.5 rounded-2xl border border-pink-200 bg-white text-base sm:text-xs focus:outline-pink-400"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-[#f089b0] via-[#dc5b8e] to-[#c9447a] text-white font-bold text-xs shadow-xs hover:shadow-md cursor-pointer active:scale-95"
                        >
                            Add Question
                        </button>
                    </form>

                    <div className="space-y-2">
                        <h4 className="text-xs font-bold text-[#713c55] uppercase tracking-wider">
                            Existing Questions ({quizzes.length})
                        </h4>
                        {quizzes.map((q) => (
                            <div
                                key={q._id || q.id}
                                className="flex items-center justify-between p-3.5 rounded-2xl border border-pink-100 bg-white shadow-xs gap-2"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs sm:text-sm font-bold text-[#713c55] truncate">
                                        {q.question}
                                    </p>
                                    <p className="text-[11px] text-[#926a7e] truncate">
                                        {q.options?.map((o) => o.text || o).join("  •  ")}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDeleteQuiz(q._id || q.id)}
                                    className="text-xs text-rose-500 hover:text-rose-700 font-bold p-1 cursor-pointer flex-shrink-0 active:scale-95"
                                >
                                    Delete ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 3: LETTERS & SECURITY */}
            {activeTab === "letters" && (
                <form onSubmit={handleSaveSettings} className="space-y-4 text-xs sm:text-sm">
                    <div>
                        <label className="block font-bold text-[#713c55] mb-1">
                            Welcome Screen Rotating Thoughts (Comma separated):
                        </label>
                        <textarea
                            rows={2}
                            value={settings.welcomeThoughts}
                            onChange={(e) =>
                                setSettings({ ...settings, welcomeThoughts: e.target.value })
                            }
                            className="w-full p-2.5 rounded-2xl border border-pink-200 bg-white text-base sm:text-xs focus:outline-pink-400"
                        />
                    </div>

                    <div>
                        <label className="block font-bold text-[#713c55] mb-1">
                            Envelope Message (Har paragraph ke baad Enter press karein):
                        </label>
                        <textarea
                            rows={4}
                            value={settings.envelopeMessage}
                            onChange={(e) =>
                                setSettings({ ...settings, envelopeMessage: e.target.value })
                            }
                            className="w-full p-2.5 rounded-2xl border border-pink-200 bg-white text-base sm:text-xs focus:outline-pink-400 leading-relaxed"
                        />
                    </div>

                    <div>
                        <label className="block font-bold text-[#713c55] mb-1">
                            Unlock Passwords (Comma separated):
                        </label>
                        <input
                            value={settings.passwords}
                            onChange={(e) =>
                                setSettings({ ...settings, passwords: e.target.value })
                            }
                            className="w-full p-2.5 rounded-2xl border border-pink-200 bg-white text-base sm:text-xs focus:outline-pink-400"
                        />
                    </div>

                    <div>
                        <label className="block font-bold text-[#713c55] mb-1">
                            Final Letter Highlight Quote:
                        </label>
                        <input
                            value={settings.finalQuote}
                            onChange={(e) =>
                                setSettings({ ...settings, finalQuote: e.target.value })
                            }
                            className="w-full p-2.5 rounded-2xl border border-pink-200 bg-white text-base sm:text-xs focus:outline-pink-400"
                        />
                    </div>

                    <div>
                        <label className="block font-bold text-[#713c55] mb-1">
                            Final Letter Paragraphs (Har paragraph ke baad Enter press karein):
                        </label>
                        <textarea
                            rows={4}
                            value={settings.finalParagraphs}
                            onChange={(e) =>
                                setSettings({ ...settings, finalParagraphs: e.target.value })
                            }
                            className="w-full p-2.5 rounded-2xl border border-pink-200 bg-white text-base sm:text-xs focus:outline-pink-400 leading-relaxed"
                        />
                    </div>

                    <div className="p-3.5 rounded-2xl border border-rose-200 bg-rose-50/60">
                        <label className="block font-bold text-rose-700 mb-1">
                            🔐 Change Admin Strong Password (Optional - min 6 chars):
                        </label>
                        <input
                            type="password"
                            placeholder="Leave blank to keep current password"
                            value={settings.newAdminPin}
                            onChange={(e) =>
                                setSettings({ ...settings, newAdminPin: e.target.value })
                            }
                            className="w-full p-2.5 rounded-2xl border border-rose-200 bg-white text-base sm:text-xs focus:outline-rose-400"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 rounded-full bg-gradient-to-r from-[#f089b0] via-[#dc5b8e] to-[#c9447a] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition cursor-pointer active:scale-95"
                    >
                        Update Letters, Envelope & Security
                    </button>
                </form>
            )}
        </section>
    );
}

export default AdminPanel;