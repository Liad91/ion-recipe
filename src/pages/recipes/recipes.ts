import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, PopoverController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';


import { Recipe } from './../../models/recipe';
import { RecipesService } from './../../providers/recipes';
import { AuthService } from './../../providers/auth';

@IonicPage()
@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html',
})
export class Recipes implements OnInit, OnDestroy {
  recipes: Recipe[] = [];
  subscription : Subscription;
  enableInfiniteScroll = true;
  limit = 25;
  skip = 0;

  constructor(private navCtrl: NavController,
              private recipesService: RecipesService,
              private authService: AuthService,
              private popoverCtrl: PopoverController) {}

  ionViewCanEnter() {
    return this.authService.isTokenExists()
  }

  ngOnInit() {
    this.recipes = this.recipesService.recipes;
    this.subscription = this.recipesService.allRecipesReceived.subscribe(
      complete => this.enableInfiniteScroll = false
    );
    this.recipesService.loadRecipes(this.limit, this.skip);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onAddRecipe() {
    this.navCtrl.push('EditRecipe', {mode: 'new'});
  }

  onLoadRecipe(recipe: Recipe , index: number) {
    this.navCtrl.push('RecipePage', { recipe: recipe, index: index });
  }

  doInfinite(infiniteScroll) {
    this.skip += this.limit;
    this.recipesService.loadRecipes(this.limit, this.skip);
    infiniteScroll.complete();
  }

  belongsToUser(id) {
    return localStorage.getItem('userId') === id;
  }

  onPopover(event) {
    this.popoverCtrl.create('Popover').present({
      ev: event
    });
  }
}
