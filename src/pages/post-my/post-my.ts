import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilityServiceProvider } from '../../providers/utility-service';

/**
 * Generated class for the PostMyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'myPost'
})
@Component({
  selector: 'page-post-my',
  templateUrl: 'post-my.html'
})
export class PostMyPage {
  constructor(public navCtrl: NavController, private utility: UtilityServiceProvider) {}

  showDetail() {
    this.utility.showPopover('detailPost').present();
  }
}
