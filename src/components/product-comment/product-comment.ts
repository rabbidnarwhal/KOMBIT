import { Component, Input } from '@angular/core';
import { ProductDetail, CommentResponse } from '../../models/products';
import { DataProductServiceProvider } from '../../providers/dataProduct-service';
import { Events } from 'ionic-angular';
import { UtilityServiceProvider } from '../../providers/utility-service';

@Component({
  selector: 'product-comment',
  templateUrl: 'product-comment.html'
})
export class ProductCommentComponent {
  @Input() data: ProductDetail;
  @Input() page: string;
  public commentContent: string;
  constructor(
    private dataProduct: DataProductServiceProvider,
    private event: Events,
    private utility: UtilityServiceProvider
  ) {}

  sendComment() {
    if (this.commentContent) {
      const loading = this.utility.showLoading();
      loading.present();
      this.dataProduct
        .addCommentProduct(this.data.id, this.commentContent)
        .then(() => {
          let comment = new CommentResponse();
          comment.commentBy = this.dataProduct.getCommentByName();
          comment.content = this.commentContent;
          comment.isComment = true;
          comment.commentDate = new Date().toUTCString();
          this.data.interaction.comment.push(comment);
          this.data.interaction.totalComment++;
          this.commentContent = '';
          loading.dismiss();
          if (this.page === 'home') this.event.publish('homeInteraction', { id: this.data.id, type: 'comment' });
          else this.event.publish('postInteraction', { id: this.data.id, type: 'comment' });
        })
        .catch((err) => {
          loading.dismiss();
          this.utility.showToast(err);
        });
    }
  }
}
