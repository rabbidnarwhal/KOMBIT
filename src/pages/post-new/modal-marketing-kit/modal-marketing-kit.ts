import { Component } from '@angular/core';
import { IonicPage, NavParams, Platform, ViewController } from 'ionic-angular';
import { FilePath } from '@ionic-native/file-path';
import { UtilityServiceProvider } from '../../../providers/utility-service';
import { IOSFilePicker } from '@ionic-native/file-picker';
import { FileChooser } from '@ionic-native/file-chooser';
import { File, FileEntry } from '@ionic-native/file';
import { BehaviorSubject } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-modal-marketing-kit',
  templateUrl: 'modal-marketing-kit.html'
})
export class ModalMarketingKitPage {
  marketingFiles = [];
  files = [];
  optionSubject: BehaviorSubject<Array<any>>;
  constructor(
    private file: File,
    private filePath: FilePath,
    private platform: Platform,
    private utility: UtilityServiceProvider,
    private filePicker: IOSFilePicker,
    private fileChooser: FileChooser,
    private viewCtrl: ViewController,
    private navParams: NavParams
  ) {
    this.marketingFiles = [
      { path: 'assets/imgs/product-ppt.png', type: 'ppt' },
      { path: 'assets/imgs/product-pdf.png', type: 'pdf' },
      { path: 'assets/imgs/product-jpg.png', type: 'jpg' },
      { path: 'assets/imgs/product-doc.png', type: 'doc' }
    ];
  }

  ionViewDidLoad() {
    this.files = [];
    if (this.navParams.data) {
      this.optionSubject = this.navParams.data.params.optionSubject;
    }
  }

  dismissModal() {
    this.optionSubject.next(this.files);
    this.viewCtrl.dismiss();
  }

  selectFileType(type) {
    this.addAttachmentFile(type);
  }

  addAttachmentFile(type) {
    const resolveFileUrl = (uri) => {
      let path = '';
      this.filePath
        .resolveNativePath(uri)
        .then((file) => {
          path = file;
          return this.file.resolveLocalFilesystemUrl(file);
        })
        .then((res: FileEntry) => {
          if (!res) this.utility.showToast('Unable to load file');
          res.file(
            (meta) => {
              if (
                meta.type === 'application/msword' ||
                meta.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                meta.type === 'application/vnd.ms-powerpoint' ||
                meta.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
                meta.type === 'image/jpeg' ||
                meta.type === 'image/png' ||
                meta.type === 'application/pdf'
              ) {
                const fileName = path.split('/');
                this.files.push({ path: path, name: fileName[fileName.length - 1], isUploaded: false, type: type });
              } else this.utility.showToast('File not supported.');
            },
            (error) => this.utility.showToast(error.message)
          );
        })
        .catch((err) => this.utility.showToast(err));
    };

    if (window['cordova'] && this.platform.is('ios')) {
      this.filePicker.pickFile().then((uri) => resolveFileUrl(uri));
    } else if (window['cordova'] && this.platform.is('android')) {
      this.fileChooser.open().then((uri) => resolveFileUrl(uri));
    } else if (!window['cordova']) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept =
        'image/png,image/jpeg,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation';
      input.click();
      input.onchange = () => {
        const blob = window.URL.createObjectURL(input.files[0]);
        this.files.push({ path: blob, name: input.files[0].name, isUploaded: false, type: type });
      };
    }
  }
}
