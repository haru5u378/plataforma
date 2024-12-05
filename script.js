const player = document.getElementById("player");
const platforms = Array.from(document.getElementsByClassName("platform"));
const coins = Array.from(document.getElementsByClassName("coin"));
const ground = document.getElementById("ground");
const levelText = document.getElementById("level");

let isJumping = false;
let velocity = 0;
let gravity = 1;
let jumpSpeed = 15;
let moveSpeed = 5;
let currentLevel = 1;

// Configurações iniciais do personagem
player.style.left = "50px";
player.style.top = `${window.innerHeight - ground.offsetHeight - player.offsetHeight}px`;

// Movimentação
document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && !isJumping) {
        isJumping = true;
        velocity = -jumpSpeed; // Começa o pulo
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

// Gravidade e colisão
function applyGravity() {
    const playerBottom = parseInt(player.style.top) + player.offsetHeight;

    // Checa se está no chão ou em plataformas
    let onGround = playerBottom >= window.innerHeight - ground.offsetHeight;
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
            player.style.top = window.innerHeight - ground.offsetHeight - player.offsetHeight + "px";
        }
    } else {
        isJumping = true;
        velocity += gravity;
        let newTop = (parseInt(player.style.top) || window.innerHeight - ground.offsetHeight) + velocity;
        player.style.top = newTop + "px";
    }
}

// Verifica colisão
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

// Verifica moedas coletadas
function checkCoinCollection() {
    coins.forEach((coin, index) => {
        if (isCollision(player, coin)) {
            coin.remove();
            coins.splice(index, 1);
        }
    });

    // Passa de nível se todas as moedas forem coletadas
    if (coins.length === 0) {
        currentLevel++;
        levelText.innerText = `Nível: ${currentLevel}`;
        resetLevel();
    }
}

// Reseta o nível com novas moedas e plataformas
function resetLevel() {
    for (let i = 0; i < 6; i++) {
        const newCoin = document.createElement("div");
        newCoin.classList.add("coin");
        newCoin.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
        newCoin.style.top = `${Math.random() * (window.innerHeight - 200)}px`;
        document.getElementById("game-area").appendChild(newCoin);
        coins.push(newCoin);
    }
}

// Atualiza tudo
setInterval(() => {
    applyGravity();
    checkCoinCollection();
}, 20);
