/**
 * JUNO 2D CHARACTER CONTROLLER
 * Pure 2D layered SVG illustration with smooth cursor eye-tracking,
 * natural blinking, floating animation, click reactions, & text speech bubbles.
 * NO WebGL/Three.js. NO Speech Synthesis / Voice.
 */

class JunoCharacter {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.options = {
      size: options.size || 'juno-hero-size',
      interactive: options.interactive !== false,
      speechBubble: options.speechBubble !== false,
      initialDialogue: options.initialDialogue || "Oh! You found me! ✨",
      ...options
    };

    this.state = 'idle'; // 'idle', 'curious', 'happy', 'wonder', 'celebrating'
    this.isBlinking = false;
    this.isClicking = false;
    this.targetPupilX = 0;
    this.targetPupilY = 0;
    this.currentPupilX = 0;
    this.currentPupilY = 0;
    this.maxPupilRadius = 5.5; // Max radius constraint within eye whites

    this.dialogueList = [
      "Oh! You found me!",
      "What should we wish for?",
      "Look! That star is glowing!",
      "I wonder what's inside.",
      "Let's explore this place!",
      "You found another secret!",
      "That was magical!",
      "Psst... I have a secret for you.",
      "Every wish has a little world inside it.",
      "Hehe! You made my turban sparkle!"
    ];

