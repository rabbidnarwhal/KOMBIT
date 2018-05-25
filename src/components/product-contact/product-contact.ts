import { Component, Input } from '@angular/core';
import { DataProductServiceProvider } from '../../providers/dataProduct-service';
import { ProductDetail } from '../../models/products';

/**
 * Generated class for the ProductContactComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'product-contact',
  templateUrl: 'product-contact.html'
})
export class ProductContactComponent {
  @Input() data: ProductDetail;
  constructor(private dataProduct: DataProductServiceProvider) {}

  openWhatsapp() {
    const phone = this.data.contact.handphone.replace(/ |-|\+/g, '');
    window.open('https://api.whatsapp.com/send?phone=' + phone);
  }
}
