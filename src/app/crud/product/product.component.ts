import { Component, OnInit } from '@angular/core';

import { Product } from '../../models/product/product';
import {ApiService} from '../../core/api.service';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  title = 'Producten';
  products: Product[];

  constructor(private apiService: ApiService) { }

  getProducts()
  {
      this.apiService.get('products').then((products) => {
          this.products = products;
      });
  }

  ngOnInit(): void {
    this.getProducts();
  }

  viewDetails(id){
    console.log(id);
  }

    viewAdd(){

    }

}
