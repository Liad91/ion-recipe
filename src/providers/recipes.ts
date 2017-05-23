import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ToastController, App, AlertController } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';

import { Recipe } from './../models/recipe';
import { AuthService } from './auth';
import { ServerService } from './server';

@Injectable()
export class RecipesService {
  allRecipesReceived = new Subject<boolean>();
  subjectCompleted = false;
  recipes: Recipe[] = [];

  constructor(private http: Http,
              private authService: AuthService,
              private toastCtrl: ToastController,
              private AppCtrl: App,
              private serverService: ServerService,
              private alertCtrl: AlertController) {}

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

  private loadRecipesSucceeded(data) {
    if (data.recipes) {
      data.recipes.forEach(recipe => {
        recipe.userId = recipe.user._id;
        recipe.author = `${recipe.user.firstName} ${recipe.user.lastName}`;
      });
      this.recipes.push(...data.recipes);
    }
    else {
      this.allRecipesReceived.next(true);
      this.subjectCompleted = true;
    }
    this.authService.refreshToken(data.token);
  }

  private addRecipeSucceeded(data) {
    this.authService.refreshToken(data.token);
    data.recipe.userId = data.recipe.user._id;
    data.recipe.author = `${data.recipe.user.firstName} ${data.recipe.user.lastName}`;
    this.recipes.push(data.recipe);
    this.AppCtrl.getActiveNav().popToRoot();
  }

  private updateRecipeSucceeded(data, index: number) {
    this.authService.refreshToken(data.token);
    data.recipe.userId = data.recipe.user;
    this.recipes[index] = data.recipe;
    this.AppCtrl.getActiveNav().popToRoot();
  }

  private removeRecipeSucceeded(index: number) {
    this.recipes.splice(index, 1);
    this.AppCtrl.getActiveNav().popToRoot();
    this.toastCtrl.create({
      message: 'Recipe was removed successfully',
      duration: 1500
    }).present();
  }

  loadRecipes(limit, skip) {
    if (this.subjectCompleted || skip < this.recipes.length) {
      this.allRecipesReceived.next(true);
      return;
    }
    const queryParams = `?token=${localStorage.getItem('token')}&limit=${limit}&skip=${skip}`;

    this.http.get(`${this.serverService.url}/recipe/${queryParams}`)
      .timeout(this.serverService.reqTimeout)
      .map(this.serverService.extractData)
      .catch(this.serverService.catchError)
      .subscribe(
        data => this.loadRecipesSucceeded(data),
        error => this.handleError(error)
      );
  }

  addRecipe(recipe: Recipe) {
    this.http.post(`${this.serverService.url}/recipe/new?token=${localStorage.getItem('token')}`, recipe)
      .timeout(this.serverService.reqTimeout)
      .map(this.serverService.extractData)
      .catch(this.serverService.catchError)
      .subscribe(
        data => this.addRecipeSucceeded(data),
        error => this.handleError(error)
      );
  }

  updateRecipe(recipe: Recipe, index: number) {
    this.http.patch(`${this.serverService.url}/recipe/update/${recipe._id}?token=${localStorage.getItem('token')}`, recipe)
      .timeout(this.serverService.reqTimeout)
      .map(this.serverService.extractData)
      .catch(this.serverService.catchError)
      .subscribe(
        data => this.updateRecipeSucceeded(data, index),
        error => this.handleError(error)
      );
  }

  removeRecipe(index: number) {
    this.http.delete(`${this.serverService.url}/recipe/delete/${this.recipes[index]._id}?token=${localStorage.getItem('token')}`)
      .catch(this.serverService.catchError)
      .subscribe(
        data => this.removeRecipeSucceeded(index),
        error => this.handleError(error)
      );
  }
}
