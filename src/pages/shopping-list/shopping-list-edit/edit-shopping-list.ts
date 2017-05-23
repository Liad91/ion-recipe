import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IonicPage, NavParams } from 'ionic-angular';

import { ShoppingListService } from './../../../providers/shopping-list';
import { Ingredient } from './../../../models/ingredient';
import { PositiveNumbersValidator } from './../../../validators/positive-numbers';
import { AuthService } from './../../../providers/auth';

@IonicPage()
@Component({
  selector: 'page-edit-shopping-list',
  templateUrl: 'edit-shopping-list.html',
})
export class EditShoppingList implements OnInit {
  mode: string;
  ingredient: Ingredient;
  ingredientIndex: number;
  form: FormGroup;

  constructor(private navParams: NavParams, private slService: ShoppingListService, private authService: AuthService) {}

  ngOnInit() {
    this.mode = this.navParams.get('mode');

    if (this.mode === 'edit') {
      this.ingredientIndex = this.navParams.get('index');
      this.ingredient = this.navParams.get('ingredient');
    }
    this.initializeForm();
  }

  private initializeForm() {
    let name = null;
    let amount = null;

    if (this.ingredient) {
      name = this.ingredient.name;
      amount = this.ingredient.amount;
    }
    this.form = new FormGroup({
      'name': new FormControl(name, Validators.required),
      'amount': new FormControl(amount, [Validators.required, PositiveNumbersValidator])
    });
  }

  onSubmit() {
    const ingredient = new Ingredient(this.form.controls.name.value, +this.form.controls.amount.value);

    if (this.mode === 'new') {
      this.slService.addIngredient(ingredient);
    }
    else {
      this.slService.updateIngredient(ingredient, this.ingredientIndex);
    }
  }

  onReset() {
    this.form.reset();
  }
}
