import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
import { AngularFireAuth } from '@angular/fire/auth'
import firebase from 'firebase/app'
import 'firebase/auth'
import { CookieService } from 'ngx-cookie-service'
import { UIService } from './ui.service'

export type User = {
  uid: string
  displayName: string
  email: string
  photoURL: string
}

export interface AuthData {
  email: string
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  showNavSubject = new Subject<boolean>()
  private user: User

  constructor(
    private router: Router,
    private afauth: AngularFireAuth,
    private uiService: UIService,
    private cookiesService: CookieService
  ) {}

  initAuthListener(): void {
    this.uiService.loadingStateChanged.next(true)
    this.afauth.authState.subscribe(user => {
      this.uiService.loadingStateChanged.next(false)
      if (user) {
        this.cookiesService.set(
          'authData',
          JSON.stringify(user.providerData[0]),
          1,
          '/'
        )
        this.showNavSubject.next(true)
        if (this.router.url === '/login') {
          this.router.navigate(['/categories'])
        }
      } else {
        this.cookiesService.delete('authData', '/')
        this.showNavSubject.next(false)
        this.router.navigate(['/login'])
      }
    })
  }

  registerUser(authData: AuthData): void {
    this.uiService.loadingStateChanged.next(true)
    const { email, password } = authData
    this.afauth
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.uiService.loadingStateChanged.next(false)
      })
      .catch(err => {
        this.uiService.loadingStateChanged.next(false)
        this.uiService.showSnackBar(err.message, null, 3000)
      })
  }

  loginWithUserAndPassword(authData: AuthData): void {
    this.uiService.loadingStateChanged.next(true)
    const { email, password } = authData
    this.afauth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.uiService.loadingStateChanged.next(false)
      })
      .catch(err => {
        this.uiService.loadingStateChanged.next(false)
        this.uiService.showSnackBar(err.message, null, 3000)
      })
  }

  loginWithGoogle(): void {
    this.afauth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
  }

  logout(): void {
    this.afauth.signOut()
  }

  isAuth(): boolean {
    return !!this.getUser()
  }

  getUser(): User {
    return JSON.parse(this.cookiesService.get('authData') || null)
  }
}
