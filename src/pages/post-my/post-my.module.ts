import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostMyPage } from './post-my';
import { DataProductServiceProvider } from '../../providers/dataProduct-service';
import { FooterMenuModule } from '../../components/footer-menu/footer-menu.module';

@NgModule({
  declarations: [ PostMyPage ],
  imports: [ IonicPageModule.forChild(PostMyPage), FooterMenuModule ],
  providers: [ DataProductServiceProvider ]
})
export class PostMyPageModule {}
