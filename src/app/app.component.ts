import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subject, Subscription } from 'rxjs'
import { ObservableService } from './services/observable.service'
import { AuthService } from './services/auth.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'restaurant-menu'
  subject = new Subject<'add' | 'export'>()
  isAuth: boolean
  subscription: Subscription

  constructor(
    private observable: ObservableService,
    private auth: AuthService
  ) {
    this.subscription = this.auth.showNavSubject.subscribe(isAuthChanges => {
      this.isAuth = isAuthChanges
    })
  }

  ngOnInit(): void {
    this.auth.initAuthListener()
    this.isAuth = this.auth.isAuth()
  }

  addItem(): void {
    this.observable.add()
  }

  export(): void {
    this.observable.export()
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}
