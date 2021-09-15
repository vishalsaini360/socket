import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { HeaderComponent } from './header/header.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { CreateRoomComponent } from './create-room/create-room.component';
import { RoomListComponent } from './room-list/room-list.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { SocketioService } from './socketio.service';
import { RegisterComponent } from './register/register.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    SidenavComponent,
    HeaderComponent,
    UserManagementComponent,
    UserDetailComponent,
    CreateRoomComponent,
    RoomListComponent,
    ChatListComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    ToastrModule.forRoot({
      progressAnimation: "decreasing",
      newestOnTop: true,
      maxOpened: 3,
      preventDuplicates: true,
      progressBar: true,

    }),
  ],
  providers: [DatePipe,SocketioService],
  bootstrap: [AppComponent]
})
export class AppModule { }
