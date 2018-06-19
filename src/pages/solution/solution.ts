import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Category } from '../../models/category';
import { DataCategoryServiceProvider } from '../../providers/dataCategory-service';
import { UtilityServiceProvider } from '../../providers/utility-service';

/**
 * Generated class for the SolutionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'solution'
})
@Component({
  selector: 'page-solution',
  templateUrl: 'solution.html'
})
export class SolutionPage {
  public listSolution: Array<Category>;
  public filteredItems: Array<Category>;
  public filterText: string = '';
  public isSearching: boolean = true;
  constructor(public navCtrl: NavController, private dataCategory: DataCategoryServiceProvider, private utility: UtilityServiceProvider) {
    this.listSolution = new Array<Category>();
    this.filterItems();
  }
  ionViewDidEnter() {
    if (this.listSolution.length) this.isSearching = false;
    this.dataCategory
      .getListCategory()
      .then(sub => {
        this.listSolution = sub;
        this.filterItems();
        this.isSearching = false;
      })
      .catch(err => this.utility.showToast(err));
  }

  filterItems() {
    this.filteredItems = this.listSolution.filter(res => {
      return res.category.toLowerCase().indexOf(this.filterText.trim().toLowerCase()) !== -1;
    });
  }

  solutionClicked(solution) {
    console.log(solution);
    this.navCtrl.push('home', { solution: solution });
  }
}
