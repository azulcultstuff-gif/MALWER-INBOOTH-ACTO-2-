
let ambientTrack, glitchSFX;

function initAudioSystem() {
    if (!glitchSFX) {
        glitchSFX = new Audio('assets/audio/glitch_effect.mp3');
        ambientTrack = new Audio('assets/audio/ambient_loop.mp3');
        ambientTrack.loop = true;
        ambientTrack.volume = 0.4 * 0.4;

        const volSlider = document.getElementById('master-vol-slider');
        const volDisplay = document.getElementById('vol-display');
        
        volSlider.addEventListener('input', (e) => {
            const value = e.target.value;
            if (ambientTrack) ambientTrack.volume = value * 0.4;
            volDisplay.innerText = Math.round(value * 100) + "%";
        });
    }
}

function triggerAudioGlitch() {
    if (glitchSFX) {
        glitchSFX.currentTime = 0;
        glitchSFX.volume = 0.2;
        glitchSFX.play().catch(() => {});
    }
}

window.onload = () => {
    if (typeof initThreeEngine === "function") {
        initThreeEngine();
    }
    
    const startBtn = document.getElementById('main-start-btn');
    const introScreen = document.getElementById('screen-intro');
    const startScreen = document.getElementById('screen-start');
    const canvasContainer = document.getElementById('canvas-container');
    
    introScreen.style.display = 'flex';
    introScreen.style.opacity = '1';
    startScreen.style.display = 'none';
    startScreen.style.opacity = '0';
    if (canvasContainer) canvasContainer.style.opacity = '0';

    gsap.to("#main-logo-intro", { 
        opacity: 1, 
        duration: 1.5, 
        ease: "power2.inOut",
        onComplete: () => {
            setTimeout(() => {
                gsap.to("#main-logo-intro", { 
                    opacity: 0, 
                    duration: 0.8, 
                    ease: "power2.inOut",
                    onComplete: () => {
                        introScreen.style.display = 'none';
                        startScreen.style.display = 'flex';
                        
                        gsap.to(startScreen, { opacity: 1, duration: 0.6, ease: "power2.out" });
                        if (canvasContainer) {
                            gsap.to(canvasContainer, { opacity: 1, duration: 1.2, ease: "power2.out" });
                        }

                        gsap.fromTo(startBtn, 
                            { opacity: 0, scale: 0.95 },
                            { 
                                opacity: 1, 
                                scale: 1, 
                                duration: 0.6, 
                                ease: "power2.out",
                                onComplete: () => {
                                    startBtn.style.pointerEvents = "auto";
                                }
                            }
                        );
                    }
                });
            }, 2000);
        }
    });
};

function startActo2() {
    initAudioSystem();
    if (ambientTrack) ambientTrack.play().catch(() => {});

    gsap.to('#screen-start', {
        opacity: 0,
        duration: 0.8,
        onComplete: () => {
            document.getElementById('screen-start').style.display = 'none';
            
            const bootScreen = document.getElementById('screen-device-boot');
            bootScreen.style.display = 'flex';
            bootScreen.style.opacity = '1';
            
            const statusText = document.getElementById('boot-status-text');
            const progressFill = document.getElementById('boot-progress-fill');
            
            setTimeout(() => { if(statusText) statusText.innerText = "LOADING CORRUPTION PROTOCOLS..."; }, 800);
            setTimeout(() => { if(statusText) statusText.innerText = "LINKING IN-BOOTH INTERFACE..."; }, 1800);

            gsap.to(progressFill, {
                width: '100%',
                duration: 2.8,
                ease: 'power1.inOut',
                onComplete: () => {
                    gsap.to(bootScreen, {
                        opacity: 0,
                        duration: 0.5,
                        onComplete: () => {
                            bootScreen.style.display = 'none';
                            
                            const screenMobile = document.getElementById('screen-mobile');
                            screenMobile.classList.add('active');
                            screenMobile.style.display = 'flex';
                            gsap.fromTo(screenMobile, { opacity: 0 }, { opacity: 1, duration: 0.6 });
                            runSystemClock();
                        }
                    });
                }
            });
        }
    });
}

