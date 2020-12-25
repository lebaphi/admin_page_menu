import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { CategoriesComponent } from './components/categories/categories.component'
import { CategoryItemsComponent } from './components/category-items/category-items.component'
import { EditExtrasComponent } from './components/edit-extras/edit-extras.component'

const routes: Routes = [
  {
    path: '',
    component: CategoriesComponent
  },
  {
    path: 'category/:id',
    component: CategoryItemsComponent
  },
  {
    path: 'category/:id/item/:itemId',
    component: EditExtrasComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
