import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Product } from '../../models/products';
import { UtilityServiceProvider } from '../../providers/utility-service';
import { DataProductServiceProvider } from '../../providers/dataProduct-service';

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
  public data: Product;
  public lockBtn: boolean = false;
  public isSearching: boolean = true;
  public selectedPage: string = 'detail';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private utility: UtilityServiceProvider,
    private dataProduct: DataProductServiceProvider,
    private event: Events
  ) {
    this.data = new Product();
  }

  ionViewDidLoad() {
    this.dataProduct
      .getProductDetail(this.navParams.get('params').id)
      .then((res: Product) => {
        this.data = res;
        this.isSearching = false;
        return this.dataProduct.addViewProduct(this.data.id);
      })
      .then(() => {
        if (this.navParams.get('params').page === 'home') this.event.publish('homeViews', { id: this.navParams.get('params').id });
        else this.event.publish('loadMyPost');
      })
      .catch(err => this.utility.showToast(err));
  }

  close() {
    this.navCtrl.pop();
  }

  back() {
    this.selectedPage = 'detail';
  }

  openContact() {
    this.selectedPage = 'contact';
  }

  openComment() {
    this.selectedPage = 'comment';
  }

  openWhatsapp() {
    const phone = this.dataProduct.getProductOwnerPhone().replace(/ |-|\+/g, '');
    window.open('https://api.whatsapp.com/send?phone=' + phone);
  }

  likeBtnClick() {
    this.data.isLike = !this.data.isLike;
    this.lockBtn = true;
    this.dataProduct.modifyLikeProduct(this.data.id, this.data.isLike).then(
      () => {
        this.lockBtn = false;
        this.data.totalLike = this.data.isLike ? this.data.totalLike + 1 : this.data.totalLike - 1;
        this.utility.showToast(this.data.isLike ? 'Product Liked' : 'Product Unliked');
      },
      err => {
        this.lockBtn = false;
        this.utility.showToast(err);
      }
    );
  }
}
