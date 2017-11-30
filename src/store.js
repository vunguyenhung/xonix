/* eslint-disable indent */
/*
3rd Party library imports
 */
const { createStore, applyMiddleware } = require('redux');
const { createLogicMiddleware, createLogic } = require('redux-logic');
const { mapObjIndexed } = require('ramda');

/*
Project file imports
 */
const Instances = require('./instances');

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

const initStatesLogic = createLogic({
	type: 'INITIATE_STATES',
	process(_, dispatch, done) {
		const states = {
			fieldSquares: mapObjIndexed(val => val.getState())(Instances.fieldSquares),
			car: Instances.car.getState(),
			game: Instances.game.getState(),
		};
		dispatch(StateInitiatedAction(states));
		done();
	},
});

const steerCarLogic = createLogic({
	type: 'STEER_CAR',
	process({ action }, dispatch, done) {
		const steeredCar = Instances.car.steer(action.payload);
		Instances.car.setState(steeredCar);
		dispatch(CarSteeredAction(steeredCar));
		done();
	},
});

const increaseCarSpeedLogic = createLogic({
	type: 'INCREASE_CAR_SPEED',
	process(_, dispatch, done) {
		const carWithNewSpeed = Instances.car.increaseSpeed();
		Instances.car.setState(carWithNewSpeed);
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
		const carWithNewSpeed = Instances.car.decreaseSpeed();
		Instances.car.setState(carWithNewSpeed);
		dispatch(CarSpeedDeceasedAction(carWithNewSpeed));
		done();
	},
});

const reducer = (state = {}, { type, payload }) => {
	switch (type) {
		case 'STATES_INITIATED':
			return payload;
		case 'CAR_SPEED_INCREASED':
		case 'CAR_SPEED_DECREASED':
		case 'CAR_STEERED':
			return { ...state, car: payload };
		default:
			return state;
	}
};

const logics = [
	initStatesLogic,
	steerCarLogic,
	increaseCarSpeedLogic,
	decreaseCarSpeedLogic,
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
};
