/* eslint-disable indent,function-paren-newline */
/*
3rd Party library imports
 */
const { createStore, applyMiddleware } = require('redux');
const { createLogicMiddleware, createLogic } = require('redux-logic');
const {
	mapObjIndexed, last, forEachObjIndexed, clone,
} = require('ramda');
const fieldSquareSize = require('config').get('fieldSquares.size');

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
const Actions = require('./actions');

// TODO: add update currentScore action
// TODO: increaseLevel action
// 	reinitialize
//	add monster ball based on current level
//	increase minimumScore

const mapFieldSquaresInstancesToStates = fieldSquaresInstances =>
	mapObjIndexed(val => val.getState())(fieldSquaresInstances);

const initStatesLogic = createLogic({
	type: Actions.ActionTypes.INITIATE_STATES,
	process(_, dispatch, done) {
		// console.log('Inside initiate states');
		const states = {
			fieldSquares: mapFieldSquaresInstancesToStates(Instances.getState().fieldSquares),
			car: Instances.getState().car.getState(),
			game: Instances.getState().game.getState(),
		};
		dispatch(Actions.StateInitiatedAction(states));
		dispatch(Actions.InitiateFieldSquaresAction());
		done();
	},
});

const steerCarLogic = createLogic({
	type: Actions.ActionTypes.STEER_CAR,
	process({ action }, dispatch, done) {
		const steeredCar = Instances.getState().car.steer(action.payload);
		Instances.getState().car.setState(steeredCar);
		dispatch(Actions.CarSteeredAction(steeredCar));
		done();
	},
});

const increaseCarSpeedLogic = createLogic({
	type: Actions.ActionTypes.INCREASE_CAR_SPEED,
	process(_, dispatch, done) {
		const carWithNewSpeed = Instances.getState().car.increaseSpeed();
		Instances.getState().car.setState(carWithNewSpeed);
		dispatch(Actions.CarSpeedIncreasedAction(carWithNewSpeed));
		done();
	},
});

const decreaseCarSpeedLogic = createLogic({
	type: Actions.ActionTypes.DECREASE_CAR_SPEED,
	validate({ getState, action }, allow, reject) {
		if (getState().car.speed === 0) {
			reject(Actions.DecreaseCarSpeedFailedAction('Car speed is at the lowest level'));
		} else allow(action);
	},
	process(_, dispatch, done) {
		const carWithNewSpeed = Instances.getState().car.decreaseSpeed();
		Instances.getState().car.setState(carWithNewSpeed);
		dispatch(Actions.CarSpeedDeceasedAction(carWithNewSpeed));
		done();
	},
});

const updateFieldSquareLogic = createLogic({
	type: Actions.ActionTypes.UPDATE_FIELD_SQUARE,
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
		dispatch(Actions.FieldSquareUpdatedAction(updatedFieldSquaresStates));

		done();
	},
});

const initiateFieldSquaresLogic = createLogic({
	type: Actions.ActionTypes.INITIATE_FIELD_SQUARES,
	process({ getState }, dispatch, done) {
		// set default owned squares
		forEachObjIndexed((fs, key) => {
			const fsPosition = splitFieldSquareKeyIntoPosition(key);
			if (isPositionAtRear(fsPosition)) {
				dispatch(Actions.UpdateFieldSquareAction(fsPosition, '.'));
			} else {
				dispatch(Actions.UpdateFieldSquareAction(fsPosition, '-'));
			}
		})(Instances.getState().fieldSquares);

		// set car color
		const carState = getState().car;
		// console.log('carState', getState().car); // undefined
		dispatch(Actions.UpdateFieldSquareAction(carState.position, carState.color));

		dispatch(Actions.FieldSquaresInitiatedAction());
		done();
	},
});

