import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Flight} from '../data-types/flight.type';
import {Journey} from '../data-types/journey.type';
import {Price} from '../data-types/price.type';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class GetDataService {

  constructor(private http : HttpClient) {}

  createUrlPath(name) {
    return `../../assets/data/${name}-data.json`;
  }

  getFlights() : Observable < Flight[] > {
    return this.http.get < Flight[] > (this.createUrlPath('flight'));
  }

  getJourneys() : Observable < Journey[] > {
    return this.http.get < Journey[] > (this.createUrlPath('journeys'));
  }

  getPrices() : Observable < Price[] > {
    return this.http.get < Price[] > (this.createUrlPath('mileage-price'));
  }
}