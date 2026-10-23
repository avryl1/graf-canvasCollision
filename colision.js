
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let window_width = window.innerWidth;
let window_height = window.innerHeight - 60;

canvas.width = window_width;
canvas.height = window_height;

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;

        this.color = color;
        this.originalColor = color;

        this.text = text;
        this.speed = speed;

        this.dx = this.speed;
        this.dy = this.speed;

        this.isColliding = false;
    }

    draw(context) {
        context.beginPath();

        if (this.isColliding) {
            context.strokeStyle = "#0000FF";
        } else {
            context.strokeStyle = this.originalColor;
        }

        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";

        context.fillText(
            this.text,
            this.posX,
            this.posY
        );

        context.lineWidth = 2;

        context.arc(
            this.posX,
            this.posY,
            this.radius,
            0,
            Math.PI * 2,
            false
        );

        context.stroke();
        context.closePath();
    }

    update() {
        this.posX += this.dx;

        if (
            this.posX + this.radius > canvas.width ||
            this.posX - this.radius < 0
        ) {
            this.dx = -this.dx;
        }

        this.posY += this.dy;

        if (
            this.posY + this.radius > canvas.height ||
            this.posY - this.radius < 0
        ) {
            this.dy = -this.dy;
        }
    }

    detectCollision(other) {
        let dx = other.posX - this.posX;
        let dy = other.posY - this.posY;

        let distance = Math.sqrt(dx * dx + dy * dy);

        return distance <= this.radius + other.radius;
    }
}

let circles = [];

function generateCircles(n) {
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 20 + 20;

        let x = Math.random() *
            (canvas.width - radius * 2) + radius;

        let y = Math.random() *
            (canvas.height - radius * 2) + radius;

        let color = "#" +
            Math.floor(Math.random() * 16777215)
            .toString(16).padStart(6, "0");

        // Velocidad entre 1 y 5
        let speed = Math.random() * 4 + 1;

        let text = `C${i + 1}`;

        circles.push(
            new Circle(x, y, radius, color, text, speed)
        );
    }
}



function detectAllCollisions() {
    circles.forEach(circle => {
        circle.isColliding = false;
    });

    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            const a = circles[i];
            const b = circles[j];

            if (a.detectCollision(b)) {
                a.isColliding = true;
                b.isColliding = true;

                // Vector entre los centros
                let dx = b.posX - a.posX;
                let dy = b.posY - a.posY;
                let distance = Math.sqrt(dx * dx + dy * dy);

                // Evitar división entre cero
                if (distance === 0) {
                    dx = 1;
                    dy = 0;
                    distance = 1;
                }

                const nx = dx / distance;
                const ny = dy / distance;

                // Separar los círculos para evitar que se encimen
                const overlap = a.radius + b.radius - distance;
                if (overlap > 0) {
                    const separation = (overlap + 0.1) / 2;

                    a.posX -= nx * separation;
                    a.posY -= ny * separation;
                    b.posX += nx * separation;
                    b.posY += ny * separation;
                }

                // Velocidad relativa en la dirección del choque
                const relativeVelocity =
                    (b.dx - a.dx) * nx +
                    (b.dy - a.dy) * ny;

                // Rebotar solo si se están acercando
                if (relativeVelocity < 0) {
                    a.dx += relativeVelocity * nx;
                    a.dy += relativeVelocity * ny;

                    b.dx -= relativeVelocity * nx;
                    b.dy -= relativeVelocity * ny;
                }
            }
        }
    }
}



function animate() {
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Actualizar posiciones
    circles.forEach(circle => {
        circle.update();
    });

    // Detectar colisiones
    detectAllCollisions();

    // Dibujar los círculos
    circles.forEach(circle => {
        circle.draw(ctx);
    });

    requestAnimationFrame(animate);
}

// Crear 20 círculos
generateCircles(20);

animate();
