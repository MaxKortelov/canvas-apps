import { createAction, props } from '@ngrx/store';
import { ISize } from '../models/Puzzle';
import { Piece } from '../services/element.service';

export const NoopAction = createAction('Noop Action');

export const NoDispatch = { dispatch: false };

export const changeSize = createAction('[puzzle-game] Change size', props<{ SIZE: ISize }>());
