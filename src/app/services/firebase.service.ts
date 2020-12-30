import { Injectable } from '@angular/core'
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

import { environment } from '../../environments/environment'
import { User, AuthService } from './auth.service'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private db: firebase.database.Database
  private googleProvider = new firebase.auth.GoogleAuthProvider()

  constructor() {
    firebase.initializeApp(environment.firebaseConfig)
    this.db = firebase.database()
  }

  loginWithGoogle(): void {
    firebase.auth().signInWithPopup(this.googleProvider)
  }

  logout(): void {
    firebase.auth().signOut()
  }
}
