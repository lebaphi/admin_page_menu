import { Component, Input } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { ActivatedRoute } from '@angular/router'

export interface ItemExtras {
  id: string
  extra: string
  price: string
}

const dataTable: ItemExtras[] = [
  { id: '2', extra: 'Add Shrimp', price: '4.00' },
  { id: '1', extra: 'Add Beef', price: '2.00' }
]

@Component({
  selector: 'app-edit-extras',
  templateUrl: './edit-extras.component.html',
  styleUrls: ['../../styles/styles.scss', './edit-extras.component.scss']
})
export class EditExtrasComponent {
  displayedColumns: string[] = ['extra', 'price', 'action']
  columnWidth = `${100 / this.displayedColumns.length}%`
  dataSource = new MatTableDataSource(dataTable)

  categoryId: string
  itemId: string
  optionId: string

  constructor(private activatedRoute: ActivatedRoute) {
    const { id, itemId, optionId } = this.activatedRoute.snapshot.params
    this.categoryId = id
    this.itemId = itemId
    this.optionId = optionId
  }
}
