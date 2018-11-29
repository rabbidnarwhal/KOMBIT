import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators';
import { Config } from '../config/config';
import { Network } from '@ionic-native/network';

@Injectable()
export class ApiServiceProvider {
  private url: string;
  private networkIsConnected = true;

  constructor(private http: HttpClient, private network: Network) {
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
    return this.http.get(this.getUrl() + endpoint, options).pipe(catchError(this.handleError));
  }

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
    return this.http.get(url, options).pipe(catchError(this.handleError));
  }

  post(endpoint: string, body: any, httpOptions?: any) {
    if (!this.networkIsConnected) {
      return new ErrorObservable('Network error, make sure there are internet connection.');
    }
    const options = this.createRequestHeader(httpOptions ? httpOptions : {});
    return this.http.post(this.getUrl() + endpoint, body, options).pipe(catchError(this.handleError));
  }

  postFormData(endpoint: string, body: any, httpOptions?: any) {
    if (!this.networkIsConnected) {
      return new ErrorObservable('Network error, make sure there are internet connection.');
    }
    return this.http.post(this.getUrl() + endpoint, body).pipe(catchError(this.handleError));
  }

  private createRequestHeader(options?: any): any {
    const headers = options.hasOwnProperty('headers') ? options.headers : {};
    headers['Content-Type'] = 'application/json';
    headers['Access-Control-Allow-Origin'] = '*';
    options.headers = headers;
    return options;
  }

  private handleError(error: HttpErrorResponse) {
    console.log('api', error);
    if (error.hasOwnProperty('error')) {
      if (error.error instanceof ErrorEvent) console.error('An error occurred:', error.error.message);
      else if (error.error && error.error.hasOwnProperty('Message')) return new ErrorObservable(error.error.Message);
      else if (error.error && error.error.hasOwnProperty('errorMessage')) {
        // return new ErrorObservable(error.error.ExceptionMessage);
        if (error.error.errorMessage instanceof Array) return new ErrorObservable(error.error.errorMessage.join('\n'));
        else return new ErrorObservable(error.error.errorMessage);
      } else return new ErrorObservable('Error code: ' + error.status.toString());
    }
    return new ErrorObservable(`An error occured.`);
  }
}
