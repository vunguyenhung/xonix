/* eslint-disable indent,no-console,no-case-declarations */
/*
3rd Party library imports
 */
const readline = require('readline');
const { prop } = require('ramda');

/*
Project file imports
 */
const { store } = require('./store');
const Instances = require('./instances');
const Utils = require('./utils');
const Actions = require('./actions');

const showCommands = () => {
	console.log('Xonix available commands:');
	console.log('-------------------------');
	console.log('n: Steer the car to the North');
	console.log('s: Steer the car to the South');
	console.log('e: Steer the car to the East');
	console.log('w: Steer the car to the West');
	console.log('i: Increase Car speed by one unit');
	console.log('l: Decrease Car speed by one unit');
	console.log('b: Add new Monster Ball to the world');
	console.log('k: Add new Time Ticket to the world');
	console.log('t: Tick the game clock');
	console.log('d: Show Game States');
	console.log('g: Generate random owned zone');
	console.log('is: Show Instances States');
	console.log('fs: Show Field Square Map');
	console.log('rs: Restart Game world');
	console.log('cmd: Show available commands');
	console.log('m: Show World States');
	console.log('q: Quit the game');
	console.log('hello: Print `world`');
};

const play = () => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		prompt: 'Xonix> ',
	});
	console.log('>>Initiating World States...');
	store.dispatch(Actions.InitiateStatesAction());
	console.log('>>World States initiated, use `m` command to show World States');
	console.log('-------------------------');

	showCommands();
	console.log('-------------------------');
	rl.prompt();
	rl.on('line', (line) => {
		switch (line.trim()) {
			case 'hello':
				console.log('world!');
				break;
			case 'n':
				console.log('Steer Car to North');
				console.log('-------------------------');
				console.log('WorldStates.car: ');
				store.dispatch(Actions.SteerCarAction(-0.5 * Math.PI));
				console.log(prop('car')(store.getState()));
				break;
			case 's':
				console.log('Steer Car to South');
				console.log('-------------------------');
				console.log('WorldStates.car: ');
				store.dispatch(Actions.SteerCarAction(0.5 * Math.PI));
				console.log(prop('car')(store.getState()));
				break;
			case 'e':
				console.log('Steer Car to East');
				console.log('-------------------------');
				console.log('WorldStates.car: ');
				store.dispatch(Actions.SteerCarAction(0));
				console.log(prop('car')(store.getState()));
				break;
			case 'w':
				console.log('Steer Car to West');
				console.log('-------------------------');
				console.log('WorldStates.car: ');
				store.dispatch(Actions.SteerCarAction(Math.PI));
				console.log(prop('car')(store.getState()));
				break;
			case 'i':
				console.log('Increase Car speed by one unit');
				console.log('-------------------------');
				console.log('WorldStates.car: ');
				store.dispatch(Actions.IncreaseCarSpeedAction());
				console.log(prop('car')(store.getState()));
				break;
			case 'l':
				console.log('Decrease Car speed by one unit');
				console.log('-------------------------');
				console.log('WorldStates.car: ');
				store.dispatch(Actions.DecreaseCarSpeedAction());
				console.log(prop('car')(store.getState()));
				break;
			case 'b':
				console.log('Add new Monster Ball to the world');
				console.log('-------------------------');
				console.log('WorldStates.monsterBalls: ');
				store.dispatch(Actions.AddMonsterBallAction());
				console.log(prop('monsterBalls')(store.getState()));
				break;
			case 'k':
				console.log('Add new Time Ticket to the world');
				console.log('-------------------------');
				console.log('WorldStates.timeTickets: ');
				store.dispatch(Actions.AddTimeTicketAction());
				console.log(prop('timeTickets')(store.getState()));
				break;
			case 't':
				console.log('Tick the game clock');
				console.log('-------------------------');
				store.dispatch(Actions.TickGameClockAction());
				console.log('WorldStates.game: ');
				console.log(prop('game')(store.getState()));
				console.log('-------------------------');
				console.log('WorldStates.car: ');
				console.log(prop('car')(store.getState()));
				console.log('-------------------------');
				console.log('WorldStates.monsterBalls: ');
				console.log(prop('monsterBalls')(store.getState()));
				break;
			case 'd':
				console.log('Show World States');
				console.log('-------------------------');
				console.log('WorldStates.game: ');
				console.log(prop('game')(store.getState()));
				break;
			case 'g':
				console.log('Generate random owned zone');
				console.log('-------------------------');
				const randomZone = Utils.randomZone();
				store.dispatch(Actions.OwnFieldSquaresAction(randomZone));
				console.log('Owned zone positions: ', randomZone);
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
			case 'rs':
				console.log('Restart Game world');
				console.log('-------------------------');
				store.dispatch(Actions.RestartGameAction());
				break;
			case 'cmd':
				showCommands();
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
