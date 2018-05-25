import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ProductDetail } from '../../models/products';
import { DataProductServiceProvider } from '../../providers/dataProduct-service';
import { UtilityServiceProvider } from '../../providers/utility-service';

/**
 * Generated class for the ProductDetailComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'product-detail',
  templateUrl: 'product-detail.html'
})
export class ProductDetailComponent {
  @Input() data: ProductDetail;
  @Output() selectedPage = new EventEmitter<string>();

  public lockBtn: boolean = false;
  constructor(private dataProduct: DataProductServiceProvider, private utility: UtilityServiceProvider) {}

  likeBtnClick() {
    this.data.interaction.isLike = !this.data.interaction.isLike;
    this.lockBtn = true;
    this.dataProduct.modifyLikeProduct(this.data.id, this.data.interaction.isLike).then(
      () => {
        this.lockBtn = false;
        this.data.interaction.totalLike = this.data.interaction.isLike
          ? this.data.interaction.totalLike + 1
          : this.data.interaction.totalLike - 1;
        this.utility.showToast(this.data.interaction.isLike ? 'Product Liked' : 'Product Unliked', 1000);
      },
      err => {
        this.lockBtn = false;
        this.utility.showToast(err);
      }
    );
  }

  changePage(page) {
    this.selectedPage.emit(page);
  }
}
