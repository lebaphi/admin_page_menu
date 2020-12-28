import { Component } from '@angular/core'
import { MatTable, MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { Router } from '@angular/router'

export interface Category {
  id: string
  category: string
}

const dataTable: Category[] = [
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
  displayedColumns: string[] = ['category', 'action']
  columnWidth = `${100 / this.displayedColumns.length}%`
  dataSource = new MatTableDataSource(dataTable)

  constructor(private router: Router) {}

  navigateTo(element: Category): void {
    this.router.navigate([`/category/${element.id}`])
  }
}
