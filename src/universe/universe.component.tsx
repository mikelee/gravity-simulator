import React, { useEffect, useRef, useState } from 'react';
import { calcDeltaVelocities } from '../physicsFunctions';

import './universe.styles.scss';

import Planet from '../planet';

interface Props {
    planets: Planet[],
    play: boolean,
    addPlanet: (planet: Planet) => void
}

const Universe: React.FC<Props> = ({ planets, play, addPlanet }) => {
    const canvasRef = useRef(null);
    const rafIdRef = useRef<number | null>(null);
    let rafId: number;
    let canvas: HTMLCanvasElement | null;
    let ctx: CanvasRenderingContext2D | null;
    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight - 200;

    const [startPosition, setStartPosition] = useState<any>();

    useEffect(() => {
        if (canvasRef.current !== undefined) canvas = canvasRef.current;
        if (canvas) ctx = canvas.getContext('2d');

        rafIdRef.current = requestAnimationFrame(refresh);
        rafId = rafIdRef.current;

        return () => {
            cancelAnimationFrame(rafId);
        }
    }, [planets, play]);
    
    const refresh = () => {
        if (rafId !== rafIdRef.current) return;
        if (!play) return;

        ctx?.clearRect(0, 0, WIDTH, HEIGHT);

        planets.forEach(planet => {
            const otherPlanets = planets.filter(otherPlanet => otherPlanet !== planet);

            const deltaVelocities = calcDeltaVelocities(planet, otherPlanets);

            planet.updateVelocity(deltaVelocities.xVelocity, deltaVelocities.yVelocity);

            planet.move();
            if (ctx) planet.draw(ctx);
        });

        requestAnimationFrame(refresh);
    }

    const createPlanet = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        /*
            The lower the number, the more sensitive.
            Value must be positive.
       */
        const DRAG_SENSITIVITY = 100;

        const startX = startPosition.x;
        const startY = startPosition.y;
        const endX = e.clientX;
        const endY = e.clientY;
        const deltaX = endX - startX;
        const deltaY = endY - startY;

        // deltaX and deltaX are negative to shoot the planet in the opposite direction of the user's drag
        const xVelocity = -deltaX / DRAG_SENSITIVITY;
        const yVelocity = -deltaY / DRAG_SENSITIVITY;

        addPlanet(new Planet(99999999999, 10, startX, startY, xVelocity, yVelocity, 'red'));
    }

    return (
        <div className='universe'>
            <canvas ref={canvasRef} id='canvas' width={WIDTH} height={HEIGHT} onMouseDown={e => setStartPosition({x: e.clientX, y: e.clientY})} onMouseUp={e => createPlanet(e)} ></canvas>
        </div>
    );
}

export default Universe;