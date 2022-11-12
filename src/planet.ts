import { v4 as uuidv4 } from 'uuid';

export default class Planet {
    id: string;
    radius: number;
    mass: number;
    x: number;
    y: number;
    xVelocity: number;
    yVelocity: number;
    color: string;

    constructor(mass: number, x: number, y: number, xVelocity: number, yVelocity: number, color: string) {
        this.id = uuidv4();
        this.mass = mass;
        this.radius = this.calcRadius(mass);
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

    calcRadius(mass: number) {
        const MIN_RADIUS = 6;
        const MAX_RADIUS = 20;
        const MIN_MASS = 10 ** 24;
        const MAX_MASS = 10 ** 30;
        
        const radiusRange = MAX_RADIUS - MIN_RADIUS;
        const numPossibleDeviations = Math.log10(MAX_MASS / MIN_MASS);
        // radius increment for each 10^x
        const radiusIncrement = radiusRange / numPossibleDeviations;

        if (mass <= MIN_MASS) {
            return MIN_RADIUS;
        } else if (mass >= MAX_MASS) {
            return MAX_RADIUS;
        } else {
            const diff = mass / MIN_MASS;
            const log = Math.log10(diff);
            // each deviation is 10^x
            const deviations = Math.floor(log);

            const radius = MIN_RADIUS + (radiusIncrement * deviations);

            return radius;
        }
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