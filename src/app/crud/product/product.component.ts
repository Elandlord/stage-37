import { Component, OnInit } from '@angular/core';

import { Product } from '../../models/product/product';
import {ApiService} from '../../core/api.service';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  loading = false;

  title = 'Producten';
  products: Product[];
  chosenProduct: Product;

  constructor(private apiService: ApiService) { }


  getProduct(code)
  {
    this.loading = true;
    this.apiService.get('product/' + code).then( (product) => {
        this.chosenProduct = product[0];
        this.loading = false;
    });
  }

  getProducts()
  {
    this.loading = true;
      this.apiService.get('products').then((products) => {
          this.products = products;
          this.loading = false;
      });
  }

  ngOnInit(): void {
    this.getProducts();
  }
}
