import {State} from "./app.state";
import {createSelector} from "@ngrx/store";

const selectState = (state: State) => state;

export const STATE = createSelector<State, State, State>(selectState, (s1) => s1);