const addMonsterBallLogic = createLogic({
	type: Actions.ActionTypes.ADD_MONSTER_BALL,
	process(_, dispatch, done) {
		const addedMonsterBallInstances = Instances.addMonsterBall();
		Instances.setState(addedMonsterBallInstances);
		dispatch(Actions.MonsterBallAddedAction(Instances
			.getState()
			.monsterBalls
			.map(mbInstance => mbInstance.getState())));

		const latestMonsterBall = last(Instances.getState().monsterBalls).getState();
		dispatch(Actions.UpdateFieldSquareAction(latestMonsterBall.position, latestMonsterBall.color));

		done();
	},
});

const addTimeTicketLogic = createLogic({
	type: Actions.ActionTypes.ADD_TIME_TICKET,
	process(_, dispatch, done) {
		const addedTimeTicketInstances = Instances.addTimeTicket();
		Instances.setState(addedTimeTicketInstances);
		dispatch(Actions.TimeTicketAddedAction(Instances
			.getState()
			.timeTickets
			.map(ttInstance => ttInstance.getState())));

		const latestTimeTicket = last(Instances.getState().timeTickets).getState();
		dispatch(Actions.UpdateFieldSquareAction(latestTimeTicket.position, latestTimeTicket.color));

		done();
	},
});

const restartGameClockLogic = createLogic({
	type: Actions.ActionTypes.RESTART_GAME_CLOCK,
	process(_, dispatch, done) {
		const gameWithNewClock = Instances.getState().game.restartClock();
		Instances.getState().game.setState(gameWithNewClock);
		dispatch(Actions.GameClockRestartedAction(gameWithNewClock));
		done();
	},
});

const restartGameLogic = createLogic({
	type: Actions.ActionTypes.RESTART_GAME,
	process(_, dispatch, done) {
		const instancesInitState = Instances.initState();
		Instances.setState(instancesInitState);
		dispatch(Actions.InitiateStatesAction());
		done();
	},
});

const decreaseGameLivesLogic = createLogic({
	type: Actions.ActionTypes.DECREASE_GAME_LIVES,
	validate({ getState, action }, allow, reject) {
		if (getState().game.lives === 0) {
			reject(Actions.RestartGameAction());
		} else allow(action);
	},
	process(_, dispatch, done) {
		const gameWithNewLives = Instances.getState().game.decreaseLives();
		Instances.getState().game.setState(gameWithNewLives);
		dispatch(Actions.GameLivesDecreasedAction(gameWithNewLives));

		dispatch(Actions.RestartGameClockAction());
		done();
	},
});

const moveMonsterBallLogic = createLogic({
	type: Actions.ActionTypes.MOVE_MONSTER_BALL,
	validate({ getState, action }, allow, reject) {
		const { position } = action.payload.move();
		if (!getState().fieldSquares[generateFieldSquareKey(position)]) {
			reject(Actions.MoveMonsterBallFailedAction('Monster Ball have no where else to move'));
		} else allow(action);
	},
	process({ action }, dispatch, done) {
		const toBeMovedMonsterBall = action.payload;
		const previousState = clone(toBeMovedMonsterBall.getState());

		const newMonsterBallState = toBeMovedMonsterBall.move();
		toBeMovedMonsterBall.setState(newMonsterBallState);

		dispatch(
			Actions.UpdateFieldSquareAction(newMonsterBallState.position, newMonsterBallState.color));
		dispatch(Actions.UpdateFieldSquareAction(previousState.position, '-'));

		dispatch(Actions.MonsterBallMovedAction(newMonsterBallState));
		done();
	},
});

const moveCarLogic = createLogic({
	type: Actions.ActionTypes.MOVE_CAR,
	validate({ getState, action }, allow, reject) {
		const { position } = Instances.getState().car.move();
		if (!getState().fieldSquares[generateFieldSquareKey(position)]) {
			reject(Actions.MoveCarFailedAction('Car have no where else to move'));
		} else allow(action);
	},
	process({ getState }, dispatch, done) {
		const previousCarState = clone(getState().car);
		// console.log('previousCarState1', previousCarState);
		const currentCarState = Instances.getState().car.move();
		// console.log('currentCarState', currentCarState);
		Instances.getState().car.setState(currentCarState);

		// update car position on fieldSquares
		dispatch(Actions.UpdateFieldSquareAction(currentCarState.position, 'o'));

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
			dispatch(Actions.UpdateFieldSquareAction(pos, '|'));
		});

		// TODO: own the square if the car touch the owned square

		dispatch(Actions.CarMovedAction(currentCarState));
		done();
	},
});

