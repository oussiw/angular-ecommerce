import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Country} from '../common/country';
import {State} from '../common/state';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  private countriesUrl: string = 'http://localhost:8080/api/countries';
  private statesUrl: string = 'http://localhost:8080/api/states';

  getCountries(): Observable<Country[]>{
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStates(countryCode: string): Observable<State[]>{
    // create the search url
    const searchUrl: string = `${this.statesUrl}/search/findByCountryCode?code=${countryCode}`;

    return this.httpClient.get<GetResponseStates>(searchUrl).pipe(
      map(response => response._embedded.states)
    );
  }

  constructor(private httpClient: HttpClient) { }

  getCreditCardMonths(startMonth: number): Observable <number[]> {
    let data: number[] = [];
    for (let month = startMonth; month <= 12; month++){
      data.push(month);
    }
    return of(data);
  }

  getCreditCardYears(): Observable <number[]>{
    let data: number[] = [];
    // start from the current year
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;
    for (let year = startYear; year <= endYear; year++){
      data.push(year);
    }
    return of(data);
  }
}

interface GetResponseCountries{
  _embedded: {
    countries: Country[];
  };
}

interface GetResponseStates{
  _embedded: {
    states: State[];
  };
}
