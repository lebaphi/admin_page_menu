import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { CategoriesComponent } from './components/categories/categories.component'
import { CategoryItemsComponent } from './components/category-items/category-items.component'
import { EditExtrasComponent } from './components/edit-extras/edit-extras.component'
import { OptionsComponent } from './components/options/options.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'categories',
    pathMatch: 'full'
  },
  {
    path: 'categories',
    component: CategoriesComponent
  },
  {
    path: 'categories/:id/items',
    component: CategoryItemsComponent
  },
  {
    path: 'categories/:id/items/:itemId/options',
    component: OptionsComponent
  },
  {
    path: 'categories/:id/items/:itemId/options/:optionId/extras',
    component: EditExtrasComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
