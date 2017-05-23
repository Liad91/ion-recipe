import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IonicPage, NavController } from 'ionic-angular';

import { AuthService } from './../../providers/auth';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class Home implements OnInit {
  mode = 'signin';
  form: FormGroup;

  constructor(private navCtrl: NavController, private authService: AuthService) {}

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.form = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, Validators.required)
    });
    if (this.mode === 'signup') {
      this.form.addControl('firstName', new FormControl(null, Validators.required));
      this.form.addControl('lastName', new FormControl(null, Validators.required));
      this.form.controls.password.setValidators([Validators.required, Validators.minLength(6)]);
    }
  }

  onSwitchMode() {
    this.mode = this.mode === 'signin' ? 'signup' : 'signin';
    this.initializeForm();
  }

  onSubmit() {
    if (this.mode === 'signin') {
      this.authService.signin(this.form.value);
    }
    else {
      this.authService.signup(this.form.value);
    }
  }
}
