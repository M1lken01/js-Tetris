const canvasGame = document.getElementById('game');
const canvasHold = document.getElementById('hold');
const canvasNext = document.getElementById('next');
const ctx = canvasGame.getContext('2d');
const ctxHold = canvasHold.getContext('2d');
const ctxNext = canvasNext.getContext('2d');

const bg = '#111';
const rectSize = 30;
const rectPad = 2;

function drawPiece(context, piece) {
  for (let i = 0; i < piece.shape.length; i++) {
    drawRect(context, {
      x: piece.position[0] + piece.shape[i][0],
      y: piece.position[1] + piece.shape[i][1],
      color: piece.color,
    });
  }
}

function drawRect(context, rect) {
  context.fillStyle = '#000';
  context.fillRect(rectSize * rect.x, rectSize * rect.y, rectSize, rectSize);
  context.fillStyle = rect.color;
  context.fillRect(rectSize * rect.x + rectPad, rectSize * rect.y + rectPad, rectSize - rectPad * 2, rectSize - rectPad * 2);
}

function drawGrid() {
  ctx.strokeStyle = '#ddd'; // Grid line color
  ctx.lineWidth = 1;

  for (let i = 0; i < rows; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * rectSize);
    ctx.lineTo(canvasGame.width, i * rectSize);
    ctx.stroke();
  }

  for (let j = 0; j < cols; j++) {
    ctx.beginPath();
    ctx.moveTo(j * rectSize, 0);
    ctx.lineTo(j * rectSize, canvasGame.height);
    ctx.stroke();
  }
}

function drawStatic() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const color = board[i][j].color;
      if (color) {
        drawRect(ctx, { x: j, y: i, color });
      }
    }
  }
}

function drawGame() {
  //ctx.clearRect(0, 0, canvasGame.width, canvasGame.height);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvasGame.width, canvasGame.height);
  // draw rects from the game manager
  drawGrid();
  drawStatic();
  drawPiece(ctx, currentPiece);
}

function drawHold() {
  drawPiece(ctxHold, { ...hold, position: [0, 0] });
}

function drawNext() {
  for (let i = 0; i < nextPieces.length; i++) {
    drawPiece(ctxNext, { ...nextPieces[i], position: [0, i * 4] });
  }
}

function render() {
  canvasGame.width = cols * rectSize;
  canvasGame.height = rows * rectSize;
  canvasHold.width = 4 * rectSize;
  canvasHold.height = 4 * rectSize;
  canvasNext.width = 4 * rectSize;
  canvasNext.height = nextPieces.length * 4 * rectSize;
  drawGame();
  drawNext();
  drawHold();
}
