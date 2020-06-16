import { NgModule, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppDirectionsMapDirective } from './app-directions-map.directive';
import { AgmCoreModule } from '@agm/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LocationComponent } from './app/location.components';
import { createCustomElement } from '@angular/elements';
import { HttpClientModule } from '@angular/common/http';
import {FlipperPaymentCardModule} from '@enexus/payment-card';
import {MatSnackBarModule} from '@angular/material/snack-bar';


@NgModule({
  imports: [BrowserModule, 
    NgbModule, 
    BrowserAnimationsModule, 
    HttpClientModule,
    FlipperPaymentCardModule, 
    MatSnackBarModule,
    AgmCoreModule.forRoot({
    apiKey: 'AIzaSyDJ-10ywLsARBlXZnKxnKrc2eHIlwl0YVg'
  })
],
  providers: [],
  declarations: [AppDirectionsMapDirective, LocationComponent],
  entryComponents: [LocationComponent],
})

export class AppModule {

  constructor(private injector: Injector) {
    const customElement = createCustomElement(LocationComponent, { injector });
    customElements.define('payment-sdk', customElement);
  }
  ngDoBootstrap() { }
}
