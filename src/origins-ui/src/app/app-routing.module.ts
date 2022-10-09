import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionsPanelComponent } from './panels/collections-panel/collections-panel.component';
import { ItemsPanelComponent } from './panels/items-panel/items-panel.component';
import { NotFoundPanelComponent } from './panels/not-found-panel/not-found-panel.component';

const routes: Routes = [
  { path: '', component: ItemsPanelComponent },
  { path: 'collections', component: CollectionsPanelComponent },
  { path: '**', component: NotFoundPanelComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
