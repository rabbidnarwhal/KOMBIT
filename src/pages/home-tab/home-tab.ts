import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service';
import { Config } from '../../config/config';

@IonicPage()
@Component({
  selector: 'page-home-tab',
  templateUrl: 'home-tab.html'
})
export class HomeTabPage {
  tabContent = [];
  isLoading = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthServiceProvider) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeTabPage');
  }

  checkRole() {
    if (this.authService.getPrincipal().role === 'Customer') {
      this.tabContent = Config.CUSTOMER.TABMENU;
      this.isLoading = false;
    }
  }
}
