import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
import { AngularFireAuth } from '@angular/fire/auth'
import firebase from 'firebase/app'
import 'firebase/auth'
import { CookieService } from 'ngx-cookie-service'
import { UIService } from './ui.service'
import { environment } from '../../../environments/environment'
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFirestoreCollection } from '@angular/fire/firestore'
import { User, AuthData } from '../models'
import { APP_PATH } from '../const'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  showNavSubject = new Subject<boolean>()

  private menuRef: AngularFirestoreCollection

  constructor(
    private router: Router,
    private afauth: AngularFireAuth,
    private uiService: UIService,
    private cookiesService: CookieService,
    private db: AngularFirestore
  ) {
    this.menuRef = this.db.collection('menus')
  }

  initAuthListener(cb: (result: boolean) => void): void {
    this.uiService.loadingStateChanged.next(true)
    this.afauth.authState.subscribe(user => {
      this.uiService.loadingStateChanged.next(false)
      if (user) {
        const { uid, email, displayName, photoURL } = user
        const isAdmin = uid === environment.theEditor.uid
        const localUser: User = { uid, email, displayName, photoURL, isAdmin }

        this.cookiesService.set(
          'authData',
          JSON.stringify(localUser),
          1,
          APP_PATH
        )
        this.showNavSubject.next(true)
        if (this.router.url === '/login') {
          this.router.navigate(['/categories'])
        }
        cb(true)
      } else {
        const cookies = ['authData', 'selectedMenu', 'initialLoad', 'menus']
        for (const cookie of cookies) {
          this.cookiesService.delete(cookie, APP_PATH)
        }
        this.showNavSubject.next(false)
        this.router.navigate(['/login'])
        cb(false)
      }
    })
  }

  registerUser(authData: AuthData): void {
    this.uiService.loadingStateChanged.next(true)
    const { email, password } = authData
    this.afauth
      .createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        this.menuRef
          .add({
            author: user.email,
            uid: user.uid,
            isNew: true
          })
          .then(() => {
            this.uiService.loadingStateChanged.next(false)
          })
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
