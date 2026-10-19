/**
 * MAGIC TOOLBOX (Section E)
 * Celestial alchemy experiment where visitors combine 3 out of 6 ingredients
 * to produce unique magical creations with deterministic outcomes and Juno reactions.
 */

class JunoMagicToolbox {
  constructor() {
    this.selectedIngredients = new Set();
    this.init();
  }

  init() {
    this.bindDOM();
  }

  bindDOM() {
    this.cards = document.querySelectorAll('.ingredient-card');
    this.counter = document.getElementById('toolbox-counter');
    this.mixBtn = document.getElementById('mix-magic-btn');
    this.resetBtn = document.getElementById('reset-toolbox-btn');
    this.resultContainer = document.getElementById('alchemy-result-container');

    this.cards.forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-ingredient');

        if (this.selectedIngredients.has(id)) {
          this.selectedIngredients.delete(id);
          card.classList.remove('selected');
        } else {
          if (this.selectedIngredients.size >= 3) {
            alert("You can only choose 3 ingredients at a time! ✨");
            return;
          }
          this.selectedIngredients.add(id);
          card.classList.add('selected');
        }

        this.updateCounter();
      });
    });

    if (this.mixBtn) {
      this.mixBtn.addEventListener('click', () => this.mixMagic());
    }

    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => this.resetToolbox());
    }
  }

  updateCounter() {
    const count = this.selectedIngredients.size;
    if (this.counter) {
      this.counter.textContent = `Pick 3 ingredients (Selected: ${count}/3)`;
    }

    if (this.mixBtn) {
      if (count === 3) {
        this.mixBtn.removeAttribute('disabled');
        this.mixBtn.classList.remove('disabled');
        this.mixBtn.classList.add('pulse-anim');
      } else {
        this.mixBtn.setAttribute('disabled', 'true');
        this.mixBtn.classList.add('disabled');
        this.mixBtn.classList.remove('pulse-anim');
      }
    }
  }

  mixMagic() {
    if (this.selectedIngredients.size !== 3) return;

    const items = Array.from(this.selectedIngredients).sort().join('+');
    const outcome = this.getRecipeOutcome(items);

    if (window.junoAudio) {
      window.junoAudio.playChime(587.33);
      setTimeout(() => window.junoAudio.playChime(739.99), 180);
      setTimeout(() => window.junoAudio.playChime(880), 360);
    }

    if (this.resultContainer) {
      this.resultContainer.innerHTML = `
        <div class="alchemy-result-card">
          <div style="font-size: 3.5rem; margin-bottom: 12px; filter: drop-shadow(0 0 16px var(--magical-gold));">${outcome.icon}</div>
          <h3 style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--cream); margin-bottom: 8px;">${outcome.title}</h3>
          <p style="font-size: 0.9rem; color: var(--pale-cyan); margin-bottom: 16px; line-height: 1.5;">${outcome.desc}</p>
          <div style="background: rgba(184, 165, 255, 0.15); border: 1px dashed var(--glass-border); padding: 8px 14px; border-radius: var(--radius-sm); font-size: 0.85rem; color: var(--magical-gold);">
            Juno: "${outcome.junoSays}"
          </div>
        </div>
      `;
    }

    if (window.heroJunoInstance) {
      window.heroJunoInstance.setExpression('wonder');
      window.heroJunoInstance.say(outcome.junoSays, 3500);
    }

    // Secret combo for Hidden Star #3: memory + spark + stardust
    if (items === 'memory+spark+stardust') {
      if (window.junoHiddenStars) {
        window.junoHiddenStars.unlockStar(3, "The Alchemist's Star: Created from your recipe!");
      }
    }
  }

  getRecipeOutcome(key) {
    const recipes = {
      'cloud+moondust+petals': {
        icon: '🪷',
        title: 'Lunar Mist Blossom',
        desc: 'A glowing flower that opens under soft moonlight.',
        junoSays: 'It smells like fresh sweet rain!'
      },
      'memory+spark+stardust': {
        icon: '🔮',
        title: 'The First Wish Crystal',
        desc: 'A glowing crystal holding the very first wish ever made.',
        junoSays: 'Wait... this feels like the star that woke me up!'
      },
      'cloud+memory+spark': {
        icon: '⚡',
        title: 'Dancing Cloud Spark',
        desc: 'A playful little spark bouncing inside a fluffy cloud.',
        junoSays: 'Hehe! It tickles! Look at it dance!'
      },
      'moondust+petals+stardust': {
        icon: '🌌',
        title: 'Starlight Ribbon',
        desc: 'A glowing ribbon of starlight that shines across the night.',
        junoSays: "It's so pretty! Look at those colors!"
      },
      'cloud+petals+spark': {
        icon: '🌸',
        title: 'Golden Songbird',
        desc: 'A tiny golden bird that chirps happy dream songs.',
        junoSays: 'Listen to that sweet song!'
      }
    };

    return recipes[key] || {
      icon: '✨',
      title: 'Starlight Dream Mix',
      desc: 'A swirl of starlight and sweet dreams.',
      junoSays: 'Everything mixed together so nicely! Look at the glow!'
    };
  }

  resetToolbox() {
    this.selectedIngredients.clear();
    this.cards.forEach(c => c.classList.remove('selected'));
    this.updateCounter();
    if (this.resultContainer) {
      this.resultContainer.innerHTML = `
        <div style="color: rgba(255, 245, 232, 0.4); font-style: italic;">
          Pick three ingredients and click "Mix the Magic" to see what you create.
        </div>
      `;
    }
  }
}

window.JunoMagicToolbox = JunoMagicToolbox;
