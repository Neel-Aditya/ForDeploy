console.log("Let's go for JavaScript!");

// Initialize audio and variables
let currentSong = new Audio();
let songs = [];

// Format time to MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
}

// Fetch playlist from JSON
async function getSongs() {
    try {
        let res = await fetch("/Songs collection/playlist.json");
        let data = await res.json();
        return data.songs;
    } catch (err) {
        console.error("Failed to fetch playlist:", err);
        return [];
    }
}

// Play selected song
function playMusic(track, pause = false) {
    currentSong.src = `/Songs collection/${encodeURI(track)}`;

    if (!pause) {
        currentSong.play();
        play.src = "pausebutton.svg";
    }

    document.querySelector(".songinfo").innerHTML = decodeURIComponent(track.replace(".mp3", ""));
    document.querySelector(".songtime").innerHTML = "0:00 / 0:00";
}

// Main function
async function main() {
    songs = await getSongs();
    if (songs.length === 0) return;

    playMusic(songs[0], true);

    // Render songs in list
    let songUL = document.querySelector(".songlist ul");
    for (const song of songs) {
        songUL.innerHTML += `
            <li>
                <img src="musicon.svg" alt="">
                <div class="info">
                    <div>${decodeURIComponent(song.replace(".mp3", ""))}</div>
                    <div></div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img src="playbtn(for library).svg" alt="">
                </div>
            </li>`;
    }

    // Add click listeners to songs
    Array.from(document.querySelectorAll(".songlist li")).forEach((li, i) => {
        li.addEventListener("click", () => {
            playMusic(songs[i]);
        });
    });

    // Play/Pause
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pausebutton.svg";
        } else {
            currentSong.pause();
            play.src = "playbutton.svg";
        }
    });

    // Update time
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML =
            `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;
        document.querySelector(".circle").style.left =
            `${(currentSong.currentTime / currentSong.duration) * 100}%`;
    });

    // Seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width);
        currentSong.currentTime = currentSong.duration * percent;
        document.querySelector(".circle").style.left = `${percent * 100}%`;
    });

    // Hamburger menu
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    // Previous Song
    previous.addEventListener("click", () => {
        let index = songs.indexOf(decodeURIComponent(currentSong.src.split("/").pop()));
        if (index > 0) playMusic(songs[index - 1]);
    });

    // Next Song
    next.addEventListener("click", () => {
        let index = songs.indexOf(decodeURIComponent(currentSong.src.split("/").pop()));
        if (index < songs.length - 1) playMusic(songs[index + 1]);
    });
}

main();
