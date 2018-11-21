import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Category } from '../../models/category';
import { DataCategoryServiceProvider } from '../../providers/dataCategory-service';
import { UtilityServiceProvider } from '../../providers/utility-service';

@IonicPage()
@Component({
  selector: 'page-solution',
  templateUrl: 'solution.html'
})
export class SolutionPage {
  public isModal = false;
  public listSolution: Array<Category>;
  public filteredItems: Array<Category>;
  public filterText: string = '';
  public isSearching: boolean = true;
  constructor(
    public navParams: NavParams,
    public navCtrl: NavController,
    private dataCategory: DataCategoryServiceProvider,
    private utility: UtilityServiceProvider
  ) {
    this.listSolution = new Array<Category>();
    this.filterItems();

    if (this.navParams.data.params && this.navParams.data.params.hasOwnProperty('isModal')) {
      this.isModal = this.navParams.data.params.isModal;
    }
  }
  ionViewDidEnter() {
    if (this.listSolution.length) this.isSearching = false;
    this.dataCategory
      .getListCategory()
      .then((sub) => {
        this.listSolution = sub;
        this.filterItems();
        this.isSearching = false;
      })
      .catch((err) => this.utility.showToast(err));
  }

  filterItems() {
    this.filteredItems = this.listSolution.filter((res) => {
      return res.category.toLowerCase().indexOf(this.filterText.trim().toLowerCase()) !== -1;
    });
  }

  solutionClicked(solution) {
    this.navCtrl.push('home', { solution: solution });
  }

  dismissModal() {
    this.navCtrl.pop();
  }
}
