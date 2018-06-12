export class Product {
  id: number;
  companyName: string;
  holdingId: number;
  holdingName: string;
  productName: string;
  categoryName: string;
  fotoPath: string;
  fotoName: string;
  totalLike: number;
  totalComment: number;
  totalView: number;
  totalChat: number;
  price: number;
  isIncludePrice: boolean;
  isLike: boolean;
  description: string;
  credentials: string;
  videoPath: string;
}

export class NewProduct {
  CompanyId: number;
  HoldingId: number;
  CategoryId: number;
  ProductName: string;
  Description: string;
  IsIncludePrice: boolean;
  Price: number;
  Credentials: string;
  VideoPath: string;
  FotoName: string;
  FotoPath: string;
  UserId: number;

  constructor(data) {
    this.CompanyId = data.companyId;
    this.HoldingId = data.holdingId;
    this.UserId = data.id;
  }
}

export class ProductDetail {
  id: number;
  companyName: string;
  holdingName: string;
  productName: string;
  categoryName: string;
  description: string;
  isIncludePrice: boolean;
  price: number;
  credentials: string;
  videoPath: string;
  fotoPath: string;
  contact: Contact;
  interaction: Interaction;
}

export class Contact {
  name: string;
  email: string;
  jobTitle: string;
  occupation: string;
  handphone: string;
  address: string;
  foto: string;
}

export class Interaction {
  totalLike: number;
  totalComment: number;
  totalView: number;
  totalChat: number;
  isLike: boolean;
  comment: Array<Comment>;
}

export class Comment {
  content: string;
  commentBy: string;
  isComment: boolean;
  commentDate: string;
}
