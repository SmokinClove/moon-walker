# moon-walker
A simple project to try out and demo the use of React Hooks

The page features a "dancer" who can do currently 3 dance moves: Moonwalk, Duck walk, and Duck dance. The delay between moves can be adjusted with the number input. Click the Start button on the left to play/pause the dance, click on the rightmost button to toggle between the dance modes.
![Screenshot](https://github.com/SmokinClove/moon-walker/blob/master/%E7%94%BB%E5%83%8F%E3%81%AE%E8%B2%BC%E3%82%8A%E4%BB%98%E3%81%91%E5%85%88_%202019-5-23%2016-17.png)

Current modes:
![gif](https://github.com/SmokinClove/moon-walker/blob/master/dance.gif)

Updated with sparkling stars <3
![Screenshot with stars](https://github.com/SmokinClove/moon-walker/blob/master/moon_walker.png)

# How to run the code
1. Just like any other create-react-app projects, run `yarn start` if you use yarn, or `npm start`. The default port to run the app is 3000, so your brower will be opened at localhost:3000. If you are not familiar, read the instructions at https://github.com/facebook/create-react-app

# What else can be done?
Lots
1. Add music for each dance mode
2. More dance modes
3. Add spotlights
4. Beautify Tiny Dancer
5. Add a partner (?!!!)
6. Choice of different dancers
7. `¯\_(ツ)_/¯`

# How to add a new mode
1. First take a look at DANCE_MOVES in `src/Jackson.js`. This is where the body parts that participate in the dance, the stages for the body parts, the animations properties for the dance can be specified.
2. Give the new dance move a unique name
3. The stages attribute is an array of the class names of each stage in one iteration for a body part. Each of the body parts should contain all the steps in the dance that makes up one iteration, i.e the stages for all body parts should have equal length. NOTE: currently the total num of moves in one iteration is counted using the number of steps the left leg takes, so we are assuming here that the legs will always move 
4. If you are adding new moving body parts that will move, add the refs to the relevant body parts (see example of the legs)
5. If you need to add a new appearance to the body part, you need to add a new stage name. Add the stage name as a class in `src/Jackson.css`
6. Add a unique name to the dance move
7. If you need to shift the body of the dancer when switching dance modes, add the transform property to the `bodyTransform` 
attribute


# Q&A
1. Why is the file Jackson.js and Jackson.css?<br />
I originally built this for the moon walk only so the dancer was called just Micheal Jackson. He is renamed to Tiny Dancer now
