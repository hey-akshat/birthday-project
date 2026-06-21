// ==========================================
// CONFIGURATION (Edit this section later)
// ==========================================
const CONFIG = {
    targetName: "diksha",
    masterPassword: "300526", // <--- THE MASTER KEY

    // THE MASTER VOLUME CONTROLLER (0.0 = Muted, 1.0 = Max Volume)
    bgmVolume: 0.1,
    
    // THE TESTING SWITCH: Change to 'false' when you are ready for the real June 22nd launch
    isTestingMode: false, 
    
    // The exact lock date: June 22, 2026 at 12:00:00 AM (Midnight) in Indian Standard Time
    targetDateString: "2026-06-22T00:00:00+05:30",
    audioFile: "/audio/bg-music.mp3", 
    
    // Interactive Sound Effects
    sfx: {
        pop: "/audio/pop.mp3",
        type: "/audio/type.mp3",
        error: "/audio/error.mp3",

        // NEW LOGIN SOUNDS
        keyPress: "/audio/key-press.mp3",
        keyBackspace: "/audio/key-backspace.mp3",
        unlockSuccess: "/audio/unlock-success.mp3"
    },
    
    initialGreetingContent: "<div class='landscape-player'><video src='/videos/memory1.mp4' controls playsinline></video></div>",
        stickers: [
            { 
                title: "Jldi aashirvad lelo, genz aarti hai 🤣", 
                src: "/stickers/sticker1.png", 
                // THE FIX: Added width: 100% to stop the overflow, and 'autoplay' to unfreeze the video!
                content: "<div class='landscape-player' style='width: 100%;'><video src='/videos/cat-dance.mp4' autoplay loop muted playsinline style='width: 100%; outline: none; border: none;'></video></div>" 
            },
            { 
                title: "Kaafi pehle ka hai 🤓", 
                src: "/stickers/sticker2.png", 
                // Notice we are using 'portrait-player' instead of 'landscape-player' here!
                content: "<div class='portrait-player'><video src='/videos/your-3-sec-video.mp4' autoplay loop muted playsinline></video></div>" 
            },
            { 
                title: "Contract.exe", 
                src: "/stickers/sticker3.png", 
                instant: true, // <--- This completely disables the typing and sound!
                content: "<img src='/pics/contract.jpeg' style='width: 100%; border: 2px inset #fff;'><p style='margin-top: 10px;'>Contract yaad rakhna, interest bdh rha hai 🤣</p>" 
            },
            { 
                title: "Tumhare liye gift 😁", 
                src: "/stickers/sticker4.png", 
                instant: true, // THE FIX: This completely skips the typing animation!
                content: "<img src='/pics/message-4.png' style='width: 100%; border: 2px inset #fff; display: block;'>" 
            },
            { 
                title: "Leave_a_Note.exe", 
                src: "/stickers/sticker5.png", 
                instant: true, // <--- THE FIX: Add this line!
                content: `
                <div class="notebook-page">
                    <p class="handwriting">Bohot bdhiya...</p>
                    <p class="handwriting">Kuch shabd aap kehna chahengi?</p>
                    <textarea id="secret-message" class="handwriting-input" placeholder="Scribble something here..."></textarea>
                    <button id="send-msg-btn" class="handwriting-btn">Send</button>
                </div>
                ` 
            }
        ],
    
        finaleContent: "<img src='/pics/final-pic.png' style='max-height: 40vh;'><p>All jokes aside, a very Happy Birthday!</p><p>May you achieve whatever you want in life.<br>I hope all your dreams come true.</p><p>Mujhse aashirvaad le lena, poore ho hi jayenge,<br>and tumhara Vrindavan jaane ka sapna bhi poora ho jaye. 😁</p><p>Once again, a very Happy Birthday! ❤️</p>",
    emojis: { waiting: "🙄", correct: "😻", wrong: "🥲", backspace: "😒", locked: "⏳" },
    thoughts: { 
        waiting: "Naam to yaad hoga apna?", 
        correct: "Sahi hai, aage badho", 
        wrong: "Dimag hi nhi hai", 
        backspace: "Ghutna check kro",
        locked: "Arey Madam ji, right person, wrong time!"
    },
    secretNames: {
        akshat: {
            target: "akshat",
            emoji: "😏",
            thought: "Itni yaad aa rahi hai meri?",
            // THE FIX: Replaced the text with your contract image
            payloadContent: "<img src='/pics/question.png' style='width: 100%; max-width: 696px; height: auto; border: 2px inset #fff; display: block;'>"
        },
        toffee: {
            target: "toffee",
            emoji: "🐶",
            thought: "Spelling aati hai?", 
            // THE FIX: Added a clickable button that opens YouTube in a new tab
            payloadContent: "<div style='text-align: center;'><p>Kuch entertaining dekhna hai?</p><a href='https://www.youtube.com/watch?v=YLF4sKkUzSQ&list=RDYLF4sKkUzSQ&start_radio=1' target='_blank' style='display: inline-block; margin-top: 15px; padding: 8px 16px; background: #000080; color: #fff; text-decoration: none; border: 2px outset #fff; font-family: \"VT323\", monospace; font-size: 1.2rem; cursor: pointer;'>▶ Watch on YouTube</a></div>"
        }
    }
};

// FORCE PREVENT MOBILE ZOOM & LAYOUT BREAKING
const meta = document.createElement('meta');
meta.name = "viewport";
meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
document.head.appendChild(meta);
// ==========================================
// ASSET PRELOADER ENGINE (WITH MINIMUM BOOT TIME)
// ==========================================
// UPGRADE: Added body margin reset and absolute screen pinning to kill background bleed
const styleOverride = document.createElement('style');
styleOverride.innerHTML = `
    body, html { margin: 0 !important; padding: 0 !important; }
    #boot-screen {
        position: fixed !important;
        top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
        width: 100% !important; height: 100% !important;
        background-color: #fdf0f5 !important; 
        z-index: 999999 !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: center !important;
    }
`;
document.head.appendChild(styleOverride);

