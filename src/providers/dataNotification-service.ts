import { Injectable } from '@angular/core';
import { ApiServiceProvider } from './api-service';
import { Notification } from '../models/notification';

@Injectable()
export class DataNotificationServiceProvider {
  public unRead: number;
  constructor(private api: ApiServiceProvider) {}

  fetchListNotification(id): Promise<Array<Notification>> {
    const header = { 'Cache-Control': 'no-cache' };
    return new Promise((resolve, reject) => {
      this.api
        .get('/notification/user/' + id, { headers: header })
        .subscribe((res) => resolve(res), (err) => reject(err));
    });
  }

  fetchUnReadNotificationCount(id): Promise<{ unRead: number }> {
    return new Promise((resolve, reject) => {
      this.api.get('/notification/user/' + id + '/unread').subscribe((res) => resolve(res), (err) => reject(err));
    });
  }
}
