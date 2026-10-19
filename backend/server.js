const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization", "x-admin-pin"] }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const SongSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, default: "" },
  movie: { type: String, default: "" },
  src: { type: String, required: true },
  tag: { type: String, default: "Our Special Song 🌸" },
  emoji: { type: String, default: "💖" },
  lyrics: { type: String, default: "" },
  dedication: { type: String, default: "" }
}, { timestamps: true });

const QuizSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ text: { type: String, required: true }, isCorrect: { type: Boolean, default: true } }],
  praise: { type: String, default: "Hehe, 100% Correct! Tumhari muskurahat hi meri favorite cheez hai! 🥹" }
}, { timestamps: true });

const SettingsSchema = new mongoose.Schema({
  welcomeThoughts: [{ type: String }],
  passwords: [{ type: String }],
  finalLetter: { quote: { type: String, default: "" }, paragraphs: [{ type: String }] },
  adminPin: { type: String, default: "Muskan@Forever#2026" }
}, { timestamps: true });

const EnvelopeSchema = new mongoose.Schema({
  title: { type: String, default: "A LITTLE LETTER FOR YOU" },
  sender: { type: String, default: "Tere Liye Khass" },
  receiver: { type: String, default: "Muskan" },
  letterPreview: { type: String, default: "Tap To Open ♡" },
  fullMessage: { type: String, default: "" }
}, { timestamps: true });

const Song = mongoose.models.Song || mongoose.model("Song", SongSchema);
const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);
const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
const Envelope = mongoose.models.Envelope || mongoose.model("Envelope", EnvelopeSchema);

const MASTER_ADMIN_PIN = process.env.ADMIN_PIN || "Muskan@Forever#2026";

const DEFAULT_SONGS = [
  { _id: "default_song_1", id: "default_song_1", title: "Tum Se Hi", movie: "Jab We Met", artist: "Mohit Chauhan, Pritam", tag: "Our Special Song 🌸", emoji: "💖", src: "/songs/romantic-melody.mp3", lyrics: "Aadha sa vaada, aadhe se tum... Meri har khushi tum se hi hai! 💕", dedication: "Har pal jo tumhare saath guzarta hai, wahi meri zindagi ka sabse khoobsurat lamha hai." },
  { _id: "default_song_2", id: "default_song_2", title: "Raataan Lambiyan", movie: "Shershaah", artist: "Jubin Nautiyal, Asees Kaur", tag: "Late Night Thoughts 🌙", emoji: "✨", src: "/songs/cozy-love-beats.mp3", lyrics: "Kaatan kaise raataan o saawre... Jiya nahi jaata sun baawre! 🌹", dedication: "Raat ho ya din, bas ek tumhara pyaara sa khayal mere dil mein muskurata hai." },
  { _id: "default_song_3", id: "default_song_3", title: "Pehla Nasha", movie: "Jo Jeeta Wohi Sikandar", artist: "Udit Narayan, Sadhana Sargam", tag: "Timeless Romance 💫", emoji: "🥰", src: "/songs/romantic-melody.mp3", lyrics: "Pehla nasha, pehla khumaar... Naya pyaar hai, naya intezaar! 💌", dedication: "Tum meri pehli, aakhri aur hamesha ki sabse pyaari pasand ho, Meri Muskan." },
  { _id: "default_song_4", id: "default_song_4", title: "Muskan's Cozy Melody", movie: "Acoustic Love Lo-Fi", artist: "Made Specially For You", tag: "Peaceful Vibing 🎧", emoji: "💕", src: "/songs/cozy-love-beats.mp3", lyrics: "Close your eyes, feel the peace, and know how deeply you are loved. 🌸", dedication: "Jab bhi thak jao ya udaas ho, yeh sun lena aur yaad rakhna main hamesha tumhare saath hoon." }
];

