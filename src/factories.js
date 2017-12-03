/* eslint-disable no-tabs,max-len,object-curly-newline */

const Behaviors = require('./behaviors');

const MonsterBalls = ({ position, color, heading, speed }) => {
	const state = { position, color, heading, speed };
	return {
		...Behaviors.ChangeableColor(state),
		...Behaviors.Movable(state),
		...Behaviors.PublishableState(state),
		...Behaviors.MutableState(state),
	};
};

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

const Game = ({ lives, clock, level }) => {
	const state = { lives, clock, level, currentScore: 0, requiredScore: 50 };
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
