export class Product {
  id: number;
  companyName: string;
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
