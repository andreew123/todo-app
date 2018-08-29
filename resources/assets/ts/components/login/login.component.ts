import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  private loginForm: FormGroup;
  private formErrors: object = {};
  visible = false;

  constructor(private modalService: ModalService,
              private formBuilder: FormBuilder,
              private authService: AuthService) {
    
    this.loginForm = formBuilder.group({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)])
    });
  }
  
  ngOnInit() {
    this.modalService.openLogin.subscribe(() => {
      this.visible = true;
      this.loginForm.reset();
    });
  }

  openModal(modalName: string) {
    if (modalName === 'signup') {
      this.visible = false;
      this.modalService.openSignup.emit({ modalName: modalName });
    }
  }
  
  private onSubmit(event: Event) {
    event.preventDefault();
    
    this.authService.login(this.loginForm.value)
      .pipe(first())
      .subscribe(data => {
        this.visible = false;
      },
      error => {
        console.log('sikertelen bejelentkezés');
      });
  }
  
}
