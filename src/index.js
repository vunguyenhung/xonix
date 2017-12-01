/* eslint-disable indent,no-console */
/*
3rd Party library imports
 */
const readline = require('readline');
const { prop } = require('ramda');

/*
Project file imports
 */
const {
	store,
	InitiateStatesAction,
	SteerCarAction,
	IncreaseCarSpeedAction,
	DecreaseCarSpeedAction,
	AddMonsterBallAction,
	AddTimeTicketAction,
	InitiateFieldSquaresAction,
} = require('./store');
const Instances = require('./instances');
const Utils = require('./utils');

const play = () => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		prompt: 'Xonix> ',
	});
	console.log('>>Initiating World States...');
	store.dispatch(InitiateStatesAction());
	console.log('>>World States initiated, use `m` command to show World States');

	console.log('-------------------------');

	console.log('>>Initiating Field Squares...');
	store.dispatch(InitiateFieldSquaresAction());
	console.log('>>Field Squares initiated, use `fs` command to show Field Squares');

	console.log('-------------------------');
	console.log('Xonix available commands:');
	console.log('-------------------------');
	console.log('init: Init World states');
	console.log('n: Steer the car to the North');
	console.log('s: Steer the car to the South');
	console.log('e: Steer the car to the East');
	console.log('w: Steer the car to the West');
	console.log('i: Increase Car speed by one unit');
	console.log('l: Decrease Car speed by one unit');
	console.log('b: Add new Monster Ball to the world');
	console.log('k: Add new Time Ticket to the world');
	console.log('d: Show Game States');
	console.log('is: Show Instances States');
	console.log('fs: Show Field Square Map');
	console.log('m: Show World States');
	console.log('q: Quit the game');
	console.log('hello: Print `world`');
	rl.prompt();
	rl.on('line', (line) => {
		switch (line.trim()) {
			case 'hello':
				console.log('world!');
				break;
			case 'init':
				console.log('Init World States');
				store.dispatch(InitiateStatesAction());
				console.log(store.getState());
				break;
			case 'n':
				console.log('Steer Car to North');
				console.log('-------------------------');
				console.log('WorldStates.car: ');
				store.dispatch(SteerCarAction(0));
				console.log(prop('car')(store.getState()));
				break;
			case 's':
				console.log('Steer Car to South');
				console.log('-------------------------');
				console.log('WorldStates.car: ');
				store.dispatch(SteerCarAction(180));
				console.log(prop('car')(store.getState()));
				break;
			case 'e':
				console.log('Steer Car to East');
				console.log('-------------------------');
				console.log('WorldStates.car: ');
				store.dispatch(SteerCarAction(90));
				console.log(prop('car')(store.getState()));
				break;
			case 'w':
				console.log('Steer Car to West');
				console.log('-------------------------');
				console.log('WorldStates.car: ');
				store.dispatch(SteerCarAction(270));
				console.log(prop('car')(store.getState()));
				break;
			case 'i':
				console.log('Increase Car speed by one unit');
				console.log('-------------------------');
				console.log('WorldStates.car: ');
				store.dispatch(IncreaseCarSpeedAction());
				console.log(prop('car')(store.getState()));
				break;
			case 'l':
				console.log('Decrease Car speed by one unit');
				console.log('-------------------------');
				console.log('WorldStates.car: ');
				store.dispatch(DecreaseCarSpeedAction());
				console.log(prop('car')(store.getState()));
				break;
			case 'b':
				console.log('Add new Monster Ball to the world');
				console.log('-------------------------');
				console.log('WorldStates.monsterBalls: ');
				store.dispatch(AddMonsterBallAction());
				console.log(prop('monsterBalls')(store.getState()));
				break;
			case 'k':
				console.log('Add new Time Ticket to the world');
				console.log('-------------------------');
				console.log('WorldStates.timeTickets: ');
				store.dispatch(AddTimeTicketAction());
				console.log(prop('timeTickets')(store.getState()));
				break;
			case 'd':
				console.log('Show World States');
				console.log('-------------------------');
				console.log('WorldStates.game: ');
				console.log(prop('game')(store.getState()));
				break;
			case 'is':
				console.log('Show Instances State');
				console.log('-------------------------');
				console.log(Instances.getState());
				break;
			case 'fs':
				console.log('Show Field Square Map');
				console.log('-------------------------');
				Utils.printFieldSquare(store.getState().fieldSquares);
				break;
			case 'm':
				console.log('Show World States');
				console.log('-------------------------');
				console.log('WorldStates: ');
				console.log(store.getState());
				break;
			case 'q':
				console.log('Have a great day!');
				process.exit(0);
				break;
			default:
				console.log(`Invalid command: '${line.trim()}'`);
				break;
		}
		rl.prompt();
	}).on('close', () => {
		console.log('Have a great day!');
		process.exit(0);
	});
};

play();
