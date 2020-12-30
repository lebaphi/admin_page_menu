import { Routes } from '@angular/router'

export const PublicRoutes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./public/public.module').then(m => m.PublicModule)
  }
]
