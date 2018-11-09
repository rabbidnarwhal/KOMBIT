import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Push } from '@ionic-native/push';
import { MyApp } from './app.component';
import { ApiServiceProvider } from '../providers/api-service';
import { AuthServiceProvider } from '../providers/auth-service';
import { UtilityServiceProvider } from '../providers/utility-service';
import { FormValidatorProvider } from '../providers/form-validator';
import { PushNotificationProvider } from '../providers/push-notification';
import { DataProvinceServiceProvider } from '../providers/dataProvince-service';
import { TimeAgoPipe } from 'time-ago-pipe';
import { IonicImageViewerModule } from 'ionic-img-viewer';

@NgModule({
  declarations: [ MyApp ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp, {
      scrollAssist: false,
      autoFocusAssist: false
    }),
    HttpClientModule,
    IonicImageViewerModule
  ],
  bootstrap: [ IonicApp ],
  entryComponents: [ MyApp ],
  providers: [
    ApiServiceProvider,
    AuthServiceProvider,
    FormValidatorProvider,
    Keyboard,
    SplashScreen,
    StatusBar,
    UtilityServiceProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    PushNotificationProvider,
    DataProvinceServiceProvider,
    Push
  ]
})
export class AppModule {}
