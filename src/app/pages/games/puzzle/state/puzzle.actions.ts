import { createAction, props } from '@ngrx/store';
import { ISize } from '../../../../models/Puzzle';

export const changeSize = createAction('[puzzle-game] Change size', props<{ SIZE: ISize }>());
