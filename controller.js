const controls = {
  left: 'ArrowLeft',
  right: 'ArrowRight',
  down: 'ArrowDown',
  rotate: 'ArrowUp',
  place: ' ',
  pause: 'p',
};

function onKeyDown(event) {
  console.log(event.key);
  const { key } = event;
  if (!paused) {
    vector = [0, 0];
    rotation = 0;
    switch (key.toLowerCase()) {
      case controls.left.toLowerCase():
        vector[0] = -1;
        break;
      case controls.right.toLowerCase():
        vector[0] = +1;
        break;
      case controls.down.toLowerCase():
        vector[1] = +1;
        break;
      case controls.rotate.toLowerCase():
        rotation = 1;
        break;
      case controls.place.toLowerCase():
        fastPlace();
        break;
    }
    move(vector, rotation);
    /*if (event.key == controls.left || event.key == controls.right || event.key == controls.down) {
      move(directions[Object.keys(controls).find((key) => controls[key] === event.key)]);
    }*/
    /*if (event.key == controls.rotate) {
      move(directions.none, true);
    }*/
  }
}

function onKeyDown2(event) {
  console.log(event.key);

  if (!paused) {
    const keyMappings = {
      [controls.left.toLowerCase()]: [-1, 0],
      [controls.right.toLowerCase()]: [1, 0],
      [controls.down.toLowerCase()]: [0, 1],
      [controls.rotate.toLowerCase()]: [0, 0, 1],
    };

    const key = event.key.toLowerCase();
    const vector = keyMappings[key] || [0, 0];

    move(...vector);
  }
}

const KEY_LEFT = 'ArrowLeft';
const KEY_RIGHT = 'ArrowRight';
const KEY_DOWN = 'ArrowDown';
const KEY_ROTATE = 'ArrowUp';

// Flags to track key states
let leftPressed = false;
let rightPressed = false;
let downPressed = false;
let rotatePressed = false;
/*
// Add event listeners for keydown and keyup events
document.addEventListener('keydown', (event) => {
  handleKeyPress(event.key, true);
});

document.addEventListener('keyup', (event) => {
  handleKeyPress(event.key, false);
});*/

// Function to handle key press and release events
function handleKeyPress(key, isPressed) {
  switch (key) {
    case KEY_LEFT:
      leftPressed = isPressed;
      break;
    case KEY_RIGHT:
      rightPressed = isPressed;
      break;
    case KEY_DOWN:
      downPressed = isPressed;
      break;
    case KEY_ROTATE:
      rotatePressed = isPressed;
      break;
  }
}

// Example update function in a game loop
function update() {
  if (leftPressed) {
    console.log('left');
    onKeyDown({ key: 'arrowleft' });
  }
  if (rightPressed) {
    console.log('right');
    // Handle right key
    onKeyDown({ key: 'arrowright' });
  }
  if (downPressed) {
    // Handle down key
    onKeyDown({ key: 'arrowdown' });
    console.log('down');
  }
  if (rotatePressed) {
    onKeyDown({ key: 'arrowup' });
    console.log('rotate');
    // Handle rotate key
  }

  // Other game logic...

  // Request the next animation frame
  requestAnimationFrame(update);
}

// Start the game loop
update();
