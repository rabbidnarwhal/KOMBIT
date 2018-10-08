import { Component, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { ProductDetail } from '../../models/products';
import { DataProductServiceProvider } from '../../providers/dataProduct-service';
import { UtilityServiceProvider } from '../../providers/utility-service';
import { Events, Slides, Platform } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service';
import { File } from '@ionic-native/file';

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

  // public attachmentData: any;
  public segmentName: string = 'Description';
  public lockBtn: boolean = false;
  constructor(
    private dataProduct: DataProductServiceProvider,
    private utility: UtilityServiceProvider,
    private event: Events,
    private api: ApiServiceProvider,
    private file: File,
    private platform: Platform
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

  download(file) {
    file.isLoading = true;
    this.api.download(file.filePath, { responseType: 'blob' }).subscribe(
      (blob: Blob) => {
        if (!window['cordova']) {
          file.isLoading = false;
          this.utility.showToast('File downloaded');
        } else {
          const directory = this.platform.is('ios')
            ? this.file.documentsDirectory
            : this.file.externalRootDirectory + 'Download/';
          this.file
            .writeFile(directory, file.fileName, blob, {
              replace: true
            })
            .then(res => {
              file.isLoading = false;
              this.utility.showToast(`${file.fileName} downloaded.`);
            })
            .catch(err => {
              file.isLoading = false;
              this.utility.showToast(JSON.stringify(err));
            });
        }
      },
      err => {
        file.isLoading = false;
        this.utility.showToast(JSON.stringify(err));
      }
    );
  }
}
