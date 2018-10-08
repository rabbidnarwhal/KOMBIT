import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationPage } from './notification';
import { ComponentsModule } from '../../components/components.module';
import { DataNotificationServiceProvider } from '../../providers/dataNotification-service';

@NgModule({
  declarations: [NotificationPage],
  imports: [IonicPageModule.forChild(NotificationPage), ComponentsModule],
  providers: [DataNotificationServiceProvider]
})
export class NotificationPageModule {}
