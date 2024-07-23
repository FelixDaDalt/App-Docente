import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VersionModalComponent } from './version-modal/version-modal.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    VersionModalComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class VersionModule { }
