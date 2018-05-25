import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RegistrationRequest } from '../../models/registration';
import { NgForm } from '@angular/forms';
import { ApiServiceProvider } from '../../providers/api-service';
import { FormValidatorProvider } from '../../providers/form-validator';
import { UtilityServiceProvider } from '../../providers/utility-service';

/**
 * Generated class for the RegistrationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'registration'
})
@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html'
})
export class RegistrationPage {
  @ViewChild('formRegistration') form: NgForm;
  public registration: RegistrationRequest;
  public listIDType: any = [];
  public listCompany: any = [];
  constructor(
    private navCtrl: NavController,
    private api: ApiServiceProvider,
    private formValidator: FormValidatorProvider,
    private utility: UtilityServiceProvider
  ) {
    this.registration = new RegistrationRequest();
  }

  ionViewDidLoad() {
    this.loadListCompany();
    this.loadListIDType();
  }

  register() {
    if (this.form.valid) {
      const loading = this.utility.showLoading();
      loading.present();
      this.api.post('/users/register', this.registration).subscribe(sub => {
        loading.dismiss();
        this.utility.basicAlert('Register Success');
        this.navCtrl.pop();
      });
    } else this.formValidator.getErrorMessage(this.form);
  }

  loadListCompany() {
    this.api.get('/company').subscribe(sub => (this.listCompany = sub), err => this.utility.showToast(err));
  }

  private loadListIDType() {
    this.api.get('/idtype').subscribe(sub => (this.listIDType = sub), err => this.utility.showToast(err));
  }
}
