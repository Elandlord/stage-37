import { Component, OnInit } from '@angular/core';

import { Product } from '../../models/product/product';
import { ProductLine } from "../../models/product-line/product-line";
import {ApiService} from '../../core/api.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  loading = false;
  overlayOpen = false;
  overlaySelected = false;

  model: any = {};

  title = 'Producten';

  products: Product[];
  productLines: ProductLine[];

  selectedProduct: any = {};


  constructor(private apiService: ApiService) { }

  addItem()
  {
    this.overlayOpen = true;
  }

  create()
  {
      this.apiService.post('products', this.model).then(() => {
          this.getProducts();
          this.overlayOpen = false;
      });
  }
  
  destroy(id)
  {
    this.apiService.delete('product', id).then(() => {
      this.getProducts();
    })
  }

  getProduct(id)
  {
    this.apiService.get('product/' + id).then( (product) => {
        this.selectedProduct = product;
        this.overlaySelected = true;
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

  getProductLines()
  {
    this.apiService.get('productlines').then((productlines) => {
        this.productLines = productlines;
    });
  }

  hideOverlay()
  {
    this.overlayOpen = false;
    this.overlaySelected = false;
  }

  ngOnInit(): void {
    this.getProducts();
    this.getProductLines();
  }

  update(id)
  {
    this.apiService.update('product', this.selectedProduct ,id).then(() => {
      this.getProducts();
      this.hideOverlay();
    });
  }

  viewDetails(id)
  {
    this.getProduct(id);
  }
}
