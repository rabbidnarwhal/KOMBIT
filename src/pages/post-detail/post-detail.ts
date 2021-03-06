import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavParams, Events, ViewController, Scroll } from 'ionic-angular';
import { ProductDetail } from '../../models/products';
import { UtilityServiceProvider } from '../../providers/utility-service';
import { DataProductServiceProvider } from '../../providers/dataProduct-service';
import { Config } from '../../config/config';
import { SocialSharing } from '@ionic-native/social-sharing';

@IonicPage()
@Component({
  selector: 'page-post-detail',
  templateUrl: 'post-detail.html'
})
export class PostDetailPage {
  public data: ProductDetail;
  public lockBtn: boolean = false;
  public isSearching: boolean = true;
  public isMore: boolean = false;
  public selectedPage: string = 'detail';
  public parentPage: string = '';
  public segmentName: string = 'Description';
  @ViewChild('scrollWeb') scrollWeb: Scroll;
  constructor(
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private utility: UtilityServiceProvider,
    private dataProduct: DataProductServiceProvider,
    private event: Events,
    private socialSharing: SocialSharing
  ) {
    this.data = new ProductDetail();
    this.parentPage = this.navParams.get('params').page;
    if (this.navParams.data.params.hasOwnProperty('useCase')) {
      this.selectedPage =
        this.navParams.data.params.useCase === 'comment' ? this.navParams.data.params.useCase : 'detail';
    }
  }

  ionViewDidLoad() {
    this.dataProduct
      .getProductDetail(this.navParams.get('params').id)
      .then((res: ProductDetail) => {
        this.data = res;
        this.data.interaction.comment = this.data.interaction.comment.map((item) => {
          const obj = item;
          const time = new Date(item.commentDate);
          time.setUTCHours(time.getUTCHours() + -time.getTimezoneOffset() / 60);
          obj.commentDate = time.toLocaleString();
          return obj;
        });
        this.data.productImplementationImage = this.data.productImplementation.filter(
          (x) => x.useCase === 'implementationImage'
        );
        this.data.productImplementationVideo = this.data.productImplementation.filter(
          (x) => x.useCase === 'implementationVideo'
        );
        // this.createMap();
        this.isSearching = false;
        return this.dataProduct.addViewProduct(this.data.id);
      })
      .then(() => {
        if (this.parentPage === 'home') {
          this.event.publish('homeInteraction', { id: this.data.id, type: 'view' });
        } else {
          this.event.publish('postInteraction', { id: this.data.id, type: 'view' });
        }
      })
      .catch((err) => {
        this.utility.showToast(err);
      });
  }

  ngAfterViewInit() {
    let interval = setInterval(() => {
      if (this.scrollWeb) {
        clearInterval(interval);
        this.scrollWeb.addScrollEventListener((ev) => {
          if (!this.isMore && ev.target.offsetHeight + ev.target.scrollTop >= ev.target.scrollHeight) {
            this.isMore = true;
          }
        });
      }
    }, 100);
  }

  createMap() {
    const position = this.data.contact.addressKoordinat ? this.data.contact.addressKoordinat.split(', ') : [];
    if (position.length)
      this.data.contact.addressMap =
        'https://maps.googleapis.com/maps/api/staticmap?center=' +
        position[0] +
        ',' +
        position[1] +
        '&markers=color:orange%7Clabel:C%7C' +
        position[0] +
        ',' +
        position[1] +
        '&zoom=16&size=400x200&key=' +
        Config.GOOGLE_MAP_API_KEY;
  }

  close() {
    this.viewCtrl.dismiss();
  }

  back() {
    if (this.selectedPage === 'appointment') {
      this.selectedPage = 'contact';
    } else {
      this.selectedPage = 'detail';
    }
  }

  changePage(page) {
    this.selectedPage = page;
  }

  makeAppointmentClicked(value) {
    this.selectedPage = value;
  }

  openWhatsapp() {
    const phone = this.data.contact.handphone.replace(/ |-|\+/g, '');
    this.dataProduct
      .addChatProduct(this.data.id)
      .then(() => {
        this.data.interaction.totalChat++;
        if (this.parentPage === 'home') {
          this.event.publish('homeInteraction', { id: this.data.id, type: 'call' });
        } else {
          this.event.publish('postInteraction', { id: this.data.id, type: 'call' });
        }
      })
      .catch((err) => {});
    window.open('https://api.whatsapp.com/send?phone=' + phone);
  }

  likeBtnClick() {
    this.data.interaction.isLike = !this.data.interaction.isLike;
    this.lockBtn = true;
    this.dataProduct.modifyLikeProduct(this.data.id, this.data.interaction.isLike).then(
      () => {
        this.lockBtn = false;
        this.data.interaction.totalLike = this.data.interaction.isLike
          ? this.data.interaction.totalLike + 1
          : this.data.interaction.totalLike - 1;
        this.utility.showToast(this.data.interaction.isLike ? 'Product Liked' : 'Product Unliked', 1000);
        if (this.parentPage === 'home')
          this.event.publish('homeInteraction', {
            id: this.data.id,
            type: 'like',
            isLike: this.data.interaction.isLike
          });
        else
          this.event.publish('postInteraction', {
            id: this.data.id,
            type: 'like',
            isLike: this.data.interaction.isLike
          });
      },
      (err) => {
        this.lockBtn = false;
        this.utility.showToast(err);
      }
    );
  }

  shareProduct() {
    this.socialSharing
      .share('Check out this product.', '', '', 'http://kombit.org/product/' + this.data.id)
      .then(() => {})
      .catch((err) => {});
  }

  activeMore() {
    setTimeout(() => {
      this.isMore = true;
    }, 500);
  }
}
