/**
 * JUNO BIRTH STORY ENGINE — "The Wish That Fell From the Stars"
 * 6-Chapter Interactive Cinematic Origin Story with Sand Brushing Canvas,
 * Spark Selection, Environmental Transformation, and Progression Tracking.
 */

class JunoBirthStory {
  constructor() {
    this.currentChapter = 0; // 0 to 6
    this.totalChapters = 7;
    this.selectedWish = null;
    this.awakeningSparksCount = 0;
    this.starsAwakened = 0;

    this.init();
  }

  init() {
    this.bindDOM();
    this.setupPrologue();
    this.setupChapter1();
    this.setupChapter2();
    this.setupChapter3();
    this.setupChapter4();
    this.setupChapter5();
    this.setupFinale();
    this.updateProgress();
  }

  bindDOM() {
    this.progressStars = document.querySelectorAll('.story-star-node');
    this.chapterContainers = document.querySelectorAll('.story-chapter');
    this.skipBtn = document.getElementById('story-skip-btn');
    this.restartBtn = document.getElementById('story-restart-btn');

    if (this.skipBtn) {
      this.skipBtn.addEventListener('click', () => this.goToChapter(6));
    }
    if (this.restartBtn) {
      this.restartBtn.addEventListener('click', () => this.restart());
    }

    // Direct star progress clicks
    this.progressStars.forEach((star, index) => {
      star.addEventListener('click', () => {
        this.goToChapter(index);
      });
    });
  }

  goToChapter(index) {
    if (index < 0 || index >= this.totalChapters) return;

    this.chapterContainers.forEach(ch => ch.classList.remove('active'));
    this.currentChapter = index;

    const targetChapter = document.getElementById(`story-chapter-${index}`);
    if (targetChapter) {
      targetChapter.classList.add('active');
    }

    this.updateProgress();

    // Trigger chapter-specific setup if needed
    if (index === 2) {
      this.initSandCanvas();
    }
  }

  updateProgress() {
    this.progressStars.forEach((star, index) => {
      star.classList.remove('completed', 'active');
      if (index < this.currentChapter) {
        star.classList.add('completed');
      } else if (index === this.currentChapter) {
        star.classList.add('active');
      }
    });
  }

  restart() {
    this.selectedWish = null;
    this.awakeningSparksCount = 0;
    this.starsAwakened = 0;

    // Reset Prologue
    document.querySelectorAll('.sleeping-star').forEach(s => s.classList.remove('awakened'));
    const followBtn = document.getElementById('prologue-follow-btn');
    if (followBtn) followBtn.style.display = 'none';

    // Reset Sparks
    document.querySelectorAll('.magic-spark-btn').forEach(b => b.classList.remove('selected'));

    // Reset Wishes
    document.querySelectorAll('.wish-choice-card').forEach(w => w.classList.remove('selected'));
    const viewport = document.querySelector('.story-stage-viewport');
    if (viewport) {
      viewport.className = 'story-stage-viewport';
    }

    this.goToChapter(0);
  }

  /* ---------------- PROLOGUE: Sleeping Universe ---------------- */
  setupPrologue() {
    const sleepingStars = document.querySelectorAll('.sleeping-star');
    const followBtn = document.getElementById('prologue-follow-btn');

    sleepingStars.forEach(star => {
      star.addEventListener('click', () => {
        if (star.classList.contains('awakened')) return;

        star.classList.add('awakened');
        this.starsAwakened++;

        if (window.junoAudio) {
          window.junoAudio.playChime(600 + this.starsAwakened * 150);
        }

        if (this.starsAwakened >= 3) {
          if (followBtn) {
            followBtn.style.display = 'inline-flex';
            followBtn.classList.add('pulse-anim');
          }
        }
      });
    });

    if (followBtn) {
      followBtn.addEventListener('click', () => {
        this.goToChapter(1);
      });
    }
  }

  /* ---------------- CHAPTER 1: A Star With a Secret ---------------- */
  setupChapter1() {
    const starDraggable = document.getElementById('guide-star-draggable');
    const duneDropSpot = document.getElementById('buried-lamp-spot');
    const ch1NextBtn = document.getElementById('ch1-next-btn');

    if (!starDraggable || !duneDropSpot) return;

    let isGuiding = false;

    const onDropSuccess = () => {
      starDraggable.style.top = '70%';
      starDraggable.style.left = '50%';
      duneDropSpot.innerHTML = '✨ The star touched the sand! A lamp is appearing!';
      duneDropSpot.style.borderColor = 'var(--magical-gold)';

      if (window.junoAudio) {
        window.junoAudio.playChime(880);
      }

      if (ch1NextBtn) {
        ch1NextBtn.style.display = 'inline-flex';
      }

      setTimeout(() => {
        this.goToChapter(2);
      }, 1400);
    };

    starDraggable.addEventListener('click', onDropSuccess);

    // Click on drop target also triggers
    duneDropSpot.addEventListener('click', onDropSuccess);

    if (ch1NextBtn) {
      ch1NextBtn.addEventListener('click', () => this.goToChapter(2));
    }
  }

