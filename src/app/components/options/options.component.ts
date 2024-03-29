import { Component, OnInit, Input, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router, Params } from '@angular/router'
import { MatTableDataSource } from '@angular/material/table'
import {
  AngularFirestoreCollection,
  AngularFirestore
} from '@angular/fire/firestore'
import { map } from 'rxjs/operators'
import { MatDialog } from '@angular/material/dialog'
import { Subscription, Observable } from 'rxjs'

import { UIService } from '../../shared/services/ui.service'
import { ConfirmDialogComponent } from '../../shared/modals/confirm-modal/confirm.modal'
import { Option } from '../../shared/models'

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
  categoryItem: Observable<Params>
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
    this.categoryItem = this.activatedRoute.queryParams
    this.ref = this.db.collection('itemOptions', ref =>
      ref.where('itemId', '==', this.itemId)
    )
  }

  ngOnInit(): void {
    this.optionSub = this.ref
      .snapshotChanges()
      .pipe(
        map(docArray => {
          const arr = docArray.map(doc => {
            const { option, required, order } = doc.payload.doc.data() as Option
            return {
              id: doc.payload.doc.id,
              option,
              required,
              order
            }
          })
          return arr.sort((a, b) => (a.order > b.order ? 1 : -1))
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

  navigateTo(element: Option): void {
    this.router.navigate(
      [
        `/categories/${this.categoryId}/items/${this.itemId}/options/${element.id}/extras`
      ],
      { queryParams: { option: element.option } }
    )
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
    this.ref.doc(id).update({ option, required })
  }

  updateOrder(): void {
    this.dataSource.data.forEach(({ id, order }: Option) => {
      this.ref.doc(id).update({ order })
    })
  }

  ngOnDestroy(): void {
    if (this.optionSub) {
      this.optionSub.unsubscribe()
    }
  }
}
