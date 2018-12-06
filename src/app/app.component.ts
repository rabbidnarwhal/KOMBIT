import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';
import { SplashScreen } from '@ionic-native/splash-screen';

import { UtilityServiceProvider } from '../providers/utility-service';
import { AuthServiceProvider } from '../providers/auth-service';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { PushNotificationProvider } from '../providers/push-notification';
import { DataProvinceServiceProvider } from '../providers/dataProvince-service';
import { Config } from '../config/config';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  public rootPage: string = 'LoginPage';
  public pages: Array<{ title: string; component: string; icon: string; image: string }>;
  public userName: string = '';
  public picture: string;
  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private utility: UtilityServiceProvider,
    private auth: AuthServiceProvider,
    private menu: MenuController,
    private keyboard: Keyboard,
    private events: Events,
    private pushNotification: PushNotificationProvider,
    private dataProvince: DataProvinceServiceProvider
  ) {
    this.initializeApp();
    this.picture = 'assets/imgs/profile.png';
    this.pages = [];
  }

  private initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#222155');
      this.menu.enable(false, 'sideMenu');
      this.menu.swipeEnable(false, 'sideMenu');
      this.keyboard.disableScroll(true);
      this.pushNotification.init();
      this.loadProvinceData();
      this.authCheck();
    });
  }

  openPage(page) {
    if (page.component === 'logout') {
      this.utility
        .confirmAlert('Are you sure to logout?', 'Logout')
        .then((res) => this.auth.logout())
        .catch((err) => console.error(err));
    } else if (page.component) this.nav.push(page.component);
    else alert('Not implemented yet');
  }

  private changeSideMenus(role: string) {
    if (role === 'Supplier') {
      this.pages = Config.SUPPLIER.SIDEMENU;
    } else if (role === 'Customer') {
      this.pages = Config.CUSTOMER.SIDEMENU;
    }
  }

  private authCheck() {
    if (window['IonicDevServer']) {
      const routeUrl = document.URL.split('/#/');
      if (routeUrl.length > 1) window.location.href = routeUrl[0];
    }
    let isFirstTime = localStorage.getItem('firstTime') || '';
    this.auth.authNotifier.filter((res) => res !== null).subscribe((res) => {
      if (!isFirstTime || isFirstTime !== 'false') {
        localStorage.setItem('firstTime', 'false');
        isFirstTime = 'false';
        this.rootPage = 'WelcomePage';
      } else if (res) {
        if (!this.menu.isEnabled('sideMenu')) {
          this.menu.enable(true, 'sideMenu');
          this.menu.swipeEnable(true, 'sideMenu');
        }
        this.userName = this.auth.getPrincipal().name;
        this.picture = this.auth.getPrincipal().image ? this.auth.getPrincipal().image : this.picture;
        this.rootPage = 'HomePage';
        this.changeSideMenus(this.auth.getPrincipal().role);
      } else {
        if (this.menu.isEnabled('sideMenu')) {
          this.menu.enable(false, 'sideMenu');
          this.menu.swipeEnable(false, 'sideMenu');
        }
        this.rootPage = 'LoginPage';
      }
      this.splashScreen.hide();
    });
  }

  public profilePage() {
    this.nav.push('ProfilePage', { id: this.auth.getPrincipal().id });
    this.menu.close('sideMenu');

    this.events.subscribe('picture-changed', (sub) => {
      this.picture = sub;
      this.events.unsubscribe('picture-changed');
    });
  }

  private loadProvinceData() {
    Promise.all([ this.dataProvince.getListProvince(), this.dataProvince.getListCity() ])
      .then((res) => {
        this.dataProvince.setProvince(res[0]);
        this.dataProvince.setCity(res[1]);
      })
      .catch((err) => console.error(err));
  }
}
