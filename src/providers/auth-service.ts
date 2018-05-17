import { Injectable } from '@angular/core';
import { ApiServiceProvider } from './api-service';
import { UtilityServiceProvider } from './utility-service';
import { BehaviorSubject } from 'rxjs/Rx';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {
  public authNotifier: BehaviorSubject<any> = new BehaviorSubject(null);
  private isLoggin: boolean;
  private credential: any;

  constructor(private api: ApiServiceProvider, private utility: UtilityServiceProvider) {
    this.isLoggin = false;
    this.authCheck();
  }

  authCheck() {
    const token = localStorage.getItem('token');
    if (token) {
      this.reAuth(token);
    } else {
      this.authNotifier.next(false);
    }
  }

  login(credentials: any) {
    const loading = this.utility.showLoading();
    loading.present();
    this.authenticate({}).then(res => {
      setTimeout(() => {
        loading.dismiss();
        this.authNotifier.next(true);
      }, 1500);
    });
  }

  logout() {
    const loading = this.utility.showLoading();
    loading.present();
    localStorage.removeItem('token');
    setTimeout(() => {
      loading.dismiss();
      this.authNotifier.next(false);
    }, 1500);
  }

  reAuth(token) {
    this.authenticate(token).then(res => {
      setTimeout(() => {
        this.authNotifier.next(true);
      }, 1500);
    });
  }

  authenticate(data: any) {
    this.isLoggin = true;
    localStorage.setItem('token', 'true');
    return new Promise(resolve => {
      resolve(true);
    });
  }

  getLoggingStatus() {
    return this.isLoggin;
  }
}
