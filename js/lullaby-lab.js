/**
 * LULLABY LAB (Section H)
 * Pure Web Audio API Synthesizer & Music Box.
 * Generates delicate celestial bell/chime tones without external audio assets.
 * Fully optional, muted by default or easily toggled, and sound is never required.
 * NO SPEECH SYNTHESIS / NO VOICE.
 */

class JunoLullabyLab {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.currentMood = 'moonlight'; // 'moonlight', 'stardust', 'cloud'
    this.isPlayingMelody = false;
    this.melodyTimer = null;

    // Pentatonic scale notes
    this.notes = [
      { name: 'C5', freq: 523.25 },
      { name: 'D5', freq: 587.33 },
      { name: 'E5', freq: 659.25 },
      { name: 'G5', freq: 783.99 },
      { name: 'A5', freq: 880.00 },
      { name: 'C6', freq: 1046.50 },
      { name: 'D6', freq: 1174.66 },
      { name: 'E6', freq: 1318.51 }
    ];

    this.init();
  }

  init() {
    this.bindDOM();
  }

  ensureAudioContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  bindDOM() {
    // Nav mute icon
    this.muteToggleBtn = document.getElementById('global-mute-btn');
    if (this.muteToggleBtn) {
      this.muteToggleBtn.addEventListener('click', () => this.toggleMute());
    }

    // Chime Pads
    this.pads = document.querySelectorAll('.chime-pad-btn');
    this.pads.forEach((pad, index) => {
      pad.addEventListener('click', () => {
        this.playPad(index);
      });
    });

    // Mood Pills
    this.moodBtns = document.querySelectorAll('.lullaby-mood-btn');
    this.moodBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.moodBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentMood = btn.getAttribute('data-mood');
      });
    });

    // Auto Melody Play/Stop
    this.melodyBtn = document.getElementById('toggle-melody-btn');
    if (this.melodyBtn) {
      this.melodyBtn.addEventListener('click', () => this.toggleMelody());
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.muteToggleBtn) {
      this.muteToggleBtn.classList.toggle('active', !this.isMuted);
      this.muteToggleBtn.innerHTML = this.isMuted ? '🔇' : '🎵';
      this.muteToggleBtn.title = this.isMuted ? 'Unmute celestial music' : 'Mute celestial music';
    }
    if (this.isMuted && this.isPlayingMelody) {
      this.stopMelody();
    }
  }

  playChime(freq, customDecay = 1.6) {
    if (this.isMuted) return;
    this.ensureAudioContext();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Harmonics depending on mood
    if (this.currentMood === 'stardust') {
      osc.type = 'triangle';
    } else if (this.currentMood === 'cloud') {
      osc.type = 'sine';
    } else {
      osc.type = 'sine';
    }

    osc.frequency.setValueAtTime(freq, now);

    // Soft chime envelope
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + customDecay);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + customDecay);
  }

  playPad(index) {
    const note = this.notes[index];
    if (!note) return;

    this.playChime(note.freq, 2.0);

    const pad = this.pads[index];
    if (pad) {
      pad.classList.add('playing');
      setTimeout(() => pad.classList.remove('playing'), 250);
    }

    if (window.heroJunoInstance) {
      window.heroJunoInstance.setExpression('happy');
    }
  }

  toggleMelody() {
    if (this.isPlayingMelody) {
      this.stopMelody();
    } else {
      this.startMelody();
    }
  }

  startMelody() {
    this.isPlayingMelody = true;
    if (this.melodyBtn) {
      this.melodyBtn.textContent = '⏹ Stop Lullaby';
      this.melodyBtn.classList.add('btn-primary');
    }

    if (window.heroJunoInstance) {
      window.heroJunoInstance.say("✨ Listening to the star chimes...", 4000);
    }

    // Melodic pattern using pentatonic scale indices
    const pattern = [0, 2, 4, 2, 5, 4, 2, 0, 1, 3, 5, 4, 2, 1, 0, 4];
    let step = 0;

    const tick = () => {
      if (!this.isPlayingMelody) return;
      const noteIndex = pattern[step % pattern.length];
      this.playPad(noteIndex);
      step++;
      this.melodyTimer = setTimeout(tick, 450);
    };

    tick();
  }

  stopMelody() {
    this.isPlayingMelody = false;
    if (this.melodyTimer) clearTimeout(this.melodyTimer);
    if (this.melodyBtn) {
      this.melodyBtn.textContent = '▶ Play Star Lullaby';
      this.melodyBtn.classList.remove('btn-primary');
    }
  }
}

window.JunoLullabyLab = JunoLullabyLab;
