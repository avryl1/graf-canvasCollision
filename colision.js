const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const TOTAL_STARS = 25;
const gravity = 0.22;
const bounceFactor = 0.68;
const minimumBounce = 1.5;

let score = 0;
let stars = [];
let width = 0;
let height = 0;

const colors = [
    "#ff5c8a", "#ffd166", "#64e6c2",
    "#65c7ff", "#c6a0ff", "#ff9f68"
];

function currentSpeed() {
    if (score > 20) return Math.random() * 2 + 5;
    if (score > 10) return Math.random() * 2 + 3;
    return Math.random() * 2 + 2;
}

function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    width = rect.width;
    height = rect.height;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    stars.forEach(star => {
        star.x = Math.max(
            star.radius,
            Math.min(width - star.radius, star.x)
        );
    });
}

class Star {
    constructor() {
        this.radius = Math.random() * 10 + 17;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.reset(true);
    }

    reset(randomHeight = false) {
        this.x = this.radius + Math.random() *
            Math.max(1, width - this.radius * 2);

        this.y = randomHeight
            ? -Math.random() * Math.max(height, 200)
            : -this.radius;

        this.vx = (Math.random() - 0.5) * 1.4;
        this.vy = currentSpeed();
    }

    update() {
        this.x += this.vx;

        if (this.x < this.radius || this.x > width - this.radius) {
            this.vx *= -1;
            this.x = Math.max(
                this.radius,
                Math.min(width - this.radius, this.x)
            );
        }

        this.vy += gravity;
        this.y += this.vy;

        const floor = height - this.radius;

        if (this.y >= floor) {
            this.y = floor;

            if (Math.abs(this.vy) > minimumBounce) {
                this.vy = -Math.abs(this.vy) * bounceFactor;
            } else {
                this.reset();
            }
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 16;

        ctx.beginPath();

        for (let i = 0; i < 10; i++) {
            const radius = i % 2 === 0
                ? this.radius
                : this.radius * 0.45;

            const angle = -Math.PI / 2 + i * Math.PI / 5;
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;

            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }

        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();

        ctx.restore();
    }

    containsPoint(x, y) {
        return Math.hypot(x - this.x, y - this.y) <= this.radius + 8;
    }
}

function createStars() {
    stars = [];

    for (let i = 0; i < TOTAL_STARS; i++) {
        stars.push(new Star());
    }
}

canvas.addEventListener("click", event => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left) * (width / rect.width);
    const mouseY = (event.clientY - rect.top) * (height / rect.height);

    for (let i = stars.length - 1; i >= 0; i--) {
        if (stars[i].containsPoint(mouseX, mouseY)) {
            stars[i].reset();
            score++;
            scoreElement.textContent = score;
            break;
        }
    }
});

function animate() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach(star => {
        star.update();
        star.draw();
    });

    requestAnimationFrame(animate);
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
createStars();
animate();
