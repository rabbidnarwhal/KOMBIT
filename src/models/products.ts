export class Product {
  categoryName: string;
  companyName: string;
  currency: string;
  holdingId: number;
  holdingName: string;
  id: number;
  isIncludePrice: boolean;
  isLike: boolean;
  isPromoted: boolean;
  kabKota: number;
  position: string;
  posterId: number;
  price: number;
  productName: string;
  provinsi: number;
  totalChat: number;
  totalComment: number;
  totalLike: number;
  totalView: number;
  userId: number;
}

export class NewProduct {
  Attachment: Array<AttachmentFileRequest>;
  Benefit: string;
  BusinessTarget: string;
  CategoryId: number;
  CompanyId: number;
  Credentials: string;
  Currency: string;
  Description: string;
  Faq: string;
  Feature: string;
  Foto: Array<Foto>;
  HoldingId: number;
  Implementation: string;
  IsIncludePrice: boolean;
  IsPromoted: boolean;
  PosterId: number;
  Price: number;
  ProductName: string;
  UserId: number;
  VideoPath: string;
  constructor(data) {
    this.CompanyId = data.companyId;
    this.HoldingId = data.holdingId;
    this.PosterId = data.id;
    this.Foto = [];
    this.Attachment = [];
  }

  public init(data) {
    this.Benefit = data.benefit;
    this.BusinessTarget = data.businessTarget;
    this.CategoryId = data.categoryId;
    this.CompanyId = data.companyId;
    this.Credentials = data.credentials;
    this.Currency = data.currency;
    this.Description = data.description;
    this.Faq = data.faq;
    this.Feature = data.feature;
    this.HoldingId = data.holdingId;
    this.Implementation = data.implementation;
    this.IsIncludePrice = data.isIncludePrice;
    this.IsPromoted = data.isPromoted;
    this.PosterId = data.posterId;
    this.Price = data.price;
    this.ProductName = data.productName;
    this.UserId = data.userId;
    this.VideoPath = data.videoPath;

    this.Foto = data.foto.map(foto => {
      const obj: Foto = new Foto();
      obj.UseCase = foto.useCase;
      obj.FotoName = foto.fotoName;
      obj.FotoPath = foto.fotoPath;
      obj.Id = foto.id;
      return obj;
    });

    this.Attachment = data.attachment.map(attachment => {
      const obj: AttachmentFileRequest = new AttachmentFileRequest();
      obj.FileName = attachment.fileName;
      obj.FilePath = attachment.filePath;
      obj.Id = attachment.id;
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
  benefit: string;
  businessTarget: string;
  faq: string;
  feature: string;
  implementation: string;
  isPromoted: boolean;
  isIncludePrice: boolean;
  currency: string;
  price: number;
  credentials: string;
  videoPath: string;
  foto: Array<Foto>;
  attachment: Array<AttachmentFileResponse>;
  contact: Contact;
  interaction: Interaction;

  constructor() {
    this.interaction = new Interaction();
    this.contact = new Contact();
  }
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

  constructor() {
    this.totalChat = 0;
    this.totalComment = 0;
    this.totalLike = 0;
    this.totalView = 0;
  }
}

export class Comment {
  content: string;
  commentBy: string;
  isComment: boolean;
  commentDate: string;
}

export class Foto {
  UseCase: string;
  FotoName: string;
  FotoPath: string;
  Id: number;
}

export class AttachmentFileResponse {
  fileName: string;
  filePath: string;
  id: number;
  productId: number;
  isLoading: boolean;
}
export class AttachmentFileRequest {
  FileName: string;
  FilePath: string;
  Id: number;
}
