import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core'

import { MaterialModule } from './material.module'
import { FlexLayoutModule } from '@angular/flex-layout'
import { AppRoutingModule } from './app-routing.module'
import { DragDropModule } from '@angular/cdk/drag-drop'

import { AppComponent } from './app.component'
import { AuthComponent } from './components/auth/auth.component'
import { CategoriesComponent } from './components/categories/categories.component'
import { HeaderComponent } from './components/nav/header/header.component'
import { SidenavListComponent } from './components/nav/sidenav-list/sidenav-list.component'
import { CategoryItemsComponent } from './components/category-items/category-items.component'
import { AuthService } from './services/auth.service'
import { EditExtrasComponent } from './components/edit-extras/edit-extras.component'
import { TableViewComponent } from './components/table-view/table-view.component'
import { OptionsComponent } from './components/options/options.component'
import { DialogModalComponent } from './components/dialog-modal/dialog-modal.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    CategoriesComponent,
    SidenavListComponent,
    HeaderComponent,
    CategoryItemsComponent,
    EditExtrasComponent,
    TableViewComponent,
    OptionsComponent,
    DialogModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [DialogModalComponent],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {}
