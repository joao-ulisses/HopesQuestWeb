const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 600
canvas.height = 600

const gravity = 0.5
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

        this.width = 30
        this.height = 30
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
    }

    draw() {
        c.fillStyle = 'blue'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

class Book {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }

        this.width = 20
        this.height = 20
    }

    draw() {
        c.fillStyle = 'green'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        
        this.velocity.x -= 0.2;
        
        if (this.velocity.x < 0 || this.position.x + this.width > canvas.width) {
            this.velocity.x = 0
        } 

        if (this.position.y + this.height + this.velocity.y < canvas.height) {
            this.velocity.y += gravity
        } else {
            this.velocity.y = 0            
        }
    }
}


const player = new Player()
const platform = new Platform()
const book = new Book()

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

function animate() {
    requestAnimationFrame(animate)
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

    bookMaxLeft = book.position.x
    bookMaxRight = book.position.x + book.width
    playerMaxLeft = player.position.x
    playerMaxRight = player.position.x + player.width

    // platform collision
    if (player.position.y + player.height <= platform.position.y && 
        player.position.y + player.height + player.velocity.y >= platform.position.y &&
        player.position.x + player.width >= platform.position.x &&
        player.position.x <= platform.position.x + platform.width) {
        player.velocity.y = 0
    } 

    /*if (book.position.y + book.velocity.y + book.height == player.position.y + player.velocity.y + player.height &&
        (player.position.x > bookMaxLeft && player.position.x < bookMaxRight)
        ) 
    {
        console.log("colidiu")
        // if (player.position > bookMaxLeft) {
        //     player.position.x = book.position.x + book.width + 1
        // } else {
        //     player.position.x = book.position.x + book.width - 1
        // }
    }*/

    /*
    if (player.position.x + player.width > book.position.x &&
        book.position.x + book.width > player.position.x &&
        player.position.y + player.height > book.position.y &&
        book.position.y + book.height > player.position.y 
        ) 
    {
        //player.position.x += -2 - player.velocity.x;
        if (player.position.x + player.width > book.position.x) {
            console.log("vai esquerda")
            player.velocity.x = -5;
        } else if (book.position.x + book.width > player.position.x) {
            console.log("vai direita")
            player.velocity.x = 5;
        }
    }*/


}

function logsObjects () {
    // console.log(book.position.y + book.velocity.y + book.height)
    // console.log(player.position.y + player.velocity.y + player.height)
    console.log("Player x: " + player.position.x)
    console.log("Player max Left: " + playerMaxLeft)
    console.log("Player max Right: " + playerMaxRight)
    console.log("Player velocidade: " + player.velocity.x)
    console.log("Livro x: " + book.position.x)
    console.log("Livro max left: " + bookMaxLeft)
    console.log("Livro max Right: " + bookMaxRight)
    console.log("Livro velocidade: " + book.velocity.x)
    // console.log(bookMaxLeft)
    // console.log(bookMaxRight)
}

animate()

addEventListener('keydown', ({ keyCode }) => {
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
            player.velocity.y -= 10
            break

        case 32: 
            logsObjects()
            break
    }
})

addEventListener('keyup', ({ keyCode }) => {
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
})