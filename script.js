const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const rows = 10;
const cols = 13;
const tileSize = 40;

canvas.width = cols * tileSize;
canvas.height = rows * tileSize;

// Load images
const wallImage = new Image();
wallImage.src = "https://imgur.com/2wxq3od.png";

const walkwayImage = new Image();
walkwayImage.src = "https://i.imgur.com/3henhoR.png";

const playerImage = new Image();
playerImage.src = "https://media.tenor.com/uX1jpz5E4lcAAAAj/bmo-bounce.gif"; // Cinnamoroll GIF as the player

const whiteHeartImage = new Image();
whiteHeartImage.src = "https://media.tenor.com/wnVuzMq9fYsAAAAi/love-heart.gif"; // White heart GIF for winning

const blackHeartImage = new Image();
blackHeartImage.src = "https://media.tenor.com/qVJBrbsBk8EAAAAi/pixel-art-gmail.gif"; // Black heart GIF as obstacle

// Maze definition (1 = wall, 0 = walkway)
const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Initial positions
const player = { x: 6, y: 4 };       // Player starting position
const whiteHeartPos = { x: 11, y: 8 }; // White heart position (winning point)
const blackHeartPos = { x: 1, y: 1 };  // Black heart position (obstacle)

let gameStarted = false;

// Variabel untuk kontrol sentuhan
let touchStartX = 0;
let touchStartY = 0;
const swipeThreshold = 30; // Jarak minimum swipe untuk dianggap sebagai gerakan

// Draw the maze function
function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (maze[y][x] === 1) {
                ctx.drawImage(wallImage, x * tileSize, y * tileSize, tileSize, tileSize);
            } else {
                ctx.drawImage(walkwayImage, x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
    }

    // Draw the white heart (winning point)
    ctx.drawImage(whiteHeartImage, whiteHeartPos.x * tileSize, whiteHeartPos.y * tileSize, tileSize, tileSize);

    // Draw the black heart (obstacle)
    ctx.drawImage(blackHeartImage, blackHeartPos.x * tileSize, blackHeartPos.y * tileSize, tileSize, tileSize);

    // Draw the player
    ctx.drawImage(playerImage, player.x * tileSize, player.y * tileSize, tileSize, tileSize);
}

// Move player
function movePlayer(dx, dy) {
    if (!gameStarted) return;

    let newX = player.x + dx;
    let newY = player.y + dy;

    // Check within boundaries and not a wall
    if (
        newX >= 0 &&
        newX < cols &&
        newY >= 0 &&
        newY < rows &&
        maze[newY][newX] === 0
    ) {
        player.x = newX;
        player.y = newY;

        // Win condition
        if (player.x === whiteHeartPos.x && player.y === whiteHeartPos.y) {
            showWinContent();
        }

        // Obstacle condition
        if (player.x === blackHeartPos.x && player.y === blackHeartPos.y) {
            showGameOver();
        }

        drawMaze();
    }
}

// Show win content
function showWinContent() {
    // Redirect to another HTML page (e.g., valentine-success.html)
    window.location.href = "valentine-success.html";
}

// Show game over screen
function showGameOver() {
    document.getElementById("game-over-screen").style.display = "block";
    gameStarted = false;
}

// Start game
function startGame() {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-over-screen").style.display = "none";
    gameStarted = true;
    player.x = 6;
    player.y = 4;
    drawMaze();
}

// Restart game
function restartGame() {
    document.getElementById("game-over-screen").style.display = "none";
    startGame();
}

// Keyboard events (tetap dipertahankan untuk desktop)
window.addEventListener("keydown", function (event) {
    switch (event.key) {
        case "ArrowUp":    movePlayer(0, -1); break;
        case "ArrowDown":  movePlayer(0,  1); break;
        case "ArrowLeft":  movePlayer(-1, 0); break;
        case "ArrowRight": movePlayer(1,  0); break;
    }
});

// Touch events for mobile
canvas.addEventListener("touchstart", function (event) {
    event.preventDefault(); // Mencegah scrolling default
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}, false);

canvas.addEventListener("touchend", function (event) {
    event.preventDefault(); // Mencegah scrolling default
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > swipeThreshold) {
        // Horizontal swipe
        if (dx > 0) {
            movePlayer(1, 0); // Swipe Right
        } else {
            movePlayer(-1, 0); // Swipe Left
        }
    } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > swipeThreshold) {
        // Vertical swipe
        if (dy > 0) {
            movePlayer(0, 1); // Swipe Down
        } else {
            movePlayer(0, -1); // Swipe Up
        }
    }
}, false);


// On images load, draw the maze
wallImage.onload = drawMaze;
walkwayImage.onload = drawMaze;
playerImage.onload = drawMaze;
whiteHeartImage.onload = drawMaze;
blackHeartImage.onload = drawMaze;