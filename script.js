let player = document.getElementById("player");
let levelDisplay = document.getElementById("level");
let ground = document.getElementById("ground");
let coins = [];
let platforms = [];
let isJumping = false;
let jumpHeight = 0;
let gravity = 2; // Ajuste da gravidade
let jumpForce = 20;
let score = 0;

let playerSpeed = 5;
let playerSpeedX = 0;
let keyState = {};

let currentLevel = 1;
let gameInterval;

// Atualiza o texto do nível
function updateLevelDisplay() {
    levelDisplay.textContent = `Nível: ${currentLevel}`;
}

// Movimenta o personagem
function movePlayer() {
    if (isKeyPressed("ArrowRight")) {
        playerSpeedX = playerSpeed;
    } else if (isKeyPressed("ArrowLeft")) {
        playerSpeedX = -playerSpeed;
    } else {
        playerSpeedX = 0;
    }

    let newLeft = (parseInt(player.style.left) || 0) + playerSpeedX;

    // Impede que o personagem saia da tela
    if (newLeft >= 0 && newLeft <= window.innerWidth - player.offsetWidth) {
        player.style.left = newLeft + "px";
    }
}

// Pula o personagem
function jump() {
    if (!isJumping) {
        isJumping = true;
        jumpHeight = jumpForce;
    }
}

// Aplica gravidade
function applyGravity() {
    if (isJumping) {
        jumpHeight -= gravity;
        let newTop = (parseInt(player.style.top) || window.innerHeight - 100) - jumpHeight;

        // Verifica se o personagem encosta no chão ou em plataformas
        let onPlatform = platforms.some(platform => isCollision(player, platform));
        if (newTop >= window.innerHeight - 100 - player.offsetHeight || onPlatform) {
            isJumping = false;
            player.style.top = window.innerHeight - 100 - player.offsetHeight + "px";
        } else {
            player.style.top = newTop + "px";
        }
    }
}

// Verifica colisões
function checkCollision() {
    coins.forEach(coin => {
        if (isCollision(player, coin)) {
            score++;
            coin.remove();
            coins = coins.filter(c => c !== coin);
        }
    });
}

// Detecta colisão
function isCollision(player, object) {
    const playerRect = player.getBoundingClientRect();
    const objectRect = object.getBoundingClientRect();

    return !(playerRect.right < objectRect.left ||
             playerRect.left > objectRect.right ||
             playerRect.bottom < objectRect.top ||
             playerRect.top > objectRect.bottom);
}

// Cria um nível com moedas e plataformas
function createLevel(level) {
    coins.forEach(coin => coin.remove());
    platforms.forEach(platform => platform.remove());
    coins = [];
    platforms = [];

    for (let i = 0; i < level * 3; i++) {
        let coin = document.createElement("div");
        coin.classList.add("coin");
        coin.style.top = Math.random() * (window.innerHeight - 200) + "px";
        coin.style.left = Math.random() * (window.innerWidth - 50) + "px";
        document.body.appendChild(coin);
        coins.push(coin);
    }

    for (let i = 0; i < level * 2; i++) {
        let platform = document.createElement("div");
        platform.classList.add("platform");
        platform.style.top = Math.random() * (window.innerHeight - 300) + "px";
        platform.style.left = Math.random() * (window.innerWidth - 100) + "px";
        document.body.appendChild(platform);
        platforms.push(platform);
    }

    updateLevelDisplay();
}

// Avança para o próximo nível
function nextLevel() {
    if (coins.length === 0) {
        if (currentLevel < 100) {
            currentLevel++;
            createLevel(currentLevel);
        } else {
            alert("Parabéns! Você completou todos os níveis!");
            clearInterval(gameInterval);
        }
    }
}

// Inicia o jogo
function startGame() {
    player.style.top = window.innerHeight - 100 - player.offsetHeight + "px"; // Alinha com o chão
    gameInterval = setInterval(() => {
        movePlayer();
        applyGravity();
        checkCollision();
        nextLevel();
    }, 50);

    createLevel(currentLevel);
}

// Controles de teclas
function isKeyPressed(key) {
    return keyState[key] || false;
}

window.addEventListener("keydown", (e) => {
    keyState[e.key] = true;
    if (e.key === " ") {
        jump();
    }
});

window.addEventListener("keyup", (e) => {
    keyState[e.key] = false;
});

startGame();
