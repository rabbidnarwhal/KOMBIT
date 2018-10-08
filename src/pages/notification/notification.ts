import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service';
import { UtilityServiceProvider } from '../../providers/utility-service';
import { Notification } from '../../models/notification';
import { DataNotificationServiceProvider } from '../../providers/dataNotification-service';

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
    private auth: AuthServiceProvider,
    private utility: UtilityServiceProvider,
    private dataNotification: DataNotificationServiceProvider
  ) {
    this.listNotification = [];
  }

  ionViewDidLoad() {
    this.loadListNotification();
  }

  private loadListNotification() {
    this.isSearching = true;
    const userId = this.auth.getPrincipal().id;
    this.dataNotification
      .fetchListNotification(userId)
      .then(res => {
        this.listNotification = res.map(item => {
          const obj = item;
          const time = new Date(item.pushDate);
          time.setUTCHours(time.getUTCHours() + -time.getTimezoneOffset() / 60);
          obj.pushDate = time.toLocaleString();
          return obj;
        });
        this.isSearching = false;
      })
      .catch(err => {
        this.isSearching = false;
        this.utility.showToast(err);
      });
  }
}