window.onload = () => {
    const assetsToLoad = [
        CONFIG.audioFile,
        '/pics/toffee-run.png',
        ...CONFIG.stickers.map(s => s.src)
    ].filter(Boolean); 

    let loadedCount = 0;
    let isSystemReady = false; 
    const bootText = document.getElementById('boot-text');
    const progressFill = document.getElementById('progress-fill');
    const bootScreen = document.getElementById('boot-screen');

    function completeLoading() {
        if (isSystemReady) return;
        isSystemReady = true;
        
        if (bootText) bootText.innerText = `READY FOR THE SPECIAL SURPRISE!`;
        if (progressFill) progressFill.style.width = `100%`;
        
        setTimeout(() => {
            if (bootScreen) {
                bootScreen.style.opacity = '0';
                setTimeout(() => bootScreen.remove(), 1000);
            }
        }, 800); // Wait almost a second on the final message before fading
    }

    function updateProgress() {
        if (isSystemReady) return;
        loadedCount++;
        const percent = Math.floor((loadedCount / assetsToLoad.length) * 100);
        
        // UPGRADE: Artificial Stagger Delay
        // Multiplies the loaded count by 300ms so the bar physically takes time to fill
        // even if the files are downloaded instantly.
        setTimeout(() => {
            if (bootText) bootText.innerText = `LOADING... ${percent}%`; 
            if (progressFill) progressFill.style.width = `${percent}%`;

            if (loadedCount >= assetsToLoad.length) {
                // Wait 1 second at 100% before triggering the unlock
                setTimeout(completeLoading, 1000);
            }
        }, loadedCount * 300); 
    }

    setTimeout(() => {
        if (!isSystemReady) {
            console.warn("Preloader timed out. Forcing system unlock.");
            completeLoading();
        }
    }, 8000); // Extended failsafe to 8 seconds to accommodate the aesthetic delay

    if (assetsToLoad.length === 0) {
        completeLoading();
        return;
    }

    assetsToLoad.forEach(src => {
        if (src.endsWith('.mp3') || src.endsWith('.wav')) {
            const audio = new Audio();
            audio.addEventListener('canplaythrough', updateProgress, { once: true });
            audio.addEventListener('error', updateProgress, { once: true });
            audio.src = src;
            audio.load(); 
        } else {
            const img = new Image();
            img.onload = updateProgress;
            img.onerror = updateProgress;
            img.onabort = updateProgress; 
            img.src = src;
        }
    });
};

let globalZIndex = 100;

// ==========================================
// MAGIC CURSOR & PARTICLE TRAIL
// ==========================================
let lastSparkleTime = 0;

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;

    const size = Math.random() * 8 + 4; 
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;

    document.body.appendChild(sparkle);

    setTimeout(() => {
        sparkle.remove();
    }, 800);
}

const handleSparkle = (e) => {
    const now = Date.now();
    if (now - lastSparkleTime < 40) return; 

    let x, y;
    if (e.type.includes('touch')) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
    } else {
        x = e.clientX;
        y = e.clientY;
    }

    createSparkle(x - 5, y - 5);
    lastSparkleTime = now;
};

document.addEventListener('mousemove', handleSparkle);
document.addEventListener('touchmove', handleSparkle, { passive: true });
// ==========================================
// DOM ELEMENTS
// ==========================================
const gateScreen = document.getElementById('gate-screen');
const mainScreen = document.getElementById('main-screen');

// INJECT GLOBAL TRY AGAIN BUTTON (Responsive)
const globalTryAgainBtn = document.createElement('button');
globalTryAgainBtn.id = 'global-try-again';
// Separate the text and icon so we can hide the text on mobile
globalTryAgainBtn.innerHTML = '<span class="try-text">Try Again </span><span class="try-icon">↺</span>';
// THE FIX: Reset the gatekeeper logic instead of refreshing the page
globalTryAgainBtn.onclick = () => {
    if (typeof resetGatekeeper === 'function') {
        resetGatekeeper();
        
        // On mobile, automatically pop the custom keyboard back up so she can start typing instantly
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;
        if (isMobile) {
            document.body.classList.add('show-keyboard');
        }
    }
};

// Attach it inside the glass panel so it can anchor to the bottom right
const glassPanelTarget = document.querySelector('.glass-panel');
if (glassPanelTarget) {
    glassPanelTarget.appendChild(globalTryAgainBtn);
}

// INJECT THE CINEMATIC LOGIN VIDEO (With Hardware Detection)
if (gateScreen) {
    const loginVideoBg = document.createElement('video');
    const isHighResScreen = window.innerWidth > 1200 || (window.innerWidth > 768 && window.devicePixelRatio > 1.5);
    
    // MIXED EXTENSION FIX: 4K is an MP4, 1080p is a WEBM
    loginVideoBg.src = isHighResScreen ? '/videos/bg1-4k.mp4' : '/videos/bg1-1080p.mp4';
    
    loginVideoBg.autoplay = true;
    loginVideoBg.loop = true;
    loginVideoBg.muted = true; 
    loginVideoBg.playsInline = true;
    
    // THE BROWSER OVERRIDE FIX
    loginVideoBg.setAttribute('muted', '');
    loginVideoBg.setAttribute('playsinline', '');
    loginVideoBg.setAttribute('autoplay', '');
    
    loginVideoBg.className = 'login-bg-video';
    
    gateScreen.insertBefore(loginVideoBg, gateScreen.firstChild);
}

// INJECT THE MAIN DESKTOP CINEMATIC VIDEO (Background 2)
const mainVideoBg = document.createElement('video');
const isHighResScreenDesktop = window.innerWidth > 1200 || (window.innerWidth > 768 && window.devicePixelRatio > 1.5);

mainVideoBg.src = isHighResScreenDesktop ? '/videos/bg2-4k.webm' : '/videos/bg2-1080p.mp4';
mainVideoBg.autoplay = true;
mainVideoBg.loop = true;
mainVideoBg.muted = true; 
mainVideoBg.playsInline = true;

