import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LoadingController, AlertController, Loading } from 'ionic-angular';
import 'rxjs/Rx';

import { User } from './../models/user';
import { ServerService } from './server';

@Injectable()
export class AuthService {
  isTokenValid = new Subject<boolean>();
  loading: Loading;

  constructor(private http: Http,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private serverService: ServerService) {}

  private handleError(error) {
    this.loading.dismiss();

    this.alertCtrl.create({
      title: error.title,
      message: error.message,
      buttons: ['Dismiss']
    }).present();
  }

  private showLoading(content: string) {
    this.loading = this.loadingCtrl.create({
      content: content
    });
    this.loading.present();
  }

  private signinSucceeded(data) {
    this.loading.dismiss();
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.userId);
    this.isTokenValid.next(true);
  }

  private verifyTokenSucceeded(token: string) {
    this.refreshToken(token);
    this.isTokenValid.next(true);
    this.loading.dismiss();
  }

  private verifyTokenFailed() {
    localStorage.clear();
    this.isTokenValid.next(false);
    this.loading.dismiss();
  }

  authenticate() {
    const token = localStorage.getItem('token');

    if (token) {
      this.verifyToken(token);
    }
  }

  verifyToken(token: string) {
    this.showLoading('Loading');
    this.http.post(`${this.serverService.url}/auth`, { token: token })
    .timeout(this.serverService.reqTimeout)
    .map(this.serverService.extractData)
    .subscribe(
      data => this.verifyTokenSucceeded(data.token),
      error => this.verifyTokenFailed()
    )
  }

  signup(user: User) {
    this.showLoading('Signing you up');
    this.http.post(`${this.serverService.url}/auth/signup`, user)
      .timeout(this.serverService.reqTimeout)
      .map(this.serverService.extractData)
      .do(() => this.loading.dismiss())
      .catch(this.serverService.catchError)
      .subscribe(
        data => this.signin(user),
        error => this.handleError(error)
      );
  }

  signin(user: User) {
    console.log(user);
    this.showLoading('Signing you in');
    this.http.post(`${this.serverService.url}/auth/signin`, user)
      .timeout(this.serverService.reqTimeout)
      .map(this.serverService.extractData)
      .catch(this.serverService.catchError)
      .subscribe(
        data => this.signinSucceeded(data),
        error => this.handleError(error)
      );
  }

  logout() {
    localStorage.clear();
    this.isTokenValid.next(false);
  }

  refreshToken(newToken: string) {
    localStorage.removeItem('token');
    localStorage.setItem('token', newToken);
  }

  tokenExpiredAlert() {
    let canContinue = false;
    const alert = this.alertCtrl.create({
      title: 'Your session is expired',
      message: 'Please login again to continue',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email'
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Password'
        }
      ],
      buttons: [
        {
          text: 'Submit',
          handler: data => {
            this.signin(new User(data.email, data.password));
            canContinue = true;
          }
        },
        {
          text: 'Dismiss',
          role: 'cancel',
          handler: () => {
            this.logout();
          }
        }
      ]
    });

    alert.present();
    alert.onDidDismiss(() => canContinue);
  }

  isTokenExists() {
    if (localStorage.getItem('token') !== null) {
      return true;
    }
    return this.tokenExpiredAlert();
  }
}
