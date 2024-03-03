const rows = 20;
const cols = 10;
let ended = 0;
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
let usedHold = 0;
let currentPiece = { ...getRandomPiece(), position: [3, 0] };
let nextPieces = Array.from({ length: 4 }, () => getRandomPiece());
let hold = 0;

function move(vector = [0, 0], rotate = 0, place = true) {
  if (ended || paused) return;

  const newPosition = [currentPiece.position[0] + vector[0], currentPiece.position[1] + vector[1]];
  const newShape = rotate ? rotatePiece(currentPiece) : currentPiece.shape;
  const offsetLimit = Math.floor(currentPiece.size / 2);

  let closestOffset = Infinity;
  let rotatedValidPosition = null;

  if (rotate && currentPiece.size > 2) {
    for (let offset = -offsetLimit; offset <= offsetLimit; offset++) {
      const rotatedPosition = [newPosition[0] + offset, newPosition[1]];
      if (validCheck({ position: rotatedPosition, shape: newShape, vectorY: vector[1] }, false)) {
        const currentOffset = Math.abs(offset);
        if (currentOffset < closestOffset) {
          closestOffset = currentOffset;
          rotatedValidPosition = rotatedPosition;
        }
      }
    }
  }

  const finalPosition = rotatedValidPosition || newPosition;

  if (validCheck({ position: finalPosition, shape: newShape, vectorY: vector[1] }, place)) {
    currentPiece.shape = newShape;
    currentPiece.position = finalPosition;
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
      if (mapArray[x][y] === 1) shape.push([x, y]);
    }
  }
  return shape;
}

function rotateArrayClockwise(arr) {
  const rows = arr.length;
  const cols = arr[0].length;
  const rotatedArray = Array.from({ length: cols }, () => Array.from({ length: rows }));
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      rotatedArray[j][rows - 1 - i] = arr[i][j];
    }
  }
  return rotatedArray;
}

function validCheck(piece, place = false) {
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

function fastPlace(place = true) {
  for (let i = 0; i < rows; i++) {
    if (
      !validCheck({
        position: [currentPiece.position[0], currentPiece.position[1] + i],
        shape: currentPiece.shape,
        vectorY: i,
      })
    ) {
      if (place) {
        move([0, i - 1]);
        placePiece();
      }
      const ghost = {
        ...currentPiece,
        position: [currentPiece.position[0], currentPiece.position[1] + i - 1],
        color: 'gray',
      };
      return ghost;
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
  console.log(clearedLines);

  for (let i = 0; i < clearedLines.length; i++) {
    console.log('clearing ' + i);
    const clearedRow = clearedLines[i];
    score++;
    document.getElementById('score').innerHTML = score;
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
  usedHold = 0;
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
  currentPiece = { ...nextPieces.shift(), position: [3, 0] };
  nextPieces.push(getRandomPiece());
  if (!validCheck(currentPiece, false)) return end();
  move();
  drawNext();
}

function holdPiece() {
  if (usedHold) return;
  usedHold = 1;
  const tempPiece = { ...currentPiece };
  if (hold === 0) newPiece();
  else currentPiece = { ...hold, position: [3, 0] };
  hold = { ...tempPiece };
  move();
  drawHold();
}

function end() {
  if (score > localStorage.getItem('highscore')) {
    localStorage.setItem('highscore', score);
    alert(`New Highscore: ${score}`);
  } else {
    alert(`Game Over\nScore: ${score}`);
  }
  ended = 1;
  clearInterval(gameInterval);
}

function update() {
  move([0, 1]);
}
const gameInterval = setInterval(update, gameSpeed);

function init() {
  document.addEventListener('keydown', onKeyDown);
  render();
  update();
}

init();
