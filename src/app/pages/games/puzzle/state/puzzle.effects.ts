import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { State } from '../../../../state/app.state';
import * as fromPuzzleGameActions from './puzzle.actions';
import * as fromPuzzleGame from './index';
import { map, tap, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class PuzzleEffects {
  addResult$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromPuzzleGameActions.updateResult),
      withLatestFrom(this.store.select(fromPuzzleGame.results)),
      map(([{ result }, results]) => {
        let newResults = [...results, result];
        newResults.sort((a, b) => a.time - b.time);
        console.log(newResults);
        return newResults;
      }),
      map((results) => fromPuzzleGameActions.updateResults({ results }))
    )
  );

  nullifyisIsLastResult$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromPuzzleGameActions.nullifyIsLastResult),
      withLatestFrom(this.store.select(fromPuzzleGame.results)),
      map(([_, results]) => {
        let newResults = [...results].map((r) => ({ ...r, isLastResult: false }));
        return newResults;
      }),
      map((results) => fromPuzzleGameActions.updateResults({ results }))
    )
  );

  constructor(private actions$: Actions, private store: Store<State>) {}
}
