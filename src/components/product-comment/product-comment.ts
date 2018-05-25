import { Component, Input } from '@angular/core';
import { ProductDetail, Comment } from '../../models/products';
import { DataProductServiceProvider } from '../../providers/dataProduct-service';

/**
 * Generated class for the ProductCommentComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'product-comment',
  templateUrl: 'product-comment.html'
})
export class ProductCommentComponent {
  @Input() data: ProductDetail;
  public commentContent: string;
  constructor(private dataProduct: DataProductServiceProvider) {}

  sendComment() {
    if (this.commentContent) {
      this.dataProduct.addCommentProduct(this.data.id, this.commentContent).then(sub => {
        let comment = new Comment();
        comment.commentBy = this.dataProduct.getCommentByName();
        comment.content = this.commentContent;
        comment.isComment = true;
        comment.commentDate = new Date().toUTCString();
        this.data.interaction.comment.push(comment);
      });
    }
  }
}
