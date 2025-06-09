const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 16;
const PLAYER_X = 20;
const AI_X = canvas.width - PADDLE_WIDTH - 20;
const PADDLE_SPEED = 6;
const BALL_SPEED = 6;

// Game state
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballVX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballVY = BALL_SPEED * (Math.random() * 2 - 1);

function resetBall() {
  ballX = canvas.width / 2 - BALL_SIZE / 2;
  ballY = canvas.height / 2 - BALL_SIZE / 2;
  ballVX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
  ballVY = BALL_SPEED * (Math.random() * 2 - 1);
}

// Mouse control for player paddle
canvas.addEventListener('mousemove', function (evt) {
  const rect = canvas.getBoundingClientRect();
  const mouseY = evt.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  // Clamp within canvas
  if (playerY < 0) playerY = 0;
  if (playerY + PADDLE_HEIGHT > canvas.height) playerY = canvas.height - PADDLE_HEIGHT;
});

// AI paddle movement
function updateAI() {
  // Simple AI: move towards the ball with some delay
  const center = aiY + PADDLE_HEIGHT / 2;
  if (center < ballY + BALL_SIZE / 2 - 10) {
    aiY += PADDLE_SPEED * 0.7;
  } else if (center > ballY + BALL_SIZE / 2 + 10) {
    aiY -= PADDLE_SPEED * 0.7;
  }
  // Clamp
  if (aiY < 0) aiY = 0;
  if (aiY + PADDLE_HEIGHT > canvas.height) aiY = canvas.height - PADDLE_HEIGHT;
}

// Collision detection
function collidePaddle(paddleX, paddleY) {
  return (
    ballX < paddleX + PADDLE_WIDTH &&
    ballX + BALL_SIZE > paddleX &&
    ballY < paddleY + PADDLE_HEIGHT &&
    ballY + BALL_SIZE > paddleY
  );
}

// Main game loop
function gameLoop() {
  // Move ball
  ballX += ballVX;
  ballY += ballVY;

  // Ball collision with top and bottom walls
  if (ballY <= 0 || ballY + BALL_SIZE >= canvas.height) {
    ballVY = -ballVY;
  }

  // Ball collision with player paddle
  if (collidePaddle(PLAYER_X, playerY)) {
    ballVX = Math.abs(ballVX);
    // Add some variation to ball angle based on hit position
    const hitPos = (ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
    ballVY += hitPos * 0.15;
  }

  // Ball collision with AI paddle
  if (collidePaddle(AI_X, aiY)) {
    ballVX = -Math.abs(ballVX);
    // Add some variation to ball angle based on hit position
    const hitPos = (ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
    ballVY += hitPos * 0.15;
  }

  // Ball out of bounds (score)
  if (ballX < 0 || ballX > canvas.width) {
    resetBall();
  }

  // Update AI paddle
  updateAI();

  // Draw everything
  draw();

  // Next frame
  requestAnimationFrame(gameLoop);
}

// Drawing
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw center line
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 15]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw player paddle
  ctx.fillStyle = "#4CAF50";
  ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Draw AI paddle
  ctx.fillStyle = "#F44336";
  ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Draw ball
  ctx.fillStyle = "#fff";
  ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);
}

// Start the game
gameLoop();