    this.init();
  }

  init() {
    this.renderSVG();
    this.bindElements();
    this.startBlinkingLoop();
    this.startAnimationLoop();

    if (this.options.interactive) {
      this.bindInteractions();
    }

    if (this.options.initialDialogue) {
      setTimeout(() => {
        this.say(this.options.initialDialogue, 3500);
      }, 800);
    }
  }

  renderSVG() {
    this.container.classList.add('juno-character-wrapper', this.options.size);
    this.container.setAttribute('tabindex', '0');
    this.container.setAttribute('role', 'button');
    this.container.setAttribute('aria-label', 'Juno the baby genie - click to interact');

    this.container.innerHTML = `
      <div class="juno-floating">
        <svg class="juno-character-svg" viewBox="0 0 300 360" width="100%" height="100%" data-state="idle">
          <defs>
            <!-- Tail Gradient -->
            <linearGradient id="junoTailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#64D6D0" stop-opacity="0.95" />
              <stop offset="50%" stop-color="#B8A5FF" stop-opacity="0.85" />
              <stop offset="100%" stop-color="#202653" stop-opacity="0.1" />
            </linearGradient>

            <!-- Skin Gradient -->
            <linearGradient id="junoSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#DDD6FE" />
              <stop offset="100%" stop-color="#A78BFA" />
            </linearGradient>

            <!-- Turban Teal Gradient -->
            <linearGradient id="junoTurbanTeal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#64D6D0" />
              <stop offset="100%" stop-color="#0D9488" />
            </linearGradient>

            <!-- Turban Lavender Gradient -->
            <linearGradient id="junoTurbanLavender" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#C4B5FD" />
              <stop offset="100%" stop-color="#7C3AED" />
            </linearGradient>

            <!-- Gold Metal Gradient -->
            <linearGradient id="junoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FFF5E8" />
              <stop offset="40%" stop-color="#FFD778" />
              <stop offset="100%" stop-color="#D97706" />
            </linearGradient>

            <!-- Eye Iris Gradient -->
            <radialGradient id="junoIrisGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#38BDF8" />
              <stop offset="45%" stop-color="#4338CA" />
              <stop offset="100%" stop-color="#1E1B4B" />
            </radialGradient>

            <!-- Eye Clipping Masks -->
            <clipPath id="leftEyeClip">
              <ellipse cx="126" cy="154" rx="14" ry="16" />
            </clipPath>
            <clipPath id="rightEyeClip">
              <ellipse cx="174" cy="154" rx="14" ry="16" />
            </clipPath>
          </defs>

          <!-- 1. LAYER 1: REAR MAGICAL SMOKE & TAIL -->
          <g id="juno-tail-layer" class="juno-tail-layer">
            <!-- Secondary gentle mist trail -->
            <path d="M 150 250 Q 120 280 145 315 Q 165 345 130 355 Q 95 365 110 330 Q 130 295 138 250 Z" 
                  fill="url(#junoTailGrad)" opacity="0.6" filter="blur(3px)" />
            <!-- Main graceful genie swirl tail -->
            <path d="M 150 235 Q 115 270 148 310 Q 170 338 140 350 Q 110 358 125 325 Q 142 285 146 235 Z" 
                  fill="url(#junoTailGrad)" />
          </g>

          <!-- 2. LAYER 2: MAIN BODY -->
          <g id="juno-body-layer">
            <!-- Genie Baby Torso -->
            <path d="M 134 200 Q 124 235 150 242 Q 176 235 166 200 Z" fill="url(#junoSkinGrad)" />
            <!-- Ornate Little Genie Vest -->
            <path d="M 134 202 Q 142 225 150 220 Q 158 225 166 202 Z" fill="#202653" opacity="0.8" />
            <!-- Gold Trim Belt -->
            <path d="M 132 232 Q 150 239 168 232 Q 150 245 132 232 Z" fill="url(#junoGoldGrad)" />
            <circle cx="150" cy="236" r="3" fill="#64D6D0" />
          </g>

          <!-- 3. LAYER 3: ARMS & HANDS -->
          <g id="juno-arms-layer">
            <!-- Left Arm & Gold Bangle -->
            <path d="M 134 205 Q 112 216 118 230 Q 125 235 130 224 Z" fill="url(#junoSkinGrad)" />
            <ellipse cx="120" cy="226" rx="4" ry="2" fill="url(#junoGoldGrad)" transform="rotate(-25 120 226)" />
            
            <!-- Right Arm (Gentle Wave) & Gold Bangle -->
            <path d="M 166 205 Q 188 214 182 228 Q 175 234 170 222 Z" fill="url(#junoSkinGrad)" />
            <ellipse cx="180" cy="224" rx="4" ry="2" fill="url(#junoGoldGrad)" transform="rotate(25 180 224)" />
          </g>

          <!-- 4. LAYER 4: HEAD, FACE & TURBAN -->
          <g id="juno-head-layer" class="juno-head-layer">
            <!-- Cute Rounded Baby Genie Face -->
            <path d="M 116 142 C 114 185 132 204 150 204 C 168 204 186 185 184 142 C 184 115 116 115 116 142 Z" 
                  fill="url(#junoSkinGrad)" />

            <!-- Rosy Cheek Blush -->
            <ellipse class="juno-cheek-blush" cx="122" cy="168" rx="8" ry="4" fill="#F4C8E4" opacity="0.65" />
            <ellipse class="juno-cheek-blush" cx="178" cy="168" rx="8" ry="4" fill="#F4C8E4" opacity="0.65" />

            <!-- Little Nose -->
            <circle cx="150" cy="165" r="1.5" fill="#8B5CF6" opacity="0.6" />

            <!-- Expressive Mouth -->
            <path id="juno-mouth-smile" class="juno-mouth-smile" d="M 142 176 Q 150 184 158 176" 
                  stroke="#4C1D95" stroke-width="2.2" stroke-linecap="round" fill="none" />

            <!-- 5. EYES & CURSOR TRACKING PUPILS -->
            <!-- Left Eye -->
            <g id="juno-left-eye">
              <!-- Eye White -->
              <ellipse cx="126" cy="154" rx="14" ry="16" fill="#FFFDF8" stroke="#1E1B4B" stroke-width="1.2" />
              <!-- Clipped Pupil & Iris Group -->
              <g clip-path="url(#leftEyeClip)">
                <g id="juno-pupil-left" class="juno-pupil-group">
                  <!-- Iris -->
                  <circle cx="126" cy="154" r="10.5" fill="url(#junoIrisGrad)" />
                  <!-- Pupil Center -->
                  <circle cx="126" cy="154" r="5.5" fill="#0F172A" />
                  <!-- Star Sparkle Highlight -->
                  <path d="M 124 150 L 126 147 L 128 150 L 131 152 L 128 154 L 126 157 L 124 154 L 121 152 Z" fill="#FFFFFF" />
                  <!-- Secondary Micro Highlight -->
                  <circle cx="129" cy="158" r="1.8" fill="#FFFFFF" opacity="0.85" />
                </g>
                <!-- Eyelid Layers for Blinking -->
                <rect class="juno-eyelid juno-eyelid-top" x="110" y="130" width="32" height="18" fill="#DDD6FE" />
                <rect class="juno-eyelid juno-eyelid-bottom" x="110" y="162" width="32" height="12" fill="#DDD6FE" />
              </g>
              <!-- Cute Eyelash Accent -->
              <path d="M 114 148 Q 126 138 138 147" stroke="#2E1065" stroke-width="2.5" stroke-linecap="round" fill="none" />
            </g>

            <!-- Right Eye -->
            <g id="juno-right-eye">
              <!-- Eye White -->
              <ellipse cx="174" cy="154" rx="14" ry="16" fill="#FFFDF8" stroke="#1E1B4B" stroke-width="1.2" />
              <!-- Clipped Pupil & Iris Group -->
              <g clip-path="url(#rightEyeClip)">
                <g id="juno-pupil-right" class="juno-pupil-group">
                  <!-- Iris -->
                  <circle cx="174" cy="154" r="10.5" fill="url(#junoIrisGrad)" />
                  <!-- Pupil Center -->
                  <circle cx="174" cy="154" r="5.5" fill="#0F172A" />
                  <!-- Star Sparkle Highlight -->
                  <path d="M 172 150 L 174 147 L 176 150 L 179 152 L 176 154 L 174 157 L 172 154 L 169 152 Z" fill="#FFFFFF" />
                  <!-- Secondary Micro Highlight -->
                  <circle cx="177" cy="158" r="1.8" fill="#FFFFFF" opacity="0.85" />
                </g>
                <!-- Eyelid Layers for Blinking -->
                <rect class="juno-eyelid juno-eyelid-top" x="158" y="130" width="32" height="18" fill="#DDD6FE" />
                <rect class="juno-eyelid juno-eyelid-bottom" x="158" y="162" width="32" height="12" fill="#DDD6FE" />
              </g>
              <!-- Cute Eyelash Accent -->
              <path d="M 162 147 Q 174 138 186 148" stroke="#2E1065" stroke-width="2.5" stroke-linecap="round" fill="none" />
            </g>

            <!-- 6. TURBAN & MAGICAL ACCESSORIES -->
            <g id="juno-turban-layer">
              <!-- Rear Turban Dome -->
              <path d="M 104 130 C 100 80 135 60 150 60 C 165 60 200 80 196 130 Z" fill="url(#junoTurbanTeal)" />
              <!-- Front Layered Fabric Swags -->
              <path d="M 102 128 Q 150 145 198 128 Q 185 95 150 96 Q 115 95 102 128 Z" fill="url(#junoTurbanLavender)" opacity="0.95" />
              <path d="M 106 122 Q 150 138 194 122 Q 182 105 150 106 Q 118 105 106 122 Z" fill="url(#junoTurbanTeal)" />
              
              <!-- Delicate Gold Band with Inscriptions -->
              <path d="M 108 128 Q 150 142 192 128 Q 150 136 108 128 Z" fill="url(#junoGoldGrad)" />

              <!-- Glowing Teal Gemstone & Gold Mount -->
              <g class="juno-gem-glow">
                <circle cx="150" cy="120" r="9" fill="url(#junoGoldGrad)" />
                <polygon points="150,113 156,120 150,127 144,120" fill="#22D3EE" />
                <polygon points="150,115 154,120 150,125 146,120" fill="#A7E8F5" />
              </g>

              <!-- Cute Gold Star Earring on Left Ear -->
              <circle cx="112" cy="160" r="3.5" fill="none" stroke="url(#junoGoldGrad)" stroke-width="1.5" />
              <path d="M 112 165 L 113 168 L 116 169 L 113 170 L 112 173 L 111 170 L 108 169 L 111 168 Z" fill="#FFD778" />
            </g>
          </g>

          <!-- 7. FOREGROUND SPARKS -->
          <g id="juno-sparkles" opacity="0.8">
            <circle cx="100" cy="180" r="1.5" fill="#FFD778" />
            <circle cx="195" cy="170" r="2" fill="#64D6D0" />
            <circle cx="130" cy="90" r="1.5" fill="#FFF5E8" />
            <circle cx="170" cy="95" r="2" fill="#FFD778" />
          </g>
        </svg>

        <!-- Speech Bubble (Text Only, No Voice) -->
        <div id="${this.container.id}-bubble" class="juno-speech-bubble" role="status" aria-live="polite"></div>
      </div>
    `;
  }

  bindElements() {
    this.svg = this.container.querySelector('.juno-character-svg');
    this.pupilLeft = this.container.querySelector('#juno-pupil-left');
    this.pupilRight = this.container.querySelector('#juno-pupil-right');
    this.bubble = this.container.querySelector('.juno-speech-bubble');
    this.mouth = this.container.querySelector('#juno-mouth-smile');
    this.floatingWrapper = this.container.querySelector('.juno-floating');
  }

  bindInteractions() {
    // Only track cursor on non-touch devices
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    if (!isTouchDevice) {
      window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
      document.addEventListener('mouseleave', () => this.resetPupils());
    }

    // Click & Tap Reactions
    this.container.addEventListener('click', (e) => this.handleClick(e));
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.handleClick();
      }
    });
  }

  handleMouseMove(e) {
    if (this.isBlinking) return;

    // Get position of Juno relative to viewport
    const rect = this.container.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width * 0.5;
    const eyeCenterY = rect.top + rect.height * 0.42;

    const deltaX = e.clientX - eyeCenterX;
    const deltaY = e.clientY - eyeCenterY;

    const angle = Math.atan2(deltaY, deltaX);
    const distance = Math.min(Math.hypot(deltaX, deltaY) * 0.045, this.maxPupilRadius);

    this.targetPupilX = Math.cos(angle) * distance;
    this.targetPupilY = Math.sin(angle) * distance;
  }

  resetPupils() {
    this.targetPupilX = 0;
    this.targetPupilY = 0;
  }

  startAnimationLoop() {
    const update = () => {
      // Smooth lerp pupil tracking
      this.currentPupilX += (this.targetPupilX - this.currentPupilX) * 0.14;
      this.currentPupilY += (this.targetPupilY - this.currentPupilY) * 0.14;

      if (this.pupilLeft && this.pupilRight) {
        const transformStr = `translate(${this.currentPupilX.toFixed(2)}px, ${this.currentPupilY.toFixed(2)}px)`;
        this.pupilLeft.style.transform = transformStr;
        this.pupilRight.style.transform = transformStr;
      }

      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }

  startBlinkingLoop() {
    const scheduleNextBlink = () => {
      const delay = Math.random() * 3200 + 2200; // 2.2 to 5.4 seconds
      setTimeout(() => {
        this.triggerBlink(() => {
          // 25% chance of double blink
          if (Math.random() < 0.25) {
            setTimeout(() => this.triggerBlink(scheduleNextBlink), 130);
          } else {
            scheduleNextBlink();
          }
        });
      }, delay);
    };

    scheduleNextBlink();
  }

  triggerBlink(callback) {
    this.isBlinking = true;
    this.svg.classList.add('blinking');

    setTimeout(() => {
      this.svg.classList.remove('blinking');
      this.isBlinking = false;
      if (callback) callback();
    }, 120);
  }

  handleClick(e) {
    if (this.isClicking) return;
    this.isClicking = true;

    // Bounce animation
    this.floatingWrapper.classList.remove('juno-bounce');
    void this.floatingWrapper.offsetWidth; // Force reflow
    this.floatingWrapper.classList.add('juno-bounce');

    // Spawn sparkles at click point
    if (e && e.clientX) {
      this.spawnSparkles(e.clientX, e.clientY);
    } else {
      const rect = this.container.getBoundingClientRect();
      this.spawnSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }

    // Set happy / wonder expression temporarily
    this.setExpression('happy');

    // Random dialogue
    const randomMsg = this.dialogueList[Math.floor(Math.random() * this.dialogueList.length)];
    this.say(randomMsg, 3500);

    setTimeout(() => {
      this.setExpression('idle');
      this.isClicking = false;
    }, 1800);
  }

  spawnSparkles(x, y) {
    const containerRect = this.container.getBoundingClientRect();
    const relX = x - containerRect.left;
    const relY = y - containerRect.top;

    for (let i = 0; i < 7; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'juno-click-sparkle';
      sparkle.style.left = `${relX}px`;
      sparkle.style.top = `${relY}px`;

      const angle = (Math.PI * 2 * i) / 7;
      const dist = Math.random() * 35 + 20;
      sparkle.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
      sparkle.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);

      this.container.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 750);
    }
  }

  say(text, duration = 3000) {
    if (!this.bubble) return;

    this.bubble.textContent = text;
    this.bubble.classList.add('visible');

    if (this.bubbleTimeout) clearTimeout(this.bubbleTimeout);

    this.bubbleTimeout = setTimeout(() => {
      this.bubble.classList.remove('visible');
    }, duration);
  }

  setExpression(state) {
    this.state = state;
    this.svg.setAttribute('data-state', state);

    if (state === 'happy') {
      this.mouth.setAttribute('d', 'M 138 176 Q 150 188 162 176');
    } else if (state === 'wonder' || state === 'surprised') {
      this.mouth.setAttribute('d', 'M 144 176 A 6 7 0 1 0 156 176 A 6 7 0 1 0 144 176');
    } else if (state === 'curious') {
      this.mouth.setAttribute('d', 'M 140 178 Q 152 178 160 174');
    } else {
      // idle
      this.mouth.setAttribute('d', 'M 142 176 Q 150 184 158 176');
    }
  }
}

// Global registry for characters
window.JunoCharacter = JunoCharacter;
