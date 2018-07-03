import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service';
import { AuthServiceProvider } from '../../providers/auth-service';
import { UtilityServiceProvider } from '../../providers/utility-service';
import { Notification } from '../../models/notification';

/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'notification'
})
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})
export class NotificationPage {
  isSearching: boolean = true;
  listNotification: Array<Notification>;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private api: ApiServiceProvider,
    private auth: AuthServiceProvider,
    private utility: UtilityServiceProvider
  ) {
    this.listNotification = [];
  }

  ionViewDidLoad() {
    this.loadListNotification();
  }

  private loadListNotification() {
    this.isSearching = true;
    const userId = this.auth.getPrincipal().id;
    this.api.get('/notification/user/' + userId).subscribe(
      sub => {
        this.listNotification = sub.map(item => {
          const obj = item;
          const time = new Date(item.pushDate);
          time.setUTCHours(time.getUTCHours() + -time.getTimezoneOffset() / 60);
          obj.pushDate = time.toLocaleString();
          return obj;
        });
        this.isSearching = false;
      },
      err => {
        this.isSearching = false;
        this.utility.showToast(err);
      }
    );
  }
}
