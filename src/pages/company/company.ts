import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Company } from '../../models/company';
import { DataCompanyServiceProvider } from '../../providers/dataCompany-service';
import { UtilityServiceProvider } from '../../providers/utility-service';

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
  constructor(
    public navCtrl: NavController,
    private dataCompany: DataCompanyServiceProvider,
    private utility: UtilityServiceProvider
  ) {
    this.companies = new Array<Company>();
    this.filterItems();
  }

  ionViewDidLoad() {
    this.isSearching = true;
    this.dataCompany
      .getListCompany()
      .then((res) => {
        this.isSearching = false;
        this.companies = res;
        this.filterItems();
      })
      .catch((err) => {
        this.isSearching = false;
        this.utility.showToast(err);
      });
  }

  filterItems() {
    this.filteredItems = this.companies.filter((res) => {
      return res.companyName.toLowerCase().indexOf(this.filterText.trim().toLowerCase()) !== -1;
    });
  }

  companyClicked(company) {
    this.navCtrl.push('HomePage', { company: company });
  }
}
