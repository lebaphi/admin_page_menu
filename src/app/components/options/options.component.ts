import { Component, OnInit, Input, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { MatTableDataSource } from '@angular/material/table'
import {
  AngularFirestoreCollection,
  AngularFirestore
} from '@angular/fire/firestore'
import { map } from 'rxjs/operators'
import { UIService } from 'src/app/shared/ui.service'
import { MatDialog } from '@angular/material/dialog'
import { ConfirmDialogComponent } from 'src/app/shared/confirm.modal'
import { Subscription } from 'rxjs'

export interface Option {
  id: string
  option: string
  required: string
}

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['../../styles/styles.scss', './options.component.scss']
})
export class OptionsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['option', 'required', 'action']
  columnWidth = `${100 / this.displayedColumns.length}%`
  dataSource = new MatTableDataSource<Option>()
  categoryId: string
  itemId: string
  ref: AngularFirestoreCollection
  private optionSub: Subscription

  constructor(
    private db: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private uiService: UIService,
    private dialog: MatDialog
  ) {
    const { id, itemId } = this.activatedRoute.snapshot.params
    this.categoryId = id
    this.itemId = itemId
    this.ref = this.db.collection('itemOptions', ref =>
      ref.where('itemId', '==', this.itemId)
    )
  }

  ngOnInit(): void {
    this.optionSub = this.ref
      .snapshotChanges()
      .pipe(
        map(docArray => {
          return docArray.map(doc => {
            const { option, required } = doc.payload.doc.data() as Option
            return {
              id: doc.payload.doc.id,
              option,
              required
            }
          })
        })
      )
      .subscribe(
        (options: Option[]) => {
          this.uiService.loadingStateChanged.next(false)
          this.dataSource.data = options
        },
        (err: Error) => {
          this.uiService.loadingStateChanged.next(false)
          this.uiService.showSnackBar(
            'Fetching options failed, please try again later',
            null,
            3000
          )
        }
      )
  }

  navigateTo(element: any): void {
    this.router.navigate([
      `/categories/${this.categoryId}/items/${this.itemId}/options/${element.id}/extras`
    ])
  }

  addNewItem(optionItem: Option): void {
    this.ref.add({ ...optionItem, itemId: this.itemId })
  }

  removeItem(optionItem: Option): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ref.doc(optionItem.id).delete()
      }
    })
  }

  updatedItem(optionItem: Option): void {
    const { id, option, required } = optionItem
    this.ref.doc(id).set({ option, required }, { merge: true })
  }

  ngOnDestroy(): void {
    if (this.optionSub) {
      this.optionSub.unsubscribe()
    }
  }
}
