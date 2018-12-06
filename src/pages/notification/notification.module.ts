import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationPage } from './notification';
import { ComponentsModule } from '../../components/components.module';
import { DataNotificationServiceProvider } from '../../providers/dataNotification-service';
import { FooterMenuModule } from '../../components/footer-menu/footer-menu.module';

@NgModule({
  declarations: [ NotificationPage ],
  imports: [ IonicPageModule.forChild(NotificationPage), ComponentsModule, FooterMenuModule ],
  providers: [ DataNotificationServiceProvider ]
})
export class NotificationPageModule {}
