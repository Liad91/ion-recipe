import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, AlertController, ToastController, PopoverController } from 'ionic-angular';

import { Ingredient } from './../../models/ingredient';
import { AuthService } from './../../providers/auth';
import { ShoppingListService } from './../../providers/shopping-list';

@IonicPage()
@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingList implements OnInit {
  ingredients: Ingredient[];

  constructor(private navCtrl: NavController,
              private authService: AuthService,
              private slService: ShoppingListService,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private popoverCtrl: PopoverController) {
  }

  ionViewCanEnter() {
    return this.authService.isTokenExists();
  }

  ngOnInit() {
    this.ingredients = this.slService.ingredients;
    this.slService.loadUserIngredients();
  }

  onAddIngredient() {
    this.navCtrl.push('EditShoppingList', {mode: 'new'});
  }

  onEdit(ingredient: Ingredient, index:number) {
    this.navCtrl.push('EditShoppingList', {mode: 'edit', ingredient: ingredient, index: index});
  }

  onDelete(index: number) {
    this.alertCtrl.create({
      title: 'Are you sure?',
      buttons: [
        {
          text: 'Remove',
          handler: () => {
            this.slService.removeIngredient(index);
            this.toastCtrl.create({
              message: `${this.ingredients[index].name} removed successfully`,
              duration: 1500
            }).present();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).present();
  }

  onPopover(event) {
    this.popoverCtrl.create('Popover').present({
      ev: event
    });
  }
}
