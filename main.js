let allSurahs = [];
let currentAyahs = [];
let currentIndex = 0;
let isPlaying = false;
let repeatCount = 0;
let maxRepeat = 1;
// let gapBetweenAyahs = 500;

// ============================
// CDN AUDIO (HUSARY MUALLIM)
// ============================
function getAudioUrl(surah, ayah) {
  const s = String(surah).padStart(3, "0");
  const a = String(ayah).padStart(3, "0");

  return `https://everyayah.com/data/Husary_Muallim_128kbps/${s}${a}.mp3`;
}

// ============================
// عناصر DOM
// ============================
const surahSelect = document.getElementById("surahSelect");
const startAyahSelect = document.getElementById("startAyahSelect");
const endAyahSelect = document.getElementById("endAyahSelect");
const repeatSelect = document.getElementById("repeatSelect");

const loadBtn = document.getElementById("loadAyahsBtn");
const container = document.getElementById("ayahImagesContainer");
const spinner = document.getElementById("loadingSpinner");

const audio = document.getElementById("audioPlayer");
const info = document.getElementById("currentAyahInfo");

const playBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// FontAwesome icons
const playIcon = playBtn.querySelector(".fa-play");
const pauseIcon = playBtn.querySelector(".fa-pause");

document.addEventListener("DOMContentLoaded", async () => {
  await loadSurahs();

  surahSelect.addEventListener("change", handleSurah);
  loadBtn.addEventListener("click", loadAyahs);

  playBtn.addEventListener("click", toggle);
  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  audio.addEventListener("ended", onEnd);

  updatePlayButtonUI();
});

// ============================
// تحديث زر التشغيل
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
// تحميل السور
// ============================
async function loadSurahs() {
  try {
    const res = await fetch("https://api.alquran.cloud/v1/surah");
    const data = await res.json();

    allSurahs = data.data;

    surahSelect.innerHTML = `<option value="" disabled selected>اختر السورة</option>`;

    let options = "";

    allSurahs.forEach((s) => {
      options += `<option value="${s.number}">${s.number}. ${s.name}</option>`;
    });

    surahSelect.innerHTML += options;
  } catch (err) {
    console.error("Error loading surahs:", err);
  }
}

// ============================
// عند اختيار سورة
// ============================
function handleSurah() {
  if (!allSurahs.length) return;

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
// تحميل الآيات
// ============================
async function loadAyahs() {
  const surah = +surahSelect.value;
  const start = +startAyahSelect.value;
  const end = +endAyahSelect.value;

  if (!surah || start > end) return;

  currentAyahs = [];
  currentIndex = 0;
  repeatCount = 0;

  container.innerHTML = "";
  spinner.classList.remove("d-none");

  try {
    for (let i = start; i <= end; i++) {
      const textRes = await fetch(
        `https://api.alquran.cloud/v1/ayah/${surah}:${i}/ar`,
      );
      const textData = await textRes.json();

      currentAyahs.push({
        ayah: i,
        surah,
        audio: getAudioUrl(surah, i),
        text: textData.data.text,
      });
    }

    spinner.classList.add("d-none");

    playCurrent();
  } catch (err) {
    console.error("Error loading ayahs:", err);
    spinner.classList.add("d-none");
  }

  const offcanvasEl = document.getElementById("settings");
  const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);

  if (offcanvas) {
    offcanvas.hide();
  }
}

// ============================
// تشغيل الآية الحالية
// ============================
function playCurrent() {
  const item = currentAyahs[currentIndex];
  if (!item) return;

  audio.src = item.audio;
  audio.play();

  isPlaying = true;
  updatePlayButtonUI();

  info.textContent = `سورة ${
    surahSelect.options[surahSelect.selectedIndex].text
  } - آية ${item.ayah}`;

  container.innerHTML = `
    <div class="ayah-box">
      <p class="ayah-text">${item.text}</p>
    </div>
  `;
}

// ============================
// عند انتهاء الآية
// ============================
function onEnd() {
  maxRepeat = parseInt(repeatSelect.value) || 1;

  repeatCount++;

  if (repeatCount < maxRepeat) {
    playCurrent();
    return;
  }

  repeatCount = 0;
  currentIndex++;

  if (currentIndex < currentAyahs.length) {
    playCurrent();
  } else {
    isPlaying = false;
    updatePlayButtonUI();
  }
}

// ============================
// تشغيل / إيقاف
// ============================
function toggle() {
  if (!currentAyahs.length) return;

  if (isPlaying) {
    audio.pause();
    isPlaying = false;
  } else {
    audio.play();
    isPlaying = true;
  }

  updatePlayButtonUI();
}

// ============================
// التالي
// ============================
function next() {
  if (currentIndex < currentAyahs.length - 1) {
    currentIndex++;
    playCurrent();
  }
}

// ============================
// السابق
// ============================
function prev() {
  if (currentIndex > 0) {
    currentIndex--;
    playCurrent();
  }
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}
