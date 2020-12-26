import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { AuthService } from 'src/app/services/auth.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter<void>()

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  toggleSidenav(): void {
    this.sidenavToggle.emit()
  }

  logout(): void {
    this.authService.logout()
  }
}
