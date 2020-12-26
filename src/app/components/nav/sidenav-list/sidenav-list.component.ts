import { Component, OnInit, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {
  @Output() closeSidenav = new EventEmitter<void>()

  constructor() {}

  ngOnInit(): void {}

  onClose(): void {
    this.closeSidenav.emit()
  }

  onLogout(): void {}
}
