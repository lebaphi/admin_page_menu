import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { FlexLayoutModule } from '@angular/flex-layout'

import { MaterialModule } from '../../material.module'
import { PrivateRoutingModule } from './private-routing.module'
import { CategoriesComponent } from '../../components/categories/categories.component'
import { TableViewComponent } from '../../components/table-view/table-view.component'
import { EditExtrasComponent } from '../../components/edit-extras/edit-extras.component'
import { OptionsComponent } from '../../components/options/options.component'
import { CategoryItemsComponent } from '../../components/category-items/category-items.component'
import { DialogModalComponent } from '../../shared/modals/dialog-modal/dialog-modal.component'
import { ConfirmDialogComponent } from '../../shared/modals/confirm-modal/confirm.modal'
import { MenuDialogComponent } from '../../shared/modals/new-menu-modal/new-menu.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrivateRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    DragDropModule
  ],
  entryComponents: [
    DialogModalComponent,
    ConfirmDialogComponent,
    MenuDialogComponent
  ],
  exports: [],
  declarations: [
    CategoriesComponent,
    TableViewComponent,
    EditExtrasComponent,
    OptionsComponent,
    CategoryItemsComponent,
    DialogModalComponent,
    ConfirmDialogComponent,
    MenuDialogComponent
  ],
  providers: []
})
export class PrivateModule {}
