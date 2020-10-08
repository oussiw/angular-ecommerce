import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {Product} from '../../common/product';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  previousCategoryId: number = 1;
  currentCategoryId: number = 1;
  currentCategoryName: string = 'Books';
  searchMode: boolean = false;

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword: string = null;
  constructor(private productService: ProductService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProduct();
    });
  }

  listProduct(): void {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleListProducts(): void {
    // check if id param is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the id end convert it to a number
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');

      // get the "name" param string
      this.currentCategoryName = this.route.snapshot.paramMap.get('name');
    } else {
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }
    //
    // Check if we have a different category than previous
    // Note: Angular will reuse a component is currently being viewed
    //
    // If we have a different category id than the previous then set thePageNumber back to 1
    if (this.previousCategoryId !== this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentId= ${this.currentCategoryId} / previousId= ${this.previousCategoryId} / thePageNumber= ${this.thePageNumber}`);

    this.productService.getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId)
                        .subscribe(this.processResult());
  }

  private processResult(): (data) => void {
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  private handleSearchProducts(): void {
    const keyword = this.route.snapshot.paramMap.get('keyword');

    // If we have a different keyword than the previous then set thePageNumber back to 1
    if (this.previousKeyword !== keyword ){
      this.thePageNumber = 1;
    }
    this.previousKeyword = keyword;
    console.log(`keyword=${keyword} / pageNumber= ${this.thePageNumber}`);
    this.productService.searchProductsPaginate(this.thePageNumber - 1, this.thePageSize, keyword).subscribe(this.processResult());
  }

  updatePageSize(pageSize: number): void{
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProduct();
  }
}
