export class ChatResponse {
  id: number;
  date: string;
  receiverName: string;
  receiverId: number;
  latestChat: string;
  roomId: string;
  unread: number;
}

export class ChatRequest {
  senderId: number;
  receiverId: number;
  message: string;
  roomId: string;
}

export class ChatRoomResponse {
  chat: string;
  isUnread: boolean;
  senderName: string;
  receiverName: string
  receiverId: number;
}