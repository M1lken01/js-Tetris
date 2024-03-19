const canvasGame = document.getElementById('game');
const canvasHold = document.getElementById('hold');
const canvasNext = document.getElementById('next');
const ctx = canvasGame.getContext('2d');
const ctxHold = canvasHold.getContext('2d');
const ctxNext = canvasNext.getContext('2d');

const bg = '#111';
const rectSize = 30;
const rectPad = 2;

function drawPiece(piece, context = ctx) {
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
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 1;

  for (let i = 0; i <= rows; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * rectSize);
    ctx.lineTo(canvasGame.width, i * rectSize);
    ctx.stroke();
  }

  for (let j = 0; j <= cols; j++) {
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
      if (color) drawRect(ctx, { x: j, y: i, color });
    }
  }
}

function drawGame() {
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvasGame.width, canvasGame.height);

  drawGrid();
  drawStatic();
  drawPiece(fastPlace(false));
  drawPiece(currentPiece);
}

function drawHold() {
  ctxHold.fillStyle = bg;
  ctxHold.fillRect(0, 0, canvasHold.width, canvasHold.height);

  if (hold === 0) return;

  let position = [0, 0];
  if (hold.size % 2 != 0) {
    position = [0.5, position[1] + 0.5];
  } else if (hold.size === 2) {
    position = [1, position[1] + 1];
  }
  drawPiece({ ...hold, position }, ctxHold);
}

function drawNext() {
  ctxNext.fillStyle = bg;
  ctxNext.fillRect(0, 0, canvasNext.width, canvasNext.height);

  for (let i = 0; i < nextPieces.length; i++) {
    let position = [0, i * 4];
    if (nextPieces[i].size % 2 != 0) position = [0.5, position[1] + 0.5];
    else if (nextPieces[i].size === 2) position = [1, position[1] + 1];

    drawPiece({ ...nextPieces[i], position }, ctxNext);
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
