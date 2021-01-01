import { Component } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { Router } from '@angular/router'
import { FirebaseService } from 'src/app/services/firebase.service'
import { AuthService } from 'src/app/services/auth.service'
import firebase from 'firebase/app'
import { ObservableService } from 'src/app/services/observable.service'

export interface Category {
  id: string
  category: string
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['../../styles/styles.scss', './categories.component.scss']
})
export class CategoriesComponent {
  displayedColumns: string[] = ['category', 'action']
  columnWidth = `${100 / this.displayedColumns.length}%`
  dataSource: MatTableDataSource<any>
  ref: firebase.database.Reference

  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private observableService: ObservableService
  ) {
    this.ref = this.firebaseService.getCategoryRef(this.authService.user.uid)
    this.ref.once('value', snapshot => {
      const data = []
      for (const key of Object.keys(snapshot.val())) {
        data.push({
          id: snapshot.val()[key].id,
          category: snapshot.val()[key].category
        })
      }
      this.dataSource = new MatTableDataSource(data)
    })

    this.ref.on('child_added', newItem => {
      this.observableService.addedCategory(newItem.val())
    })
  }

  navigateTo(element: Category): void {
    this.router.navigate([`/categories/${element.id}/items`])
  }

  addNewItem(data: Category): void {
    this.ref.push({ ...data })
  }
}
