import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ObservableService {
  public subject = new Subject<'add' | 'export'>()

  constructor() {}

  addItem(): void {
    this.subject.next('add')
  }

  export(): void {
    this.subject.next('export')
  }
}