function switchView(targetId) {
    const currentActive = document.querySelector('.mobile-view.active');
    const targetView = document.getElementById(targetId);
    
    if (currentActive) {
        gsap.to(currentActive, { 
            opacity: 0, 
            scale: 0.96, 
            duration: 0.3, 
            ease: "power2.in",
            onComplete: () => {
                currentActive.classList.remove('active');
                deployNextView();
            }
        });
    } else {
        deployNextView();
    }

    function deployNextView() {
        targetView.classList.add('active');
        gsap.fromTo(targetView, 
            { opacity: 0, scale: 1.04 }, 
            { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
        );
    }
}

async function openNarration() {
    switchView('view-narration-panel');
    const textContainer = document.getElementById('narration-text');
    const titleContainer = document.getElementById('narration-title');
    
    const bloquesTexto = [
        "Hola de nuevo, ha estado complicado contactarte...",
        "La colonia nos tiene demasiado vigilados, necesitamos hacer algo al respecto.",
        "Si te detectan como humano, serás eliminado de inmediato.",
        "Para infiltrarte en la colonia alienígena debes encriptar tu rastro biológico por completo.",
        "Es un momento irreversible. Empiezas a aceptar tu propia transformación...",
        "Interceptando dispositivo remotamente para inyectar paquete encriptador de identidad biológica."
    ];

    for (let i = 0; i < bloquesTexto.length; i++) {
        textContainer.textContent = "";
        triggerAudioGlitch();
        
        if (i === bloquesTexto.length - 1) {
            if (titleContainer) {
                titleContainer.innerText = "ALERTA DEL SISTEMA";
                titleContainer.style.color = "var(--cyber-purple)";
                titleContainer.style.textShadow = "0 0 10px rgba(189, 0, 255, 0.5)";
            }
            textContainer.style.color = "var(--cyber-purple)"; 
            textContainer.style.fontStyle = "italic";          
            textContainer.style.textShadow = "0 0 10px rgba(189, 0, 255, 0.4)"; 
        } else {
            if (titleContainer) {
                titleContainer.innerText = "AGENTE R-BTU";
                titleContainer.style.color = "var(--neon-green)";
                titleContainer.style.textShadow = "0 0 8px rgba(0, 255, 102, 0.3)";
            }
            textContainer.style.color = ""; 
            textContainer.style.fontStyle = "";
            textContainer.style.textShadow = "";
        }
        
        for (let char of bloquesTexto[i]) {
            textContainer.textContent += char;
            await new Promise(resolve => setTimeout(resolve, 45));
        }
        
        if (i < bloquesTexto.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 3200));
        }
    }
    
    const nextBtn = document.getElementById('btn-next-narration');
    nextBtn.style.display = "inline-block";
    gsap.fromTo(nextBtn, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3 });
}

function showInstallPrompt() {
    triggerAudioGlitch();
    switchView('view-install');
}

function startLoadingInstall() {
    switchView('view-loading-install');
    let currentProgress = 0;
    const progressFill = document.getElementById('install-progress-fill');
    
    const progressInterval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 5) + 3;
        if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(progressInterval);
            setTimeout(() => { 
                triggerAudioGlitch(); 
                switchView('view-home'); 
            }, 700);
        }
        progressFill.style.width = currentProgress + "%";
    }, 100);
}

function openEncryptionApp() {
    triggerAudioGlitch();
    switchView('view-app-fingerprint');
}

let fingerTimer;
function startFingerprintScan() {
    const scanLine = document.getElementById('fp-line');
    scanLine.style.display = "block";
    gsap.to(scanLine, { top: "100%", duration: 1.0, repeat: -1, yoyo: true, ease: "power1.inOut" });
    
    fingerTimer = setTimeout(() => {
        gsap.killTweensOf(scanLine);
        scanLine.style.display = "none";
        triggerAudioGlitch();
        
        const popup = document.getElementById('popup-fp-complete');
        popup.classList.remove('hidden');
        gsap.fromTo(popup, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3 });
    }, 2400); 
}

function stopFingerprintScan() {
    clearTimeout(fingerTimer);
    const scanLine = document.getElementById('fp-line');
    gsap.killTweensOf(scanLine);
    scanLine.style.display = "none";
}

async function goToFaceScan() {
    switchView('view-face-scan');
    const videoNode = document.getElementById('webcam');
    try {
        const videoStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "user", width: 320, height: 320 } 
        });
        videoNode.srcObject = videoStream;
    } catch (err) {
        console.warn("Dispositivo de video no disponible localmente. Activando capa virtual FUI.");
    }
}

