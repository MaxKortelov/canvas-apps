import { Route, Routes } from '@angular/router';
import { ShellComponent } from './shell.component';

export class Shell {
  /**
   * Creates routes using the shell component and authentication.
   * @param routes The routes to add.
   * @return The new route using shell as the base.
   */
  static childRoutes(routes: Routes): Route[] {
    return [
      {
        path: '',
        redirectTo: 'games',
        pathMatch: 'full'
      },
      {
        path: '',
        component: ShellComponent,
        children: routes,
        // Reuse ShellComponent instance when navigating between child views
        data: { reuse: true }
      }
    ];
  }
}
