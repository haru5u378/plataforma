const player = document.getElementById("player");
const platforms = Array.from(document.getElementsByClassName("platform"));
const coins = Array.from(document.getElementsByClassName("coin"));
const levelDisplay = document.getElementById("level");
let level = 1;
let isJumping = false;
let velocity = 0;
let gravity = 1;
let jumpSpeed = 15;
let moveSpeed = 5;

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && !isJumping) {
        isJumping = true;
        velocity = -jumpSpeed;
    }
    if (event.key === "ArrowLeft") {
        movePlayer(-moveSpeed);
    }
    if (event.key === "ArrowRight") {
        movePlayer(moveSpeed);
    }
});

function movePlayer(speed) {
    let newLeft = parseInt(player.style.left || "50px") + speed;
    if (newLeft >= 0 && newLeft <= window.innerWidth - player.offsetWidth) {
        player.style.left = newLeft + "px";
    }
}

function applyGravity() {
    const playerBottom = parseInt(player.style.top) + player.offsetHeight;

    let onGround = playerBottom >= window.innerHeight - 100;
    let onPlatform = platforms.some(platform => {
        const platformRect = platform.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();
        const isAbovePlatform = playerRect.bottom <= platformRect.top + 10;
        const isWithinPlatform = playerRect.right > platformRect.left && playerRect.left < platformRect.right;
        return isAbovePlatform && isWithinPlatform;
    });

    if (onGround || onPlatform) {
        isJumping = false;
        velocity = 0;

        if (onPlatform) {
            const platform = platforms.find(plt => isCollision(player, plt));
            if (platform) {
                player.style.top = platform.getBoundingClientRect().top - player.offsetHeight + "px";
            }
        } else {
            player.style.top = window.innerHeight - 100 - player.offsetHeight + "px";
        }
    } else {
        isJumping = true;
        velocity += gravity;
        let newTop = (parseInt(player.style.top) || window.innerHeight - 100) + velocity;
        player.style.top = newTop + "px";
    }
}

function isCollision(rect1, rect2) {
    const r1 = rect1.getBoundingClientRect();
    const r2 = rect2.getBoundingClientRect();
    return (
        r1.left < r2.right &&
        r1.right > r2.left &&
        r1.top < r2.bottom &&
        r1.bottom > r2.top
    );
}

function checkCoinCollection() {
    coins.forEach((coin, index) => {
        if (isCollision(player, coin)) {
            coin.remove();
            coins.splice(index, 1);

            if (coins.length === 0) {
                nextLevel();
            }
        }
    });
}

function nextLevel() {
    level++;
    levelDisplay.textContent = `Nível: ${level}`;
    player.style.left = "50px";
    player.style.top = `${window.innerHeight - 150}px`;
    generateNewLevel();
}

function generateNewLevel() {
    platforms.forEach(platform => platform.remove());
    coins.forEach(coin => coin.remove());
    platforms.length = 0;
    coins.length = 0;

    for (let i = 0; i < 3; i++) {
        const platform = document.createElement("div");
        platform.classList.add("platform");
        platform.style.left = `${Math.random() * (window.innerWidth - 100)}px`;
        platform.style.top = `${200 + Math.random() * 300}px`;
        document.getElementById("game-area").appendChild(platform);
        platforms.push(platform);
    }

    for (let i = 0; i < 3; i++) {
        const coin = document.createElement("div");
        coin.classList.add("coin");
        coin.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
        coin.style.top = `${Math.random() * (window.innerHeight - 200)}px`;
        document.getElementById("game-area").appendChild(coin);
        coins.push(coin);
    }
}

setInterval(() => {
    applyGravity();
    checkCoinCollection();
}, 20);
