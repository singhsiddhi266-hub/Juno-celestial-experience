/**
 * DREAM DESTINATIONS & DREAM DELIVERY MAP (Sections F & G)
 * Interactive showcase for the 4 living magical worlds with full 2D scenery,
 * animated objects, glowing particles, living Juno presence, & interactive games.
 * NO alerts, pop-ups, or plain text messages.
 */

class JunoDestinations {
  constructor() {
    this.theater = document.getElementById('magical-world-theater');
    this.currentWorld = null;
    this.currentOptions = {};
    this.worldJuno = null;
    this.connectedStars = [];
    this.timers = [];
    this.storyFragments = [
      "Somewhere, a forgotten star is waiting to be found.",
      "Wishes whispered to the wind always find their way to the library.",
      "In the quietest chapter of the night, hope dreams in golden ink.",
      "Every dream ever dreamed is resting here on a velvet shelf.",
      "Turn the page gently; a sleeping wish is resting inside.",
      "The stars write our hopes in luminous dust across the dark."
    ];

    this.init();
  }

  init() {
    this.bindDestinationCardTriggers();
    this.bindTheaterControls();
    this.bindMapInteractions();
  }

  /* ------------------------------------------------------------------------
     BINDINGS FOR DESTINATION CARDS & BUTTONS
     ------------------------------------------------------------------------ */
  bindDestinationCardTriggers() {
    const worlds = ['kingdom', 'garden', 'library', 'observatory'];

    worlds.forEach(world => {
      // 1. Action buttons in Section F
      const btn = document.getElementById(`${world}-action-btn`);
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openWorld(world, { source: 'sectionF' });
        });
      }

