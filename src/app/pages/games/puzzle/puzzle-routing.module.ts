import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '../../../shell/Shell';
import { PuzzleHomeComponent } from './puzzle-home/puzzle-home.component';
import { PuzzleGameComponent } from './puzzle-game/puzzle-game.component';
import { PuzzleResultsComponent } from './puzzle-results/puzzle-results.component';
import { PuzzleComponent } from './puzzle.component';

export const routes: Routes = Shell.childRoutes([
  {
    path: 'games/puzzle',
    component: PuzzleComponent,
    children: [
      {
        path: '',
        component: PuzzleHomeComponent
        // loadChildren: () =>
        //   import(`src/app/pages/games/puzzle/puzzle-home/puzzle-home.component`).then((m) => m.PuzzleHomeComponent)
      },
      {
        path: 'game',
        component: PuzzleGameComponent
        // loadChildren: () =>
        //   import(`src/app/pages/games/puzzle/puzzle-game/puzzle-game.component`).then((m) => m.PuzzleGameComponent)
      },
      {
        path: 'result',
        component: PuzzleResultsComponent
        // loadChildren: () =>
        //   import(`src/app/pages/games/puzzle/puzzle-results/puzzle-results.component`).then(
        //     (m) => m.PuzzleResultsComponent
        //   )
      }
    ]
  }
]);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PuzzleRoutingModule {}
