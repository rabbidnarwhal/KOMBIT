import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { ApiServiceProvider } from '../../providers/api-service';
import { FormValidatorProvider } from '../../providers/form-validator';
import { UtilityServiceProvider } from '../../providers/utility-service';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage {
  @ViewChild('formForgotPassword') form: NgForm;
  email: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private api: ApiServiceProvider,
    private formValidator: FormValidatorProvider,
    private utility: UtilityServiceProvider
  ) {}

  resetPassword() {
    if (this.form.valid) {
      const loading = this.utility.showLoading();
      loading.present();
      this.api.post('/forgot-password', { Email: this.email }).subscribe(
        (sub) => {
          loading.dismiss();
          this.utility
            .confirmAlert('Please check your email, new password has been sent', '', 'Ok', '')
            .then(() => this.navCtrl.pop())
            .catch(() => this.navCtrl.pop());
        },
        (err) => {
          loading.dismiss();
          this.utility.showToast(err);
        }
      );
    } else this.utility.showToast(this.formValidator.getErrorMessage(this.form));
  }
}
