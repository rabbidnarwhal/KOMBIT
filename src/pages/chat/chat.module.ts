import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatPage } from './chat';
import { FooterMenuModule } from '../../components/footer-menu/footer-menu.module';
import { ChatServiceProvider } from '../../providers/chat-service';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [ ChatPage ],
  imports: [ IonicPageModule.forChild(ChatPage), ComponentsModule, FooterMenuModule ],
  providers: [ ChatServiceProvider ]
})
export class ChatPageModule {}
