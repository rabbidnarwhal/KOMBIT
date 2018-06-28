import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationPage } from './notification';
import { TimeAgoPipe } from 'time-ago-pipe';

@NgModule({
  declarations: [NotificationPage, TimeAgoPipe],
  imports: [IonicPageModule.forChild(NotificationPage)]
})
export class NotificationPageModule {}
