import { AppRoutingModule } from './app-routing.module';

// Origins Components
import { AppComponent } from './app.component';
import { LightboxComponent } from './components/lightbox/lightbox.component';
import { MenuComponent } from './components/menu/menu.component';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { SearchResultsGridComponent } from './components/search-results-grid/search-results-grid.component';
import { SearchResultsMasonryComponent } from './components/search-results-masonry/search-results-masonry.component';
import { SearchResultsMasonryItemComponent } from './components/search-results-masonry-item/search-results-masonry-item.component';
import { SearchResultsGridItemComponent } from './components/search-results-grid-item/search-results-grid-item.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

// Origins ngrx
import { SearchEffects } from './store/effects';
import { originsReducer } from './store/reducer';

// Other Components
import { NgxMasonryModule } from 'ngx-masonry';

// Angular
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// ngrx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// Angular Material
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { ImageLightboxComponent } from './components/image-lightbox/image-lightbox.component';

@NgModule({
  declarations: [
    AppComponent,
    LightboxComponent,
    SearchResultsGridComponent,
    SearchResultsMasonryComponent,
    SearchResultsMasonryItemComponent,
    SearchResultsGridItemComponent,
    MenuComponent,
    ToolbarComponent,
    SearchBoxComponent,
    ImageLightboxComponent,
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

    // Angular Material
    MatIconModule,
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
    StoreModule.forRoot({ originsReducer }, {}),
    EffectsModule.forRoot([SearchEffects]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
