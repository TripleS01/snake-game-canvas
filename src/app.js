
const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'));

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const H_SIZE = 30;
const V_SIZE = 30;
const GRID_SIZE = WIDTH / H_SIZE;

const APPLE = {
    x: 5,
    y: 5,
};
const SNAKE = {
    x: 10,
    y: 10,
};
const TAIL = [];
const SPEED = {
    x: 1,
    y: 0,
};
const WANTED_SPEED = {
    x: 1,
    y: 0,
};

let size = 3;
let timer = 0;

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (SPEED.y == 0) {
                WANTED_SPEED.y = -1;
                WANTED_SPEED.x = 0;
            }
            break;
        case 'ArrowDown':
            if (SPEED.y == 0) {
                WANTED_SPEED.y = 1;
                WANTED_SPEED.x = 0;
            }
            break;
        case 'ArrowLeft':
            if (SPEED.x == 0) {
                WANTED_SPEED.y = 0;
                WANTED_SPEED.x = -1;
            }
            break;
        case 'ArrowRight':
            if (SPEED.x == 0) {
                WANTED_SPEED.y = 0;
                WANTED_SPEED.x = 1;
            }
            break;
    }
})

function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function drawGrid() {
    ctx.strokeStyle = '#999999';
    ctx.beginPath();

    for (let x = 1; x < H_SIZE; x++) {
        ctx.moveTo(x * GRID_SIZE, 0);
        ctx.lineTo(x * GRID_SIZE, HEIGHT);
    }
    for (let y = 1; y < V_SIZE; y++) {
        ctx.moveTo(0, y * GRID_SIZE);
        ctx.lineTo(WIDTH, y * GRID_SIZE);
    }

    ctx.closePath();
    ctx.stroke();
}

function rect(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * GRID_SIZE + 2, y * GRID_SIZE + 2, GRID_SIZE - 4, GRID_SIZE - 4);
}

function drawApple() {
    APPLE.x = Math.floor(Math.random() * H_SIZE);
    APPLE.y = Math.floor(Math.random() * V_SIZE);

    for (let segment of TAIL) {
        if (segment.x == APPLE.x && segment.y == APPLE.y) {
            drawApple();
        }
    }
}

function tick() {
    TAIL.push({
        x: SNAKE.x,
        y: SNAKE.y
    });
    while (TAIL.length > size) {
        TAIL.shift();
    }

    SPEED.x = WANTED_SPEED.x;
    SPEED.y = WANTED_SPEED.y;

    SNAKE.x += SPEED.x;
    SNAKE.y += SPEED.y;

    if (SNAKE.x == -1) {
        SNAKE.x = H_SIZE - 1;
    }
    if (SNAKE.x == H_SIZE) {
        SNAKE.x = 0;
    }
    if (SNAKE.y == V_SIZE) {
        SNAKE.y = 0;
    }
    if (SNAKE.y == -1) {
        SNAKE.y = V_SIZE - 1;
    }

    for (let segment of TAIL) {
        if (segment.x == SNAKE.x && segment.y == SNAKE.y) {
            gameOver();
        }
    }

    if (SNAKE.x == APPLE.x && SNAKE.y == APPLE.y) {
        size++;
        drawApple();
    }
}

function drawScene() {
    clear();
    drawGrid();
    rect(SNAKE.x, SNAKE.y, 'orange');
    for (let segment of TAIL) {
        rect(segment.x, segment.y, 'green');
    }
    rect(APPLE.x, APPLE.y, 'red');

}

function main() {
    tick();
    drawScene();
}

function gameOver() {
    clearInterval(timer);
    const choice = confirm(`Game over!\nYour score: ${(size - 3) * 100}\n\nPlay again?`);

    if (choice == true) {
        onStart();
    }
}

function onStart() {
    SNAKE.x = 10;
    SNAKE.y = 10;
    TAIL.length = 0;
    size = 3;
    SPEED.x = 1;
    SPEED.y = 0;
    WANTED_SPEED.x = 1;
    WANTED_SPEED.y = 0;

    drawApple();
    timer = setInterval(main, 100);
}
onStart();