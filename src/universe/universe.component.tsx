import React, { useEffect, useRef } from 'react';
import { calcDeltaVelocities } from '../physicsFunctions';

import './universe.styles.scss';

import Planet from '../planet';

interface Props {
    planets: Planet[],
    play: boolean
}

const Universe: React.FC<Props> = ({ planets, play }) => {
    const canvasRef = useRef(null);
    const rafIdRef = useRef<number | null>(null);
    let rafId: number;
    let canvas: HTMLCanvasElement | null;
    let ctx: CanvasRenderingContext2D | null;
    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight - 200;

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

    return (
        <div className='universe'>
            <canvas ref={canvasRef} id='canvas' width={WIDTH} height={HEIGHT}></canvas>
        </div>
    );
}

export default Universe;