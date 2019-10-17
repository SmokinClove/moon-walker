import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef
} from 'react';
import './Jackson.css';
import './Stars.css';
import { DANCE_MOVES } from './DanceMoves';

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

function useDanceMoveRef(danceMove) {
  const danceMoveRef = useRef();
  useLayoutEffect(() => {
    danceMoveRef.current = danceMove;
  }, [danceMove]);
  return danceMoveRef;
}

function useDanceMove(danceMove, index) {
  // body parts
  const [leftLegUpper, setLeftLegUpperStage] = useDanceStage();
  const [leftLegLower, setLeftLegLowerStage] = useDanceStage();
  const [leftLegFoot, setLeftLegFootStage] = useDanceStage();
  const [rightLegUpper, setRightLegUpperStage] = useDanceStage();
  const [rightLegLower, setRightLegLowerStage] = useDanceStage();
  const [rightLegFoot, setRightLegFootStage] = useDanceStage();

  // capture the danceMove, so that when dance move change wont trigger a movement
  const danceMoveRef = useDanceMoveRef(danceMove);

  // advance to the next step of the dance
  const moveBodyParts = useCallback(
    index => {
      const nextLeftLegStage = danceMoveRef.current.leftLegStages[index];
      const nextRightLegStage = danceMoveRef.current.rightLegStages[index];
      setLeftLegUpperStage(nextLeftLegStage);
      setLeftLegLowerStage(nextLeftLegStage);
      setLeftLegFootStage(nextLeftLegStage);
      setRightLegUpperStage(nextRightLegStage);
      setRightLegLowerStage(nextRightLegStage);
      setRightLegFootStage(nextRightLegStage);
    },
    [
      danceMoveRef,
      setLeftLegFootStage,
      setLeftLegLowerStage,
      setLeftLegUpperStage,
      setRightLegFootStage,
      setRightLegLowerStage,
      setRightLegUpperStage
    ]
  );

  // dance with index
  useLayoutEffect(() => moveBodyParts(index), [index, moveBodyParts]);

  return {
    leftLegUpper,
    leftLegLower,
    leftLegFoot,
    rightLegUpper,
    rightLegLower,
    rightLegFoot
  };
}

function useLoopDancePosition(danceMove, index, fixedOffset) {
  // body positions
  const [rightOffset, setRightOffset] = useState(0);
  const [animDur, setAnimDur] = useState(0.7);
  const jackson = useRef();

  // capture the danceMove, so that when dance move change wont trigger a movement
  const danceMoveRef = useDanceMoveRef(danceMove);

  const moveDancePosition = useCallback(
    index => {
      // Shadow dancer just uses the fixedOffset of the parent dancer
      if (typeof fixedOffset != 'undefined') {
        let currentOffset;
        setRightOffset(
          rightOffset => {
            currentOffset = rightOffset;
            return fixedOffset;
          }
        );
        setAnimDur(currentOffset < fixedOffset ? danceMoveRef.current.dancePosition.animationDuration : 0);
      } else if (
        jackson.current &&
        jackson.current.getBoundingClientRect().right <= -10
      ) {
        setRightOffset(0);
        setAnimDur(0);
      } else {
        setRightOffset(
          rightOffset =>
            rightOffset + danceMoveRef.current.dancePosition.rightOffset
        );
        setAnimDur(danceMoveRef.current.dancePosition.animationDuration);
      }
    },
    [danceMoveRef, fixedOffset]
  );

  const getJacksonStyle = index => ({
    right: rightOffset,
    transition: `right ${animDur}s ${danceMove.dancePosition.animation[index]}`
  });

  // dance with index
  useLayoutEffect(() => moveDancePosition(index), [index, moveDancePosition]);

  return [jackson, rightOffset, getJacksonStyle];
}


export default function Jackson(props) {
  // dances
  const danceMove = DANCE_MOVES[props.danceMode];

  // moves
  const totalMoves = danceMove.leftLegStages.length;
  const [danceMoveIndex, nextDanceMove] = useLoopIndex(totalMoves);
  const jacksonBodyParts = useDanceMove(danceMove, danceMoveIndex);

  // positions
  const totalPositions = danceMove.dancePosition.animation.length;
  const [dancePosIndex, nextDancePosition] = useLoopIndex(totalPositions);
  const [jackson, rightOffset, getJacksonStyle] = useLoopDancePosition(
    danceMove,
    dancePosIndex,
    props.fixedOffset
  );

  // advance to the next step of the dance
  const moveOneIndex = () => {
    nextDanceMove();
    nextDancePosition();
  };

  useInterval(
    moveOneIndex,
    props.on ? props.delay : null
  ); /* <-- This is the main call that kicks off the dancing */

  let shadowDancer = <div />;
  if (props.hasShadow) {
    shadowDancer = (
      <div className="shadow">
        <Jackson on={props.on} delay={props.delay} danceMode={props.danceMode} fixedOffset={rightOffset} />
      </div>
    );
  };


  return (
  <div>
    <div
      className={`micheal-jackson ${props.className || ''}`}
      ref={jackson}
      style={{
        ...getJacksonStyle(dancePosIndex),
        transform: danceMove.bodyTransform
      }}
    >
      <div className='head'>
        <div className='hat'>
          <div className='hat-top'></div>
          <div className='hat-bottom'></div>
        </div>
        <div className='face'></div>
      </div>
      <div className='body'>
        <div className='left-arm'></div>
        <div className='right-arm'></div>
      </div>
      <div className='legs'>
        <div className='left-leg' id='left-leg'>
          <div
            className='leg-upper  stage-1'
            ref={jacksonBodyParts.leftLegUpper}
          ></div>
          <div
            className='leg-lower stage-1'
            ref={jacksonBodyParts.leftLegLower}
          ></div>
          <div
            className='foot stage-1'
            ref={jacksonBodyParts.leftLegFoot}
          ></div>
        </div>
        <div className='right-leg' id='right-leg'>
          <div
            className='leg-upper stage-3'
            ref={jacksonBodyParts.rightLegUpper}
          ></div>
          <div
            className='leg-lower stage-3'
            ref={jacksonBodyParts.rightLegLower}
          ></div>
          <div
            className='foot stage-3'
            ref={jacksonBodyParts.rightLegFoot}
          ></div>
        </div>
      </div>
    </div>
    {shadowDancer}
  </div>
  );
}
