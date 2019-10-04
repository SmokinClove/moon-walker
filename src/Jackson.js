import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Jackson.css';
// the original duck walk https://www.youtube.com/watch?v=EqS76TFCCYs

// useInterval
// copied wholesale from https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      !!savedCallback.current && savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function useLoopIndex(maxIndex) {
  const [index, setIndex] = useState(0);
  const increment = () => {
    setIndex((index + 1) % maxIndex);
  };
  return [index, increment];
}

function useDanceStage() {
  const bodyPartRef = useRef();
  const setDanceStage = stageName => {
    if (bodyPartRef.current) {
      const classNames = Array.from(bodyPartRef.current.classList.values());
      for (const className of classNames) {
        if (className.startsWith('stage'))
          bodyPartRef.current.classList.remove(className);
      }
      bodyPartRef.current.classList.add(stageName);
    }
  };
  return [bodyPartRef, setDanceStage];
}

function useDanceMove(danceMove, index) {
  // body parts
  const [leftLegUpper, setLeftLegUpperStage] = useDanceStage();
  const [leftLegLower, setLeftLegLowerStage] = useDanceStage();
  const [leftLegFoot, setLeftLegFootStage] = useDanceStage();
  const [rightLegUpper, setRightLegUpperStage] = useDanceStage();
  const [rightLegLower, setRightLegLowerStage] = useDanceStage();
  const [rightLegFoot, setRightLegFootStage] = useDanceStage();

  // advance to the next step of the dance
  const moveBodyParts = useCallback(
    index => {
      const nextLeftLegStage = danceMove.leftLegStages[index];
      const nextRightLegStage = danceMove.rightLegStages[index];
      setLeftLegUpperStage(nextLeftLegStage);
      setLeftLegLowerStage(nextLeftLegStage);
      setLeftLegFootStage(nextLeftLegStage);
      setRightLegUpperStage(nextRightLegStage);
      setRightLegLowerStage(nextRightLegStage);
      setRightLegFootStage(nextRightLegStage);
    },
    [
      danceMove,
      setLeftLegFootStage,
      setLeftLegLowerStage,
      setLeftLegUpperStage,
      setRightLegFootStage,
      setRightLegLowerStage,
      setRightLegUpperStage,
    ]
  );

  // dance with index
  useEffect(() => moveBodyParts(index), [index, moveBodyParts]);

  return {
    leftLegUpper,
    leftLegLower,
    leftLegFoot,
    rightLegUpper,
    rightLegLower,
    rightLegFoot,
  };
}

function useLoopDancePosition(danceMove, index) {
  // body positions
  const [rightOffset, setRightOffset] = useState(0);
  const [animDur, setAnimDur] = useState(0.7);
  const jackson = useRef();

  const moveDancePosition = useCallback(
    index => {
      if (
        jackson.current &&
        jackson.current.getBoundingClientRect().right <= 0
      ) {
        setRightOffset(0);
        setAnimDur(0);
      } else {
        setRightOffset(
          rightOffset => rightOffset + danceMove.dancePosition.rightOffset
        );
        setAnimDur(danceMove.dancePosition.animationDuration);
      }
    },
    [danceMove]
  );

  const getJacksonStyle = index => ({
    right: rightOffset,
    transition: `right ${animDur}s ${danceMove.dancePosition.animation[index]}`,
  });

  // dance with index
  useEffect(() => moveDancePosition(index), [index, moveDancePosition]);

  return [jackson, getJacksonStyle];
}

