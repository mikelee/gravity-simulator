import React, { useState } from 'react';

import './controls.styles.scss';

import Planet from '../planet';

interface Props {
    dragMass: number,
    play: boolean,
    addPlanet: (planet: Planet) => void,
    clearPlanets: () => void,
    setDragMass: React.Dispatch<React.SetStateAction<number>>,
    togglePlay: () => void
}

const Controls: React.FC<Props> = ({ dragMass, play, addPlanet, clearPlanets, setDragMass, togglePlay }) => {
    // in increments of 10^24. To 10 decimal places
    const DEFAULT_DRAG_MASS = Math.round((dragMass / 10 ** 24) * 10 ** 10) / 10 ** 10;

    const [visible, setVisible] = useState(true);

    const changeDragMass = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        const mass = value * 10 ** 24;

        setDragMass(mass);
    }

    const createPlanet = (e: React.FormEvent<HTMLElement>) => {
        e.preventDefault();

        const mass: number = parseInt((e.target as HTMLFormElement).mass.value);
        const radius: any = parseInt((e.target as HTMLFormElement).radius.value);
        const xPosition: number = parseInt((e.target as HTMLFormElement).xPosition.value);
        const yPosition: number = parseInt((e.target as HTMLFormElement).yPosition.value);
        const xVelocity: number = parseInt((e.target as HTMLFormElement).xVelocity.value);
        const yVelocity: number = parseInt((e.target as HTMLFormElement).yVelocity.value);
        const color: string = (e.target as HTMLFormElement).color.value;

        const newPlanet = new Planet(mass, radius, xPosition, yPosition, xVelocity, yVelocity, color);

        addPlanet(newPlanet);
    }

    return (
        <div className='controls'>
            <button className='toggle-visible-button' onClick={() => setVisible(!visible)}>Toggle</button>
            {
                visible
                ?
                <section className='controls-section'>
                    <section>
                        <h1>Create Planet</h1>
                        <form className='properties' onSubmit={(e) => createPlanet(e)}>
                            <input name='mass' placeholder='mass' type='number' required />
                            <input name='radius' placeholder='radius' type='number' required />
                            <input name='xPosition' placeholder='x position' type='number' required />
                            <input name='yPosition' placeholder='y position' type='number' required />
                            <input name='xVelocity' placeholder='x velocity' type='number' required />
                            <input name='yVelocity' placeholder='y velocity' type='number' required />
                            <input name='color' placeholder='color' type='text' required />
                            <button className='create-planet-button' type='submit' >Create Planet</button>
                        </form>
                    </section>
                    <section>
                        <h1>Play Back</h1>
                        <button onClick={togglePlay}>{play ? 'Pause' : 'Play' }</button>
                        <button onClick={clearPlanets}>Clear Planets</button>
                    </section>
                    <section>
                        <h1>Drag controls</h1>
                        <section>
                            <h2>Mass (10^24 kg)</h2>
                            <input type='number' defaultValue={DEFAULT_DRAG_MASS} onChange={(e) => changeDragMass(e)} step='0.0000000001' />
                        </section>
                    </section>
                </section>
                : null
            }
        </div>
    );
}

export default Controls;