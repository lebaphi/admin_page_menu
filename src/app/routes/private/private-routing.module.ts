import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { CategoriesComponent } from 'src/app/components/categories/categories.component'
import { CategoryItemsComponent } from 'src/app/components/category-items/category-items.component'
import { OptionsComponent } from 'src/app/components/options/options.component'
import { EditExtrasComponent } from 'src/app/components/edit-extras/edit-extras.component'

const routes: Routes = [
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
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule {}
