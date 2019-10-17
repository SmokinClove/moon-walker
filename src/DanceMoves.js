
// the original duck walk https://www.youtube.com/watch?v=EqS76TFCCYs
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
        /* 0: ease out */ 'cubic-bezier(0,.06,0,1.16)',
        /* 1: ease in */ 'cubic-bezier(.87,.57,1,.68)',
        /* 2: ease out */ 'cubic-bezier(0,.06,0,1.16)',
        /* 3: ease in */ 'cubic-bezier(.87,.57,1,.68)'
      ]
    }
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
        /* 0: ease out */ 'cubic-bezier(0,.06,0,1.16)',
        /* 1: ease in */ 'cubic-bezier(.87,.57,1,.68)',
        /* 2: ease out */ 'cubic-bezier(0,.06,0,1.16)',
        /* 3: ease in */ 'cubic-bezier(.87,.57,1,.68)'
      ]
    },
    bodyTransform: 'scaleX(-1)'
  },
  DUCK_DANCE: {
    name: 'Duck dance',
    leftLegStages: ['stage-8', 'stage-9'],
    rightLegStages: ['stage-9', 'stage-8'],
    dancePosition: {
      rightOffset: 30,
      animationDuration: 0.7,
      animation: ['ease-in-out', 'ease-in-out']
    },
    bodyTransform: 'scaleX(-1) translateY(45px)'
  }
};
const DANCE_MODES = Object.keys(DANCE_MOVES);

export { DANCE_MODES, DANCE_MOVES };
export default DANCE_MOVES;