      // 2. Full destination cards in Section F
      const card = document.getElementById(`dest-card-${world}`);
      if (card) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
          this.openWorld(world, { source: 'sectionF' });
        });
      }
    });

    // 3. Preview cards in Chapter 5
    const ch5Cards = document.querySelectorAll('.dest-preview-card');
    ch5Cards.forEach(card => {
      card.addEventListener('click', () => {
        const targetWorld = card.getAttribute('data-dest');
        if (targetWorld) {
          this.openWorld(targetWorld, { source: 'chapter5' });
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     THEATER CONTROLS (Back to Worlds, Replay, Escape key)
     ------------------------------------------------------------------------ */
  bindTheaterControls() {
    const backBtn = document.getElementById('world-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => this.closeWorld());
    }

    const replayBtn = document.getElementById('world-replay-btn');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        if (this.currentWorld) {
          this.setupWorld(this.currentWorld);
        }
      });
    }

    // Keyboard support: Escape key closes the magical world
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.theater && this.theater.classList.contains('open')) {
        this.closeWorld();
      }
    });
  }

  /* ------------------------------------------------------------------------
     OPENING & CLOSING THE WORLD THEATER
     ------------------------------------------------------------------------ */
  openWorld(worldId, options = {}) {
    if (!this.theater) return;

    this.currentWorld = worldId;
    this.currentOptions = options;
    this.clearAllTimers();

    // Configure Header & Caption based on world
    const worldMeta = {
      kingdom: {
        icon: '🏰',
        name: 'Wishfall Kingdom',
        caption: '“A path appears whenever a brave little wish takes flight.”',
        welcome: "Welcome to Wishfall Kingdom! Watch the crystal bridge assemble! 🏰"
      },
      garden: {
        icon: '🪷',
        name: 'Moonlit Garden',
        caption: '“Even the smallest light can make a whole garden bloom.”',
        welcome: "Welcome to the Moonlit Garden! Touch the sacred lotus to bloom! 🪷"
      },
      library: {
        icon: '📖',
        name: 'Dream Library',
        caption: '“Every story was once a wish waiting to be told.”',
        welcome: "Welcome to the Dream Library! Shh... the books are sharing secrets! 📖"
      },
      observatory: {
        icon: '🔭',
        name: 'Stardust Observatory',
        caption: '“Every star remembers a wish.”',
        welcome: "Look at the stars! Aim the telescope to find my constellation! 🔭"
      }
    };

    const meta = worldMeta[worldId] || worldMeta.kingdom;

    const iconEl = document.getElementById('world-icon');
    const nameEl = document.getElementById('world-name');
    const captionEl = document.getElementById('world-story-caption');

    if (iconEl) iconEl.textContent = meta.icon;
    if (nameEl) nameEl.textContent = meta.name;
    if (captionEl) captionEl.textContent = meta.caption;

    // Toggle active scene view
    document.querySelectorAll('.world-scene').forEach(scene => {
      scene.classList.remove('active');
    });

    const activeScene = document.getElementById(`world-scene-${worldId}`);
    if (activeScene) {
      activeScene.classList.add('active');
    }

    // Open theater container
    this.theater.classList.add('open');
    this.theater.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Initialize or refresh Juno character companion
    this.initWorldJuno(meta.welcome);

    // Play opening chime
    if (window.junoAudio && !window.junoAudio.isMuted) {
      window.junoAudio.playChime(659.25);
    }

    // Setup interactive mechanics of the selected world
    this.setupWorld(worldId);

    // If opened from Chapter 5, guarantee progression button unlocks
    if (options.source === 'chapter5') {
      const ch5NextBtn = document.getElementById('ch5-next-btn');
      if (ch5NextBtn) {
        ch5NextBtn.style.display = 'inline-flex';
      }
    }
  }

  closeWorld() {
    if (!this.theater) return;

    this.theater.classList.remove('open');
    this.theater.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    this.clearAllTimers();

    // If source was Chapter 5, scroll smoothly to Chapter 5 and ensure next button is displayed
    if (this.currentOptions && this.currentOptions.source === 'chapter5') {
      const ch5 = document.getElementById('story-chapter-5');
      const nextBtn = document.getElementById('ch5-next-btn');
      if (nextBtn) {
        nextBtn.style.display = 'inline-flex';
        nextBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else if (ch5) {
        ch5.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else if (this.currentWorld) {
      // Scroll to the destination card in Section F
      const card = document.getElementById(`dest-card-${this.currentWorld}`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  /* ------------------------------------------------------------------------
     LIVING JUNO COMPANION INSIDE THE WORLD
     ------------------------------------------------------------------------ */
  initWorldJuno(welcomeMessage) {
    const junoContainer = document.getElementById('world-juno-character');
    const bubbleEl = document.getElementById('world-juno-hint');

    if (!junoContainer) return;

    if (!this.worldJuno) {
      this.worldJuno = new JunoCharacter('world-juno-character', {
        size: 'juno-medium-size',
        interactive: true,
        speechBubble: false, // We use a custom formatted speech bubble
        initialDialogue: ""
      });

      // Clicking Juno directly triggers response
      junoContainer.addEventListener('click', () => {
        if (this.worldJuno) {
          this.worldJuno.setExpression('happy');
          const responses = [
            "Isn't this world beautiful? ✨",
            "I love visiting here with you!",
            "Look at all the magic around us!",
            "Every wish hides a secret realm!"
          ];
          const choice = responses[Math.floor(Math.random() * responses.length)];
          this.setJunoSpeech(choice, 3500);
          if (window.junoAudio) window.junoAudio.playChime(880);
        }
      });
    }

    if (this.worldJuno) {
      this.worldJuno.setExpression('curious');
      this.setJunoSpeech(welcomeMessage, 4500);
    }
  }

  setJunoSpeech(text, duration = 4000) {
    const bubbleEl = document.getElementById('world-juno-hint');
    if (!bubbleEl) return;

    bubbleEl.textContent = text;
    bubbleEl.style.opacity = '1';
    bubbleEl.style.transform = 'translateY(0)';

    if (this.bubbleTimeout) clearTimeout(this.bubbleTimeout);
    this.bubbleTimeout = setTimeout(() => {
      bubbleEl.style.opacity = '0.9';
    }, duration);
  }

  /* ------------------------------------------------------------------------
     ROUTING WORLD SETUP
     ------------------------------------------------------------------------ */
  setupWorld(worldId) {
    switch (worldId) {
      case 'kingdom':
        this.setupKingdomWorld();
        break;
      case 'garden':
        this.setupGardenWorld();
        break;
      case 'library':
        this.setupLibraryWorld();
        break;
      case 'observatory':
        this.setupObservatoryWorld();
        break;
    }
  }

  clearAllTimers() {
    this.timers.forEach(t => clearTimeout(t));
    this.timers = [];
  }

  /* ------------------------------------------------------------------------
     WORLD 1: WISHFALL KINGDOM
     Crystal bridge assembling piece by piece, sparkling on completion,
     and clickable for ripple waves and golden particle showers.
     ------------------------------------------------------------------------ */
  setupKingdomWorld() {
    const segments = document.querySelectorAll('.wf-crystal-segment');
    const beam = document.getElementById('wf-bridge-beam');
    const prompt = document.getElementById('wf-bridge-prompt');
    const bridgeContainer = document.getElementById('wf-bridge-container');
    const rippleContainer = document.getElementById('wf-ripple-container');

    // 1. Reset state
    if (rippleContainer) rippleContainer.innerHTML = '';
    if (beam) beam.classList.remove('active');
    if (prompt) prompt.style.display = 'none';

    segments.forEach(seg => {
      seg.classList.remove('assembled', 'sparkling');
    });

    // 2. Animate bridge assembly piece-by-piece
    const totalSegments = segments.length;
    segments.forEach((seg, index) => {
      const timer = setTimeout(() => {
        seg.classList.add('assembled');

        // Play incremental crystal bell chime
        if (window.junoAudio) {
          window.junoAudio.playChime(523.25 + index * 95);
        }

        // When final segment locks in
        if (index === totalSegments - 1) {
          const finishTimer = setTimeout(() => {
            segments.forEach(s => s.classList.add('sparkling'));
            if (beam) beam.classList.add('active');
            if (prompt) prompt.style.display = 'block';

            if (this.worldJuno) {
              this.worldJuno.setExpression('happy');
              this.setJunoSpeech("Look! The crystal bridge connected across the clouds! 🏰✨", 4500);
            }

            // Reward sound
            if (window.junoAudio) {
              window.junoAudio.playChime(1046.50);
            }
          }, 400);
          this.timers.push(finishTimer);
        }
      }, 350 + index * 260);

      this.timers.push(timer);
    });

    // 3. User interaction on the bridge: Click triggers magical ripple and particle shower
    if (bridgeContainer) {
      // Remove any prior listeners by cloning or direct reassignment
      bridgeContainer.onclick = (e) => {
        this.triggerBridgeMagic(e);
      };
    }
  }

  triggerBridgeMagic(e) {
    const rippleContainer = document.getElementById('wf-ripple-container');
    if (!rippleContainer) return;

    // Play radiant chord
    if (window.junoAudio) {
      window.junoAudio.playChime(659.25);
      setTimeout(() => window.junoAudio.playChime(880), 80);
      setTimeout(() => window.junoAudio.playChime(1046.5), 160);
    }

    // Ripple wave
    const ring = document.createElement('div');
    ring.className = 'bridge-ripple-ring';
    ring.style.left = '50%';
    ring.style.top = '50%';
    ring.style.width = '120px';
    ring.style.height = '60px';
    rippleContainer.appendChild(ring);
    setTimeout(() => ring.remove(), 1400);

    // Golden Sparkle Fountain (24 particles)
    for (let i = 0; i < 24; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'bridge-gold-sparkle';
      sparkle.style.left = '50%';
      sparkle.style.top = '50%';

      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 110 + 30;
      sparkle.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      sparkle.style.setProperty('--dy', `${Math.sin(angle) * dist - 30}px`);

      rippleContainer.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 1200);
    }

    // Juno reacts happily
    if (this.worldJuno) {
      this.worldJuno.setExpression('happy');
      this.setJunoSpeech("✨ The bridge is sparkling with starlight!", 3000);
    }
  }

  /* ------------------------------------------------------------------------
     WORLD 2: MOONLIT GARDEN
     Closed lotus opening petal by petal upon user click, releasing glowing
     blue fireflies that drift naturally and react with spark trails on click.
     ------------------------------------------------------------------------ */
  setupGardenWorld() {
    const lotus = document.getElementById('mg-lotus-interactive');
    const lotusHint = document.getElementById('mg-lotus-hint');
    const firefliesLayer = document.getElementById('mg-fireflies-layer');

    // 1. Reset state
    if (lotus) lotus.classList.remove('bloomed');
    if (lotusHint) {
      lotusHint.innerHTML = '<span class="hint-sparkle">🌸</span> Touch the lotus to bloom';
      lotusHint.style.display = 'block';
    }
    if (firefliesLayer) firefliesLayer.innerHTML = '';

    // Spawn 4 initial subtle ambient fireflies
    this.spawnFireflies(4, false);

    // 2. Click interaction on lotus
    if (lotus) {
      lotus.onclick = () => {
        if (!lotus.classList.contains('bloomed')) {
          lotus.classList.add('bloomed');

          if (lotusHint) {
            lotusHint.innerHTML = '✨ The moon lotus is in full bloom!';
          }

          // Ascending lotus bloom melody
          if (window.junoAudio) {
            window.junoAudio.playChime(587.33);
            setTimeout(() => window.junoAudio.playChime(783.99), 200);
            setTimeout(() => window.junoAudio.playChime(880.00), 400);
            setTimeout(() => window.junoAudio.playChime(1174.66), 600);
          }

          // Release 7 more glowing blue fireflies bursting out of the flower
          this.spawnFireflies(7, true);

          // Juno celebration
          if (this.worldJuno) {
            this.worldJuno.setExpression('happy');
            this.setJunoSpeech("Look at the fireflies! The moon lotus heard your wish! 🌸✨", 4500);
          }
        }
      };
    }
  }

  spawnFireflies(count, fromCenter = false) {
    const layer = document.getElementById('mg-fireflies-layer');
    if (!layer) return;

    for (let i = 0; i < count; i++) {
      const fly = document.createElement('div');
      fly.className = 'mg-firefly';

      const startX = fromCenter ? 50 + (Math.random() - 0.5) * 15 : Math.random() * 80 + 10;
      const startY = fromCenter ? 65 + (Math.random() - 0.5) * 10 : Math.random() * 65 + 15;

      fly.style.left = `${startX}%`;
      fly.style.top = `${startY}%`;

      const core = document.createElement('div');
      core.className = 'mg-firefly-core';
      fly.appendChild(core);

      // Natural organic floating animation loop
      this.animateFireflyFlight(fly, startX, startY);

      // Clicking firefly makes it glow brighter, sound chime, and leave sparkling trail
      fly.addEventListener('click', (e) => {
        e.stopPropagation();
        this.triggerFireflyGlow(fly);
      });

      layer.appendChild(fly);
    }
  }

  animateFireflyFlight(fly, baseX, baseY) {
    let t = Math.random() * 100;
    const speed = Math.random() * 0.015 + 0.008;
    const xAmp = Math.random() * 12 + 6;
    const yAmp = Math.random() * 10 + 4;

    const drift = () => {
      if (!fly.parentElement) return; // Cleanup if scene closed
      t += speed;
      const currX = baseX + Math.sin(t) * xAmp + Math.sin(t * 0.5) * 4;
      const currY = baseY + Math.cos(t * 1.3) * yAmp;

      fly.style.left = `${currX}%`;
      fly.style.top = `${currY}%`;

      requestAnimationFrame(drift);
    };

    requestAnimationFrame(drift);
  }

  triggerFireflyGlow(fly) {
    fly.classList.add('active-glow');

    // Chime note
    if (window.junoAudio) {
      window.junoAudio.playChime(1046.50 + Math.random() * 200);
    }

    // Spawn 6 sparkling trail dots
    const rect = fly.getBoundingClientRect();
    const parentRect = fly.parentElement.getBoundingClientRect();
    const flyLeft = rect.left - parentRect.left + 10;
    const flyTop = rect.top - parentRect.top + 10;

    for (let i = 0; i < 6; i++) {
      const dot = document.createElement('div');
      dot.className = 'firefly-sparkle-dot';
      dot.style.left = `${flyLeft + (Math.random() - 0.5) * 24}px`;
      dot.style.top = `${flyTop + (Math.random() - 0.5) * 24}px`;
      fly.parentElement.appendChild(dot);
      setTimeout(() => dot.remove(), 900);
    }

    // Reset glow after pulse
    setTimeout(() => fly.classList.remove('active-glow'), 800);

    if (this.worldJuno) {
      this.worldJuno.setExpression('happy');
      this.setJunoSpeech("Hehe! That little blue firefly loves you! ✨", 3000);
    }
  }

  /* ------------------------------------------------------------------------
     WORLD 3: DREAM LIBRARY
     Ancient wish tome opening on pedestal with rising glowing runes,
     random story quotes, and interactive floating books in the hall.
     ------------------------------------------------------------------------ */
  setupLibraryWorld() {
    const book = document.getElementById('dl-pedestal-book');
    const titleEl = document.getElementById('dl-fragment-title');
    const quoteEl = document.getElementById('dl-fragment-quote');
    const runesContainer = document.getElementById('dl-rising-runes-container');

    // 1. Reset state
    if (book) book.classList.remove('book-opened');
    if (runesContainer) runesContainer.innerHTML = '';
    if (titleEl) titleEl.textContent = "An Ancient Page Unfolds:";
    if (quoteEl) {
      quoteEl.textContent = "“Somewhere, a forgotten star is waiting to be found.”";
    }

    // 2. Click pedestal book to open
    if (book) {
      book.onclick = () => {
        book.classList.toggle('book-opened');

        if (book.classList.contains('book-opened')) {
          this.triggerBookOpeningEffects();
        }
      };
      book.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          book.click();
        }
      };
    }

    // 3. Book story registry for each floating book
    const bookStories = {
      '1': {
        title: "Atlas of Stars: The Celestial Constellations",
        quote: "Somewhere, a forgotten star is waiting to be found in the celestial atlas.",
        note: 783.99,
        speech: "The Atlas of Stars! It charts every wish that ever took flight across the night sky! ⭐📜"
      },
      '2': {
        title: "Whispers of the Moon",
        quote: "Wishes whispered to the wind always find their way to the moonlight library.",
        note: 880.00,
        speech: "Moon Whispers! The moon listens to sleepy dreams and keeps them safe until dawn! 🌙✨"
      },
      '3': {
        title: "The Book of Tomorrow",
        quote: "In the quietest chapter of the night, tomorrow dreams in luminous golden ink.",
        note: 987.77,
        speech: "The Book of Tomorrow! It says whatever you hope for is already beginning! 🌸📖"
      },
      '4': {
        title: "Tale of a Fallen Star",
        quote: "A brave little star fell gently from the sky, wishing only to light someone's path.",
        note: 1046.50,
        speech: "The Fallen Star! That's just like me! A star that fell to make dreams come true! 🗝️⭐"
      }
    };

    // Shared handler for clicking any floating book
    const openFloatingBook = (fbook) => {
      const bookId = fbook.getAttribute('data-book-id') || '1';
      const story = bookStories[bookId] || {
        title: "An Ancient Page Unfolds:",
        quote: this.storyFragments[0],
        note: 880,
        speech: "Ooh! Another page shared its secret wish! 📜✨"
      };

      if (titleEl) titleEl.textContent = story.title;
      if (quoteEl) quoteEl.textContent = `“${story.quote}”`;

      // Visual pulse feedback on clicked book
      fbook.style.transform = 'translateY(-12px) scale(1.18)';
      fbook.style.borderColor = 'var(--magical-gold)';
      fbook.style.boxShadow = '0 0 35px var(--magical-gold)';
      setTimeout(() => {
        fbook.style.transform = '';
        fbook.style.borderColor = '';
        fbook.style.boxShadow = '';
      }, 500);

      // Spawn mini runes from this floating book
      this.spawnRisingRunes(4);

      if (window.junoAudio) {
        window.junoAudio.playChime(story.note);
      }

      if (this.worldJuno) {
        this.worldJuno.setExpression('curious');
        this.setJunoSpeech(story.speech, 4000);
      }
    };

    // Attach directly to floating books
    const floatingBooks = document.querySelectorAll('.dl-floating-book');
    floatingBooks.forEach((fbook) => {
      fbook.onclick = (e) => {
        e.stopPropagation();
        openFloatingBook(fbook);
      };
      fbook.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openFloatingBook(fbook);
        }
      };
    });

    // Event delegation on floating books container and library scene
    const booksSpace = document.querySelector('.dl-floating-books-space');
    if (booksSpace) {
      booksSpace.onclick = (e) => {
        const fbook = e.target.closest('.dl-floating-book');
        if (fbook) {
          openFloatingBook(fbook);
        }
      };
    }
  }

  triggerBookOpeningEffects() {
    // Play warm enchanted harp chime
    if (window.junoAudio) {
      window.junoAudio.playChime(659.25);
      setTimeout(() => window.junoAudio.playChime(783.99), 120);
      setTimeout(() => window.junoAudio.playChime(1046.50), 240);
    }

    // Spawn rising letter glyphs & stars
    this.spawnRisingRunes(8);

    // Pick a random story fragment
    const quoteEl = document.getElementById('dl-fragment-quote');
    const titleEl = document.getElementById('dl-fragment-title');
    const randomQuote = this.storyFragments[Math.floor(Math.random() * this.storyFragments.length)];
    if (titleEl) titleEl.textContent = "The Ancient Wish Tome Opens:";
    if (quoteEl) {
      quoteEl.textContent = `“${randomQuote}”`;
    }

    // Juno reacts
    if (this.worldJuno) {
      this.worldJuno.setExpression('happy');
      this.setJunoSpeech("I love reading these dream books! Every wish has a story! 📖✨", 4500);
    }
  }

  spawnRisingRunes(count) {
    const container = document.getElementById('dl-rising-runes-container');
    if (!container) return;

    const glyphs = ['✦', '✨', '⭐', 'A', 'W', '🌙', 'L', 'S', '🗝️'];

    for (let i = 0; i < count; i++) {
      const rune = document.createElement('div');
      rune.className = 'dl-rising-glyph';
      rune.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      rune.style.left = `${30 + Math.random() * 40}%`;
      rune.style.animationDelay = `${i * 0.18}s`;

      container.appendChild(rune);
      setTimeout(() => rune.remove(), 2500);
    }
  }

  /* ------------------------------------------------------------------------
     WORLD 4: STARDUST OBSERVATORY
     Telescope tilting, 4 stars revealed, connecting constellation lines
     into Juno's wish lamp shape, and revealing animated magical lamp.
     ------------------------------------------------------------------------ */
  setupObservatoryWorld() {
    const telescope = document.getElementById('so-telescope-instrument');
    const linesGroup = document.getElementById('so-drawn-lines');
    const lampAura = document.getElementById('so-lamp-constellation-aura');
    const revealedLamp = document.getElementById('so-revealed-lamp');
    const statusPill = document.getElementById('so-status-pill');
    const shootingStar = document.getElementById('so-shooting-star');
    const stars = document.querySelectorAll('.so-target-star');

    // 1. Reset state
    this.connectedStars = [];
    if (linesGroup) linesGroup.innerHTML = '';
    if (lampAura) lampAura.style.opacity = '0';
    if (revealedLamp) revealedLamp.classList.remove('revealed');
    if (shootingStar) shootingStar.classList.remove('streak');
    if (telescope) telescope.classList.remove('tilt-up');

    if (statusPill) {
      statusPill.textContent = "🔭 Click the telescope or any of the 4 stars to begin the constellation!";
    }

    stars.forEach(s => s.classList.remove('connected'));

    // Animate telescope gentle upward tilt
    const tiltTimer = setTimeout(() => {
      if (telescope) telescope.classList.add('tilt-up');
    }, 350);
    this.timers.push(tiltTimer);

    // 2. Click telescope to reveal / prompt star targets
    if (telescope) {
      telescope.onclick = () => {
        if (window.junoAudio) window.junoAudio.playChime(880);

        if (statusPill) {
          statusPill.textContent = "⭐ Click the 4 stars one by one to draw the constellation!";
        }

        if (this.worldJuno) {
          this.worldJuno.setExpression('curious');
          this.setJunoSpeech("Click the four shining stars in order to draw the shape! 🔭", 4000);
        }
      };
      telescope.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          telescope.click();
        }
      };
    }

    // 3. Constellation SVG Coordinates for the 4 stars
    const starCoordinates = {
      '1': { x: 192, y: 134 }, // Spout
      '2': { x: 576, y: 105 }, // Handle
      '3': { x: 624, y: 307 }, // Base Right
      '4': { x: 176, y: 326 }  // Base Left
    };

    // Shared star click handler
    const handleStar = (star) => {
      const starIndex = star.getAttribute('data-star-index');
      if (!starIndex || this.connectedStars.includes(starIndex)) return;

      this.connectedStars.push(starIndex);
      star.classList.add('connected');

      // Play note according to progress
      const notes = [523.25, 659.25, 783.99, 1046.50];
      if (window.junoAudio) {
        window.junoAudio.playChime(notes[this.connectedStars.length - 1] || 880);
      }

      // Draw line from previous star
      if (this.connectedStars.length > 1) {
        const prevIndex = this.connectedStars[this.connectedStars.length - 2];
        const p1 = starCoordinates[prevIndex];
        const p2 = starCoordinates[starIndex];
        this.drawConstellationLine(p1, p2);
      }

      if (statusPill) {
        statusPill.textContent = `⭐ Connected ${this.connectedStars.length} of 4 stars!`;
      }

      // When all 4 stars are connected
      if (this.connectedStars.length === 4) {
        // Draw closing line from last star to first star
        const pLast = starCoordinates[this.connectedStars[3]];
        const pFirst = starCoordinates[this.connectedStars[0]];
        this.drawConstellationLine(pLast, pFirst);

        this.completeConstellation();
      }
    };

    // 4. Bind directly to each star + keydown support
    stars.forEach(star => {
      star.onclick = (e) => {
        e.stopPropagation();
        handleStar(star);
      };
      star.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleStar(star);
        }
      };
    });

    // Event delegation on constellation sky
    const skyContainer = document.querySelector('.so-constellation-sky');
    if (skyContainer) {
      skyContainer.onclick = (e) => {
        const star = e.target.closest('.so-target-star');
        if (star) {
          handleStar(star);
        }
      };
    }
  }

  drawConstellationLine(p1, p2) {
    const linesGroup = document.getElementById('so-drawn-lines');
    if (!linesGroup || !p1 || !p2) return;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', p1.x);
    line.setAttribute('y1', p1.y);
    line.setAttribute('x2', p2.x);
    line.setAttribute('y2', p2.y);
    line.setAttribute('stroke', 'url(#soLineGrad)');
    line.setAttribute('stroke-width', '3.5');
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('filter', 'url(#soStarGlow)');

    linesGroup.appendChild(line);
  }

  completeConstellation() {
    const lampAura = document.getElementById('so-lamp-constellation-aura');
    const revealedLamp = document.getElementById('so-revealed-lamp');
    const statusPill = document.getElementById('so-status-pill');
    const shootingStar = document.getElementById('so-shooting-star');

    if (lampAura) lampAura.style.opacity = '1';

    // Reveal the tiny animated golden wish lamp
    if (revealedLamp) {
      revealedLamp.classList.add('revealed');
    }

    // Trigger background shooting star streak
    if (shootingStar) {
      shootingStar.classList.add('streak');
    }

    if (statusPill) {
      statusPill.textContent = "✦ Constellation Complete: Juno's Wish Lamp! ✦";
    }

    // Celebratory melody
    if (window.junoAudio) {
      window.junoAudio.playChime(523.25);
      setTimeout(() => window.junoAudio.playChime(659.25), 140);
      setTimeout(() => window.junoAudio.playChime(783.99), 280);
      setTimeout(() => window.junoAudio.playChime(1046.50), 420);
    }

    // Juno celebrates
    if (this.worldJuno) {
      this.worldJuno.setExpression('happy');
      this.setJunoSpeech("You found my constellation! It's my little wish lamp! Thank you! 🔭⭐", 5000);
    }
  }

  /* ------------------------------------------------------------------------
     SECTION G: DREAM DELIVERY MAP INTERACTION (No Screen Shaking)
     ------------------------------------------------------------------------ */
  bindMapInteractions() {
    const pins = document.querySelectorAll('.map-node-pin');
    const travelerStar = document.getElementById('map-traveler-star');

    const waypoints = {
      'kingdom': { x: 180, y: 150 },
      'garden': { x: 380, y: 280 },
      'library': { x: 620, y: 140 },
      'observatory': { x: 820, y: 250 }
    };

    pins.forEach(pin => {
      pin.style.cursor = 'pointer';
      pin.addEventListener('click', (e) => {
        // Prevent default navigation or unwanted scrolling
        e.preventDefault();
        e.stopPropagation();

        const target = pin.getAttribute('data-target');
        const pos = waypoints[target];

        // Animate the traveling star directly to the waypoint coordinates on the map
        if (pos && travelerStar) {
          travelerStar.setAttribute('transform', `translate(${pos.x}, ${pos.y})`);
        }

        // Animate only the relevant star or pin effect with a clean local pulse
        pin.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        pin.style.transform = `scale(1.35)`;
        setTimeout(() => {
          pin.style.transform = '';
        }, 450);

        if (window.junoAudio) window.junoAudio.playChime(739.99);

        // Highlight matching destination card subtly WITHOUT scrolling or jumping the screen
        const card = document.getElementById(`dest-card-${target}`);
        if (card) {
          card.style.borderColor = 'var(--magical-gold)';
          card.style.boxShadow = '0 0 25px var(--magical-gold)';
          setTimeout(() => {
            card.style.boxShadow = '';
          }, 1500);
        }
      });
    });
  }
}

// Global registry
window.JunoDestinations = JunoDestinations;
