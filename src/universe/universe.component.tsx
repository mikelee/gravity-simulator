import React, { useEffect, useRef, useState } from 'react';
import useWindowSize from '../hooks/useWindow';
import drawArrow from '../drawArrow';

import './universe.styles.scss';

import { Color } from '../App';
import Planet from '../planet';

interface Props {
    dragColor: Color,
    dragMass: number,
    planets: Planet[],
    play: boolean,
    addPlanet: (planet: Planet) => void
}

const Universe: React.FC<Props> = ({ dragColor, dragMass, planets, play, addPlanet }) => {
    const handleMouseMove = (e: MouseEvent) => {
        setLineEnd({
            x: e.clientX,
            y: e.clientY
       });
    }

    const mouseMoveRef = useRef(handleMouseMove);
    const canvasRef = useRef(null);
    const rafIdRef = useRef<number | null>(null);
    
    let rafId: number;
    let canvas: HTMLCanvasElement | null;
    let ctx: CanvasRenderingContext2D | null;

    const [lineStart, setLineStart] = useState<{ x: number, y: number } | null>(null);
    const [lineEnd, setLineEnd] = useState<{ x: number, y: number } | null>(null);

    const windowSize = useWindowSize();

    useEffect(() => {
        if (canvasRef.current !== undefined) canvas = canvasRef.current;
        if (canvas) ctx = canvas.getContext('2d');

        rafIdRef.current = requestAnimationFrame(refresh);
        rafId = rafIdRef.current;

        if (ctx !== null) {
            ctx?.clearRect(0, 0, windowSize.width, windowSize.height);
            planets.forEach(planet => {
                planet.draw(ctx as CanvasRenderingContext2D);
            });

            if (lineStart && lineEnd) {
                drawArrow(ctx, lineStart, lineEnd);
            }
        }

        return () => {
            cancelAnimationFrame(rafId);
        }
    }, [planets, play, lineStart, lineEnd]);
    
    const refresh = () => {
        if (rafId !== rafIdRef.current) return;
        if (!play) return;

        ctx?.clearRect(0, 0, windowSize.width, windowSize.height);

        planets.forEach(planet => {
            const otherPlanets = planets.filter(otherPlanet => otherPlanet !== planet);

            otherPlanets.forEach(otherPlanet => {
                planet.calcDeltaVelocities(otherPlanet);
            });
        });

        planets.forEach(planet => {
            const otherPlanets = planets.filter(otherPlanet => otherPlanet !== planet);

            otherPlanets.forEach(otherPlanet => {
                const collision = planet.checkCollision(otherPlanet);

                if (collision === 'survived') {
                    // delete otherPlanet
                    for (let i = 0; i < planets.length; i++) {
                        if (planets[i].id === otherPlanet.id) {
                            planets.splice(i, 1);
                        }
                    }
                } else if (collision === 'died') {
                    // delete planet
                    for (let i = 0; i < planets.length; i++) {
                        if (planets[i].id === planet.id) {
                            planets.splice(i, 1);
                        }
                    }
                }
            });
        });

        planets.forEach(planet => {
            planet.move();
            if (ctx) planet.draw(ctx);
        });

        if (ctx && lineStart && lineEnd) {
            drawArrow(ctx, lineStart, lineEnd);
        }

        requestAnimationFrame(refresh);
    }

    const startClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        setLineStart({x: e.clientX, y: e.clientY});

        if (canvasRef && canvasRef.current) {
            (canvasRef.current as HTMLCanvasElement).addEventListener('mousemove', mouseMoveRef.current);
        }
    }

    const endClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if (canvasRef && canvasRef.current) {
            (canvasRef.current as HTMLCanvasElement).removeEventListener('mousemove', mouseMoveRef.current);
        }

        if (lineStart) createPlanet(lineStart.x, lineStart.y, e.clientX, e.clientY);
        
        setLineStart(null);
        setLineEnd(null);
    }

    const createPlanet = (startX: number, startY: number, endX: number, endY: number) => {
        /*
            The lower the number, the more sensitive.
            Value must be positive.
       */
        const DRAG_SENSITIVITY = 100;

        const deltaX = endX - startX;
        const deltaY = endY - startY;

        // deltaX and deltaY are negative to shoot the planet in the opposite direction of the user's drag
        const xVelocity = -deltaX / DRAG_SENSITIVITY;
        const yVelocity = -deltaY / DRAG_SENSITIVITY;

        addPlanet(new Planet(dragMass, startX, startY, xVelocity, yVelocity, dragColor));
    }

    return (
        <div className='universe'>
            <canvas ref={canvasRef} id='canvas' width={windowSize.width} height={windowSize.height} onMouseDown={e => startClick(e)} onMouseUp={e => endClick(e)} ></canvas>
        </div>
    );
}

export default Universe;