const DEFAULT_QUIZZES = [
  { _id: "default_quiz_1", id: "default_quiz_1", question: "Who has the most beautiful and infectious smile in the world? 🌸", options: [{ text: "Meri Muskan, without a doubt! 💖", isCorrect: true }, { text: "Definitely Muskan 🥰", isCorrect: true }, { text: "Only & Only Muskan! 💕", isCorrect: true }], praise: "Hehe, 100% Correct! Tumhari muskurahat hi meri favorite cheez hai! 🥹" },
  { _id: "default_quiz_2", id: "default_quiz_2", question: "What is my absolute favorite thing about you? 🌹", options: [{ text: "Your innocent, cute laugh 💫", isCorrect: true }, { text: "Your golden, caring heart 💖", isCorrect: true }, { text: "Literally EVERYTHING about you! ✨", isCorrect: true }], praise: "Sahi jawaab! Tum jaisi ho, bilkul perfect ho meri Muskan. 🌹❤️" },
  { _id: "default_quiz_3", id: "default_quiz_3", question: "Where is my favorite place in the entire world? 🌍", options: [{ text: "Wherever you are 🏡", isCorrect: true }, { text: "Right next to you 🫂", isCorrect: true }, { text: "Safe inside your heart ✨", isCorrect: true }], praise: "Yes! Jahan tum ho, wahi mera sukoon hai. 💕" }
];

const DEFAULT_SETTINGS = {
  adminPin: MASTER_ADMIN_PIN,
  welcomeThoughts: ["Muskan, your smile genuinely lights up my whole universe. 🌸💕", "Out of all the stars in the sky, you shine the brightest. 🌙💖", "Having you in this world makes every single day special. 🌹✨"],
  passwords: ["muskan", "meri muskan", "cutie", "love", "pyaar", "jaan", "smile", "143"],
  finalLetter: {
    quote: "In a world full of temporary moments, my love for you is my most permanent truth.",
    paragraphs: ["Meri Pyari Muskan,", "Pata hai, jab bhi main tumhare baare mein sochta hoon, mere chehre pe apne aap ek muskurahat aa jaati hai. Tumne meri zindagi mein aake sab kuch itna khoobsurat aur aasaan bana diya hai.", "Main bas itna chahta hoon ke tum hamesha khush raho, hasti raho, aur yeh yaad rakho ke koi hai jo tumse be-inteha pyaar karta hai.", "Hamesha tumhara, sirf tumhara. ❤️"]
  }
};

const DEFAULT_ENVELOPE = {
  title: "A LITTLE LETTER FOR YOU",
  sender: "Tere Liye Khass",
  receiver: "Muskan",
  letterPreview: "Tap To Open ♡",
  fullMessage: "Pata Hai, Main Tumhare Liye Kuch Special Banana Chahta Tha. Kuch Aisa Jo Sirf Tumhara Ho.\n\nIsliye Yeh Chhoti Si Website Banayi Hai. Iske Har Page Mein Ek Chhoti Si Surprise Aur Mere Dil Ki Ek Baat Tumhara Intezaar Kar Rahi Hai. 🥹\n\nToh Chalo, Meri Muskan... Abhi Toh Surprise Shuru Hua Hai! 💌"
};

let memoryStore = {
  songs: JSON.parse(JSON.stringify(DEFAULT_SONGS)),
  quizzes: JSON.parse(JSON.stringify(DEFAULT_QUIZZES)),
  settings: JSON.parse(JSON.stringify(DEFAULT_SETTINGS)),
  envelope: JSON.parse(JSON.stringify(DEFAULT_ENVELOPE))
};

function isDbReady() {
  return mongoose.connection.readyState === 1;
}

