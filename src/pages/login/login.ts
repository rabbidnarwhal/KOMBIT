import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service';
import { FormValidatorProvider } from '../../providers/form-validator';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'login'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public credentials: any = { User: '', Password: '' };
  public isPasswordShown = false;

  @ViewChild('form') form: NgForm;
  constructor(private navCtrl: NavController, private auth: AuthServiceProvider, private formValidator: FormValidatorProvider) {}

  signin() {
    if (this.form.valid) {
      this.auth.login(this.credentials);
    } else this.formValidator.getErrorMessage(this.form);
  }

  signup() {
    this.navCtrl.push('registration');
  }
}
