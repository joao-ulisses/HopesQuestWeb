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
    constructor() {
        this.position = {
            x: 200,
            y: 100
        }
        
        this.width = 200
        this.height = 20
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
        c.fillStyle = 'green'
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
    if (estadoAtual == estados.jogando) { 
        c.clearRect(0, 0, canvas.width, canvas.height)
        player.update()
        platform.draw()
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
        if (player.position.y + player.height <= platform.position.y && 
            player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width) {
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
    } else if (estadoAtual == estados.menu) {
        c.fillText("teste", 300, 300, 20);
    }
}

var estados = { //tipo de status do jogo
	menu: 0,
	jogando: 1
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

const player = new Player()
const platform = new Platform()

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
                console.log("teste)");
                estadoAtual = estados.jogando;
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