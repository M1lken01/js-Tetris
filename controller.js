const controls = {
  left: 'ArrowLeft',
  right: 'ArrowRight',
  down: 'ArrowDown',
  rotate: 'ArrowUp',
  place: ' ',
  hold: 'c',
  hold_alt: 'shift',
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
      case controls.hold.toLowerCase():
      case controls.hold_alt.toLowerCase():
        holdPiece();
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
