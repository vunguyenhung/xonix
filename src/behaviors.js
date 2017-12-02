/*
3rd Party library imports
 */
const gameConfig = require('config').get('game');


const ChangeableColor = state => ({
	setColor: color => ({ ...state, color }),
	getColor: () => state.color,
});

// each function of Movable will return a new state
const Movable = state => ({
	move: () => {
		const deltaX = Math.round(Math.cos(state.heading) * state.speed);
		const deltaY = Math.round(Math.sin(state.heading) * state.speed);
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
	decreaseLives: () => ({ ...state, lives: state.lives - 1 }),
	decreaseClock: () => ({ ...state, clock: state.clock - 1 }),
	restartClock: () => ({ ...state, clock: gameConfig.clock }),
	addTime: time => ({ ...state, time: state.time + time }),
	setCurrentScore: currentScore => ({ ...state, currentScore }),
	increaseLevel: () => ({ ...state, level: state.level + 1 }),
	updateRequiredScore: () => ({
		...state,
		requiredScore: 50 + ((state.level - 1) * 10),
	}),
	updateClock: () => ({
		...state,
		clock: gameConfig.clock - (2 * (state.level - 1)),
	}),
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
