import { Injectable } from '@angular/core';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { UtilityServiceProvider } from './utility-service';

/*
  Generated class for the PushNotificationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PushNotificationProvider {
  private token: string;
  private pushObject: PushObject;
  constructor(private push: Push, private utility: UtilityServiceProvider) {}

  init(): Promise<any> {
    return new Promise(resolve => {
      const options: PushOptions = {
        android: { senderID: '1054728202436' }
      };

      this.pushObject = this.push.init(options);

      this.pushObject.on('registration').subscribe(sub => {
        console.log('token', sub);
        this.token = sub.registrationId;
        this.subscribeToTopic('all');
        resolve();
      });

      this.pushObject.on('notification').subscribe(sub => {
        if (sub.additionalData.foreground) {
          console.log('foreground', sub);
          this.utility.basicAlert(sub.message, sub.title, 'Ok');
        } else {
          console.log('background', sub);
        }
      });

      this.pushObject.on('error').subscribe(sub => {
        console.error(sub);
      });
    });
  }

  getToken() {
    return this.token;
  }

  subscribeToTopic(topic) {
    this.pushObject.subscribe(topic);
  }
}
