import { Injectable } from '@angular/core';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { UtilityServiceProvider } from './utility-service';
import { BehaviorSubject } from 'rxjs/Rx';
import { ApiServiceProvider } from './api-service';
import { Events } from 'ionic-angular';

/*
  Generated class for the PushNotificationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PushNotificationProvider {
  private token: string;
  private pushObject: PushObject;
  public topicNotifier: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(private push: Push, private utility: UtilityServiceProvider, private api: ApiServiceProvider, private events: Events) {}

  init() {
    const options: PushOptions = {
      android: { senderID: '508994591424' }
    };

    this.pushObject = this.push.init(options);

    this.pushObject.on('registration').subscribe(sub => {
      console.log('token', sub);
      this.token = sub.registrationId;
      this.subscribeToTopic('all');
      this.topicNotifier.filter(res => res !== null).subscribe(res => {
        if (res.sub) {
          this.subscribeToTopic(res.topic);
          this.api.post(`/users/${res.id}/subscribe/${this.token}`, {}).subscribe(() => {}, err => console.error(err));
        } else {
          this.unsubscribeToTopic(res.topic);
          this.api.post(`/users/${res.id}/unsubscribe`, {}).subscribe(() => {}, err => console.error(err));
        }
      });
    });

    this.pushObject.on('notification').subscribe(sub => {
      if (sub.additionalData.foreground) {
        console.log('foreground', sub);
        if (sub.additionalData.newPost && sub.additionalData.newPost === 'True') {
          this.events.publish('postReload');
        } else {
          this.utility.showToast(sub.message);
        }
      } else {
        console.log('background', sub);
      }
    });

    this.pushObject.on('error').subscribe(sub => {
      console.error(sub);
    });
  }

  getToken() {
    return this.token;
  }

  private subscribeToTopic(topic) {
    this.pushObject.subscribe(topic);
  }

  private unsubscribeToTopic(topic) {
    this.pushObject.subscribe(topic);
  }
}
