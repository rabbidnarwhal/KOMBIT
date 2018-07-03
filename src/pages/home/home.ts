import { Component } from '@angular/core';
import { NavController, IonicPage, Events, NavParams } from 'ionic-angular';
import { UtilityServiceProvider } from '../../providers/utility-service';
import { DataProductServiceProvider } from '../../providers/dataProduct-service';
import { Product } from '../../models/products';
import { AuthServiceProvider } from '../../providers/auth-service';
import { LocationService, MyLocationOptions } from '@ionic-native/google-maps';

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
  public postType: string;
  public userId: number;
  public distance: number;
  public selectedProvince: number;
  public selectedCity: number;
  public locationEnabled: boolean = false;
  public locationIndicatorText: string;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private utility: UtilityServiceProvider,
    private dataProduct: DataProductServiceProvider,
    private events: Events,
    private auth: AuthServiceProvider
  ) {
    this.listPost = new Array<Product>();
    this.postType = 'public';
    this.filterItems();
    console.log('auth', this.auth.getPrincipal());
    this.userId = this.auth.getPrincipal().id;
  }

  ionViewWillEnter() {
    if (!this.listPost.length) this.isSearching = true;
    this.postType = 'public';
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
    this.events.subscribe('homeInteraction', sub => {
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

    this.events.subscribe('homeLocation', sub => {
      this.isSearching = true;
      this.postType = 'location';
      this.locationEnabled = true;
      if (sub.nearme) {
        this.distance = sub.distance;
        this.filterItems(true);
        this.isSearching = false;
        this.locationIndicatorText = `Near me : ${sub.distance} km`;
      } else {
        this.distance = 0;
        this.selectedCity = sub.city.id;
        this.selectedProvince = sub.province.id;
        this.filterItems(true);
        this.isSearching = false;
        this.locationIndicatorText = sub.city.id ? `${sub.city.name}, ${sub.province.name}` : `SELURUH ${sub.province.name}`;
      }
    });
  }
  locationIndicatorClicked() {
    this.utility.showPopover('home-location', '', true).present();
  }

  segmentChanged() {
    if (this.postType === 'location') {
      this.postType = 'public';
      this.selectedCity = 0;
      this.selectedProvince = 0;
      this.distance = 0;
      this.utility.showPopover('home-location', '', true).present();
      // this.navCtrl.push('home-location');
    } else {
      this.locationEnabled = false;
      this.filterItems();
    }
  }

  showDetail(data) {
    this.utility.showPopover('detailPost', { id: data.id, page: 'home' }).present();
  }

  createNewPost() {
    this.navCtrl.push('newPost');
  }

  filterItems(isLocation = false) {
    let data = [];
    if (this.postType === 'public') data = this.listPost;
    if (this.postType === 'holding') data = this.listPost.filter(res => res.holdingId === this.dataProduct.getHoldingId());
    if (this.postType === 'favorite') data = this.listPost.filter(res => res.isLike);

    const filtering = () => {
      this.filteredItems = data.filter(res => {
        for (const key in res) {
          if (res.hasOwnProperty(key)) {
            const element = res[key];
            if (('' + element).toLowerCase().indexOf(this.filterText.trim().toLowerCase()) !== -1) return res;
          }
        }
      });
      // this.listPostRight = this.filteredItems.filter((e, i) => i % 2);
      // this.listPostLeft = this.filteredItems.filter((e, i) => !(i % 2));
    };

    if (isLocation && this.distance) {
      this.nearMePost(this.distance).then(res => {
        data = res;
        filtering();
      });
    } else if (isLocation) {
      data = this.listPost.filter(x => {
        if (this.selectedCity) return x.provinsi === this.selectedProvince && x.kabKota === this.selectedCity;
        else return x.provinsi === this.selectedProvince;
      });
      filtering();
    } else if (data) {
      filtering();
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

  private nearMePost(dist): Promise<any> {
    return new Promise(resolve => {
      this.getPosition()
        .then(pos => {
          resolve(
            this.listPost.filter(x => {
              console.log(x.position);
              if (x.position) {
                const target = x.position.split(', ');
                const distance = this.calculateDistance(pos.latLng.lat, pos.latLng.lng, target[0], target[1]);
                console.log('distance', distance, dist);
                return distance <= dist;
              }
            })
          );
        })
        .catch(err => {
          this.utility.showToast('Unable to get location');
          resolve([]);
        });
    });
  }

  private getPosition() {
    const options: MyLocationOptions = {
      enableHighAccuracy: true
    };
    return LocationService.getMyLocation(options);
  }

  private calculateDistance(lat1, long1, lat2, long2) {
    //radians
    lat1 = (lat1 * 2.0 * Math.PI) / 60.0 / 360.0;
    long1 = (long1 * 2.0 * Math.PI) / 60.0 / 360.0;
    lat2 = (lat2 * 2.0 * Math.PI) / 60.0 / 360.0;
    long2 = (long2 * 2.0 * Math.PI) / 60.0 / 360.0;

    // use to different earth axis length
    var a = 6378137.0; // Earth Major Axis (WGS84)
    var b = 6356752.3142; // Minor Axis
    var f = (a - b) / a; // "Flattening"
    var e = 2.0 * f - f * f; // "Eccentricity"

    var beta = a / Math.sqrt(1.0 - e * Math.sin(lat1) * Math.sin(lat1));
    var cos = Math.cos(lat1);
    var x = beta * cos * Math.cos(long1);
    var y = beta * cos * Math.sin(long1);
    var z = beta * (1 - e) * Math.sin(lat1);

    beta = a / Math.sqrt(1.0 - e * Math.sin(lat2) * Math.sin(lat2));
    cos = Math.cos(lat2);
    x -= beta * cos * Math.cos(long2);
    y -= beta * cos * Math.sin(long2);
    z -= beta * (1 - e) * Math.sin(lat2);

    return Math.sqrt(x * x + y * y + z * z) / 10;
  }
}
