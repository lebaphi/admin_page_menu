import { Subject } from 'rxjs'
import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { CookieService } from 'ngx-cookie-service'
import { Menu, MenuList } from '../models'
import { APP_PATH } from '../const'

@Injectable()
export class UIService {
  loadingStateChanged = new Subject<boolean>()
  menuListChanged = new Subject<Menu[]>()
  categoryListChanged = new Subject<Menu>()
  addNewMenuEvent = new Subject<void>()
  editMenu = new Subject<Menu>()
  deleteMenu = new Subject<Menu>()
  adminMenuList = new Subject<MenuList[]>()

  constructor(
    private snackbar: MatSnackBar,
    private cookiesService: CookieService
  ) {}

  showSnackBar(message: string, action: string, duration: number): void {
    this.snackbar.open(message, action, { duration })
  }

  get initialLoad(): boolean {
    if (this.cookiesService.get('initialLoad')) {
      return !!JSON.stringify(this.cookiesService.get('initialLoad'))
    }
    return false
  }

  initialLoaded(): void {
    this.cookiesService.set('initialLoad', 'true', 1, APP_PATH)
  }

  setMenus(menus: Menu[]): void {
    this.cookiesService.set('menus', JSON.stringify(menus), 1, APP_PATH)
  }

  get menus(): Menu[] {
    return JSON.parse(this.cookiesService.get('menus') || null)
  }

  setSelectedMenu(menu: Menu): void {
    this.cookiesService.set('selectedMenu', JSON.stringify(menu), 1, APP_PATH)
  }

  get selectedMenu(): Menu {
    return JSON.parse(this.cookiesService.get('selectedMenu') || null)
  }
}