const tickGameClockLogic = createLogic({
	type: Actions.ActionTypes.TICK_GAME_CLOCK,
	validate({ getState, action }, allow, reject) {
		if (getState().game.clock === 1) {
			reject(Actions.DecreaseGameLivesAction());
		} else allow(action);
		// TODO: validate if car is moving to the border
	},
	process(_, dispatch, done) {
		// move car
		dispatch(Actions.MoveCarAction());

		// move monsterBall
		Instances.getState().monsterBalls.forEach((mb) => {
			dispatch(Actions.MoveMonsterBallAction(mb));
		});

		// minus the clock
		const gameWithNewClock = Instances.getState().game.decreaseClock();
		Instances.getState().game.setState(gameWithNewClock);

		dispatch(Actions.GameClockTickedAction(gameWithNewClock));

		done();
	},
});

const ownFieldSquaresLogic = createLogic({
	type: Actions.ActionTypes.OWN_FIELD_SQUARES,
	process({ getState, action }, dispatch, done) {
		const { topLeft, topRight, bottomLeft } = action.payload;

		for (let { y } = topLeft; y < bottomLeft.y; y += 1) {
			for (let { x } = topLeft; x < topRight.x; x += 1) {
				dispatch(Actions.UpdateFieldSquareAction({ x, y }, '.'));
			}
		}

		// calculate game score based on current field squares state
		const { fieldSquares } = getState(); // { '0,1': {} }
		// total squares: fieldSquaresSize.x * fieldSquaresSize.y
		const totalSquares = fieldSquareSize.x * fieldSquareSize.y;
		let ownedSquares = 0;
		forEachObjIndexed((fs) => {
			if (fs.color === '.') {
				ownedSquares += 1;
			}
		})(fieldSquares);
		const currentScore = (ownedSquares * 100) / totalSquares;

		// update current score in game state
		const gameInstance = Instances.getState().game;
		const newGameStateWithNewCurrentScore = gameInstance.setCurrentScore(currentScore);
		gameInstance.setState(newGameStateWithNewCurrentScore);

		// console.log('newGameStateWithNewCurrentScore: ', newGameStateWithNewCurrentScore);
		// if currentScore >= requiredScore => next level
		if (newGameStateWithNewCurrentScore.currentScore >=
			newGameStateWithNewCurrentScore.requiredScore) {
			// reinitialize states
			dispatch(Actions.InitiateStatesAction());

			// increase level
			const newGameInstanceAfterRestartGame = Instances.getState().game;
			const newGameStateWithNewLevel = newGameInstanceAfterRestartGame.increaseLevel();
			newGameInstanceAfterRestartGame.setState(newGameStateWithNewLevel);

			// add monsterBall based on level
			dispatch(Actions.AddMonsterBallAction());
			// increase requiredScore based on current level
			const newGameStateWithNewRequiredScore =
				newGameInstanceAfterRestartGame.updateRequiredScore();
			newGameInstanceAfterRestartGame.setState(newGameStateWithNewRequiredScore);

			// update clock based on level: the clock goes down by 2 for each level
			const newGameStateWithNewClock =
				newGameInstanceAfterRestartGame.updateClock();
			newGameInstanceAfterRestartGame.setState(newGameStateWithNewClock);
		}

		// console.log('totalSquares: ', totalSquares);
		// console.log('ownedSquares: ', ownedSquares);
		// console.log('currentScore: ', currentScore);

		done();
	},
});

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
	ownFieldSquaresLogic,
];

const logicMiddleware = createLogicMiddleware(logics);

const middleware = applyMiddleware(logicMiddleware);

const store = createStore(reducer, middleware);

module.exports = {
	store,
};
