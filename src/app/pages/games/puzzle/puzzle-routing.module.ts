import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PuzzleComponent } from './puzzle.component';
import { Shell } from '../../../shell/Shell';

export const routes: Routes = Shell.childRoutes([
  {
    path: 'games/puzzle',
    component: PuzzleComponent,
    pathMatch: 'full'
    // loadChildren: () => import(`src/app/pages/games/puzzle/puzzle.component`).then((m) => m.PuzzleComponent)
  }
]);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PuzzleRoutingModule {}
