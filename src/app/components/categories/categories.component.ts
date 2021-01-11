import { Component, OnInit, OnDestroy } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { Router } from '@angular/router'
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore'
import { map } from 'rxjs/operators'
import { MatDialog } from '@angular/material/dialog'
import { Subscription, Observable } from 'rxjs'
import firebase from 'firebase/app'
import 'firebase/firestore'

import { AuthService } from '../../shared/services/auth.service'
import { ConfirmDialogComponent } from '../../shared/modals/confirm-modal/confirm.modal'
import { UIService } from '../../shared/services/ui.service'

export type Menu = {
  categoryIds: string[]
  createdDate: Date
  name: string
  uid: string
  id: string
  description?: string
}

export type Category = {
  id: string
  category: string
  order: number
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['../../styles/styles.scss', './categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['category', 'action']
  columnWidth = `${100 / this.displayedColumns.length}%`
  dataSource = new MatTableDataSource<Category>()

  private menuRef: AngularFirestoreCollection
  private categoriesRef: AngularFirestoreCollection
  private menuSub: Subscription
  private categorySub: Subscription
  private categoryChangeSub: Subscription
  private dialogSub: Subscription

  constructor(
    private db: AngularFirestore,
    private router: Router,
    private uiService: UIService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.menuSub = this.fetchMenu().subscribe(
      (menus: Menu[]) => {
        this.uiService.menuListChanged.next(menus)
        this.uiService.setMenus(menus)
        if (menus.length) {
          if (!this.uiService.initialLoad) {
            this.uiService.initialLoaded()
            this.uiService.setSelectedMenu(menus[0])
          }
          this.uiService.categoryListChanged.next(this.uiService.selectedMenu)
        }
      },
      err => this.showError('Fetching menu failed, please try again later')
    )

    this.categoryChangeSub = this.uiService.categoryListChanged.subscribe(
      (menu: Menu) => {
        this.uiService.setSelectedMenu(menu)
        this.categorySub = this.fetchCategory(menu.categoryIds).subscribe(
          (categories: Category[]) => {
            this.dataSource.data = categories
          },
          err =>
            this.showError('Fetching category failed, please try again later')
        )
      }
    )
  }

  showError(msg: string): void {
    this.uiService.loadingStateChanged.next(false)
    this.uiService.showSnackBar(msg, null, 3000)
  }

  fetchMenu(): Observable<Menu[]> {
    const authData = this.authService.getUser()
    this.menuRef = this.db.collection('menus', ref =>
      ref.where('uid', '==', authData.uid)
    )
    return this.menuRef.snapshotChanges().pipe(
      map(docArray => {
        if (!docArray.length) {
          return []
        }
        const mappedMenus = docArray.map(doc => {
          const {
            categoryIds,
            name,
            createdDate,
            uid,
            description
          } = doc.payload.doc.data() as Menu
          return {
            id: doc.payload.doc.id,
            categoryIds,
            name,
            createdDate,
            uid,
            description
          }
        })
        return mappedMenus.sort((a, b) => (a.name > b.name ? 1 : -1))
      })
    )
  }

  fetchCategory(categoryIds: string[]): Observable<Category[]> {
    const filteredId = categoryIds.length === 0 ? ['empty_id'] : categoryIds
    this.categoriesRef = this.db.collection('categories', ref =>
      ref.where(firebase.firestore.FieldPath.documentId(), 'in', filteredId)
    )
    return this.categoriesRef.snapshotChanges().pipe(
      map(docArray => {
        const arr = docArray.map(doc => {
          const { category, order } = doc.payload.doc.data() as Category
          return {
            id: doc.payload.doc.id,
            category,
            order
          }
        })
        return arr.sort((a, b) => (a.order > b.order ? 1 : -1))
      })
    )
  }

  navigateTo(element: Category): void {
    this.router.navigate([`/categories/${element.id}/items`])
  }

  addNewItem(item: Category): void {
    this.categoriesRef.add({ ...item }).then(category => {
      const {
        id,
        name,
        createdDate,
        uid,
        categoryIds
      } = this.uiService.selectedMenu
      categoryIds.push(category.id)
      this.menuRef
        .doc(id)
        .update({ name, createdDate, uid, categoryIds })
        .then(() => {
          const menu = this.uiService.selectedMenu
          menu.categoryIds.push(category.id)
          this.uiService.setSelectedMenu(menu)
        })
    })
  }

  removeItem(item: Category): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent)
    this.dialogSub = dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const categoryIds = this.uiService.selectedMenu.categoryIds.filter(
          id => id !== item.id
        )
        this.menuRef
          .doc(this.uiService.selectedMenu.id)
          .update({ categoryIds })
          .then(() => {
            this.uiService.selectedMenu.categoryIds = categoryIds
            this.categoriesRef.doc(item.id).delete()
          })
      }
    })
  }

  updatedItem(item: Category): void {
    this.categoriesRef.doc(item.id).update({ category: item.category })
  }

  updateOrder(): void {
    this.dataSource.data.forEach(({ id, order }: Category) => {
      this.categoriesRef.doc(id).update({ order })
    })
  }

  ngOnDestroy(): void {
    if (this.menuSub) {
      this.menuSub.unsubscribe()
    }
    if (this.categorySub) {
      this.categorySub.unsubscribe()
    }
    if (this.categoryChangeSub) {
      this.categoryChangeSub.unsubscribe()
    }
    if (this.dialogSub) {
      this.dialogSub.unsubscribe()
    }
  }
}
