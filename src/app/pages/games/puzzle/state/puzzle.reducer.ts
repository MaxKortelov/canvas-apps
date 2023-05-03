import { Action, createReducer, on } from '@ngrx/store';
import { initialSize, IResult, ISize, LEVEL } from '../../../../models/Puzzle';
import * as fromPuzzleGameActions from './puzzle.actions';

export enum PuzzleStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  DATA = 'DATA',
  ERROR = 'ERROR'
}

export interface PuzzleGameState {
  STATUS: PuzzleStatus;
  SCALER: number;
  SIZE: ISize;
  name: string;
  results: IResult[];
}

export function initialPuzzleGameState(): PuzzleGameState {
  return {
    STATUS: PuzzleStatus.IDLE,
    SCALER: 0.8,
    SIZE: initialSize(),
    name: '',
    results: []
  };
}

const puzleGameReducerPrivate = createReducer(
  initialPuzzleGameState(),
  on(fromPuzzleGameActions.changeSize, (state, { SIZE }) => ({
    ...state,
    SIZE
  })),
  on(fromPuzzleGameActions.changeDifficulty, (state, { level }) => ({
    ...state,
    SIZE: {
      ...state.SIZE,
      rows: level,
      columns: level
    }
  })),
  on(fromPuzzleGameActions.changeName, (state, { name }) => ({
    ...state,
    name
  })),
  on(fromPuzzleGameActions.updateResults, (state, { results }) => ({
    ...state,
    results
  })),
  on(fromPuzzleGameActions.setInitialPuzzleGameState, (state, { puzzleGameState }) => ({
    ...state,
    ...puzzleGameState
  }))
);

export function puzleGameReducer(state: PuzzleGameState, action: Action): any {
  return puzleGameReducerPrivate(state, action);
}
