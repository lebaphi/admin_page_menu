import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core'
import { AuthService } from 'src/app/shared/services/auth.service'
import { UIService } from 'src/app/shared/services/ui.service'
import { Menu } from '../../categories/categories.component'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { MenuDialogComponent } from 'src/app/shared/new-menu-modal/new-menu.component'
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFirestoreCollection } from '@angular/fire/firestore'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() sidenavToggle = new EventEmitter<void>()
  menus: Menu[]

  private dialogSub: Subscription
  private ref: AngularFirestoreCollection

  constructor(
    private authService: AuthService,
    private uiService: UIService,
    private dialog: MatDialog,
    private db: AngularFirestore
  ) {
    this.ref = this.db.collection('menus')
  }

  ngOnInit(): void {
    this.uiService.menuListChanged.subscribe(menus => {
      this.menus = menus
    })
  }

  toggleSidenav(): void {
    this.sidenavToggle.emit()
  }

  newMenu(): void {
    const config: MatDialogConfig = {
      width: '50%',
      data: ''
    }
    const menuRef = this.dialog.open(MenuDialogComponent, config)
    this.dialogSub = menuRef.afterClosed().subscribe(result => {
      const newMenu = {
        name: result,
        createdDate: new Date(),
        uid: this.authService.getUser().uid,
        categoryIds: [],
        id: ''
      }
      this.ref.add(newMenu).then(() => {
        this.selectMenu(newMenu)
      })
    })
  }

  selectMenu(menu: Menu): void {
    this.uiService.categoryListChanged.next(menu)
  }

  logout(): void {
    this.authService.logout()
  }

  ngOnDestroy(): void {
    if (this.dialogSub) {
      this.dialogSub.unsubscribe()
    }
  }
}
