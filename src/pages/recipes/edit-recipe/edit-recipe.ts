import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { IonicPage, NavParams, ActionSheetController, AlertController, ToastController } from 'ionic-angular';

import { Recipe } from './../../../models/recipe';
import { RecipesService } from './../../../providers/recipes';
import { PositiveNumbersValidator, RegEx } from './../../../validators/positive-numbers';
import { AuthService } from './../../../providers/auth';

@IonicPage()
@Component({
  selector: 'page-edit-recipe',
  templateUrl: 'edit-recipe.html',
})
export class EditRecipe implements OnInit {
  recipe: Recipe;
  recipeIndex: number;
  mode: string;
  selectOptions = ['Easy', 'Medium', 'Hard'];
  form: FormGroup;

  constructor(private navParams: NavParams,
              private actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private recipesService: RecipesService,
              private authService: AuthService) {}

  ngOnInit() {
    this.mode = this.navParams.get('mode');

    if (this.mode === 'edit') {
      this.recipe = this.navParams.get('recipe');
      this.recipeIndex = this.navParams.get('index');
    }
    this.initializeForm();
  }

  private initializeForm() {
    let title = null;
    let description = null;
    let difficulty = this.selectOptions[0];
    let imgUrl = null;
    let ingredients: any = [
      {name: null, amount: null},
      {name: null, amount: null}
    ];

    if (this.recipe) {
      title = this.recipe.title;
      description = this.recipe.description;
      difficulty = this.recipe.difficulty;
      imgUrl = this.recipe.imgUrl;
      ingredients = this.recipe.ingredients;
    }

    ingredients = ingredients.map(ingredient => {
      return new FormGroup({
        'name': new FormControl(ingredient.name, Validators.required),
        'amount': new FormControl(ingredient.amount, [Validators.required, PositiveNumbersValidator])
      })
    });

    this.form = new FormGroup({
      "title": new FormControl(title, Validators.required),
      "description": new FormControl(description, Validators.required),
      "difficulty": new FormControl(difficulty, Validators.required),
      "imgUrl": new FormControl(imgUrl),
      "ingredients": new FormArray(ingredients, Validators.required)
    });
  }

  private removeAllIngredientsAlert() {
    return this.alertCtrl.create({
      title: 'Are you sure?',
      buttons: [
        {
          text: 'Remove',
          handler: () => {
            const formArray = <FormArray>this.form.get('ingredients');
            const length = formArray.length;

            for (let i = length - 1; i >= 0; i--) {
              formArray.removeAt(i);
            }
            this.displayToast('All ingredients were removed').present();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
  }

  private displayToast(message: string) {
    return this.toastCtrl.create({
      message: message,
      duration: 1500
    });
  }

  private createNewIngredientAlert() {
    return this.alertCtrl.create({
      title: 'Add Ingredient',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        },
        {
          name: 'amount',
          type: 'number',
          placeholder: 'Amount'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: data => {
            if (data.name.trim() === '' || data.name === null) {
              this.displayToast('Please enter a valid name!').present();
              return;
            }
            else if (!RegEx.test(data.amount)) {
              this.displayToast('Please enter a valid amount!').present();
              return;
            }
            (<FormArray>this.form.get('ingredients')).push(new FormGroup({
              'name': new FormControl(data.name, Validators.required),
              'amount': new FormControl(data.amount, [Validators.required, PositiveNumbersValidator])
            }))
            this.displayToast('Item added successfully!').present();
          }
        }
      ]
    });
  }

  onManageIngredients() {
    const actionSheet =this.actionSheetCtrl.create({
      title: 'What do you want to do?',
      buttons: [
        {
          text: 'Add Ingredient',
          handler: () => {
            this.createNewIngredientAlert().present();
          }
        },
        {
          text: 'Remove all Ingredients',
          role: 'destructive',
          handler: () => {
            if ((<FormArray>this.form.get('ingredients')).length > 0) {
              this.removeAllIngredientsAlert().present();
            }
            else {
              this.displayToast('There is no ingredients to remove').present();
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    actionSheet.present();
  }

  onRemoveIngredient(index: number) {
    (<FormArray>this.form.get('ingredients')).removeAt(index);
  }

  onSubmit() {
    if (this.authService.isTokenExists()) {
      if (this.mode === 'new') {
        this.recipesService.addRecipe(this.form.value);
      }
      else {
        this.form.value._id = this.recipe._id;
        this.recipesService.updateRecipe(this.form.value, this.recipeIndex);
      }
    }
  }
}
