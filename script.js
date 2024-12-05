

function applyGravity() {
    if (isJumping) {
        let playerBottom = parseInt(player.style.top || 0) + player.offsetHeight;
        if (playerBottom < window.innerHeight - 50) {
            jumpHeight -= gravity;
            player.style.top = parseInt(player.style.top || 0) - jumpHeight + 'px';
        } else {
            isJumping = false;
            player.style.top = window.innerHeight - 50 - player.offsetHeight + 'px'; // Garante que o personagem não ultrapasse o chão
        }
    }
}

// Função para checar a colisão entre o personagem e os itens amarelos
function checkCollision() {
    coins.forEach(coin => {
        if (isCollision(player, coin)) {
            score++;
            coin.remove(); // Remove o item ao ser coletado
        }
    });
    nextLevel(); // Verifica se o nível foi concluído
}

function isCollision(player, coin) {
    const playerRect = player.getBoundingClientRect();
    const coinRect = coin.getBoundingClientRect();

    return !(playerRect.right < coinRect.left || 
             playerRect.left > coinRect.right || 
             playerRect.bottom < coinRect.top || 
             playerRect.top > coinRect.bottom);
}

// Função para criar um novo nível
function createLevel(level) {
    let newCoins = [];
    for (let i = 0; i < level * 10; i++) {
        let coin = document.createElement("div");
        coin.classList.add("coin");
        coin.style.position = "absolute";
        coin.style.top = (Math.random() * window.innerHeight) + "px";
        coin.style.left = (Math.random() * window.innerWidth) + "px";
        document.body.appendChild(coin);
        newCoins.push(coin);
    }
    coins = newCoins; // Atualiza a lista de itens amarelos
}

let player = document.getElementById("player");
let coins = [];
let platforms = [];
let isJumping = false;
let jumpHeight = 0; // Controla a altura do pulo
let gravity = 0.5; // A gravidade que faz o personagem cair
let jumpForce = 15; // Força do pulo
let score = 0; // Pontuação do jogador

let playerSpeed = 8; // Velocidade de movimento do personagem
let playerSpeedX = 0; // Para movimentação mais suave
let keyState = {};

let currentLevel = 1;
let gameInterval;

// Função para movimentação do personagem
function movePlayer() {
    if (isKeyPressed("ArrowRight")) {
        playerSpeedX = playerSpeed;
    } else if (isKeyPressed("ArrowLeft")) {
        playerSpeedX = -playerSpeed;
    } else {
        playerSpeedX = 0;
    }

    player.style.left = (parseInt(player.style.left) || 0) + playerSpeedX + 'px';
}

// Função para verificar se uma tecla está pressionada
function isKeyPressed(key) {
    return keyState[key] === true;
}

// Função para pular
function jump() {
    if (!isJumping) {
        isJumping = true;
        jumpHeight = jumpForce;
    }
}

// Função para aplicar a gravidade
function applyGravity() {
    if (isJumping) {
        let playerBottom = parseInt(player.style.top || 0) + player.offsetHeight;
        if (playerBottom < window.innerHeight - 50) {
            jumpHeight -= gravity;
            player.style.top = (parseInt(player.style.top || 0) - jumpHeight) + 'px';
        } else {
            isJumping = false;
            player.style.top = window.innerHeight - 50 - player.offsetHeight + 'px'; // Garante que o personagem não ultrapasse o chão
        }
    } else {
        if (parseInt(player.style.top || 0) < window.innerHeight - 50 - player.offsetHeight) {
            player.style.top = (parseInt(player.style.top || 0) + gravity) + 'px'; // Aplica a gravidade quando não estiver pulando
        }
    }
}

// Função para verificar colisões com as moedas
function checkCollision() {
    coins.forEach(coin => {
        if (isCollision(player, coin)) {
            score++;
            coin.remove(); // Remove a moeda ao ser coletada
        }
    });
}

// Função de colisão entre o personagem e objetos (como moedas ou plataformas)
function isCollision(player, object) {
    const playerRect = player.getBoundingClientRect();
    const objectRect = object.getBoundingClientRect();

    return !(playerRect.right < objectRect.left || 
             playerRect.left > objectRect.right || 
             playerRect.bottom < objectRect.top || 
             playerRect.top > objectRect.bottom);
}

// Função para criar o nível com moedas e plataformas
function createLevel(level) {
    coins = [];
    platforms = [];
    for (let i = 0; i < level * 10; i++) {
        let coin = document.createElement("div");
        coin.classList.add("coin");
        coin.style.top = (Math.random() * window.innerHeight) + "px";
        coin.style.left = (Math.random() * window.innerWidth) + "px";
        document.body.appendChild(coin);
        coins.push(coin);
    }

    for (let i = 0; i < level * 3; i++) {
        let platform = document.createElement("div");
        platform.classList.add("platform");
        platform.style.top = (Math.random() * (window.innerHeight - 100)) + "px";
        platform.style.left = (Math.random() * window.innerWidth) + "px";
        document.body.appendChild(platform);
        platforms.push(platform);
    }
}

// Função para avançar para o próximo nível
function nextLevel() {
    // Quando o jogador terminar um nível (pegando todos os itens), vai para o próximo
    if (coins.length === 0) {
        if (currentLevel < 100) {
            currentLevel++;
            createLevel(currentLevel); // Cria os itens do próximo nível
        }
    }
}

// Função para iniciar o jogo
function startGame() {
    gameInterval = setInterval(() => {
        movePlayer();
        applyGravity();
        checkCollision();
        nextLevel();
    }, 50);

    createLevel(currentLevel); // Começa o jogo com o primeiro nível
}

// Controle das teclas (para movimento)
window.addEventListener("keydown", (e) => {
    keyState[e.key] = true;
    if (e.key === " ") { // Espaço para pular
        jump();
    }
});
window.addEventListener("keyup", (e) => {
    keyState[e.key] = false;
});

startGame();
