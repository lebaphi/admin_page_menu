import { Component, OnInit, Input } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { MatTableDataSource } from '@angular/material/table'

export interface Option {
  id: string
  option: string
  required: string
}

const dataTable: Option[] = [
  { id: '1', option: 'Meat', required: '1' },
  { id: '2', option: 'Size', required: '1' }
]

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['../../styles/styles.scss', './options.component.scss']
})
export class OptionsComponent implements OnInit {
  displayedColumns: string[] = ['option', 'required', 'action']
  columnWidth = `${100 / this.displayedColumns.length}%`
  dataSource = new MatTableDataSource(dataTable)
  categoryId: string
  optionId: string

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    this.categoryId = this.activatedRoute.snapshot.params.id
    this.optionId = this.activatedRoute.snapshot.params.optionId
  }

  ngOnInit(): void {}

  navigateTo(element: any): void {
    this.router.navigate([
      `/category/${this.categoryId}/option/${this.optionId}/item/${element.id}`
    ])
  }
}
