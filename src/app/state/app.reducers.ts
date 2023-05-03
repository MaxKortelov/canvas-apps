import {State} from "./app.state";
import {initialPuzzleGameState} from "../pages/games/puzzle/state/puzzle.reducer";
import {createReducer, on} from "@ngrx/store";
import * as fromAppActions from "./app.actions";

export function initialAppState(): State {
  return {
    puzzleGame: initialPuzzleGameState()
  }
}

const puzleGameReducerPrivate = createReducer(
  initialPuzzleGameState(),
  on(fromAppActions.setInitialState, (s, { state }) => ({
    ...s,
    ...state
  }))
)
