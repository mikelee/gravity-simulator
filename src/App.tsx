import React, { useState } from 'react';

import './App.scss';

import Controls from './controls/controls.component';
import Universe from './universe/universe.component';

import Planet from './planet';

function App() {
    const [planets, setPlanets] = useState<Planet[]>([]);

    const addPlanet = (planet: Planet) => {
        setPlanets([
            ...planets,
            planet
        ]);
    }
    
    return (
        <div className='app'>
            <Universe planets={planets} />
            <Controls addPlanet={addPlanet} />
        </div>
    );
}

export default App;