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
  subject = new Subject<boolean>()
  private currentToken: string

  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private cookieService: CookieService
  ) {
    this.currentToken = this.cookieService.get('token') || ''
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
      } else if (this.currentToken) {
        this.logout()
      }
    })
  }

  checkAuthInterval(): void {
    setInterval(() => {}, 600000)
  }

  isAuthenticated(): boolean {
    return !!this.currentToken
  }

  get user(): User {
    return JSON.parse(this.currentToken)
  }

  login(user: User): void {
    if (JSON.stringify(user) === this.currentToken) {
      return
    } else if (this.currentToken) {
      this.cookieService.set('token', JSON.stringify(user), 1, '/')
    }
    this.subject.next(true)
    this.cookieService.set('token', JSON.stringify(user), 1, '/')
    this.router.navigate(['categories'])
  }

  logout(): void {
    this.cookieService.delete('token', '/')
    this.subject.next(false)
    this.firebaseService.logout().then(() => {
      this.router.navigate(['login'])
    })
  }
}
