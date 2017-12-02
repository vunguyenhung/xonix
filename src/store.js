/* eslint-disable indent */
/*
3rd Party library imports
 */
const { createStore, applyMiddleware } = require('redux');

/*
Project file imports
 */
const Actions = require('./actions');
const { logicMiddleware } = require('./logics');

const initialState = {
	monsterBalls: [],
};

const reducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case Actions.ActionTypes.STATES_INITIATED:
			return payload;
		case Actions.ActionTypes.CAR_SPEED_INCREASED:
		case Actions.ActionTypes.CAR_SPEED_DECREASED:
		case Actions.ActionTypes.CAR_STEERED:
		case Actions.ActionTypes.CAR_MOVED:
			return { ...state, car: payload };
		case Actions.ActionTypes.MONSTER_BALL_MOVED:
			return {
				...state,
				monsterBalls: state.monsterBalls.map(mb => (mb.color === payload.color ? payload : mb)),
			};
		case Actions.ActionTypes.MONSTER_BALL_ADDED:
			return { ...state, monsterBalls: payload };
		case Actions.ActionTypes.TIME_TICKET_ADDED:
			return { ...state, timeTickets: payload };
		case Actions.ActionTypes.FIELD_SQUARE_UPDATED:
			return { ...state, fieldSquares: payload };
		case Actions.ActionTypes.GAME_CLOCK_TICKED:
		case Actions.ActionTypes.GAME_LIVES_DECREASED:
		case Actions.ActionTypes.GAME_CLOCK_RESTARTED:
			return { ...state, game: payload };
		default:
			return state;
	}
};

const middleware = applyMiddleware(logicMiddleware);

const store = createStore(reducer, middleware);

module.exports = {
	store,
};
