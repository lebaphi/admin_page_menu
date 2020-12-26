import { Component } from '@angular/core'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { MatTable, MatTableDataSource } from '@angular/material/table'
import { ActivatedRoute, Router } from '@angular/router'
import { MatPaginator } from '@angular/material/paginator'

export interface PeriodicElement {
  id: string
  category: string
  item: string
  description: string
  price: string
  action: string
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    id: '1',
    category: 'Appetizers',
    item: 'Agedashi Tofu',
    description: 'Deep fried tofu with green onion fish flakes.',
    price: '6.95',
    action: 'Edit extras'
  },
  {
    id: '2',
    category: 'Appetizers',
    item: 'Salmon Kama',
    description: 'Grilled salmon cheek.',
    price: '6.95',
    action: 'Edit extras'
  }
]

@Component({
  selector: 'app-category-items',
  templateUrl: './category-items.component.html',
  styleUrls: ['../../styles/styles.scss', './category-items.component.scss']
})
export class CategoryItemsComponent {
  displayedColumns: string[] = ['item', 'description', 'price', 'action']
  columnWidth = `${100 / this.displayedColumns.length}%`
  categoryId: string
  table: MatTable<PeriodicElement>
  dataSource = new MatTableDataSource(ELEMENT_DATA)
  paginator: MatPaginator

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    this.categoryId = this.activatedRoute.snapshot.params.id
  }

  navigateTo(element: PeriodicElement): void {
    this.router.navigate([`/category/${this.categoryId}/item/${element.id}`])
  }
}
