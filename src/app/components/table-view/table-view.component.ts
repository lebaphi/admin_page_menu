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
import { fromEvent, Subscription } from 'rxjs'
import { debounceTime, map } from 'rxjs/operators'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { MatPaginator } from '@angular/material/paginator'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { DialogModalComponent } from '../dialog-modal/dialog-modal.component'
import { ObservableService } from 'src/app/services/observable.service'

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['../../styles/styles.scss', './table-view.component.scss']
})
export class TableViewComponent implements AfterViewInit, OnDestroy {
  @ViewChild('searchItem') searchItem: ElementRef<HTMLInputElement>
  @ViewChild('table') table: MatTable<any>
  @ViewChild(MatPaginator) paginator: MatPaginator
  @Input() dataSource: MatTableDataSource<any>
  @Input() displayedColumns: string[]
  @Input() columnWidth: string
  @Output() clickedElmEvent = new EventEmitter<ElementRef<HTMLInputElement>>()
  @Input() lastRoute: boolean

  routerLink: string
  cloneDataSource: MatTableDataSource<any>
  subscription: Subscription
  data: any

  constructor(
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private observable: ObservableService
  ) {
    this.subscription = this.observable.subject.subscribe(action => {
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
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            result.id = this.dataSource.data.length + 1
            this.dataSource.data.push(result)
            this.renderTable()
            /**
             * update new data to database
             */
          }
        })
      }
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
    this.cloneDataSource = this.dataSource

    fromEvent(this.searchItem.nativeElement, 'keyup')
      .pipe(
        debounceTime(500),
        map((event: any) => event.target.value)
      )
      .subscribe(value => {
        this.dataSource.paginator = null
        const data = this.cloneDataSource.data.filter(
          item =>
            Object.values(item).filter(
              val =>
                val
                  .toString()
                  .toLowerCase()
                  .indexOf(value.toLowerCase()) !== -1
            ).length > 0
        )
        this.dataSource = new MatTableDataSource(data)
        this.table.renderRows()
        this.dataSource.paginator = this.paginator
      })
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
    this.renderTable()
  }

  navigateTo(element: any): void {
    this.clickedElmEvent.emit(element)
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
        const keys = Object.keys(result)
        const updatedData = this.dataSource.data.map(row => {
          if (result.id === row.id) {
            keys.map(key => {
              row[key] = result[key]
            })
          }
          return row
        })
        this.dataSource.data = updatedData
        this.renderTable()
        /**
         * update new data to database
         */
      }
    })
  }

  remove(element: any): void {
    const newData = this.dataSource.data.filter(item => item.id !== element.id)
    this.dataSource.data = newData
    this.renderTable()
    this.snackBar.open(`Deleted successfully`, 'Dismiss', {
      duration: 2000
    })
    /**
     * update new data to database
     */
  }

  capital(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}
