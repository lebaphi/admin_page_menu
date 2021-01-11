import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core'
import { Subscription } from 'rxjs'
import { AuthService } from '../../../shared/services/auth.service'
import { Menu } from '../../categories/categories.component'
import { UIService } from '../../../shared/services/ui.service'

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  @Output() closeSidenav = new EventEmitter<void>()
  menus: Menu[]

  private menuListSub: Subscription

  constructor(private authService: AuthService, private uiService: UIService) {
    this.menus = this.uiService.menus || []
  }

  ngOnInit(): void {
    this.menuListSub = this.uiService.menuListChanged.subscribe(menus => {
      this.menus = menus
    })
  }

  onClose(): void {
    this.closeSidenav.emit()
  }

  newMenu(): void {
    this.uiService.addNewMenuEvent.next()
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
  }
}
