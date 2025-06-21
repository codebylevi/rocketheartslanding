// MUSIC PLAYER
const musicPlayer = document.querySelector(".music-player");
const actionBtn = document.querySelector(".action-btn");
const progressContainer = document.querySelector(".progress-container");
const progress = document.querySelector(".progress");
const durationText = document.querySelector(".duration");

const audio = document.querySelector(".audio");

function playSong() {
  musicPlayer.classList.add("play");

  actionBtn.querySelector("i.fa-solid").classList.remove("fa-play");
  actionBtn.querySelector("i.fa-solid").classList.add("fa-pause");

  audio.play();
}

function pauseSong() {
  musicPlayer.classList.remove("play");

  actionBtn.querySelector("i.fa-solid").classList.remove("fa-pause");
  actionBtn.querySelector("i.fa-solid").classList.add("fa-play");

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
  { title: "Swimming Pool", file: "./audio/Swimming-Pool.mp3" },
  { title: "Apocalypse", file: "./audio/apocalypse.mp3" },
  { title: "Eyedress", file: "./audio/Eyedress.mp3" },
  { title: "505", file: "./audio/505.mp3" },
  { title: "Sunsetz", file: "./audio/Sunsetz.mp3" },
  { title: "Sweet", file: "./audio/Sweet.mp3" },
  { title: "K", file: "./audio/K.mp3" },
  { title: "Truly", file: "./audio/Truly.mp3" },
  { title: "Sad Love", file: "./audio/Sad-Love.mp3" },
];

const tracklist = document.getElementById("tracklist");
const mp3 = document.getElementById("mp3");
const durationDisplay = document.getElementById("track-duration");
const seekBar = document.querySelector(".seek-bar");
const seekProgress = document.querySelector(".seek-progress");
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
      toggleAlbumPlay();
    } else {
      playAlbumSong(index);
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
function playAlbumSong(index) {
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
function toggleAlbumPlay() {
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

// Seek bar functionality
mp3.addEventListener("timeupdate", updateSeekBar);
seekBar.addEventListener("click", setSeekProgress);

function updateSeekBar(e) {
  const { duration, currentTime } = e.srcElement;
  const seekPercent = (currentTime / duration) * 100;
  seekProgress.style.width = `${seekPercent}%`;

  durationDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(
    duration
  )}`;
}

function setSeekProgress(e) {
  const width = this.clientWidth;
  const clientX = e.offsetX;
  const duration = mp3.duration;

  mp3.currentTime = (clientX / width) * duration;
}

// Volume control
function updateVolumeSliderBackground() {
  const value = parseFloat(volumeSlider.value) * 100;
  volumeSlider.style.background = `linear-gradient(to right, #fffff0 ${value}%, #333 ${value}%)`;
}

// Set initial background
updateVolumeSliderBackground();

// Update on input
volumeSlider.addEventListener("input", () => {
  mp3.volume = volumeSlider.value;
  updateVolumeSliderBackground();
});

// Play first track on album play button click
function playFirstTrack() {
  if (currentTrack !== 0 || !isPlaying) {
    playAlbumSong(0);
  } else {
    toggleAlbumPlay();
  }
}

// Initialize UI (no auto-play)
updateTrackUI();

// GALLERY
document.addEventListener("DOMContentLoaded", function () {
  const slider = document.querySelector(".slider");
  const slides = document.querySelectorAll(".slide");
  const prevButton = document.querySelector(".button-prev");
  const nextButton = document.querySelector(".button-next");
  const dots = document.querySelectorAll(".dot");
  const slideCount = slides.length;
  let currentSlide = 0;

  // Preload images
  const preloadImages = () => {
    document.querySelectorAll(".slide img").forEach((img) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = img.src;
      document.head.appendChild(link);
    });
  };

  preloadImages();

  // Go to specific slide
  function goToSlide(index) {
    slider.style.transform = `translateX(-${index * 100}%)`;
    currentSlide = index;

    dots.forEach((dot) => dot.classList.remove("active"));
    dots[currentSlide].classList.add("active");

    prevButton.disabled = currentSlide === 0;
    nextButton.disabled = currentSlide === slideCount - 1;
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slideCount);
  }

  function prevSlide() {
    goToSlide((currentSlide - 1 + slideCount) % slideCount);
  }

  nextButton.addEventListener("click", nextSlide);
  prevButton.addEventListener("click", prevSlide);

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => goToSlide(i));
  });

  let slideInterval = setInterval(nextSlide, 5000);

  document
    .querySelector(".slider-container")
    .addEventListener("mouseenter", () => {
      clearInterval(slideInterval);
    });

  document
    .querySelector(".slider-container")
    .addEventListener("mouseleave", () => {
      slideInterval = setInterval(nextSlide, 5000);
    });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") prevSlide();
  });

  goToSlide(0);
});
