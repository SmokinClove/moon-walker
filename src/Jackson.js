import React, { useState, useEffect, useCallback } from "react";
import useInterval from './useInterval';
import './Jackson.css';
// the original duck walk https://www.youtube.com/watch?v=EqS76TFCCYs
export default function Jackson() {
  const leftLegStages = ["stage-1", "stage-2", "stage-3", "stage-2"];
  const rightLegStages = ["stage-3", "stage-2", "stage-1", "stage-2"];
  const duckLeftLegStages = ["stage-4", "stage-6", "stage-4", "stage-6"];
  const duckRightLegStages = ["stage-5", "stage-7", "stage-5", "stage-7"];
  const animationTimingFunc = ["cubic-bezier(.87,.57,1,.68)", "cubic-bezier(0,.06,0,1.16)", "cubic-bezier(.87,.57,1,.68)", "cubic-bezier(0,.06,0,1.16)"];
  /* animations
  0: ease in
  1: ease out
  2: ease in
  3: ease out
  */
  const NUM_MOVES = 4;
  const DUCK_WALK_MODE = 1;
  const MOON_WALK_MODE = 0;
  /* states */
  const [rightOffset, setRightOffset] = useState(0);
  const [rightPos, setRightPos] = useState(0);
  const [index, setIndex] = useState(1);
  const [animStage, setAnimStage] = useState(0);
  const [animFunc, setAnimFunc] = useState("");
  const [danceMode, setDanceMode] = useState(MOON_WALK_MODE); /* 0: moon walk, 1: dance walk */
  const [on, setOn] = useState(false);
  const [delay, setDelay] = useState(700);

  const jackson = useCallback(node => {
    if(node !== null) {
      setRightPos(node.getBoundingClientRect().right);
    }
  });
  const changeDelay = e => {
    setDelay(e.target.value);
  }
  const toggleDance = () => {
    setDanceMode(danceMode ^ 1);
  }
  var moonWalks = () => {
    setRightOffset(rightOffset + 60);
  };
  var duckWalks = () => {
    setRightOffset(rightOffset + 60);
  }
  var moveJacksonToEdge = () => {
    setRightOffset(0);
  };
  const toggleOn = () => {
    setOn(!on);
  }

  useEffect(() => {
    setAnimFunc(animationTimingFunc[animStage]);
  },[animStage, animationTimingFunc]);
  useEffect(() => {
    if(isJacksonOutOfStage()) {
        moveJacksonToEdge();
    }
  });
  var moveOneIndex = () => {
    var leftLeg = document.getElementById('left-leg');
    var rightLeg = document.getElementById('right-leg');
    if(danceMode === MOON_WALK_MODE) {
      var nextLeftLegStage = leftLegStages[index];
      var nextRightLegStage = rightLegStages[index];
      [].slice.call(leftLeg.children).forEach(function(child) {
        child.classList.remove('stage-1');
        child.classList.remove('stage-2');
        child.classList.remove('stage-3');
        child.classList.remove('stage-4');
        child.classList.remove('stage-6');
        child.classList.add(nextLeftLegStage);
      });
      [].slice.call(rightLeg.children).forEach(function(child) {
        child.classList.remove('stage-1');
        child.classList.remove('stage-2');
        child.classList.remove('stage-3');
        child.classList.remove('stage-5');
        child.classList.remove('stage-7');
        child.classList.add(nextRightLegStage);
      });
      moonWalks();
    } else if(danceMode === DUCK_WALK_MODE) {
      nextLeftLegStage = duckLeftLegStages[index];
      nextRightLegStage = duckRightLegStages[index];
      [].slice.call(leftLeg.children).forEach(function(child) {
        child.classList.remove('stage-1');
        child.classList.remove('stage-2');
        child.classList.remove('stage-3');
        child.classList.remove('stage-4');
        child.classList.remove('stage-6');
        child.classList.add(nextLeftLegStage);
      });
      [].slice.call(rightLeg.children).forEach(function(child) {
        child.classList.remove('stage-1');
        child.classList.remove('stage-2');
        child.classList.remove('stage-3');
        child.classList.remove('stage-5');
        child.classList.remove('stage-7');
        child.classList.add(nextRightLegStage);
      });
      duckWalks();
    }
    setIndex((index + 1)%NUM_MOVES);
    setAnimStage((animStage + 1)%NUM_MOVES);
  };
  var isJacksonOutOfStage = () => {
    return rightPos <= 0;
  };
  useInterval(moveOneIndex, on ? delay: null); /* <-- This is the main call that kicks off the dancing */
  return (
    <div className="playground">
      <div className="ceiling"></div>
      <div className="dancer-space">
        <div className="micheal-jackson" id="micheal-jackson" ref={jackson} style={{right:rightOffset, transition: `right 0.7s ${animFunc}`, transform:`${danceMode === DUCK_WALK_MODE ? 'scale(-1,1)' : ''}`}}>
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
              <div className="left-leg-upper leg-upper  stage-1" id="left-leg-upper"></div>
              <div className="left-leg-lower leg-lower stage-1" id="left-leg-lower"></div>
              <div className="left-foot foot stage-1" id="left-foot"></div>
            </div>
            <div className="right-leg" id="right-leg">
              <div className="right-leg-upper leg-upper stage-3" id="right-leg-upper"></div>
              <div className="right-leg-lower leg-lower stage-3" id="right-leg-lower"></div>
              <div className="right-foot foot stage-3" id="right-foot"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="stage">
        <div style={{display: 'flex', justifyContent: 'space-around'}}>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 'larger', background: 'white', padding: '0 20px', fontWeight: '700', color: on ? 'red' : 'green'}} onClick={toggleOn}>{on ? 'STOP' : 'START'}</div>
          <form><input type="number" value={delay} onChange={changeDelay} style={{height:"100px", fontSize:"30px"}}/></form>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 'larger', background: 'white', padding: '0 20px', fontWeight: '700'}} onClick={toggleDance}>{danceMode === MOON_WALK_MODE ? 'Moon walk' : 'Duck walk'}</div>
        </div>
      </div>
    </div>
  );
}
