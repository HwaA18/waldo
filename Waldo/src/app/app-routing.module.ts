import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration/registration.component';
import { ReportComponent } from './report/report/report.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  //Added routes to the registration and report pages so the tabs can reach them
  {
    path: 'registration',
    component: RegistrationComponent
  },
  {
    path: 'report',
    component: ReportComponent
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
