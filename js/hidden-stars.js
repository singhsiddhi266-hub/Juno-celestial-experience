/**
 * SEVEN HIDDEN GOLDEN STARS & "THE PLACE BETWEEN WISHES" (Section L)
 * Manages discovery of the 7 hidden stars across the site, persistence,
 * HUD progress indicator, the Star Codex clue modal, and the secret finale sanctuary.
 */

class JunoHiddenStars {
  constructor() {
    this.totalStars = 7;
    this.foundStars = new Set(JSON.parse(localStorage.getItem('juno_stars_found') || '[]'));
    this.clues = [
      { id: 1, title: "The Moonlit Star", clue: "A golden star is hidden near the moon in the main scene." },
      { id: 2, title: "The Wishmaker Star", clue: "Make a wish in the Wish Machine using the word 'star', 'juno', or 'dream'." },
      { id: 3, title: "The Alchemist's Star", clue: "In the Magic Toolbox, mix Forgotten Memory + Golden Spark + Stardust." },
      { id: 4, title: "The Origin Star", clue: "Finish Juno's birth story and click the glowing star." },
      { id: 5, title: "The Nightlight Star", clue: "Turn on Nightlight Mode and look in the dark corners." },
      { id: 6, title: "The Storybook Star", clue: "Open the Storybook to Page 4 and look at the ribbon bookmark." },
      { id: 7, title: "The Game Star", clue: "Score 100 points or more in the Catch the Falling Dreams game." }
    ];

    this.init();
  }

  init() {
    this.bindDOM();
    this.updateHUD();
    this.checkInitialStarTriggers();
  }

  bindDOM() {
    this.hudBtn = document.getElementById('star-tracker-hud-btn');
    this.hudCount = document.getElementById('star-hud-count');
    this.codexModal = document.getElementById('star-codex-modal');
    this.secretModal = document.getElementById('place-between-wishes-modal');
    this.toast = document.getElementById('star-discovery-toast');
    this.toastText = document.getElementById('star-toast-text');

    if (this.hudBtn) {
      this.hudBtn.addEventListener('click', () => this.openCodex());
    }

    // Modal close buttons
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-overlay');
        if (modal) modal.classList.remove('open');
      });
    });

    // Hidden Star #1 trigger near the moon in Hero section
    const heroMoonStar = document.getElementById('hero-moon-secret-star');
    if (heroMoonStar) {
      const handleMoonStar = (e) => {
        if (e) e.stopPropagation();
        this.unlockStar(1, "The Moonlit Star: You found the star sparkling by the moon!");
      };
      heroMoonStar.addEventListener('click', handleMoonStar);
      heroMoonStar.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleMoonStar(e);
        }
      });
    }
  }

  checkInitialStarTriggers() {
    // Dim stars that were already found
    this.foundStars.forEach(id => {
      const el = document.querySelector(`[data-star-id="${id}"]`);
      if (el) el.classList.add('found');
    });
  }

  unlockStar(id, customMsg) {
    if (this.foundStars.has(id)) return;

    this.foundStars.add(id);
    localStorage.setItem('juno_stars_found', JSON.stringify(Array.from(this.foundStars)));

    const starEl = document.querySelector(`[data-star-id="${id}"]`);
    if (starEl) {
      starEl.classList.add('found');
    }

    this.updateHUD();
    this.showToast(customMsg || `You found Hidden Star #${id}! ✨`);

    if (window.junoAudio) {
      window.junoAudio.playChime(784);
      setTimeout(() => window.junoAudio.playChime(1046.5), 200);
      setTimeout(() => window.junoAudio.playChime(1318.5), 400);
    }

    if (window.heroJunoInstance) {
      window.heroJunoInstance.setExpression('happy');
      window.heroJunoInstance.say("You found another secret! ⭐", 3500);
    }

    // Check if all 7 stars found!
    if (this.foundStars.size >= this.totalStars) {
      setTimeout(() => {
        this.unlockPlaceBetweenWishes();
      }, 1500);
    }
  }

  updateHUD() {
    const count = this.foundStars.size;
    if (this.hudCount) {
      this.hudCount.textContent = `${count}/${this.totalStars}`;
    }
    if (this.hudBtn) {
      if (count === this.totalStars) {
        this.hudBtn.style.borderColor = 'var(--magical-gold)';
        this.hudBtn.style.boxShadow = '0 0 25px var(--magical-gold)';
      }
    }
  }

  showToast(text) {
    if (!this.toast || !this.toastText) return;
    this.toastText.textContent = text;
    this.toast.classList.add('visible');

    setTimeout(() => {
      this.toast.classList.remove('visible');
    }, 4500);
  }

  openCodex() {
    if (!this.codexModal) return;
    const listContainer = document.getElementById('codex-stars-list');
    if (listContainer) {
      listContainer.innerHTML = '';
      this.clues.forEach(item => {
        const isFound = this.foundStars.has(item.id);
        const div = document.createElement('div');
        div.style.cssText = `
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 12px;
          margin-bottom: 10px;
          background: ${isFound ? 'rgba(255, 215, 120, 0.15)' : 'rgba(32, 38, 83, 0.5)'};
          border: 1px solid ${isFound ? 'var(--magical-gold)' : 'var(--glass-border)'};
          border-radius: var(--radius-sm);
        `;
        div.innerHTML = `
          <div style="font-size: 1.5rem; color: ${isFound ? 'var(--magical-gold)' : 'rgba(255,255,255,0.2)'};">
            ${isFound ? '⭐' : '✧'}
          </div>
          <div>
            <div style="font-weight: 600; color: ${isFound ? 'var(--magical-gold)' : 'var(--cream)'}; font-size: 0.95rem;">
              Star #${item.id}: ${item.title} ${isFound ? '✓ (Found!)' : ''}
            </div>
            <div style="font-size: 0.82rem; color: var(--pale-cyan); margin-top: 2px;">
              ${isFound ? 'Found and shining bright!' : item.clue}
            </div>
          </div>
        `;
        listContainer.appendChild(div);
      });
    }

    this.codexModal.classList.add('open');
  }

  unlockPlaceBetweenWishes() {
    if (!this.secretModal) return;
    this.secretModal.classList.add('open');

    if (window.heroJunoInstance) {
      window.heroJunoInstance.setExpression('happy');
      window.heroJunoInstance.say("✨ You found all seven stars! Welcome to the Place Between Wishes!", 5000);
    }
  }
}

window.JunoHiddenStars = JunoHiddenStars;
