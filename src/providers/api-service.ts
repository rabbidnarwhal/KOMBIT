import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators';
import { Config } from '../config/config';
import { Network } from '@ionic-native/network';
import { HTTP } from '@ionic-native/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiServiceProvider {
  private url: string;
  private networkIsConnected = true;

  constructor(private http: HttpClient, private network: Network, private httpNative: HTTP) {
    this.url = Config.API_URL;

    if (this.network.type === 'none' || this.network.type === 'unknown') this.networkIsConnected = false;

    this.network.onDisconnect().subscribe(() => {
      this.networkIsConnected = false;
    });

    this.network.onConnect().subscribe(() => {
      this.networkIsConnected = true;
    });

    if (!window['cordova']) this.networkIsConnected = true;
  }

  getUrl() {
    return window['IonicDevServer'] ? 'api' : this.url;
  }

  get(endpoint: string, httpOptions?: any) {
    if (!this.networkIsConnected) {
      return new ErrorObservable('Network error, make sure there are internet connection.');
    }
    const options = this.createRequestHeader(httpOptions ? httpOptions : {});
    if (!window['cordova']) {
      return this.http.get(this.getUrl() + endpoint, options).pipe(catchError(this.handleError));
    } else {
      return new Observable((observer) => {
        this.httpNative
          .get(this.getUrl() + endpoint, {}, options.headers)
          .then((res) => {
            try {
              const data = JSON.parse(res.data);
              console.log('get data', data);
              observer.next(data);
              console.log('get complete');
            } catch (error) {
              observer.next(res.data);
            }
            observer.complete;
          })
          .catch((err) => observer.error(JSON.parse(err.error).Message));
      });
    }
  }

  /** Only on non cordova */
  getBlob(url: string, httpOptions?: any) {
    if (!this.networkIsConnected) {
      return new ErrorObservable('Network error, make sure there are internet connection.');
    }
    return this.http.get(url, { responseType: 'blob' }).pipe(catchError(this.handleError));
  }

  download(url: string, httpOptions?: any) {
    if (!this.networkIsConnected) {
      return new ErrorObservable('Network error, make sure there are internet connection.');
    }
    const options = this.createRequestHeader(httpOptions ? httpOptions : {});
    // if (!window['cordova']) {
    return this.http.get(url, options).pipe(catchError(this.handleError));
    // } else {
    //   return new Observable((observer) => {
    //     this.httpNative
    //       .downloadFile(url, {}, options.headers, path)
    //       .then((res) => {
    //         console.log('download', res);
    //         observer.next(res['name']);
    //         observer.complete();
    //       })
    //       .catch((err) => {
    //         console.log('download error', err);
    //         observer.error(err.error);
    //       });
    //   });
    // }
  }

  post(endpoint: string, body: any, httpOptions?: any) {
    if (!this.networkIsConnected) {
      return new ErrorObservable('Network error, make sure there are internet connection.');
    }
    const options = this.createRequestHeader(httpOptions ? httpOptions : {});
    if (!window['cordova']) {
      return this.http.post(this.getUrl() + endpoint, body, options).pipe(catchError(this.handleError));
    } else {
      return new Observable((observer) => {
        this.httpNative.setDataSerializer('json');
        this.httpNative
          .post(this.getUrl() + endpoint, body, options.headers)
          .then((res) => {
            try {
              const data = JSON.parse(res.data);
              console.log('post data', data);
              observer.next(data);
              console.log('post complete');
            } catch (error) {
              observer.next(res.data);
            }
            observer.complete();
          })
          .catch((err) => observer.error(JSON.parse(err.error).Message));
      });
    }
  }

  postFormData(endpoint: string, body: any, httpOptions?: any) {
    if (!this.networkIsConnected) {
      return new ErrorObservable('Network error, make sure there are internet connection.');
    }
    if (!window['cordova']) {
      return this.http.post(this.getUrl() + endpoint, body).pipe(catchError(this.handleError));
    } else {
      return new Observable((observer) => {
        this.httpNative.setDataSerializer('urlencode');
        this.httpNative
          .post(this.getUrl() + endpoint, body, {})
          .then((res) => {
            observer.next(JSON.parse(res.data));
            observer.complete();
          })
          .catch((err) => observer.error(JSON.parse(err.error).Message));
      });
    }
  }

  delete(endpoint: string, httpOptions?: any) {
    if (!this.networkIsConnected) {
      return new ErrorObservable('Network error, make sure there are internet connection.');
    }
    const options = this.createRequestHeader(httpOptions ? httpOptions : {});
    if (!window['cordova']) {
      return this.http.delete(this.getUrl() + endpoint, options).pipe(catchError(this.handleError));
    } else {
      return new Observable((observer) => {
        this.httpNative
          .delete(this.getUrl() + endpoint, {}, options.headers)
          .then((res) => {
            observer.next(JSON.parse(res.data));
            observer.complete();
          })
          .catch((err) => observer.error(JSON.parse(err.error).Message));
      });
    }
  }

  private createRequestHeader(options?: any): any {
    const headers = options.hasOwnProperty('headers') ? options.headers : {};
    headers['Content-Type'] = 'application/json';
    headers['Access-Control-Allow-Origin'] = '*';
    options.headers = headers;
    return options;
  }

  private handleError(error: HttpErrorResponse) {
    console.error('api', error);
    if (error.hasOwnProperty('error')) {
      if (error.error instanceof ErrorEvent) console.error('An error occurred:', error.error.message);
      else if (error.error && error.error.hasOwnProperty('Message')) return new ErrorObservable(error.error.Message);
      else if (error.error && error.error.hasOwnProperty('errorMessage')) {
        // return new ErrorObservable(error.error.ExceptionMessage);
        if (error.error.errorMessage instanceof Array) return new ErrorObservable(error.error.errorMessage.join('\n'));
        else return new ErrorObservable(error.error.errorMessage);
      } else return new ErrorObservable(error.status.toString() + ': ' + error.statusText);
    }
    return new ErrorObservable(`An error occured.`);
  }
}
