/*
3rd Party library imports
 */
const { assoc, append } = require('ramda');

/*
Project file imports
 */
const Factories = require('./factories');

const configs = {
	fieldSquares: {
		size: { x: 21, y: 21 },
		color: '-',
	},
	car: {
		position: { x: 10, y: 0 },
		color: 'o',
		heading: 180,
		speed: 1,
	},
	game: {
		lives: 3,
		clock: 30,
		level: 1,
	},
};

const possibleColor = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const randomInt = (from, to) => Math.floor(Math.random() * (to - from)) + from;

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

const instances = {
	fieldSquares: createFieldSquares(configs.fieldSquares),
	car: Factories.Cars(configs.car),
	game: Factories.Game(configs.game),
	monsterBalls: [],
};

// addMonsterBall :: () => MonsterBall
const addMonsterBall = () => {
	const newMonsterBall = Factories.MonsterBalls({
		position: {
			x: randomInt(0, configs.fieldSquares.size.x),
			y: randomInt(0, configs.fieldSquares.size.y),
		},
		color: randomColor(),
		heading: randomInt(0, 360),
		speed: randomInt(0, 5),
	});
	Object.assign(instances, { monsterBalls: append(newMonsterBall)(instances.monsterBalls) });
	return newMonsterBall;
};

module.exports = {
	instances,
	addMonsterBall,
};
