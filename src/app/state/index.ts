import { PuzzleGameState } from './app.reducers';
import { createSelector } from '@ngrx/store';
import { ISize } from '../models/Puzzle';
import { State } from './app.state';

const selectState = (state: State) => state.puzzleGame;

export const SCALER = createSelector<State, PuzzleGameState, number>(selectState, (s1) => s1.SCALER);

export const SIZE = createSelector<State, PuzzleGameState, ISize>(selectState, (s1) => s1.SIZE);
