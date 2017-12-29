/* eslint-disable indent,no-console,no-case-declarations */
/*
3rd Party library imports
 */
const readline = require('readline');

/*
Project file imports
 */
const { store } = require('./store');
const Actions = require('./actions');
const { processCommand, showCommands } = require('./commands');

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
		processCommand(line.trim());
		rl.prompt();
	}).on('close', () => {
		console.log('Have a great day!');
		process.exit(0);
	});
};

play();
