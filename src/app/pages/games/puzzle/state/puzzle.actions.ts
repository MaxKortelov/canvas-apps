import { createAction, props } from '@ngrx/store';
import { ISize, LEVEL } from '../../../../models/Puzzle';

export const changeSize = createAction('[puzzle-game] Change size', props<{ SIZE: ISize }>());

export const changeDifficulty = createAction('[puzzle-game] Change difficulty', props<{ level: LEVEL }>());
