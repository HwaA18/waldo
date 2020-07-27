import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationComponent } from './registration/registration.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { Tab3Page } from '../tab3/tab3.page';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  {
    path: 'tabs/tab3', component: Tab3Page
  }
]

@NgModule({
  declarations: [RegistrationComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpClientModule
  ],
  exports: [RegistrationComponent, RouterModule]
})
export class RegistrationModule { }
