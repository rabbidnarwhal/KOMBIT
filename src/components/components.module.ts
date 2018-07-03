import { NgModule } from '@angular/core';
import { ProductDetailComponent } from './product-detail/product-detail';
import { ProductCommentComponent } from './product-comment/product-comment';
import { ProductContactComponent } from './product-contact/product-contact';
import { IonicModule } from 'ionic-angular/module';
import { TimeAgoPipe } from 'time-ago-pipe';

@NgModule({
  declarations: [ProductDetailComponent, ProductCommentComponent, ProductContactComponent, TimeAgoPipe],
  imports: [IonicModule],
  exports: [ProductDetailComponent, ProductCommentComponent, ProductContactComponent, TimeAgoPipe]
})
export class ComponentsModule {}
