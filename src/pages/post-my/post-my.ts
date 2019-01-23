import { Component } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { UtilityServiceProvider } from '../../providers/utility-service';
import { DataProductServiceProvider } from '../../providers/dataProduct-service';
import { Product } from '../../models/products';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthServiceProvider } from '../../providers/auth-service';

@IonicPage()
@Component({
  selector: 'page-post-my',
  animations: [
    trigger('postAnimation', [
      transition(':enter', [ style({ opacity: 0 }), animate('500ms', style({ opacity: 1 })) ]),
      transition(':leave', [ style({ opacity: 1 }), animate('500ms', style({ opacity: 0 })) ])
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
    this.getProducts();
  }

  getProducts() {
    this.isSearching = true;
    this.dataProduct
      .getListUserProducts()
      .then((res) => {
        this.isSearching = false;
        this.listProducts = res;
      })
      .catch((err) => {
        this.isSearching = false;
        this.utility.showToast(err);
      });
  }

  ionViewDidLoad() {
    this.event.subscribe('postInteraction', (sub) => {
      const idx = this.listProducts.findIndex((x) => x.id === sub.id);
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

  ionViewWillLeave() {
    this.event.unsubscribe('postInteraction');
  }

  showPost(data) {
    this.selectedProductId = this.selectedProductId === data ? 0 : data;
  }

  showDetail(event, data) {
    event.stopPropagation();
    this.utility.showPopover('PostDetailPage', { id: data.id, page: 'post' }).present();
  }

  likeBtnClick(event, post) {
    event.stopPropagation();
    post.isLike = !post.isLike;
    this.lockBtn = true;
    this.dataProduct.modifyLikeProduct(post.id, post.isLike).then(
      () => {
        this.lockBtn = false;
        post.totalLike = post.isLike ? post.totalLike + 1 : post.totalLike - 1;
        this.utility.showToast(post.isLike ? 'Product Liked' : 'Product Unliked', 1000);
      },
      (err) => {
        this.lockBtn = false;
        this.utility.showToast(err);
      }
    );
  }

  editPost(event, post) {
    event.stopPropagation();
    this.navCtrl.push('PostNewPage', { id: post.id });
  }

  deletePost(event, post: Product) {
    event.stopPropagation();
    this.utility
      .confirmAlert('Warning, This action is irreversible!!', 'Delete Post?')
      .then(() => {
        return this.dataProduct.deleteProduct(post.id);
      })
      .then((res) => {
        this.getProducts();
        this.utility.showToast('Post deleted!');
      })
      .catch((err) => {
        this.utility.showToast(err);
      });
  }
}
