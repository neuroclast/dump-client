import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule }   from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";


import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { DumpComponent } from './components/dump/dump.component';
import { AppRoutingModule } from './app-routing.module';
import { UserComponent } from './components/user/user.component';
import { DumpService } from "./services/dump.service";
import { ViewComponent } from './components/view/view.component';
import { RecentComponent } from './components/recent/recent.component';
import {Globals} from "./globals";
import {AuthService} from "./services/auth.service";
import { ControlpanelComponent } from './components/controlpanel/controlpanel.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import {UserService} from "./services/user.service";

import {MomentModule} from "angular2-moment";
import {FileSizePipe} from "./pipes/content-size.pipe";
import { FooterComponent } from './components/footer/footer.component';
import {HttpAuth} from "./interceptors/httpauth";
import { SearchComponent } from './components/search/search.component';
import { EditComponent } from './components/edit/edit.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { LoadingComponent } from './components/loading/loading.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DumpComponent,
    UserComponent,
    ViewComponent,
    RecentComponent,
    ControlpanelComponent,
    LoginComponent,
    RegisterComponent,
    FileSizePipe,
    FooterComponent,
    SearchComponent,
    EditComponent,
    NotfoundComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    MomentModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpAuth, multi: true },
    DumpService,
    Globals,
    AuthService,
    UserService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
