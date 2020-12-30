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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { CategoryItemsComponent } from 'src/app/components/category-items/category-items.component'
import { SidenavListComponent } from 'src/app/components/nav/sidenav-list/sidenav-list.component'
import { HeaderComponent } from 'src/app/components/nav/header/header.component'
import { DialogModalComponent } from 'src/app/components/dialog-modal/dialog-modal.component'

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
  entryComponents: [DialogModalComponent],
  exports: [],
  declarations: [
    CategoriesComponent,
    TableViewComponent,
    EditExtrasComponent,
    OptionsComponent,
    CategoryItemsComponent,
    DialogModalComponent
  ],
  providers: []
})
export class PrivateModule {}
