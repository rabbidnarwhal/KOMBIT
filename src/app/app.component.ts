import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';
import { SplashScreen } from '@ionic-native/splash-screen';

import { UtilityServiceProvider } from '../providers/utility-service';
import { AuthServiceProvider } from '../providers/auth-service';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  public rootPage: string = '';
  public pages: Array<{ title: string; component: string; icon: string; image: string }>;
  public userName: string = '';
  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private utility: UtilityServiceProvider,
    private auth: AuthServiceProvider,
    private menu: MenuController,
    private keyboard: Keyboard
  ) {
    this.initializeApp();

    this.pages = [
      { title: 'Notification', component: '', icon: 'notifications', image: '' },
      { title: 'Create new post', component: 'newPost', icon: 'paper-plane', image: '' },
      { title: 'My post', component: 'myPost', icon: 'share', image: '' },
      { title: 'Company', component: 'company', icon: '', image: 'assets/imgs/company.png' },
      { title: 'Solution', component: 'solution', icon: '', image: 'assets/imgs/solution-menu.png' },
      { title: 'Setting', component: '', icon: 'settings', image: '' },
      { title: 'Point', component: '', icon: '', image: 'assets/imgs/points.png' },
      { title: 'Logout', component: 'logout', icon: 'log-out', image: '' }
    ];
  }

  private initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.menu.enable(false, 'sideMenu');
      this.menu.swipeEnable(false, 'sideMenu');
      this.keyboard.disableScroll(true);
      this.authCheck();
    });
  }

  openPage(page) {
    if (page.component === 'logout') {
      this.utility
        .confirmAlert('Are you sure to logout?', 'Logout')
        .then(res => {
          this.auth.logout();
        })
        .catch(err => {
          console.error(err);
        });
    } else if (page.component) {
      this.nav.push(page.component);
    } else {
      alert('Not implemented yet');
    }
  }

  private authCheck() {
    let isFirstTime = localStorage.getItem('firstTime') || '';
    this.auth.authNotifier.filter(res => res !== null).subscribe(res => {
      if (!isFirstTime || isFirstTime !== 'false') {
        localStorage.setItem('firstTime', 'false');
        isFirstTime = 'false';
        this.rootPage = 'welcome';
      } else if (res) {
        if (!this.menu.isEnabled('sideMenu')) {
          this.menu.enable(true, 'sideMenu');
          this.menu.swipeEnable(true, 'sideMenu');
        }
        this.userName = this.auth.getPrincipal().name;
        this.rootPage = 'home';
      } else {
        if (this.menu.isEnabled('sideMenu')) {
          this.menu.enable(false, 'sideMenu');
          this.menu.swipeEnable(false, 'sideMenu');
        }
        this.rootPage = 'login';
      }
      this.splashScreen.hide();
    });
  }

  public profilePage() {
    this.nav.push('profile', { id: this.auth.getPrincipal().id });
    this.menu.close('sideMenu');
  }
}
