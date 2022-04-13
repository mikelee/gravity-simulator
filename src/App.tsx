import React, { useState } from 'react';

import './App.scss';

import Controls from './controls/controls.component';
import Universe from './universe/universe.component';

import Planet from './planet';

function App() {
    const [planets, setPlanets] = useState<Planet[]>([]);
    const [play, setPlay] = useState(true);

    const addPlanet = (planet: Planet) => {
        setPlanets([
            ...planets,
            planet
        ]);
    }

    function togglePlay() {
        setPlay(!play);
    }
    
    return (
        <div className='app'>
            <Universe planets={planets} play={play} />
            <Controls addPlanet={addPlanet} play={play} togglePlay={togglePlay} />
        </div>
    );
}

export default App;