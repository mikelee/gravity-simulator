export default class Planet {
    radius: number;
    mass: number;
    x: number;
    y: number;
    xVelocity: number;
    yVelocity: number;
    color: string;

    constructor(mass: number, radius: number, x: number, y: number, xVelocity: number, yVelocity: number, color: string) {
        this.mass = mass;
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.xVelocity = xVelocity;
        this.yVelocity = yVelocity;
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
        this.x += this.xVelocity;
        this.y += this.yVelocity;
    }

    updateVelocity(deltaX: number, deltaY: number) {
        this.xVelocity += deltaX;
        this.yVelocity += deltaY;
    }
}