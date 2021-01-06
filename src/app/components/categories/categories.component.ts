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
import { UIService } from 'src/app/shared/services/ui.service'
import { ConfirmDialogComponent } from 'src/app/shared/confirm-modal/confirm.modal'
import firebase from 'firebase'
import { AuthService } from 'src/app/shared/services/auth.service'

export type Menu = {
  categoryIds: string[]
  createdDate: Date
  name: string
  uid: string
  id: string
}

export type Category = {
  id: string
  category: string
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

  private firstLoad = true
  private selectedMenu: Menu
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
        if (this.firstLoad) {
          this.firstLoad = false
          this.selectedMenu = menus[0]
          this.uiService.categoryListChanged.next(this.selectedMenu)
        }
      },
      err => this.showError('Fetching menu failed, please try again later')
    )

    this.categoryChangeSub = this.uiService.categoryListChanged.subscribe(
      (menu: Menu) => {
        this.selectedMenu = menu
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
        const mappedMenus = docArray.map(doc => {
          const {
            categoryIds,
            name,
            createdDate,
            uid
          } = doc.payload.doc.data() as Menu
          return {
            id: doc.payload.doc.id,
            categoryIds,
            name,
            createdDate,
            uid
          }
        })
        return mappedMenus.sort((a, b) => (a.name > b.name ? 1 : -1))
      })
    )
  }

  fetchCategory(categoryIds: string[]): Observable<Category[]> {
    if (categoryIds.length === 0) {
      categoryIds.push('undefined')
    }
    this.categoriesRef = this.db.collection('categories', ref =>
      ref.where(firebase.firestore.FieldPath.documentId(), 'in', categoryIds)
    )
    return this.categoriesRef.snapshotChanges().pipe(
      map(docArray => {
        return docArray.map(doc => {
          const { category } = doc.payload.doc.data() as Category
          return {
            id: doc.payload.doc.id,
            category
          }
        })
      })
    )
  }

  navigateTo(element: Category): void {
    this.router.navigate([`/categories/${element.id}/items`])
  }

  addNewItem(item: Category): void {
    this.categoriesRef.add({ ...item }).then(category => {
      this.selectedMenu.categoryIds.push(category.id)
      const { id, name, createdDate, uid, categoryIds } = this.selectedMenu
      this.menuRef
        .doc(id)
        .set({ name, createdDate, uid, categoryIds }, { merge: true })
        .then(() => {
          this.uiService.categoryListChanged.next(this.selectedMenu)
        })
    })
  }

  removeItem(item: Category): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent)
    this.dialogSub = dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoriesRef.doc(item.id).delete()
      }
    })
  }

  updatedItem(item: Category): void {
    this.categoriesRef
      .doc(item.id)
      .set({ category: item.category }, { merge: true })
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
