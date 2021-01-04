import { Component, Input, OnInit, OnDestroy } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { ActivatedRoute } from '@angular/router'
import {
  AngularFirestoreCollection,
  AngularFirestore
} from '@angular/fire/firestore'
import { UIService } from 'src/app/shared/ui.service'
import { map } from 'rxjs/operators'
import { ConfirmDialogComponent } from 'src/app/shared/confirm.modal'
import { MatDialog } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
export interface ItemExtras {
  id: string
  extra: string
  price: string
}

@Component({
  selector: 'app-edit-extras',
  templateUrl: './edit-extras.component.html',
  styleUrls: ['../../styles/styles.scss', './edit-extras.component.scss']
})
export class EditExtrasComponent implements OnInit, OnDestroy {
  private extraSub: Subscription

  displayedColumns: string[] = ['extra', 'price', 'action']
  columnWidth = `${100 / this.displayedColumns.length}%`
  dataSource = new MatTableDataSource<ItemExtras>()
  ref: AngularFirestoreCollection

  categoryId: string
  itemId: string
  optionId: string

  constructor(
    private db: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private uiService: UIService,
    private dialog: MatDialog
  ) {
    const { id, itemId, optionId } = this.activatedRoute.snapshot.params
    this.categoryId = id
    this.itemId = itemId
    this.optionId = optionId
    this.ref = this.db.collection('extras', ref =>
      ref.where('optionId', '==', this.optionId)
    )
  }

  ngOnInit(): void {
    this.extraSub = this.ref
      .snapshotChanges()
      .pipe(
        map(docArray => {
          return docArray.map(doc => {
            const { extra, price } = doc.payload.doc.data() as ItemExtras
            return {
              id: doc.payload.doc.id,
              extra,
              price
            }
          })
        })
      )
      .subscribe(
        (itemExtras: ItemExtras[]) => {
          this.uiService.loadingStateChanged.next(false)
          this.dataSource.data = itemExtras
        },
        (err: Error) => {
          this.uiService.loadingStateChanged.next(false)
          this.uiService.showSnackBar(
            'Fetching extras failed, please try again later',
            null,
            3000
          )
        }
      )
  }

  addNewItem(itemExtra: ItemExtras): void {
    this.ref.add({ ...itemExtra, optionId: this.optionId })
  }

  removeItem(itemExtra: ItemExtras): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ref.doc(itemExtra.id).delete()
      }
    })
  }

  updatedItem(itemExtra: ItemExtras): void {
    const { id, extra, price } = itemExtra
    this.ref.doc(id).set({ extra, price }, { merge: true })
  }

  ngOnDestroy(): void {
    if (this.extraSub) {
      this.extraSub.unsubscribe()
    }
  }
}
