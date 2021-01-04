import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
import { UIService } from '../shared/ui.service'
import { AngularFireAuth } from '@angular/fire/auth'
import firebase from 'firebase'

export type User = {
  uid: string
  displayName: string
  email: string
  photoURL: string
  refreshToken: string
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
  private isAuthenticated = false

  constructor(
    private router: Router,
    private afauth: AngularFireAuth,
    private uiService: UIService
  ) {}

  initAuthListener(): void {
    this.uiService.loadingStateChanged.next(true)
    this.afauth.authState.subscribe(user => {
      this.uiService.loadingStateChanged.next(false)
      if (user) {
        this.isAuthenticated = true
        this.showNavSubject.next(true)
        this.router.navigate(['/categories'])
      } else {
        this.isAuthenticated = false
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
    return this.isAuthenticated
  }
}
