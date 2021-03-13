// Cannon
class Cannon {
  constructor(gameWidth, gameHeight) {
    this.width = 150.0;
    this.height = 50.0;
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.pipeLength = 100;
    this.pipeAngle = Math.PI * 1.5;
    this.gameOver = false;

    this.points = 0;

    this.position = {
      x: 0,
      y: this.gameHeight - this.height
    }

    this.speed = {
      x: 0,
      y: 0
    }

    this.maxSpeed = 6;
  }

  moveLeft() {
    if (!this.gameOver)
      this.speed.x = - this.maxSpeed;
  }

  moveRight() {
    if (!this.gameOver)
      this.speed.x = this.maxSpeed;
  }

  moveUp() {
    if (!this.gameOver)
      if (this.pipeAngle > Math.PI)
        this.pipeAngle -= 0.1;
  }

  moveDown() {
    if (!this.gameOver)
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
    if (this.position.x > this.gameWidth - this.width) {
      this.position.x = this.gameWidth - this.width;
      this.speed.x = 0;
    }
    if (this.position.y < 0) {
      this.position.y = 0;
    }
    if (this.position.y > this.gameHeight - this.height) {
      this.position.y = this.gameHeight - this.height
    }
  }
}

// Cannonball
class Cannonball {
  constructor(gameWidth, gameHeight, character) {
    this.radius = 5.0;
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.character = character;
    this.launched = false;

    this.position = {
      x: this.character.position.x + (this.character.width / 2),
      y: this.character.position.y
    }

    this.speed = {
      x: this.character.speed.x,
      y: this.character.speed.y,
    }
  }

  launch() {
    this.launched = true;
    this.speed = {
      x: 0.3 * this.character.pipeLength * Math.cos(this.character.pipeAngle),
      y: 0.3 * this.character.pipeLength * Math.sin(this.character.pipeAngle)
    }
    console.log(this.speed)
  }

  draw(ctx) {
    ctx.beginPath();
    Math.abs(this.character.position.x - this.position.x < 50)
      && Math.abs(this.character.position.y - this.position.y < 50) ? ctx.fillStyle = 'green'
      : ctx.fillStyle = 'red'
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  update(dt) {
    if (!dt) return;
    if (!this.launched) {
      this.speed = this.character.speed;
    }
    if (this.position.x > this.gameWidth || this.position.x < 0
      || this.position.y < 0 || this.position.y > this.gameHeight) {
      this.position = {
        x: this.character.position.x + (this.character.width / 2),
        y: this.character.position.y
      }
      this.speed = this.character.speed;
    }

    this.position.x += this.speed.x;
    this.position.y += this.speed.y;
  }
}

class Ball {
  constructor(gameWidth, gameHeight, character, cannonball) {
    this.radius = 50.0;
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.character = character;
    this.cannonball = cannonball;

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
    if (this.character.gameOver) return;
    ctx.beginPath();
    if (Math.abs(this.position.x - this.cannonball.position.x) < this.radius + this.cannonball.radius
      && Math.abs(this.position.y - this.cannonball.position.y) < this.radius + this.cannonball.radius) {
      ctx.fillStyle = 'blue';
      this.position = {
        x: Math.random() * this.gameWidth,
        y: 50
      }
      this.character.points += 1;
    }
    else if (Math.abs((this.character.position.x + this.character.width / 2) - this.position.x) < 50
      && Math.abs(this.character.position.y - this.position.y) < 50) {
      ctx.fillStyle = 'red';
    }

    else ctx.fillStyle = 'green';

    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  update(dt) {
    if (!dt) return;
    if (Math.abs((this.character.position.x + this.character.width / 2) - this.position.x) < this.radius + 50
      && Math.abs(this.character.position.y - this.position.y) < this.radius + 50) {
      this.character.gameOver = true;
    }
    if (this.character.points < 100) {
      this.position.x += this.speed.x;
      this.position.y += this.speed.y;
    } else {
      this.position.x = 1000;
      this.position.y = 1000;
    }
    if (this.position.x < this.radius) {
      this.speed.x = - this.speed.x;
    }
    if (this.position.x > this.gameWidth - this.radius) {
      this.speed.x = - this.speed.x;

    }
    if (this.position.y < this.radius) {
      this.speed.y = - this.speed.y

    }
    if (this.position.y > this.gameHeight - this.radius) {
      this.speed.y = - this.speed.y;
      this.speed.x = this.speed.x;
    }
  }
}


// Input handler for keyboard events
class InputHandler {
  constructor(character, cannonball) {
    document.addEventListener("keydown", event => {
      console.log('key', event.key);
      switch (event.key) {
        case 'ArrowLeft':
          character.moveLeft();
          break;
        case 'ArrowRight':
          character.moveRight();
          break;
        case 'ArrowUp':
          character.moveUp();
          break;
        case 'ArrowDown':
          character.moveDown();
          break;
        case 'z':
          cannonball.launch();
          break;
      }
    });

    document.addEventListener("keyup", event => {
      console.log('key', event.key);
      switch (event.key) {
        case 'ArrowLeft':
          if (character.speed.x < 0)
            character.stopX();
          break;
        case 'ArrowRight':
          if (character.speed.x > 0)
            character.stopX();
          break;
      }
    });
  }
}

let canvas = document.getElementById("gameScreen");

let ctx = canvas.getContext("2d");

const gameWidth = 1000;
const gameHeight = 700;

let cannon = new Cannon(gameWidth, gameHeight);
let cannonball = new Cannonball(gameWidth, gameHeight, cannon);
let ball = new Ball(gameWidth, gameHeight, cannon, cannonball);
let handler = new InputHandler(cannon, cannonball);

// Gameloop 
function gameLoop(timestamp) {
  let lastTime = 0;
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  ctx.clearRect(0, 0, gameWidth, gameHeight);
  cannon.update(deltaTime)
  cannon.draw(ctx);
  cannonball.update(deltaTime)
  cannonball.draw(ctx);
  ball.update(deltaTime)
  ball.draw(ctx);
  ctx.lineWidth = "2";
  ctx.font = "30px Arial";
  ctx.strokeText(`Points: ${cannon.points}`, 10, 50);
  if (cannon.gameOver) {
    ctx.font = "60px Arial";
    ctx.strokeText(`GAME OVER`, 300, 350);
  }
  requestAnimationFrame(gameLoop);
}

gameLoop();
