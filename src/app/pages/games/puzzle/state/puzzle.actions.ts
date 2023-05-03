import { createAction, props } from '@ngrx/store';
import { IResult, ISize, LEVEL } from '../../../../models/Puzzle';
import {PuzzleGameState} from "./puzzle.reducer";

export const changeSize = createAction('[puzzle-game] Change size', props<{ SIZE: ISize }>());

export const changeDifficulty = createAction('[puzzle-game] Change difficulty', props<{ level: LEVEL }>());

export const changeName = createAction('[puzzle-game] Change name', props<{ name: string }>());

export const updateResult = createAction('[puzzle-game] Add result to list of results', props<{ result: IResult }>());

export const nullifyIsLastResult = createAction('[puzzle-game] Nullify results');

export const updateResults = createAction('[puzzle-game] Update results', props<{ results: IResult[] }>());

export const setInitialPuzzleGameState = createAction('[puzzle-game] Set initial puzzle game stae', props<{ puzzleGameState: PuzzleGameState }>());
