import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content, Platform } from 'ionic-angular';
import { DataProvinceServiceProvider } from '../../providers/dataProvince-service';
import { City } from '../../models/city';
import { Province } from '../../models/province';

/**
 * Generated class for the HomeLocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'home-location'
})
@Component({
  selector: 'page-home-location',
  templateUrl: 'home-location.html'
})
export class HomeLocationPage {
  listProvince: Province[];
  listCity: City[];
  filteredItems: any = [];
  isSearching: boolean = false;
  type: string = 'province';
  selectedProvince: Province;
  selectedCity: City;
  locationType: string = 'nearMe';
  distance: number = 1;
  unregisterBackButtonAction: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private events: Events,
    private dataProvince: DataProvinceServiceProvider,
    private platform: Platform
  ) {
    this.listCity = this.dataProvince.getCity();
    this.listProvince = this.dataProvince.getProvince();
  }

  filterItems() {
    this.isSearching = true;
    if (this.type === 'city') {
      this.filteredItems = [];
      setTimeout(() => {
        this.filteredItems = this.listCity.filter(x => x.provinsiId === this.selectedProvince.id);
      }, 50);
    } else {
      this.filteredItems = this.listProvince;
    }
    this.isSearching = false;
  }

  segmentChanged() {
    if (this.locationType === 'setLocation') {
      this.type = 'province';
      this.selectedCity = null;
      this.selectedProvince = null;
      this.filterItems();
    } else {
      this.distance = 1;
    }
  }

  select(items) {
    if (this.type === 'province') {
      this.registerBackButtonHandler();
      this.selectedProvince = items;
      this.type = 'city';
      this.filterItems();
    } else {
      this.unregisterBackButtonHandler();
      this.selectedCity = items ? items : { id: 0 };
      this.events.publish('homeLocation', { province: this.selectedProvince, city: this.selectedCity });
      this.navCtrl.pop();
    }
  }

  private registerBackButtonHandler() {
    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(event => {
      this.backButtonHandler();
    }, 1011);
  }

  private unregisterBackButtonHandler() {
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();
  }

  revertState() {
    if (this.locationType === 'setLocation' && this.type === 'city') {
      this.backButtonHandler;
    } else {
      this.navCtrl.pop();
    }
  }

  private backButtonHandler() {
    this.type = 'province';
    this.selectedCity = null;
    this.selectedProvince = null;
    this.filterItems();
  }

  setDistance() {
    this.events.publish('homeLocation', { nearme: true, distance: this.distance });
    this.navCtrl.pop();
  }
}
