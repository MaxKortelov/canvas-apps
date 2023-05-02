import { Action, createReducer, on } from '@ngrx/store';
import { initialSize, ISize } from '../../../models/Puzzle';
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
}

export function initialAppState(): PuzzleGameState {
  return {
    STATUS: PuzzleStatus.IDLE,
    SCALER: 0.8,
    SIZE: initialSize()
  };
}

const puzleGameReducerPrivate = createReducer(
  initialAppState(),
  on(fromPuzzleGameActions.changeSize, (state, { SIZE }) => ({
    ...state,
    SIZE
  }))
);

export function puzleGameReducer(state: PuzzleGameState, action: Action): any {
  return puzleGameReducerPrivate(state, action);
}
