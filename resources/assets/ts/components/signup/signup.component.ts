import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {

  private signupForm: FormGroup;
  private formErrors: object = {};
  visible = false;

  constructor(private modalService: ModalService,
              private formBuilder: FormBuilder,
              private authService: AuthService) {
    
    this.signupForm = formBuilder.group({
      first_name: new FormControl(null, [Validators.required]),
      last_name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      password_confirmation: new FormControl(null, [Validators.required, Validators.minLength(8)])
    });
  }
  
  ngOnInit() {
    this.modalService.openSignup.subscribe(() => {
      this.visible = true;
      this.signupForm.reset();
    });
  }

  openModal(modalName: string) {
    if (modalName === 'login') {
      this.visible = false;
      this.modalService.openLogin.emit({ modalName: modalName });
    }
  }
  
  private onSubmit(event: Event) {
    event.preventDefault();
    
    this.authService.signup(this.signupForm.value)
      .pipe(first())
      .subscribe(data => {
        this.visible = false;
      },
      error => {
        console.log('sikertelen regisztráció');
      });
  }
  
}
