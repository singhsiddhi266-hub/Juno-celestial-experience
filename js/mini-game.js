/**
 * CATCH THE FALLING DREAMS (Section K)
 * Playable HTML5 Canvas mini-game where the visitor catches falling starlight
 * and dream orbs while avoiding stormy decoy clouds.
 */

class JunoCatchGame {
  constructor() {
    this.canvas = document.getElementById('dream-catcher-canvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.isPlaying = false;
    this.score = 0;
    this.lives = 3;
    this.highScore = parseInt(localStorage.getItem('juno_game_highscore') || '0', 10);
    this.playerX = 300;
    this.playerWidth = 80;
    this.items = [];
    this.lastSpawn = 0;
    this.animId = null;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.bindControls();
    this.drawStartScreen();
  }

  resize() {
    this.canvas.width = this.canvas.offsetWidth || 600;
    this.canvas.height = this.canvas.offsetHeight || 400;
    this.playerX = this.canvas.width / 2;
  }

  bindControls() {
    const startBtn = document.getElementById('start-game-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startGame());
    }

    // Mouse movement
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.playerX = e.clientX - rect.left;
    });

    // Touch movement
    this.canvas.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      this.playerX = touch.clientX - rect.left;
      e.preventDefault();
    }, { passive: false });

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      if (!this.isPlaying) return;
      if (e.key === 'ArrowLeft' || e.key === 'a') this.playerX -= 25;
      if (e.key === 'ArrowRight' || e.key === 'd') this.playerX += 25;
    });
  }

  drawStartScreen() {
    this.ctx.fillStyle = '#10132F';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#FFD778';
    this.ctx.font = '24px Cinzel Decorative, serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Catch the Falling Dreams', this.canvas.width / 2, this.canvas.height / 2 - 30);

    this.ctx.fillStyle = '#FFF5E8';
    this.ctx.font = '16px Plus Jakarta Sans, sans-serif';
    this.ctx.fillText('Catch falling stars and glowing dream orbs!', this.canvas.width / 2, this.canvas.height / 2 + 10);
    this.ctx.fillStyle = '#A7E8F5';
    this.ctx.font = '14px Plus Jakarta Sans, sans-serif';
    this.ctx.fillText('Dodge rain clouds! ☁️ | Best Score: ' + this.highScore, this.canvas.width / 2, this.canvas.height / 2 + 35);
  }

  startGame() {
    this.isPlaying = true;
    this.score = 0;
    this.lives = 3;
    this.items = [];
    this.lastSpawn = performance.now();

    const startBtn = document.getElementById('start-game-btn');
    if (startBtn) startBtn.style.display = 'none';

    this.loop();
  }

  spawnItem() {
    const types = [
      { type: 'star', char: '⭐', points: 10, speed: 2.8, color: '#FFD778' },
      { type: 'orb', char: '💜', points: 25, speed: 3.2, color: '#B8A5FF' },
      { type: 'gem', char: '💎', points: 50, speed: 3.8, color: '#64D6D0' },
      { type: 'cloud', char: '⛈️', points: -20, speed: 2.2, color: '#94A3B8' }
    ];

    // 25% chance of cloud decoy, 75% positive dreams
    const isCloud = Math.random() < 0.25;
    const selected = isCloud ? types[3] : types[Math.floor(Math.random() * 3)];

    this.items.push({
      x: Math.random() * (this.canvas.width - 60) + 30,
      y: -20,
      ...selected
    });
  }

  loop() {
    if (!this.isPlaying) return;

    const now = performance.now();
    if (now - this.lastSpawn > 800) {
      this.spawnItem();
      this.lastSpawn = now;
    }

    // Update
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw basket/player
    const clampedPlayerX = Math.max(this.playerWidth / 2, Math.min(this.canvas.width - this.playerWidth / 2, this.playerX));
    const playerY = this.canvas.height - 45;

    // Draw magical golden basket
    this.ctx.fillStyle = '#FFD778';
    this.ctx.beginPath();
    this.ctx.roundRect(clampedPlayerX - this.playerWidth / 2, playerY, this.playerWidth, 24, [0, 0, 12, 12]);
    this.ctx.fill();
    this.ctx.strokeStyle = '#FFE599';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Basket rim label
    this.ctx.fillStyle = '#10132F';
    this.ctx.font = '12px Plus Jakarta Sans, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('✨ JUNO', clampedPlayerX, playerY + 16);

    // Update & draw falling items
    for (let i = this.items.length - 1; i >= 0; i--) {
      const it = this.items[i];
      it.y += it.speed;

      this.ctx.font = '24px serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(it.char, it.x, it.y);

      // Collision detection with player basket
      if (it.y >= playerY - 10 && it.y <= playerY + 25) {
        if (Math.abs(it.x - clampedPlayerX) < this.playerWidth / 2 + 10) {
          this.score += it.points;
          if (it.points > 0) {
            if (window.junoAudio) window.junoAudio.playChime(600 + this.score * 4);
          } else {
            this.lives--;
            if (window.junoAudio) window.junoAudio.playChime(300);
          }

          this.items.splice(i, 1);

          // Milestone for Hidden Star #7
          if (this.score >= 100) {
            if (window.junoHiddenStars) {
              window.junoHiddenStars.unlockStar(7, "The Game Star: You scored 100+ points catching dreams!");
            }
          }
          continue;
        }
      }

      // Fallen off screen
      if (it.y > this.canvas.height + 20) {
        this.items.splice(i, 1);
      }
    }

    // Draw HUD
    this.ctx.fillStyle = '#FFF5E8';
    this.ctx.font = '16px Plus Jakarta Sans, sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Score: ${this.score}`, 20, 30);

    this.ctx.textAlign = 'right';
    let hearts = '';
    for (let h = 0; h < this.lives; h++) hearts += '❤️ ';
    this.ctx.fillText(hearts, this.canvas.width - 20, 30);

    if (this.lives <= 0) {
      this.gameOver();
      return;
    }

    this.animId = requestAnimationFrame(() => this.loop());
  }

  gameOver() {
    this.isPlaying = false;
    cancelAnimationFrame(this.animId);

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('juno_game_highscore', this.highScore.toString());
    }

    this.ctx.fillStyle = 'rgba(16, 19, 47, 0.88)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#FFD778';
    this.ctx.font = '28px Cinzel Decorative, serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2 - 25);

    this.ctx.fillStyle = '#FFF5E8';
    this.ctx.font = '18px Plus Jakarta Sans, sans-serif';
    this.ctx.fillText(`Score: ${this.score}  |  Best Score: ${this.highScore}`, this.canvas.width / 2, this.canvas.height / 2 + 15);

    const startBtn = document.getElementById('start-game-btn');
    if (startBtn) {
      startBtn.textContent = '↺ Play Again';
      startBtn.style.display = 'inline-flex';
    }

    if (window.heroJunoInstance) {
      window.heroJunoInstance.setExpression('happy');
      window.heroJunoInstance.say(`Great job! Your score is ${this.score}! ✨`, 3500);
    }
  }
}

window.JunoCatchGame = JunoCatchGame;