// THE BROWSER OVERRIDE FIX
mainVideoBg.setAttribute('muted', '');
mainVideoBg.setAttribute('playsinline', '');
mainVideoBg.setAttribute('autoplay', '');

mainVideoBg.className = 'main-bg-video';

// Start it completely invisible
mainVideoBg.style.opacity = '0';
mainVideoBg.style.transition = 'opacity 1.5s ease-in-out';

// CRITICAL FIX: Append it to the absolute bottom of the entire document
document.body.prepend(mainVideoBg);

const nameInput = document.getElementById('name-input');
const reactionEmoji = document.getElementById('reaction-emoji');
const stickerContainer = document.getElementById('sticker-container');

const reactionContainer = document.getElementById('reaction-container');
const reactionWrapper = document.createElement('div');
reactionWrapper.id = 'reaction-wrapper';
if (reactionContainer && reactionContainer.parentNode) {
    reactionContainer.parentNode.insertBefore(reactionWrapper, reactionContainer);
    reactionWrapper.appendChild(reactionContainer);
}

const thoughtBubble = document.createElement('div');
thoughtBubble.className = 'thought-bubble';
thoughtBubble.textContent = CONFIG.thoughts.waiting;
reactionWrapper.appendChild(thoughtBubble);

// ==========================================
// MOBILE OVERLAYS: LANDSCAPE LOCK & KEYBOARD
// ==========================================

// 1. Inject the Landscape Lock Screen
const landscapeLock = document.createElement('div');
landscapeLock.id = 'landscape-lock';
landscapeLock.innerHTML = `
    <div class="rotate-icon">📱</div>
    <h2>Rotate your phone</h2>
    <p>Please turn your device sideways to continue!</p>
`;
document.body.appendChild(landscapeLock);

// 2. Inject the Custom Bubbly Keyboard & Render Engine
const keyboard = document.createElement('div');
keyboard.id = 'custom-keyboard';
document.body.appendChild(keyboard);

// State variable to track which layout is active
let isNumberLayout = false;

// The Render Engine: Rebuilds the keyboard on command
// The Render Engine: Rebuilds the keyboard on command
function renderKeyboard() {
    const letterRows = [
        ['q','w','e','r','t','y','u','i','o','p'],
        ['a','s','d','f','g','h','j','k','l'],
        ['123','z','x','c','v','b','n','m', 'del'],
        ['space'] // <--- THE FIX: Added a spacebar row
    ];

    const numberRows = [
        ['1','2','3','4','5','6','7','8','9','0'],
        ['-','/','.',',','?','!','@','#','&'],
        ['abc','_','+','(',')','*',':','"', 'del'],
        ['space'] // <--- THE FIX: Added a spacebar row
    ];

    const activeRows = isNumberLayout ? numberRows : letterRows;
    let keyboardHTML = '';
    
    activeRows.forEach(row => {
        keyboardHTML += '<div class="keyboard-row">';
        row.forEach(key => {
            if (key === 'del') {
                keyboardHTML += `<button class="key-btn action-key" data-key="Backspace">⌫</button>`;
            } else if (key === '123' || key === 'abc') {
                keyboardHTML += `<button class="key-btn action-key" data-key="Toggle">${key.toUpperCase()}</button>`;
            } else if (key === 'space') {
                // THE FIX: Special rendering for the space bar
                keyboardHTML += `<button class="key-btn space-key" data-key=" ">SPACE</button>`;
            } else {
                keyboardHTML += `<button class="key-btn" data-key="${key}">${key}</button>`;
            }
        });
        keyboardHTML += '</div>';
    });
    keyboard.innerHTML = keyboardHTML;
}

// Build the keyboard for the first time
renderKeyboard();

// 3. Universal Keyboard Logic (Login + Secret Message + Outside Tap)
let activeInputField = nameInput; 
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;

let isKeyboardLocked = false;

if (nameInput && isMobile) {
    nameInput.setAttribute('readonly', 'true');
}

const handleTouchAndClick = (e) => {
    const isInputTap = e.target.id === 'name-input' || e.target.id === 'secret-message';
    
    // THE TOGGLE FIX: Check if she tapped a key, even if that key was just destroyed by the 123/abc render!
    const isKeyboardTap = e.target.closest('#custom-keyboard') || (e.target.classList && e.target.classList.contains('key-btn'));

    if (isInputTap) {
        activeInputField = e.target; 
        
        if (isMobile && !document.body.classList.contains('show-keyboard')) {
            e.target.setAttribute('readonly', 'true'); 
            document.body.classList.add('show-keyboard');
            
            // THE VISUAL FIX: Apply a CSS lock class so the keys don't visually enlarge
            keyboard.classList.add('locked-visuals');
            isKeyboardLocked = true;
            
            setTimeout(() => {
                isKeyboardLocked = false;
                keyboard.classList.remove('locked-visuals'); // Removes the visual lock
            }, 300);
        }
    } else if (!isKeyboardTap) {
        document.body.classList.remove('show-keyboard');
    }
};

document.addEventListener('click', handleTouchAndClick);
document.addEventListener('touchstart', handleTouchAndClick, { passive: true });

// Handle the custom button presses
keyboard.addEventListener('click', (e) => {
    // THE FIX: Stop everything if the security lock is active
    if (isKeyboardLocked) return;

    if (!e.target.classList.contains('key-btn')) return;
    if (!activeInputField) return; 
    
    const key = e.target.getAttribute('data-key');
    
    // Handle Layout Toggle
    if (key === 'Toggle') {
        isNumberLayout = !isNumberLayout; 
        renderKeyboard();                 
        return;                           
    }
    
    // Handle Typing
    if (key === 'Backspace') {
        activeInputField.value = activeInputField.value.slice(0, -1);
    } else {
        // Apply 15 char limit ONLY to the login box, let the secret message be long!
        if (activeInputField.id === 'name-input' && activeInputField.value.length >= 15) {
            return; 
        }
        activeInputField.value += key;
    }

    // Trigger existing animation/typing logic for whatever box is currently active
    const inputEvent = new Event('input', { bubbles: true });
    activeInputField.dispatchEvent(inputEvent);
});
// ==========================================
// CINEMATIC AUDIO & FADE ENGINE
// ==========================================
const bgMusic = new Audio(CONFIG.audioFile);
bgMusic.loop = true;
bgMusic.volume = CONFIG.bgmVolume;

