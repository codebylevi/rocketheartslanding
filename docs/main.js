// MUSIC PLAYER
const musicPlayer = document.querySelector(".music-player");
const actionBtn = document.querySelector(".action-btn");
const progressContainer = document.querySelector(".progress-container");
const progress = document.querySelector(".progress");
const durationText = document.querySelector(".duration");

const audio = document.querySelector("audio");

function playSong() {
  musicPlayer.classList.add("play");

  actionBtn.querySelector("i.fas").classList.remove("fa-play");
  actionBtn.querySelector("i.fas").classList.add("fa-pause");

  audio.play();
}

function pauseSong() {
  musicPlayer.classList.remove("play");

  actionBtn.querySelector("i.fas").classList.remove("fa-pause");
  actionBtn.querySelector("i.fas").classList.add("fa-play");

  audio.pause();
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;

  durationText.textContent = `${formatTime(currentTime)} / ${formatTime(
    duration
  )}`;
}

function setProgress(e) {
  const width = this.clientWidth;
  const clientX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clientX / width) * duration;
}

// Event Listeners
actionBtn.addEventListener("click", () => {
  const musicPlaying = musicPlayer.classList.contains("play");

  if (musicPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

audio.addEventListener("timeupdate", updateProgress);
progressContainer.addEventListener("click", setProgress);

audio.addEventListener("ended", () => {
  pauseSong();
  audio.currentTime = 0;
});

audio.addEventListener("loadedmetadata", () => {
  durationText.textContent = `0:00 / ${formatTime(audio.duration)}`;
});

actionBtn.addEventListener("keydown", (e) => {
  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    actionBtn.click();
  }
});

// ALBUM PLAYER
const songs = [
  { title: "Intro Bloom", file: "./audio/intro-bloom.mp3" },
  { title: "Velvet Sky", file: "./audio/velvet-sky.mp3" },
  { title: "Floral Notes", file: "./audio/floral-notes.mp3" },
  { title: "Midnight Petals", file: "./audio/midnight-petals.mp3" },
  { title: "Sunset in Bloom", file: "./audio/kiss-more.mp3" },
  { title: "Sweet Nectar", file: "./audio/sweet-nectar.mp3" },
  { title: "Rosy Road", file: "./audio/rosy-road.mp3" },
  { title: "Thorns and Harmony", file: "./audio/thorns-and-harmony.mp3" },
  { title: "Garden's End", file: "./audio/gardens-end.mp3" },
];

const tracklist = document.getElementById("tracklist");
const mp3 = document.getElementById("mp3");
const durationDisplay = document.getElementById("track-duration");
const seekBar = document.getElementById("seek-bar");
const volumeSlider = document.getElementById("volume-slider");
const playPauseBtn = document.getElementById("play-pause-btn");

let currentTrack = 0;
let isPlaying = false;
let isSeeking = false;

// Generate tracklist with play buttons
songs.forEach((song, index) => {
  const trackDiv = document.createElement("div");
  trackDiv.classList.add("track");
  trackDiv.innerHTML = `
        <span>${song.title}</span>
        <button aria-label="Play ${song.title}" data-index="${index}"><i class="fas fa-play"></i></button>
      `;
  tracklist.appendChild(trackDiv);
});

// Add click event to track buttons
tracklist.addEventListener("click", (e) => {
  if (e.target.tagName === "button") {
    const index = parseInt(e.target.getAttribute("data-index"));
    if (!isNaN(index)) {
      playSong(index);
    }
  }
});

// Highlight the active track
function highlightTrack(index) {
  document.querySelectorAll(".track").forEach((track, i) => {
    track.classList.toggle("active", i === index);
  });
}

// Load and play a specific song
function playSong(index) {
  if (index < 0 || index >= songs.length) return;
  currentTrack = index;
  mp3.src = songs[currentTrack].file;
  mp3.play();
  isPlaying = true;
  playPauseBtn.textContent = `<i class="fa-solid fa-pause"></i>`;
  highlightTrack(currentTrack);
}

// Toggle play/pause
function togglePlay() {
  if (isPlaying) {
    mp3.pause();
    playPauseBtn.textContent = `<i class="fa-solid fa-play"></i>`;
  } else {
    if (!mp3.src) {
      mp3.src = songs[currentTrack].file;
    }
    mp3.play();
    playPauseBtn.textContent = `<i class="fa-solid fa-pause"></i>`;
  }
  isPlaying = !isPlaying;
}

// Go to previous track
function previousTrack() {
  currentTrack = (currentTrack - 1 + songs.length) % songs.length;
  playSong(currentTrack);
}

// Go to next track
function nextTrack() {
  currentTrack = (currentTrack + 1) % songs.length;
  playSong(currentTrack);
}

// Format seconds into mm:ss
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

// Update duration and seek bar
mp3.addEventListener("timeupdate", () => {
  if (!isSeeking) {
    const current = mp3.currentTime;
    const duration = mp3.duration || 0;
    seekBar.value = (current / duration) * 100 || 0;
    durationDisplay.textContent = `${formatTime(current)} / ${formatTime(
      duration
    )}`;
  }
});

// When mp3 ends, automatically go to next track
mp3.addEventListener("ended", nextTrack);

// Seek bar input start
seekBar.addEventListener("mousedown", () => {
  isSeeking = true;
});
seekBar.addEventListener("touchstart", () => {
  isSeeking = true;
});

// Seek bar input end
seekBar.addEventListener("mouseup", (e) => {
  isSeeking = false;
  const seekTo = (seekBar.value / 100) * mp3.duration;
  mp3.currentTime = seekTo;
});
seekBar.addEventListener("touchend", (e) => {
  isSeeking = false;
  const seekTo = (seekBar.value / 100) * mp3.duration;
  mp3.currentTime = seekTo;
});

// Update mp3 time while dragging
seekBar.addEventListener("input", () => {
  if (isSeeking) {
    const seekTo = (seekBar.value / 100) * mp3.duration;
    durationDisplay.textContent = `${formatTime(seekTo)} / ${formatTime(
      mp3.duration
    )}`;
  }
});

// Volume control
volumeSlider.addEventListener("input", () => {
  mp3.volume = volumeSlider.value;
});

// Initialize volume to max
mp3.volume = 1;

// Auto highlight first track on load
highlightTrack(currentTrack);
