import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilityServiceProvider } from '../../providers/utility-service';
import { DataProductServiceProvider } from '../../providers/dataProduct-service';
import { Product } from '../../models/products';
import { trigger, transition, style, animate } from '@angular/animations';

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
  animations: [
    trigger('postAnimation', [
      transition(':enter', [style({ opacity: 0 }), animate('500ms', style({ opacity: 1 }))]),
      transition(':leave', [style({ opacity: 1 }), animate('500ms', style({ opacity: 0 }))])
    ])
  ],
  templateUrl: 'post-my.html'
})
export class PostMyPage {
  public listProducts: Array<Product>;
  public selectedProductId: number = 0;
  public lockBtn: boolean = false;
  constructor(public navCtrl: NavController, private utility: UtilityServiceProvider, private dataProduct: DataProductServiceProvider) {
    this.listProducts = new Array<Product>();
    this.listProducts = this.dataProduct.getUserProducts();
  }

  ionViewDidEnter() {
    this.dataProduct
      .getListUserProducts()
      .then(() => (this.listProducts = this.dataProduct.getUserProducts()))
      .catch(err => this.utility.showToast(err));
  }

  showPost(data) {
    this.selectedProductId = this.selectedProductId === data ? 0 : data;
  }

  showDetail(data) {
    this.utility.showPopover('detailPost', { id: data.id }).present();
  }

  likeBtnClick(post) {
    post.isLike = !post.isLike;
    this.lockBtn = true;
    this.dataProduct.modifyLikeProduct(post.id, post.isLike).then(
      () => {
        this.lockBtn = false;
        post.totalLike = post.isLike ? post.totalLike + 1 : post.totalLike - 1;
        this.utility.showToast(post.isLike ? 'Product Liked' : 'Product Unliked', 1000);
      },
      err => {
        this.lockBtn = false;
        this.utility.showToast(err);
      }
    );
  }
}
