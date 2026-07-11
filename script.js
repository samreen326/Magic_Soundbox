const intro = document.getElementById("intro");
const game = document.getElementById("game");
const startBtn = document.getElementById("startBtn");

// Controls
const muteBtn = document.getElementById("muteBtn");
const themeBtn = document.getElementById("themeToggle");

// Spell Elements
const spells = document.querySelectorAll(".spell");
const historyList = document.getElementById("historyList");

// Stats
const manaFill = document.getElementById("manaFill");
const xpFill = document.getElementById("xpFill");

// Decorations
const dragon = document.getElementById("dragon");
const achievement = document.getElementById("achievement");

// ------------------------------
// Audio
// ------------------------------

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let muted = false;

// Each spell has a different frequency
const spellAudio = {
    fire: new Audio("https://raw.githubusercontent.com/samreen326/sounds/main/floraphonic-fireball-whoosh-1-179125.mp3"),
    ice: new Audio("https://raw.githubusercontent.com/samreen326/sounds/main/u_qoe8xdq7hm-beam-fire-282361.mp3"),
    lightning: new Audio("https://raw.githubusercontent.com/samreen326/sounds/main/dragon-studio-explosion-sound-effect-425455.mp3"),
    nature: new Audio("https://raw.githubusercontent.com/samreen326/sounds/main/kalsstockmedia-1-second-bird-tweet-looped-d-485744.mp3"),
    wind: new Audio("https://raw.githubusercontent.com/samreen326/sounds/main/dragon-studio-gust-of-wind-511325.mp3"),
    heal: new Audio("https://raw.githubusercontent.com/samreen326/sounds/main/freesound_community-075604_princess-sound-87556.mp3"),
    moon: new Audio("https://raw.githubusercontent.com/samreen326/sounds/main/freesound_community-075604_princess-sound-87556.mp3"),
    meteor: new Audio("https://raw.githubusercontent.com/samreen326/sounds/main/meteor.mp3")
};

Object.values(spellAudio).forEach(sound => {
    sound.volume = 0.7;
});

function playSound(freq){

    if(muted) return;

    if(audioCtx.state === "suspended"){
        audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "triangle";
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0.25,audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + 0.5
    );

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
}

// ------------------------------
// Game State
// ------------------------------

let mana = 100;
let xp = 0;

// ------------------------------
// Intro
// ------------------------------

startBtn.addEventListener("click",()=>{

    intro.style.display="none";

    game.classList.remove("hidden");

});

// ------------------------------
// Cast Spell
// ------------------------------

function castSpell(spell){

    if(mana < 10){

        alert("Not enough mana!");
        return;

    }

    mana -= 10;
    xp += 10;

    updateBars();

if (!muted) {
    spellAudio[spell].pause();
    spellAudio[spell].currentTime = 0;
    spellAudio[spell].play().catch(err => console.log(err));
}

    updateHistory(spell);

    animateSpell(event?.target);

    dragonReaction(spell);

    checkLevel();

}

// ------------------------------
// Button Events
// ------------------------------

spells.forEach(button=>{

    button.addEventListener("click",()=>{

        const spell = button.dataset.spell;

        castSpell(spell);

    });

});

// ------------------------------
// Spell Animation
// ------------------------------

function animateSpell(button){

    if(!button) return;

    button.style.transform="scale(1.15)";
    button.style.boxShadow="0 0 25px gold";

    setTimeout(()=>{

        button.style.transform="";
        button.style.boxShadow="";

    },250);

}

// ------------------------------
// Dragon
// ------------------------------

function dragonReaction(spell){

    const faces = {

        fire:"🐲🔥",
        ice:"🥶",
        lightning:"⚡😲",
        nature:"🦋",
        wind:"💨",
        heal:"😊",
        moon:"😴",
        meteor:"😱",
        arcane:"✨"

    };

    dragon.textContent = faces[spell];

    setTimeout(()=>{

        dragon.textContent="🐉";

    },1200);

}

// ------------------------------
// History
// ------------------------------

function updateHistory(spell){

    const li=document.createElement("li");

    li.textContent=spell.toUpperCase();

    historyList.prepend(li);

    while(historyList.children.length>5){

        historyList.removeChild(historyList.lastChild);

    }

}

// ------------------------------
// Bars
// ------------------------------

function updateBars(){

    manaFill.style.width = mana + "%";

    xpFill.style.width = (xp % 100) + "%";

}

// ------------------------------
// Level Achievement
// ------------------------------

function checkLevel(){

    if(xp>0 && xp%100===0){

        showAchievement("✨ Level Up!");

        mana=100;

        updateBars();

    }

}

// ------------------------------
// Achievement Popup
// ------------------------------

function showAchievement(text){

    achievement.textContent=text;

    achievement.style.right="20px";

    setTimeout(()=>{

        achievement.style.right="-400px";

    },2500);

}

// ------------------------------
// Theme Toggle
// ------------------------------

let dark=true;

themeBtn.addEventListener("click",()=>{

    if(dark){

        document.body.style.background="#f5efe0";
        document.body.style.color="#222";

        themeBtn.textContent="☀️";

    }
    else{

        document.body.style.background="";
        document.body.style.color="white";

        themeBtn.textContent="🌙";

    }

    dark=!dark;

});

// ------------------------------
// Mute
// ------------------------------

muteBtn.addEventListener("click",()=>{

    muted=!muted;

    muteBtn.textContent = muted ? "🔇" : "🔊";

});

// ------------------------------
// Keyboard Shortcuts
// ------------------------------

const keys = {

    q:"fire",
    w:"ice",
    e:"lightning",

    a:"nature",
    s:"wind",
    d:"heal",

    z:"moon",
    x:"meteor",
    c:"arcane"

};

document.addEventListener("keydown",(e)=>{

    const spell = keys[e.key.toLowerCase()];

    if(spell){

        castSpell(spell);

    }

});

// ------------------------------

updateBars();