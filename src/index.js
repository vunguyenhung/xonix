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
	store, InitiateStatesAction, SteerCarAction, IncreaseCarSpeedAction, DecreaseCarSpeedAction,
} = require('./store');

const play = () => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		prompt: 'Xonix> ',
	});
	console.log('>>Initiating Game States...');
	store.dispatch(InitiateStatesAction());
	console.log('>>Game States initiated, use `m` command to show Game States');

	console.log('Xonix available commands:');
	console.log('-------------------------');
	console.log('init: Init Game states');
	console.log('n: Steer the car to North');
	console.log('s: Steer the car to South');
	console.log('e: Steer the car to East');
	console.log('w: Steer the car to West');
	console.log('i: Increase Car speed by one unit');
	console.log('l: Decrease Car speed by one unit');
	console.log('m: Show Game States');
	console.log('q: Quit the game');
	console.log('hello: Print `world`');
	rl.prompt();
	rl.on('line', (line) => {
		switch (line.trim()) {
			case 'hello':
				console.log('world!');
				break;
			case 'init':
				console.log('Init Game States');
				store.dispatch(InitiateStatesAction());
				console.log(store.getState());
				break;
			case 'n':
				console.log('Steer Car to North');
				console.log('-------------------------');
				store.dispatch(SteerCarAction(0));
				console.log(prop('car')(store.getState()));
				break;
			case 's':
				console.log('Steer Car to South');
				console.log('-------------------------');
				store.dispatch(SteerCarAction(180));
				console.log(prop('car')(store.getState()));
				break;
			case 'e':
				console.log('Steer Car to East');
				console.log('-------------------------');
				store.dispatch(SteerCarAction(90));
				console.log(prop('car')(store.getState()));
				break;
			case 'w':
				console.log('Steer Car to West');
				console.log('-------------------------');
				store.dispatch(SteerCarAction(270));
				console.log(prop('car')(store.getState()));
				break;
			case 'i':
				console.log('Increase Car speed by one unit');
				console.log('-------------------------');
				store.dispatch(IncreaseCarSpeedAction());
				console.log(prop('car')(store.getState()));
				break;
			case 'l':
				console.log('Decrease Car speed by one unit');
				console.log('-------------------------');
				store.dispatch(DecreaseCarSpeedAction());
				console.log(prop('car')(store.getState()));
				break;
			case 'm':
				console.log('Show Game States');
				console.log('-------------------------');
				console.log(store.getState());
				break;
			case 'q':
				console.log('Have a great day!');
				process.exit(0);
				break;
			default:
				console.log(`Say what? I might have heard '${line.trim()}'`);
				break;
		}
		rl.prompt();
	}).on('close', () => {
		console.log('Have a great day!');
		process.exit(0);
	});
};

play();
