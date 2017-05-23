import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditRecipe } from './edit-recipe';

@NgModule({
  declarations: [
    EditRecipe,
  ],
  imports: [
    IonicPageModule.forChild(EditRecipe),
  ],
  exports: [
    EditRecipe
  ]
})
export class EditRecipeModule {}
