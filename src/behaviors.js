/*
3rd Party library imports
 */
const gameConfig = require('config').get('game');

/*
Project file imports
 */

const ChangeableColor = state => ({
	setColor: color => ({ ...state, color }),
	getColor: () => state.color,
});

// each function of Movable will return a new state
const Movable = state => ({
	// TODO: determine monsterBall's heading possibility. (it can only move 8 directions)
	// 0.5 * Math.PI - south | 0 - east | -0.5 * Math.PI - north | Math.PI - west
	move: () => {
		const deltaX = Math.floor(Math.cos(state.heading) * state.speed);
		const deltaY = Math.floor(Math.sin(state.heading) * state.speed);
		const position = { x: state.position.x + deltaX, y: state.position.y + deltaY };
		return { ...state, position };
	},
});

const ChangeableSpeed = state => ({
	setSpeed: speed => ({ ...state, speed }),
	increaseSpeed: () => ({ ...state, speed: state.speed + 1 }),
	decreaseSpeed: () => ({ ...state, speed: state.speed - 1 }),
});

const PublishableState = state => ({
	getState: () => state,
});

const MutableState = state => ({
	setState: newState => Object.assign(state, newState),
});

// 0, 90, 180, or 270 (that is, north, east, south, or west)
const Steerable = state => ({
	steer: heading => ({ ...state, heading }),
});

const GameBehaviors = state => ({
	// TODO: game will end if lives = 0
	decreaseLives: () => ({ ...state, lives: state.lives - 1 }),
	// decreaseLife will be called in redux-logic because it need validation before calling action
	decreaseClock: () => ({ ...state, clock: state.clock - 1 }),
	restartClock: () => ({ ...state, clock: gameConfig.clock }),
	addTime: time => ({ ...state, time: state.time + time }),
	// TODO: change more constant here. Implement 1 level first
	// increaseLevel: () => ({ ...state, level: state.level + 1 }),
});

module.exports = {
	ChangeableColor,
	ChangeableSpeed,
	Movable,
	PublishableState,
	MutableState,
	Steerable,
	GameBehaviors,
};
