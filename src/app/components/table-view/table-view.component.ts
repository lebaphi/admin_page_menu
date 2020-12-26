import {
  Component,
  Input,
  Output,
  AfterViewInit,
  ViewChild,
  ElementRef,
  EventEmitter
} from '@angular/core'
import { MatTableDataSource, MatTable } from '@angular/material/table'
import { PeriodicElement } from '../category-items/category-items.component'
import { fromEvent } from 'rxjs'
import { debounceTime, map } from 'rxjs/operators'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { MatPaginator } from '@angular/material/paginator'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['../../styles/styles.scss', './table-view.component.scss']
})
export class TableViewComponent implements AfterViewInit {
  @ViewChild('searchItem') searchItem: ElementRef<HTMLInputElement>
  @ViewChild('table') table: MatTable<PeriodicElement>
  @ViewChild(MatPaginator) paginator: MatPaginator
  @Input() dataSource: MatTableDataSource<PeriodicElement>
  @Input() displayedColumns: string[]
  @Input() columnWidth: string
  @Output() clickedElmEvent = new EventEmitter<ElementRef<HTMLInputElement>>()

  routerLink: string
  cloneDataSource: MatTableDataSource<PeriodicElement>

  constructor(private snackBar: MatSnackBar) {}

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
              val => val.toLowerCase().indexOf(value.toLowerCase()) !== -1
            ).length > 0
        )
        this.dataSource = new MatTableDataSource(data)
        this.table.renderRows()
        this.dataSource.paginator = this.paginator
      })
  }

  dropTable(event: CdkDragDrop<PeriodicElement[]>): void {
    this.dataSource.paginator = null
    const prevIndex = this.dataSource.data.findIndex(
      (d: PeriodicElement) => d === event.item.data
    )

    moveItemInArray(this.dataSource.data, prevIndex, event.currentIndex)
    this.table.renderRows()
    this.dataSource.paginator = this.paginator
  }

  navigateTo(element: ElementRef<HTMLInputElement>): void {
    this.clickedElmEvent.emit(element)
  }

  edit(element: PeriodicElement): void {
    this.snackBar.open(`Edit ${element.id}`, 'Dismiss', {
      duration: 2000
    })
  }

  remove(element: PeriodicElement): void {
    this.snackBar.open(`Delete ${element.id}`, 'Dismiss', {
      duration: 2000
    })
  }

  capital(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }
}
