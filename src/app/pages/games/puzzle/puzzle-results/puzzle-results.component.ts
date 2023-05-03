import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../../state/app.state';
import * as fromPuzzleGame from '../state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs/operators';
import { IResult, LEVEL } from '../../../../models/Puzzle';
import { ActivatedRoute, Router } from '@angular/router';
import * as fromPuzzleGameActions from '../state/puzzle.actions';

@UntilDestroy()
@Component({
  selector: 'app-puzzle-results',
  templateUrl: './puzzle-results.component.html',
  styleUrls: ['./puzzle-results.component.scss']
})
export class PuzzleResultsComponent implements OnInit {
  results: IResult[] = [];

  constructor(private store: Store<State>, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.store
      .select(fromPuzzleGame.results)
      .pipe(
        untilDestroyed(this),
        tap((results) => {
          this.results = results;
        })
      )
      .subscribe();
  }

  getLevelName(level: LEVEL): string {
    return LEVEL[level].replace('_', ' ');
  }

  navigateHome(): void {
    this.store.dispatch(fromPuzzleGameActions.nullifyIsLastResult());
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  restartGame(): void {
    this.store.dispatch(fromPuzzleGameActions.nullifyIsLastResult());
    this.router.navigate(['../game'], { relativeTo: this.route });
  }
}
