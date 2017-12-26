/* eslint-disable no-console */
/*
3rd Party library imports
 */
const { prop } = require('ramda');

/*
Project file imports
 */
const { store } = require('./store');
const Instances = require('./instances');
const Utils = require('./utils');
const Actions = require('./actions');

const steerCarToNorthCommand = () => {
	console.log('Steer Car to North');
	console.log('-------------------------');
	console.log('WorldStates.car: ');
	store.dispatch(Actions.SteerCarAction(-0.5 * Math.PI));
	console.log(prop('car')(store.getState()));
};

const steerCarToSouth = () => {
	console.log('Steer Car to South');
	console.log('-------------------------');
	console.log('WorldStates.car: ');
	store.dispatch(Actions.SteerCarAction(0.5 * Math.PI));
	console.log(prop('car')(store.getState()));
};

const steerCarToEast = () => {
	console.log('Steer Car to East');
	console.log('-------------------------');
	console.log('WorldStates.car: ');
	store.dispatch(Actions.SteerCarAction(0));
	console.log(prop('car')(store.getState()));
};

const steerCarToWest = () => {
	console.log('Steer Car to West');
	console.log('-------------------------');
	console.log('WorldStates.car: ');
	store.dispatch(Actions.SteerCarAction(Math.PI));
	console.log(prop('car')(store.getState()));
};

const increaseCarSpeed = () => {
	console.log('Increase Car speed by one unit');
	console.log('-------------------------');
	console.log('WorldStates.car: ');
	store.dispatch(Actions.IncreaseCarSpeedAction());
	console.log(prop('car')(store.getState()));
};

const decreaseCarSpeed = () => {
	console.log('Decrease Car speed by one unit');
	console.log('-------------------------');
	console.log('WorldStates.car: ');
	store.dispatch(Actions.DecreaseCarSpeedAction());
	console.log(prop('car')(store.getState()));
};

const addMonsterBall = () => {
	console.log('Add new Monster Ball to the world');
	console.log('-------------------------');
	console.log('WorldStates.monsterBalls: ');
	store.dispatch(Actions.AddMonsterBallAction());
	console.log(prop('monsterBalls')(store.getState()));
};

const addTimeTicket = () => {
	console.log('Add new Time Ticket to the world');
	console.log('-------------------------');
	console.log('WorldStates.timeTickets: ');
	store.dispatch(Actions.AddTimeTicketAction());
	console.log(prop('timeTickets')(store.getState()));
};

const tickGameClock = () => {
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
};

const showGameStates = () => {
	console.log('Show World States');
	console.log('-------------------------');
	console.log('WorldStates.game: ');
	console.log(prop('game')(store.getState()));
};

const generateRandomOwnedZone = () => {
	console.log('Generate random owned zone');
	console.log('-------------------------');
	const randomZone = Utils.randomZone();
	store.dispatch(Actions.OwnFieldSquaresAction(randomZone));
	console.log('Owned zone positions: ', randomZone);
};

const showInstancesState = () => {
	console.log('Show Instances State');
	console.log('-------------------------');
	console.log(Instances.getState());
};

const showFieldSquareMap = () => {
	console.log('Show Field Square Map');
	console.log('-------------------------');
	Utils.printFieldSquare(store.getState().fieldSquares);
};

const restartGameWorld = () => {
	console.log('Restart Game world');
	console.log('-------------------------');
	store.dispatch(Actions.RestartGameAction());
};

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

const showWorldStates = () => {
	console.log('Show World States');
	console.log('-------------------------');
	console.log('WorldStates: ');
	console.log(store.getState());
};

const quit = () => {
	console.log('Have a great day!');
	process.exit(0);
};

const invalidCommand = (command) => {
	console.log(`Invalid command: '${command}'`);
};

const COMMAND_MAP = {
	n: steerCarToNorthCommand,
	s: steerCarToSouth,
	e: steerCarToEast,
	w: steerCarToWest,
	i: increaseCarSpeed,
	l: decreaseCarSpeed,
	b: addMonsterBall,
	k: addTimeTicket,
	t: tickGameClock,
	d: showGameStates,
	g: generateRandomOwnedZone,
	m: showWorldStates,
	q: quit,
	is: showInstancesState,
	fs: showFieldSquareMap,
	rs: restartGameWorld,
	cmd: showCommands,
};

const processCommand = command =>
	(COMMAND_MAP[command] ? COMMAND_MAP[command]() : invalidCommand(command));

module.exports = {
	processCommand,
	showCommands,
};
