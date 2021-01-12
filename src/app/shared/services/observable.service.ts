import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { Category } from '../models'

@Injectable({
  providedIn: 'root'
})
export class ObservableService {
  public mainActions = new Subject<'add'>()
  public categoryItemAdded = new Subject<Category>()

  constructor() {}

  add(): void {
    this.mainActions.next('add')
  }

  addedCategory(category: Category): void {
    this.categoryItemAdded.next(category)
  }
}
