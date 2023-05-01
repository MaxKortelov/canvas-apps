import { initialSize, ISize } from '../models/Puzzle';
import { Action, createReducer, on } from '@ngrx/store';
import * as fromPuzzleGameActions from './app.actions';

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  DATA = 'DATA',
  ERROR = 'ERROR'
}

export interface PuzzleGameState {
  STATUS: AppStatus;
  SCALER: number;
  SIZE: ISize;
}

export function initialAppState(): PuzzleGameState {
  return {
    STATUS: AppStatus.IDLE,
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
