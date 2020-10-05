import { Component, OnInit } from '@angular/core';
import {ProductService} from '../../services/product.service';
import {Product} from '../../common/product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-table.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  constructor(private productService: ProductService) { }

  products: Product[];
  ngOnInit(): void {
    this.listProduct();
  }

  listProduct(): void {
    this.productService.getProductList().subscribe(
      data => {
        this.products = data;
      }
    );
  }
}
