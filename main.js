<<<<<<< HEAD
let allSurahs = [];
let currentAyahs = [];
let currentIndex = 0;
let isPlaying = false;

// ============================
// CDN AUDIO
// ============================
function getAudioUrl(surah, ayah) {
  const s = String(surah).padStart(3, "0");
  const a = String(ayah).padStart(3, "0");

  return `https://everyayah.com/data/Husary_Muallim_128kbps/${s}${a}.mp3`;
}

// ============================
// DOM
// ============================
const surahSelect = document.getElementById("surahSelect");
const startAyahSelect = document.getElementById("startAyahSelect");
const endAyahSelect = document.getElementById("endAyahSelect");

const loadBtn = document.getElementById("loadAyahsBtn");
const container = document.getElementById("ayahImagesContainer");
const spinner = document.getElementById("loadingSpinner");

const audio = document.getElementById("audioPlayer");
const info = document.getElementById("currentAyahInfo");

const playBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const playIcon = playBtn.querySelector(".fa-play");
const pauseIcon = playBtn.querySelector(".fa-pause");

// ============================
// AUDIO STATE SYNC (الأهم)
// ============================
audio.addEventListener("play", () => {
  isPlaying = true;
  updatePlayButtonUI();
});

audio.addEventListener("pause", () => {
  isPlaying = false;
  updatePlayButtonUI();
});

audio.addEventListener("ended", onEnd);

// ============================
// INIT
// ============================
document.addEventListener("DOMContentLoaded", async () => {
  await loadSurahs();

  const lastSurah = localStorage.getItem("lastSurah");
  const lastStart = localStorage.getItem("lastStart");
  const lastEnd = localStorage.getItem("lastEnd");
  const lastIndex = localStorage.getItem("lastIndex");

  if (lastSurah) {
    surahSelect.value = lastSurah;
    handleSurah();

    setTimeout(() => {
      startAyahSelect.value = lastStart || 1;
      endAyahSelect.value = lastEnd || 1;
      currentIndex = parseInt(lastIndex) || 0;
    }, 200);
  }

  surahSelect.addEventListener("change", () => {
    currentIndex = 0;
    handleSurah();
  });

  loadBtn.addEventListener("click", loadAyahs);
  playBtn.addEventListener("click", toggle);
  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  updatePlayButtonUI();
});

// ============================
// UI
// ============================
function updatePlayButtonUI() {
  if (isPlaying) {
    playIcon.style.display = "none";
    pauseIcon.style.display = "inline-block";
  } else {
    playIcon.style.display = "inline-block";
    pauseIcon.style.display = "none";
  }
}

// ============================
// LOAD SURAH LIST
// ============================
async function loadSurahs() {
  try {
    const res = await fetch("https://api.alquran.cloud/v1/surah");
    const data = await res.json();

    allSurahs = data.data;

    surahSelect.innerHTML = `<option value="" disabled selected>اختر السورة</option>`;

    allSurahs.forEach((s) => {
      surahSelect.innerHTML += `
        <option value="${s.number}">
          ${s.number}. ${s.name}
        </option>`;
    });
  } catch (err) {
    console.error(err);
  }
}

// ============================
// HANDLE SURAH
// ============================
function handleSurah() {
  const surah = allSurahs.find((s) => s.number == surahSelect.value);
  if (!surah) return;

  const count = surah.numberOfAyahs;

  startAyahSelect.innerHTML = "";
  endAyahSelect.innerHTML = "";

  for (let i = 1; i <= count; i++) {
    startAyahSelect.innerHTML += `<option value="${i}">${i}</option>`;
    endAyahSelect.innerHTML += `<option value="${i}">${i}</option>`;
  }

  startAyahSelect.disabled = false;
  endAyahSelect.disabled = false;

  endAyahSelect.value = count;
}

