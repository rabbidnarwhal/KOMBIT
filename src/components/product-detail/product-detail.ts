import { Component, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { ProductDetail } from '../../models/products';
import { DataProductServiceProvider } from '../../providers/dataProduct-service';
import { UtilityServiceProvider } from '../../providers/utility-service';
import { Events, Slides } from 'ionic-angular';
import { Config } from '../../config/config';

@Component({
  selector: 'product-detail',
  templateUrl: 'product-detail.html'
})
export class ProductDetailComponent {
  @Input()
  data: ProductDetail;
  @Input()
  page: string;
  @Output()
  selectedPage = new EventEmitter<string>();
  @ViewChild('slider')
  slider: Slides;

  public segmentName: string = 'Description';
  public lockBtn: boolean = false;
  constructor(
    private dataProduct: DataProductServiceProvider,
    private utility: UtilityServiceProvider,
    private event: Events
  ) {}

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
        if (this.page === 'home')
          this.event.publish('homeInteraction', {
            id: this.data.id,
            type: 'like',
            isLike: this.data.interaction.isLike
          });
        else
          this.event.publish('postInteraction', {
            id: this.data.id,
            type: 'like',
            isLike: this.data.interaction.isLike
          });
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
