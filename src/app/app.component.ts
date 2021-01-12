import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subject, Subscription } from 'rxjs'
import { ObservableService } from './shared/services/observable.service'
import { AuthService } from './shared/services/auth.service'
import { UIService } from './shared/services/ui.service'
import { Menu } from './shared/models'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'restaurant-menu'
  subject = new Subject<'add'>()
  isAuth: boolean
  isAdmin: boolean
  menu: Menu

  private navSub: Subscription
  private categorySub: Subscription
  private menuListChanged: Subscription

  constructor(
    private observable: ObservableService,
    private auth: AuthService,
    private uiService: UIService
  ) {
    this.menu = this.uiService.selectedMenu
    this.navSub = this.auth.showNavSubject.subscribe(isAuthChanges => {
      this.isAuth = isAuthChanges
    })
  }

  ngOnInit(): void {
    this.auth.initAuthListener((res: boolean) => {
      if (res) {
        this.isAdmin = this.auth.getUser().isAdmin
      }
    })
    this.isAuth = this.auth.isAuth()
    this.categorySub = this.uiService.categoryListChanged.subscribe(
      (menu: Menu) => {
        if (!menu.isNew) {
          this.menu = menu
        }
      }
    )
    this.menuListChanged = this.uiService.menuListChanged.subscribe(
      (menus: Menu[]) => {
        if (!menus.length || this.isAdmin) {
          this.menu = {
            name: this.isAdmin
              ? `Please select user's menu to edit`
              : 'Please create your first menu',
            uid: null,
            categoryIds: [],
            id: null,
            createdDate: null,
            author: '',
            isNew: true
          }
        }
      }
    )
  }

  addItem(): void {
    this.observable.add()
  }

  preview(): void {
    const uid = this.auth.getUser().uid
    const menuName = this.uiService.selectedMenu.name
    window.location.href = `https://preview.menu2orders.com?uid=${uid}&name=${menuName}`
  }

  edit(menu: Menu): void {
    this.uiService.editMenu.next(menu)
  }

  ngOnDestroy(): void {
    if (this.categorySub) {
      this.categorySub.unsubscribe()
    }
    if (this.navSub) {
      this.navSub.unsubscribe()
    }
    if (this.menuListChanged) {
      this.menuListChanged.unsubscribe()
    }
  }
}
