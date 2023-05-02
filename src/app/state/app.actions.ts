import { createAction } from '@ngrx/store';

export const NoopAction = createAction('Noop Action');

export const NoDispatch = { dispatch: false };
