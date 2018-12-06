import { Injectable } from '@angular/core';
import { ApiServiceProvider } from './api-service';
import { AuthServiceProvider } from './auth-service';
import { ChatResponse, ChatRoomResponse, ChatRequest } from '../models/chats';

@Injectable()
export class ChatServiceProvider {
  constructor(private api: ApiServiceProvider, private auth: AuthServiceProvider) {}

  getChats(): Promise<Array<ChatResponse>> {
    const userId = this.auth.getPrincipal().id;
    const header = { 'Cache-Control': 'no-cache' };
    return this.api.get('/chat/user/' + userId, { headers: header }).toPromise();
  }

  getRoomChat(id): Promise<ChatRoomResponse> {
    return this.api.get('/chat/room/' + id).toPromise();
  }

  sendChat(data: ChatRequest): Promise<any> {
    return this.api.post('/chat', data).toPromise();
  }

  getUnreadChatCount(): Promise<number> {
    const userId = this.auth.getPrincipal().id;
    return this.api.get('/chat/unread/user/' + userId).toPromise()
  }

}
