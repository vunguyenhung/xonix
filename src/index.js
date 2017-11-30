/*
3rd Party library imports
 */
const { assoc } = require('ramda');

/*
Project file imports
 */
const Factories = require('./factories');

const createConfigs = () => ({
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
});

// fieldSquares = { ['0,0']:{...}, ['0,1']:{...} }

const createFieldSquares = (fieldSquaresConfig) => {
	let fieldSquares = {};
	for (let x = 0; x < fieldSquaresConfig.size.x; x += 1) {
		for (let y = 0; y < fieldSquaresConfig.size.y; y += 1) {
			fieldSquares = assoc(
				`${x},${y}`,
				Factories.FieldSquares({ position: { x, y }, color: fieldSquaresConfig.color }),
			);
		}
	}
	return fieldSquares;
};

const play = (configs) => {
	const instances = {
		fieldSquares: createFieldSquares(configs.fieldSquares),
		car: Factories.Cars(configs.car),
		// TODO: do monster later
	};
	const game = Factories.Game({ ...configs.game, instances });
	console.log(instances.car.getState());
};

play(createConfigs());
