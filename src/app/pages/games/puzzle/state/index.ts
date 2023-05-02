import { createSelector } from '@ngrx/store';
import { State } from '../../../../state/app.state';
import { PuzzleGameState } from './puzzle.reducer';
import { ISize } from '../../../../models/Puzzle';

const selectState = (state: State) => state.puzzleGame;

export const SCALER = createSelector<State, PuzzleGameState, number>(selectState, (s1) => s1.SCALER);

export const SIZE = createSelector<State, PuzzleGameState, ISize>(selectState, (s1) => s1.SIZE);

export const name = createSelector<State, PuzzleGameState, string>(selectState, (s1) => s1.name);
