console.log("Let's go for java script");


// we'll create a currentSong variable that will play the current song
let currentSong = new Audio();
let songs;

// func.n to format the seconds to min:sec format to display in seekbar

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    // Pad seconds with a leading zero if less than 10
    const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
    return `${minutes}:${formattedSeconds}`;
}

// we are not using server side scripting now

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/Songs%20collection/");
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/Songs%20collection/")[1]);
        }
    }

    return songs;

}

const playMusic = (track, pause=false)=>{
//    for playing the current song
    currentSong.src = "/Songs collection/" + track;
    if(!pause){
        currentSong.play();
        play.src="pausebutton.svg";
    }
    document.querySelector(".songinfo").innerHTML=decodeURI(track);
    document.querySelector(".songtime").innerHTML="0:00/0:00";

}

async function main() {
    
    // get all the songs list 
    songs = await getSongs();
    playMusic(songs[0],true)
    console.log(songs);

    // display the songs in library

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img src="musicon.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div></div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img src="playbtn(for library).svg" alt="">
                            </div>        
                     </li>`;

    }

    // attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{

        e.addEventListener("click", element =>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
        
    
    });

    // attach an event listener to prev, next and play
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src="pausebutton.svg";
        }
        else{
                currentSong.pause();
                play.src="playbutton.svg";
        }
    })

    // listen for timeupdate event

    currentSong.addEventListener("timeupdate",()=>{

        console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".songtime").innerHTML=`${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration) * 100 + "%";
    })
    
    // add an event listener to seekbar

    document.querySelector(".seekbar").addEventListener("click", e=>{
        // console.log(e.offsetX, e.offsetY);
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left=percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent)/100;
    })

    // add an event listener to hamburger

    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0";
    })

    // add event listener for close button
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-120%";
    })

    // add an event listener to previous song button to access the prev song

    previous.addEventListener("click", ()=> {
        console.log("previous clicked")

        
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        
         if((index-1)>=0){
            playMusic(songs[index-1])
        }
    })

    // add an event listener to next song button to access the next song

    next.addEventListener("click", ()=> {
        console.log("next clicked")
    
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        

        if((index+1)<songs.length){
            playMusic(songs[index+1])
        }
    })
}
    

    main();



