import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';

import { AuthService } from './../../../providers/auth';

@IonicPage()
@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class Popover {

  constructor(private viewCtrl: ViewController, private authService: AuthService) {}

  onLogout() {
    this.authService.logout();
    this.viewCtrl.dismiss();
  }
}
