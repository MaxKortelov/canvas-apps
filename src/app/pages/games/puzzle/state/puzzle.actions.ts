import { createAction, props } from '@ngrx/store';
import { IResult, ISize, LEVEL } from '../../../../models/Puzzle';

export const changeSize = createAction('[puzzle-game] Change size', props<{ SIZE: ISize }>());

export const changeDifficulty = createAction('[puzzle-game] Change difficulty', props<{ level: LEVEL }>());

export const changeName = createAction('[puzzle-game] Change name', props<{ name: string }>());

export const updateResult = createAction('[puzzle-game] Update result', props<{ result: IResult }>());

export const updateResults = createAction('[puzzle-game] Update results', props<{ results: IResult[] }>());
