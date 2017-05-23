import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tabs',
  template: `
    <ion-tabs color="primary" tabsPlacement="top">
      <ion-tab root="Recipes" tabIcon="restaurant"></ion-tab>
      <ion-tab root="ShoppingList" tabIcon="basket"></ion-tab>
    </ion-tabs>
  `,
})
export class Tabs {}
