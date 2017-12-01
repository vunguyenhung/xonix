/* eslint-disable object-curly-newline */
/*
3rd Party library imports
 */
const { assoc, append } = require('ramda');
const configs = require('config');

/*
Project file imports
 */
const Factories = require('./factories');
const Behaviors = require('./behaviors');
const { generateFieldSquareKey } = require('./utils');

const possibleColor = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz123456789';

const randomInt = (from, to) => Math.floor(Math.random() * (to - from)) + from;

// TODO: remove randomColor if taken, a random Color must be unique
const randomColor = () => possibleColor[randomInt(0, possibleColor.length)];

const createFieldSquares = (fieldSquaresConfig) => {
	let fieldSquares = {};
	for (let x = 0; x < fieldSquaresConfig.size.x; x += 1) {
		for (let y = 0; y < fieldSquaresConfig.size.y; y += 1) {
			fieldSquares = assoc(
				`${x},${y}`,
				Factories.FieldSquares({ position: { x, y }, color: fieldSquaresConfig.color }),
			)(fieldSquares);
		}
	}

	return fieldSquares;
};

const createMonsterBall = () =>
	Factories.MonsterBalls({
		position: {
			x: randomInt(0, configs.fieldSquares.size.x),
			y: randomInt(0, configs.fieldSquares.size.y),
		},
		color: randomColor(),
		heading: randomInt(0, 360),
		speed: randomInt(0, 5),
	});

const createTimeTicket = () =>
	Factories.TimeTickets({
		position: {
			x: randomInt(0, configs.fieldSquares.size.x),
			y: randomInt(0, configs.fieldSquares.size.y),
		},
		color: randomColor(),
		time: randomInt(1, 6), // TODO: init this coresponse to level. Ex: level 1: 5, level 2: 4
	});

const InstancesBehaviors = state => ({
	addMonsterBall: () =>
		({
			...state,
			monsterBalls: append(createMonsterBall())(state.monsterBalls),
		}),
	addTimeTicket: () =>
		({
			...state,
			timeTickets: append(createTimeTicket())(state.timeTickets),
		}),
	updateFieldSquare: (position, color) =>
		state.fieldSquares[generateFieldSquareKey(position)].setColor(color),
});

const Instances = ({ fieldSquares, car, game, monsterBalls, timeTickets }) => {
	const state = { fieldSquares, car, game, monsterBalls, timeTickets };
	return {
		...Behaviors.PublishableState(state),
		...Behaviors.MutableState(state),
		...InstancesBehaviors(state),
	};
};

module.exports = Instances({
	fieldSquares: createFieldSquares(configs.fieldSquares),
	car: Factories.Cars(configs.car),
	game: Factories.Game(configs.game),
	monsterBalls: [],
	timeTickets: [],
});

