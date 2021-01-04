import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore'
import { map } from 'rxjs/operators'
import { MatTableDataSource } from '@angular/material/table'
import { UIService } from 'src/app/shared/ui.service'
import { MatDialog } from '@angular/material/dialog'
import { ConfirmDialogComponent } from 'src/app/shared/confirm.modal'
import { Subscription } from 'rxjs'

export interface CategoryItem {
  id: string
  categoryId: string
  item: string
  description: string
  price: string
}

@Component({
  selector: 'app-category-items',
  templateUrl: './category-items.component.html',
  styleUrls: ['../../styles/styles.scss', './category-items.component.scss']
})
export class CategoryItemsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['item', 'description', 'price', 'action']
  columnWidth = `${100 / this.displayedColumns.length}%`
  categoryId: string
  dataSource = new MatTableDataSource<CategoryItem>()
  ref: AngularFirestoreCollection
  private categoryItemSub: Subscription

  constructor(
    private db: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private uiService: UIService,
    private dialog: MatDialog
  ) {
    this.categoryId = this.activatedRoute.snapshot.params.id
    this.ref = this.db.collection('categoryItems', ref =>
      ref.where('categoryId', '==', this.categoryId)
    )
  }

  ngOnInit(): void {
    this.categoryItemSub = this.ref
      .snapshotChanges()
      .pipe(
        map(docArray => {
          return docArray.map(doc => {
            const {
              categoryId,
              item,
              description,
              price
            } = doc.payload.doc.data() as CategoryItem
            return {
              id: doc.payload.doc.id,
              categoryId,
              item,
              description,
              price
            }
          })
        })
      )
      .subscribe(
        (categoryItem: CategoryItem[]) => {
          this.uiService.loadingStateChanged.next(false)
          this.dataSource.data = categoryItem
        },
        (err: Error) => {
          this.uiService.loadingStateChanged.next(false)
          this.uiService.showSnackBar(
            'Fetching category items failed, please try again later',
            null,
            3000
          )
        }
      )
  }

  navigateTo(element: CategoryItem): void {
    this.router.navigate([
      `/categories/${this.categoryId}/items/${element.id}/options`
    ])
  }

  addNewItem(categoryItem: CategoryItem): void {
    this.ref.add({ ...categoryItem, categoryId: this.categoryId })
  }

  removeItem(categoryItem: CategoryItem): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ref.doc(categoryItem.id).delete()
      }
    })
  }

  updatedItem(categoryItem: CategoryItem): void {
    const { id, item, description, price } = categoryItem
    this.ref.doc(id).set({ item, description, price }, { merge: true })
  }

  ngOnDestroy(): void {
    if (this.categoryItemSub) {
      this.categoryItemSub.unsubscribe()
    }
  }
}
