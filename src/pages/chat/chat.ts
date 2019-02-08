import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ChatResponse } from '../../models/chats';
import { UtilityServiceProvider } from '../../providers/utility-service';
import { ChatServiceProvider } from '../../providers/chat-service';
import { UserChatInfo } from '../../models/user';

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
    private utility: UtilityServiceProvider,
    private events: Events,
    private zone: NgZone
  ) {
    this.chats = [];
  }

  ionViewWillEnter() {
    this.subcribeEvents();
    this.loadChats();
  }

  ionViewWillLeave() {
    this.events.unsubscribe('chat:arrived');
  }

  subcribeEvents() {
    this.events.subscribe('chat:arrived', (data) => {
      const index = this.chats.findIndex((x) => x.roomId === data.roomId);
      // this.loadChats();
      this.zone.run(() => {
        this.chats[index].unRead++;
      });
    });
  }

  private loadChats() {
    this.isSearching = true;
    this.chats = [];
    this.chatService
      .getChats()
      .then((res: Array<ChatResponse>) => {
        console.log('chat', res);
        this.chats = res.map((item: ChatResponse) => {
          const obj = item;
          const time = new Date(item.date);
          time.setUTCHours(time.getUTCHours() + -time.getTimezoneOffset() / 60);
          obj.date = time.toLocaleString();
          return obj;
        });
        this.isSearching = false;
      })
      .catch((err) => {
        this.isSearching = false;
        this.utility.showToast(err);
      });
  }

  openDetail(item: ChatResponse) {
    const receiver: UserChatInfo = {
      id: item.receiverId,
      name: item.receiverName,
      image: item.receiverImage
    };
    this.navCtrl.push('ChatRoomPage', { roomId: item.roomId, receiver: receiver });
  }
}
