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

let game = {
    'moving': [+0, -9], //  [x, y]
    'stable': [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]
}

function onKeyDown(event) {
    let direction = translateDirection(event.key);
    if (direction != undefined)
        move(direction);
}

function translateDirection(newDir) {
    return {
        'a': [-1, +0],
        's': [+0, +1],
        'd': [+1, +0],
    } [newDir]
}

function move(direction) {
    if (game.moving[0] + direction[0] <= 4 && game.moving[0] + direction[0] >= -4) {
        game.moving[0] += direction[0];
    }
    if (game.moving[1] + direction[1] <= 9) {
        game.moving[1] += direction[1];
    } else {
        //make stable
        game.stable[0][game.moving[0] + 4] = 1;
        game.moving = [0, -9];
    }
    console.log(game.moving)
    drawGame();
    drawBlock(game.moving[0], game.moving[1]);
    let blocks = 0;
    for (let i = 0; i < game.stable[0].length; i++) {
        blocks += game.stable[0][i];
    }
    if (blocks == 9) {
        game.stable[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
}

function drawBlock(x, y) {
    ctx.fillStyle = "blue";
    ctx.fillRect(rectX + (rectSize * x), rectY + (rectSize * y), rectSize, rectSize); // food
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "lime";
    ctx.fillRect(rectX + 200, rectY + 400, rectSize, rectSize); // corner
    ctx.fillRect(rectX - 200, rectY + 400, canvas.width, rectSize); // side
    ctx.fillRect(rectX - 200, rectY - 400, canvas.width, rectSize); // side
    ctx.fillRect(rectX + 200, rectY - 400, rectSize, canvas.height); // side
    ctx.fillRect(rectX - 200, rectY - 400, rectSize, canvas.height); // side
    for (let i = 0; i < game.stable[0].length; i++) {
        if (game.stable[0][i]) {
            drawBlock(i - 4, +9)
        }
    }
}

function gameLoop() {
    move(translateDirection('s'))
    setTimeout(gameLoop, 500);
}

drawGame();
gameLoop();