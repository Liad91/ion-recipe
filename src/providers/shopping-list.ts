import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AlertController, App } from 'ionic-angular';

import { Ingredient } from './../models/ingredient';
import { AuthService } from './auth';
import { ServerService } from './server';

@Injectable()
export class ShoppingListService {
  ingredients: Ingredient[] = [];

  constructor(private http: Http,
              private authService: AuthService,
              private serverService: ServerService,
              private alertCtrl: AlertController,
              private appCtrl: App) {}

  private handleError(error) {
    if (error.message === 'Token expired') {
      this.authService.tokenExpiredAlert();
    }
    else {
      this.alertCtrl.create({
        title: error.title,
        message: error.message,
        buttons: ['Dismiss']
      }).present();
    }
  }

  private ingredientNameExists(name: string) {
    return this.ingredients.findIndex(ingredient => {
      return ingredient.name.toLocaleLowerCase() === name.toLocaleLowerCase();
    });
  }

  loadUserIngredients() {
    this.http.get(`${this.serverService.url}/ingredient/?token=${localStorage.getItem('token')}`)
      .timeout(this.serverService.reqTimeout)
      .map(this.serverService.extractData)
      .do(data => this.authService.refreshToken(data.token))
      .catch(this.serverService.catchError)
      .subscribe(
        data => this.ingredients.push(...data.ingredients),
        error => this.handleError(error)
      )
  }

  addIngredients(ingredients: Ingredient[]) {
    ingredients.forEach(ingredient => this.addIngredient(ingredient, true));
  }

  addIngredient(ingredient: Ingredient, popDisabled = false) {
    const index = this.ingredientNameExists(ingredient.name);

    if (index > -1) {
      this.updateIngredient(ingredient, index, true, true);
    }
    else {
      this.http.post(`${this.serverService.url}/ingredient/new/?token=${localStorage.getItem('token')}`, ingredient)
        .timeout(this.serverService.reqTimeout)
        .map(this.serverService.extractData)
        .do(data => this.authService.refreshToken(data.token))
        .do(data => this.ingredients.push(data.ingredient))
        .catch(this.serverService.catchError)
        .subscribe(
          data => {
            if (!popDisabled) {
              this.appCtrl.getActiveNav().pop();
            }
          },
          error => this.handleError(error)
        )
    }
  }

  updateIngredient(ingredient: Ingredient, index: number, onlyAmount = false, popDisabled = false) {
    ingredient._id = this.ingredients[index]._id;
    this.http.patch(`${this.serverService.url}/ingredient/update/?token=${localStorage.getItem('token')}&onlyAmount=${onlyAmount}`, ingredient)
      .timeout(this.serverService.reqTimeout)
      .map(this.serverService.extractData)
      .do(data => this.authService.refreshToken(data.token))
      .do(data => this.ingredients[index] = data.ingredient)
      .catch(this.serverService.catchError)
      .subscribe(
        data => {
          if (!popDisabled) {
            this.appCtrl.getActiveNav().pop();
          }
        },
        error => this.handleError(error)
      )
  }

  removeIngredient(index: number) {
    this.http.delete(`${this.serverService.url}/ingredient/delete/${this.ingredients[index]._id}?token=${localStorage.getItem('token')}`)
      .timeout(this.serverService.reqTimeout)
      .map(this.serverService.extractData)
      .do(data => this.authService.refreshToken(data.token))
      .catch(this.serverService.catchError)
      .subscribe(
        data => this.ingredients.splice(index, 1),
        error => this.handleError(error)
      )
  }
}
