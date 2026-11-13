// const section = document.querySelector('.hscroll');
// const track = document.querySelector('.box-tugas');   // sebelumnya .hscroll-track

// let distance = 0;

// function setup() {
//     distance = track.scrollWidth - window.innerWidth;
//     if (distance < 0) distance = 0;
//     section.style.height = (distance + window.innerHeight) + 'px';
//     update();
// }

// function update() {
//     if (distance === 0) return;
//     const rect = section.getBoundingClientRect();
//     const progress = Math.min(Math.max(-rect.top / distance, 0), 1);
//     track.style.transform = `translateX(${-progress * distance}px)`;
// }

// let ticking = false;
// window.addEventListener('scroll', () => {
//     if (!ticking) {
//         requestAnimationFrame(() => { update(); ticking = false; });
//         ticking = true;
//     }
// });

// window.addEventListener('resize', setup);
// window.addEventListener('load', setup);
// setup();

const section = document.querySelector('.hscroll');
const track = document.querySelector('.box-tugas');

let distance = 0;

function setup() {
    distance = Math.max(track.scrollWidth - window.innerWidth, 0);
    section.style.height = (distance + window.innerHeight) + 'px';
    update();
}

function update() {
    if (distance === 0) return;
    const rect = section.getBoundingClientRect();
    const progress = Math.min(Math.max(-rect.top / distance, 0), 1);
    track.style.transform = `translateX(${-progress * distance}px)`;
}

window.addEventListener('scroll', update, { passive: true });
window.addEventListener('resize', setup);
window.addEventListener('load', setup);
setup();