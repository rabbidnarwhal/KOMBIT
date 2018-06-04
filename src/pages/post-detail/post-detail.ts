import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ProductDetail } from '../../models/products';
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
  public data: ProductDetail;
  public lockBtn: boolean = false;
  public isSearching: boolean = true;
  public selectedPage: string = 'detail';
  public parentPage: string = '';
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private utility: UtilityServiceProvider,
    private dataProduct: DataProductServiceProvider,
    private event: Events
  ) {
    this.data = new ProductDetail();
    this.parentPage = this.navParams.get('params').page;
  }

  ionViewDidLoad() {
    this.dataProduct
      .getProductDetail(this.navParams.get('params').id)
      .then((res: ProductDetail) => {
        this.data = res;
        this.isSearching = false;
        return this.dataProduct.addViewProduct(this.data.id);
      })
      .then(() => {
        if (this.parentPage === 'home') this.event.publish('homeInteraction', { id: this.navParams.get('params').id, type: 'view' });
        else this.event.publish('postInteraction', { id: this.navParams.get('params').id, type: 'view' });
      })
      .catch(err => this.utility.showToast(err));
  }

  close() {
    this.navCtrl.pop();
  }

  back() {
    this.selectedPage = 'detail';
  }

  changePage(page) {
    this.selectedPage = page;
  }
}
