import { Component, OnInit } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'menu-creator'

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  addItem(): void {
    this.snackBar.open('Add item', 'Dismiss', {
      duration: 2000
    })
  }

  export(): void {
    this.snackBar.open('Export item', 'Dismiss', {
      duration: 2000
    })
  }
}
