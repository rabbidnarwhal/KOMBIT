import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators';

/*
  Generated class for the ApiServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiServiceProvider {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = '';
  }

  getUrl() {
    return window['IonicDevServer'] ? 'api' : this.url;
  }

  get(endpoint: string, httpOptions?: any) {
    const options = this.createRequestHeader(httpOptions ? httpOptions : {});
    return this.http.get(this.getUrl() + endpoint, options).pipe(catchError(this.handleError));
  }

  post(endpoint: string, body: any, httpOptions?: any) {
    const options = this.createRequestHeader(httpOptions ? httpOptions : {});
    return this.http.post(this.getUrl() + endpoint, body, options).pipe(catchError(this.handleError));
  }

  private createRequestHeader(options?: any): any {
    const headers = options.hasOwnProperty('headers') ? options.headers : new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    options.headers = headers;
    return options;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.hasOwnProperty('error')) {
      if (error.error instanceof ErrorEvent) console.error('An error occurred:', error.error.message);
      else if (error.error.hasOwnProperty('ExceptionMessage')) return new ErrorObservable(error.error.ExceptionMessage);
      // return new ErrorObservable(error.error.ExceptionMessage);
      else console.error(`error message`, error);
      return new ErrorObservable(`An error occured.`);
    }
  }
}
