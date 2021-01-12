import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  Input
} from '@angular/core'
import { Router } from '@angular/router'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFirestoreCollection } from '@angular/fire/firestore'

import { MenuDialogComponent } from '../../../shared/modals/new-menu-modal/new-menu.component'
import { ConfirmDialogComponent } from '../../../shared/modals/confirm-modal/confirm.modal'
import { AuthService } from '../../../shared/services/auth.service'
import { UIService } from '../../../shared/services/ui.service'
import { Menu, MenuList } from '../../../shared/models'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() isAdmin: boolean
  @Output() sidenavToggle = new EventEmitter<void>()
  menus: Menu[]
  menuList: MenuList[]

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
    const user = this.authService.getUser()
    if (user) {
      this.ref = this.isAdmin
        ? this.db.collection('menus')
        : this.db.collection('menus', ref =>
            ref.where('isNew', '==', 'false').where('uid', '==', user.uid)
          )
    }
  }

  ngOnInit(): void {
    this.menuListSub = this.uiService.menuListChanged.subscribe(menus => {
      this.menus = menus
      this.menuList = []
      const added = (uid: string): boolean => {
        return this.menuList.some(menu => menu.uid === uid)
      }
      this.menus.forEach((menu: Menu) => {
        if (!added(menu.uid)) {
          this.menuList.push({
            user: menu.author,
            uid: menu.uid,
            children: menu.isNew ? [] : [menu],
            id: menu.id,
            isNew: menu.isNew
          })
        } else {
          const menuItem = this.menuList.find(m => m.uid === menu.uid)
          menuItem.children.push(menu)
        }
      })
      this.menuList.forEach((menuList: MenuList) => {
        menuList.children.sort((a, b) => (a.name > b.name ? 1 : -1))
      })
      this.uiService.adminMenuList.next(this.menuList)
    })
    this.addNewMenuSub = this.uiService.addNewMenuEvent.subscribe(
      (menuList: MenuList) => {
        this.newMenu(menuList)
      }
    )
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

  newMenu(data?: MenuList): void {
    const config: MatDialogConfig = {
      width: '60%',
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
          uid: data ? data.uid : this.authService.getUser().uid,
          author: data ? data.user : this.authService.getUser().email,
          categoryIds: [],
          description: result.description,
          isNew: false
        }
        if (!data || !data.isNew) {
          this.ref.add(newMenu).then(({ id }) => {
            this.selectMenu({ id, ...newMenu })
          })
        } else {
          this.ref
            .doc(data.id)
            .update(newMenu)
            .then(() => {
              this.uiService.showSnackBar('Updated successfully', null, 3000)
            })
        }
      }
    })
  }

  editMenu(menu: Menu): void {
    const config: MatDialogConfig = {
      width: '60%',
      data: {
        name: menu.name,
        description: menu.description
      }
    }
    const menuRef = this.dialog.open(MenuDialogComponent, config)
    menuRef.afterClosed().subscribe(result => {
      if (result) {
        const { name, description } = result
        this.ref
          .doc(menu.id)
          .update({ name, description })
          .then(() => {
            menu.name = name
            menu.description = description
            this.selectMenu({ id: menu.id, ...menu })
            this.uiService.showSnackBar('Update successfully', null, 3000)
          })
      }
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
                  createdDate: null,
                  author: '',
                  isNew: true
                })
              }
              this.uiService.showSnackBar('Deleted successfully', null, 3000)
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
