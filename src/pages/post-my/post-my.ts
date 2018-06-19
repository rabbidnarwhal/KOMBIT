import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UtilityServiceProvider } from '../../providers/utility-service';
import { DataProductServiceProvider } from '../../providers/dataProduct-service';
import { Product } from '../../models/products';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthServiceProvider } from '../../providers/auth-service';

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
  public isSearching: boolean = false;
  public userId: number;
  constructor(
    public navCtrl: NavController,
    private utility: UtilityServiceProvider,
    private dataProduct: DataProductServiceProvider,
    private event: Events,
    private auth: AuthServiceProvider
  ) {
    this.listProducts = new Array<Product>();
    this.userId = this.auth.getPrincipal().id;
  }

  ionViewDidEnter() {
    this.isSearching = true;
    this.dataProduct
      .getListUserProducts()
      .then(res => {
        this.isSearching = false;
        this.listProducts = res;
      })
      .catch(err => {
        this.isSearching = false;
        this.utility.showToast(err);
      });
  }

  ionViewDidLoad() {
    this.event.subscribe('postInteraction', sub => {
      const idx = this.listProducts.findIndex(x => x.id === sub.id);
      if (sub.type === 'view') this.listProducts[idx].totalView++;
      if (sub.type === 'call') this.listProducts[idx].totalChat++;
      if (sub.type === 'comment') this.listProducts[idx].totalComment++;
      if (sub.type === 'like')
        if (sub.isLike) {
          this.listProducts[idx].totalLike++;
          this.listProducts[idx].isLike = true;
        } else {
          this.listProducts[idx].totalLike--;
          this.listProducts[idx].isLike = false;
        }
    });
  }

  showPost(data) {
    this.selectedProductId = this.selectedProductId === data ? 0 : data;
  }

  showDetail(data) {
    this.utility.showPopover('detailPost', { id: data.id, page: 'post' }).present();
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

  editPost(post) {
    this.navCtrl.push('newPost', { id: post.id });
  }
}
