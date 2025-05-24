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

// ALBUM TRACKLIST
const songs = [
  { title: "Intro Bloom", file: "./audio/intro-bloom.mp3" },
  { title: "Velvet Sky", file: "./audio/velvet-sky.mp3" },
  { title: "Floral Notes", file: "./audio/floral-notes.mp3" },
  { title: "Midnight Petals", file: "./audio/midnight-petals.mp3" },
  { title: "Kiss More", file: "./audio/kiss-more.mp3" }, // changed title here
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

// Generate tracklist with numbers and play buttons
songs.forEach((song, index) => {
  const trackDiv = document.createElement("div");
  trackDiv.classList.add("track");
  trackDiv.setAttribute("data-index", index);
  trackDiv.innerHTML = `
    <span>${index + 1}. ${song.title}</span>
    <button aria-label="Play ${song.title}" class="track-play-btn">
      <i class="fa-solid fa-play"></i>
    </button>
  `;
  tracklist.appendChild(trackDiv);
});

// Play or pause when clicking on track play buttons
tracklist.addEventListener("click", (e) => {
  if (e.target.closest("button.track-play-btn")) {
    const btn = e.target.closest("button.track-play-btn");
    const index = parseInt(btn.parentElement.getAttribute("data-index"));
    if (index === currentTrack) {
      // toggle play/pause on current track
      togglePlay();
    } else {
      playSong(index);
    }
  }
});

// Update track highlighting and button icons
function updateTrackUI() {
  const tracks = document.querySelectorAll(".track");
  tracks.forEach((track, i) => {
    const btn = track.querySelector("button.track-play-btn i");
    if (i === currentTrack) {
      track.classList.add("active");
      if (isPlaying) {
        btn.classList.remove("fa-play");
        btn.classList.add("fa-pause");
      } else {
        btn.classList.remove("fa-pause");
        btn.classList.add("fa-play");
      }
    } else {
      track.classList.remove("active");
      btn.classList.remove("fa-pause");
      btn.classList.add("fa-play");
    }
  });

  // Update main play/pause button icon
  const mainIcon = playPauseBtn.querySelector("i");
  if (isPlaying) {
    mainIcon.classList.remove("fa-play");
    mainIcon.classList.add("fa-pause");
  } else {
    mainIcon.classList.remove("fa-pause");
    mainIcon.classList.add("fa-play");
  }
}

// Load and play a specific song
function playSong(index) {
  if (index < 0 || index >= songs.length) return;
  if (currentTrack !== index) {
    currentTrack = index;
    mp3.src = songs[currentTrack].file;
  }

  mp3
    .play()
    .then(() => {
      isPlaying = true;
      updateTrackUI();
    })
    .catch((error) => {
      console.error("Play error:", error);
    });
}

// Toggle play/pause for current track
function togglePlay() {
  if (!mp3.src) {
    mp3.src = songs[currentTrack].file;
  }

  if (isPlaying) {
    mp3.pause();
    isPlaying = false;
    updateTrackUI();
  } else {
    mp3
      .play()
      .then(() => {
        isPlaying = true;
        updateTrackUI();
      })
      .catch((error) => {
        console.error("Play error:", error);
      });
  }
}

// Next track
function nextTrack() {
  currentTrack = (currentTrack + 1) % songs.length;
  mp3.src = songs[currentTrack].file;
  mp3
    .play()
    .then(() => {
      isPlaying = true;
      updateTrackUI();
    })
    .catch((error) => {
      console.error("Play error:", error);
    });
}

// Previous track
function previousTrack() {
  currentTrack = (currentTrack - 1 + songs.length) % songs.length;
  mp3.src = songs[currentTrack].file;
  mp3
    .play()
    .then(() => {
      isPlaying = true;
      updateTrackUI();
    })
    .catch((error) => {
      console.error("Play error:", error);
    });
}

// Format time in mm:ss
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

// Update seek bar and time display during playback
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

// Automatically play next track on ended
mp3.addEventListener("ended", () => {
  nextTrack();
});

// Seek bar controls
seekBar.addEventListener("input", () => {
  if (mp3.duration) {
    const seekTo = (seekBar.value / 100) * mp3.duration;
    durationDisplay.textContent = `${formatTime(seekTo)} / ${formatTime(
      mp3.duration
    )}`;
  }
});

seekBar.addEventListener("change", () => {
  if (mp3.duration) {
    const seekTo = (seekBar.value / 100) * mp3.duration;
    mp3.currentTime = seekTo;
  }
});

// Volume control
volumeSlider.addEventListener("input", () => {
  mp3.volume = volumeSlider.value;
});

// Initialize volume to max
mp3.volume = 1;

// Play first track on album play button click
function playFirstTrack() {
  if (currentTrack !== 0 || !isPlaying) {
    playSong(0);
  } else {
    togglePlay();
  }
}

// Initialize UI (no auto-play)
updateTrackUI();