// The Fade Engine: Smoothly transitions volume up or down
function fadeAudio(audio, targetVolume, durationMs) {
    const steps = 20;
    const stepTime = durationMs / steps;
    const volumeStep = (targetVolume - audio.volume) / steps;
    
    if(audio.fadeInterval) clearInterval(audio.fadeInterval);
    
    audio.fadeInterval = setInterval(() => {
        let newVolume = audio.volume + volumeStep;
        if (newVolume < 0) newVolume = 0;
        if (newVolume > 1) newVolume = 1;
        
        audio.volume = newVolume;
        
        if ((volumeStep > 0 && audio.volume >= targetVolume) || 
            (volumeStep < 0 && audio.volume <= targetVolume)) {
            audio.volume = targetVolume;
            clearInterval(audio.fadeInterval);
        }
    }, stepTime);
}

// Start music on the absolute first screen tap/click (Bypasses Browser Autoplay Blocks)
let musicStarted = false;
const startBackgroundMusic = () => {
    if (!musicStarted) {
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Success! The browser allowed it.
                musicStarted = true; 
                
                // Now that it is playing, we can safely remove the listeners
                document.removeEventListener('click', startBackgroundMusic);
                document.removeEventListener('touchstart', startBackgroundMusic);
                document.removeEventListener('touchend', startBackgroundMusic);
            }).catch(error => {
                console.log("Browser blocked auto-play, waiting for next tap...");
                // It failed, but because musicStarted is still false, it will try again on the next tap!
            });
        }
    }
};

// THE FIX: Listen to the entire document, on multiple touch phases, and keep trying until it succeeds
document.addEventListener('click', startBackgroundMusic);
document.addEventListener('touchstart', startBackgroundMusic, { passive: true });
document.addEventListener('touchend', startBackgroundMusic, { passive: true });
document.body.addEventListener('click', startBackgroundMusic, { once: true });
document.body.addEventListener('touchstart', startBackgroundMusic, { once: true });

// ==========================================
// SFX ENGINE
// ==========================================
function playSound(src, volume = 1.0) {
    const sound = new Audio(src);
    sound.volume = volume;
    sound.play().catch(e => console.log("SFX blocked until interaction")); 
}

// ==========================================
// 1. THE GATEKEEPER (MULTI-TARGET LOGIC)
// ==========================================
let previousLength = 0;
let countdownInterval;

const glassPanel = document.querySelector('.glass-panel');
const countdownDisplay = document.createElement('div');
countdownDisplay.id = 'countdown-display';
if (glassPanel) glassPanel.appendChild(countdownDisplay);

const resetGatekeeper = () => {
    if (!nameInput) return;
    nameInput.value = '';
    nameInput.disabled = false;
    reactionEmoji.textContent = CONFIG.emojis.waiting;
    thoughtBubble.textContent = CONFIG.thoughts.waiting;
    previousLength = 0;
    nameInput.focus(); 
};

if (nameInput) {
    nameInput.addEventListener('input', (e) => {
        const currentText = nameInput.value.toLowerCase();
        const currentLength = currentText.length;

        thoughtBubble.style.animation = 'none';
        thoughtBubble.offsetHeight; 
        thoughtBubble.style.animation = null;

        // NEW SOUND LOGIC: Detect Backspace vs Normal Typing
        if (currentLength < previousLength) {
            playSound(CONFIG.sfx.keyBackspace, 0.5); 
        } else if (currentLength > previousLength) {
            playSound(CONFIG.sfx.keyPress, 0.3); 
        }

        const validTargets = [
            CONFIG.targetName.toLowerCase(), 
            CONFIG.secretNames.akshat.target, 
            CONFIG.secretNames.toffee.target,
            CONFIG.masterPassword // <--- ADD THIS HERE
        ];
        
        let matchedTarget = null;
        let isError = true;

        for (let target of validTargets) {
            if (target.startsWith(currentText)) {
                matchedTarget = target;
                isError = false;
                break;
            }
        }

        // Keep your previous UI logic (including the 3-letter delay)
        if (currentLength < previousLength) {
            reactionEmoji.textContent = CONFIG.emojis.backspace;
            thoughtBubble.textContent = CONFIG.thoughts.backspace;
        } else if (!isError) {
            if (matchedTarget === CONFIG.targetName.toLowerCase()) {
                reactionEmoji.textContent = CONFIG.emojis.correct;
                thoughtBubble.textContent = CONFIG.thoughts.correct;
            } else if (matchedTarget === CONFIG.secretNames.akshat.target) {
                if (currentLength >= 3) {
                    reactionEmoji.textContent = CONFIG.secretNames.akshat.emoji;
                    thoughtBubble.textContent = CONFIG.secretNames.akshat.thought;
                } else {
                    reactionEmoji.textContent = CONFIG.emojis.correct;
                    thoughtBubble.textContent = CONFIG.thoughts.correct;
                }
            } else if (matchedTarget === CONFIG.secretNames.toffee.target) {
                if (currentLength >= 3) {
                    reactionEmoji.textContent = CONFIG.secretNames.toffee.emoji;
                    thoughtBubble.textContent = CONFIG.secretNames.toffee.thought;
                } else {
                    reactionEmoji.textContent = CONFIG.emojis.correct;
                    thoughtBubble.textContent = CONFIG.thoughts.correct;
                }
            }
        } else {
            reactionEmoji.textContent = CONFIG.emojis.wrong;
            thoughtBubble.textContent = CONFIG.thoughts.wrong;
        }
        
        previousLength = currentLength;

        // NEW SUCCESS SOUND LOGIC: Trigger chime and lock input when complete
        if (currentText === CONFIG.masterPassword) {
            // IMMEDIATE OVERRIDE: Destroys timers and opens the site instantly
            playSound(CONFIG.sfx.unlockSuccess, 0.1); // <-- Changed from 0.8 to 0.4
            nameInput.disabled = true;
            if (countdownInterval) clearInterval(countdownInterval);
            if (countdownDisplay) countdownDisplay.style.display = 'none';
            unlockWebsite();
        } else if (currentText === CONFIG.targetName.toLowerCase()) {
            playSound(CONFIG.sfx.unlockSuccess, 0.1); // <-- Changed from 0.8 to 0.4
            nameInput.disabled = true;
            
            // THE FIX: Hide the custom keyboard so she can see the countdown!
            document.body.classList.remove('show-keyboard'); 
            
            checkTimeLock();
        } else if (currentText === CONFIG.secretNames.akshat.target) {
            playSound(CONFIG.sfx.unlockSuccess, 0.1); // <-- Changed from 0.8 to 0.4
            nameInput.disabled = true;
            fadeAudio(bgMusic, 0, 500); // THE FIX: Fade out to 0%
            setTimeout(() => {
                openRetroWindow("Solve this 😂", CONFIG.secretNames.akshat.payloadContent, () => {
                    resetGatekeeper();
                    fadeAudio(bgMusic, CONFIG.bgmVolume, 1000); // THE FIX: Fade back in!
                }, '', true);
            }, 500);
        } else if (currentText === CONFIG.secretNames.toffee.target) {
            playSound(CONFIG.sfx.unlockSuccess, 0.1); // <-- Changed from 0.8 to 0.4
            nameInput.disabled = true;
            fadeAudio(bgMusic, 0, 500); // THE FIX: Fade out to 0%
            setTimeout(() => {
                openRetroWindow("Toffee.exe", CONFIG.secretNames.toffee.payloadContent, () => {
                    resetGatekeeper();
                    fadeAudio(bgMusic, CONFIG.bgmVolume, 1000); // THE FIX: Fade back in!
                }, '', true);
            }, 500);
        }
    });
}


