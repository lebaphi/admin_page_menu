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
import { ConfirmDialogComponent } from 'src/app/shared/confirm.modal'
import { DialogModalComponent } from 'src/app/shared/dialog-modal/dialog-modal.component'

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
  entryComponents: [DialogModalComponent, ConfirmDialogComponent],
  exports: [],
  declarations: [
    CategoriesComponent,
    TableViewComponent,
    EditExtrasComponent,
    OptionsComponent,
    CategoryItemsComponent,
    DialogModalComponent,
    ConfirmDialogComponent
  ],
  providers: []
})
export class PrivateModule {}
