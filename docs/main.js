const musicPlayer = document.querySelector('.music-player')
const actionBtn = document.querySelector('.action-btn');
const progressContainer = document.querySelector('.progress-container');
const progress = document.querySelector('.progress');
const durationText = document.querySelector('.duration');

const audio = document.querySelector('audio');

function playSong() {
    musicPlayer.classList.add('play')

    actionBtn.querySelector('i.fas').classList.remove('fa-play')
    actionBtn.querySelector('i.fas').classList.add('fa-pause')

    audio.play()
}

function pauseSong() {
    musicPlayer.classList.remove('play')

    actionBtn.querySelector('i.fas').classList.remove('fa-pause')
    actionBtn.querySelector('i.fas').classList.add('fa-play')

    audio.pause()
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}

function updateProgress(e) {
   const {duration, currentTime} = e.srcElement
   const progressPercent = (currentTime / duration) * 100
   progress.style.width = `${progressPercent}%`

   durationText.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
}

function setProgress(e) {
    const width = this.clientWidth
    const clientX = e.offsetX
    const duration = audio.duration

    audio.currentTime = (clientX / width) * duration
}

// Event Listeners
actionBtn.addEventListener('click', () => {
    const isPlaying = musicPlayer.classList.contains('play')

    if(isPlaying) {
        pauseSong()
    } else {
        playSong()
    }
})

audio.addEventListener('timeupdate', updateProgress)
progressContainer.addEventListener('click', setProgress)

audio.addEventListener('ended', () => {
    pauseSong();
    audio.currentTime = 0;
});

audio.addEventListener('loadedmetadata', () => {
    durationText.textContent = `0:00 / ${formatTime(audio.duration)}`;
});

actionBtn.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        actionBtn.click();
    }
});
