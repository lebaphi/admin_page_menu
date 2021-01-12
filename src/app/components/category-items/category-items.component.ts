import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore'
import { map } from 'rxjs/operators'
import { MatTableDataSource } from '@angular/material/table'
import { MatDialog } from '@angular/material/dialog'
import { Subscription } from 'rxjs'

import { UIService } from '../../shared/services/ui.service'
import { ConfirmDialogComponent } from '../../shared/modals/confirm-modal/confirm.modal'
import { CategoryItem } from '../../shared/models'

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
          const arr = docArray.map(doc => {
            const {
              categoryId,
              item,
              description,
              price,
              order
            } = doc.payload.doc.data() as CategoryItem
            return {
              id: doc.payload.doc.id,
              categoryId,
              item,
              description,
              price,
              order
            }
          })
          return arr.sort((a, b) => (a.order > b.order ? 1 : -1))
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
    this.ref.doc(id).update({ item, description, price })
  }

  updateOrder(): void {
    this.dataSource.data.forEach(({ id, order }: CategoryItem) => {
      this.ref.doc(id).update({ order })
    })
  }

  ngOnDestroy(): void {
    if (this.categoryItemSub) {
      this.categoryItemSub.unsubscribe()
    }
  }
}