// ==========================================
// NETWORK TIME SYNC ENGINE
// ==========================================
let timeOffset = 0; 

// Silently fetches the exact Indian Standard Time from a global API
async function syncNetworkTime() {
    try {
        const response = await fetch("https://worldtimeapi.org/api/timezone/Asia/Kolkata");
        const data = await response.json();
        const networkTime = new Date(data.datetime).getTime();
        const localTime = new Date().getTime();
        timeOffset = networkTime - localTime; // Calculates the difference if her clock is wrong
    } catch (error) {
        console.log("Network time failed. Falling back to local device time.");
        timeOffset = 0;
    }
}
syncNetworkTime(); // Run it instantly in the background

function checkTimeLock() {
    let unlockTarget;
    const now = new Date().getTime() + timeOffset;

    // THE SWITCH LOGIC
    if (CONFIG.isTestingMode) {
        unlockTarget = now + 10000; // Sets exactly 10 seconds from when the name is typed
    } else {
        unlockTarget = new Date(CONFIG.targetDateString).getTime();
    }
    
    if (now >= unlockTarget) {
        setTimeout(unlockWebsite, 800);
    } else {
        reactionEmoji.textContent = CONFIG.emojis.locked;
        thoughtBubble.textContent = CONFIG.thoughts.locked;
        countdownDisplay.style.display = 'block';
        
        countdownInterval = setInterval(() => {
            const currentTime = new Date().getTime() + timeOffset;
            const distance = unlockTarget - currentTime;
            
            if (distance <= 0) {
                clearInterval(countdownInterval);
                countdownDisplay.style.display = 'none';
                unlockWebsite(); 
            } else {
                // Upgraded to calculate total days remaining
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                countdownDisplay.innerHTML = `Wait for it...<br>${days}d ${hours}h ${minutes}m ${seconds}s`;
            }
        }, 1000);
    }
}

// ==========================================
// UNLOCK SEQUENCE & VIDEO WAKE-UP
// ==========================================
function unlockWebsite() {
    document.body.classList.remove('show-keyboard');
    const tryBtn = document.getElementById('global-try-again');
    if (tryBtn) tryBtn.remove();
    const assistant = document.getElementById('toffee-assistant');
    if (assistant) assistant.remove();
    
    if (gateScreen) {
        gateScreen.classList.add('hidden');
        gateScreen.classList.remove('active');
    }
    
    if (mainScreen) {
        mainScreen.classList.remove('hidden');
        mainScreen.classList.add('active');
        
        const desktopVideo = document.querySelector('.main-bg-video');
        if (desktopVideo) {
            desktopVideo.style.opacity = '1';
            desktopVideo.play().catch(e => console.log("Video auto-play handled."));
        }
    }
    
    
    
    // FORCE CLEANUP: Ensure the body is not hiding anything by mistake
    document.body.classList.remove('dim-stickers');

    fadeAudio(bgMusic, 0, 500); // THE FIX: Fade out for the AI Video
    
    // Open the First Memory Video
    // Open the First Memory Video
    openDraggableWindow("A little something i made", CONFIG.initialGreetingContent, () => {

        fadeAudio(bgMusic, CONFIG.bgmVolume, 1000); // THE FIX: Fade back in when closed!
        
        // 1. Create the Giant Instruction Overlay
        const instructionOverlay = document.createElement('div');
        instructionOverlay.id = 'instruction-overlay';
        instructionOverlay.innerText = 'Click on the stickers!';
        document.body.appendChild(instructionOverlay);

        // 2. Trigger the smooth fade-in and scale-up animation
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                instructionOverlay.classList.add('show');
            });
        });

        // 3. Hold it on screen for 2.5 seconds, then fade it out
        setTimeout(() => {
            instructionOverlay.classList.remove('show');
            
            // 4. Wait for the fade out to finish, then finally spawn the stickers!
            setTimeout(() => {
                instructionOverlay.remove();
                initStickerGame(); 
            }, 800); 
            
        }, 2500);

    }, 'greeting-window', false); 
}
// ==========================================
// 2. STICKER PHYSICS ENGINE
// ==========================================
let activeStickers = [];
let caughtCount = 0;
let animationFrameId;
function initStickerGame() {
    // Completely wipe old memory
    activeStickers = [];
    document.querySelectorAll('.sticker').forEach(s => s.remove());

    const isMobile = window.innerWidth <= 768;
    const baseSpeed = isMobile ? 3.0 : 2; 
    
    CONFIG.stickers.forEach((data, index) => {
        const el = document.createElement('img');
        el.src = data.src;
        el.onerror = () => { el.src = 'https://via.placeholder.com/100?text=Sticker'; };
        el.className = 'sticker';
        
        const x = Math.random() * (window.innerWidth - 180);
        const y = Math.random() * (window.innerHeight - 180);
        
        let vx = (Math.random() - 0.5) * 2; 
        let vy = (Math.random() - 0.5) * 2; 

        if (Math.abs(vx) < 0.4) vx = vx > 0 ? 0.4 : -0.4;
        if (Math.abs(vy) < 0.4) vy = vy > 0 ? 0.4 : -0.4;

        vx *= baseSpeed;
        vy *= baseSpeed;

        // NUCLEAR OPTION: Inject directly into the main body, bypassing all containers and layer traps
        document.body.appendChild(el); 

        const stickerObj = { el, x, y, vx, vy, active: true, data: data };
        activeStickers.push(stickerObj);

        el.addEventListener('click', () => catchSticker(stickerObj));
    });

    animateStickers();
}

