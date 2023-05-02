import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamesComponent } from './games.component';
import { Shell } from '../../shell/Shell';

const routes: Routes = Shell.childRoutes([
  {
    path: 'games',
    component: GamesComponent,
    pathMatch: 'full',
    children: [
      {
        path: 'puzzle',
        loadChildren: () => import(`src/app/pages/games/puzzle/puzzle.module`).then((m) => m.PuzzleModule)
      }
    ]
  }
]);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamesRoutingModule {}
