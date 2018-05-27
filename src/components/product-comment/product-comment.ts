import { Component, Input } from '@angular/core';
import { ProductDetail, Comment } from '../../models/products';
import { DataProductServiceProvider } from '../../providers/dataProduct-service';
import { Events } from 'ionic-angular';

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
  @Input() page: string;
  public commentContent: string;
  constructor(private dataProduct: DataProductServiceProvider, private event: Events) {}

  sendComment() {
    if (this.commentContent) {
      this.dataProduct.addCommentProduct(this.data.id, this.commentContent).then(sub => {
        let comment = new Comment();
        comment.commentBy = this.dataProduct.getCommentByName();
        comment.content = this.commentContent;
        comment.isComment = true;
        comment.commentDate = new Date().toUTCString();
        this.data.interaction.comment.push(comment);
        this.data.interaction.totalComment++;
        if (this.page === 'home') this.event.publish('homeInteraction', { id: this.data.id, type:'comment' });
        else this.event.publish('postInteraction', { id: this.data.id, type:'comment' });
      });
    }
  }
}
