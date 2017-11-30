/*
3rd Party library imports
 */

/*
Project file imports
 */

const ChangeableColor = state => ({
	setColor: color => ({ ...state, color }),
	getColor: () => state.color,
});

// each function of Movable will return a new state
const Movable = state => ({
	move: () => {
		const deltaX = Math.cos(90 - state.heading) * state.speed;
		const deltaY = Math.sin(90 - state.heading) * state.speed;
		const newPos = { x: state.position.x + deltaX, y: state.position.y + deltaY };
		return { ...state, newPos };
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
	// TODO: return Result here, game will end if lives = 0
	decreaseLife: () => ({ ...state, lives: state.lives - 1 }),
	// decreaseLife will be called in redux-logic because it need validation before calling action

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
