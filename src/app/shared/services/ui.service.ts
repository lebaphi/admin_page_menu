import { Subject } from 'rxjs'
import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { CookieService } from 'ngx-cookie-service'
import { Menu } from '../../components/categories/categories.component'

@Injectable()
export class UIService {
  loadingStateChanged = new Subject<boolean>()
  menuListChanged = new Subject<Menu[]>()
  categoryListChanged = new Subject<Menu>()
  addNewMenuEvent = new Subject<void>()
  editMenu = new Subject<Menu>()
  deleteMenu = new Subject<Menu>()

  constructor(
    private snackbar: MatSnackBar,
    private cookieService: CookieService
  ) {}

  showSnackBar(message: string, action: string, duration: number): void {
    this.snackbar.open(message, action, { duration })
  }

  get initialLoad(): boolean {
    if (this.cookieService.get('initialLoad')) {
      return !!JSON.stringify(this.cookieService.get('initialLoad'))
    }
    return false
  }

  initialLoaded(): void {
    this.cookieService.set('initialLoad', 'true', 1, '/')
  }

  setMenus(menus: Menu[]): void {
    this.cookieService.set('menus', JSON.stringify(menus), 1, '/')
  }

  get menus(): Menu[] {
    return JSON.parse(this.cookieService.get('menus') || null)
  }

  setSelectedMenu(menu: Menu): void {
    this.cookieService.set('selectedMenu', JSON.stringify(menu), 1, '/')
  }

  get selectedMenu(): Menu {
    return JSON.parse(this.cookieService.get('selectedMenu') || null)
  }
}
