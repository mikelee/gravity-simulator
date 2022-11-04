import React, { useState } from 'react';

import './controls.styles.scss';
import { ReactComponent as PlanetIcon } from '../assets/planet.svg';
import { ReactComponent as SunIcon } from '../assets/sun.svg';

import Planet from '../planet';

interface Props {
    dragColor: 'red' | 'green' | 'blue' | 'yellow',
    dragMass: number,
    play: boolean,
    addPlanet: (planet: Planet) => void,
    clearPlanets: () => void,
    setDragColor: React.Dispatch<React.SetStateAction<'red' | 'green' | 'blue' | 'yellow'>>,
    setDragMass: React.Dispatch<React.SetStateAction<number>>,
    togglePlay: () => void
}

const Controls: React.FC<Props> = ({ dragColor, dragMass, play, addPlanet, clearPlanets, setDragColor, setDragMass, togglePlay }) => {
    // in increments of 10^24. To 10 decimal places
    const DEFAULT_DRAG_MASS = Math.round((dragMass / 10 ** 24) * 10 ** 10) / 10 ** 10;

    const [visible, setVisible] = useState(true);
    const [dragVisible, setDragVisible] = useState(false);
    const [formVisible, setFormVisible] = useState(false);

    const changeDragMass = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        const mass = value * 10 ** 24;

        setDragMass(mass);
    }

    const changeDragColor = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const color = (e.target as HTMLButtonElement).name;

        if (color) {
            setDragColor((color as 'red' | 'green' | 'blue' | 'yellow'));
        }
    }

    const createPlanet = (e: React.FormEvent<HTMLElement>) => {
        e.preventDefault();

        let mass: number = parseInt((e.target as HTMLFormElement).mass.value);
        const radius: any = parseInt((e.target as HTMLFormElement).radius.value);
        const xPosition: number = parseInt((e.target as HTMLFormElement).xPosition.value);
        const yPosition: number = parseInt((e.target as HTMLFormElement).yPosition.value);
        const xVelocity: number = parseInt((e.target as HTMLFormElement).xVelocity.value);
        const yVelocity: number = parseInt((e.target as HTMLFormElement).yVelocity.value);
        const color: string = (e.target as HTMLFormElement).color.value;

        mass *= 10 ** 24;

        const newPlanet = new Planet(mass, radius, xPosition, yPosition, xVelocity, yVelocity, color);

        addPlanet(newPlanet);
    }

    const setDragType = (type: string) => {
        if (type === 'planet') {
            setDragMass(10 ** 24);
            setDragColor('blue');
        } else {
            setDragMass(10 ** 30);
            setDragColor('yellow');
        }
    }

    return (
        <div className='controls'>
            <button className='toggle-visible-button' onClick={() => setVisible(!visible)}>
                <svg className={`arrow-icon ${visible ? 'rotate-arrow' : null}`} width="104" height="92" viewBox="0 0 104 92" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="95" width="10" height="100" rx="5" transform="rotate(30 95 0)" fill="white"/>
                    <rect y="5" width="10" height="100" rx="5" transform="rotate(-30 0 5)" fill="white"/>
                </svg>
            </button>
            {
                visible
                ?
                <section className='controls-section'>
                    <div className='dropdowns'>
                        <section className='drag-section'>
                            <button className='drag-button' onClick={() => setDragVisible(!dragVisible)} >Drag Settings</button>
                            {
                                dragVisible
                                ?
                                    <div className='drag-settings'>
                                        <section>
                                            <h2>Color</h2>
                                            <div className='color-buttons' onClick={e => changeDragColor(e)}>
                                                <button className={`red-button ${dragColor === 'red' ? 'selected-color' : null}`} name='red'></button>
                                                <button className={`green-button ${dragColor === 'green' ? 'selected-color' : null}`} name='green'></button>
                                                <button className={`blue-button ${dragColor === 'blue' ? 'selected-color' : null}`} name='blue'></button>
                                                <button className={`yellow-button ${dragColor === 'yellow' ? 'selected-color' : null}`} name='yellow'></button>
                                            </div>
                                        </section>
                                        <section>
                                            <h2>Mass (10^24 kg)</h2>
                                            <input type='number' defaultValue={DEFAULT_DRAG_MASS} onChange={(e) => changeDragMass(e)} step='0.0000000001' />
                                        </section>
                                    </div>
                                : null
                            }
                        </section>
                        <section className='form-section'>
                            <button className='form-button' onClick={() => setFormVisible(!formVisible)} >Form</button>
                            {
                                formVisible
                                ?
                                    <form className='properties' onSubmit={(e) => createPlanet(e)}>
                                        <input name='mass' placeholder='mass (10^24 kg)' type='number' required />
                                        <input name='radius' placeholder='radius' type='number' required />
                                        <input name='xPosition' placeholder='x position' type='number' required />
                                        <input name='yPosition' placeholder='y position' type='number' required />
                                        <input name='xVelocity' placeholder='x velocity' type='number' required />
                                        <input name='yVelocity' placeholder='y velocity' type='number' required />
                                        <input name='color' placeholder='color' type='text' required />
                                        <button className='button create-planet-button' type='submit' >Create Planet</button>
                                    </form>
                                : null
                            }
                        </section>
                    </div>
                    <div className='buttons'>
                        <button className='button' onClick={clearPlanets}>Clear</button>
                        <button className='button' onClick={togglePlay}>{play ? 'Pause' : 'Play' }</button>
                        <button onClick={() => setDragType('sun')}>
                            <SunIcon />
                        </button>
                        <button onClick={() => setDragType('planet')}>
                            <PlanetIcon />
                        </button>
                    </div>
                </section>
                : null
            }
        </div>
    );
}

export default Controls;