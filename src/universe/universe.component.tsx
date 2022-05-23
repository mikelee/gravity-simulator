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
    const handleMouseMove = (e: any) => {
        setLineEnd({
            x: e.clientX,
            y: e.clientY
       });
    }

    const mouseMoveRef = useRef<(this: HTMLCanvasElement, ev: MouseEvent) => any>(handleMouseMove);

    const canvasRef = useRef(null);
    const rafIdRef = useRef<number | null>(null);
    let rafId: number;
    let canvas: HTMLCanvasElement | null;
    let ctx: CanvasRenderingContext2D | null;
    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight - 200;

    const [lineStart, setLineStart] = useState<{ x: number, y: number } | null>(null);
    const [lineEnd, setLineEnd] = useState<{ x: number, y: number } | null>(null);

    useEffect(() => {
        if (canvasRef.current !== undefined) canvas = canvasRef.current;
        if (canvas) ctx = canvas.getContext('2d');

        rafIdRef.current = requestAnimationFrame(refresh);
        rafId = rafIdRef.current;

        if (ctx !== null) {
            ctx?.clearRect(0, 0, WIDTH, HEIGHT);
            planets.forEach(planet => {
                planet.draw(ctx as CanvasRenderingContext2D);
            });

            drawLine();
        }

        return () => {
            cancelAnimationFrame(rafId);
        }
    }, [planets, play, lineStart, lineEnd]);
    
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

        if (lineStart && lineEnd) {
            drawLine();
        }

        requestAnimationFrame(refresh);
    }

    const clickCanvas = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        setLineStart({x: e.clientX, y: e.clientY});

        if (canvasRef && canvasRef.current) {
            (canvasRef?.current as HTMLCanvasElement)?.addEventListener('mousemove', mouseMoveRef.current);
        }
    }

    const releaseClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if (canvasRef && canvasRef.current) {
            (canvasRef?.current as HTMLCanvasElement)?.removeEventListener('mousemove', mouseMoveRef.current);
        }

        if (lineStart) createPlanet(lineStart.x, lineStart.y, e.clientX, e.clientY);
        
        setLineStart(null);
        setLineEnd(null);
    }

    const drawLine = () => {
        if (ctx && lineStart && lineEnd) {
            ctx.beginPath();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 1;
            ctx.moveTo(lineStart.x, lineStart.y);
            ctx.lineTo(lineEnd.x, lineEnd.y);
            ctx.stroke();
        }
    }

    const createPlanet = (startX: number, startY: number, endX: number, endY: number) => {
        /*
            The lower the number, the more sensitive.
            Value must be positive.
       */
        const DRAG_SENSITIVITY = 100;

        const deltaX = endX - startX;
        const deltaY = endY - startY;

        // deltaX and deltaX are negative to shoot the planet in the opposite direction of the user's drag
        const xVelocity = -deltaX / DRAG_SENSITIVITY;
        const yVelocity = -deltaY / DRAG_SENSITIVITY;

        addPlanet(new Planet(99999999999, 10, startX, startY, xVelocity, yVelocity, 'red'));
    }

    return (
        <div className='universe'>
            <canvas ref={canvasRef} id='canvas' width={WIDTH} height={HEIGHT} onMouseDown={e => clickCanvas(e)} onMouseUp={e => releaseClick(e)} ></canvas>
        </div>
    );
}

export default Universe;