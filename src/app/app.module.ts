import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { ApiServiceProvider } from '../providers/api-service';
import { AuthServiceProvider } from '../providers/auth-service';
import { UtilityServiceProvider } from '../providers/utility-service';
import { FormValidatorProvider } from '../providers/form-validator';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [MyApp],
  imports: [BrowserModule, BrowserAnimationsModule, IonicModule.forRoot(MyApp), HttpClientModule],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ApiServiceProvider,
    AuthServiceProvider,
    UtilityServiceProvider,
    FormValidatorProvider
  ]
})
export class AppModule {}
