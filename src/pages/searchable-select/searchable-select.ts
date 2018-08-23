import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { DataProvinceServiceProvider } from '../../providers/dataProvince-service';
import { Province } from '../../models/province';
import { City } from '../../models/city';

/**
 * Generated class for the SearchableSelectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'searchable-select'
})
@Component({
  selector: 'page-searchable-select',
  templateUrl: 'searchable-select.html'
})
export class SearchableSelectPage {
  listProvince: Province[] = [];
  listCity: City[] = [];
  filteredItems: any = [];
  isSearching: boolean = false;
  type: string = 'province';
  selectedProvince: Province;
  selectedCity: City;
  filterText: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataProvince: DataProvinceServiceProvider, private events: Events) {
    this.type = this.navParams.data.type;
  }

  ionViewDidLoad() {
    Promise.all([
      this.dataProvince.getCity(),
      this.dataProvince.getProvince()
    ]).then(res => {
      this.listCity = res[0];
      this.listProvince = res[1];
      this.init();
    })
  }

  filterItems() {
    this.isSearching = true;
    let items = [];
    if (this.type === 'city') {
      items = this.listCity.filter(x => x.provinsiId === this.selectedProvince.id);
    } else {
      items = this.listProvince;
    }
    this.filteredItems = [];
    setTimeout(() => {
      this.filteredItems = items.filter(res => {
        for (const key in res) {
          if (res.hasOwnProperty(key)) {
            const element = res[key];
            if (('' + element).toLowerCase().indexOf(this.filterText.trim().toLowerCase()) !== -1) return res;
          }
        }
      });
      this.isSearching = false;
    }, 50);
  }

  private init() {
    this.filterText = '';
    this.filterItems();
  }

  select(items) {
    if (this.type === 'province') {
      this.selectedProvince = items;
      this.type = 'city';
      this.init();
    } else {
      this.selectedCity = items;
      this.events.publish('province-location', { province: this.selectedProvince, city: this.selectedCity });
      this.navCtrl.pop();
    }
  }

  revertState() {
    if (this.type === 'province') {
      this.navCtrl.pop();
    } else {
      this.type = 'province';
      this.init();
    }
  }
}