function animateStickers() {
    activeStickers.forEach(st => {
        if (!st.active) return; 

        st.x += st.vx;
        st.y += st.vy;

        if (st.x <= 0 || st.x >= window.innerWidth - 100) st.vx *= -1;
        if (st.y <= 0 || st.y >= window.innerHeight - 100) st.vy *= -1;

        st.el.style.left = `${st.x}px`;
        st.el.style.top = `${st.y}px`;
    });

    animationFrameId = requestAnimationFrame(animateStickers);
}

// ==========================================
// 3. WINDOW MODAL & WIN STATE
// ==========================================
function catchSticker(stickerObj) {
    if (!stickerObj.active) return;
    
    stickerObj.active = false; 
    playSound(CONFIG.sfx.pop, 0.8);
    
    const rect = stickerObj.el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    stickerObj.el.style.display = 'none';

    const particleCount = 12; 
    
    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        p.className = 'burst-particle';
        
        const size = Math.random() * 7 + 8;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        
        p.style.left = `${centerX - size/2}px`;
        p.style.top = `${centerY - size/2}px`;
        
        document.body.appendChild(p);

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 60 + 40; 
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        const animation = p.animate([
            { transform: `translate(0, 0) scale(1)`, opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
        ], {
            duration: 800 + Math.random() * 400, 
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)', 
            fill: 'forwards'
        });

        animation.onfinish = () => p.remove();
    }

    setTimeout(() => {
        // Grab both the message AND the custom title for this specific window
        const currentStickerData = CONFIG.stickers[caughtCount];
        const sequentialMessage = currentStickerData.content;
        const customTitle = currentStickerData.title || "Memory.exe"; 
        const isInstant = currentStickerData.instant || false; 
        
        fadeAudio(bgMusic, 0, 500); // THE FIX: Smoothly fade out

        openRetroWindow(customTitle, sequentialMessage, () => {
            
            fadeAudio(bgMusic, CONFIG.bgmVolume, 1000); // THE FIX: Smoothly fade back in!

            caughtCount++;
            if (caughtCount === CONFIG.stickers.length) {
                triggerWinState();
            }
        }, '', isInstant); 

    }, 600);
}
// ==========================================
// WINDOW TYPE 1: Centered Modal (For Stickers)
// ==========================================
// Add disableTyping = false right at the end of the brackets
// ==========================================
// WINDOW TYPE 1: Centered Modal (For Stickers)
// ==========================================
// Add disableTyping = false right at the end of the brackets
function openRetroWindow(title, contentHTML, onClose, customClass = '', disableTyping = false) {
    const modalLayer = document.createElement('div');
    modalLayer.id = 'modal-layer';
    
    modalLayer.innerHTML = `
        <div class="retro-window ${customClass}">
            <div class="title-bar">
                <span>${title}</span>
                <button class="close-btn" disabled style="opacity: 0.5; cursor: not-allowed;">X</button>
            </div>
            <div class="window-content">
                <div class="typing-container"></div>
            </div>
        </div>
    `;

    document.body.appendChild(modalLayer);
    document.body.classList.add('dim-stickers');

    const closeBtn = modalLayer.querySelector('.close-btn');
    const typingContainer = modalLayer.querySelector('.typing-container');

    let isTyping = true;
    const tokens = contentHTML.split(/(<[^>]+>)/); 
    let currentHTML = "";

    async function typeOut() {
        // THE FIX: If the instant switch is flipped, render instantly and kill the typing loop
        if (disableTyping) {
            typingContainer.innerHTML = contentHTML; 
            closeBtn.style.opacity = '1';
            closeBtn.style.cursor = 'pointer';
            closeBtn.disabled = false; 
            
            closeBtn.addEventListener('click', () => {
                modalLayer.remove(); 
                document.body.classList.remove('dim-stickers');
                if (onClose) onClose();
            });
            return; // Stops the rest of the function from running!
        }

        let typeCounter = 0; 

        // THE RESTORED TYPING LOOP
        for(let i=0; i<tokens.length; i++) {
            if (!isTyping) break;
            if(tokens[i].startsWith("<")) {
                currentHTML += tokens[i];
                typingContainer.innerHTML = currentHTML + '<span class="blinking-cursor">|</span>';
            } else {
                for(let char of tokens[i]) {
                    if (!isTyping) break;
                    currentHTML += char;
                    typingContainer.innerHTML = currentHTML + '<span class="blinking-cursor">|</span>';
                    
                    typeCounter++;
                    if (typeCounter % 3 === 0) {
                        playSound(CONFIG.sfx.type, 0.2); 
                    }

                    await new Promise(r => setTimeout(r, 40)); 
                }
            }
        }
        typingContainer.innerHTML = currentHTML; 
        closeBtn.style.opacity = '1';
        closeBtn.style.cursor = 'pointer';
        closeBtn.disabled = false; 
        
        closeBtn.addEventListener('click', () => {
            modalLayer.remove(); 
            document.body.classList.remove('dim-stickers');
            if (onClose) onClose();
        });

        // Wakes up any video inside the window
        const anyVideo = typingContainer.querySelector('video');
        if (anyVideo) {
            anyVideo.play().catch(e => console.log("Video playback handled."));
        }
    }
    typeOut();
}


