const rows = 20;
const cols = 10;
let paused = false;
let board = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
const piecesData = {
  I: {
    size: 4,
    shape: [
      [+0, +1],
      [+1, +1],
      [+2, +1],
      [+3, +1],
    ],
    color: 'cyan',
  },
  J: {
    size: 3,
    shape: [
      [+0, +0],
      [+0, +1],
      [+1, +1],
      [+2, +1],
    ],
    color: 'blue',
  },
  L: {
    size: 3,
    shape: [
      [+0, +1],
      [+1, +1],
      [+2, +1],
      [+2, +0],
    ],
    color: 'orange',
  },
  O: {
    size: 2,
    shape: [
      [+0, +0],
      [+0, +1],
      [+1, +0],
      [+1, +1],
    ],
    color: 'yellow',
  },
  S: {
    size: 3,
    shape: [
      [+0, +1],
      [+1, +1],
      [+1, +0],
      [+2, +0],
    ],
    color: 'lime',
  },
  Z: {
    size: 3,
    shape: [
      [+0, +0],
      [+1, +1],
      [+1, +0],
      [+2, +1],
    ],
    color: 'red',
  },
  T: {
    size: 3,
    shape: [
      [+0, +1],
      [+1, +1],
      [+1, +0],
      [+2, +1],
    ],
    color: 'purple',
  },
};
let currentPiece = { ...piecesData.I, position: [5, 0], rot: 0 };

function move(vector = [0, 0], rotate = 0) {
  //todo: add rotation validity check

  if (
    validCheck({
      position: [currentPiece.position[0] + vector[0], currentPiece.position[1] + vector[1]],
      shape: rotate ? rotatePiece(currentPiece) : currentPiece.shape,
      vectorY: vector[1],
    })
  ) {
    currentPiece.shape = rotate ? rotatePiece(currentPiece) : currentPiece.shape;
    currentPiece.position[0] += vector[0];
    currentPiece.position[1] += vector[1];
  }
  drawGame();
}

function move2(vector = [0, 0], rotate = 0) {
  //todo: add rotation validity check
  currentPiece.shape = rotate ? rotatePiece(currentPiece) : currentPiece.shape;

  if (validCheck({ position: [currentPiece.position[0] + vector[0], currentPiece.position[1] + vector[1]], shape: currentPiece.shape, vectorY: vector[1] })) {
    currentPiece.position[0] += vector[0];
    currentPiece.position[1] += vector[1];
  }
  drawGame();
}

const rotatePiece = (piece) => mapToShape(rotateArrayClockwise(shapeToMap(piece)));

function shapeToMap(piece) {
  const map = Array.from({ length: piece.size }, () => Array.from({ length: piece.size }, () => 0));
  for (let i = 0; i < piece.shape.length; i++) {
    map[piece.shape[i][0]][piece.shape[i][1]] = 1;
  }
  return map;
}

function mapToShape(mapArray) {
  const shape = [];
  for (let y = 0; y < mapArray.length; y++) {
    for (let x = 0; x < mapArray[y].length; x++) {
      if (mapArray[x][y] === 1) {
        shape.push([x, y]);
      }
    }
  }
  return shape;
}

function rotateArrayClockwise(arr) {
  const rows = arr.length;
  const columns = arr[0].length;
  const rotatedArray = Array.from({ length: columns }, () => Array.from({ length: rows }));
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      rotatedArray[j][rows - 1 - i] = arr[i][j];
    }
  }
  return rotatedArray;
}

function validCheck(piece) {
  const { position, shape, vectorY } = piece;
  for (let i = 0; i < shape.length; i++) {
    const [px, py] = shape[i];
    const boardX = position[0] + px;
    const boardY = position[1] + py;

    const isInBoundsX = board[0][boardX] !== undefined;
    const isInBoundsY = board[boardY] !== undefined;

    if (!isInBoundsY && vectorY > 0) {
      placePiece();
      return false;
    }
    if (!isInBoundsX || !isInBoundsY) return false;
    const isEmpty = board[boardY][boardX] === 0;
    if (!isEmpty && vectorY > 0) {
      placePiece();
      return false;
    }
    if (!isEmpty) return false;
  }
  return true;
}

function clearLines() {
  const clearedLines = [];

  for (let i = 0; i < rows; i++) {
    if (board[i].every((cell) => cell !== 0)) {
      clearedLines.push(i);
    }
  }
  console.log(clearedLines);

  for (let i = 0; i < clearedLines.length; i++) {
    console.log('clearing ' + i);
    const clearedRow = clearedLines[i];
    board.splice(clearedRow, 1);
    board.unshift(Array(cols).fill(0));
  }

  drawGame();
}

function placePiece() {
  for (let i = 0; i < currentPiece.shape.length; i++) {
    const [px, py] = currentPiece.shape[i];
    const boardX = currentPiece.position[0] + px;
    const boardY = currentPiece.position[1] + py;
    if (boardX >= 0 && boardX < board[0].length && boardY >= 0 && boardY < board.length) {
      board[boardY][boardX] = { color: currentPiece.color };
    }
  }
  clearLines();
  newPiece();
}

function getRandomPiece() {
  const pieceKeys = Object.keys(piecesData);
  return piecesData[pieceKeys[Math.floor(Math.random() * pieceKeys.length)]];
}

function newPiece() {
  currentPiece = { ...getRandomPiece(), position: [5, 0], rot: 0 };
}

function gameLoop() {
  //move(directions.down);
  setTimeout(gameLoop, 500);
}

function init() {
  document.addEventListener('keydown', onKeyDown);
  //game.shape = getShape();
  render();
  gameLoop();
}

init();

drawPiece(currentPiece);
console.log(currentPiece);
move([0, 0], 0);
board[19] = [
  0,
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
];
board[18] = [
  0,
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
];
board[17] = [
  0,
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
];
board[16] = [
  0,
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
];
board[15] = [
  0,
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
  { color: 'red' },
];
