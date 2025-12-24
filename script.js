var titleText = document.getElementById("title");
var messageText = document.getElementById("message");
var startBtn = document.getElementById("startBtn");
var game = document.getElementById("game");
var bird = document.getElementById("bird");
var scoreText = document.getElementById("score");
var startScreen = document.getElementById("startScreen");

var gravity = 0.4;
var jump = -8;
var velocity = 0;
var birdTop = window.innerHeight / 2;

var pipes = [];
var score = 0;
var gameInterval;
var pipeInterval;
var gameRunning = false;

/* Start Game */
function startGame() {
    startScreen.style.display = "none";
    resetGame();
    gameRunning = true;

    gameInterval = setInterval(updateGame, 20);
    createPipe();
    pipeInterval = setInterval(createPipe, 1300);
}
startBtn.addEventListener("click", startGame);

/* Reset */
function resetGame() {
    velocity = 0;
    birdTop = window.innerHeight / 2;
    score = 0;
    scoreText.innerHTML = "0";

    for (var i = 0; i < pipes.length; i++) {
        pipes[i].remove();
    }
    pipes = [];

    titleText.innerHTML = "Flappy Bird";
    messageText.innerHTML = "Press SPACE or CLICK";
    startBtn.innerHTML = "Start";
}

/* Update Loop */
function updateGame() {
    velocity += gravity;
    birdTop += velocity;
    bird.style.top = birdTop + "px";

    if (birdTop <= 0 || birdTop >= window.innerHeight - 30) {
        endGame();
    }

    movePipes();
}

/* Jump */
function flap() {
    if (!gameRunning) return;
    velocity = jump;
}

/* Pipes */
function createPipe() {
    if (!gameRunning) return;

    var gap = 200;
    var topHeight = Math.random() * (window.innerHeight - gap - 200) + 100;

    var topPipe = document.createElement("div");
    topPipe.className = "pipe top";
    topPipe.style.height = topHeight + "px";
    topPipe.style.left = window.innerWidth + "px";

    var bottomPipe = document.createElement("div");
    bottomPipe.className = "pipe bottom";
    bottomPipe.style.height = (window.innerHeight - topHeight - gap) + "px";
    bottomPipe.style.left = window.innerWidth + "px";

    game.appendChild(topPipe);
    game.appendChild(bottomPipe);

    pipes.push(topPipe);
    pipes.push(bottomPipe);
}

/* Move Pipes */
function movePipes() {
    for (var i = 0; i < pipes.length; i++) {
        var pipe = pipes[i];
        var left = parseInt(pipe.style.left);
        pipe.style.left = (left - 4) + "px";

        if (left < -80) {
            pipe.remove();
            pipes.splice(i, 1);
            i--;
            continue;
        }

        checkCollision(pipe);
    }
}

/* Collision */
function checkCollision(pipe) {
    var birdRect = bird.getBoundingClientRect();
    var pipeRect = pipe.getBoundingClientRect();

    if (
        birdRect.left < pipeRect.right &&
        birdRect.right > pipeRect.left &&
        birdRect.top < pipeRect.bottom &&
        birdRect.bottom > pipeRect.top
    ) {
        endGame();
    }

    if (!pipe.scored && pipe.classList.contains("top") && pipeRect.right < birdRect.left) {
        score++;
        scoreText.innerHTML = score;
        pipe.scored = true;
    }
}

/* End */
function endGame() {
    clearInterval(gameInterval);
    clearInterval(pipeInterval);
    gameRunning = false;

    // Remove all pipes immediately
    for (var i = 0; i < pipes.length; i++) {
        pipes[i].remove();
    }
    pipes = [];

    // Show Game Over UI
    titleText.innerHTML = "Game Over";
    messageText.innerHTML = "Score: " + score;
    startBtn.innerHTML = "Restart";

    startScreen.style.display = "flex";
}

/* Controls */
document.addEventListener("keydown", function (e) {
    if (e.code === "Space") flap();
});
document.addEventListener("click", flap);
document.addEventListener("touchstart", flap);