// ==========================================
// WINDOW TYPE 2: Draggable Desktop (For Greeting & Finale)
// ==========================================
function openDraggableWindow(title, contentHTML, onClose, customClass = '', useTroll = false) {
    const retroWin = document.createElement('div');
    retroWin.className = `retro-window draggable-window ${customClass}`;
    
    globalZIndex++;
    retroWin.style.zIndex = globalZIndex;

    retroWin.innerHTML = `
        <div class="title-bar draggable-title">
            <span>${title}</span>
            <button class="close-btn" disabled style="opacity: 0.5; cursor: not-allowed;">X</button>
        </div>
        <div class="window-content">
            <div class="typing-container"></div>
            ${useTroll ? '<button class="evasive-skip-btn">Skip</button>' : ''}
        </div>
    `;

    document.body.appendChild(retroWin);



    const exactX = Math.max(10, (window.innerWidth - retroWin.offsetWidth) / 2);
    const exactY = Math.max(10, (window.innerHeight - retroWin.offsetHeight) / 2);
    
    retroWin.style.left = `${exactX}px`;
    retroWin.style.top = `${exactY}px`;

    const titleBar = retroWin.querySelector('.title-bar');
    let isDragging = false;
    let initialMouseX, initialMouseY, initialWinX, initialWinY;

    const dragStart = (e) => {
        isDragging = true;
        globalZIndex++;
        retroWin.style.zIndex = globalZIndex;
        initialMouseX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        initialMouseY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        initialWinX = retroWin.offsetLeft;
        initialWinY = retroWin.offsetTop;
        
    
    };

    const dragMove = (e) => {
        if (!isDragging) return;
        e.preventDefault(); 
        const currentMouseX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const currentMouseY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        retroWin.style.left = `${initialWinX + (currentMouseX - initialMouseX)}px`;
        retroWin.style.top = `${initialWinY + (currentMouseY - initialMouseY)}px`;
    };

    const dragEnd = () => { 
        if (isDragging) {
            isDragging = false; 
        }
    };

    titleBar.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
    titleBar.addEventListener('touchstart', dragStart, {passive: false});
    document.addEventListener('touchmove', dragMove, {passive: false});
    document.addEventListener('touchend', dragEnd);

    const closeBtn = retroWin.querySelector('.close-btn');
    const typingContainer = retroWin.querySelector('.typing-container');
    const skipBtn = retroWin.querySelector('.evasive-skip-btn');

    if (useTroll && skipBtn) {
        const moveButton = (e) => {
            e.preventDefault();
            playSound(CONFIG.sfx.error, 0.6);
            if (!skipBtn.style.width) {
                skipBtn.style.width = skipBtn.offsetWidth + 'px';
                skipBtn.style.height = skipBtn.offsetHeight + 'px';
                skipBtn.style.position = 'fixed';
                document.body.appendChild(skipBtn); 
            }
            skipBtn.textContent = "😛";
            const maxX = window.innerWidth - skipBtn.offsetWidth - 20;
            const maxY = window.innerHeight - skipBtn.offsetHeight - 20;
            skipBtn.style.left = Math.max(10, Math.random() * maxX) + 'px';
            skipBtn.style.top = Math.max(10, Math.random() * maxY) + 'px';
        };

        skipBtn.addEventListener('mouseenter', moveButton);
        skipBtn.addEventListener('touchstart', moveButton, {passive: false});
        skipBtn.addEventListener('click', moveButton);
    }

    let isTyping = true;
    const tokens = contentHTML.split(/(<[^>]+>)/); 
    let currentHTML = "";

    async function typeOut() {
        let typeCounter = 0; 

        for(let i=0; i<tokens.length; i++) {
            if (!isTyping) break;
            if(tokens[i].startsWith("<")) {
                currentHTML += tokens[i];
                typingContainer.innerHTML = currentHTML + '<span class="blinking-cursor">|</span>';
            } else {
                for(let char of tokens[i]) {
                    if (!isTyping) break;
                    currentHTML += char;
                    typingContainer.innerHTML = currentHTML + '<span class="blinking-cursor">|</span>';
                    
                    typeCounter++;
                    if (typeCounter % 3 === 0) {
                        playSound(CONFIG.sfx.type, 0.2); 
                    }
                    
                    await new Promise(r => setTimeout(r, 40)); 
                }
            }
        }
        typingContainer.innerHTML = currentHTML; 
        if(useTroll && skipBtn && document.body.contains(skipBtn)) skipBtn.remove(); 
        closeBtn.style.opacity = '1';
        closeBtn.style.cursor = 'pointer';
        closeBtn.disabled = false; 
        
        closeBtn.addEventListener('click', () => {
            retroWin.remove();
            if (onClose) onClose();
        });
    }
    typeOut();
}

// ==========================================
// FINALE & MASTER RESET ENGINE
// ==========================================
function triggerWinState() {
    cancelAnimationFrame(animationFrameId); 
    
    setTimeout(() => {
        if (typeof startConfetti === "function") startConfetti();
        
        // THE FIX: We moved the button creation inside the onClose callback (the 3rd parameter)
        openDraggableWindow("Message_From_Me.exe", CONFIG.finaleContent, () => {
            
            // This code will ONLY run after she clicks the 'X' on the finale window
            const masterResetBtn = document.createElement('button');
            masterResetBtn.className = 'try-again-btn';
            masterResetBtn.textContent = 'Play Again 🔄️'; 
            masterResetBtn.style.position = 'absolute';
            masterResetBtn.style.top = '50%'; // Moved to 50% so it sits dead-center on the empty screen
            masterResetBtn.style.left = '50%';
            masterResetBtn.style.transform = 'translate(-50%, -50%)';
            masterResetBtn.style.zIndex = '9999';
            masterResetBtn.style.display = 'block';
            
            document.body.appendChild(masterResetBtn);

            masterResetBtn.addEventListener('click', () => {
                window.location.reload(); 
            });

        }, 'finale-window', false);

    }, 1000);
}

