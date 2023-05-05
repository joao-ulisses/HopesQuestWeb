const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
c.font = "60px Arial";

canvas.width = 600;
canvas.height = 600;


class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }

        this.width = 45;
        this.height = 60;
        this.bookCountLeft = 0;
        this.bookCountRight = 0;
        this.allCount = this.bookCountLeft + this.bookCountRight;
    }

    updateCount(bookType) {
        if (bookType == "left") {
            this.bookCountLeft++;
        } else {
            this.bookCountRight++;
        }

        this.allCount++;
    }

    draw() {
        c.drawImage(personagem, player.position.x, player.position.y, player.width, player.height);
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        

        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.velocity.y += gravity
        } else {
            this.velocity.y = 0            
        }
    }
}

class Platform {
    constructor(positionX, positionY, width, height) {
        this.position = {
            x: positionX,
            y: positionY
        }
        
        this.width = width
        this.height = height
        this.bookRight = false;
        this.bookLeft = true;
    }
}

class Book {
    constructor(randomX, randomY) {
        this.position = {
            x: randomX,
            y: randomY
        }
        this.type = this.generateBook();
        this.width = 30
        this.height = 15
    }

    generateBook() {
        let rand = generateRandom(0, 2);
        
        if (rand == 1) {
            return "left";
        } else {
            return "right";
        }
    }

    mudaLivro() {
        this.type = this.generateBook();
        this.position.x = generateRandom(20, canvas.width - 20);
        this.position.y = generateRandom(20, canvas.height - 20);
    }

    draw() {
        let livro;
        if (this.type == "left") {
            livro = livroAzul            
        } else {
            livro = livroVermelho
        }     
        c.drawImage(livro, book.position.x, book.position.y, book.width, book.height);
    }

    update() {
        this.draw()
    }
}

function comecaJogo() {                   
    estadoAtual = estados.jogando;
    bgSound.play(); 
    cronometro = setInterval(() => {
        if (estadoAtual == estados.jogando) {
            tempoJogo--;
        }                    
    }, 1000);
}

function paraJogo() {
    clearInterval(cronometro);
    bgSound.pause();
    player.position = {
        x: 100,
        y: 100
    }
    player.velocity = {
        x: 0,
        y: 0
    }

    keys.left.pressed = false;
    keys.right.pressed = false;
        
    player.bookCountLeft = 0;
    player.bookCountRight = 0;
    player.allCount = 0;
    player.bookType = "";

    book.mudaLivro();
}

function generateRandom(min, max) {
    let difference = max - min;
    let rand = Math.random();

    rand = Math.floor(rand * difference);
    rand = rand + min;

    return rand;
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    if (estadoAtual == estados.jogando) { 
        if (tempoJogo >= 0) {
            c.drawImage(background, 0, 0, canvas.width, canvas.height);
            
            c.fillStyle = "white";
            let textoCronometro = "Cronometro: " + tempoJogo;
            c.fillText(textoCronometro, 214, 35);

            let textoPontos = "Livros coletados: " + player.allCount;
            c.fillText(textoPontos, 214, 55);

            player.update();
            book.update()
    
            if (keys.right.pressed) {
                player.velocity.x = 5
            } else if (keys.left.pressed) {
                player.velocity.x = -5
            } else {
                player.velocity.x = 0
            }
    
            if (player.position.x < 0) {
                player.position.x = 0;
            } else if (player.position.x + player.width > canvas.width) {
                player.position.x = canvas.width - player.width;
            }
            
            if (player.position.y < 0) {
                player.position.y = 1;
                player.velocity.y = +1;
            }
    
            // platform collision
            if ((player.position.y + player.height <= platform.position.y && 
                player.position.y + player.height + player.velocity.y >= platform.position.y &&
                player.position.x + player.width >= platform.position.x &&
                player.position.x <= platform.position.x + platform.width) ||
                (player.position.y + player.height <= leftPlatform.position.y && 
                player.position.y + player.height + player.velocity.y >= leftPlatform.position.y &&
                player.position.x + player.width >= leftPlatform.position.x &&
                player.position.x <= leftPlatform.position.x + leftPlatform.width) ||
                (player.position.y + player.height <= rightPlatform.position.y && 
                player.position.y + player.height + player.velocity.y >= rightPlatform.position.y &&
                player.position.x + player.width >= rightPlatform.position.x &&
                player.position.x <= rightPlatform.position.x + rightPlatform.width)) {
                player.velocity.y = 0
            } 
    
            if (player.position.x + player.width > book.position.x &&
                book.position.x + book.width > player.position.x &&
                player.position.y + player.height > book.position.y &&
                book.position.y + book.height > player.position.y 
                ) 
            {
                if (book.type == player.book) {
                    pegaSom.play();
                    player.updateCount(book.type);
                    book.mudaLivro();
                    pontoFinal = player.allCount;
                }
            }
        } else {
            tempoJogo = 60;
            estadoAtual = estados.fimJogo;
        }
    } else if (estadoAtual == estados.menu) {
        c.drawImage(menu, 0, 0, canvas.width, canvas.height);
    } else if (estadoAtual == estados.tutorial) {
        c.drawImage(tutorial, 0, 0, canvas.width, canvas.height);
    } else if (estadoAtual == estados.historia) {
        c.drawImage(historia, 0, 0, canvas.width, canvas.height);
    } else if (estadoAtual == estados.creditos) {
        c.drawImage(creditos, 0, 0, canvas.width, canvas.height);
    } else if (estadoAtual == estados.fimJogo) {
        if (pontoFinal >= record) {
            record = pontoFinal;
            localStorage.setItem("record", record);
        }
        c.drawImage(fimJogo, 0, 0, canvas.width, canvas.height);
        c.fillText(pontoFinal, 305, 295);
        c.fillText(record, 305, 340);
    }
}

