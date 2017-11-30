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

const CarSteered = state => ({
	type: 'CAR_STEERED',
	payload: state,
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
		dispatch(CarSteered(steeredCar));
		done();
	},
});

const reducer = (state = {}, { type, payload }) => {
	switch (type) {
		case 'STATES_INITIATED':
			return payload;
		case 'CAR_STEERED':
			return { ...state, car: payload };
		default:
			return state;
	}
};

const logicMiddleware = createLogicMiddleware([initStatesLogic, steerCarLogic]);

const middleware = applyMiddleware(logicMiddleware);

const store = createStore(reducer, middleware);

module.exports = {
	store,
	SteerCarAction,
	InitiateStatesAction,
};
