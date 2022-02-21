import React, { useState } from 'react';

import './App.scss';

import Universe from './universe/universe.component';

import Planet from './planet';

function App() {
  const [planets, setPlanets] = useState<Planet[]>([]);
  
  return (
    <div className='app'>
      <Universe planets={planets} />
    </div>
  );
}

export default App;