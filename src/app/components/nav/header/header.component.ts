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
import { Router } from '@angular/router'
import { ConfirmDialogComponent } from 'src/app/shared/modals/confirm-modal/confirm.modal'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() sidenavToggle = new EventEmitter<void>()
  menus: Menu[]

  private dialogSubs: Subscription[] = []
  private menuListSub: Subscription
  private addNewMenuSub: Subscription
  private editMenuSub: Subscription
  private deleteMenuSub: Subscription
  private ref: AngularFirestoreCollection

  constructor(
    private authService: AuthService,
    private uiService: UIService,
    private dialog: MatDialog,
    private db: AngularFirestore,
    private router: Router
  ) {
    this.menus = this.uiService.menus || []
    this.ref = this.db.collection('menus')
  }

  ngOnInit(): void {
    this.menuListSub = this.uiService.menuListChanged.subscribe(menus => {
      this.menus = menus
    })
    this.addNewMenuSub = this.uiService.addNewMenuEvent.subscribe(() => {
      this.newMenu()
    })
    this.editMenuSub = this.uiService.editMenu.subscribe((menu: Menu) => {
      this.editMenu(menu)
    })
    this.deleteMenuSub = this.uiService.deleteMenu.subscribe((menu: Menu) => {
      this.deleteMenu(menu)
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
    menuRef.afterClosed().subscribe(result => {
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

  editMenu(menu: Menu): void {
    const config: MatDialogConfig = {
      width: '50%',
      data: {
        name: menu.name,
        description: menu.description
      }
    }
    const menuRef = this.dialog.open(MenuDialogComponent, config)
    menuRef.afterClosed().subscribe(result => {
      const { name, description } = result
      this.ref
        .doc(menu.id)
        .update({ name, description })
        .then(() => {
          menu.name = name
          menu.description = description
          this.selectMenu({ id: menu.id, ...menu })
          this.uiService.showSnackBar('Update menu success', null, 3000)
        })
    })
  }
  selectMenu(menu: Menu): void {
    this.uiService.setSelectedMenu(menu)
    if (this.router.url === '/categories') {
      this.uiService.categoryListChanged.next(menu)
    } else {
      this.router.navigate(['/categories'])
    }
  }

  deleteMenu(menu: Menu): void {
    const menuRef = this.dialog.open(ConfirmDialogComponent)
    this.dialogSubs.push(
      menuRef.afterClosed().subscribe(result => {
        if (result) {
          this.menus.splice(this.menus.indexOf(menu), 1)
          this.ref
            .doc(menu.id)
            .delete()
            .then(() => {
              if (this.menus.length) {
                this.selectMenu(this.menus[0])
              } else {
                this.selectMenu({
                  name: `Please create your first menu`,
                  uid: null,
                  categoryIds: [],
                  id: null,
                  createdDate: null
                })
              }
            })
        }
      })
    )
  }

  logout(): void {
    this.authService.logout()
  }

  ngOnDestroy(): void {
    if (this.dialogSubs) {
      this.dialogSubs.forEach(sub => sub.unsubscribe())
    }
    if (this.menuListSub) {
      this.menuListSub.unsubscribe()
    }
    if (this.addNewMenuSub) {
      this.addNewMenuSub.unsubscribe()
    }
    if (this.editMenuSub) {
      this.editMenuSub.unsubscribe()
    }
    if (this.deleteMenuSub) {
      this.deleteMenuSub.unsubscribe()
    }
  }
}
