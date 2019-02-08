import { Component, Input, NgZone } from '@angular/core';
import { Config } from '../../config/config';
import { NavController, ViewController, Events } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service';
import { ChatServiceProvider } from '../../providers/chat-service';

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
    private viewCtrl: ViewController,
    private zone: NgZone,
    private events: Events,
    private chatService: ChatServiceProvider
  ) {
    this.role = this.authService.getPrincipal().role;
  }

  ngOnInit() {
    this.getTabMenu();
    if (this.viewCtrl.data.hasOwnProperty('favorite')) {
      this.page = 'FavoritePage';
    } else if (this.viewCtrl.data.hasOwnProperty('solution')) {
      this.page = 'SolutionPage';
    } else {
      this.page = this.viewCtrl.id;
    }
  }

  ngOnDestroy() {
    this.events.unsubscribe('chat:arrived');
  }

  getTabMenu() {
    if (this.role === 'Customer') {
      this.menuContent = Config.CUSTOMER.TABMENU;
      this.loadUnreadChat();
      this.subscribeChatArrived();
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
    this.chatService
      .getUnreadChatCount()
      .then((res) => (this.unreadChat = res.unRead))
      .catch((err) => console.log(err));
  }

  subscribeChatArrived() {
    this.events.subscribe('chat:arrived', (data: any) => {
      this.zone.run(() => {
        this.unreadChat++;
      });
    });
  }
}
