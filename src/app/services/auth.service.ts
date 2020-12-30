import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Router } from '@angular/router'
import firebase from 'firebase'
import { Subject } from 'rxjs'
import { FirebaseService } from './firebase.service'

export type User = {
  uid: string
  displayName: string
  email: string
  photoURL: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authInfo: User = null
  subject = new Subject<User>()

  constructor(
    private router: Router,
    private firebaseService: FirebaseService
  ) {
    firebase.auth().onAuthStateChanged(user => {
      this.subject.next(user)
      if (user) {
        const { uid, displayName, email, photoURL } = user
        const authInfo: User = { uid, displayName, email, photoURL }
        this.login(authInfo)
      } else {
        this.logout()
      }
    })
  }

  isAuthenticated(): boolean {
    return this.authInfo !== null
  }

  login(user: User): void {
    this.authInfo = user
    this.router.navigate(['categories'])
  }

  logout(): void {
    this.authInfo = null
    this.firebaseService.logout()
    this.router.navigate(['login'])
  }
}