async function seedDatabaseIfEmpty() {
  if (!isDbReady()) return;
  try {
    if ((await Song.countDocuments()) === 0) await Song.insertMany(DEFAULT_SONGS.map(({ _id, id, ...r }) => r));
    if ((await Quiz.countDocuments()) === 0) await Quiz.insertMany(DEFAULT_QUIZZES.map(({ _id, id, ...r }) => r));
    if ((await Settings.countDocuments()) === 0) await Settings.create(DEFAULT_SETTINGS);
    if ((await Envelope.countDocuments()) === 0) await Envelope.create(DEFAULT_ENVELOPE);
  } catch (err) {
    console.error("Seed error:", err.message);
  }
}

async function getSiteSettings() {
  if (isDbReady()) {
    try {
      let doc = await Settings.findOne();
      if (!doc) doc = await Settings.create(DEFAULT_SETTINGS);
      return doc.toObject();
    } catch (e) { }
  }
  return memoryStore.settings;
}

// ==========================================
// SECURITY MIDDLEWARE: VERIFY ADMIN PIN
// ==========================================
async function verifyAdminPin(req, res, next) {
  try {
    const clientPin = (req.headers["x-admin-pin"] || req.body?.pin || "").trim();
    if (!clientPin) {
      return res.status(401).json({ success: false, message: "Admin PIN required!" });
    }

    const currentSettings = await getSiteSettings();
    const validDbPin = currentSettings?.adminPin || MASTER_ADMIN_PIN;

    if (clientPin === validDbPin || clientPin === MASTER_ADMIN_PIN) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "❌ Incorrect Admin Password! Access Denied."
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Auth error" });
  }
}

// Verify PIN Endpoint for Login Screen
app.post("/api/admin/verify", verifyAdminPin, (req, res) => {
  res.json({ success: true, message: "Admin Authenticated! 🔐" });
});

async function getAllSongs() {
  if (isDbReady()) {
    try {
      const docs = await Song.find().sort({ createdAt: -1 });
      return docs.map((d) => ({ ...d.toObject(), _id: d._id.toString(), id: d._id.toString() }));
    } catch (e) { }
  }
  return memoryStore.songs;
}

async function getAllQuizzes() {
  if (isDbReady()) {
    try {
      const docs = await Quiz.find().sort({ createdAt: 1 });
      return docs.map((d) => ({ ...d.toObject(), _id: d._id.toString(), id: d._id.toString() }));
    } catch (e) { }
  }
  return memoryStore.quizzes;
}

async function getEnvelopeData() {
  if (isDbReady()) {
    try {
      let doc = await Envelope.findOne();
      if (!doc) doc = await Envelope.create(DEFAULT_ENVELOPE);
      return doc.toObject();
    } catch (e) { }
  }
  return memoryStore.envelope;
}

