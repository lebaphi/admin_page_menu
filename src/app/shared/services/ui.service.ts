import { Subject } from 'rxjs'
import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Menu } from 'src/app/components/categories/categories.component'

@Injectable()
export class UIService {
  loadingStateChanged = new Subject<boolean>()
  menuListChanged = new Subject<Menu[]>()
  categoryListChanged = new Subject<Menu>()
  addNewMenuEvent = new Subject<void>()

  private isFirstLoad = true
  private currentMenu: Menu

  constructor(private snackbar: MatSnackBar) {}

  showSnackBar(message: string, action: string, duration: number): void {
    this.snackbar.open(message, action, { duration })
  }

  get initialLoad(): boolean {
    return this.isFirstLoad
  }

  initialLoaded(): void {
    this.isFirstLoad = false
  }

  setSelectedMenu(menu: Menu): void {
    this.currentMenu = menu
  }

  get selectedMenu(): Menu {
    return this.currentMenu
  }
}
