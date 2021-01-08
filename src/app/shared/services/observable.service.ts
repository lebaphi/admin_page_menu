import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { Category } from 'src/app/components/categories/categories.component'

@Injectable({
  providedIn: 'root'
})
export class ObservableService {
  public mainActions = new Subject<'add' | 'export'>()
  public categoryItemAdded = new Subject<Category>()

  constructor() {}

  add(): void {
    this.mainActions.next('add')
  }

  export(): void {
    this.mainActions.next('export')
  }

  addedCategory(category: Category): void {
    this.categoryItemAdded.next(category)
  }
}