const DANCE_MOVES = {
  MOON_WALK: {
    name: 'Moon walk',
    leftLegStages: ['stage-1', 'stage-2', 'stage-3', 'stage-2'],
    rightLegStages: ['stage-3', 'stage-2', 'stage-1', 'stage-2'],
    dancePosition: {
      rightOffset: 60,
      animationDuration: 0.7,
      animation: [
        /* animations */
        /* 0: ease in */ 'cubic-bezier(.87,.57,1,.68)',
        /* 1: ease out */ 'cubic-bezier(0,.06,0,1.16)',
        /* 2: ease in */ 'cubic-bezier(.87,.57,1,.68)',
        /* 3: ease out */ 'cubic-bezier(0,.06,0,1.16)',
      ],
    },
  },
  DUCK_WALK: {
    name: 'Duck walk',
    leftLegStages: ['stage-4', 'stage-6', 'stage-4', 'stage-6'],
    rightLegStages: ['stage-5', 'stage-7', 'stage-5', 'stage-7'],
    dancePosition: {
      rightOffset: 60,
      animationDuration: 0.7,
      animation: [
        /* animations */
        /* 0: ease in */ 'cubic-bezier(.87,.57,1,.68)',
        /* 1: ease out */ 'cubic-bezier(0,.06,0,1.16)',
        /* 2: ease in */ 'cubic-bezier(.87,.57,1,.68)',
        /* 3: ease out */ 'cubic-bezier(0,.06,0,1.16)',
      ],
    },
    bodyTransform: 'scaleX(-1)',
  },
};
const DANCE_MODES = Object.keys(DANCE_MOVES);

export default function Jackson() {
  /* states */
  const [danceModeIndex, incDanceModeIndex] = useLoopIndex(DANCE_MODES.length);
  const danceMode = DANCE_MODES[danceModeIndex];

  const [on, setOn] = useState(false);
  const [delay, setDelay] = useState(700);

  // dances
  const danceMove = DANCE_MOVES[danceMode];

  // moves
  const totalMoves = danceMove.leftLegStages.length;
  const [danceMoveIndex, nextDanceMove] = useLoopIndex(totalMoves);
  const jacksonBodyParts = useDanceMove(danceMove, danceMoveIndex);

  // positions
  const totalPositions = danceMove.dancePosition.animation.length;
  const [dancePosIndex, nextDancePosition] = useLoopIndex(totalPositions);
  const [jackson, getJacksonStyle] = useLoopDancePosition(
    danceMove,
    dancePosIndex
  );

  // the use states
  const changeDelay = e => setDelay(e.target.value);
  const toggleDance = () => incDanceModeIndex();
  const toggleOn = () => setOn(!on);

  // advance to the next step of the dance
  const moveOneIndex = () => {
    nextDanceMove();
    nextDancePosition();
  };

  useInterval(
    moveOneIndex,
    on ? delay : null
  ); /* <-- This is the main call that kicks off the dancing */

  return (
    <div className="playground-moonwalk">
      <div className="ceiling"></div>
      <div className="dancer-space">
        <div
          className="micheal-jackson"
          id="micheal-jackson"
          ref={jackson}
          style={{
            ...getJacksonStyle(dancePosIndex),
            transform: danceMove.bodyTransform,
          }}
        >
          <div className="head">
            <div className="hat">
              <div className="hat-top"></div>
              <div className="hat-bottom"></div>
            </div>
            <div className="face"></div>
          </div>
          <div className="body">
            <div className="left-arm"></div>
            <div className="right-arm"></div>
          </div>
          <div className="legs">
            <div className="left-leg" id="left-leg">
              <div
                className="leg-upper  stage-1"
                ref={jacksonBodyParts.leftLegUpper}
              ></div>
              <div
                className="leg-lower stage-1"
                ref={jacksonBodyParts.leftLegLower}
              ></div>
              <div
                className="foot stage-1"
                ref={jacksonBodyParts.leftLegFoot}
              ></div>
            </div>
            <div className="right-leg" id="right-leg">
              <div
                className="leg-upper stage-3"
                ref={jacksonBodyParts.rightLegUpper}
              ></div>
              <div
                className="leg-lower stage-3"
                ref={jacksonBodyParts.rightLegLower}
              ></div>
              <div
                className="foot stage-3"
                ref={jacksonBodyParts.rightLegFoot}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className="stage">
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 'larger',
              background: 'white',
              padding: '0 20px',
              fontWeight: '700',
              color: on ? 'red' : 'green',
            }}
            onClick={toggleOn}
          >
            {on ? 'STOP' : 'START'}
          </div>
          <form>
            <input
              type="number"
              value={delay}
              onChange={changeDelay}
              style={{ height: '100px', fontSize: '30px' }}
            />
          </form>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 'larger',
              background: 'white',
              padding: '0 20px',
              fontWeight: '700',
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
