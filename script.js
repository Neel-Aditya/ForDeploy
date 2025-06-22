console.log("🎵 Let's go for JavaScript Music Player!");

// Initialize audio
let currentSong = new Audio();
let songs = [];

// Format seconds to MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
}

// Fetch song list from JSON file
async function getSongs() {
    try {
        const res = await fetch("playlist.json");
        const data = await res.json();
        return data.songs || [];
    } catch (err) {
        console.error("❌ Failed to fetch playlist:", err);
        return [];
    }
}

// Play a selected song
function playMusic(track, pause = false) {
    const encodedTrack = encodeURIComponent(track);
    currentSong.src = `/Songscollection/${encodedTrack}`;

    if (!pause) {
        currentSong.play();
        play.src = "pausebutton.svg";
    }

    document.querySelector(".songinfo").textContent = decodeURIComponent(track.replace(".mp3", ""));
    document.querySelector(".songtime").textContent = "0:00 / 0:00";
}

// Main logic
async function main() {
    songs = await getSongs();
    if (songs.length === 0) return;

    playMusic(songs[0], true); // Load first song, don't auto-play

    // Display songs in the list
    const songUL = document.querySelector(".songlist ul");
    songUL.innerHTML = ""; // Clear existing
    songs.forEach((song, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <img src="musicon.svg" alt="icon">
            <div class="info">
                <div>${decodeURIComponent(song.replace(".mp3", ""))}</div>
                <div></div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img src="playbtn(for library).svg" alt="play">
            </div>
        `;
        li.addEventListener("click", () => playMusic(song));
        songUL.appendChild(li);
    });

    // Play/Pause toggle
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pausebutton.svg";
        } else {
            currentSong.pause();
            play.src = "playbutton.svg";
        }
    });

    // Update time and seekbar
    currentSong.addEventListener("timeupdate", () => {
        const duration = currentSong.duration || 0;
        const currentTime = currentSong.currentTime;
        document.querySelector(".songtime").textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
        document.querySelector(".circle").style.left = `${(currentTime / duration) * 100}%`;
    });

    // Seekbar click
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        const bar = e.target.getBoundingClientRect();
        const percent = (e.clientX - bar.left) / bar.width;
        currentSong.currentTime = currentSong.duration * percent;
        document.querySelector(".circle").style.left = `${percent * 100}%`;
    });

    // Sidebar navigation
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    // Previous/Next Song Controls
    previous.addEventListener("click", () => {
        const currentIndex = songs.findIndex(song => decodeURIComponent(currentSong.src.split("/").pop()) === song);
        if (currentIndex > 0) playMusic(songs[currentIndex - 1]);
    });

    next.addEventListener("click", () => {
        const currentIndex = songs.findIndex(song => decodeURIComponent(currentSong.src.split("/").pop()) === song);
        if (currentIndex < songs.length - 1) playMusic(songs[currentIndex + 1]);
    });
}

// Run it!
main();
