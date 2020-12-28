import { Component, OnInit } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Subject } from 'rxjs'
import { ObservableService } from './services/observable.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'menu-creator'
  subject = new Subject<'add' | 'export'>()

  constructor(private observable: ObservableService) {}

  ngOnInit(): void {}

  addItem(): void {
    // this.snackBar.open('Add item', 'Dismiss', {
    //   duration: 2000
    // })
    this.observable.addItem()
  }

  export(): void {
    // this.snackBar.open('Export item', 'Dismiss', {
    //   duration: 2000
    // })
    this.observable.export()
  }
}
