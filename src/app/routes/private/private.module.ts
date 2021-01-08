import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { MaterialModule } from '../../material.module'
import { PrivateRoutingModule } from './private-routing.module'
import { CategoriesComponent } from 'src/app/components/categories/categories.component'
import { TableViewComponent } from 'src/app/components/table-view/table-view.component'
import { EditExtrasComponent } from 'src/app/components/edit-extras/edit-extras.component'
import { OptionsComponent } from 'src/app/components/options/options.component'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { FlexLayoutModule } from '@angular/flex-layout'
import { CategoryItemsComponent } from 'src/app/components/category-items/category-items.component'
import { DialogModalComponent } from 'src/app/shared/modals/dialog-modal/dialog-modal.component'
import { ConfirmDialogComponent } from 'src/app/shared/modals/confirm-modal/confirm.modal'
import { MenuDialogComponent } from 'src/app/shared/modals/new-menu-modal/new-menu.component'

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
