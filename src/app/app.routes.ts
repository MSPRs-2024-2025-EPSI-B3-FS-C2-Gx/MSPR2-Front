import {Routes} from '@angular/router';
import {HomeComponent} from './components/base/home/home.component';
import {LoginComponent} from './components/base/login/login.component';
import {ContactComponent} from './components/base/contact/contact.component';
import {ErrorComponent} from './components/base/error/error.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'client',
    loadChildren: () => import('./components/base/client/client.module').then(m => m.ClientModule)
  },
  {
    path: '**',
    component: ErrorComponent
  }
];
