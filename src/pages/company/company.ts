import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Company } from '../../models/company';
import { DataCompanyServiceProvider } from '../../providers/dataCompany-service';
import { UtilityServiceProvider } from '../../providers/utility-service';

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
  public companies: Array<Company>;
  public filteredItems: Array<Company>;
  public filterText: string = '';
  public isSearching: boolean = true;
  constructor(public navCtrl: NavController, private dataCompany: DataCompanyServiceProvider, private utility: UtilityServiceProvider) {
    this.companies = new Array<Company>();
    this.companies = this.dataCompany.getCompany() || [];
    this.filterItems();
  }

  ionViewDidLoad() {
    if (this.companies.length) this.isSearching = false;
    this.dataCompany
      .getListCompany()
      .then(() => {
        this.companies = this.dataCompany.getCompany();
        this.filterItems();
        this.isSearching = false;
      })
      .catch(err => this.utility.showToast(err));
  }

  filterItems() {
    this.filteredItems = this.companies.filter(res => {
      return res.companyName.toLowerCase().indexOf(this.filterText.trim().toLowerCase()) !== -1;
    });
  }
}
