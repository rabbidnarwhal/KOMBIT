import { Component, Input } from '@angular/core';
import { Config } from '../../config/config';
import { NavController, ViewController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service';

@Component({
  selector: 'footer-menu',
  templateUrl: 'footer-menu.html'
})
export class FooterMenuComponent {
  text: string;
  menuContent: any = [];
  role: string = '';
  unreadChat: number = 0;
  page: string;
  constructor(
    private navCtrl: NavController,
    private authService: AuthServiceProvider,
    private viewCtrl: ViewController
  ) {
    this.role = this.authService.getPrincipal().role;
  }

  ngOnInit() {
    this.getTabMenu();
    this.page = this.viewCtrl.data.hasOwnProperty('favorite') ? 'FavoritePage' : this.viewCtrl.id;
  }

  getTabMenu() {
    if (this.role === 'Customer') {
      this.menuContent = Config.CUSTOMER.TABMENU;
      this.loadUnreadChat();
    } else {
      this.menuContent = Config.SUPPLIER.TABMENU;
    }
  }

  changePage(item) {
    if (item.component === this.page) {
      return;
    }
    if (this.role === 'Customer') {
      if (item.component === 'FavoritePage') {
        this.navCtrl.setRoot('HomePage', { favorite: true });
      } else if (item.component === 'PostChatPage') {
        alert('Not implemented yet!');
      } else {
        this.navCtrl.setRoot(item.component);
      }
    } else {
      if (item.component === 'FavoritePage') {
        this.navCtrl.push('HomePage', { favorite: true });
      } else if (item.component === 'PostChatPage') {
        alert('Not implemented yet!');
      } else {
        this.navCtrl.push(item.component);
      }
    }
  }

  loadUnreadChat() {
    // this.unreadChat = 1;
  }
}
