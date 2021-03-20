class Game {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.gameOver = false;
    this.points = 0;
    this.paused = false;
  }

  pause() {
    this.paused = !this.paused;
  }

  start() {
    this.cannon = new Cannon(this);
    this.cannonball = new Cannonball(this);
    this.ball = new Ball(this);
    this.handler = new InputHandler(this);
    this.ball2 = new Ball(this);
  }

  update(deltaTime) {
    this.cannon.update(deltaTime);
    this.cannonball.update(deltaTime);
    this.ball.update(deltaTime);
    this.points > 19 && this.ball2.update(deltaTime);
  }

  draw(ctx) {
    this.cannon.draw(ctx);
    this.cannonball.draw(ctx);
    this.ball.draw(ctx);
    this.points > 19 && this.ball2.draw(ctx);
  }
}

// Cannon
class Cannon {
  constructor(game) {
    this.width = 150.0;
    this.height = 50.0;
    this.pipeLength = 100;
    this.pipeAngle = Math.PI * 1.7;

    this.position = {
      x: 0,
      y: game.gameHeight - this.height
    }

    this.speed = {
      x: 0,
      y: 0
    }

    this.maxSpeed = 6;
  }

  moveLeft() {
    if (!game.gameOver)
      this.speed.x = - this.maxSpeed;
  }

  moveRight() {
    if (!game.gameOver)
      this.speed.x = this.maxSpeed;
  }

  turnPipeLeft() {
    if (!game.gameOver)
      if (this.pipeAngle > Math.PI)
        this.pipeAngle -= 0.1;
  }

  turnPipeRight() {
    if (!game.gameOver)
      if (this.pipeAngle < 2 * Math.PI)
        this.pipeAngle += 0.1;
  }

  stopX() {
    this.speed.x = 0;
  }

  stopY() {
    this.speed.y = 0;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.rect(this.position.x, this.position.y, this.width, this.height);
    ctx.arc(this.position.x + (this.width / 2), this.position.y, 50, Math.PI, Math.PI * 2)
    ctx.lineWidth = "15";
    ctx.moveTo(this.position.x + (this.width / 2), this.position.y);

    // cannon pipe
    ctx.lineTo(this.position.x + (this.width / 2) +
      this.pipeLength * Math.cos(this.pipeAngle),
      this.position.y + this.pipeLength * Math.sin(this.pipeAngle));
    ctx.stroke();
    ctx.fill();
  }

  update(dt) {
    if (!dt) return;
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;

    if (this.position.x < 0) {
      this.position.x = 0;
      this.speed.x = 0;
    }
    if (this.position.x > game.gameWidth - this.width) {
      this.position.x = game.gameWidth - this.width;
      this.speed.x = 0;
    }
    if (this.position.y < 0) {
      this.position.y = 0;
    }
    if (this.position.y > game.gameHeight - this.height) {
      this.position.y = game.gameHeight - this.height
    }
  }
}

// Cannonball
class Cannonball {
  constructor(game) {
    this.radius = 5.0;
    this.launched = false;
    this.position = {
      x: game.cannon.position.x + (game.cannon.width / 2),
      y: game.cannon.position.y
    }

    this.speed = {
      x: game.cannon.speed.x,
      y: game.cannon.speed.y,
    }
  }

  launch() {
    this.speed = {
      x: 60 * Math.cos(game.cannon.pipeAngle),
      y: 60 * Math.sin(game.cannon.pipeAngle)
    }
    this.launched = true;
  }

  draw(ctx) {
    ctx.beginPath();
    Math.abs(game.cannon.position.x - this.position.x < 50)
      && Math.abs(game.cannon.position.y - this.position.y < 50) ? ctx.fillStyle = 'green'
      : ctx.fillStyle = 'red'
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  update(dt) {
    if (!dt) return;
    if (this.position.x > game.gameWidth || this.position.x < 0
      || this.position.y < 0 || this.position.y > game.gameHeight) {
      this.position = {
        x: game.cannon.position.x + (game.cannon.width / 2),
        y: game.cannon.position.y
      }
      this.speed = game.cannon.speed;
    }
    if (!this.launched) {
      this.speed = game.cannon.speed;
    }
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;
  }
}

class Ball {
  constructor(game) {
    this.radius = 50.0;

    this.position = {
      x: 51,
      y: 51
    }

    this.speed = {
      x: 7,
      y: 7,
    }
  }

