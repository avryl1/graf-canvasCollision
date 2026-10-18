const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
//Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background =
"#ff8";
class Circle {
constructor(x, y, radius, color, text, speed) {
this.posX = x;
this.posY = y;
this.radius = radius;
this.color = color;
this.originalColor = color;
this.isColliding =false;
this.text = text;
this.speed = speed;
this.dx = 1 * this.speed;
this.dy = 1 * this.speed;
}
draw(context) {
context.beginPath();
context.strokeStyle = this.isColliding
    ? "#0000FF"
    : this.originalColor;
context.textAlign =
"center";
context.textBaseline =
"middle";
context.font =
"20px Arial";
context.fillText(this.text, this.posX, this.posY);
context.lineWidth = 2;
context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
context.stroke();
context.closePath();
}
detectCollision(other) {
    let dx = other.posX - this.posX;
    let dy = other.posY - this.posY;

    let distance = Math.sqrt(dx * dx + dy * dy);

    return distance <= this.radius + other.radius;
}
update(context) {
this.draw(context);
// Actualizar la posición X
this.posX += this.dx;
// Cambiar la dirección si el círculo llega al borde del canvas en X
if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
this.dx = -this.dx;
}
// Actualizar la posición Y
this.posY += this.dy;
// Cambiar la dirección si el círculo llega al borde del canvas en Y
if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
    this.dy = -this.dy;
}
}
}
// Crear un array para almacenar N círculos
let circles = [];
// Función para generar círculos aleatorios
function generateCircles(n) {
for (let i = 0; i < n; i++) {
let radius = Math.random() * 30 + 20; // Radio entre 20 y 50
let x = Math.random() * (window_width - radius * 2) + radius;
let y = Math.random() * (window_height - radius * 2) + radius;
let color =
`#${Math.floor(Math.random()*16777215).toString(16)}`; // Color aleatorio
let speed = Math.random() * 2 + 1; // Velocidad entre 1 y 3
let text =
`C${i + 1}`; // Etiqueta del círculo
circles.push(new Circle(x, y, radius, color, text, speed));
}
}
// Función para animar los círculos
// Detectar colisiones entre todos los círculos
function detectAllCollisions() {
    // Primero, quitar el estado de colisión
    circles.forEach(circle => {
        circle.isColliding = false;
    });

    // Comparar cada círculo con los demás
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            let circleA = circles[i];
            let circleB = circles[j];

            if (circleA.detectCollision(circleB)) {
                circleA.isColliding = true;
                circleB.isColliding = true;
            }
        }
    }
}

// Función para animar los círculos
function animate() {
    ctx.clearRect(0, 0, window_width, window_height);

    // Actualizar la posición de todos los círculos
    circles.forEach(circle => {
        circle.posX += circle.dx;
        circle.posY += circle.dy;

        if (circle.posX + circle.radius > window_width ||
            circle.posX - circle.radius < 0) {
            circle.dx = -circle.dx;
        }

        if (circle.posY + circle.radius > window_height ||
            circle.posY - circle.radius < 0) {
            circle.dy = -circle.dy;
        }
    });

    // Revisar las colisiones
    detectAllCollisions();

    // Dibujar los círculos con su color correspondiente
    circles.forEach(circle => {
        circle.draw(ctx);
    });

    requestAnimationFrame(animate);
}
// Generar N círculos y comenzar la animación
generateCircles(20); // Puedes cambiar el número de círculos aquí
animate();