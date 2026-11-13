let curretMusic = 0;

const music = document.querySelector('#audio');

const seekBar = document.querySelector('.seek-bar');
const songName = document.querySelector('.music-name');
const artisName = document.querySelector('.artis-name');
const disk = document.querySelector('.disk');
const curretTime = document.querySelector('.current-time');
const musicDuration = document.querySelector('.song-duration');
const playBtn = document.querySelector('.play-btn');
const forwardBtn =  document.querySelector('.forward-btn');
const backwardBtn =  document.querySelector('.backward-btn');

playBtn.addEventListener('click', () => {
    if(playBtn.className.includes('pause')){
        music.play();
    } else{
        music.pause();
    }
    playBtn.classList.toggle('pause');
    disk.classList.toggle('play');    
})

// Setup Music

const setMusic = (i) => {
    seekBar.value = 0;
    let song = songs[i];
    curretMusic = i;
    music.src = song.path;

    songName.innerHTML = song.name;
    artisName.innerHTML = song.artis;
    disk.style.backgroundImage = `url('${song.cover}')`;

    curretTime.innerHTML = '00:00';
    setTimeout(() =>{
        seekBar.max = music.duration;
        musicDuration.innerHTML = formatTime(music.duration)
    },300)
    
    
} 

setMusic(0);

// format time and second format

const formatTime = (time) => {
    let min = Math.floor(time / 60);
    if(min < 10){
        min = `0${min}`;
    }
    let sec = Math.floor(time % 60);
    if(sec < 10){
        sec = `0${sec}`;
    }
    return `${min} : ${sec}`;
}

// navbar hiden

// let lastScrollY = window.scrollY;
//   const nav = document.querySelector('nav');

//   window.addEventListener('scroll', () => {
//     if (window.scrollY > lastScrollY) {
//       // Jika scroll ke bawah, sembunyikan navbar
//       nav.classList.add('nav-hidden');
//     } else {
//       // Jika scroll ke atas, munculkan kembali navbar
//       nav.classList.remove('nav-hidden');
//     }
//     lastScrollY = window.scrollY;
//   });