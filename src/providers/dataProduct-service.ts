import { Injectable } from '@angular/core';
import { ApiServiceProvider } from './api-service';
import { UtilityServiceProvider } from './utility-service';
import { Product, NewProduct, ProductDetail } from '../models/products';
import { AuthServiceProvider } from './auth-service';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProductServiceProvider {
  private allProducts: Product[];
  private userProducts: Product[];

  constructor(private api: ApiServiceProvider, private utility: UtilityServiceProvider, private auth: AuthServiceProvider) {}

  getListAllProducts() {
    const userId = this.auth.getPrincipal().id;
    return new Promise((resolve, reject) => {
      this.api.get('/product/interaction/user/' + userId).subscribe(
        sub => {
          this.setAllProducts(sub);
          resolve();
        },
        error => reject(error)
      );
    });
  }

  getListUserProducts() {
    const userId = this.auth.getPrincipal().id;
    return new Promise((resolve, reject) => {
      this.api.get('/product/user/' + userId).subscribe(
        sub => {
          this.setUserProducts(sub);
          resolve();
        },
        error => reject(error)
      );
    });
  }

  getProductDetail(id): Promise<ProductDetail> {
    return new Promise((resolve, reject) => {
      this.api.get('/product/' + id).subscribe(sub => resolve(sub), error => reject(error));
    });
  }

  setAllProducts(data: Product[]) {
    if (data) this.allProducts = data;
  }

  setUserProducts(data: Product[]) {
    if (data) this.userProducts = data;
  }

  getAllProducts() {
    return this.allProducts;
  }

  getUserProducts() {
    return this.userProducts;
  }

  addNewProduct(request: NewProduct) {
    return new Promise((resolve, reject) => {
      this.api.post('/product', request).subscribe(
        sub => {
          Promise.all([this.getListAllProducts(), this.getListUserProducts()])
            .then(() => resolve())
            .catch(err => reject(err));
        },
        err => reject(err)
      );
    });
  }

  addViewProduct(productId) {
    return new Promise((resolve, reject) => {
      const request = {
        IsViewed: true,
        ProductId: productId,
        ViewedBy: this.auth.getPrincipal().id
      };
      this.api.post('/interaction/view', request).subscribe(sub => resolve(), err => reject(err));
    });
  }

  addChatProduct(productId) {
    return new Promise((resolve, reject) => {
      const request = {
        IsChat: true,
        ProductId: productId,
        ChatBy: this.auth.getPrincipal().id
      };
      this.api.post('/interaction/chat', request).subscribe(sub => resolve(), err => reject(err));
    });
  }

  addCommentProduct(productId, content) {
    return new Promise((resolve, reject) => {
      const request = {
        IsComment: true,
        ProductId: productId,
        CommentBy: this.auth.getPrincipal().id,
        Comment: content
      };
      this.api.post('/interaction/comment', request).subscribe(sub => resolve(), err => reject(err));
    });
  }

  modifyLikeProduct(productId, isLike) {
    return new Promise((resolve, reject) => {
      const request = {
        IsLike: isLike,
        ProductId: productId,
        LikedBy: this.auth.getPrincipal().id
      };
      this.api.post('/interaction/like', request).subscribe(sub => resolve(), err => reject(err));
    });
  }

  getCommentByName() {
    return this.auth.getPrincipal().name;
  }
}
