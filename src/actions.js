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
	FIELD_SQUARES_OWNED: 'FIELD_SQUARES_OWNED',
};

const InitiateStatesAction = () => ({
	type: ActionTypes.INITIATE_STATES,
});

const StateInitiatedAction = states => ({
	type: ActionTypes.STATES_INITIATED,
	payload: states,
});

const InitiateFieldSquaresAction = () => ({
	type: ActionTypes.INITIATE_FIELD_SQUARES,
});

const FieldSquaresInitiatedAction = () => ({
	type: ActionTypes.FIELD_SQUARES_INITIATED,
});

const SteerCarAction = heading => ({
	type: ActionTypes.STEER_CAR,
	payload: heading,
});

const CarSteeredAction = state => ({
	type: ActionTypes.CAR_STEERED,
	payload: state,
});

const IncreaseCarSpeedAction = () => ({
	type: ActionTypes.INCREASE_CAR_SPEED,
});

const CarSpeedIncreasedAction = state => ({
	type: ActionTypes.CAR_SPEED_INCREASED,
	payload: state,
});

const DecreaseCarSpeedAction = () => ({
	type: ActionTypes.DECREASE_CAR_SPEED,
});

const CarSpeedDeceasedAction = state => ({
	type: ActionTypes.CAR_SPEED_DECREASED,
	payload: state,
});

const DecreaseCarSpeedFailedAction = reason => ({
	type: ActionTypes.DECREASE_CAR_SPEED_FAILED,
	payload: reason,
});

const AddMonsterBallAction = () => ({
	type: ActionTypes.ADD_MONSTER_BALL,
});

const MonsterBallAddedAction = state => ({
	type: ActionTypes.MONSTER_BALL_ADDED,
	payload: state,
});

const AddTimeTicketAction = () => ({
	type: ActionTypes.ADD_TIME_TICKET,
});

const TimeTicketAddedAction = state => ({
	type: ActionTypes.TIME_TICKET_ADDED,
	payload: state,
});

const UpdateFieldSquareAction = (position, color) => ({
	type: ActionTypes.UPDATE_FIELD_SQUARE,
	payload: { position, color },
});

const FieldSquareUpdatedAction = state => ({
	type: ActionTypes.FIELD_SQUARE_UPDATED,
	payload: state,
});

const TickGameClockAction = () => ({
	type: ActionTypes.TICK_GAME_CLOCK,
});

const GameClockTickedAction = state => ({
	type: ActionTypes.GAME_CLOCK_TICKED,
	payload: state,
});

const DecreaseGameLivesAction = () => ({
	type: ActionTypes.DECREASE_GAME_LIVES,
});

const GameLivesDecreasedAction = state => ({
	type: ActionTypes.GAME_LIVES_DECREASED,
	payload: state,
});

const RestartGameClockAction = () => ({
	type: ActionTypes.RESTART_GAME_CLOCK,
});

const GameClockRestartedAction = state => ({
	type: ActionTypes.GAME_CLOCK_RESTARTED,
	payload: state,
});

const RestartGameAction = () => ({
	type: ActionTypes.RESTART_GAME,
});

const MoveMonsterBallAction = monsterBall => ({
	type: ActionTypes.MOVE_MONSTER_BALL,
	payload: monsterBall,
});

const MonsterBallMovedAction = state => ({
	type: ActionTypes.MONSTER_BALL_MOVED,
	payload: state,
});

const MoveMonsterBallFailedAction = reason => ({
	type: ActionTypes.MOVE_MONSTER_BALL_FAILED,
	payload: reason,
});

const MoveCarAction = () => ({
	type: ActionTypes.MOVE_CAR,
});

const CarMovedAction = state => ({
	type: ActionTypes.CAR_MOVED,
	payload: state,
});

const MoveCarFailedAction = reason => ({
	type: ActionTypes.MOVE_CAR_FAILED,
	payload: reason,
});

const OwnFieldSquaresAction = ({ topLeft, topRight, bottomLeft }) => ({
	type: ActionTypes.OWN_FIELD_SQUARES,
	payload: { topLeft, topRight, bottomLeft },
});

const FieldSquareOwnedAction = state => ({
	type: ActionTypes.FIELD_SQUARES_OWNED,
	payload: state,
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
	FieldSquareOwnedAction,
};
