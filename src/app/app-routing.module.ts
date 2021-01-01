import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AuthGuard } from './services/auth-guard.service'
import { UnAuthGuard } from './services/unAuth-guard.service'
import { PrivateRoutes } from './routes/private-routes'
import { PublicRoutes } from './routes/public-routes'

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
