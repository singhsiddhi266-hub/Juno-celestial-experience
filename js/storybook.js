/**
 * INTERACTIVE STORYBOOK (Section J)
 * 6-page illustrated storybook with page-turn controls,
 * keyboard navigation, touch swipe support, and a hidden star on the bookmark ribbon.
 */

class JunoStorybook {
  constructor() {
    this.currentPage = 1;
    this.totalPages = 6;
    this.pagesData = [
      {
        page: 1,
        title: "The Sky of Wishes",
        art: "🌌",
        text: "Long ago, people whispered their wishes to the night sky. The stars kept every wish safe and shining bright."
      },
      {
        page: 2,
        title: "The Falling Star",
        art: "💫",
        text: "One night, a golden shooting star fell from the sky, racing softly down toward the quiet desert."
      },
      {
        page: 3,
        title: "The Golden Lamp",
        art: "🪔",
        text: "The star landed near an old golden lamp buried in the sand. This lamp had been waiting for a very long time."
      },
      {
        page: 4,
        title: "A Gentle Awakening",
        art: "✨",
        text: "Soft purple smoke floated out of the lamp with golden sparkles. Inside the smoke, a tiny baby genie opened her eyes.",
        hasSecretStar: true
      },
      {
        page: 5,
        title: "A New Friend",
        art: "🪽",
        text: "'Is this my sky?' Juno asked with a smile. She waved her tail and realized she could visit anyone's dream."
      },
      {
        page: 6,
        title: "The Adventure Begins",
        art: "🌟",
        text: "Now Juno travels through the stars to help wishes come true. 'Every wish hides a world,' she says. 'And I know the way.'"
      }
    ];

    this.init();
  }

  init() {
    this.bindDOM();
    this.renderPage();
  }

  bindDOM() {
    this.prevBtn = document.getElementById('book-prev-btn');
    this.nextBtn = document.getElementById('book-next-btn');
    this.pageCounter = document.getElementById('book-page-counter');
    this.leftPageArt = document.getElementById('book-left-art');
    this.rightPageTitle = document.getElementById('book-right-title');
    this.rightPageText = document.getElementById('book-right-text');
    this.bookmarkRibbon = document.getElementById('book-ribbon-star');

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevPage());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextPage());
    }

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prevPage();
      if (e.key === 'ArrowRight') this.nextPage();
    });

    // Hidden Star #6 on bookmark ribbon
    if (this.bookmarkRibbon) {
      this.bookmarkRibbon.addEventListener('click', () => {
        if (window.junoHiddenStars) {
          window.junoHiddenStars.unlockStar(6, "The Storybook Star: Found inside the storybook!");
        }
      });
    }
  }

  renderPage() {
    const data = this.pagesData[this.currentPage - 1];
    if (!data) return;

    if (this.leftPageArt) {
      this.leftPageArt.innerHTML = `
        <div style="font-size: 5rem; filter: drop-shadow(0 0 20px var(--magical-gold)); animation: float-pulse 3s infinite ease-in-out;">
          ${data.art}
        </div>
      `;
    }

    if (this.rightPageTitle) {
      this.rightPageTitle.textContent = data.title;
    }

    if (this.rightPageText) {
      this.rightPageText.textContent = data.text;
    }

    if (this.pageCounter) {
      this.pageCounter.textContent = `Page ${this.currentPage} of ${this.totalPages}`;
    }

    if (this.bookmarkRibbon) {
      this.bookmarkRibbon.style.display = data.hasSecretStar ? 'block' : 'none';
    }

    if (window.junoAudio) window.junoAudio.playChime(659.25);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.renderPage();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.renderPage();
    }
  }
}

window.JunoStorybook = JunoStorybook;
