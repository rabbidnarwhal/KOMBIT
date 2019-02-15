import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { Keyboard } from '@ionic-native/keyboard';
import { Network } from '@ionic-native/network';
import { Push } from '@ionic-native/push';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

import { ApiServiceProvider } from '../providers/api-service';
import { AuthServiceProvider } from '../providers/auth-service';
import { DataProvinceServiceProvider } from '../providers/dataProvince-service';
import { FormValidatorProvider } from '../providers/form-validator';
import { PushNotificationProvider } from '../providers/push-notification';
import { UtilityServiceProvider } from '../providers/utility-service';

import { IonicImageViewerModule } from 'ionic-img-viewer';
import { ChatServiceProvider } from '../providers/chat-service';
import { HTTP } from '@ionic-native/http';

import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [ MyApp ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp, {
      scrollAssist: false,
      autoFocusAssist: false,
      animate: false
    }),
    HttpClientModule,
    IonicImageLoader.forRoot(),
    IonicImageViewerModule
  ],
  bootstrap: [ IonicApp ],
  entryComponents: [ MyApp ],
  providers: [
    ApiServiceProvider,
    AuthServiceProvider,
    ChatServiceProvider,
    DataProvinceServiceProvider,
    FormValidatorProvider,
    Keyboard,
    Network,
    Push,
    HTTP,
    PushNotificationProvider,
    SplashScreen,
    StatusBar,
    UtilityServiceProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
