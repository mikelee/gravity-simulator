import React, { useState } from 'react';

import './controls.styles.scss';
import { ReactComponent as ArrowIcon } from '../assets/arrow.svg';
import { ReactComponent as ClearIcon } from '../assets/clear.svg';
import { ReactComponent as PauseIcon } from '../assets/pause.svg';
import { ReactComponent as PlanetIcon } from '../assets/planet.svg';
import { ReactComponent as PlayIcon } from '../assets/play.svg';
import { ReactComponent as StarIcon } from '../assets/star.svg';

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
    const MASS_EXPONENT = {
        planet: 24,
        star: 30
    };

    const [visible, setVisible] = useState(true);
    const [dragVisible, setDragVisible] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [massFactor, setMassFactor] = useState(1);
    const [selected, setSelected] = useState<'planet' | 'star'>('star');

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

        let mass: number = parseFloat((e.target as HTMLFormElement).mass.value);
        const xPosition: number = parseInt((e.target as HTMLFormElement).xPosition.value);
        const yPosition: number = parseInt((e.target as HTMLFormElement).yPosition.value);
        const xVelocity: number = parseFloat((e.target as HTMLFormElement).xVelocity.value);
        const yVelocity: number = parseFloat((e.target as HTMLFormElement).yVelocity.value);

        mass *= 10 ** MASS_EXPONENT[selected];

        const newPlanet = new Planet(mass, xPosition, yPosition, xVelocity, yVelocity, dragColor);

        addPlanet(newPlanet);
    }

    const setDragType = (type: 'planet' | 'star') => {
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
                                                <button className={`purple-button ${dragColor === 'purple' ? 'selected-color' : null}`} name='purple'></button>
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
                                        <input name='mass' placeholder={`mass (10^${MASS_EXPONENT[selected]} kg)`} type='number' step='.0000000001' required />
                                        <input name='xPosition' placeholder='x position' type='number' required />
                                        <input name='yPosition' placeholder='y position' type='number' required />
                                        <input name='xVelocity' placeholder='x velocity' type='number' step='.0000000001' required />
                                        <input name='yVelocity' placeholder='y velocity' type='number' step='.0000000001' required />
                                        <div className='color-buttons' onClick={e => changeDragColor(e)}>
                                            <button className={`red-button ${dragColor === 'red' ? 'selected-color' : null}`} name='red' type='button'></button>
                                            <button className={`green-button ${dragColor === 'green' ? 'selected-color' : null}`} name='green' type='button'></button>
                                            <button className={`blue-button ${dragColor === 'blue' ? 'selected-color' : null}`} name='blue' type='button'></button>
                                            <button className={`yellow-button ${dragColor === 'yellow' ? 'selected-color' : null}`} name='yellow' type='button'></button>
                                            <button className={`purple-button ${dragColor === 'purple' ? 'selected-color' : null}`} name='purple' type='button'></button>
                                        </div>
                                        <button className='button create-planet-button' type='submit'>Create {selected === 'planet' ? 'Planet' : 'Star'}</button>
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
                        <button className={ selected === 'star' ? 'selected' : '' } onClick={() => setDragType('star')}>
                            <StarIcon />
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