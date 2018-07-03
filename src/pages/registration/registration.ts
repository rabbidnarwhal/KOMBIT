import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
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
  public listHoldingCompany: any = [];
  public isLoading: boolean = false;
  public holdingId: number;
  public city: string;

  constructor(
    private navCtrl: NavController,
    private api: ApiServiceProvider,
    private formValidator: FormValidatorProvider,
    private utility: UtilityServiceProvider,
    private events: Events
  ) {
    this.registration = new RegistrationRequest();
  }

  ionViewDidLoad() {
    this.loadListHoldingCompany();
    this.loadListIDType();

    this.events.subscribe('location', res => {
      this.registration.AddressKoordinat = res.coordinate;
    });

    this.events.subscribe('province-location', sub => {
      this.city = `${sub.city.name}, ${sub.province.name}`;
      this.registration.ProvinsiId = sub.province.id;
      this.registration.KabKotaId = sub.city.id;
    });
  }

  ionViewWillUnload() {
    this.events.unsubscribe('location');
    this.events.unsubscribe('province-location');
  }

  register() {
    if (this.form.valid) {
      const loading = this.utility.showLoading();
      loading.present();
      if (this.registration.Handphone[0] === '6') this.registration.Handphone = '+' + this.registration.Handphone;
      else this.registration.Handphone = '+62' + this.registration.Handphone.slice(1);
      this.api.post('/users/register', this.registration).subscribe(
        sub => {
          loading.dismiss();
          this.utility
            .confirmAlert('Register Success', '', 'Ok')
            .then(() => this.navCtrl.pop())
            .catch(() => this.navCtrl.pop());
        },
        err => {
          loading.dismiss();
          this.utility.showToast(err);
        }
      );
    } else this.utility.showToast(this.formValidator.getErrorMessage(this.form));
  }

  changeCompany() {
    this.loadListCompany();
  }

  openMap() {
    this.navCtrl.push('map-location', { type: 'choose', coordinate: this.registration.AddressKoordinat });
  }

  selectCity() {
    this.navCtrl.push('searchable-select', { type: 'province' });
  }

  private loadListCompany() {
    this.isLoading = true;
    this.api.get('/holding/' + this.holdingId + '/company').subscribe(
      sub => {
        this.listCompany = sub;
        this.isLoading = false;
      },
      err => {
        this.utility.showToast(err);
        this.isLoading = false;
      }
    );
  }

  private loadListHoldingCompany() {
    this.api.get('/holding').subscribe(sub => (this.listHoldingCompany = sub), err => this.utility.showToast(err));
  }

  private loadListIDType() {
    this.api.get('/idtype').subscribe(sub => (this.listIDType = sub), err => this.utility.showToast(err));
  }
}
