import { Routes } from '@angular/router'

export const PrivateRoutes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./private/private.module').then(m => m.PrivateModule)
  }
]
