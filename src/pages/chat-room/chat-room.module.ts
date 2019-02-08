import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatRoomPage } from './chat-room';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [ ChatRoomPage ],
  imports: [ IonicPageModule.forChild(ChatRoomPage), ComponentsModule ]
})
export class ChatRoomPageModule {}
