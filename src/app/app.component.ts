import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthService } from './../providers/auth';

@Component({
  template: `<ion-nav [root]="isAuthentiate ? 'Tabs' : 'Home'"></ion-nav>`
})
export class MyApp {
  isAuthentiate = false;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private authService: AuthService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.authService.authenticate();
      this.authService.isTokenValid.subscribe(
        validToken => this.isAuthentiate = validToken
      );
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

