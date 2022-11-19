import React, { useState } from 'react';

import './App.scss';

import Controls from './controls/controls.component';
import Universe from './universe/universe.component';

import Planet from './planet';

export type Color = 'red' | 'green' | 'blue' | 'yellow' | 'purple';

const DEFAULT_DRAG_MASS = 10 ** 24;

function App() {
    const [planets, setPlanets] = useState<Planet[]>([]);
    const [play, setPlay] = useState(true);
    // drag controls
    const [dragColor, setDragColor] = useState<Color>('red');
    const [dragMass, setDragMass] = useState(DEFAULT_DRAG_MASS);
    
    const addPlanet = (planet: Planet) => {
        setPlanets([
            ...planets,
            planet
        ]);
    }

    const clearPlanets = () => {
        setPlanets([]);
    }

    function togglePlay() {
        setPlay(!play);
    }
    
    return (
        <div className='app'>
            <Universe dragColor={dragColor} dragMass={dragMass} planets={planets} play={play} addPlanet={addPlanet} />
            <Controls addPlanet={addPlanet} play={play} togglePlay={togglePlay} clearPlanets={clearPlanets} dragColor={dragColor} setDragColor={setDragColor} dragMass={dragMass} setDragMass={setDragMass} />
        </div>
    );
}

export default App;