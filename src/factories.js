/* eslint-disable no-tabs,max-len,object-curly-newline */
/*
3rd Party library imports
 */

/*
Project file imports
 */
const Behaviors = require('./behaviors');

// Game Objects will have properties and methods.
// A Game Object will be created by a factory function.
// methods in Game Objects will return one of a Folktale's Data structure wraps a new Game Object with the new state.
// properties of Game Object will be passed via function arguments.

// what about the properties across the composition ?
//  if properties that a method in Game Object don't exist. A Result with Error will be returned.
// can we compose factory functions ?
// const dog = Dog({ name: '1',... });

// Using redux ?
// Pros:
// -

// Cons:
// - Hard to demonstrate to teacher.
// - I will be too dependent on redux

// => NOT USING REDUX

// TRAIL ?
// SIZE ?

// changeDirection :: Number -> Result Error MonsterBalls

// in case collapsed with Car

// const ball = MonsterBall({position: {x: 100, y:200} , heading: 90, speed: 1, color: 'red'})
// const newBall = ball.setColor('randomColor') // {position: {x: 100, y:200} , heading: 90, speed: 1, color: 'randomColor'}
// ball.setColor need to set its internal state to the new value

// const user = User({ lives: 2, clock: 10, level: 1 })
// const newUserState = user.decreaseLife()

// const car = Car({position: {x: 247.5, y: 2.5}, heading: 0, speed: 1, color: 'blue'})
// const newCar = car.repositionToInit()

// (state, action)
// case 'COLLAPSED_MONSTER_BALL':
// 		return {  ...state,
// 							balls: {...state.balls, [payload.id]: state.balls[payload.id].setColor('blue')},
// 							user: state.user.decreaseLife(),
//							// if lives is == 0, game over.
// 							car: state.car.repositionToInit() }

// move(): causes the object to update its location based on its current heading and speed.
// Entity.Movable.move() return a newState, we need to set that newState = state
// but if we set the internal state, how can react | redux know what have changed ?
// => save state in another place
// reducer will have 2 separated places
// instances contains Color, Car , MonsterBall, etc...
// state contains current state of the game. This is the result of instance's methods.
// redux-logic will get instance from getState,
// then execute them (A.K.A change their internal state)
// then dispatch action with the instance is the payload
// reducer will take that instance, set current state to that instance state,
// ...Entity.Movable(state)

// start with a random position, heading, speed, and color.
// MonsterBalls({position, heading, speed, color, radius})
const MonsterBalls = ({ position, color, heading, speed }) => {
	const state = { position, color, heading, speed };
	return {
		...Behaviors.ChangeableColor(state),
		...Behaviors.Movable(state),
		...Behaviors.PublishableState(state),
	};
};

// Cars({position, heading, speed, color})
// heading :: [0, 90, 180, 270]
const Cars = ({ position, color, speed }) => {
	const state = { position, color, speed, heading: 0.5 * Math.PI };
	return {
		...Behaviors.Movable(state),
		...Behaviors.Steerable(state),
		...Behaviors.ChangeableSpeed(state),
		...Behaviors.PublishableState(state),
		...Behaviors.MutableState(state),
	};
};

// changeable color
// The field contains a grid of 100 x 100 squares. Each square is 5 x 5 units
// TODO: change fieldSquare at the position where car, monsterBall and timeTicket is present
const FieldSquares = ({ position, color }) => {
	const state = { position, color };
	return {
		...Behaviors.ChangeableColor(state),
		...Behaviors.PublishableState(state),
		...Behaviors.MutableState(state),
	};
};

const TimeTickets = ({ position, color, time }) => {
	const state = { position, color, time };
	return {
		...Behaviors.PublishableState(state),
	};
};

// instances :: { car, monsterBalls, fieldSquares, timeTickets }
const Game = ({ lives, clock, level }) => {
	const state = { lives, clock, level, currentScore: 0, minimumScore: 50 };
	return {
		...Behaviors.GameBehaviors(state),
		...Behaviors.MutableState(state),
		...Behaviors.PublishableState(state),
	};
};

module.exports = {
	MonsterBalls,
	Cars,
	FieldSquares,
	TimeTickets,
	Game,
};
