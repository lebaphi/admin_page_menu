import { Component, Input } from '@angular/core'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { MatTable, MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { ActivatedRoute } from '@angular/router'

export interface PeriodicElement {
  id: string
  extra: string
  price: string
}

const ELEMENT_DATA: PeriodicElement[] = [
  { id: '2', extra: 'Add Shrimp', price: '4.00' },
  { id: '1', extra: 'Add Beef', price: '2.00' }
]

@Component({
  selector: 'app-edit-extras',
  templateUrl: './edit-extras.component.html',
  styleUrls: ['../../styles/styles.scss', './edit-extras.component.scss']
})
export class EditExtrasComponent {
  @Input() categoryId: string
  @Input() itemId: string
  table: MatTable<PeriodicElement>
  displayedColumns: string[] = ['extra', 'price', 'action']
  columnWidth = `${100 / this.displayedColumns.length}%`
  dataSource = new MatTableDataSource(ELEMENT_DATA)
  paginator: MatPaginator

  constructor(private activatedRoute: ActivatedRoute) {
    const { id, itemId } = this.activatedRoute.snapshot.params
    this.categoryId = id
    this.itemId = itemId
    console.log(id, itemId)
  }
}