  /* ---------------- CHAPTER 2: The Forgotten Lamp (Sand Canvas) ---------------- */
  setupChapter2() {
    const openLampBtn = document.getElementById('open-lamp-btn');
    if (openLampBtn) {
      openLampBtn.addEventListener('click', () => {
        if (window.junoAudio) {
          window.junoAudio.playChime(523.25);
          setTimeout(() => window.junoAudio.playChime(659.25), 180);
          setTimeout(() => window.junoAudio.playChime(783.99), 360);
        }
        this.goToChapter(3);
      });
    }
  }

  initSandCanvas() {
    const canvas = document.getElementById('sand-scratch-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth || 480;
    canvas.height = canvas.offsetHeight || 320;

    // Fill with desert twilight sand texture
    const sandGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    sandGrad.addColorStop(0, '#5A3E6E');
    sandGrad.addColorStop(0.5, '#7F5288');
    sandGrad.addColorStop(1, '#3B234C');
    ctx.fillStyle = sandGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add sparkling sand grain dots
    ctx.fillStyle = 'rgba(255, 215, 120, 0.4)';
    for (let i = 0; i < 350; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#FFF5E8';
    ctx.font = '16px Cormorant Garamond, serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Wipe the sand away to find the lamp', canvas.width / 2, canvas.height / 2);

    let isBrushing = false;
    let brushedPixels = 0;
    const totalPixelsNeeded = 25; // Brush count threshold

    const brush = (x, y) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 32, 0, Math.PI * 2);
      ctx.fill();

      brushedPixels++;
      if (brushedPixels > totalPixelsNeeded) {
        const openLampBtn = document.getElementById('open-lamp-btn');
        if (openLampBtn) {
          openLampBtn.style.display = 'inline-flex';
        }
      }
    };

    canvas.addEventListener('mousedown', () => isBrushing = true);
    window.addEventListener('mouseup', () => isBrushing = false);
    canvas.addEventListener('mousemove', (e) => {
      if (!isBrushing) return;
      const rect = canvas.getBoundingClientRect();
      brush(e.clientX - rect.left, e.clientY - rect.top);
    });

