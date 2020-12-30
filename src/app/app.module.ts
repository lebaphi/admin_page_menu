import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { UnAuthGuard } from './services/unAuth-guard.service'
import { AuthGuard } from './services/auth-guard.service'
import { CommonModule } from '@angular/common'
import { RouterModule, Routes } from '@angular/router'
import { HttpClientModule } from '@angular/common/http'
import { MaterialModule } from './material.module'
import { SidenavListComponent } from './components/nav/sidenav-list/sidenav-list.component'
import { HeaderComponent } from './components/nav/header/header.component'
import { FlexLayoutModule } from '@angular/flex-layout'
import { CookieService } from 'ngx-cookie-service'

const appRoutes: Routes = []

@NgModule({
  declarations: [AppComponent, SidenavListComponent, HeaderComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' }),
    MaterialModule,
    BrowserAnimationsModule,
    FlexLayoutModule
  ],
  providers: [AuthGuard, UnAuthGuard, CookieService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
