import React, { useEffect, useRef } from 'react';
import './App.scss';

import Planet from './planet';

function App() {
  const canvasRef = useRef(null);
  let canvas: HTMLCanvasElement | null;
  let ctx: CanvasRenderingContext2D | null;
  let planet1: Planet;
  let planet2: Planet;
  const WIDTH = window.innerWidth - 50;
  const HEIGHT = window.innerHeight - 50;
  const RED = '#c76161';
  const BLUE = '#7490e3';

  useEffect(() => {
    if (canvasRef.current !== undefined) canvas = canvasRef.current;
    if (canvas) ctx = canvas.getContext('2d');

    planet1 = new Planet(10000000000000, 10, 100, 100, .5, 0, RED);
    planet2 = new Planet(1500000000000, 10, WIDTH / 2, 200, -1, 0, BLUE);

    requestAnimationFrame(refresh);
  }, []);

  const refresh = () => {
    ctx?.clearRect(0, 0, WIDTH, HEIGHT);

    const positions = getPlanetPositions(planet1, planet2);
    const gravity = calcGravity(planet1.mass, planet2.mass, positions.distance);

    const planetsAcceleration = calcAcceleration(planet1, planet2, gravity);

    calcChange(planet1, planet2, planetsAcceleration.planet1A);
    calcChange(planet2, planet1, planetsAcceleration.planet2A);

    planet1.move()
    planet2.move()

    if (ctx) draw(ctx, [planet1, planet2]);

    requestAnimationFrame(refresh);
  }

  const getPlanetPositions = (planet1: Planet, planet2: Planet) => {
    const planet1Position = planet1.getPosition();
    const planet2Position = planet2.getPosition();

    const deltaX = Math.abs(planet2Position.x - planet1Position.x);
    const deltaY = Math.abs(planet2Position.y - planet1Position.y);
    const distance = Math.sqrt((deltaX ** 2) + (deltaY ** 2));

    return {
      planet1Position,
      planet2Position,
      distance
    }
  }

  const calcGravity = (m1: number, m2: number, r: number) => {
    const G = 6.674 * (10 ** -11);
    const f = G * ((m1 * m2) / (r ** 2));

    return f;
  }
  
  const calcAcceleration = (planet1: Planet, planet2: Planet, gravity: number) => {
    // a = f/m
    const planet1A = gravity / planet1.mass;
    const planet2A = gravity / planet2.mass;

    return {
      planet1A,
      planet2A
    }
  }

  const calcChange = (planet1: Planet, planet2: Planet, acceleration: number) => {
    const x1 = planet1.x;
    const y1 = planet1.y;
    const x2 = planet2.x;
    const y2 = planet2.y;

    // + === move positive (right)
    // - === move negative (left)
    // 0 === stay still
    const xDirection = x2 - x1;

    // + === move positive (down)
    // - === move negative (up)
    // 0 === stay still
    const yDirection = y2 - y1;

    // find y:x ratio
    let yPercentOfX;
    if (xDirection === 0) {
      // Needed because you can't divide by 0
      yPercentOfX = 1;
    } else {
      yPercentOfX = Math.abs(yDirection / xDirection);
    }

    // covert gravitational acceleration (a) to x and y velocities
    let xForce = 0;
    let yForce = 0;

    // y = yPercentOfX * x;

    // x^2 + y^2 = a^2
    // x^2 + (yPercentOfX*x)^2 = a^2
    // x + (sqrt(yPercentOfX) * x) = a
    // (1 + sqrt(yPercentofX)) * x = a
    // x = a / (1 + sqrt(yPercentOfX) 


    xForce = acceleration / (1 + Math.sqrt(yPercentOfX));
    yForce = yPercentOfX * xForce;

    // add or subtract xForce from xVelocity and yForce from yVelocity depending on planet1's position relative to the position of gravity (planet2's position)
    // stays in same position if xDirection === 0
    if(xDirection > 0) {
      planet1.updateVelocity(xForce, 0);
    } else if (xDirection < 0) {
      planet1.updateVelocity(-xForce, 0);
    }

    // stays in same position if yDirection === 0
    if(yDirection > 0) {
      planet1.updateVelocity(0, yForce);
    } else if (yDirection < 0) {
      planet1.updateVelocity(0, -yForce);
    }
  }

  const draw = (ctx: CanvasRenderingContext2D, planets: Planet[]) => {
    planets.forEach(planet => {
      planet.draw(ctx)
    });
  }
  
  return (
    <div className='app'>
      <canvas ref={canvasRef} id='canvas' width={WIDTH} height={HEIGHT}></canvas>
    </div>
  );
}

export default App;