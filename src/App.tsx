import React, { useState } from 'react';

import './App.scss';

import Controls from './controls/controls.component';
import Universe from './universe/universe.component';

import Planet from './planet';

const DEFAULT_DRAG_MASS = 10 ** 24;

function App() {
    const [dragMass, setDragMass] = useState(DEFAULT_DRAG_MASS);
    const [planets, setPlanets] = useState<Planet[]>([]);
    const [play, setPlay] = useState(true);

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
            <Universe dragMass={dragMass} planets={planets} play={play} addPlanet={addPlanet} />
            <Controls addPlanet={addPlanet} play={play} togglePlay={togglePlay} clearPlanets={clearPlanets} dragMass={dragMass} setDragMass={setDragMass} />
        </div>
    );
}

export default App;