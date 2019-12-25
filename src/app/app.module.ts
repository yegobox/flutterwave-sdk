import { NgModule, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppDirectionsMapDirective } from './app-directions-map.directive';
import { AgmCoreModule } from '@agm/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LocationComponent } from './app/location.components';
import { createCustomElement } from '@angular/elements';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [BrowserModule, NgbModule, BrowserAnimationsModule, HttpClientModule, AgmCoreModule.forRoot({
    apiKey: 'AIzaSyDJ-10ywLsARBlXZnKxnKrc2eHIlwl0YVg'
  })],
  providers: [],
  declarations: [AppDirectionsMapDirective, LocationComponent],
  // bootstrap: [AppComponent],
  entryComponents: [LocationComponent],
})

export class AppModule {
  // constructor(injector: Injector) {
  //   // Convert `PopupComponent` to a custom element.
  //   const PopupElement = createCustomElement(LocationComponent, { injector });
  //   // Register the custom element with the browser.
  //   // customElements.whenDefined
  //   customElements.define('location-buttons', PopupElement);
  // }
  constructor(private injector: Injector) {
    const customElement = createCustomElement(LocationComponent, { injector });
    customElements.define('locations-button', customElement);
  }
  ngDoBootstrap() { }
}
