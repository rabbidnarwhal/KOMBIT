import { Component, Input } from '@angular/core';
import { DataProductServiceProvider } from '../../providers/dataProduct-service';
import { ProductDetail } from '../../models/products';
import { Events, NavController } from 'ionic-angular';

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
  @Input() page: string;
  @Input() addressMap: string;
  constructor(private navCtrl: NavController, private dataProduct: DataProductServiceProvider, private event: Events) {}

  openWhatsapp() {
    const phone = this.data.contact.handphone.replace(/ |-|\+/g, '');
    this.dataProduct
      .addChatProduct(this.data.id)
      .then(() => {
        this.data.interaction.totalChat++;
        if (this.page === 'home') this.event.publish('homeInteraction', { id: this.data.id, type: 'call' });
        else this.event.publish('postInteraction', { id: this.data.id, type: 'call' });
      })
      .catch(err => {});
    window.open('https://api.whatsapp.com/send?phone=' + phone);
  }

  openMap() {
    this.navCtrl.push('map-popover', { coordinate: this.data.contact.addressKoordinat });
  }
}
