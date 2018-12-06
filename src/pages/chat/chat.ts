import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatResponse } from '../../models/chats';
import { UtilityServiceProvider } from '../../providers/utility-service';
import { ChatServiceProvider } from '../../providers/chat-service';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {
  isSearching: boolean;
  chats: Array<ChatResponse> = new Array<ChatResponse>();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private chatService: ChatServiceProvider,
    private utility: UtilityServiceProvider
  ) {
    this.chats = [];
  }

  ionViewDidLoad() {
    this.loadChats();
  }

  private loadChats() {
    this.isSearching = true;
    this.chats = [];
    this.isSearching = false;
    // this.chatService
    //   .getChats()
    //   .then((res: Array<ChatResponse>) => {
    //     this.chats = res.map((item: ChatResponse) => {
    //       const obj = item;
    //       const time = new Date(item.date);
    //       time.setUTCHours(time.getUTCHours() + -time.getTimezoneOffset() / 60);
    //       obj.date = time.toLocaleString();
    //       return obj;
    //     });
    //     this.isSearching = false;
    //   })
    //   .catch((err) => {
    //     this.isSearching = false;
    //     this.utility.showToast(err);
    //   });
  }

  openDetail(item: ChatResponse) {
    this.navCtrl.push('ChatRoomPage', { roomId: item.roomId });
  }
}
