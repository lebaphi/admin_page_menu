import {
  Component,
  Input,
  Output,
  AfterViewInit,
  ViewChild,
  ElementRef,
  EventEmitter,
  OnInit
} from '@angular/core'
import { MatTableDataSource, MatTable } from '@angular/material/table'
import { PeriodicElement } from '../category-items/category-items.component'
import { fromEvent } from 'rxjs'
import { debounceTime, map } from 'rxjs/operators'
import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { MatPaginator } from '@angular/material/paginator'

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss']
})
export class TableViewComponent implements AfterViewInit {
  @ViewChild('searchItem') searchItem: ElementRef<HTMLInputElement>
  @ViewChild('table') table: MatTable<PeriodicElement>
  @ViewChild(MatPaginator) paginator: MatPaginator
  @Input() dataSource: MatTableDataSource<PeriodicElement>
  @Input() displayedColumns: string[]
  @Output() searchTextEvent = new EventEmitter<string>()
  @Output() dropTableEvent = new EventEmitter<CdkDragDrop<PeriodicElement[]>>()
  @Output() tableEvent = new EventEmitter<MatTable<PeriodicElement>>()
  @Output() paginatorEvent = new EventEmitter<MatPaginator>()
  @Output() clickedElmEvent = new EventEmitter<ElementRef<HTMLInputElement>>()

  routerLink: string

  constructor() {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
    this.tableEvent.emit(this.table)
    this.paginatorEvent.emit(this.paginator)

    fromEvent(this.searchItem.nativeElement, 'keyup')
      .pipe(
        debounceTime(500),
        map((event: any) => event.target.value)
      )
      .subscribe(value => {
        this.searchTextEvent.emit(value)
      })
  }

  dropTable(event: CdkDragDrop<PeriodicElement[]>): void {
    this.dropTableEvent.emit(event)
  }

  navigateTo(element: ElementRef<HTMLInputElement>): void {
    this.clickedElmEvent.emit(element)
  }

  capital(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }
}
