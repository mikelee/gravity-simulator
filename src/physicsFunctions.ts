import Planet from './planet';

export const calcDeltaVelocities = (planet: Planet, otherPlanets: Planet[]) => {
    const gravityForces = calcGravityForces(planet, otherPlanets);

    const gravityAccelerations = calcGravityAccelerations(planet, gravityForces);

    const directions = calcDirections(planet, otherPlanets);

    const accelerationsAndDirections = combineAccelerationsAndDirections(gravityAccelerations, directions);

    const velocities = calcVelocities(accelerationsAndDirections);

    const velocitiesSum = sumVelocities(velocities);

    return velocitiesSum;
}

const calcGravityForces = (planet: Planet, otherPlanets: Planet[]) => {
    const m1 = planet.mass;

    const gravityForces = otherPlanets.map(otherPlanet => {
        const m2 = otherPlanet.mass;

        const deltaX = Math.abs(otherPlanet.x - planet.x);
        const deltaY = Math.abs(otherPlanet.y - planet.y);
        const distance = Math.sqrt((deltaX ** 2) + (deltaY ** 2));

        const gravity = calcGravity(m1, m2, distance);

        return gravity
    });

    return gravityForces;
}

const calcGravity = (m1: number, m2: number, r: number) => {
    const G = 6.674 * (10 ** -11);
    const f = G * ((m1 * m2) / (r ** 2));

    return f;
}

const calcGravityAccelerations = (planet: Planet, gravityForces: number[]) => {
    const accelerations = gravityForces.map(gravityForce => {
        return calcAcceleration(planet.mass, gravityForce);
    });

    return accelerations;
}

const calcAcceleration = (planetMass: number, gravity: number) => {
    // a = f/m
    const acceleration = gravity / planetMass;

    return acceleration;
}

const calcDirections = (planet: Planet, otherPlanets: Planet[]) => {
    const directions = otherPlanets.map(otherPlanet => {
        const x1 = planet.x;
        const y1 = planet.y;
        const x2 = otherPlanet.x;
        const y2 = otherPlanet.y;

        // + === move positive (right)
        // - === move negative (left)
        // 0 === stay still
        const xDirection = x2 - x1;

        // + === move positive (down)
        // - === move negative (up)
        // 0 === stay still
        const yDirection = y2 - y1;

        return {
            xDirection,
            yDirection
        }
    });

    return directions;
}

const combineAccelerationsAndDirections = (accelerations: number[], directions: { xDirection: number, yDirection: number }[]) => {
    const accelerationsAndDirections = [];
    
    for (let i = 0; i < accelerations.length; i++) {
        accelerationsAndDirections.push({
            acceleration: accelerations[i],
            directions: directions[i]
        });
    }

    return accelerationsAndDirections;
}

const calcVelocities = (accelerationsAndDirections: { acceleration: number, directions: { xDirection: number, yDirection: number } }[]) => {
    const velocities = accelerationsAndDirections.map(accelerationAndDirection => {
        const { acceleration, directions } = accelerationAndDirection;

        // find y:x ratio
        let yPercentOfX;
        if (directions.xDirection === 0) {
            // Needed because you can't divide by 0
            yPercentOfX = 1;
        } else {
            yPercentOfX = Math.abs(directions.yDirection / directions.xDirection);
        }

        // convert gravitational acceleration (a) to x and y velocities
        let xVelocity = 0;
        let yVelocity = 0;

        // y = yPercentOfX * x;

        // x^2 + y^2 = a^2
        // x^2 + (yPercentOfX*x)^2 = a^2
        // x + (sqrt(yPercentOfX) * x) = a
        // (1 + sqrt(yPercentofX)) * x = a
        // x = a / (1 + sqrt(yPercentOfX) 


        xVelocity = acceleration / (1 + Math.sqrt(yPercentOfX));
        yVelocity = yPercentOfX * xVelocity;

        // velocity is negative if direction is negative
        if (directions.xDirection < 0) {
            xVelocity *= -1;
        }

        // velocity is negative if direction is negative
        if (directions.yDirection < 0) {
            yVelocity *= -1;
        }

        return {
            xVelocity,
            yVelocity
        }
    });

    return velocities;
}

const sumVelocities = (velocities: { xVelocity: number, yVelocity: number }[]) => {
    let xVelocity = 0;
    let yVelocity = 0;

    velocities.forEach(velocity => {
        xVelocity += velocity.xVelocity;
        yVelocity += velocity.yVelocity;
    });

    return {
        xVelocity,
        yVelocity
    }
}