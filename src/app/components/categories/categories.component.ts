import { Component, ElementRef } from '@angular/core'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { MatTable, MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { Router } from '@angular/router'

export interface PeriodicElement {
  id: string
  category: string
  action: string
}

const ELEMENT_DATA: PeriodicElement[] = [
  { id: '2', category: 'Appetizers', action: 'Edit items' },
  { id: '1', category: 'Beverages', action: 'Edit items' },
  { id: '3', category: 'Bento', action: 'Edit items' },
  { id: '4', category: 'Bento 1', action: 'Edit items' },
  { id: '5', category: 'Bento 2', action: 'Edit items' },
  { id: '6', category: 'Bento 3', action: 'Edit items' }
]

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent {
  table: MatTable<PeriodicElement>
  displayedColumns: string[] = ['category', 'action']
  dataSource = new MatTableDataSource(ELEMENT_DATA)
  paginator: MatPaginator

  constructor(private router: Router) {}

  dropTable(event: CdkDragDrop<PeriodicElement[]>): void {
    this.dataSource.paginator = null
    const prevIndex = this.dataSource.data.findIndex(
      (d: PeriodicElement) => d === event.item.data
    )
    moveItemInArray(this.dataSource.data, prevIndex, event.currentIndex)
    this.table.renderRows()
    this.dataSource.paginator = this.paginator
  }

  searchText(value: string): void {
    this.dataSource.paginator = null
    const data = ELEMENT_DATA.filter(item =>
      item.category.toLowerCase().includes(value.toLowerCase())
    )
    this.dataSource = new MatTableDataSource(data)
    this.table.renderRows()
    this.dataSource.paginator = this.paginator
  }

  setTable(table: MatTable<PeriodicElement>): void {
    this.table = table
  }

  setPaginator(paginator: MatPaginator): void {
    this.paginator = paginator
  }

  navigateTo(element: PeriodicElement): void {
    this.router.navigate([`/category/${element.id}`])
  }
}
