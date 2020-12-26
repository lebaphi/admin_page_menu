import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuth = false

  constructor(private snackBar: MatSnackBar) {}

  isAuthenticated(): boolean {
    return this.isAuth
  }

  login(): void {}

  logout(): void {
    this.snackBar.open('Does not implemented yet!', 'Dismiss', {
      duration: 2000
    })
  }
}
