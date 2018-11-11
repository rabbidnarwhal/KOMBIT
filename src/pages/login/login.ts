import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service';
import { FormValidatorProvider } from '../../providers/form-validator';
import { LoginRequest } from '../../models/login';

@IonicPage({
  name: 'login'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public credentials: LoginRequest;
  public isPasswordShown = false;

  @ViewChild('form') form: NgForm;
  constructor(
    private navCtrl: NavController,
    private auth: AuthServiceProvider,
    private formValidator: FormValidatorProvider
  ) {
    this.credentials = new LoginRequest();
  }

  signin() {
    this.form.ngSubmit;
    if (this.form.valid) {
      this.auth.login(this.credentials);
    } else this.formValidator.getErrorMessage(this.form);
  }

  signup() {
    this.navCtrl.push('registration');
  }
}
