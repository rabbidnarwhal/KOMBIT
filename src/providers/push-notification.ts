import { Injectable } from '@angular/core';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { UtilityServiceProvider } from './utility-service';
import { BehaviorSubject } from 'rxjs/Rx';
import { ApiServiceProvider } from './api-service';
import { Events, Platform } from 'ionic-angular';

@Injectable()
export class PushNotificationProvider {
  private token: string;
  private pushObject: PushObject;
  public topicNotifier: BehaviorSubject<any> = new BehaviorSubject(null);
  private isAndroid: boolean;
  constructor(
    private push: Push,
    private utility: UtilityServiceProvider,
    private api: ApiServiceProvider,
    private events: Events,
    private platform: Platform
  ) {
    this.platform.ready().then(() => {
      this.isAndroid = this.platform.is('android');
    });
  }

  init() {
    const options: PushOptions = {
      android: { senderID: '508994591424' },
      ios: {
        alert: true,
        badge: true
      }
    };

    this.pushObject = this.push.init(options);

    this.pushObject.on('registration').subscribe(sub => {
      // this.token = sub.registrationId;
      // this.subscribeToTopic('all');
      this.token = this.isAndroid ? sub.registrationId : 'ios::' + sub.registrationId;
      if (this.isAndroid) this.subscribeToTopic('all');
      else this.subscribeToTopic('all-ios');
      this.topicNotifier
        .filter(res => res !== null)
        .subscribe(res => {
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
        if (sub.additionalData.hasOwnProperty('newPost') && sub.additionalData.newPost === 'True') {
          this.events.publish('postReload');
        } else if (sub.additionalData.hasOwnProperty('newChat') && sub.additionalData.newChat === 'True') {
          this.events.publish('chat:arrived', { roomId: null });
          this.utility.showToast(sub.message);
        } else {
          this.events.publish('notification-arrived');
          this.utility.showToast(sub.message);
        }
      } else {
        console.log('background', sub);
        if (!this.isAndroid) {
          this.pushObject
            .finish()
            .then(res => {
              console.log('ios finish?', res);
            })
            .catch(err => {
              console.error('error finish', err);
            });
        }
      }
    });

    this.pushObject.on('error').subscribe(sub => {
      console.error('notification', sub);
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
