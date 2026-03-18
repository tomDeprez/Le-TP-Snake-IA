let snake = document.getElementById("snake");
let gameContainer = document.getElementById("game-container");
let lastDirection = 'right';

let addIa = "";

const containerSize = [gameContainer.style.width ? parseInt(gameContainer.style.width) : 0, gameContainer.style.height ? parseInt(gameContainer.style.height) : 0];
const snakeSize = 50;
setInterval(loopGame, 300);
startGame();

function startGame() {
    generateApple();
}

function resetSnake() {
    snake.style.left = "0px";
    snake.style.top = "0px";
    lastDirection = 'right';
}

function resetGame() {
    resetSnake();
    resetApple();
}

function resetApple() {
    const apples = document.getElementsByClassName("apple");
    for (let apple of apples) {
        gameContainer.removeChild(apple);
    }
    generateApple();
}

function loopGame() {
    moveSnake(lastDirection);
    checkEatApple();
    if (collideWithWall()) {
        GameOver();
    }
}

document.addEventListener("keydown", function(event) {
    switch (event.key) {
        case "ArrowLeft":
            saveDirection('left');
            break;
        case "ArrowRight":
            saveDirection('right');
            break;
        case "ArrowUp":
            saveDirection('up');
            break;
        case "ArrowDown":
            saveDirection('down');
            break;
    }
});

function saveDirection(event) {
    lastDirection = event;
}

function moveSnake(event) {

    if (event == 'left') {
        snake.style.left = (parseInt(snake.style.left ? snake.style.left : 0) - snakeSize) + "px";
    } else if (event == 'right') {
        snake.style.left = (parseInt(snake.style.left ? snake.style.left : 0) + snakeSize) + "px";
    } else if (event == 'up') {
        snake.style.top = (parseInt(snake.style.top ? snake.style.top : 0) - snakeSize) + "px";
    } else if (event == 'down') {
        snake.style.top = (parseInt(snake.style.top ? snake.style.top : 0) + snakeSize) + "px";
    }
}


function collideWithWall() {

    const snakeRect = snake.getBoundingClientRect();
    const containerRect = gameContainer.getBoundingClientRect();

    if (snakeRect.left < containerRect.left || snakeRect.right > containerRect.right ||
        snakeRect.top < containerRect.top || snakeRect.bottom > containerRect.bottom) {
        return true;
    }
    return false;
}



function GameOver() {
    alert("Game Over!");
    resetGame();
}

function generateApple() {
    const apple = document.createElement("div");
    apple.classList.add("apple");
    apple.style.left = Math.floor(Math.random() * (containerSize[0] / snakeSize)) * snakeSize + "px";
    apple.style.top = Math.floor(Math.random() * (containerSize[1] / snakeSize)) * snakeSize + "px";
    gameContainer.appendChild(apple);
}

function checkEatApple() {
    const snakeRect = snake.getBoundingClientRect();
    const apples = document.getElementsByClassName("apple");

    for (let apple of apples) {
        const appleRect = apple.getBoundingClientRect();
        if (snakeRect.left < appleRect.right && snakeRect.right > appleRect.left &&
            snakeRect.top < appleRect.bottom && snakeRect.bottom > appleRect.top) {
            gameContainer.removeChild(apple);
            generateApple();
            // Here you would also add code to grow the snake
        }
    }
}