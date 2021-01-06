import { Subject } from 'rxjs'
import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Menu } from 'src/app/components/categories/categories.component'

@Injectable()
export class UIService {
  loadingStateChanged = new Subject<boolean>()
  menuListChanged = new Subject<Menu[]>()
  categoryListChanged = new Subject<Menu>()

  constructor(private snackbar: MatSnackBar) {}

  showSnackBar(message: string, action: string, duration: number): void {
    this.snackbar.open(message, action, { duration })
  }
}
