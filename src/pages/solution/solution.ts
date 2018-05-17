import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  public listSolution: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.listSolution = [
      { Name: 'SolutionA' },
      { Name: 'SolutionB' },
      { Name: 'SolutionC' },
      { Name: 'SolutionD' },
      { Name: 'SolutionE' },
      { Name: 'SolutionF' },
      { Name: 'SolutionG' },
      { Name: 'SolutionH' },
      { Name: 'SolutionI' }
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SolutionPage');
  }
}