  draw(ctx) {
    if (game.cannon.gameOver) {
      return;
    }
    ctx.beginPath();
    if (Math.abs((game.cannon.position.x + game.cannon.width / 2) - this.position.x) < 50 + this.radius
      && Math.abs(game.cannon.position.y - this.position.y) < 50 + this.radius) {
      ctx.fillStyle = 'red';
    }

    else ctx.fillStyle = 'green';

    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  update(dt) {
    if (!dt || game.cannon.gameOver) return;
    if (Math.abs((game.cannon.position.x + game.cannon.width / 2) - this.position.x) < this.radius + 50
      && Math.abs(game.cannon.position.y - this.position.y) < this.radius + 50) {
      game.gameOver = true;
    }
    if (Math.abs(this.position.x - game.cannonball.position.x) < this.radius + game.cannonball.radius
      && Math.abs(this.position.y - game.cannonball.position.y) < this.radius + game.cannonball.radius) {
      this.position = {
        x: Math.random() * game.gameWidth,
        y: 50
      }
      game.points += 1;
      if (Math.random() < 0.5) {
        this.speed = {
          x: 7,
          y: 7,
        }
      } else {
        this.speed = {
          x: -7,
          y: 7,
        }
      }
    }

    this.position.x += this.speed.x;
    this.position.y += this.speed.y;

    if (this.position.x < this.radius) {
      this.speed.x = - this.speed.x;
    }
    if (this.position.x > game.gameWidth - this.radius) {
      this.speed.x = - this.speed.x;

    }
    if (this.position.y < this.radius) {
      this.speed.y = - this.speed.y

    }
    if (this.position.y > game.gameHeight - this.radius) {
      this.speed.y = - this.speed.y;
      this.speed.x = this.speed.x;
    }
  }
}

// Input handler for keyboard events
class InputHandler {
  constructor(game) {
    document.addEventListener("keydown", event => {
      switch (event.key) {
        case 'ArrowLeft':
          game.cannon.moveLeft();
          break;
        case 'ArrowRight':
          game.cannon.moveRight();
          break;
        case 'ArrowUp':
          !game.paused && game.cannon.turnPipeLeft();
          break;
        case 'ArrowDown':
          !game.paused && game.cannon.turnPipeRight();
          break;
        case 'z':
          game.cannonball.launch();
          break;
        case 'Escape':
          game.pause();
          break;
      }
    });

    document.addEventListener("keyup", event => {
      switch (event.key) {
        case 'ArrowLeft':
          if (game.cannon.speed.x < 0)
            game.cannon.stopX();
          break;
        case 'ArrowRight':
          if (game.cannon.speed.x > 0)
            game.cannon.stopX();
          break;
      }
    });
  }
}

let canvas = document.getElementById("gameScreen");

let ctx = canvas.getContext("2d");

const gameWidth = 1000;
const gameHeight = 700;

let game = new Game(gameWidth, gameHeight);
game.start();

let lastTime = 0;

// Gameloop 
function gameLoop(timestamp) {
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  ctx.clearRect(0, 0, gameWidth, gameHeight);
  if (!game.paused && !game.gameOver) {
    game.update(deltaTime)
  }
  game.draw(ctx);
  ctx.lineWidth = "2";
  ctx.font = "30px Arial";
  ctx.strokeText(`Points: ${game.points}`, 10, 50);
  if (game.gameOver) {
    ctx.font = "60px Arial";
    ctx.strokeText(`GAME OVER`, 300, 350);
  }
  requestAnimationFrame(gameLoop);
}

gameLoop();
