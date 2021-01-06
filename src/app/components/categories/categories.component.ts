import { Component, OnInit, OnDestroy } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { Router } from '@angular/router'
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore'
import { map } from 'rxjs/operators'
import { MatDialog } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { UIService } from 'src/app/shared/services/ui.service'
import { ConfirmDialogComponent } from 'src/app/shared/confirm-modal/confirm.modal'

export interface Category {
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
  ref: AngularFirestoreCollection
  private categorySub: Subscription

  constructor(
    private db: AngularFirestore,
    private router: Router,
    private uiService: UIService,
    private dialog: MatDialog
  ) {
    this.ref = this.db.collection('categories')
  }

  ngOnInit(): void {
    this.categorySub = this.ref
      .snapshotChanges()
      .pipe(
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
      .subscribe(
        (categories: Category[]) => {
          this.uiService.loadingStateChanged.next(false)
          this.dataSource.data = categories
        },
        err => {
          this.uiService.loadingStateChanged.next(false)
          this.uiService.showSnackBar(
            'Fetching category failed, please try again later',
            null,
            3000
          )
        }
      )
  }

  navigateTo(element: Category): void {
    this.router.navigate([`/categories/${element.id}/items`])
  }

  addNewItem(item: Category): void {
    this.ref.add({ ...item })
  }

  removeItem(item: Category): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ref.doc(item.id).delete()
      }
    })
  }

  updatedItem(item: Category): void {
    this.ref.doc(item.id).set({ category: item.category }, { merge: true })
  }

  ngOnDestroy(): void {
    if (this.categorySub) {
      this.categorySub.unsubscribe()
    }
  }
}
