import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditShoppingList } from './edit-shopping-list';

@NgModule({
  declarations: [
    EditShoppingList,
  ],
  imports: [
    IonicPageModule.forChild(EditShoppingList)
  ],
  exports: [
    EditShoppingList
  ]
})
export class EditShoppingListModule {}
