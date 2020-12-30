import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import firebase from 'firebase'
import { Subject } from 'rxjs'
import { FirebaseService } from './firebase.service'
import { CookieService } from 'ngx-cookie-service'

export type User = {
  uid: string
  displayName: string
  email: string
  photoURL: string
  refreshToken: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userData: User
  subject = new Subject<boolean>()

  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private cookieService: CookieService
  ) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const { uid, displayName, email, photoURL, refreshToken } = user
        const authInfo: User = {
          uid,
          displayName,
          email,
          photoURL,
          refreshToken
        }
        this.login(authInfo)
      } else if (this.userData) {
        this.logout()
      }
    })
  }

  checkAuthInterval(): void {
    setInterval(() => {}, 600000)
  }

  isAuthenticated(): boolean {
    return !!this.cookieService.get('token')
  }

  get user(): User {
    return { ...this.userData }
  }

  login(user: User): void {
    const currentToken = this.cookieService.get('token')
    if (JSON.stringify(user) === currentToken) {
      return
    } else if (currentToken) {
      this.cookieService.set('token', JSON.stringify(user), 1, '/')
    }
    this.subject.next(true)
    this.userData = user
    this.cookieService.set('token', JSON.stringify(user), 1, '/')
    this.router.navigate(['categories'])
  }

  logout(): void {
    this.cookieService.delete('token', '/')
    this.userData = null
    this.firebaseService.logout().then(() => {
      this.subject.next(false)
      this.router.navigate(['login'])
    })
  }
}
