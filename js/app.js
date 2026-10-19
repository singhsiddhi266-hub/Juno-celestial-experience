/**
 * MAIN APP CONTROLLER
 * Background Celestial Canvas (Twinkling stars, nebulae, shooting stars),
 * Character instances binding, Dialogue interactions, and Component bootstrapping.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Celestial Background Canvas
  initCelestialCanvas();

  // 2. Initialize Audio Synthesizer (Lullaby Lab)
  window.junoAudio = new JunoLullabyLab();

  // 3. Initialize 7 Hidden Stars Manager
  window.junoHiddenStars = new JunoHiddenStars();

  // 4. Initialize Hero Juno Character (2D layered SVG)
  window.heroJunoInstance = new JunoCharacter('hero-juno-container', {
    size: 'juno-hero-size',
    initialDialogue: "Oh! You found me! ✨ Let's explore together!"
  });

  // 5. Initialize Meet Juno Section Character
  window.meetJunoInstance = new JunoCharacter('meet-juno-container', {
    size: 'juno-medium-size',
    initialDialogue: "Hi! I'm Juno, a little genie born from a fallen star!"
  });

  // 6. Initialize Birth Story Engine (Section B)
  window.junoBirthStory = new JunoBirthStory();

  // 7. Initialize Wish Machine (Section D)
  window.junoWishMachine = new JunoWishMachine();

  // 8. Initialize Magic Toolbox (Section E)
  window.junoToolbox = new JunoMagicToolbox();

  // 9. Initialize Destinations & Map (Sections F & G)
  window.junoDestinations = new JunoDestinations();

  // 10. Initialize Nightlight Mode (Section I)
  window.junoNightlight = new JunoNightlight();

  // 11. Initialize Storybook (Section J)
  window.junoStorybook = new JunoStorybook();

  // 12. Initialize Mini-Game (Section K)
  window.junoGame = new JunoCatchGame();

  // 13. Bind Meet Juno Interactive Dialogue Prompts (Section C)
  bindMeetJunoDialogue();

  // 14. Bind Navigation Header Scroll Effect
  bindHeaderScroll();
});

/* --------------------------------------------------------------------------
   CELESTIAL BACKGROUND CANVAS (Twinkling Stars, Nebulae, Shooting Stars)
   -------------------------------------------------------------------------- */
function initCelestialCanvas() {
  const canvas = document.getElementById('celestial-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let stars = [];
  let shootingStars = [];

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    generateStars();
  };

  const generateStars = () => {
    stars = [];
    const count = Math.floor((width * height) / 3800);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.4 + 0.3,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.8 ? '#FFD778' : (Math.random() > 0.6 ? '#A7E8F5' : '#FFF5E8')
      });
    }
  };

  const spawnShootingStar = () => {
    shootingStars.push({
      x: Math.random() * width * 0.8 + width * 0.1,
      y: Math.random() * height * 0.4,
      length: Math.random() * 80 + 50,
      speed: Math.random() * 8 + 6,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
      opacity: 1
    });

    // Next shooting star in 4 to 9 seconds
    setTimeout(spawnShootingStar, Math.random() * 5000 + 4000);
  };

  window.addEventListener('resize', resize);
  resize();
  setTimeout(spawnShootingStar, 2500);

  const loop = () => {
    ctx.clearRect(0, 0, width, height);

    // Render twinkling stars
    const time = performance.now() * 0.001;
    stars.forEach(star => {
      const alpha = star.alpha + Math.sin(time * 3 + star.twinklePhase) * 0.3;
      ctx.fillStyle = star.color;
      ctx.globalAlpha = Math.max(0.1, Math.min(1, alpha));
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Render shooting stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const s = shootingStars[i];
      ctx.strokeStyle = '#FFD778';
      ctx.lineWidth = 2;
      ctx.globalAlpha = s.opacity;

      const tailX = s.x - Math.cos(s.angle) * s.length;
      const tailY = s.y - Math.sin(s.angle) * s.length;

      const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, '#FFF5E8');
      ctx.strokeStyle = grad;

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();

      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.opacity -= 0.015;

      if (s.opacity <= 0) {
        shootingStars.splice(i, 1);
      }
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
}

/* --------------------------------------------------------------------------
   SECTION C: MEET JUNO DIALOGUE CONSOLE
   -------------------------------------------------------------------------- */
function bindMeetJunoDialogue() {
  const promptBtns = document.querySelectorAll('.dialogue-prompt-btn');
  const speechBox = document.getElementById('meet-juno-speech-text');

  const responses = {
    'past': {
      text: "I slept inside the golden lamp for a long time, dreaming of stars until a wish woke me up!",
      expression: 'happy'
    },
    'place': {
      text: "The Moonlit Garden! I love the quiet ponds and glowing flowers.",
      expression: 'curious'
    },
    'wish': {
      text: "Wishes never really disappear! They wait in the sky like little stars until someone remembers them.",
      expression: 'wonder'
    },
    'magic': {
      text: "Watch this! Look at all these golden sparkles!",
      expression: 'happy'
    }
  };

  promptBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-dialogue');
      const item = responses[key];
      if (!item) return;

      if (speechBox) {
        speechBox.textContent = `"${item.text}"`;
      }

      if (window.meetJunoInstance) {
        window.meetJunoInstance.setExpression(item.expression);
        window.meetJunoInstance.say(item.text, 4500);
      }

      if (window.junoAudio) window.junoAudio.playChime(784);
    });
  });
}

/* --------------------------------------------------------------------------
   HEADER SCROLL & MOBILE MENU
   -------------------------------------------------------------------------- */
function bindHeaderScroll() {
  const header = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  }
}