// PUBLIC CONTENT ROUTE (Admin PIN hidden from public response!)
app.get("/api/content", async (req, res) => {
  try {
    const [songs, quizzes, settings, envelope] = await Promise.all([
      getAllSongs(),
      getAllQuizzes(),
      getSiteSettings(),
      getEnvelopeData()
    ]);

    res.json({
      success: true,
      songs,
      quizzes,
      settings: {
        welcomeThoughts: settings?.welcomeThoughts || DEFAULT_SETTINGS.welcomeThoughts,
        passwords: settings?.passwords || DEFAULT_SETTINGS.passwords,
        finalLetter: settings?.finalLetter || DEFAULT_SETTINGS.finalLetter
      },
      envelope
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PROTECTED ADMIN ROUTES
app.post("/api/admin/songs", verifyAdminPin, async (req, res) => {
  try {
    const { title, artist, movie, src, url, tag, emoji, lyrics, dedication } = req.body;
    const audioSrc = src || url;
    if (!title || !audioSrc) return res.status(400).json({ success: false, message: "Title aur Audio Link zaroori hai!" });

    const payload = { title, artist: artist || "Unknown Artist", movie: movie || "", src: audioSrc, tag: tag || "Our Special Song 🌸", emoji: emoji || "💖", lyrics: lyrics || "", dedication: dedication || "" };

    if (isDbReady()) {
      try {
        const created = await Song.create(payload);
        const obj = { ...created.toObject(), _id: created._id.toString(), id: created._id.toString() };
        return res.status(201).json({ success: true, song: obj });
      } catch (e) { }
    }

    const newSong = { ...payload, _id: "song_" + Date.now(), id: "song_" + Date.now() };
    memoryStore.songs.unshift(newSong);
    res.status(201).json({ success: true, song: newSong });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete("/api/admin/songs/:id", verifyAdminPin, async (req, res) => {
  try {
    const idStr = String(req.params.id || "");
    if (isDbReady() && mongoose.Types.ObjectId.isValid(idStr)) {
      await Song.findByIdAndDelete(idStr).catch(() => { });
    }
    memoryStore.songs = memoryStore.songs.filter((s) => String(s._id) !== idStr && String(s.id) !== idStr);
    res.json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/admin/quizzes", verifyAdminPin, async (req, res) => {
  try {
    const { question, options, praise } = req.body;
    if (!question || !options || !options.length) return res.status(400).json({ success: false, message: "Question aur options zaroori hain!" });

    const payload = { question, options: options.map((o) => (typeof o === "string" ? { text: o, isCorrect: true } : o)), praise: praise || "Hehe, 100% Correct! 🥹" };

    if (isDbReady()) {
      try {
        const created = await Quiz.create(payload);
        const obj = { ...created.toObject(), _id: created._id.toString(), id: created._id.toString() };
        return res.status(201).json({ success: true, quiz: obj });
      } catch (e) { }
    }

    const newQuiz = { ...payload, _id: "quiz_" + Date.now(), id: "quiz_" + Date.now() };
    memoryStore.quizzes.unshift(newQuiz);
    res.status(201).json({ success: true, quiz: newQuiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete("/api/admin/quizzes/:id", verifyAdminPin, async (req, res) => {
  try {
    const idStr = String(req.params.id || "");
    if (isDbReady() && mongoose.Types.ObjectId.isValid(idStr)) {
      await Quiz.findByIdAndDelete(idStr).catch(() => { });
    }
    memoryStore.quizzes = memoryStore.quizzes.filter((q) => String(q._id) !== idStr && String(q.id) !== idStr);
    res.json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/admin/settings", verifyAdminPin, async (req, res) => {
  try {
    const { welcomeThoughts, passwords, finalLetter, newAdminPin } = req.body;
    if (isDbReady()) {
      try {
        let doc = (await Settings.findOne()) || new Settings({});
        if (welcomeThoughts) doc.welcomeThoughts = welcomeThoughts;
        if (passwords) doc.passwords = passwords;
        if (finalLetter) doc.finalLetter = finalLetter;
        if (newAdminPin && newAdminPin.trim().length >= 6) {
          doc.adminPin = newAdminPin.trim();
        }
        await doc.save();
      } catch (e) { }
    }
    memoryStore.settings = {
      ...memoryStore.settings,
      ...req.body,
      adminPin:
        newAdminPin && newAdminPin.trim().length >= 6
          ? newAdminPin.trim()
          : memoryStore.settings.adminPin
    };
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/api/envelope", verifyAdminPin, async (req, res) => {
  try {
    if (isDbReady()) {
      try {
        let doc = (await Envelope.findOne()) || new Envelope({});
        Object.assign(doc, req.body);
        await doc.save();
      } catch (e) { }
    }
    memoryStore.envelope = { ...memoryStore.envelope, ...req.body };
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

async function startServer() {
  if (process.env.MONGO_URI) {
    try {
      await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 6000 });
      console.log("✅ MongoDB Atlas Connected!");
      await seedDatabaseIfEmpty();
    } catch (err) {
      console.log("⚠️ MongoDB Offline, using In-Memory Mode:", err.message);
    }
  } else {
    console.log("ℹ️ Running in In-Memory Mode");
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`❤️ Server running on http://localhost:${PORT}`));
}

startServer();