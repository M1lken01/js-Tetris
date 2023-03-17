document.addEventListener("keydown", onKeyDown);

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const width = window.innerWidth;
const height = width * 2;
//canvas.width = width;
//canvas.height = height;
canvas.width = 400
canvas.height = 800

const rectSize = 40;
const rectX = canvas.width / 2 - rectSize / 2;
const rectY = canvas.height / 2 - rectSize / 2;

const cols = 9; // 10 on release im jus dum
const rows = 19; // 20 on release im jus dum
const xEdge = Math.floor(cols / 2);
const yEdge = Math.floor(rows / 2);

const controls = {
    'left': 'a',
    'right': 'd',
    'down': 's',
    'rotate': 'w',
    'quick': 'space',
    'pause': 'p',
};
const directions = {
    'left': [-1, +0],
    'right': [+1, +0],
    'down': [+0, +1],
    'none': [+0, +0],
}
const shapes = [{
        'name': 'Cube',
        'color': 'yellow',
        'shape': [
            [+0, +0],
            [+0, -1],
            [+1, -1],
            [+1, +0],
        ]
    },
    {
        'name': 'L',
        'color': 'blue',
        'shape': [
            [+0, +0],
            [+1, +0],
            [+0, -1],
            [+0, -2],
        ]
    },
    {
        'name': 'L reverse',
        'color': 'orange',
        'shape': [
            [+0, +0],
            [-1, +0],
            [+0, -1],
            [+0, -2],
        ]
    },
    {
        'name': 'I',
        'color': 'teal',
        'shape': [
            [+0, +0],
            [+0, +1],
            [+0, -1],
            [+0, -2],
        ]
    },
    {
        'name': 'Castle',
        'color': 'purple',
        'shape': [
            [+0, +0],
            [+0, -1],
            [-1, +0],
            [+1, +0],
        ]
    },
    {
        'name': 'Z',
        'color': 'red',
        'shape': [
            [+0, +0],
            [+0, -1],
            [-1, -1],
            [+1, +0],
        ]
    },
    {
        'name': 'Z reverse',
        'color': 'lime',
        'shape': [
            [+0, +0],
            [+0, -1],
            [+1, -1],
            [-1, +0],
        ]
    },
];
let paused = false;
let game = {
    'score': 0,
    'shape': {},
    'moving': [+0, -7], // [x, y]
    'stable': Array.from({
        length: rows
    }, () => Array.from({
        length: cols
    }, () => 0)),
    'colormap': Array.from({
        length: rows
    }, () => Array.from({
        length: cols
    }, () => 0)),
};

function onKeyDown(event) {
    if (!paused) {
        if (event.key == controls.left || event.key == controls.right || event.key == controls.down) {
            move(directions[Object.keys(controls).find(key => controls[key] === event.key)]);
        }
        if (event.key == controls.rotate) {
            move(directions.none, true);
        }
        if (event.key == controls.pause) {
            pause();
        }
    }
}

