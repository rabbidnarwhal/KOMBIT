import { Injectable } from '@angular/core';
import { ApiServiceProvider } from './api-service';
import { AuthServiceProvider } from './auth-service';
import { ChatResponse, ChatRoomResponse, ChatRequest } from '../models/chats';
import { UserChatInfo } from '../models/user';
import { Config } from '../config/config';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
import { Events } from 'ionic-angular';

@Injectable()
export class ChatServiceProvider {
  private hubConnection: HubConnection;

  constructor(private api: ApiServiceProvider, private auth: AuthServiceProvider, private events: Events) {}

  getChats(): Promise<Array<ChatResponse>> {
    const userId = this.auth.getPrincipal().id;
    const header = { 'Cache-Control': 'no-cache' };
    return new Promise((resolve, reject) => {
      this.api.get('/chat/user/' + userId, { headers: header }).subscribe((res) => resolve(res), (err) => reject(err));
    });
  }

  getRoomChat(id: string): Promise<ChatRoomResponse[]> {
    const userId = this.auth.getPrincipal().id;
    return new Promise((resolve, reject) => {
      this.api.get('/chat/room/' + id + '/user/' + userId).subscribe((res) => resolve(res), (err) => reject(err));
    });
  }

  sendChat(data: ChatRequest) {
    return new Promise((resolve, reject) => {
      this.publish('SendChatMessage', data)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          if (err === 'socked:failed') {
            this.sendChatApi(data)
              .then((res) => {
                resolve(res);
              })
              .catch((errApi) => {
                reject(errApi);
              });
          } else {
            reject(err);
          }
        });
    });
  }

  sendChatApi(data: ChatRequest): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.post('/chat', data).subscribe((res) => resolve(res), (err) => reject(err));
    });
  }

  readChat(chatId: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.api.post('/chat/' + chatId + 'read', {}).subscribe((res) => resolve(res), (err) => reject(err));
    });
  }

  getUnreadChatCount(): Promise<{ unRead: number }> {
    const userId = this.auth.getPrincipal().id;
    return new Promise((resolve, reject) => {
      this.api.get('/chat/unread/user/' + userId).subscribe((res) => resolve(res), (err) => reject(err));
    });
  }

  getRecieverInfo(userId: number): Promise<UserChatInfo> {
    return new Promise((resolve, reject) => {
      this.api.get('user/chat-info/' + userId).subscribe((res) => resolve(res), (err) => reject(err));
    });
  }

  initConnection() {
    this.hubConnection = new HubConnectionBuilder().withUrl(Config.HUB_URL).configureLogging(LogLevel.Trace).build();

    this.hubConnection
      .start()
      .then((res) => {
        this.subscribe();
        this.publish('Register', this.auth.getPrincipal().id);
      })
      .catch((err) => console.error('hub', err));
  }

  private publish(methodName, data) {
    if (this.hubConnection && this.hubConnection.state) {
      return new Promise((resolve, reject) => {
        this.hubConnection.invoke(methodName, data).then((res) => resolve(res)).catch((error) => {
          if (!this.hubConnection.state) {
            this.hubConnection
              .start()
              .then((res) => {
                this.publish('Register', this.auth.getPrincipal().id);
                reject('socked:failed');
              })
              .catch((err) => reject(err));
          }
        });
      });
    } else {
      if (methodName === 'SendChatMessage' && !this.hubConnection.state) {
        return this.sendChatApi(data);
      }
    }
  }

  private subscribe() {
    if (this.hubConnection) {
      this.hubConnection.on('register', (data) => {
        localStorage.setItem('socketId', data);
      });

      this.hubConnection.on('send:chat', (data) => {
        if (data.msg === 'Chat Received') {
          this.events.publish('chat:arrived', { roomId: data.roomId, dateTime: data.dateTime, chat: data.chat });
        }
      });
    }
  }

  unregister() {
    const socketId = localStorage.getItem('socketId');
    this.publish('UnRegister', socketId);
  }
}
