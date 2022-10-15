import { AppRoutingModule } from './app-routing.module';

// Origins Components
import { AppComponent } from './app.component';
import { MenuComponent } from './shared/components/menu/menu.component';
import { SearchBoxComponent } from './shared/components/search-box/search-box.component';
import { SearchResultsGridComponent } from './items/components/search-results-grid/search-results-grid.component';
import { SearchResultsGridItemComponent } from './items/components/search-results-grid-item/search-results-grid-item.component';
import { ToolbarComponent } from './shared/components/toolbar/toolbar.component';

// Origins ngrx
import { itemsReducer } from './items/store/items.reducers';
import { collectionsReducer } from './collections/store/collections.reducers';
import { ItemsEffects } from './items/store/items.effects';
import { CollectionsEffects } from './collections/store/collections.effects';
// import { SearchEffects } from './store/effects';
// import { originsReducer } from './store/reducer';


// Other Components
import { NgxMasonryModule } from 'ngx-masonry';

// Angular
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// ngrx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { ImageLightboxComponent } from './items/components/image-lightbox/image-lightbox.component';
import { ItemsPanelComponent } from './items/components/items-panel/items-panel.component';
import { CollectionsPanelComponent } from './collections/components/collections-panel/collections-panel.component';
import { NotFoundPanelComponent } from './shared/components/not-found-panel/not-found-panel.component';
import { CollectionListComponent } from './collections/components/collection-list/collection-list.component';
import { CollectionListItemComponent } from './collections/components/collection-list-item/collection-list-item.component';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { AddEditCollectionComponent } from './collections/components/add-edit-collection/add-edit-collection.component';
import { statusReducer } from './status/store/status.reducers';


@NgModule({
  declarations: [
    AppComponent,
    SearchResultsGridComponent,
    SearchResultsGridItemComponent,
    MenuComponent,
    ToolbarComponent,
    SearchBoxComponent,
    ImageLightboxComponent,
    ItemsPanelComponent,
    CollectionsPanelComponent,
    NotFoundPanelComponent,
    CollectionListComponent,
    CollectionListItemComponent,
    ConfirmDialogComponent,
    AddEditCollectionComponent,
  ],
  imports: [
    AppRoutingModule,

    // Other Components
    NgxMasonryModule,

    // Angular
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,

    // Angular Material
    MatIconModule,
    MatListModule,
    MatSliderModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
    MatDialogModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatGridListModule,
    MatChipsModule,
    MatMenuModule,

    // Origins ngrx
    StoreModule.forRoot({ items: itemsReducer, collections: collectionsReducer, status: statusReducer }, {}),
    EffectsModule.forRoot([ ItemsEffects, CollectionsEffects]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
