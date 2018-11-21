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
  contactId: number;
}

export class NewProduct {
  Attachment: Array<AttachmentFileRequest>;
  Benefit: string;
  BusinessTarget: string;
  CategoryId: number;
  CompanyId: number;
  Credentials: string;
  Certificate: string;
  Currency: string;
  Description: string;
  Faq: string;
  Feature: string;
  Foto: Array<FotoRequest>;
  ProductImplementation: Array<ProductImplementationRequest>;
  ProductCertificate: Array<ProductCertificateRequest>;
  ProductClient: Array<ProductClientRequest>;
  HoldingId: number;
  Implementation: string;
  IsIncludePrice: boolean;
  IsPromoted: boolean;
  PosterId: number;
  Price: number;
  ProductName: string;
  ContactId: number;
  VideoPath: string;
  ContactHandphone: string;
  ContactName: string;
  PosterAsContact: boolean;
  constructor(data) {
    this.CompanyId = data.companyId;
    this.HoldingId = data.holdingId;
    this.PosterId = data.id;
    this.Foto = [];
    this.ProductCertificate = [];
    this.ProductClient = [];
    this.ProductImplementation = [];
    this.Attachment = [];
  }

  public init(data) {
    this.Benefit = data.benefit;
    this.BusinessTarget = data.businessTarget;
    this.CategoryId = data.categoryId;
    this.CompanyId = data.companyId;
    this.Credentials = data.credentials;
    this.Certificate = data.certificate;
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
    this.ContactId = data.contactId;
    this.VideoPath = data.videoPath;
    this.ContactHandphone = data.contactHandphone;
    this.ContactName = data.contactName;
    this.Foto = data.foto.map((foto) => {
      const obj: FotoRequest = new FotoRequest();
      obj.UseCase = foto.useCase;
      obj.FotoName = foto.fotoName;
      obj.FotoPath = foto.fotoPath;
      obj.Id = foto.id;
      return obj;
    });

    this.Attachment = data.attachment.map((attachment) => {
      const obj: AttachmentFileRequest = new AttachmentFileRequest();
      obj.FileName = attachment.fileName;
      obj.FilePath = attachment.filePath;
      obj.Id = attachment.id;
      obj.FileType = attachment.fileType;
      return obj;
    });

    this.ProductCertificate = data.productCertificate.map((certificate) => {
      const obj: ProductCertificateRequest = new ProductCertificateRequest();
      obj.FotoName = certificate.fotoName;
      obj.FotoPath = certificate.fotoPath;
      obj.Id = certificate.id;
      return obj;
    });

    this.ProductClient = data.productClient.map((client) => {
      const obj: ProductClientRequest = new ProductClientRequest();
      obj.FotoName = client.fotoName;
      obj.FotoPath = client.fotoPath;
      obj.Id = client.id;
      return obj;
    });

    this.ProductImplementation = data.productImplementation.map((implementation) => {
      const obj: ProductImplementationRequest = new ProductImplementationRequest();
      obj.UseCase = implementation.useCase;
      obj.FotoName = implementation.fotoName;
      obj.FotoPath = implementation.fotoPath;
      obj.Id = implementation.id;
      obj.Title = implementation.title;
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
  certificate: string;
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
  foto: Array<FotoResponse>;
  productImplementation: Array<ProductImplementationResponse>;
  productCertificate: Array<ProductCertificateResponse>;
  productClient: Array<ProductClientResponse>;
  attachment: Array<AttachmentFileResponse>;
  contact: Contact;
  poster: Contact;
  interaction: Interaction;
  contactName: string;
  contactHandphone: string;
  contactEmail: string;
  constructor() {
    this.interaction = new Interaction();
    this.contact = new Contact();
  }
}

export class Contact {
  id: number;
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
  comment: Array<CommentResponse>;

  constructor() {
    this.totalChat = 0;
    this.totalComment = 0;
    this.totalLike = 0;
    this.totalView = 0;
  }
}

export class CommentResponse {
  content: string;
  commentBy: string;
  isComment: boolean;
  commentDate: string;
}

export class FotoRequest {
  UseCase: string;
  FotoName: string;
  FotoPath: string;
  Id: number;
}

export class FotoResponse {
  fotoName: string;
  fotoPath: string;
  id: number;
}

export class ProductCertificateResponse {
  fotoName: string;
  fotoPath: string;
  id: number;
}
export class ProductClientResponse {
  fotoName: string;
  fotoPath: string;
  id: number;
}

export class ProductImplementationResponse {
  title: string;
  type: string;
  fotoName: string;
  fotoPath: string;
  id: number;
}

export class ProductImplementationRequest {
  UseCase: string;
  Title: string;
  FotoName: string;
  FotoPath: string;
  Id: number;
}

export class ProductCertificateRequest {
  FotoName: string;
  FotoPath: string;
  Id: number;
  UseCase: string;
}
export class ProductClientRequest {
  FotoName: string;
  FotoPath: string;
  Id: number;
  UseCase: string;
}

export class AttachmentFileResponse {
  fileName: string;
  filePath: string;
  fileType: string;
  id: number;
  productId: number;
  isLoading: boolean;
}
export class AttachmentFileRequest {
  FileName: string;
  FilePath: string;
  FileType: string;
  Id: number;
}
