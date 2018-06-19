export class Product {
  id: number;
  companyName: string;
  holdingId: number;
  holdingName: string;
  productName: string;
  categoryName: string;
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
  CategoryId: number;
  CompanyId: number;
  Credentials: string;
  Description: string;
  HoldingId: number;
  IsIncludePrice: boolean;
  Price: number;
  ProductName: string;
  UserId: number;
  VideoPath: string;
  Foto: Array<Foto>;

  constructor(data) {
    this.CompanyId = data.companyId;
    this.HoldingId = data.holdingId;
    this.UserId = data.id;
    this.Foto = [];
  }

  public init(data) {
    this.CategoryId = data.categoryId;
    this.CompanyId = data.companyId;
    this.Credentials = data.credentials;
    this.Description = data.description;
    this.HoldingId = data.holdingId;
    this.IsIncludePrice = data.isIncludePrice;
    this.Price = data.price;
    this.ProductName = data.productName;
    this.UserId = data.userId;
    this.VideoPath = data.videoPath;
    this.Foto = data.foto.map(foto => {
      const obj: Foto = new Foto();
      obj.FotoName = foto.fotoName;
      obj.FotoPath = foto.fotoPath;
      obj.Id = foto.id;
      return obj;
    });
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
  foto: Array<Foto>;
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
  image: string;
  addressKoordinat: string;
  addressMap: string;
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

export class Foto {
  FotoName: string;
  FotoPath: string;
  Id: number;
}
