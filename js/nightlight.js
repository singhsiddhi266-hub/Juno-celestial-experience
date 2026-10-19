/**
 * NIGHTLIGHT / FLASHLIGHT MODE (Section I)
 * Creates a magical darkened shroud across the website with a soft glowing radial spotlight
 * following the pointer/touch, revealing hidden constellations, secret messages, and stars.
 */

class JunoNightlight {
  constructor() {
    this.isEnabled = false;
    this.init();
  }

  init() {
    this.bindDOM();
    this.bindPointer();
  }

  bindDOM() {
    this.toggleBtn = document.getElementById('global-nightlight-btn');
    this.overlay = document.getElementById('nightlight-overlay');

    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggle());
    }

    // Hidden star in nightlight corner
    const secretStar = document.getElementById('nightlight-secret-star');
    if (secretStar) {
      secretStar.addEventListener('click', () => {
        if (window.junoHiddenStars) {
          window.junoHiddenStars.unlockStar(5, "The Starlight Lantern: Revealed only by your nightlight!");
        }
      });
    }
  }

  bindPointer() {
    const updateLightPos = (x, y) => {
      if (this.overlay) {
        this.overlay.style.setProperty('--lx', `${x}px`);
        this.overlay.style.setProperty('--ly', `${y}px`);
      }
    };

    window.addEventListener('mousemove', (e) => {
      if (!this.isEnabled) return;
      updateLightPos(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', (e) => {
      if (!this.isEnabled) return;
      const touch = e.touches[0];
      updateLightPos(touch.clientX, touch.clientY);
    }, { passive: true });
  }

  toggle() {
    this.isEnabled = !this.isEnabled;
    document.body.classList.toggle('nightlight-enabled', this.isEnabled);

    if (this.overlay) {
      this.overlay.classList.toggle('active', this.isEnabled);
    }

    if (this.toggleBtn) {
      this.toggleBtn.classList.toggle('active', this.isEnabled);
      this.toggleBtn.title = this.isEnabled ? 'Disable Nightlight Mode' : 'Enable Nightlight Mode';
    }

    if (this.isEnabled) {
      if (window.heroJunoInstance) {
        window.heroJunoInstance.setExpression('wonder');
        window.heroJunoInstance.say("✨ Look! The nightlight reveals secrets the daytime hides!", 4000);
      }
      if (window.junoAudio) window.junoAudio.playChime(659.25);
    }
  }
}

window.JunoNightlight = JunoNightlight;
