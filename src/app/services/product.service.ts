import {Injectable} from '@angular/core';
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

  constructor(private httpClient: HttpClient) {
  }

  getProductList(categoryId: number): Observable<Product[]> {
    const searchUrl = `${this.baseProductUrl}/search/findByCategoryId?id=${categoryId}`;

    // return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
    //   map(response => response._embedded.products)
    // );
    return this.getProducts(searchUrl);
  }

  getProductListPaginate(thePage: number,
                         thePageSize: number,
                         categoryId: number): Observable<GetResponseProducts> {

    const searchUrl = `${this.baseProductUrl}/search/findByCategoryId?id=${categoryId}`
      + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseCategories>(this.baseCategoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  searchProducts(keyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseProductUrl}/search/findByNameContaining?name=${keyword}`;

    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(thePage: number,
                         thePageSize: number,
                         keyword: string): Observable<GetResponseProducts> {

    const searchUrl = `${this.baseProductUrl}/search/findByNameContaining?name=${keyword}`
      + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProduct(productId: number): Observable<Product> {
    const productUrl = `${this.baseProductUrl}/${productId}`;

    return this.httpClient.get<Product>(productUrl);
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  };
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number // current page number
  };
}

interface GetResponseCategories {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
