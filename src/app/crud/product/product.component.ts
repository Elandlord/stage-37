import { Component, OnInit } from '@angular/core';

import { Country } from '../../models/country/country';
import { Product } from '../../models/product/product';
import { ProductLine } from '../../models/product-line/product-line';
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
  overlayCountry = false;

  model: any = {};

  title = 'Producten';

  countries: Country[];
  products: Product[];
  productLines: ProductLine[];

  selectedProduct: any = {};
  selectedCountries: any = {};
  selectedCombinedProducts: any = {};

  countryArray: any = [];
  combinedProductsArray: any = [];
  allCountries = false;

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

  combineProduct()
  {
    for (const productIndex in this.selectedCombinedProducts)
    {
        this.combinedProductsArray.push(productIndex);
    }
    this.model.combined_with = this.combinedProductsArray;
    this.create();
  }

    destroy(id)
  {
    this.apiService.delete('product', id).then(() => {
      this.getProducts();
    });
  }

  getCountries()
  {
    this.apiService.get('countries').then((countries) => {
        this.countries = countries;
    });
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
    this.overlayCountry = false;
  }

  loadProduct(id)
  {
    this.apiService.get('product/' + id + '?include=countries').then( (product) => {
        this.selectedProduct = product;
    });
  }

  ngOnInit(): void {
    this.getProducts();
    this.getProductLines();
    this.getCountries();
  }

  update(id)
  {
    this.apiService.update('product', this.selectedProduct , id).then(() => {
      this.getProducts();
      this.hideOverlay();
    });
  }

  reset()
  {
    this.selectedProduct = {};
    this.selectedCountries = {};
    this.countryArray = [];
    this.allCountries = false;
  }

  updateCountries(id)
  {

    if (this.allCountries){
      console.log(this.selectedCountries);
      for (const countryIndex in this.countries)
      {
        this.countryArray.push(this.countries[countryIndex].id);
      }
      this.selectedProduct.countries = this.countryArray;
    }else{
      for (const countryIndex in this.selectedCountries)
      {
          this.countryArray.push(parseInt(countryIndex));
      }
      this.selectedProduct.countries = this.countryArray;
    }
      this.update(id);
    this.reset();
  }

  selectAllCountries() {
    this.allCountries = !this.allCountries;
  }

  viewDetails(id)
  {
    this.getProduct(id);
  }

  viewCountries(id)
  {
    this.loadProduct(id);
    this.overlayCountry = true;
    this.allCountries = false;
  }
}
