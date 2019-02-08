import { Injectable } from '@angular/core';
import { ApiServiceProvider } from './api-service';
import { Product, NewProduct, ProductDetail } from '../models/products';
import { AuthServiceProvider } from './auth-service';

@Injectable()
export class DataProductServiceProvider {
  private header: any;
  constructor(private api: ApiServiceProvider, private auth: AuthServiceProvider) {
    this.header = { 'Cache-Control': 'no-cache' };
  }

  getListAllProducts(): Promise<Array<Product>> {
    const userId = this.auth.getPrincipal().id;
    return this.api.get('/product/like/user/' + userId, { headers: this.header }).toPromise();
  }

  getListUserProducts(): Promise<Array<Product>> {
    const userId = this.auth.getPrincipal().id;
    return this.api.get('/product/user/' + userId, { headers: this.header }).toPromise();
  }

  getProductDetail(id): Promise<ProductDetail> {
    const userId = this.auth.getPrincipal().id;
    return this.api.get('/product/' + id + '/user/' + userId, { headers: this.header }).toPromise();
  }

  getProductContentEdit(id): Promise<NewProduct> {
    return this.api.get('/product/' + id + '/edit', { headers: this.header }).toPromise();
  }

  addNewProduct(request: NewProduct) {
    return new Promise((resolve, reject) => {
      this.api.post('/product', request).subscribe(
        (sub) => {
          Promise.all([ this.getListAllProducts(), this.getListUserProducts() ])
            .then(() => resolve())
            .catch((err) => reject(err));
        },
        (err) => reject(err)
      );
    });
  }

  addViewProduct(productId) {
    const request = {
      IsViewed: true,
      ProductId: productId,
      ViewedBy: this.auth.getPrincipal().id
    };
    return this.api.post('/interaction/view', request).toPromise();
  }

  addChatProduct(productId) {
    const request = {
      IsChat: true,
      ProductId: productId,
      ChatBy: this.auth.getPrincipal().id
    };
    return this.api.post('/interaction/chat', request).toPromise();
  }

  addCommentProduct(productId, content) {
    const request = {
      IsComment: true,
      ProductId: productId,
      CommentBy: this.auth.getPrincipal().id,
      Comment: content
    };
    return this.api.post('/interaction/comment', request).toPromise();
  }

  modifyLikeProduct(productId: number, isLike): Promise<any> {
    const request = {
      IsLike: isLike,
      ProductId: productId,
      LikedBy: this.auth.getPrincipal().id
    };
    return this.api.post('/interaction/like', request).toPromise();
  }

  getCommentByName(): string {
    return this.auth.getPrincipal().name;
  }

  getUserId(): number {
    return this.auth.getPrincipal().id;
  }

  getHoldingId(): number {
    return this.auth.getPrincipal().holdingId;
  }

  deleteProduct(id: number): Promise<any> {
    return this.api.delete('/product/' + id).toPromise();
  }
}
