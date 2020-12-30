import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { AuthService } from 'src/app/services/auth.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter<void>()
  menus: string[]

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.menus = ['long menu 1', 'long long menu 2']
  }

  toggleSidenav(): void {
    this.sidenavToggle.emit()
  }

  newMenu(): void {}

  selectMenu(menu: string): void {
    console.log(menu)
  }

  logout(): void {
    this.authService.logout()
  }
}
