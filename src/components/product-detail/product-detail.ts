import { Component, Input } from '@angular/core';
import { ProductDetail } from '../../models/products';
import { UtilityServiceProvider } from '../../providers/utility-service';
import { Platform } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service';
import { File } from '@ionic-native/file';
import { ImageViewerController } from 'ionic-img-viewer';

@Component({
  selector: 'product-detail',
  templateUrl: 'product-detail.html'
})
export class ProductDetailComponent {
  @Input() segment: string;
  @Input() data: ProductDetail;

  // public attachmentData: any;
  public lockBtn: boolean = false;
  public attachmentOpen: boolean = false;
  constructor(
    private imageViewCtrl: ImageViewerController,
    private utility: UtilityServiceProvider,
    private api: ApiServiceProvider,
    private file: File,
    private platform: Platform
  ) {}

  downloadMarketingKit(file = null) {
    if (this.data.attachment.length === 1) {
      this.downloadMarketingKit(this.data.attachment[0]);
    } else if (file === null) {
      this.attachmentOpen = !this.attachmentOpen;
    } else if (file) {
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
              .then((res) => {
                file.isLoading = false;
                this.utility.showToast(`${file.fileName} downloaded.`);
              })
              .catch((err) => {
                file.isLoading = false;
                this.utility.showToast(JSON.stringify(err));
              });
          }
        },
        (err) => {
          file.isLoading = false;
          this.utility.showToast(JSON.stringify(err));
        }
      );
    }
  }

  presentImage(myImage) {
    const imageViewer = this.imageViewCtrl.create(myImage);
    imageViewer.present();
  }
}
