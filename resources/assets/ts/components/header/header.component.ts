import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

import { LoginComponent } from '../login/login.component';

import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  providers: [ModalService]
})
export class HeaderComponent implements OnInit {

  private isLoggedIn: boolean;

  @ViewChild(LoginComponent) loginComponent: LoginComponent;

  constructor(private authService: AuthService,
              private modalService: ModalService) {
    this.isLoggedIn = this.authService.isLoggedIn();

    if (!this.isLoggedIn) {
      this.openModal('login');
    }
  }

  ngOnInit() {
    this.authService.authStatus.subscribe((status: boolean) => {
      this.isLoggedIn = true;
    });
  }

  openModal(modalName: string) {
    this.modalService.openLogin.emit({ modalName: modalName });
  }

  logout() {
    this.authService.logout()
      .pipe(first())
      .subscribe(data => {
        this.isLoggedIn = false;
      },
      error => {
        console.log('sikertelen kijelentkezés');
      });
  }
}
