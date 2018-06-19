import { Component } from '@angular/core';
import { NavController, IonicPage, Events, NavParams } from 'ionic-angular';
import { UtilityServiceProvider } from '../../providers/utility-service';
import { DataProductServiceProvider } from '../../providers/dataProduct-service';
import { Product } from '../../models/products';
import { Config } from '../../config/config';
import { AuthServiceProvider } from '../../providers/auth-service';

@IonicPage({
  name: 'home'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private listPost: Array<Product>;
  public filteredItems: Array<Product>;
  public listPostLeft: Array<Product>;
  public listPostRight: Array<Product>;
  public filterText: string = '';
  public isSearching: boolean = true;
  public lockBtn: boolean = false;
  public selectedLikePost: any;
  public solutionType: string;
  public currency: string;
  public userId: number;
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private utility: UtilityServiceProvider,
    private dataProduct: DataProductServiceProvider,
    private event: Events,
    private auth: AuthServiceProvider
  ) {
    this.currency = Config.CURRENCY;
    this.listPost = new Array<Product>();
    this.solutionType = 'public';
    this.filterItems();
    this.userId = auth.getPrincipal().id;
  }

  ionViewWillEnter() {
    if (!this.listPost.length) this.isSearching = true;
    this.solutionType = 'public';
    this.dataProduct
      .getListAllProducts()
      .then(res => {
        this.isSearching = false;
        if (this.navParams.data.solution) this.listPost = res.filter(x => x.categoryName === this.navParams.data.solution.category);
        else if (this.navParams.data.company) this.listPost = res.filter(x => x.companyName === this.navParams.data.company.companyName);
        else this.listPost = res;
        this.filterItems();
      })
      .catch(err => {
        this.isSearching = false;
        this.utility.showToast(err);
      });
  }

  ionViewDidLoad() {
    this.event.subscribe('homeInteraction', sub => {
      const idx = this.listPost.findIndex(x => x.id === sub.id);
      if (sub.type === 'view') this.listPost[idx].totalView++;
      if (sub.type === 'call') this.listPost[idx].totalChat++;
      if (sub.type === 'comment') this.listPost[idx].totalComment++;
      if (sub.type === 'like')
        if (sub.isLike) {
          this.listPost[idx].totalLike++;
          this.listPost[idx].isLike = true;
        } else {
          this.listPost[idx].totalLike--;
          this.listPost[idx].isLike = false;
        }
      this.filterItems();
    });
  }

  segmentChanged() {
    this.filterItems();
  }

  showDetail(data) {
    this.utility.showPopover('detailPost', { id: data.id, page: 'home' }).present();
  }

  createNewPost() {
    this.navCtrl.push('newPost');
  }

  filterItems() {
    let data = [];
    if (this.solutionType === 'public') data = this.listPost;
    if (this.solutionType === 'holding') data = this.listPost.filter(res => res.holdingId === this.dataProduct.getHoldingId());
    if (this.solutionType === 'favorite') data = this.listPost.filter(res => res.isLike);
    if (data) {
      this.filteredItems = data.filter(res => {
        for (const key in res) {
          if (res.hasOwnProperty(key)) {
            const element = res[key];
            if (('' + element).toLowerCase().indexOf(this.filterText.trim().toLowerCase()) !== -1) return res;
          }
        }
      });
      this.listPostRight = this.filteredItems.filter((e, i) => i % 2);
      this.listPostLeft = this.filteredItems.filter((e, i) => !(i % 2));
    }
  }

  likeBtnClick(post) {
    this.selectedLikePost = post;
    post.isLike = !post.isLike;
    this.lockBtn = true;
    this.dataProduct.modifyLikeProduct(post.id, post.isLike).then(
      () => {
        this.lockBtn = false;
        this.selectedLikePost = null;
        post.totalLike = post.isLike ? post.totalLike + 1 : post.totalLike - 1;
        this.utility.showToast(post.isLike ? 'Product Liked' : 'Product Unliked', 1000);
      },
      err => {
        this.lockBtn = false;
        this.selectedLikePost = null;
        this.utility.showToast(err);
      }
    );
  }

  editPost(post) {
    this.navCtrl.push('newPost', { id: post.id });
  }
}
