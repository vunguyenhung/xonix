/* eslint-disable indent */
/*
3rd Party library imports
 */
const { createStore, applyMiddleware } = require('redux');
const { createLogicMiddleware, createLogic } = require('redux-logic');
const {
	mapObjIndexed, last, forEachObjIndexed, clone,
} = require('ramda');

/*
Project file imports
 */
const Instances = require('./instances');
const {
	generateFieldSquareKey,
	splitFieldSquareKeyIntoPosition,
	isPositionAtRear,
	Heading,
} = require('./utils');

// steps:
// - add 2 new action: DO_SOMETHING, SOMETHING_DONE
// - add logic with DO_SOMETHING type,
// 			this logic will do something with side effect and return a new State
//			then dispatch SOMETHING_DONE with the new state
// - add new logic to logics array
// - add DO_SOMETHING to module.exports
// - change index.js

const InitiateStatesAction = () => ({
	type: 'INITIATE_STATES',
});

const StateInitiatedAction = states => ({
	type: 'STATES_INITIATED',
	payload: states,
});

const InitiateFieldSquaresAction = () => ({
	type: 'INITIATE_FIELD_SQUARES',
});

const FieldSquaresInitiatedAction = () => ({
	type: 'FIELD_SQUARES_INITIATED',
});

const SteerCarAction = heading => ({
	type: 'STEER_CAR',
	payload: heading,
});

const CarSteeredAction = state => ({
	type: 'CAR_STEERED',
	payload: state,
});

const IncreaseCarSpeedAction = () => ({
	type: 'INCREASE_CAR_SPEED',
});

const CarSpeedIncreasedAction = state => ({
	type: 'CAR_SPEED_INCREASED',
	payload: state,
});

const DecreaseCarSpeedAction = () => ({
	type: 'DECREASE_CAR_SPEED',
});

const CarSpeedDeceasedAction = state => ({
	type: 'CAR_SPEED_DECREASED',
	payload: state,
});

const DecreaseCarSpeedFailedAction = reason => ({
	type: 'DECREASE_CAR_SPEED_FAILED',
	payload: reason,
});

const AddMonsterBallAction = () => ({
	type: 'ADD_MONSTER_BALL',
});

const MonsterBallAddedAction = state => ({
	type: 'MONSTER_BALL_ADDED',
	payload: state,
});

const AddTimeTicketAction = () => ({
	type: 'ADD_TIME_TICKET',
});

const TimeTicketAddedAction = state => ({
	type: 'TIME_TICKET_ADDED',
	payload: state,
});

const UpdateFieldSquareAction = (position, color) => ({
	type: 'UPDATE_FIELD_SQUARE',
	payload: { position, color },
});

const FieldSquareUpdatedAction = state => ({
	type: 'FIELD_SQUARE_UPDATED',
	payload: state,
});

const TickGameClockAction = () => ({
	type: 'TICK_GAME_CLOCK',
});

const GameClockTickedAction = state => ({
	type: 'GAME_CLOCK_TICKED',
	payload: state,
});

const DecreaseGameLivesAction = () => ({
	type: 'DECREASE_GAME_LIVES',
});

const GameLivesDecreasedAction = state => ({
	type: 'GAME_LIVES_DECREASED',
	payload: state,
});

const RestartGameClockAction = () => ({
	type: 'RESTART_GAME_CLOCK',
});

const GameClockRestartedAction = state => ({
	type: 'GAME_CLOCK_RESTARTED',
	payload: state,
});

const RestartGameAction = () => ({
	type: 'RESTART_GAME',
});

const MoveMonsterBallAction = monsterBall => ({
	type: 'MOVE_MONSTER_BALL',
	payload: monsterBall,
});

const MonsterBallMovedAction = state => ({
	type: 'MONSTER_BALL_MOVED',
	payload: state,
});

const MoveMonsterBallFailedAction = reason => ({
	type: 'MOVE_MONSTER_BALL_FAILED',
	payload: reason,
});

const MoveCarAction = () => ({
	type: 'MOVE_CAR',
});

const CarMovedAction = state => ({
	type: 'CAR_MOVED',
	payload: state,
});

const MoveCarFailedAction = reason => ({
	type: 'MOVE_CAR_FAILED',
	payload: reason,
});

const mapFieldSquaresInstancesToStates = fieldSquaresInstances =>
	mapObjIndexed(val => val.getState())(fieldSquaresInstances);

const initStatesLogic = createLogic({
	type: 'INITIATE_STATES',
	process(_, dispatch, done) {
		const states = {
			fieldSquares: mapFieldSquaresInstancesToStates(Instances.getState().fieldSquares),
			car: Instances.getState().car.getState(),
			game: Instances.getState().game.getState(),
		};
		dispatch(StateInitiatedAction(states));
		dispatch(InitiateFieldSquaresAction());
		done();
	},
});

const steerCarLogic = createLogic({
	type: 'STEER_CAR',
	process({ action }, dispatch, done) {
		const steeredCar = Instances.getState().car.steer(action.payload);
		Instances.getState().car.setState(steeredCar);
		dispatch(CarSteeredAction(steeredCar));
		done();
	},
});

