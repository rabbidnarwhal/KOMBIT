import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavParams, Content, Events, NavController } from 'ionic-angular';
import { UserChatInfo } from '../../models/user';
import { ChatRequest, ChatRoomResponse } from '../../models/chats';
import { ChatServiceProvider } from '../../providers/chat-service';
import { AuthServiceProvider } from '../../providers/auth-service';
import { UtilityServiceProvider } from '../../providers/utility-service';

@IonicPage()
@Component({
  selector: 'page-chat-room',
  templateUrl: 'chat-room.html'
})
export class ChatRoomPage {
  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') messageInput: ElementRef;

  msgList: ChatRoomResponse[] = [];
  sender: UserChatInfo;
  receiver: UserChatInfo;
  editorMsg = '';
  roomId = '';
  isLoading = true;

  constructor(
    private navParams: NavParams,
    private chatService: ChatServiceProvider,
    private auth: AuthServiceProvider,
    private utility: UtilityServiceProvider,
    private events: Events,
    private zone: NgZone
  ) {
    const picture = 'assets/imgs/profile.png';

    this.sender = new UserChatInfo(this.auth.getPrincipal());
    this.sender.image = this.sender.image ? this.sender.image : picture;
    if (this.navParams.data.hasOwnProperty('receiver')) {
      this.receiver = this.navParams.data.receiver;
      this.receiver.image = this.receiver.image ? this.receiver.image : picture;
    } else {
      this.utility.showToast('Unable to load user');
    }

    if (this.navParams.data.hasOwnProperty('roomId')) {
      this.roomId = this.navParams.data.roomId;
    } else {
      if (this.sender.id > this.receiver.id) {
        this.roomId = btoa('room_' + this.receiver.id + '_' + this.sender.id);
      } else {
        this.roomId = btoa('room_' + this.sender.id + '_' + this.receiver.id);
      }
    }
  }

  subcribeEvents() {
    this.events.subscribe('chat:arrived', (data: any) => {
      // this.getMsg();
      const time = new Date(data.dateTime);
      time.setUTCHours(time.getUTCHours() + -time.getTimezoneOffset() / 60);
      const newChat: ChatRoomResponse = {
        senderId: this.receiver.id,
        chat: data.chat,
        isRead: true,
        receiverId: this.sender.id,
        receiverName: this.sender.name,
        senderName: this.receiver.name,
        date: time.toLocaleString(),
        status: 'delivered'
      };
      this.zone.run(() => {
        this.msgList.push(newChat);
      });
    });
  }

  ionViewDidEnter() {
    this.subcribeEvents();
    this.getMsg();
    // this.readChat();
  }

  ionViewWillLeave() {
    this.events.unsubscribe('chat:arrived');
  }

  onFocus() {
    this.content.resize();
    this.scrollToBottom();
  }

  // readChat() {
  //   this.chatService
  //     .readChat(this.sender.id)
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  getMsg(): void {
    this.chatService
      .getRoomChat(this.roomId)
      .then((res) => {
        this.msgList = res.map((item: ChatRoomResponse) => {
          const obj = item;
          const time = new Date(item.date);
          time.setUTCHours(time.getUTCHours() + -time.getTimezoneOffset() / 60);
          obj.date = time.toLocaleString();
          return obj;
        });
        this.msgList = res;
        this.scrollToBottom();
        this.isLoading = false;
      })
      .catch((err) => {
        this.utility.showToast(err);
      });
  }

  sendMsg() {
    if (!this.editorMsg.trim()) return;

    const dateTime = new Date();
    const newMsg: ChatRequest = {
      SenderId: this.sender.id,
      ReceiverId: this.receiver.id,
      Message: this.editorMsg,
      RoomId: this.roomId,
      Date: dateTime.toDateString()
    };
    console.log('new', newMsg);
    const newChat: ChatRoomResponse = {
      senderId: this.sender.id,
      chat: this.editorMsg,
      isRead: false,
      receiverId: this.receiver.id,
      receiverName: this.receiver.name,
      senderName: this.sender.name,
      date: dateTime.toString(),
      status: 'pending'
    };
    this.msgList.push(newChat);
    this.scrollToBottom();
    this.editorMsg = '';

    this.chatService.sendChat(newMsg).then((res) => {
      const index = this.msgList.findIndex((x) => {
        return x.date === newChat.date;
      });
      this.msgList[index].status = 'delivered';
      this.scrollToBottom();
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 200);
  }

  private focus() {
    if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.focus();
    }
  }

  private setTextareaScroll() {
    const textarea = this.messageInput.nativeElement;
    textarea.scrollTop = textarea.scrollHeight;
  }
}
