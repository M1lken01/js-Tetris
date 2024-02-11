const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const bg = '#111';
const rectSize = 30;
const rectPad = 2;

function drawPiece(piece) {
  for (let i = 0; i < piece.shape.length; i++) {
    drawRect({
      x: piece.position[0] + piece.shape[i][0],
      y: piece.position[1] + piece.shape[i][1],
      color: piece.color,
    });
  }
}

function drawRect(rect) {
  ctx.fillStyle = '#000';
  ctx.fillRect(rectSize * rect.x, rectSize * rect.y, rectSize, rectSize);
  ctx.fillStyle = rect.color;
  ctx.fillRect(rectSize * rect.x + rectPad, rectSize * rect.y + rectPad, rectSize - rectPad * 2, rectSize - rectPad * 2);
}

function drawGrid() {
  ctx.strokeStyle = '#ddd'; // Grid line color
  ctx.lineWidth = 1;

  for (let i = 0; i < rows; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * rectSize);
    ctx.lineTo(canvas.width, i * rectSize);
    ctx.stroke();
  }

  for (let j = 0; j < cols; j++) {
    ctx.beginPath();
    ctx.moveTo(j * rectSize, 0);
    ctx.lineTo(j * rectSize, canvas.height);
    ctx.stroke();
  }
}

function drawStatic() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const color = board[i][j].color;
      if (color) {
        drawRect({ x: j, y: i, color });
      }
    }
  }
}

function drawGame() {
  //ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // draw rects from the game manager
  drawGrid();
  drawStatic();
  drawPiece(currentPiece);
}

function render() {
  canvas.width = cols * rectSize;
  canvas.height = rows * rectSize;
  drawGame();
}
