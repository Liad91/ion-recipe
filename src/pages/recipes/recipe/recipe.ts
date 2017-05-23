import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';

import { Recipe } from './../../../models/recipe';
import { ShoppingListService } from './../../../providers/shopping-list';
import { RecipesService } from './../../../providers/recipes';

@IonicPage()
@Component({
  selector: 'page-recipe',
  templateUrl: 'recipe.html',
})
export class RecipePage implements OnInit {
  recipe: Recipe;
  recipeIndex: number;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private slSrvice: ShoppingListService,
              private recipesService: RecipesService,
              private toastCtrl: ToastController,
              private alertCtrl: AlertController) {}

  ngOnInit() {
    this.recipeIndex = this.navParams.get('index');
    this.recipe = this.navParams.get('recipe');
    this.recipe.ingredients.forEach(ingredient => ingredient.amount = +ingredient.amount );
  }

  onEditRecipe() {
    this.navCtrl.push('EditRecipe', { recipe: this.recipe, index: this.recipeIndex, mode: 'edit' });
  }

  onAddIngredients() {
    this.slSrvice.addIngredients(this.recipe.ingredients);
    this.toastCtrl.create({
      message: 'Ingredients were added successfully',
      duration: 1500
    }).present();
  }

  onDeleteRecipe() {
    this.alertCtrl.create({
      title: 'Are you sure?',
      buttons: [
        {
          text: 'Delete',
          handler: () => {
            this.recipesService.removeRecipe(this.recipeIndex);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).present();
  }

  belongsToUser() {
    return localStorage.getItem('userId') === this.recipe.userId;
  }
}
