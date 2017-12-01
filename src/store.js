/* eslint-disable indent */
/*
3rd Party library imports
 */
const { createStore, applyMiddleware } = require('redux');
const { createLogicMiddleware, createLogic } = require('redux-logic');
const { mapObjIndexed, last, forEachObjIndexed } = require('ramda');

/*
Project file imports
 */
const Instances = require('./instances');
const { generateFieldSquareKey, splitFieldSquareKeyIntoPosition, isPositionAtRear } = require(
	'./utils');

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

const UpdateFieldSquare = (position, color) => ({
	type: 'UPDATE_FIELD_SQUARE',
	payload: { position, color },
});

const FieldSquareUpdated = state => ({
	type: 'FIELD_SQUARE_UPDATED',
	payload: state,
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
	process({ action }, dispatch, done) {
		const updatedState =
			// { position, color }
			Instances.updateFieldSquare(action.payload.position, action.payload.color);

		Instances.getState()
			.fieldSquares[generateFieldSquareKey(action.payload.position)]
			.setState(updatedState);

		const updatedFieldSquaresStates =
			mapFieldSquaresInstancesToStates(Instances.getState().fieldSquares);
		dispatch(FieldSquareUpdated(updatedFieldSquaresStates));

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
				dispatch(UpdateFieldSquare(fsPosition, '.'));
			}
		})(Instances.getState().fieldSquares);

		// set car color
		const carState = getState().car;
		dispatch(UpdateFieldSquare(carState.position, carState.color));

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
		dispatch(UpdateFieldSquare(latestMonsterBall.position, latestMonsterBall.color));

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
		dispatch(UpdateFieldSquare(latestTimeTicket.position, latestTimeTicket.color));

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
			return { ...state, car: payload };
		case 'MONSTER_BALL_ADDED':
			return { ...state, monsterBalls: payload };
		case 'TIME_TICKET_ADDED':
			return { ...state, timeTickets: payload };
		case 'FIELD_SQUARE_UPDATED':
			return { ...state, fieldSquares: payload };
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
};
