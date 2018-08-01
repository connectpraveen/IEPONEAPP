import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account/account.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { ProfileComponent } from './profile/profile.component';

import {HttpClientModule} from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { RouterModule } from '@angular/router';

import { AngularFireModule } from 'angularfire2';
// New imports to update based on AngularFire2 version 4
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from './providers/auth.service';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AccountPhoneFirebaseService } from './providers/firebase/account-phone-firebase.service';
import { AccountEmailFirebaseService } from './providers/firebase/account-email-firebase.service';
import { AccountGmailFirebaseService } from './providers/firebase/account-gmail-firebase.service';
import { SocialLoginModule, AuthServiceConfig } from "angular4-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angular4-social-login";
import { environment } from '../environments/environment';
import { LoginService } from './providers/login/login.service';
import { FormsModule }   from '@angular/forms';

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("6655461869-as8vlgp8tua1lq5itl4hlg6v29neubb8.apps.googleusercontent.com")
  }/*,
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("Facebook-App-Id")
  }*/
]);
export function provideConfig() {
  return config;
}


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    AccountComponent,
    SubscriptionComponent,
    ProfileComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase, 'angular-auth-firebase'),
    SocialLoginModule,    
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserModule,
    HttpClientModule,
    HttpModule,
    FormsModule,
    MDBBootstrapModule.forRoot(),
    RouterModule.forRoot([
      {
        path:'login',
        component:LoginComponent
      }
    ])

  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  providers: [
    AngularFireAuth,
    AuthService,
    LoginService,
    AccountEmailFirebaseService,
    AccountGmailFirebaseService,
    AccountPhoneFirebaseService, {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
