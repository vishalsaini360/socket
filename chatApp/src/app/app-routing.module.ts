import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
// import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';
// import { TrainingPlanManagementComponent } from './training-plan-management/training-plan-management.component';
// import { UserDetailComponent } from './user-detail/user-detail.component';
// import { TrainingDetailComponent } from './training-detail/training-detail.component';
// import { PushNotificationComponent } from './push-notification/push-notification.component';
// import { SubscriptionComponent } from './subscription/subscription.component';
// import { ReportComponent } from './report/report.component';
// import { ContentManagementComponent } from './content-management/content-management.component';
// import { NotificationManagementComponent } from './notification-management/notification-management.component';
// import { NotificationDetailComponent } from './notification-detail/notification-detail.component';
// import { SettingComponent } from './setting/setting.component';

import { AppGuard } from './app.guard';
// import { PlanDetailsComponent } from './plan-details/plan-details.component';
import { CreateRoomComponent } from './create-room/create-room.component';
import { RoomListComponent } from './room-list/room-list.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { RegisterComponent } from './register/register.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AppGuard] },
  { path: 'user-management', component: UserManagementComponent, canActivate: [AppGuard] },
  { path: 'create-room', component: CreateRoomComponent, canActivate: [AppGuard] },
  { path: 'room-list', component: RoomListComponent, canActivate: [AppGuard] },
  { path: 'chat-list/:id/:name', component: ChatListComponent, canActivate: [AppGuard] },

  // { path: 'forgot-password', component: ForgotPasswordComponent },
  // { path: 'training-plan-management', component: TrainingPlanManagementComponent, canActivate: [AppGuard] },
  // { path: 'user-detail/:id', component: UserDetailComponent, canActivate: [AppGuard] },
  // { path: 'planDetail/:id', component: PlanDetailsComponent, canActivate: [AppGuard] },
  // { path: 'training-detail', component: TrainingDetailComponent, canActivate: [AppGuard] },
  // { path: 'push-notification', component: PushNotificationComponent, canActivate: [AppGuard] },
  // { path: 'subscription', component: SubscriptionComponent, canActivate: [AppGuard] },
  // { path: 'report', component: ReportComponent, canActivate: [AppGuard] },
  // { path: 'content-management', component: ContentManagementComponent, canActivate: [AppGuard] },
  // { path: 'notification-management', component: NotificationManagementComponent, canActivate: [AppGuard] },
  // { path: 'notification-detail/:id', component: NotificationDetailComponent, canActivate: [AppGuard] },
  // { path: 'setting', component: SettingComponent, canActivate: [AppGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
