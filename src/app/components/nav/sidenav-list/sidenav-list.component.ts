import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { AuthService } from 'src/app/services/auth.service'

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {
  @Output() closeSidenav = new EventEmitter<void>()
  menus: string[]

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.menus = ['long menu 1', 'long long menu 2']
  }

  onClose(): void {
    this.closeSidenav.emit()
  }

  addItem(): void {}

  selectMenu(menu: string): void {
    console.log(menu)
  }

  onLogout(): void {
    this.authService.logout()
  }
}
