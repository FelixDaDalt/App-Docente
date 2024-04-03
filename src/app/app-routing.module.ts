import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { autentificado } from './guard/autentificado.guard';
import { loginGuard } from './guard/login-guard';


const routes: Routes = [
  {
    path:'',
    redirectTo:'dashboard',
    pathMatch:'full'
  },
  {
    path:'dashboard',
    canActivate:[autentificado],
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  { path: 'login',
  canActivate:[loginGuard],
  loadChildren: () => import('./componentes/login/login.module').then(m => m.LoginModule)
  },
  {
    path:'**',
    redirectTo:'dashboard',
    pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


}
