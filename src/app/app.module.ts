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
import { AuthService } from './services/auth.service'
import { UIService } from './shared/ui.service'
import { AngularFireModule } from '@angular/fire'
import { AngularFirestoreModule } from '@angular/fire/firestore'
import { environment } from 'src/environments/environment'
import { AngularFireAuthModule } from '@angular/fire/auth'

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
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [AuthGuard, UnAuthGuard, AuthService, UIService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
