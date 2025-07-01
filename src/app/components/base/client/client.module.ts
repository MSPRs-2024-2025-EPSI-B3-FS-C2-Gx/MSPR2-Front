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

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
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
    canActivate: [AuthGuard],
    component: CartographyComponent,
  },
  {
    path: 'data',
    canActivate: [AuthGuard],
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
