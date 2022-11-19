import React, { useEffect, useRef, useState } from 'react';
import useWindowSize from '../hooks/useWindow';

import './universe.styles.scss';

import Planet from '../planet';

interface Props {
    dragColor: 'red' | 'green' | 'blue' | 'yellow' | 'purple',
    dragMass: number,
    planets: Planet[],
    play: boolean,
    addPlanet: (planet: Planet) => void
}

const Universe: React.FC<Props> = ({ dragColor, dragMass, planets, play, addPlanet }) => {
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

            drawArrow();
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

        if (lineStart && lineEnd) {
            drawArrow();
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

    const drawArrow = () => {
        if (ctx && lineStart && lineEnd) {
            const deltaX = lineEnd.x - lineStart.x;
            const deltaY = lineEnd.y - lineStart.y;
            
            const barbSlopes = calcBarbSlopes(deltaX, deltaY);
            
            const leftBarb = calcBarbEndpoint(barbSlopes.leftSlope, barbSlopes.leftAngle, lineStart, deltaX);
            const rightBarb = calcBarbEndpoint(barbSlopes.rightSlope, barbSlopes.rightAngle, lineStart, deltaX);

            // straight line
            ctx.beginPath();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 1;
            ctx.moveTo(lineStart.x, lineStart.y);
            ctx.lineTo(lineEnd.x, lineEnd.y);
            ctx.stroke();
            
            // left barb when arrow pointing up
            ctx.beginPath();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 1;
            ctx.moveTo(lineStart.x, lineStart.y);
            ctx.lineTo(leftBarb.x, leftBarb.y);
            ctx.stroke();

            // right barb when arrow pointing up
            ctx.beginPath();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 1;
            ctx.moveTo(lineStart.x, lineStart.y);
            ctx.lineTo(rightBarb.x, rightBarb.y);
            ctx.stroke();
        }
    }

    const calcBarbEndpoint = (slope: number, angle: number, lineStart: { x: number, y: number }, baseDeltaX: number) => {
        const ARROW_LENGTH = 15;

        // don't need to calculate xDirection because the +- function determines x direction later on
        let yDirection;

        if (slope >= 0) {
            yDirection = 1;
        } else {
            yDirection = -1;
        }

        let x;
        let y;

        /*
            How to derive equations to solve for x and y

            solve for x and y so that:
                1) y/x = slope
                2) x^2 + y^2 = ARROW_LENGTH^2
            set both equal to y, combine equations, and solve for x
                y/x = slope
                y = slope * x

                EQUATION 1
                y = slope * x

                
                x^2 + y^2 = ARROW_LENGTH^2
                y^2 = ARROW_LENGTH^2 - x^2
                y = sqrt(ARROW_LENGTH^2 - x^2)
                
                EQUATION 2
                y = sqrt(ARROW_LENGTH^2 - x^2)
                
                slope * x = sqrt(ARROW_LENGTH^2 - x^2)
                slope^2 * x^2 = ARROW_LENGTH^2 - x^2
                slope^2 * x^2 = ARROW_LENGTH^2 - x^2
                slope^2 * x^2 + x^2 = ARROW_LENGTH^2
                x^2(slope^2 + 1) = ARROW_LENGTH^2
                x^2 = ARROW_LENGTH^2 / (slope^2 + 1)
                x = +- sqrt(ARROW_LENGTH^2 / (slope^2 + 1))

                *********************************************
                x = +- sqrt(ARROW_LENGTH^2 / (slope^2 + 1))
                *********************************************
                plug x into equation 1 or 2 to get y
        */
       
        // prevent right/left barb from using negative function when it is still on the positive x side and the baseline is on the negative side
        // side note (not needed): if dy > 0, this will be the right barb. If dy < 0, this will be the left barb
        if ((Math.abs(angle) >= Math.PI / 2 && baseDeltaX < 0)) {
            x = (ARROW_LENGTH / (Math.sqrt((slope ** 2) + 1)));
        } else if (Math.abs(angle) >= Math.PI / 2 || baseDeltaX < 0) {
            x = -(ARROW_LENGTH / (Math.sqrt((slope ** 2) + 1)));
            yDirection *= -1;
        } else {
            x = (ARROW_LENGTH / (Math.sqrt((slope ** 2) + 1)));
        }

        y = Math.sqrt((ARROW_LENGTH ** 2 - x ** 2));

        let endPoint;

        endPoint = {
            x: lineStart.x + x,
            y: lineStart.y + y * yDirection
        }

        return endPoint;
    }

    const calcBarbSlopes = (deltaX: number, deltaY: number) => {
        const baseSlope = deltaY / deltaX;

        const baseAngle = Math.atan(baseSlope);

        // create angles +/- .5 radians from base line's angle
        const leftAngle = baseAngle + .5;
        const rightAngle = baseAngle - .5;

        const leftSlope = Math.tan(leftAngle);
        const rightSlope = Math.tan(rightAngle);

        return {
            leftSlope, rightSlope, leftAngle, rightAngle
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

        // deltaX and deltaY are negative to shoot the planet in the opposite direction of the user's drag
        const xVelocity = -deltaX / DRAG_SENSITIVITY;
        const yVelocity = -deltaY / DRAG_SENSITIVITY;

        addPlanet(new Planet(dragMass, startX, startY, xVelocity, yVelocity, dragColor));
    }

    return (
        <div className='universe'>
            <canvas ref={canvasRef} id='canvas' width={windowSize.width} height={windowSize.height} onMouseDown={e => clickCanvas(e)} onMouseUp={e => releaseClick(e)} ></canvas>
        </div>
    );
}

export default Universe;