// ============================
// LOAD AYAHs
// ============================
async function loadAyahs() {
  const surah = +surahSelect.value;
  const start = +startAyahSelect.value;
  const end = +endAyahSelect.value;

  if (!surah || start > end) return;

  currentAyahs = [];
  currentIndex = 0;

  container.innerHTML = "";
  spinner.classList.remove("d-none");

  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${surah}/ar`);
    const data = await res.json();

    currentAyahs = data.data.ayahs.slice(start - 1, end).map((ayah) => ({
      ayah: ayah.numberInSurah,
      surah,
      audio: getAudioUrl(surah, ayah.numberInSurah),
      text: ayah.text,
    }));

    spinner.classList.add("d-none");

    playCurrent();
  } catch (err) {
    console.error(err);
    spinner.classList.add("d-none");
  }

  bootstrap.Offcanvas.getOrCreateInstance(
    document.getElementById("settings"),
  ).hide();

  localStorage.setItem("lastSurah", surah);
  localStorage.setItem("lastStart", start);
  localStorage.setItem("lastEnd", end);
  localStorage.setItem("lastIndex", currentIndex);
}

// ============================
// PLAY CURRENT
// ============================
function playCurrent() {
  const item = currentAyahs[currentIndex];
  if (!item) return;

  audio.src = item.audio;
  audio.play().catch(() => {});

  info.textContent = `سورة ${
    surahSelect.options[surahSelect.selectedIndex].text
  } - آية ${item.ayah}`;

  container.innerHTML = `
    <div class="ayah-box">
      <p class="ayah-text">${item.text}</p>
    </div>
  `;

  localStorage.setItem("lastIndex", currentIndex);
}

// ============================
// NEXT / PREV FLOW
// ============================
function onEnd() {
  currentIndex++;

  if (currentIndex < currentAyahs.length) {
    playCurrent();
  }
}

// ============================
// PLAY / PAUSE
// ============================
function toggle() {
  if (!currentAyahs.length) return;

  if (audio.paused) {
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
}

// ============================
// NEXT
// ============================
function next() {
  if (currentIndex < currentAyahs.length - 1) {
    currentIndex++;
    playCurrent();
  }
}

// ============================
// PREV
// ============================
function prev() {
  if (currentIndex > 0) {
    currentIndex--;
    playCurrent();
  }
}

// ============================
// SERVICE WORKER
// ============================
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}
=======
let allSurahs = [];
let currentAyahs = [];
let currentIndex = 0;
let isPlaying = false;

// ============================
// CDN AUDIO
// ============================
function getAudioUrl(surah, ayah) {
  const s = String(surah).padStart(3, "0");
  const a = String(ayah).padStart(3, "0");

  return `https://everyayah.com/data/Husary_Muallim_128kbps/${s}${a}.mp3`;
}

// ============================
// DOM
// ============================
const surahSelect = document.getElementById("surahSelect");
const startAyahSelect = document.getElementById("startAyahSelect");
const endAyahSelect = document.getElementById("endAyahSelect");

const loadBtn = document.getElementById("loadAyahsBtn");
const container = document.getElementById("ayahImagesContainer");
const spinner = document.getElementById("loadingSpinner");

const audio = document.getElementById("audioPlayer");
const info = document.getElementById("currentAyahInfo");

const playBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const playIcon = playBtn.querySelector(".fa-play");
const pauseIcon = playBtn.querySelector(".fa-pause");

// ============================
// AUDIO STATE SYNC (الأهم)
// ============================
audio.addEventListener("play", () => {
  isPlaying = true;
  updatePlayButtonUI();
});

audio.addEventListener("pause", () => {
  isPlaying = false;
  updatePlayButtonUI();
});

audio.addEventListener("ended", onEnd);

// ============================
// INIT
// ============================
document.addEventListener("DOMContentLoaded", async () => {
  await loadSurahs();

  const lastSurah = localStorage.getItem("lastSurah");
  const lastStart = localStorage.getItem("lastStart");
  const lastEnd = localStorage.getItem("lastEnd");
  const lastIndex = localStorage.getItem("lastIndex");

  if (lastSurah) {
    surahSelect.value = lastSurah;
    handleSurah();

    setTimeout(() => {
      startAyahSelect.value = lastStart || 1;
      endAyahSelect.value = lastEnd || 1;
      currentIndex = parseInt(lastIndex) || 0;
    }, 200);
  }

  surahSelect.addEventListener("change", () => {
    currentIndex = 0;
    handleSurah();
  });

  loadBtn.addEventListener("click", loadAyahs);
  playBtn.addEventListener("click", toggle);
  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  updatePlayButtonUI();
});

