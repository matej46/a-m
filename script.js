const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.getElementById("close");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const pauseBtn = document.getElementById("pauseBtn");
const playBtn = document.getElementById("playBtn");

const music = document.getElementById("bg-music");
const playMusic = document.getElementById("playMusic");
const pauseMusic = document.getElementById("pauseMusic");
const stopMusic = document.getElementById("stopMusic");
const muteMusic = document.getElementById("muteMusic");

const songs = [
  "/music/Edward Sharpe .mp3",
  "/music/_SUMMER WINE_.mp3",
];

const imageFilenames = [];
for (let i = 1; i <= 82; i++) {
  imageFilenames.push(`images/photo${i}.jpg`);
}

const gallery = document.querySelector('.gallery');
imageFilenames.forEach(src => {
  const img = document.createElement('img');
  img.src = src;
  img.alt = `Photo ${src.split('/').pop().split('.')[0]}`;
  gallery.appendChild(img);
});

let currentSongIndex = 0;

let currentIndex = 0;
let slideshowInterval = null;
let isPlaying = true;
let isMusicPlaying = false;

function showImage(index) {
  const galleryImages = document.querySelectorAll(".gallery img");
  const img = galleryImages[index];
  if (img) {
    lightboxImg.src = img.src;
    currentIndex = index;
    lightbox.style.display = "flex";
    if (isPlaying) startSlideshow();
  }
}

function startSlideshow() {
  stopSlideshow();
  slideshowInterval = setInterval(() => {
    let nextIndex = (currentIndex + 1) % document.querySelectorAll(".gallery img").length;
    showImage(nextIndex);
  }, 3200);
  isPlaying = true;
  if (pauseBtn && playBtn) {
    pauseBtn.style.display = "inline-block";
    playBtn.style.display = "none";
  }
}

function stopSlideshow() {
  clearInterval(slideshowInterval);
  slideshowInterval = null;
  isPlaying = false;
  if (pauseBtn && playBtn) {
    pauseBtn.style.display = "none";
    playBtn.style.display = "inline-block";
  }
}

if (pauseBtn) pauseBtn.addEventListener("click", stopSlideshow);
if (playBtn) playBtn.addEventListener("click", startSlideshow);

window.addEventListener("DOMContentLoaded", () => {
  const galleryImages = document.querySelectorAll(".gallery img");
  galleryImages.forEach((img, index) => {
    img.addEventListener("click", () => {
      showImage(index);
    });
  });

  const startBtn = document.getElementById("startBtn");
  const introOverlay = document.getElementById("intro-overlay");

  startBtn.addEventListener("click", () => {
    introOverlay.style.display = "none";
    showImage(0);
    music.load();
    playCurrentSong();
  });
});

if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    lightbox.style.display = "none";
    stopSlideshow();
  });
}

if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.style.display = "none";
      stopSlideshow();
    }
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    let nextIndex = (currentIndex + 1) % document.querySelectorAll(".gallery img").length;
    showImage(nextIndex);
  });
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    let prevIndex = (currentIndex - 1 + document.querySelectorAll(".gallery img").length) % document.querySelectorAll(".gallery img").length;
    showImage(prevIndex);
  });
}

function playCurrentSong() {
  music.src = songs[currentSongIndex];
  music.play().catch(() => {
    console.warn("Autoplay blocked by browser.");
  });
  isMusicPlaying = true;
}

music.addEventListener("ended", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  playCurrentSong();
});

if (playMusic) {
  playMusic.addEventListener("click", () => {
    if (music.paused) {
      music.play();
    } else if (!isMusicPlaying) {
      playCurrentSong();
    }
    isMusicPlaying = true;
  });
}

if (pauseMusic) {
  pauseMusic.addEventListener("click", () => {
    music.pause();
    isMusicPlaying = false;
  });
}

if (stopMusic) {
  stopMusic.addEventListener("click", () => {
    music.pause();
    music.currentTime = 0;
    isMusicPlaying = false;
  });
}

if (muteMusic) {
  muteMusic.addEventListener("click", () => {
    music.muted = !music.muted;
    muteMusic.textContent = music.muted ? "🔈 Unmute" : "🔇 Mute";
  });
};

document.addEventListener("keydown", (e) => {
  if (lightbox.style.display === "flex") {
    if (e.key === "ArrowRight") nextBtn.click();
    if (e.key === "ArrowLeft") prevBtn.click();
    if (e.key === "Escape") closeBtn.click();
    if (e.key.toLowerCase() === "p") {
      isPlaying ? stopSlideshow() : startSlideshow();
    }
    if (e.key.toLowerCase() === "m") {
      music.muted = !music.muted;
      muteMusic.textContent = music.muted ? "🔈 Unmute" : "🔇 Mute";
    }
  }
});
