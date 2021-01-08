import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subject, Subscription } from 'rxjs'
import { ObservableService } from './shared/services/observable.service'
import { AuthService } from './shared/services/auth.service'
import { UIService } from './shared/services/ui.service'
import { Menu } from './components/categories/categories.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'restaurant-menu'
  subject = new Subject<'add' | 'export'>()
  isAuth: boolean
  menu: Menu

  private navSub: Subscription
  private categorySub: Subscription

  constructor(
    private observable: ObservableService,
    private auth: AuthService,
    private uiService: UIService
  ) {
    this.navSub = this.auth.showNavSubject.subscribe(isAuthChanges => {
      this.isAuth = isAuthChanges
    })
  }

  ngOnInit(): void {
    this.auth.initAuthListener()
    this.isAuth = this.auth.isAuth()
    this.categorySub = this.uiService.categoryListChanged.subscribe(
      (menu: Menu) => {
        this.menu = menu
      }
    )
  }

  addItem(): void {
    this.observable.add()
  }

  export(): void {
    this.observable.export()
  }

  ngOnDestroy(): void {
    if (this.categorySub) {
      this.categorySub.unsubscribe()
    }
    if (this.navSub) {
      this.navSub.unsubscribe()
    }
  }
}
