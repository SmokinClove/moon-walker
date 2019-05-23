var Jackson = document.getElementById('micheal-jackson');
var leftLegStages = ["stage-1", "stage-2", "stage-3", "stage-2"];
var rightLegStages = ["stage-3", "stage-2", "stage-1", "stage-2"];
var NUM_MOVES = 4;
var index = 0;
var rightOffset = 0;
var JACKSON_WIDTH = 70;

window.onload = function() {
  moveJacksonToEdge();
  setInterval(function(){
    moveOneIndex();
  }, 1000);
  function moveJacksonToEdge() {
    Jackson.classList.add('at-right-edge');
    Jackson.style.transform = null;
    rightOffset = 0;
  }
  function moveOneIndex() {
    var leftLeg = document.getElementById('left-leg');
    var rightLeg = document.getElementById('right-leg');
    var nextLeftLegStage = leftLegStages[index];
    var nextRightLegStage = rightLegStages[index];
    [].slice.call(leftLeg.children).forEach(function(child) {
      child.classList.remove('stage-1');
      child.classList.remove('stage-2');
      child.classList.remove('stage-3');
      child.classList.add(nextLeftLegStage);
    });
    [].slice.call(rightLeg.children).forEach(function(child) {
      child.classList.remove('stage-1');
      child.classList.remove('stage-2');
      child.classList.remove('stage-3');
      child.classList.add(nextRightLegStage);
    });
    moonWalks();
    if(isJacksonOutOfStage()) {
      moveJacksonToEdge();
    }
    index = (index + 1)%NUM_MOVES;
  }
  function moonWalks() {
    rightOffset += 100;
    console.log('offset ', rightOffset);
    Jackson.style.right = rightOffset + 'px';
  }

  function isJacksonOutOfStage() {
    return Jackson.getBoundingClientRect().right <= 0;
  }
};
