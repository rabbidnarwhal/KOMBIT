import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CompanyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'company'
})
@Component({
  selector: 'page-company',
  templateUrl: 'company.html'
})
export class CompanyPage {
  public companies: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.companies = [
      { ImageUrl: 'assets/imgs/company1.jpg' },
      { ImageUrl: 'assets/imgs/company2.jpg' },
      { ImageUrl: 'assets/imgs/company3.jpg' },
      { ImageUrl: 'assets/imgs/company4.jpg' },
      { ImageUrl: 'assets/imgs/company5.jpg' },
      { ImageUrl: 'assets/imgs/company6.jpg' },
      { ImageUrl: 'assets/imgs/company7.jpg' },
      { ImageUrl: 'assets/imgs/company8.jpg' },
      { ImageUrl: 'assets/imgs/company9.jpg' },
      { ImageUrl: 'assets/imgs/company10.jpg' },
      { ImageUrl: 'assets/imgs/company11.jpg' },
      { ImageUrl: 'assets/imgs/company12.jpg' },
      { ImageUrl: 'assets/imgs/company13.jpg' }
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CompanyPage');
  }
}
