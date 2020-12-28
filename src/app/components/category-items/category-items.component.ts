import { Component } from '@angular/core'
import { MatTable, MatTableDataSource } from '@angular/material/table'
import { ActivatedRoute, Router } from '@angular/router'
import { MatPaginator } from '@angular/material/paginator'

export interface CategoryItem {
  id: string
  category: string
  item: string
  description: string
  price: string
}

const dataTable: CategoryItem[] = [
  {
    id: '1',
    category: 'Appetizers',
    item: 'Agedashi Tofu',
    description: 'Deep fried tofu with green onion fish flakes.',
    price: '6.95'
  },
  {
    id: '2',
    category: 'Appetizers',
    item: 'Salmon Kama',
    description: 'Grilled salmon cheek.',
    price: '6.95'
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
  dataSource = new MatTableDataSource(dataTable)

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    this.categoryId = this.activatedRoute.snapshot.params.id
  }

  navigateTo(element: CategoryItem): void {
    this.router.navigate([
      `/categories/${this.categoryId}/items/${element.id}/options`
    ])
  }
}
