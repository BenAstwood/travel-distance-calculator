import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CalcTravelComponent} from './components/calc-travel/calc-travel.component';
import {HttpClientModule} from '@angular/common/http'
import {GetDataService} from './services/get-data.service';

@NgModule({
  declarations: [
    AppComponent, CalcTravelComponent
  ],
  imports: [
    BrowserModule, AppRoutingModule, HttpClientModule
  ],
  providers: [GetDataService],
  bootstrap: [AppComponent]
})
export class AppModule {}