const increaseCarSpeedLogic = createLogic({
	type: 'INCREASE_CAR_SPEED',
	process(_, dispatch, done) {
		const carWithNewSpeed = Instances.getState().car.increaseSpeed();
		Instances.getState().car.setState(carWithNewSpeed);
		dispatch(CarSpeedIncreasedAction(carWithNewSpeed));
		done();
	},
});

const decreaseCarSpeedLogic = createLogic({
	type: 'DECREASE_CAR_SPEED',
	validate({ getState, action }, allow, reject) {
		if (getState().car.speed === 0) {
			reject(DecreaseCarSpeedFailedAction('Car speed is at the lowest level'));
		} else allow(action);
	},
	process(_, dispatch, done) {
		const carWithNewSpeed = Instances.getState().car.decreaseSpeed();
		Instances.getState().car.setState(carWithNewSpeed);
		dispatch(CarSpeedDeceasedAction(carWithNewSpeed));
		done();
	},
});

const updateFieldSquareLogic = createLogic({
	type: 'UPDATE_FIELD_SQUARE',
	// TODO: detect if the new updated field square create a closed zone of `|`
	process({ action }, dispatch, done) {
		const updatedState =
			// { position, color }
			Instances.updateFieldSquare(action.payload.position, action.payload.color);

		Instances.getState()
			.fieldSquares[generateFieldSquareKey(action.payload.position)]
			.setState(updatedState);

		const updatedFieldSquaresStates =
			mapFieldSquaresInstancesToStates(Instances.getState().fieldSquares);
		dispatch(FieldSquareUpdatedAction(updatedFieldSquaresStates));

		done();
	},
});

const initiateFieldSquaresLogic = createLogic({
	type: 'INITIATE_FIELD_SQUARES',
	process({ getState }, dispatch, done) {
		// set default owned squares
		forEachObjIndexed((fs, key) => {
			const fsPosition = splitFieldSquareKeyIntoPosition(key);
			if (isPositionAtRear(fsPosition)) {
				dispatch(UpdateFieldSquareAction(fsPosition, '.'));
			}
		})(Instances.getState().fieldSquares);

		// set car color
		const carState = getState().car;
		console.log('carState', getState().car); // undefined
		dispatch(UpdateFieldSquareAction(carState.position, carState.color));

		dispatch(FieldSquaresInitiatedAction());
		done();
	},
});

const addMonsterBallLogic = createLogic({
	type: 'ADD_MONSTER_BALL',
	process(_, dispatch, done) {
		const addedMonsterBallInstances = Instances.addMonsterBall();
		Instances.setState(addedMonsterBallInstances);
		dispatch(MonsterBallAddedAction(Instances
			.getState()
			.monsterBalls
			.map(mbInstance => mbInstance.getState())));

		const latestMonsterBall = last(Instances.getState().monsterBalls).getState();
		dispatch(UpdateFieldSquareAction(latestMonsterBall.position, latestMonsterBall.color));

		done();
	},
});

const addTimeTicketLogic = createLogic({
	type: 'ADD_TIME_TICKET',
	process(_, dispatch, done) {
		const addedTimeTicketInstances = Instances.addTimeTicket();
		Instances.setState(addedTimeTicketInstances);
		dispatch(TimeTicketAddedAction(Instances
			.getState()
			.timeTickets
			.map(ttInstance => ttInstance.getState())));

		const latestTimeTicket = last(Instances.getState().timeTickets).getState();
		dispatch(UpdateFieldSquareAction(latestTimeTicket.position, latestTimeTicket.color));

		done();
	},
});

const restartGameClockLogic = createLogic({
	type: 'RESTART_GAME_CLOCK',
	process(_, dispatch, done) {
		const gameWithNewClock = Instances.getState().game.restartClock();
		Instances.getState().game.setState(gameWithNewClock);
		dispatch(GameClockRestartedAction(gameWithNewClock));
		done();
	},
});

const restartGameLogic = createLogic({
	type: 'RESTART_GAME',
	process(_, dispatch, done) {
		const instancesInitState = Instances.initState();
		Instances.setState(instancesInitState);
		dispatch(InitiateStatesAction());
		done();
	},
});

const decreaseGameLivesLogic = createLogic({
	type: 'DECREASE_GAME_LIVES',
	validate({ getState, action }, allow, reject) {
		if (getState().game.lives === 0) {
			reject(RestartGameAction());
		} else allow(action);
	},
	process(_, dispatch, done) {
		const gameWithNewLives = Instances.getState().game.decreaseLives();
		Instances.getState().game.setState(gameWithNewLives);
		dispatch(GameLivesDecreasedAction(gameWithNewLives));

		dispatch(RestartGameClockAction());
		done();
	},
});

