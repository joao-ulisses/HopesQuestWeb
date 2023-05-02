const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 600
canvas.height = 600


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

        this.width = 30;
        this.height = 30;
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

        console.log(this.allCount);
        console.log(this.bookCountLeft);
        console.log(this.bookCountRight);
    }

    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
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

    draw() {
        c.fillStyle = 'blue'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

class Book {
    constructor(randomX, randomY) {
        this.position = {
            x: randomX,
            y: randomY
        }
        this.type = this.generateBook();
        this.width = 20
        this.height = 20
    }

    generateBook() {
        let rand = generateRandom(0, 2);
        console.log(rand)
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
        if (this.type == "left") {
            c.fillStyle = 'blue'
        } else {
            c.fillStyle = 'green'
        }     
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
    }
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
            platform.draw()
            leftPlatform.draw()
            rightPlatform.draw()

            c.drawImage(background, 0, 0, canvas.width, canvas.height);

            c.fillText(tempoJogo, 300, 300, 600);
            player.update()
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
                    player.updateCount(book.type);
                    book.mudaLivro();
                }
            }
        } else {
            tempoJogo = 240;
            estadoAtual = estados.fimJogo;
        }
    } else if (estadoAtual == estados.menu) {
        c.fillText("Jogar - Aperte Enter", 300, 300, 600);
        c.fillText("Tutorial - Aperte t", 300, 400, 600);
        c.fillText("Historia - Aperte h", 300, 500, 600);
    } else if (estadoAtual == estados.tutorial) {
        c.fillText("Tutorial - Aperte Enter", 300, 300, 600);
    } else if (estadoAtual == estados.historia) {
        c.fillText("Historia - Aperte Enter", 300, 300, 600);
    } else if (estadoAtual == estados.fimJogo) {
        c.fillText("Fim de jogo", 300, 300, 600);
    }
}

var estados = { //tipo de status do jogo
	menu: 0,
	jogando: 1,
    tutorial: 2,
    historia: 3,
    fimJogo: 4
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
var tempoJogo = 240;

var background = document.createElement("img");
background.src = "../cenario_web.png"

const player = new Player()
const platform = new Platform(183, 393, 229, 44)
const leftPlatform = new Platform(0, 215, 236, 52)
const rightPlatform = new Platform(364, 211, 236, 49)

let randomX = generateRandom(20, canvas.width - 20);
let randomY = generateRandom(20, canvas.height - 20);
const book = new Book(randomX, randomY);

animate()

addEventListener('keydown', ({ keyCode }) => {
    console.log(keyCode);
    if (estadoAtual == estados.jogando) {
        switch (keyCode) {
            case 65:
                keys.left.pressed = true;
                break
    
            case 83:
                break
    
            case 68:
                keys.right.pressed = true;
                break
    
            case 87:
            case 32: 
                player.velocity.y -= 10
                break
            
            case 81:
                player.book = "left";
                break;
    
            case 69:
                player.book = "right";
                break;
        }
    } else if (estadoAtual == estados.menu) {
        switch (keyCode) {
            // tecla "Enter"
            case 13:                
                estadoAtual = estados.jogando;
                var cronometro = setInterval(() => {
                    if (estadoAtual == estados.jogando) {
                        tempoJogo--;
                    }                    
                }, 1000);
                break;
            // tecla "h"
            case 72:
                estadoAtual = estados.historia;
                break;
            // tecla "t"
            case 84:
                estadoAtual = estados.tutorial;
                break;
        }
    } else if (estadoAtual == estados.historia || estadoAtual == estados.tutorial) {
        switch (keyCode) {
            // tecla "Enter"
            case 13:
                estadoAtual = estados.menu;
                break;
        }
    } else if (estadoAtual == estados.fimJogo) {
        clearInterval(cronometro);
        player.position = {
            x: 100,
            y: 100
        }
        player.velocity = {
            x: 0,
            y: 0
        }

        player.width = 30;
        player.height = 30;
        player.bookCountLeft = 0;
        player.bookCountRight = 0;
        player.allCount = this.bookCountLeft + this.bookCountRight;
        player.bookType = "";

        switch (keyCode) {
            // tecla "Enter"
            case 13:
                estadoAtual = estados.jogando;
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