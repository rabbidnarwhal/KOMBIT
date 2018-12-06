import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Category } from '../../models/category';
import { DataCategoryServiceProvider } from '../../providers/dataCategory-service';
import { UtilityServiceProvider } from '../../providers/utility-service';
import { Events } from 'ionic-angular/util/events';

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
    private utility: UtilityServiceProvider,
    private events: Events
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
    if (this.isModal) {
      this.events.publish('solution-selected', solution);
      this.navCtrl.pop();
    } else {
      this.navCtrl.push('HomePage', { solution: solution, modal: true });
    }
  }

  dismissModal() {
    this.navCtrl.pop();
  }

  // ionViewWillLeave() {

  // }
}