    // Touch support for mobile devices
    canvas.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      brush(touch.clientX - rect.left, touch.clientY - rect.top);
      e.preventDefault();
    }, { passive: false });
  }

  /* ---------------- CHAPTER 3: A Little Genie Awakens ---------------- */
  setupChapter3() {
    const sparkBtns = document.querySelectorAll('.magic-spark-btn');
    const ch3NextBtn = document.getElementById('ch3-next-btn');
    const silhouette = document.getElementById('juno-awakening-avatar');

    sparkBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('selected')) return;

        btn.classList.add('selected');
        this.awakeningSparksCount++;

        if (window.junoAudio) {
          window.junoAudio.playChime(440 + this.awakeningSparksCount * 110);
        }

        if (this.awakeningSparksCount === 1) {
          silhouette.style.filter = 'drop-shadow(0 0 15px var(--magical-gold))';
        } else if (this.awakeningSparksCount === 2) {
          silhouette.style.filter = 'drop-shadow(0 0 25px var(--lavender))';
        } else if (this.awakeningSparksCount >= 3) {
          // Juno fully awakens!
          silhouette.style.filter = 'none';
          if (!window.storyJunoInstance) {
            window.storyJunoInstance = new JunoCharacter('juno-awakening-avatar', {
              size: 'juno-medium-size',
              initialDialogue: "Oh! Is this my sky? Thank you for waking me! ✨"
            });
          } else {
            window.storyJunoInstance.setExpression('happy');
            window.storyJunoInstance.say("Oh! Is this my sky? Thank you for waking me! ✨", 4000);
          }

          if (ch3NextBtn) {
            ch3NextBtn.style.display = 'inline-flex';
          }
        }
      });
    });

    if (ch3NextBtn) {
      ch3NextBtn.addEventListener('click', () => this.goToChapter(4));
    }
  }

  /* ---------------- CHAPTER 4: Her First Wish ---------------- */
  setupChapter4() {
    const wishCards = document.querySelectorAll('.wish-choice-card');
    const ch4NextBtn = document.getElementById('ch4-next-btn');
    const viewport = document.querySelector('.story-stage-viewport');

    wishCards.forEach(card => {
      card.addEventListener('click', () => {
        wishCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        const wishType = card.getAttribute('data-wish');
        this.selectedWish = wishType;

        // Transform the environment visibly!
        viewport.className = 'story-stage-viewport';
        if (wishType === 'moon') {
          viewport.classList.add('wish-world-ambient-moon');
          if (window.storyJunoInstance) {
            window.storyJunoInstance.say("A bright path in the sky! Now nobody will get lost! 🌙", 4000);
          }
        } else if (wishType === 'star') {
          viewport.classList.add('wish-world-ambient-star');
          if (window.storyJunoInstance) {
            window.storyJunoInstance.say("Look at all the stars shining! Every dream is glowing! ⭐", 4000);
          }
        } else if (wishType === 'flower') {
          viewport.classList.add('wish-world-ambient-flower');
          if (window.storyJunoInstance) {
            window.storyJunoInstance.say("Magical flowers in the sky! Everything is blooming! 🌸", 4000);
          }
        }

        if (window.junoAudio) {
          window.junoAudio.playChime(659.25);
        }

        if (ch4NextBtn) {
          ch4NextBtn.style.display = 'inline-flex';
        }
      });
    });

    if (ch4NextBtn) {
      ch4NextBtn.addEventListener('click', () => this.goToChapter(5));
    }
  }

  /* ---------------- CHAPTER 5: The World Inside a Wish ---------------- */
  setupChapter5() {
    const destCards = document.querySelectorAll('.dest-preview-card');
    const ch5NextBtn = document.getElementById('ch5-next-btn');

    destCards.forEach(dest => {
      dest.addEventListener('click', () => {
        const worldName = dest.getAttribute('data-dest');
        destCards.forEach(c => c.style.borderColor = '');
        dest.style.borderColor = 'var(--magical-gold)';

        if (window.junoAudio) {
          window.junoAudio.playChime(783.99);
        }

        // Open live interactive world smoothly without any alert dialogs
        if (window.junoDestinations && typeof window.junoDestinations.openWorld === 'function') {
          window.junoDestinations.openWorld(worldName, { source: 'chapter5' });
        }

        // Reveal the next button to allow continuing to chapter 6
        if (ch5NextBtn) {
          ch5NextBtn.style.display = 'inline-flex';
        }
      });
    });

    if (ch5NextBtn) {
      ch5NextBtn.addEventListener('click', () => this.goToChapter(6));
    }
  }

  /* ---------------- FINALE: The First Star ---------------- */
  setupFinale() {
    const finaleStar = document.getElementById('finale-star-beacon');
    const exploreWorldBtn = document.getElementById('finale-explore-btn');
    const reliveMagicBtn = document.getElementById('finale-relive-btn');
    const finaleDialogue = document.getElementById('finale-story-dialogue');

    if (finaleStar) {
      finaleStar.addEventListener('click', () => {
        finaleStar.style.transform = 'scale(0) translateY(-60px)';
        finaleStar.style.opacity = '0';

        if (window.junoAudio) {
          window.junoAudio.playChime(523.25);
          setTimeout(() => window.junoAudio.playChime(659.25), 150);
          setTimeout(() => window.junoAudio.playChime(783.99), 300);
          setTimeout(() => window.junoAudio.playChime(1046.5), 450);
        }

        if (finaleDialogue) {
          finaleDialogue.textContent = "✨ The star became the jewel on my turban! We are friends now!";
        }

        // Award Hidden Star #4 if not already found
        if (window.junoHiddenStars) {
          window.junoHiddenStars.unlockStar(4, "The Origin Star: You helped Juno find her first star!");
        }

        if (exploreWorldBtn) exploreWorldBtn.style.display = 'inline-flex';
      });
    }

    if (exploreWorldBtn) {
      exploreWorldBtn.addEventListener('click', () => {
        const destSection = document.getElementById('destinations');
        if (destSection) {
          destSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    if (reliveMagicBtn) {
      reliveMagicBtn.addEventListener('click', () => this.restart());
    }
  }
}

window.JunoBirthStory = JunoBirthStory;
