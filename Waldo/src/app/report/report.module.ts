import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report/report.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { Tab1Page } from '../tab1/tab1.page';

const routes: Routes = [
  {
    path: 'tabs/tab1', component: Tab1Page
  }
]

@NgModule({
  declarations: [ReportComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ], 
  exports: [ReportComponent]
})
export class ReportModule { }