const moveMonsterBallLogic = createLogic({
	type: 'MOVE_MONSTER_BALL',
	validate({ getState, action }, allow, reject) {
		const { position } = action.payload.move();
		if (!getState().fieldSquares[generateFieldSquareKey(position)]) {
			reject(MoveMonsterBallFailedAction('Monster Ball have no where else to move'));
		} else allow(action);
	},
	process({ action }, dispatch, done) {
		const toBeMovedMonsterBall = action.payload;
		const previousState = clone(toBeMovedMonsterBall.getState());

		const newMonsterBallState = toBeMovedMonsterBall.move();
		toBeMovedMonsterBall.setState(newMonsterBallState);

		dispatch(UpdateFieldSquareAction(newMonsterBallState.position, newMonsterBallState.color));
		dispatch(UpdateFieldSquareAction(previousState.position, '-'));

		dispatch(MonsterBallMovedAction(newMonsterBallState));
		done();
	},
});

const moveCarLogic = createLogic({
	type: 'MOVE_CAR',
	validate({ getState, action }, allow, reject) {
		const { position } = Instances.getState().car.move();
		if (!getState().fieldSquares[generateFieldSquareKey(position)]) {
			reject(MoveCarFailedAction('Car have no where else to move'));
		} else allow(action);
	},
	process({ getState }, dispatch, done) {
		const previousCarState = clone(getState().car);
		// console.log('previousCarState1', previousCarState);
		const currentCarState = Instances.getState().car.move();
		// console.log('currentCarState', currentCarState);
		Instances.getState().car.setState(currentCarState);

		// update car position on fieldSquares
		dispatch(UpdateFieldSquareAction(currentCarState.position, 'o'));

		// update car trail on fieldSquares
		const { heading, position } = currentCarState;

		const positionsToUpdate = [];
		if (heading === Heading.South) {
			for (let { y } = previousCarState.position; y < position.y; y += 1) {
				positionsToUpdate.push({ x: position.x, y });
			}
		}
		if (heading === Heading.North) {
			for (let y = position.y + 1; y <= previousCarState.position.y; y += 1) {
				positionsToUpdate.push({ x: position.x, y });
			}
		}
		if (heading === Heading.West) {
			for (let x = position.x + 1; x <= previousCarState.position.x; x += 1) {
				positionsToUpdate.push({ x, y: position.y });
			}
		}
		if (heading === Heading.East) {
			for (let { x } = previousCarState.position; x < position.x; x += 1) {
				positionsToUpdate.push({ x, y: position.y });
			}
		}
		// console.log('positionsToUpdate: ', positionsToUpdate);
		positionsToUpdate.forEach((pos) => {
			dispatch(UpdateFieldSquareAction(pos, '|'));
		});

		dispatch(CarMovedAction(currentCarState));
		done();
	},
});

const tickGameClockLogic = createLogic({
	type: 'TICK_GAME_CLOCK',
	validate({ getState, action }, allow, reject) {
		if (getState().game.clock === 1) {
			reject(DecreaseGameLivesAction());
		} else allow(action);
		// TODO: validate if car is moving to the border
	},
	process(_, dispatch, done) {
		// move car
		dispatch(MoveCarAction());

		// move monsterBall
		Instances.getState().monsterBalls.forEach((mb) => {
			dispatch(MoveMonsterBallAction(mb));
		});

		// minus the clock
		const gameWithNewClock = Instances.getState().game.decreaseClock();
		Instances.getState().game.setState(gameWithNewClock);

		dispatch(GameClockTickedAction(gameWithNewClock));

		done();
	},
});

const initialState = {
	monsterBalls: [],
};

const reducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case 'STATES_INITIATED':
			return payload;
		case 'CAR_SPEED_INCREASED':
		case 'CAR_SPEED_DECREASED':
		case 'CAR_STEERED':
		case 'CAR_MOVED':
			return { ...state, car: payload };
		case 'MONSTER_BALL_MOVED':
			return {
				...state,
				monsterBalls: state.monsterBalls.map(mb => (mb.color === payload.color ? payload : mb)),
			};
		case 'MONSTER_BALL_ADDED':
			return { ...state, monsterBalls: payload };
		case 'TIME_TICKET_ADDED':
			return { ...state, timeTickets: payload };
		case 'FIELD_SQUARE_UPDATED':
			return { ...state, fieldSquares: payload };
		case 'GAME_CLOCK_TICKED':
		case 'GAME_LIVES_DECREASED':
		case 'GAME_CLOCK_RESTARTED':
			return { ...state, game: payload };
		default:
			return state;
	}
};

const logics = [
	initStatesLogic,
	steerCarLogic,
	increaseCarSpeedLogic,
	decreaseCarSpeedLogic,
	addMonsterBallLogic,
	addTimeTicketLogic,
	updateFieldSquareLogic,
	initiateFieldSquaresLogic,
	tickGameClockLogic,
	restartGameClockLogic,
	decreaseGameLivesLogic,
	restartGameLogic,
	moveMonsterBallLogic,
	moveCarLogic,
];

const logicMiddleware = createLogicMiddleware(logics);

const middleware = applyMiddleware(logicMiddleware);

const store = createStore(reducer, middleware);

module.exports = {
	store,
	InitiateStatesAction,
	SteerCarAction,
	IncreaseCarSpeedAction,
	DecreaseCarSpeedAction,
	AddMonsterBallAction,
	AddTimeTicketAction,
	InitiateFieldSquaresAction,
	TickGameClockAction,
};
