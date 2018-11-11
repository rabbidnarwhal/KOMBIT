import { Component, NgZone, ViewChild } from '@angular/core';
import { NavController, IonicPage, Events, NavParams, Slides } from 'ionic-angular';
import { UtilityServiceProvider } from '../../providers/utility-service';
import { DataProductServiceProvider } from '../../providers/dataProduct-service';
import { Product } from '../../models/products';
import { AuthServiceProvider } from '../../providers/auth-service';
import { LocationService, MyLocationOptions } from '@ionic-native/google-maps';
import { Category } from '../../models/category';
import { DataCategoryServiceProvider } from '../../providers/dataCategory-service';
import { DataNotificationServiceProvider } from '../../providers/dataNotification-service';

@IonicPage({
  name: 'home'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Slides) slides: Slides;

  private listPost: Array<Product>;
  public filteredItems: Array<Product>;
  public listPostLeft: Array<Product>;
  public listPostRight: Array<Product>;
  public listSolution: Array<Category>;
  public sliderProduct: Array<Product>;

  public selectedLikePost: any;

  public filterText: string = '';
  public postType: string;
  public locationIndicatorText: string;

  public userId: number;
  public distance: number;
  public selectedProvince: number;
  public selectedCity: number;
  public numberRandomImages: number = 5;
  public unreadNotification: number = 0;

  public isPromoted: boolean = true;
  public isSearching: boolean = true;
  public isSearchingSlider: boolean = true;
  public isSearchingSolution: boolean = true;
  public lockBtn: boolean = false;
  public locationEnabled: boolean = false;
  public newPostEnabled: boolean;
  public notificationEnabled: boolean = true;
  public solutionEnabled: boolean = true;
  public sliderEnabled: boolean = true;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private utility: UtilityServiceProvider,
    private dataProduct: DataProductServiceProvider,
    private dataCategory: DataCategoryServiceProvider,
    private events: Events,
    private auth: AuthServiceProvider,
    private dataNotification: DataNotificationServiceProvider,
    private zone: NgZone
  ) {
    this.postType = 'public';
    this.listPost = new Array<Product>();
    this.listSolution = new Array<Category>();
    this.sliderProduct = new Array<Product>();
    this.filterItems(this.locationEnabled);
    this.userId = this.auth.getPrincipal().id;
    this.newPostEnabled = this.auth.getPrincipal().role === 'Supplier' ? true : false;
    this.notificationEnabled = this.navParams.data ? true : false;
  }

  ionViewWillEnter() {
    if (!this.listPost.length) this.isSearching = true;
    this.loadPostData();
    if (this.navParams.data.solution || this.navParams.data.company) {
      this.notificationEnabled = false;
      this.sliderEnabled = false;
      this.isPromoted = false;
      this.solutionEnabled = false;
    } else {
      this.postType = 'public';
      this.loadSolution();
      this.loadNotificationCount();
    }
  }

  ionViewDidLoad() {
    this.events.subscribe('homeInteraction', (sub) => {
      const idx = this.listPost.findIndex((x) => x.id === sub.id);
      if (idx < 0) {
        this.loadPostData(true);
      } else {
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
        this.filterItems(this.locationEnabled);
      }
    });

    this.events.subscribe('homeLocation', (sub) => {
      this.isSearching = true;
      this.postType = 'location';
      this.locationEnabled = true;
      if (sub.nearme) {
        this.distance = sub.distance;
        this.filterItems(this.locationEnabled);
        this.isSearching = false;
        this.locationIndicatorText = `Near me : ${sub.distance} km`;
      } else {
        this.distance = 0;
        this.selectedCity = sub.city.id;
        this.selectedProvince = sub.province.id;
        this.filterItems(this.locationEnabled);
        this.isSearching = false;
        this.locationIndicatorText = sub.city.id
          ? `${sub.city.name}, ${sub.province.name}`
          : `SELURUH ${sub.province.name}`;
      }
    });

    this.events.subscribe('postReload', () => {
      this.zone.run(() => {
        this.isSearching = true;
        this.loadPostData(true);
      });
    });

    this.events.subscribe('backFromLocation', () => {
      this.postType = 'public';
    });

    // this.events.subscribe('notification-arrived', () => {
    // this.unreadNotification
    // });
  }
  loadNotificationCount() {
    this.dataNotification
      .fetchUnReadNotificationCount(this.userId)
      .then((res) => (this.unreadNotification = res.unRead))
      .catch((err) => this.utility.showToast(err));
  }

  locationIndicatorClicked() {
    this.locationEnabled = false;
    this.utility.showPopover('home-location', '', 'popover-width-full').present();
  }

  loadPostData(isReload = false) {
    this.dataProduct
      .getListAllProducts()
      .then((res) => {
        this.isSearching = false;
        if (this.navParams.data.solution)
          this.listPost = res.filter((x) => x.categoryName === this.navParams.data.solution.category);
        else if (this.navParams.data.company)
          this.listPost = res.filter((x) => x.companyName === this.navParams.data.company.companyName);
        else {
          this.listPost = res;
          this.getPromotedProduct(res);
        }
        this.filterItems(this.locationEnabled);
      })
      .catch((err) => {
        this.isSearching = false;
        if (!isReload) this.utility.showToast(err);
      });
  }

  loadSolution() {
    if (this.listSolution.length) this.isSearchingSolution = false;
    this.dataCategory
      .getListCategory()
      .then((sub) => {
        this.listSolution = sub.splice(0, 7);
        this.isSearchingSolution = false;
      })
      .catch((err) => this.utility.showToast(err));
  }

  segmentChanged() {
    if (this.postType === 'location') {
      this.selectedCity = 0;
      this.selectedProvince = 0;
      this.distance = 0;
      this.utility.showPopover('home-location', '', 'popover-width-full').present();
    } else {
      this.locationEnabled = false;
      this.filterItems(this.locationEnabled);
    }
  }

  showDetail(data) {
    this.utility.showPopover('detailPost', { id: data.id, page: 'home' }).present();
  }

  createNewPost() {
    this.navCtrl.push('newPost');
  }

  filterItems(isLocation) {
    let data = [];
    if (this.postType === 'public') data = this.listPost;
    if (this.postType === 'holding')
      data = this.listPost.filter((res) => res.holdingId === this.dataProduct.getHoldingId());
    if (this.postType === 'favorite') data = this.listPost.filter((res) => res.isLike);

    const filtering = () => {
      this.filteredItems = data.filter((res) => {
        for (const key in res) {
          if (res.hasOwnProperty(key)) {
            const element = res[key];
            if (('' + element).toLowerCase().indexOf(this.filterText.trim().toLowerCase()) !== -1) return res;
          }
        }
      });
    };

    if (isLocation && this.distance) {
      this.nearMePost(this.distance).then((res) => {
        data = res;
        filtering();
      });
    } else if (isLocation) {
      data = this.listPost.filter((x) => {
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
      (err) => {
        this.lockBtn = false;
        this.selectedLikePost = null;
        this.utility.showToast(err);
      }
    );
  }

  editPost(event, post) {
    event.stopPropagation();
    this.navCtrl.push('newPost', { id: post.id });
  }

  showAllSolutions() {
    // const popover = this.utility.showPopover(
    //   'solution',
    //   { optionSubject: 'isModal' },
    //   'popover-width-solution',
    //   true,
    //   true
    // );
    // popover.present();
    this.navCtrl.push('SolutionPage');
  }

  filterSolutions(solution) {
    this.navCtrl.push('home', { solution: solution });
  }

  slidesClicked() {
    const idx = this.slides.getActiveIndex();
    if (idx === 0) {
      this.showDetail(this.sliderProduct[this.sliderProduct.length - 1]);
    } else if (idx === 1) {
      this.showDetail(this.sliderProduct[idx - 1]);
    } else if (idx > this.sliderProduct.length) {
      this.showDetail(this.sliderProduct[idx - 1 - this.sliderProduct.length]);
    } else {
      this.showDetail(this.sliderProduct[idx - 1]);
    }
  }
  slideAutoPlayStopped() {
    setTimeout(() => {
      this.slides.startAutoplay();
    }, 5000);
  }
  toNotificationPage() {
    this.navCtrl.push('notification');
  }

  private nearMePost(dist): Promise<Array<any>> {
    return new Promise((resolve) => {
      this.getPosition()
        .then((pos) => {
          resolve(
            this.listPost.filter((x) => {
              if (x.position) {
                const target = x.position.split(', ');
                const distance = this.calculateDistance(pos.latLng.lat, pos.latLng.lng, target[0], target[1]);
                return distance <= dist;
              }
            })
          );
        })
        .catch((err) => {
          this.utility.showToast('Unable to get location');
          resolve([]);
        });
    });
  }

  private getRandomProduct(products: Array<Product>, n: number) {
    if (products.length < n) n = products.length;
    let temp = [];
    while (n--) {
      var product = products[Math.floor(Math.random() * products.length)];
      if (temp.findIndex((x) => x.id === product.id) < 0) temp.push(product);
      else n++;
    }
    this.sliderProduct = temp;
    this.isSearchingSlider = false;
  }

  private getPromotedProduct(products: Array<Product>) {
    this.sliderProduct = products.filter((x) => x.isPromoted);
    if (!this.sliderProduct.length) {
      this.isPromoted = false;
      this.getRandomProduct(products, this.numberRandomImages);
    } else {
      this.isSearchingSlider = false;
    }
  }

  private getPosition() {
    const options: MyLocationOptions = {
      enableHighAccuracy: true
    };
    return LocationService.getMyLocation(options);
  }

  private calculateDistance(lat1, long1, lat2, long2) {
    //radians
    lat1 = lat1 * 2.0 * Math.PI / 60.0 / 360.0;
    long1 = long1 * 2.0 * Math.PI / 60.0 / 360.0;
    lat2 = lat2 * 2.0 * Math.PI / 60.0 / 360.0;
    long2 = long2 * 2.0 * Math.PI / 60.0 / 360.0;

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
