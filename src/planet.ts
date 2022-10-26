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

    static colors: { [key: string]: string } = {
        red: '#F06962',
        redDark: '#A83832',
        green: '#67D45D',
        greenDark: '#398732',
        blue: '#5576E6',
        blueDark: '#314A9E',
        yellow: '#E6E655',
        yellowDark: '#A1A127'
    }

    static calcGravity = (m1: number, m2: number, r: number) => {
        const G = 6.674 * (10 ** -11);
        return G * ((m1 * m2) / (r ** 2));
    } 

    calcDeltaVelocities = (otherPlanet: Planet) => {
        const deltaX = otherPlanet.x - this.x;
        const deltaY = otherPlanet.y - this.y;
        let distance = Math.sqrt((deltaX ** 2) + (deltaY ** 2));
        // make distance in terms of 1 million kilometers
        distance *= (10 ** 6);
        const meters = distance * 1000;

        const gravitationalForce = Planet.calcGravity(this.mass, otherPlanet.mass, meters);
        const acceleration = gravitationalForce / this.mass;

        const angleRadians = Math.atan2(deltaY, deltaX);
        const xAcceleration = acceleration * Math.cos(angleRadians);
        const yAcceleration = acceleration * Math.sin(angleRadians);

        this.updateVelocity(xAcceleration, yAcceleration);
    }

    draw(ctx: CanvasRenderingContext2D) {
        const x = Math.round(this.x);
        const y = Math.round(this.y);

        ctx.beginPath();

        const gradient = ctx.createRadialGradient(x, y, this.radius, x - this.radius, y + this.radius, this.radius);
        gradient.addColorStop(0, Planet.colors[this.color + 'Dark']);
        gradient.addColorStop(.9, Planet.colors[this.color]);
        ctx.fillStyle = gradient;

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
        // round to 10 decimal places
        deltaX = Math.round(deltaX * (10 ** 10))  / (10 ** 10);
        deltaY = Math.round(deltaY * (10 ** 10))  / (10 ** 10);

        this.xVelocity += deltaX;
        this.yVelocity += deltaY;
    }
}