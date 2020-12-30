import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { AuthService } from './auth.service'

@Injectable()
export class UnAuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = this.auth.isAuthenticated()
    if (!isAuthenticated) {
      return true
    }
    this.router.navigate(['categories'])
  }
}
