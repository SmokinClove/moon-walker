import React, {
  useState
} from 'react';
import Jackson from './Jackson';
import { DANCE_MODES, DANCE_MOVES } from './DanceMoves';
import Quote from './Quote';

import './Stars.css';


function useLoopIndex(maxIndex) {
  const [index, setIndex] = useState(0);
  const increment = () => {
    setIndex((index + 1) % maxIndex);
  };
  return [index, increment];
}


export default function DancerSpace() {

  const [on, setOn] = useState(false);
  const [delay, setDelay] = useState(700);

  const [danceModeIndex, incDanceModeIndex] = useLoopIndex(DANCE_MODES.length);
  const danceMode = DANCE_MODES[danceModeIndex];
  const danceMove = DANCE_MOVES[danceMode];

  // the use states
  const changeDelay = e => setDelay(e.target.value);
  const toggleDance = () => incDanceModeIndex();
  const toggleOn = () => setOn(!on);

  return (
    <div className='playground-moonwalk'>
      <div className='ceiling'>
        <Quote />
      </div>
      <div className='dancer-space'>
        <div className='stars'>
          <h1 style={{ color: 'white' }}>
            {' '}
            <center> Sun Will shine on us again!</center>
          </h1>
        </div>
        <div className='twinkling'></div>

        <Jackson on={on} delay={delay} danceMode={danceMode} hasShadow={true} />

      </div>

      <div className='stage'>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div
            className="button"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 'larger',
              background: 'white',
              padding: '0 20px',
              fontWeight: '700',
              color: on ? 'red' : 'green'
            }}
            onClick={toggleOn}
          >
            {on ? 'STOP' : 'START'}
          </div>
          <form>
            <input
              type='number'
              value={delay}
              onChange={changeDelay}
              style={{ height: '100px', fontSize: '30px' }}
            />
          </form>
          <div
            className="button"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 'larger',
              background: 'white',
              padding: '0 20px',
              fontWeight: '700'
            }}
            onClick={toggleDance}
          >
            {danceMove.name}
          </div>
        </div>
      </div>
    </div>
  );
}
