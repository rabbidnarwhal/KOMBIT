import { ApiServiceProvider } from './api-service';
import { BehaviorSubject } from 'rxjs/Rx';
import { Config } from '../config/config';
import { Injectable } from '@angular/core';
import { LoginResponse, LoginRequest } from '../models/login';
import { PushNotificationProvider } from './push-notification';
import { UtilityServiceProvider } from './utility-service';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {
  public authNotifier: BehaviorSubject<any> = new BehaviorSubject(null);
  private isLoggin: boolean;
  private principal: LoginResponse;

  constructor(private api: ApiServiceProvider, private utility: UtilityServiceProvider, private push: PushNotificationProvider) {
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

  login(credentials: LoginRequest) {
    const loading = this.utility.showLoading();
    loading.present();
    this.api.post('/users/login', credentials).subscribe(
      (sub: LoginResponse) => {
        this.authenticate(sub).then(res => {
          loading.dismiss();
          this.loadConfig();
          this.authNotifier.next(true);
        });
      },
      error => {
        loading.dismiss();
        this.utility.showToast(error);
      }
    );
  }

  logout() {
    const loading = this.utility.showLoading();
    loading.present();
    localStorage.removeItem('token');
    setTimeout(() => {
      loading.dismiss();
      this.push.topicNotifier.next({ sub: false, topic: 'combits', id: this.principal.id });
      this.setPrincipal(null);
      this.authNotifier.next(false);
    }, 1500);
  }

  reAuth(data) {
    const token = data.split(':');
    this.api.get('/users/' + token[1] + '/' + token[0]).subscribe(
      (sub: LoginResponse) => {
        this.authenticate(sub).then(res => {
          this.loadConfig();
          this.authNotifier.next(true);
        });
      },
      err => {
        localStorage.removeItem('token');
        this.authNotifier.next(false);
      }
    );
  }

  authenticate(data: LoginResponse) {
    const date = new Date().getTime().toString();
    this.isLoggin = true;
    this.setPrincipal(data);
    this.push.topicNotifier.next({ sub: true, topic: 'combits', id: data.id });
    localStorage.setItem('token', data.idNumber + ':' + data.id + ':' + date);
    return new Promise(resolve => {
      resolve(true);
    });
  }

  getLoggingStatus() {
    return this.isLoggin;
  }

  setPrincipal(principal: LoginResponse) {
    this.principal = principal;
  }

  getPrincipal() {
    return this.principal;
  }

  loadConfig() {
    this.api.get('/config').subscribe(
      sub => {
        sub.forEach(element => {
          if (element.paramCode === 'DEFAULT_CURRENCY') Config.setCurrency(element.paramValue);
        });
      },
      err => console.error(err)
    );
  }
}
