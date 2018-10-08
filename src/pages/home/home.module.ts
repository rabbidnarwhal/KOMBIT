import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { DataProductServiceProvider } from '../../providers/dataProduct-service';
import { DataCategoryServiceProvider } from '../../providers/dataCategory-service';
import { DataNotificationServiceProvider } from '../../providers/dataNotification-service';

@NgModule({
  declarations: [HomePage],
  imports: [IonicPageModule.forChild(HomePage)],
  providers: [DataProductServiceProvider, DataCategoryServiceProvider, DataNotificationServiceProvider]
})
export class HomePageModule {}
