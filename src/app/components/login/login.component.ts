import { Component, OnInit } from '@angular/core'
import { FirebaseService } from 'src/app/services/firebase.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private firebase: FirebaseService) {}

  ngOnInit(): void {}

  loginGoogle(): void {
    this.firebase.loginWithGoogle()
  }
}
