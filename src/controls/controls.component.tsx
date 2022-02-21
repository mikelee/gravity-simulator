import React from 'react';

import './controls.styles.scss';

import Planet from '../planet';

interface Props {
    addPlanet: (planet: Planet) => void
}

const Controls: React.FC<Props> = ({ addPlanet }) => {

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
        <section className='controls' onSubmit={(e) => createPlanet(e)}>
            <form className='properties'>
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
    );
}

export default Controls;