import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { FlexLayoutModule } from '@angular/flex-layout'

import { MaterialModule } from '../../material.module'
import { PublicRoutingModule } from './public-routing.module'
import { LoginComponent } from '../../components/auth/login/login.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PublicRoutingModule,
    MaterialModule,
    FlexLayoutModule
  ],
  exports: [],
  declarations: [LoginComponent],
  providers: []
})
export class PublicModule {}