// ============================
// UI
// ============================
function updatePlayButtonUI() {
  if (isPlaying) {
    playIcon.style.display = "none";
    pauseIcon.style.display = "inline-block";
  } else {
    playIcon.style.display = "inline-block";
    pauseIcon.style.display = "none";
  }
}

// ============================
// LOAD SURAH LIST
// ============================
async function loadSurahs() {
  try {
    const res = await fetch("https://api.alquran.cloud/v1/surah");
    const data = await res.json();

    allSurahs = data.data;

    surahSelect.innerHTML = `<option value="" disabled selected>اختر السورة</option>`;

    allSurahs.forEach((s) => {
      surahSelect.innerHTML += `
        <option value="${s.number}">
          ${s.number}. ${s.name}
        </option>`;
    });
  } catch (err) {
    console.error(err);
  }
}

// ============================
// HANDLE SURAH
// ============================
function handleSurah() {
  const surah = allSurahs.find((s) => s.number == surahSelect.value);
  if (!surah) return;

  const count = surah.numberOfAyahs;

  startAyahSelect.innerHTML = "";
  endAyahSelect.innerHTML = "";

  for (let i = 1; i <= count; i++) {
    startAyahSelect.innerHTML += `<option value="${i}">${i}</option>`;
    endAyahSelect.innerHTML += `<option value="${i}">${i}</option>`;
  }

  startAyahSelect.disabled = false;
  endAyahSelect.disabled = false;

  endAyahSelect.value = count;
}

// ============================
// LOAD AYAHs
// ============================
async function loadAyahs() {
  const surah = +surahSelect.value;
  const start = +startAyahSelect.value;
  const end = +endAyahSelect.value;

  if (!surah || start > end) return;

  currentAyahs = [];
  currentIndex = 0;

  container.innerHTML = "";
  spinner.classList.remove("d-none");

  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${surah}/ar`);
    const data = await res.json();

    currentAyahs = data.data.ayahs.slice(start - 1, end).map((ayah) => ({
      ayah: ayah.numberInSurah,
      surah,
      audio: getAudioUrl(surah, ayah.numberInSurah),
      text: ayah.text,
    }));

    spinner.classList.add("d-none");

    playCurrent();
  } catch (err) {
    console.error(err);
    spinner.classList.add("d-none");
  }

  bootstrap.Offcanvas.getOrCreateInstance(
    document.getElementById("settings"),
  ).hide();

  localStorage.setItem("lastSurah", surah);
  localStorage.setItem("lastStart", start);
  localStorage.setItem("lastEnd", end);
  localStorage.setItem("lastIndex", currentIndex);
}

// ============================
// PLAY CURRENT
// ============================
function playCurrent() {
  const item = currentAyahs[currentIndex];
  if (!item) return;

  audio.src = item.audio;
  audio.play().catch(() => {});

  info.textContent = `سورة ${
    surahSelect.options[surahSelect.selectedIndex].text
  } - آية ${item.ayah}`;

  container.innerHTML = `
    <div class="ayah-box">
      <p class="ayah-text">${item.text}</p>
    </div>
  `;

  localStorage.setItem("lastIndex", currentIndex);
}

// ============================
// NEXT / PREV FLOW
// ============================
function onEnd() {
  currentIndex++;

  if (currentIndex < currentAyahs.length) {
    playCurrent();
  }
}

// ============================
// PLAY / PAUSE
// ============================
function toggle() {
  if (!currentAyahs.length) return;

  if (audio.paused) {
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
}

// ============================
// NEXT
// ============================
function next() {
  if (currentIndex < currentAyahs.length - 1) {
    currentIndex++;
    playCurrent();
  }
}

// ============================
// PREV
// ============================
function prev() {
  if (currentIndex > 0) {
    currentIndex--;
    playCurrent();
  }
}

// ============================
// SERVICE WORKER
// ============================
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}
>>>>>>> 3387cd74037309d2e2667d5e6c7c126ed26a3280
