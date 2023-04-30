const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 600
canvas.height = 600

let tempoJogo = 240
statusjogo = 1

function animate() {
    requestAnimationFrame(animate);
    
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillText(tempoJogo, 300, 300, 300);
    
    console.log("teste");
}

setInterval(() => {
    tempoJogo--;
}, 1000);
animate();
