import {createAction, props} from '@ngrx/store';
import {State} from "./app.state";

export const NoopAction = createAction('Noop Action');

export const NoDispatch = { dispatch: false };

export const setInitialState = createAction('[App] Set initial state', props<{ state: State }>());
