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
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFirestoreCollection } from '@angular/fire/firestore'
import { MenuDialogComponent } from 'src/app/shared/modals/new-menu-modal/new-menu.component'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() sidenavToggle = new EventEmitter<void>()
  menus: Menu[]

  private dialogSub: Subscription
  private menuListSub: Subscription
  private addNewMenuSub: Subscription
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
    this.menuListSub = this.uiService.menuListChanged.subscribe(menus => {
      this.menus = menus
    })
    this.addNewMenuSub = this.uiService.addNewMenuEvent.subscribe(() => {
      this.newMenu()
    })
  }

  toggleSidenav(): void {
    this.sidenavToggle.emit()
  }

  newMenu(): void {
    const config: MatDialogConfig = {
      width: '50%',
      data: {
        name: '',
        description: ''
      }
    }
    const menuRef = this.dialog.open(MenuDialogComponent, config)
    this.dialogSub = menuRef.afterClosed().subscribe(result => {
      if (result) {
        const newMenu = {
          name: result.name,
          createdDate: new Date(),
          uid: this.authService.getUser().uid,
          categoryIds: [],
          description: result.description
        }
        this.ref.add(newMenu).then(({ id }) => {
          this.selectMenu({ id, ...newMenu })
        })
      }
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
    if (this.menuListSub) {
      this.menuListSub.unsubscribe()
    }
    if (this.addNewMenuSub) {
      this.addNewMenuSub.unsubscribe()
    }
  }
}