function startConfetti() {
    for(let i=0; i<100; i++) {
        const conf = document.createElement('div');
        conf.className = 'confetti';
        conf.style.left = Math.random() * 100 + 'vw';
        conf.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        conf.style.animation = `fall ${Math.random() * 3 + 2}s linear infinite`;
        document.body.appendChild(conf);
    }
}

const style = document.createElement('style');
style.innerHTML = `@keyframes fall { to { transform: translateY(100vh) rotate(720deg); } }`;
document.head.appendChild(style);


// ==========================================
// TOFFEE LOGIN ASSISTANT ENGINE
// ==========================================
function initToffeeAssistant() {
    const assistantContainer = document.createElement('div');
    assistantContainer.id = 'toffee-assistant';
    
    const thoughtBubble = document.createElement('div');
    thoughtBubble.className = 'toffee-bubble';
    
    const toffeeImg = document.createElement('img');
    toffeeImg.src = '/pics/toffee-run.png';
    toffeeImg.className = 'toffee-img';
    toffeeImg.alt = 'Toffee Assistant';

    assistantContainer.appendChild(thoughtBubble);
    assistantContainer.appendChild(toffeeImg);
    
    // Only attach to the login gate screen
    const gateScreen = document.getElementById('gate-screen');
    if (gateScreen) {
        gateScreen.appendChild(assistantContainer);
    } else {
        document.body.appendChild(assistantContainer);
    }

    const thoughts = [
        "Laptop mein aur achha dikhega...",
        "Mera naam try karo...",
        "Bnane wale ka naam bhi try kar lo...",
        "Need a hint?",
    
    ];
    
    let thoughtIndex = 0;
    thoughtBubble.textContent = thoughts[thoughtIndex];

    setInterval(() => {
        thoughtBubble.style.opacity = '0';
        setTimeout(() => {
            thoughtIndex = (thoughtIndex + 1) % thoughts.length;
            thoughtBubble.textContent = thoughts[thoughtIndex];
            thoughtBubble.style.opacity = '1';
        }, 300); 
    }, 6000); 
}
initToffeeAssistant();

// ==========================================
// ATMOSPHERIC PARTICLES (tsParticles)
// ==========================================
function initParticles() {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/tsparticles@2/tsparticles.bundle.min.js";
    
    script.onload = () => {
        const particleDiv = document.createElement('div');
        particleDiv.id = "tsparticles";
        particleDiv.style.position = "fixed";
        particleDiv.style.top = "0";
        particleDiv.style.left = "0";
        particleDiv.style.width = "100%";
        particleDiv.style.height = "100%";
        particleDiv.style.zIndex = "0"; 
        particleDiv.style.pointerEvents = "none"; 
        
        document.body.prepend(particleDiv);

        tsParticles.load("tsparticles", {
            fpsLimit: 60,
            interactivity: {
                detectsOn: "window", 
                events: {
                    onHover: { enable: true, mode: "repulse" },
                    resize: true
                },
                modes: {
                    repulse: { distance: 80, duration: 0.6 } 
                }
            },
            particles: {
                color: { value: ["#ffb6c1", "#ffd700", "#ffffff"] }, 
                move: {
                    direction: "none",
                    enable: true,
                    outModes: { default: "bounce" }, 
                    random: true,
                    speed: 0.4, 
                    straight: false
                },
                number: { 
                    density: { enable: true, area: 800 }, 
                    value: 60 
                },
                opacity: {
                    value: { min: 0.2, max: 0.6 },
                    animation: { enable: true, speed: 0.5, minimumValue: 0.2 } 
                },
                shape: { type: "circle" },
                size: {
                    value: { min: 1, max: 4 },
                    animation: { enable: true, speed: 1.5, minimumValue: 1 } 
                }
            },
            detectRetina: true
        });
    };
    
    document.head.appendChild(script);
}

initParticles();

// ==========================================
// 3D TILT ENGINE (Vanilla-Tilt)
// ==========================================
function init3DTilt() {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.1/vanilla-tilt.min.js";
    document.head.appendChild(script);

    script.onload = () => {
        const gatePanel = document.querySelector('.glass-panel');
        if (gatePanel) {
            VanillaTilt.init(gatePanel, {
                max: 10,             
                speed: 400,          
                glare: true,         
                "max-glare": 0.3,    
                scale: 1.02          
            });
        }
    };
}
init3DTilt();


// ==========================================
// MESSAGE TRANSMISSION ENGINE (WEB3FORMS)
// ==========================================
document.body.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'send-msg-btn') {
        const msgInput = document.getElementById('secret-message');
        const msg = msgInput.value.trim();
        
        if (!msg) {
            e.target.innerText = "Write something first!";
            setTimeout(() => e.target.innerText = "Leave on desk", 2000);
            return;
        }

        // UI Feedback
        e.target.innerText = "Sending...";
        e.target.disabled = true;
        msgInput.disabled = true;

        // Transmission Protocol
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                // ---> PUT YOUR ACCESS KEY HERE <---
                access_key: '9c2a511d-910c-4c0e-8c5a-139a153e8597', 
                subject: 'New Secret Message from Birthday Site!',
                message: msg
            })
        })
        .then(async (response) => {
            if (response.ok) {
                e.target.innerText = "Delivered!";
                e.target.style.background = "#000080";
                e.target.style.color = "#fdf6e3";
            } else {
                e.target.innerText = "Failed. Try again.";
                e.target.disabled = false;
                msgInput.disabled = false;
            }
        })
        .catch(error => {
            console.log("Transmission error:", error);
            e.target.innerText = "Network Error.";
        });
    }
});