/* eslint-disable indent,no-console,no-case-declarations */
/*
3rd Party library imports
 */
const readline = require('readline');

/*
Project file imports
 */
const { processCommand, showCommands, initiateWorldStates } = require('./commands');

const play = () => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		prompt: 'Xonix> ',
	});
	initiateWorldStates();
	showCommands();
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
