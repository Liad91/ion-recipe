import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Recipes } from './recipes';

@NgModule({
  declarations: [
    Recipes,
  ],
  imports: [
    IonicPageModule.forChild(Recipes),
  ],
  exports: [
    Recipes
  ]
})
export class RecipesModule {}
