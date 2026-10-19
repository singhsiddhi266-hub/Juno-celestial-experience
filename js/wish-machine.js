/**
 * THE WISH MACHINE (Section D)
 * Allows visitors to enter a wish, choose a mood, and receive a poetic celestial response.
 * Spawns the wish in the Constellation of Wishes and persists to LocalStorage.
 */

class JunoWishMachine {
  constructor() {
    this.selectedMood = 'hopeful';
    this.wishes = JSON.parse(localStorage.getItem('juno_wishes') || '[]');
    this.init();
  }

  init() {
    this.bindDOM();
    this.renderConstellation();
  }

  bindDOM() {
    this.textarea = document.getElementById('wish-textarea');
    this.moodBtns = document.querySelectorAll('.mood-pill-btn');
    this.submitBtn = document.getElementById('cast-wish-btn');
    this.constellationSky = document.getElementById('wish-constellation-sky');

    this.moodBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.moodBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedMood = btn.getAttribute('data-mood');
      });
    });

    if (this.submitBtn) {
      this.submitBtn.addEventListener('click', () => this.castWish());
    }
  }

  castWish() {
    const text = this.textarea.value.trim();
    if (!text) {
      alert("Please write a wish first! ✨");
      return;
    }

    const response = this.generateResponse(text, this.selectedMood);

    // Save wish
    const wishObj = {
      id: Date.now(),
      text: text,
      mood: this.selectedMood,
      response: response,
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 15
    };

    this.wishes.unshift(wishObj);
    localStorage.setItem('juno_wishes', JSON.stringify(this.wishes.slice(0, 15)));

    // Juno reaction
    if (window.heroJunoInstance) {
      window.heroJunoInstance.setExpression('happy');
      window.heroJunoInstance.say("That wish feels special! ✨", 3500);
    }

    if (window.junoAudio) {
      window.junoAudio.playChime(784);
      setTimeout(() => window.junoAudio.playChime(1046), 200);
    }

    // Display result popup
    alert(`🌟 Juno received your wish:\n\n"${text}"\n\nStar Message: ${response}`);

    this.textarea.value = '';
    this.renderConstellation();

    // Check if this wish text has a secret keyword for star #2
    if (text.toLowerCase().includes('star') || text.toLowerCase().includes('juno') || text.toLowerCase().includes('dream')) {
      if (window.junoHiddenStars) {
        window.junoHiddenStars.unlockStar(2, "The Wishmaker Star: Born from your wish!");
      }
    }
  }

  generateResponse(wish, mood) {
    const responses = {
      hopeful: [
        "The stars heard your wish, and tomorrow is looking bright!",
        "A glowing star carries your hope into the sky.",
        "Your wish brings warm light to the quiet night."
      ],
      adventurous: [
        "A shooting star leads the way toward an exciting new journey.",
        "The night sky is ready for your next adventure.",
        "A new path is opening up just for you."
      ],
      peaceful: [
        "Soft lavender clouds keep your wish safe and calm.",
        "Your gentle wish floats like moonlight across still water.",
        "Rest easy tonight. The stars are watching over your wish."
      ],
      mysterious: [
        "A secret star twinkles in the dark, keeping your wish safe.",
        "The golden lamp glows softly in answer to your wish.",
        "Something magical is quietly beginning to happen."
      ]
    };

    const list = responses[mood] || responses.hopeful;
    return list[Math.floor(Math.random() * list.length)];
  }

  renderConstellation() {
    if (!this.constellationSky) return;

    this.constellationSky.innerHTML = '';

    // Default sample wishes if empty
    const displayList = this.wishes.length > 0 ? this.wishes : [
      { id: 1, text: "I hope everyone finds a true friend.", mood: "hopeful", x: 25, y: 35 },
      { id: 2, text: "I want to explore new and exciting places.", mood: "adventurous", x: 70, y: 40 },
      { id: 3, text: "Peace and happy dreams for everyone.", mood: "peaceful", x: 50, y: 65 }
    ];

    displayList.forEach(w => {
      const starNode = document.createElement('div');
      starNode.className = 'constellation-star-wish';
      starNode.style.left = `${w.x}%`;
      starNode.style.top = `${w.y}%`;
      starNode.title = `"${w.text}" (${w.mood})`;
      starNode.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24">
          <polygon points="12,2 15,9 22,10 17,15 18,22 12,18 6,22 7,15 2,10 9,9" fill="#FFD778" />
        </svg>
      `;

      starNode.addEventListener('click', () => {
        alert(`⭐ Star Wish:\n\n"${w.text}"\nMood: ${w.mood}`);
      });

      this.constellationSky.appendChild(starNode);
    });
  }
}

window.JunoWishMachine = JunoWishMachine;
