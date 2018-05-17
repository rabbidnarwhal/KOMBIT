import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { UtilityServiceProvider } from '../../providers/utility-service';

@IonicPage({
  name: 'home'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private listPost = [];
  public listPostLeft = [];
  public listPostRight = [];
  constructor(private navCtrl: NavController, private utility: UtilityServiceProvider) {
    this.listPost = [
      {
        Product: 'TestProduct1',
        Company: 'TestCompany1',
        Holding: 'TestHolding1',
        Solution: 'TestSolurion1',
        ImageUrl: '../assets/imgs/test1.jpg',
        Views: 1,
        Calls: 10,
        Comments: 4
      },
      {
        Product: 'TestProduct2',
        Company: 'TestCompany2',
        Holding: 'TestHolding2',
        Solution: 'TestSolurion2',
        ImageUrl: '../assets/imgs/test2.jpg',
        Views: 122,
        Calls: 22,
        Comments: 5
      },
      {
        Product: 'TestProduct3',
        Company: 'TestCompany3',
        Holding: 'TestHolding3',
        Solution: 'TestSolurion3',
        ImageUrl: '../assets/imgs/test3.jpg',
        Views: 300,
        Calls: 30,
        Comments: 6
      },
      {
        Product: 'TestProduct4',
        Company: 'TestCompany4',
        Holding: 'TestHolding4',
        Solution: 'TestSolurion4',
        ImageUrl: '../assets/imgs/test4.jpg',
        Views: 140,
        Calls: 4,
        Comments: 7
      },
      {
        Product: 'TestProduct5',
        Company: 'TestCompany5',
        Holding: 'TestHolding5',
        Solution: 'TestSolurion5',
        ImageUrl: '../assets/imgs/test5.jpg',
        Views: 55,
        Calls: 15,
        Comments: 8
      }
    ];
  }

  ionViewDidLoad() {
    this.listPostLeft = this.listPost.filter((e, i) => i % 2);
    this.listPostRight = this.listPost.filter((e, i) => !(i % 2));
  }

  showDetail() {
    this.utility.showPopover('detailPost').present();
  }

  createNewPost() {
    this.navCtrl.push('newPost');
  }
}
