import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PostDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'detailPost'
})
@Component({
  selector: 'page-post-detail',
  templateUrl: 'post-detail.html'
})
export class PostDetailPage {
  public data: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.data = {
      Product: 'Test Product',
      Company: 'Test Company',
      Solution: 'Test Solution',
      Content:
        'A mobile application service that enables cutomer to order product/service up to the online payment process. This solution is fit for any business flow and wide range of industrial background.\n' +
        '\nOMS application support end user needs to:\n' +
        'Find Order Info\n' +
        'Do Order Taking\n' +
        'Do Online Payment\n' +
        '\nOMS application also facilitate corporate needs to:\n' +
        'Automatic Order to Store Dispatching\n' +
        'Managed by Client\n' +
        'Click to Dial Client Delivery\n' +
        'Find Near Me Store\n',
      ImageUrl: 'https://vignette.wikia.nocookie.net/dragonage/images/8/80/Concept-HighDragon.jpg',
      VideoUrl: 'http://static.videogular.com/assets/videos/videogular.mp4'
    };
  }

  close() {
    this.navCtrl.pop();
  }
}
