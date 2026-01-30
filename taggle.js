// let taggle = document.getElementById('taggle');
// console.log(`taggle: ${taggle}`)

// taggle.addEventListener("click", (e) => {
//     const btn = e.target.closest('button')
//     if (!btn) return;
    
//     document.querySelectorAll('#taggle button')
//     .forEach(b => b.classList.remove('mode'));

//     btn.classList.add('mode');

// })

import { clearAll } from "./scientific-script.js";

const taggle = document.getElementById('taggle');
const slider = document.getElementById('slider');
const buttons = document.querySelectorAll('.mode-btn');
const allStdBtn = document.getElementById('all-btn-stn');
const allSciBtn = document.getElementById('all-btn-scientific');
const container = document.getElementById('calculator-container');
const memorySideBar = document.getElementById('memory-side-bar');
const calculatorWM = document.getElementById('calculator-with-memory');

// const scientificButton = document.querySelectorAll('.scientific-button');

// console.log(scientificButton);

export let currentMode = "standard";


function updateToggle(activeBtn) {
    slider.style.left = `${activeBtn.offsetLeft}px`;
    slider.style.width = `${activeBtn.offsetWidth}px`;
    slider.style.height = `${activeBtn.offsetHeight}px`;

    buttons.forEach(btn => {
        if (btn === activeBtn) {
            btn.classList.remove('text-gray-400');
            btn.classList.add('text-black');
        } else {
            btn.classList.remove('text-black');
            btn.classList.add('text-gray-400');
        }
    });

    const mode = activeBtn.innerText.trim();

    if (mode === "Scientific") {
        currentMode = "scientific";

        allSciBtn.classList.remove('hidden');
        allStdBtn.classList.add('hidden');
        container.classList.remove('w-200', 'h-150');
        container.classList.add('w-250', 'h-150');
        memorySideBar.classList.remove('hidden');
        calculatorWM.classList.add('ml-20')        
        // scientificButton.classList.remove('hidden');
        // scientificButton.classList.add('block');
        clearAll()

        // Show scientific buttons
        // scientificButton.forEach(btn => btn.classList.remove('hidden'));
        // console.log(scientificButton);

    } else {
        currentMode = "standard";
        allStdBtn.classList.remove('hidden');
        allSciBtn.classList.add('hidden');
        
        container.classList.remove('w-250', 'h-150');
        container.classList.add('w-200', 'h-150');
        memorySideBar.classList.add('hidden');
        calculatorWM.classList.remove('ml-20')  
    }
}

taggle.addEventListener("click", (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    updateToggle(btn);
});

updateToggle(buttons[0]);