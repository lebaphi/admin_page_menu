import {
  Component,
  Input,
  Output,
  AfterViewInit,
  ViewChild,
  ElementRef,
  EventEmitter,
  OnDestroy
} from '@angular/core'
import { MatTableDataSource, MatTable } from '@angular/material/table'
import { Subscription } from 'rxjs'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { MatPaginator } from '@angular/material/paginator'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { ObservableService } from 'src/app/shared/services/observable.service'
import { DialogModalComponent } from 'src/app/shared/modals/dialog-modal/dialog-modal.component'

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['../../styles/styles.scss', './table-view.component.scss']
})
export class TableViewComponent implements AfterViewInit, OnDestroy {
  @ViewChild('table') table: MatTable<any>
  @ViewChild(MatPaginator) paginator: MatPaginator
  @Input() dataSource: MatTableDataSource<any>
  @Input() addedItem: any
  @Input() displayedColumns: string[]
  @Input() columnWidth: string
  @Input() lastRoute: boolean
  @Output() clickedElmEvent = new EventEmitter<ElementRef<HTMLInputElement>>()
  @Output() addNewItem = new EventEmitter<any>()
  @Output() removeItem = new EventEmitter<any>()
  @Output() updateItem = new EventEmitter<any>()
  @Output() dragDropItem = new EventEmitter<any>()

  routerLink: string
  cloneDataSource: string[]

  private dialogSub: Subscription
  private mainActionsSub: Subscription
  private categoryAddedSub: Subscription
  data: any

  constructor(public dialog: MatDialog, private observable: ObservableService) {
    this.mainActionsSub = this.observable.mainActions.subscribe(action => {
      if (action === 'add') {
        this.data = {}
        this.displayedColumns.map(item => {
          if (item !== 'action') {
            this.data[item] = ''
          }
        })
        this.data.action = 'add'
        const config: MatDialogConfig = {
          width: '50%',
          data: this.data
        }
        const dialogRef = this.dialog.open(DialogModalComponent, config)
        this.dialogSub = dialogRef.afterClosed().subscribe(result => {
          if (result) {
            delete result.action
            this.addNewItem.emit(result)
          }
        })
      }
    })

    this.categoryAddedSub = this.observable.categoryItemAdded.subscribe(
      category => {
        this.dataSource.data.push(category)
        this.renderTable()
      }
    )
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
  }

  renderTable(): void {
    this.dataSource.paginator = null
    this.table.renderRows()
    this.dataSource.paginator = this.paginator
  }

  dropTable(event: CdkDragDrop<any[]>): void {
    const prevIndex = this.dataSource.data.findIndex(
      (d: any) => d === event.item.data
    )
    moveItemInArray(this.dataSource.data, prevIndex, event.currentIndex)
    this.dataSource.data.forEach((item, index) => {
      item.order = index
    })
    this.renderTable()
    this.dragDropItem.emit()
  }

  navigateTo(element: any): void {
    this.clickedElmEvent.emit(element)
  }

  doFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  edit(element: any): void {
    this.data = {}
    this.displayedColumns.map(key => {
      if (key !== 'action') {
        this.data[key] = element[key]
        this.data.id = element.id
      }
    })

    const config: MatDialogConfig = {
      width: '50%',
      data: this.data
    }
    const dialogRef = this.dialog.open(DialogModalComponent, config)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateItem.emit(result)
      }
    })
  }

  remove(element: any): void {
    this.removeItem.emit(element)
  }

  capital(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  ngOnDestroy(): void {
    if (this.mainActionsSub) {
      this.mainActionsSub.unsubscribe()
    }
    if (this.categoryAddedSub) {
      this.categoryAddedSub.unsubscribe()
    }
    if (this.dialogSub) {
      this.dialogSub.unsubscribe()
    }
  }
}