var estados = { //tipo de status do jogo
	menu: 0,
	jogando: 1,
    tutorial: 2,
    historia: 3,
    creditos: 4,
    fimJogo: 5
},
estadoAtual = 0;

const gravity = 0.5
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}
var cronometro;
var tempoJogo = 60;
var pontoFinal = 0;
var record = localStorage.getItem("record");
if (record == null) {
    record = 0   
}

var menu = document.createElement("img");
menu.src = "Imagens/menu.png";
var tutorial = document.createElement("img");
tutorial.src = "Imagens/tutorial.png";
var historia = document.createElement("img");
historia.src = "Imagens/historia.png";
var creditos = document.createElement("img");
creditos.src = "Imagens/Creditos.jpg";
var fimJogo = document.createElement("img");
fimJogo.src = "Imagens/fimJogo.png";
var background = document.createElement("img");
background.src = "Imagens/cenario_web.png";
var personagem = document.createElement("img");
personagem.src = "Imagens/hopes.png";
var livroAzul = document.createElement("img");
livroAzul.src = "Imagens/livroAzul.png";
var livroVermelho = document.createElement("img");
livroVermelho.src = "Imagens/livroVermelho.png";

var bgSound = new Audio("Sons/Background.mp3");
bgSound.preload = 'auto';
bgSound.loop = true;
bgSound.volume = 0.2;
bgSound.load();
var pulaSom = new Audio("Sons/Pular.mp3");
pulaSom.preload = 'auto';
pulaSom.loop = false;
pulaSom.load();
var pegaSom = new Audio("Sons/Pegar.mp3");
pegaSom.preload = 'auto';
pegaSom.loop = false;
pegaSom.load();

const player = new Player()
const platform = new Platform(183, 393, 229, 44)
const leftPlatform = new Platform(0, 215, 236, 52)
const rightPlatform = new Platform(364, 211, 236, 49)

let randomX = generateRandom(20, canvas.width - 20);
let randomY = generateRandom(20, canvas.height - 20);
const book = new Book(randomX, randomY);

animate()

addEventListener('keydown', ({ keyCode }) => {
    if (estadoAtual == estados.jogando) {
        switch (keyCode) {
            // Tecla "A"
            case 65:
                keys.left.pressed = true;
                break
    
            // Tecla "D"
            case 68:
                keys.right.pressed = true;
                break
    
            // Tecla "W" ou "SPACE"
            case 87:
            case 32: 
                player.velocity.y -= 10
                pulaSom.play()
                break
            
            // Tecla "Q"
            case 81:
                player.book = "left";
                break;
    
            // Tecla "E"
            case 69:
                player.book = "right";
                break;

            // Tecla "ESC"
            case 27:
                estadoAtual = estados.menu;
                paraJogo();
                break;
        }
    } else if (estadoAtual == estados.menu) {
        switch (keyCode) {
            // tecla "Enter"
            case 13:
                comecaJogo();
                break;
            // tecla "h"
            case 72:
                estadoAtual = estados.historia;
                break;
            // tecla "t"
            case 84:
                estadoAtual = estados.tutorial;
                break;
            // tecla "c"
            case 67:
                estadoAtual = estados.creditos;
                break;
        }
    } else if (estadoAtual == estados.historia || estadoAtual == estados.tutorial || estadoAtual == estados.creditos) {
        switch (keyCode) {
            // tecla "Enter"
            case 13:
                estadoAtual = estados.menu;
                break;
        }
    } else if (estadoAtual == estados.fimJogo) {
        paraJogo();

        switch (keyCode) {
            // tecla "Enter"
            case 13:
                comecaJogo();
                break;
            // tecla "m"
            case 77:
                estadoAtual = estados.menu;
                break;
        }
    }
})

addEventListener('keyup', ({ keyCode }) => {
    if (estadoAtual == estados.jogando) {
        switch (keyCode) {
            case 65:
                keys.left.pressed = false;
                break

            case 83:
                break

            case 68:
                keys.right.pressed = false;
                break

            case 87:
                break
        }
    } 
})