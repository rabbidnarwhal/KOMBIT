import { Injectable } from '@angular/core';
import { ApiServiceProvider } from './api-service';
import { Notification } from '../models/notification';

@Injectable()
export class DataNotificationServiceProvider {
  public unRead: number;
  constructor(private api: ApiServiceProvider) {}

  fetchListNotification(id): Promise<Array<Notification>> {
    const header = { 'Cache-Control': 'no-cache' };
    return this.api.get('/notification/user/' + id, { headers: header }).toPromise();
  }

  fetchUnReadNotificationCount(id): Promise<{ unRead: number }> {
    return this.api.get('/notification/user/' + id + '/unread').toPromise();
  }
}
