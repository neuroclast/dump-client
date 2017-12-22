import { NgModule }               from '@angular/core';
import { RouterModule, Routes }   from '@angular/router';
import { DumpComponent }          from "./components/dump/dump.component";
import { UserComponent }          from "./components/user/user.component";
import { ViewComponent }          from "./components/view/view.component";
import { ControlpanelComponent }  from "./components/controlpanel/controlpanel.component";
import { LoginComponent }         from "./components/login/login.component";
import { RegisterComponent }      from "./components/register/register.component";
import { SearchComponent }       from "./components/search/search.component";
import { EditComponent }          from "./components/edit/edit.component";
import {NotfoundComponent} from "./components/notfound/notfound.component";

const routes: Routes = [
  { path: '',             component: DumpComponent },
  { path: 'd',            component: DumpComponent },
  { path: 'd/:id',        component: DumpComponent },
  { path: 'u/:username',  component: UserComponent },
  { path: 'cp',           component: ControlpanelComponent },
  { path: 'login',        component: LoginComponent },
  { path: 'register',     component: RegisterComponent },
  { path: 'search/:type', component: SearchComponent },
  { path: 'search',       component: SearchComponent },
  { path: 'edit/:id',     component: EditComponent },
  { path: '404',          component: NotfoundComponent },
  { path: 'v/:id',        component: ViewComponent },
  { path: 'v',            redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
