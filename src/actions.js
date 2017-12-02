const ActionTypes = {
	INITIATE_STATES: 'INITIATE_STATES',
	STATES_INITIATED: 'STATES_INITIATED',
	INITIATE_FIELD_SQUARES: 'INITIATE_FIELD_SQUARES',
	FIELD_SQUARES_INITIATED: 'FIELD_SQUARES_INITIATED',
	STEER_CAR: 'STEER_CAR',
	CAR_STEERED: 'CAR_STEERED',
	INCREASE_CAR_SPEED: 'INCREASE_CAR_SPEED',
	CAR_SPEED_INCREASED: 'CAR_SPEED_INCREASED',
	DECREASE_CAR_SPEED: 'DECREASE_CAR_SPEED',
	CAR_SPEED_DECREASED: 'CAR_SPEED_DECREASED',
	DECREASE_CAR_SPEED_FAILED: 'DECREASE_CAR_SPEED_FAILED',
	ADD_MONSTER_BALL: 'ADD_MONSTER_BALL',
	MONSTER_BALL_ADDED: 'MONSTER_BALL_ADDED',
	ADD_TIME_TICKET: 'ADD_TIME_TICKET',
	TIME_TICKET_ADDED: 'TIME_TICKET_ADDED',
	UPDATE_FIELD_SQUARE: 'UPDATE_FIELD_SQUARE',
	FIELD_SQUARE_UPDATED: 'FIELD_SQUARE_UPDATED',
	TICK_GAME_CLOCK: 'TICK_GAME_CLOCK',
	GAME_CLOCK_TICKED: 'GAME_CLOCK_TICKED',
	DECREASE_GAME_LIVES: 'DECREASE_GAME_LIVES',
	GAME_LIVES_DECREASED: 'GAME_LIVES_DECREASED',
	RESTART_GAME_CLOCK: 'RESTART_GAME_CLOCK',
	GAME_CLOCK_RESTARTED: 'GAME_CLOCK_RESTARTED',
	RESTART_GAME: 'RESTART_GAME',
	MOVE_MONSTER_BALL: 'MOVE_MONSTER_BALL',
	MONSTER_BALL_MOVED: 'MONSTER_BALL_MOVED',
	MOVE_MONSTER_BALL_FAILED: 'MOVE_MONSTER_BALL_FAILED',
	MOVE_CAR: 'MOVE_CAR',
	CAR_MOVED: 'CAR_MOVED',
	MOVE_CAR_FAILED: 'MOVE_CAR_FAILED',
	OWN_FIELD_SQUARES: 'OWN_FIELD_SQUARES',
};

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

const OwnFieldSquaresAction = ({ topLeft, topRight, bottomLeft }) => ({
	type: 'OWN_FIELD_SQUARES',
	payload: { topLeft, topRight, bottomLeft },
});

module.exports = {
	ActionTypes,
	InitiateStatesAction,
	StateInitiatedAction,
	InitiateFieldSquaresAction,
	FieldSquaresInitiatedAction,
	SteerCarAction,
	CarSteeredAction,
	IncreaseCarSpeedAction,
	CarSpeedIncreasedAction,
	DecreaseCarSpeedAction,
	CarSpeedDeceasedAction,
	DecreaseCarSpeedFailedAction,
	AddMonsterBallAction,
	MonsterBallAddedAction,
	AddTimeTicketAction,
	TimeTicketAddedAction,
	UpdateFieldSquareAction,
	FieldSquareUpdatedAction,
	TickGameClockAction,
	GameClockTickedAction,
	DecreaseGameLivesAction,
	GameLivesDecreasedAction,
	RestartGameClockAction,
	GameClockRestartedAction,
	RestartGameAction,
	MoveMonsterBallAction,
	MonsterBallMovedAction,
	MoveMonsterBallFailedAction,
	MoveCarAction,
	CarMovedAction,
	MoveCarFailedAction,
	OwnFieldSquaresAction,
};
