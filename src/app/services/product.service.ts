import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product} from '../common/product';
import {map} from 'rxjs/operators';
import {ProductCategory} from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseProductUrl = 'http://localhost:8080/api/products';
  private baseCategoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) { }

  getProductList(categoryId: number): Observable<Product[]> {
    const searchUrl = `${this.baseProductUrl}/search/findByCategoryId?id=${categoryId}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseCategories>(this.baseCategoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  };
}

interface GetResponseCategories {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