function move(direction = [0, 0], rotate = false) {
    console.log(game.moving);
    drawGame();
    /*if (game.moving[0] + direction[0] <= 4 && game.moving[0] + direction[0] >= -4) {
        game.moving[0] += direction[0];
    }
    if (game.moving[1] + direction[1] <= 9 && game.stable[getHeight(game.moving[1] + direction[1])][game.moving[0] + 4] == 0) {
        game.moving[1] += direction[1];
    } else {
        stabilize();
    }*/
    const oldShape = game.shape.shape;
    if (rotate) {
        const rotatedShape = [];
        for (let i = 0; i < game.shape.shape.length; i++) {
            const x = game.shape.shape[i][0];
            const y = game.shape.shape[i][1];
            rotatedShape.push([-y, x]);
        }
        game.shape.shape = rotatedShape;
    }
    let xCanMove = true;
    let yCanMove = true;
    for (let i = 0; i < game.shape.shape.length; i++) {
        let col = willCollide(game.moving[0] + game.shape.shape[i][0], game.moving[1] + game.shape.shape[i][1], game.moving[0] + game.shape.shape[i][0] + direction[0], game.moving[1] + game.shape.shape[i][1] + direction[1]);
        if (col[0] != 0) {
            //game.moving[0] += direction[0];
            xCanMove = false
        }
        if (col[1] != 0) {
            //game.moving[1] += direction[1];
            yCanMove = false
        }
        if (col[1] == 1) {
            if (!rotate) {
                stabilize();
            } else {
                game.shape.shape = oldShape;
            }
            break;
        }
    }
    if (xCanMove) {
        game.moving[0] += direction[0];
    }
    if (yCanMove) {
        game.moving[1] += direction[1];
    }
    for (let i = 0; i < game.shape.shape.length; i++) {
        drawBlock(game.moving[0] + game.shape.shape[i][0], game.moving[1] + game.shape.shape[i][1], game.shape.color);
    }
    cleanCheck();
}

function willCollide(x, y, xOff, yOff) {
    r = [1, 1];
    if (-xEdge <= xOff && xOff <= xEdge && game.stable[getHeight(y)][xOff + xEdge] == 0)
        r[0] = 0;
    if (yOff <= yEdge && game.stable[getHeight(yOff)][x + xEdge] == 0)
        r[1] = 0;
    return r;
}

function cleanCheck() {
    for (let i = 0; i < game.stable.length; i++) {
        if (game.stable[i].reduce((total, current) => total + current, 0) == yEdge) {
            game.stable = game.stable.slice(0, i).concat(game.stable.slice(i + 1));
            game.stable.push([0, 0, 0, 0, 0, 0, 0, 0, 0]);
            updateScore();
        }
    }
    if (game.stable[16].reduce((total, current) => total + current, 0) > 0) {
        pause();
    }
}

function stabilize() {
    for (let i = 0; i < game.shape.shape.length; i++) {
        game.stable[getHeight(game.moving[1] + game.shape.shape[i][1])][game.moving[0] + xEdge + game.shape.shape[i][0]] = 1;
        game.colormap[getHeight(game.moving[1] + game.shape.shape[i][1])][game.moving[0] + xEdge + game.shape.shape[i][0]] = game.shape.color;
    }
    game.moving = [0, -5];
    game.shape = getShape();
}

function getShape() {
    return shapes[Math.floor(Math.random() * shapes.length)];
}

function getHeight(x) {
    return game.stable.length - 1 - (x + yEdge);
}

function drawBlock(x, y, color = 'blue') {
    ctx.fillStyle = color;
    ctx.fillRect(rectX + (rectSize * x), rectY + (rectSize * y), rectSize, rectSize); // food
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "darkgray";
    ctx.fillRect(rectX + 200, rectY + 400, rectSize, rectSize); // corner
    ctx.fillRect(rectX - 200, rectY + 400, canvas.width, rectSize); // side
    ctx.fillRect(rectX - 200, rectY - 400, canvas.width, rectSize); // side
    ctx.fillRect(rectX + 200, rectY - 400, rectSize, canvas.height); // side
    ctx.fillRect(rectX - 200, rectY - 400, rectSize, canvas.height); // side
    for (let i = 0; i < game.stable.length; i++) {
        for (let j = 0; j < game.stable[i].length; j++) {
            if (game.stable[i][j]) {
                drawBlock(j - xEdge, getHeight(i), game.colormap[i][j]);
            }
        }
    }
}

function updateScore(value = 1) {
    game.score += value;
    document.querySelector('#score').innerHTML = 'Score: ' + game.score;
}

function gameLoop() {
    if (!paused)
        move(directions.down)
    setTimeout(gameLoop, 500);
}

function pause() {
    paused = !paused;
}

function init() {
    game.shape = getShape();
    drawGame();
    gameLoop();
}

init();