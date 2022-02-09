export default class Planet {
    radius: number;
    mass: number;
    x: number;
    y: number;
    xMotion: number;
    yMotion: number;
    color: string;

    constructor(mass: number, radius: number, x: number, y: number, xMotion: number, yMotion: number, color: string) {
        this.mass = mass;
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.xMotion = xMotion;
        this.yMotion = yMotion;
        this.color = color;
    }

    draw(ctx: CanvasRenderingContext2D) {
        const x = Math.round(this.x);
        const y = Math.round(this.y);

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(x, y, this.radius, 0, 2* Math.PI, false);
        ctx.fill();
    }

    getPosition() {
        return {
            x: this.x,
            y: this.y
        }
    }

    move() {
        this.x += this.xMotion;
        this.y += this.yMotion;
    }

    updateMotion(deltaX: number, deltaY: number) {
        this.xMotion += deltaX;
        this.yMotion += deltaY;
    }
}