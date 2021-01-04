import { Component, OnInit, OnDestroy } from '@angular/core'
import { FormGroup, Validators, FormControl, NgForm } from '@angular/forms'
import { Subscription } from 'rxjs'
import { AuthService } from 'src/app/services/auth.service'
import { UIService } from 'src/app/shared/ui.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoginMode = true
  loginForm: FormGroup
  isLoading = false
  btnLabel = 'Signup'
  private loadingSub: Subscription

  constructor(private authService: AuthService, private uiService: UIService) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', { validators: [Validators.required] })
    })
  }

  loadForm(): void {
    this.isLoginMode = !this.isLoginMode
    this.btnLabel = this.isLoginMode ? 'Signup' : 'Login'
  }

  loginGoogle(): void {
    this.authService.loginWithGoogle()
  }

  onLoginSubmit(): void {
    this.authService.loginWithUserAndPassword({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    })
  }

  onSignupSubmit(form: NgForm): void {
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password
    })
  }

  ngOnDestroy(): void {
    if (this.loadingSub) {
      this.loadingSub.unsubscribe()
    }
  }
}
