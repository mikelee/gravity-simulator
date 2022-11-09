import React, { useState } from 'react';

import './controls.styles.scss';
import { ReactComponent as ArrowIcon } from '../assets/arrow.svg';
import { ReactComponent as ClearIcon } from '../assets/clear.svg';
import { ReactComponent as PauseIcon } from '../assets/pause.svg';
import { ReactComponent as PlanetIcon } from '../assets/planet.svg';
import { ReactComponent as PlayIcon } from '../assets/play.svg';
import { ReactComponent as SunIcon } from '../assets/sun.svg';

import { Color } from '../App';
import Planet from '../planet';

interface Props {
    dragColor: Color,
    dragMass: number,
    play: boolean,
    addPlanet: (planet: Planet) => void,
    clearPlanets: () => void,
    setDragColor: React.Dispatch<React.SetStateAction<Color>>,
    setDragMass: React.Dispatch<React.SetStateAction<number>>,
    togglePlay: () => void
}

const Controls: React.FC<Props> = ({ dragColor, dragMass, play, addPlanet, clearPlanets, setDragColor, setDragMass, togglePlay }) => {
    // in increments of 10^24. To 10 decimal places
    const DEFAULT_DRAG_MASS = Math.round((dragMass / 10 ** 24) * 10 ** 10) / 10 ** 10;
    const MASS_EXPONENT = {
        planet: 24,
        sun: 30
    };

    const [visible, setVisible] = useState(true);
    const [dragVisible, setDragVisible] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [massFactor, setMassFactor] = useState(1);
    const [selected, setSelected] = useState<'planet' | 'sun'>('planet');

    const changeDragMass = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);

        if (value > 0) {
            setMassFactor(value);
    
            const massExponent = 10 ** MASS_EXPONENT[selected];

            setDragMass(value * massExponent);
        }
    }

    const changeDragColor = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const color = (e.target as HTMLButtonElement).name;

        if (color) {
            setDragColor((color as Color));
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

        mass *= 10 ** MASS_EXPONENT[selected];

        const newPlanet = new Planet(mass, radius, xPosition, yPosition, xVelocity, yVelocity, color);

        addPlanet(newPlanet);
    }

    const setDragType = (type: 'planet' | 'sun') => {
        setSelected(type);

        const mass = massFactor * 10 ** MASS_EXPONENT[type];

        setDragMass(mass);

        if (type === 'planet') {
            setDragColor('blue');
        } else {
            setDragColor('yellow');
        }
    }

    return (
        <div className='controls'>
            <button className={`toggle-visible-button ${visible ? 'rotate-arrow' : ''}`} onClick={() => setVisible(!visible)}>
                <ArrowIcon />
            </button>
            {
                visible
                ?
                <section className='controls-section'>
                    <div className='dropdowns'>
                        <section className='drag-section'>
                            <button className='dropdown-button drag-button' onClick={() => setDragVisible(!dragVisible)} >Drag Settings</button>
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
                                            <h2>{`Mass (10^${MASS_EXPONENT[selected]} kg)`}</h2>
                                            <input type='number' defaultValue={massFactor} onChange={(e) => changeDragMass(e)} step='0.0000000001' />
                                        </section>
                                    </div>
                                : null
                            }
                        </section>
                        <section className='form-section'>
                            <button className='dropdown-button form-button' onClick={() => setFormVisible(!formVisible)} >Form</button>
                            {
                                formVisible
                                ?
                                    <form className='properties' onSubmit={(e) => createPlanet(e)}>
                                        <input name='mass' placeholder={`mass (10^${MASS_EXPONENT[selected]} kg)`} type='number' required />
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
                        <button onClick={clearPlanets}>
                            <ClearIcon />
                        </button>
                        <button onClick={togglePlay}>
                            { play ? <PauseIcon /> : <PlayIcon /> }
                        </button>
                        <button className={ selected === 'sun' ? 'selected' : '' } onClick={() => setDragType('sun')}>
                            <SunIcon />
                        </button>
                        <button className={ selected === 'planet' ? 'selected' : '' } onClick={() => setDragType('planet')}>
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