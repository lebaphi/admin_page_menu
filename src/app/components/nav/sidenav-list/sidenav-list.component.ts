import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  Input
} from '@angular/core'
import { Subscription } from 'rxjs'
import { AuthService } from '../../../shared/services/auth.service'
import { UIService } from '../../../shared/services/ui.service'
import { Menu, MenuList } from '../../../shared/models'

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  @Input() isAdmin: boolean
  @Output() closeSidenav = new EventEmitter<void>()

  menus: Menu[]
  menuList: MenuList[] = []

  private menuListSub: Subscription
  private adminMenuListSub: Subscription

  constructor(private authService: AuthService, private uiService: UIService) {
    this.menus = this.uiService.menus || []
  }

  ngOnInit(): void {
    this.menuListSub = this.uiService.menuListChanged.subscribe(menus => {
      this.menus = menus
    })
    this.adminMenuListSub = this.uiService.adminMenuList.subscribe(
      (menuList: MenuList[]) => {
        this.menuList = menuList
      }
    )
  }

  onClose(): void {
    this.closeSidenav.emit()
  }

  newMenu(data?: MenuList): void {
    this.uiService.addNewMenuEvent.next(data)
    this.onClose()
  }

  selectMenu(menu: Menu): void {
    this.uiService.categoryListChanged.next(menu)
    this.onClose()
  }

  deleteMenu(menu: Menu): void {
    this.uiService.deleteMenu.next(menu)
  }

  onLogout(): void {
    this.authService.logout()
  }

  ngOnDestroy(): void {
    if (this.menuListSub) {
      this.menuListSub.unsubscribe()
    }
    if (this.adminMenuListSub) {
      this.adminMenuListSub.unsubscribe()
    }
  }
}
