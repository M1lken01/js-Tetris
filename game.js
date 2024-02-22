const rows = 20;
const cols = 10;
let paused = 0;
let score = 0;
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
const gameSpeed = 1000;
let currentPiece = { ...piecesData.I, position: [5, 0], rot: 0 };
let nextPieces = Array.from({ length: 4 }, () => getRandomPiece());
let hold = 0;

function move(vector = [0, 0], rotate = 0) {
  //todo: add rotation validity check
  console.log(vector);
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

function validCheck(piece, place) {
  const { position, shape, vectorY } = piece;
  for (let i = 0; i < shape.length; i++) {
    const boardX = position[0] + shape[i][0];
    const boardY = position[1] + shape[i][1];

    const isInBoundsX = board[0][boardX] !== undefined;
    const isInBoundsY = board[boardY] !== undefined;

    if (!isInBoundsY && vectorY > 0) {
      if (place) placePiece();
      return false;
    }
    if (!isInBoundsX || !isInBoundsY) return false;
    const isEmpty = board[boardY][boardX] === 0;
    if (!isEmpty && vectorY > 0) {
      if (place) placePiece();
      return false;
    }
    if (!isEmpty) return false;
  }
  return true;
}

function fastPlace() {
  for (let i = 0; i < rows; i++) {
    if (
      !validCheck(
        {
          position: [currentPiece.position[0], currentPiece.position[1] + i],
          shape: currentPiece.shape,
          vectorY: i,
        },
        false,
      )
    ) {
      console.log(currentPiece.position[1] + i - 1);
      move([0, currentPiece.position[1] + i - 1]);
      placePiece();
      break;
    }
  }
}

function clearLines() {
  const clearedLines = [];
  for (let i = 0; i < rows; i++) {
    if (board[i].every((cell) => cell !== 0)) {
      clearedLines.push(i);
    }
  }
  for (let i = 0; i < clearedLines.length; i++) {
    const clearedRow = clearedLines[i];
    score++;
    document.getElementById('score').innerHTML = 'Score: ' + score;
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

function getRandomPieceName() {
  const pieceKeys = Object.keys(piecesData);
  return pieceKeys[Math.floor(Math.random() * pieceKeys.length)];
}

function newPiece() {
  currentPiece = { ...nextPieces.shift(), position: [5, 0], rot: 0 };
  nextPieces.push(getRandomPiece());
  move();
  drawNext();
}

function holdPiece() {
  const tempPiece = { ...currentPiece };
  if (hold === 0) {
    newPiece();
  } else {
    currentPiece = { ...hold, position: [5, 0], rot: 0 };
  }
  hold = { ...tempPiece };
  move();
  drawHold();
}

/*function update() {
  //move([0, 1]);
}

const gameInterval = setInterval(update, gameSpeed);*/

function init() {
  document.addEventListener('keydown', onKeyDown);
  //game.shape = getShape();
  render();
  update();
}

init();

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
