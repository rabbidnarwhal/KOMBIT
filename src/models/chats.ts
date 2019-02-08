export class ChatResponse {
  date: string;
  id: number;
  latestChat: string;
  latestUser: string;
  receiverId: number;
  receiverName: string;
  receiverImage: string;
  roomId: string;
  unRead: number;
}

export class ChatRequest {
  SenderId: number;
  ReceiverId: number;
  Message: string;
  RoomId: string;
  Date: string;
}

export class ChatRoomResponse {
  chat: string;
  date: string;
  isRead: boolean;
  receiverId: number;
  receiverName: string;
  senderId: number;
  senderName: string;
  status: string;
}

export class ChatMessage {
  messageId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  toUserId: string;
  time: number | string;
  message: string;
  status: string;
}
