import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { DataProductServiceProvider } from '../../providers/dataProduct-service';
import { DataCategoryServiceProvider } from '../../providers/dataCategory-service';
import { DataNotificationServiceProvider } from '../../providers/dataNotification-service';
import { FooterMenuModule } from '../../components/footer-menu/footer-menu.module';
import { ChatServiceProvider } from '../../providers/chat-service';

@NgModule({
  declarations: [ HomePage ],
  imports: [ IonicPageModule.forChild(HomePage), FooterMenuModule ],
  providers: [
    DataProductServiceProvider,
    DataCategoryServiceProvider,
    DataNotificationServiceProvider,
    ChatServiceProvider
  ]
})
export class HomePageModule {}
