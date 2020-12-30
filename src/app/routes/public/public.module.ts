import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { MaterialModule } from '../../material.module'
import { PublicRoutingModule } from './public-routing.module'
import { LoginComponent } from 'src/app/components/login/login.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PublicRoutingModule,
    MaterialModule
  ],
  exports: [],
  declarations: [LoginComponent],
  providers: []
})
export class PublicModule {}
