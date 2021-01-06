import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { PrivateRoutes } from './routes/private-routes'
import { PublicRoutes } from './routes/public-routes'
import { AuthGuard } from './shared/services/auth-guard.service'
import { UnAuthGuard } from './shared/services/unAuth-guard.service'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    children: PrivateRoutes,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    children: PublicRoutes,
    canActivate: [UnAuthGuard]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