function runFaceScan() {
    document.getElementById('btn-start-face-scan').style.display = "none";
    const faceBar = document.getElementById('face-scan-bar');
    faceBar.style.display = "block";
    
    gsap.to(faceBar, { 
        top: "100%", 
        duration: 1.6, 
        repeat: 2, 
        yoyo: true, 
        ease: "none",
        onComplete: () => {
            faceBar.style.display = "none";
            document.getElementById('face-recognized-icon').style.display = "block";
            triggerAudioGlitch();
            
            setTimeout(() => {
                const finalPopup = document.getElementById('popup-encrypt-final');
                finalPopup.classList.remove('hidden');
                gsap.fromTo(finalPopup, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.3 });
            }, 800);
        }
    });
}

function startFinalTransformation() {
    const videoNode = document.getElementById('webcam');
    if (videoNode.srcObject) {
        videoNode.srcObject.getTracks().forEach(track => track.stop());
    }

    switchView('view-transformation');
    let transformPercent = 0;
    const alienFill = document.getElementById('alien-fill-icon');
    const percentLabel = document.getElementById('transform-percent');

    const transInterval = setInterval(() => {
        transformPercent += 1;
        if (transformPercent >= 100) {
            transformPercent = 100;
            clearInterval(transInterval);
            
            if (alienFill) alienFill.style.filter = "drop-shadow(0 0 15px var(--cyber-purple))";
            const transBtn = document.getElementById('btn-transmutar');
            transBtn.style.display = "inline-block";
            gsap.fromTo(transBtn, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 });
            triggerAudioGlitch();
        }
        if (alienFill) alienFill.style.clipPath = `inset(${100 - transformPercent}% 0 0 0)`;
        percentLabel.innerText = transformPercent + "%";
    }, 80); 
}

function showBadgePanel() {
    switchView('view-badge-panel');
    const nameInput = document.getElementById('alien-name-input');
    const nameOutput = document.getElementById('alien-name-output');
    
    nameInput.addEventListener('input', () => {
        nameOutput.innerText = nameInput.value.trim() !== "" ? nameInput.value.toUpperCase() : "AZULITO";
    });

    const photoContainer = document.getElementById('badge-alien-photo');
    if (photoContainer) {
        const alienSVGs = [
            `<svg viewBox="0 0 100 100" style="width:75%; height:75%;"><polygon points="50,12 82,30 82,70 50,88 18,70 18,30" fill="none" stroke="currentColor" stroke-width="1.5" /><circle cx="50" cy="50" r="12" fill="none" stroke="var(--neon-green)" stroke-width="2" /></svg>`,
            `<svg viewBox="0 0 100 100" style="width:75%; height:75%;"><path d="M50,15 C30,15 20,35 20,55 C20,75 35,85 50,85 C65,85 80,75 80,55 C80,35 70,15 50,15 Z" fill="none" stroke="currentColor" stroke-width="1.5"/><ellipse cx="38" cy="50" rx="6" ry="10" fill="currentColor"/><ellipse cx="62" cy="50" rx="6" ry="10" fill="currentColor"/></svg>`,
            `<svg viewBox="0 0 100 100" style="width:75%; height:75%;"><polygon points="50,10 90,45 75,85 25,85 10,45" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="30" y1="45" x2="45" y2="55" stroke="var(--neon-green)" stroke-width="2"/><line x1="70" y1="45" x2="55" y2="55" stroke="var(--neon-green)" stroke-width="2"/></svg>`,
            `<svg viewBox="0 0 100 100" style="width:75%; height:75%;"><path d="M50,20 L80,50 L50,80 L20,50 Z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M40,50 L60,50" stroke="var(--neon-green)" stroke-width="2"/></svg>`
        ];
        const randomIndex = Math.floor(Math.random() * alienSVGs.length);
        photoContainer.innerHTML = alienSVGs[randomIndex];
    }
}

async function downloadBadge() {
    const targetBadge = document.getElementById('badge-to-download');
    
    html2canvas(targetBadge, { 
        backgroundColor: '#020304', 
        scale: 1, 
        logging: false,
        useCORS: true
    }).then(canvas => {
        const downloadLink = document.createElement('a');
        downloadLink.download = 'M_WER_COLONIA_DIPLOMA.png';
        downloadLink.href = canvas.toDataURL('image/png');
        downloadLink.click();
        
        switchView('view-social-cta');
    }).catch(err => {
        console.error("Fallo de renderizado en componente de insignia:", err);
        switchView('view-social-cta');
    });
}

function runSystemClock() {
    setInterval(() => {
        const now = new Date();
        document.getElementById('clock').innerText = 
            now.getHours().toString().padStart(2, '0') + ":" + 
            now.getMinutes().toString().padStart(2, '0');
    }, 1000);
}
