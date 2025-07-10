import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {DashboardComponent} from './dashboard/dashboard.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../../guards/auth.guard';
import {ProfileComponent} from './profile/profile.component';
import {SettingsComponent} from './settings/settings.component';
import {CartographyComponent} from './dashboard/cartography/cartography.component';
import {DataComponent} from './dashboard/data/data.component';
import {PredictionComponent} from './dashboard/prediction/prediction.component';
import {RoleGuard} from '../../../guards/role.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard, RoleGuard],
    component: DashboardComponent,
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    component: ProfileComponent,
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    component: SettingsComponent,
  },
  {
    path: 'cartography',
    canActivate: [AuthGuard, RoleGuard],
    component: CartographyComponent,
  },
  {
    path: 'data',
    canActivate: [AuthGuard, RoleGuard],
    component: DataComponent,
  },
  {
    path: 'predictions',
    canActivate: [AuthGuard],
    component: PredictionComponent,
  },
]

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
