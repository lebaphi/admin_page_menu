import { Component } from '@angular/core'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { MatTable, MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { Router } from '@angular/router'

export interface PeriodicElement {
  id: string
  category: string
}

const ELEMENT_DATA: PeriodicElement[] = [
  { id: '2', category: 'Appetizers' },
  { id: '1', category: 'Beverages' },
  { id: '3', category: 'Bento' },
  { id: '4', category: 'Bento 1' },
  { id: '5', category: 'Bento 2' },
  { id: '6', category: 'Bento 3' }
]

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['../../styles/styles.scss', './categories.component.scss']
})
export class CategoriesComponent {
  table: MatTable<PeriodicElement>
  displayedColumns: string[] = ['category', 'action']
  columnWidth = `${100 / this.displayedColumns.length}%`
  dataSource = new MatTableDataSource(ELEMENT_DATA)
  paginator: MatPaginator

  constructor(private router: Router) {}

  navigateTo(element: PeriodicElement): void {
    this.router.navigate([`/category/${element.id}`])
  }
}
