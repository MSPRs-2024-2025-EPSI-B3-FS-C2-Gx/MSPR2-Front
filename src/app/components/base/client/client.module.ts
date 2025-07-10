import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {roleGuard} from '../../../guards/role.guard';
import {Role} from '../../../models/role.model';

// Components
import {DashboardComponent} from './dashboard/dashboard.component';
import {ProfileComponent} from './profile/profile.component';
import {SettingsComponent} from './settings/settings.component';
import {CartographyComponent} from './dashboard/cartography/cartography.component';
import {DataComponent} from './dashboard/data/data.component';
import {PredictionComponent} from './dashboard/prediction/prediction.component';
import {UnauthorizedComponent} from './unauthorized/unauthorized.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [roleGuard([Role.EN, Role.FR])],
    component: DashboardComponent,
  },
  {
    path: 'profile',
    canActivate: [roleGuard([Role.EN, Role.FR, Role.DE])],
    component: ProfileComponent,
  },
  {
    path: 'settings',
    canActivate: [roleGuard([Role.EN, Role.FR, Role.DE])],
    component: SettingsComponent,
  },
  {
    path: 'cartography',
    canActivate: [roleGuard([Role.EN, Role.FR])],
    component: CartographyComponent,
  },
  {
    path: 'data',
    canActivate: [roleGuard([Role.EN, Role.FR])],
    component: DataComponent,
  },
  {
    path: 'predictions',
    canActivate: [roleGuard([Role.DE, Role.EN, Role.FR])],
    component: PredictionComponent,
  },
  {
    path: 'unauthorized',
    canActivate: [roleGuard([Role.DE, Role.EN, Role.FR])],
    component: UnauthorizedComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class ClientModule {
}
