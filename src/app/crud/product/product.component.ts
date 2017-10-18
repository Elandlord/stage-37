import {Component, OnInit, ViewContainerRef} from '@angular/core';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { Country } from '../../models/country/country';
import { Position } from '../../models/position/position';
import { Product } from '../../models/product/product';
import {Surgery } from '../../models/surgery/surgery';
import { ProductLine } from '../../models/product-line/product-line';
import {ApiService} from '../../core/api.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  // Loading
  loading = false;

  // Title
  title = 'Producten';

  // Model for create
  model: any = {};

  // Overlays
  overlayOpen = false;
  overlaySelected = false;
  overlayCountry = false;
  overlaySurgery = false;

  // Countries
  countries: Country[];
  selectedCountries: any = [];
  unselectedCountries: any = [];
  allCountriesSelected = false;

  // Positions
  positions: Position[];

  // Productlines
  productLines: ProductLine[];

  // Products
  products: Product[];
  selectedCombinedProducts: any = {};
  combinedProductsArray: any = [];
  selectedProduct: any = {};

  // product from search
  searchProducts: any = {};

  // Surgeries
  surgeries: Surgery[];
  selectedSurgeries: any = [];
  selectedPositionsPerSurgery: any = [];

  constructor(private apiService: ApiService, public toastr: ToastsManager, vcr: ViewContainerRef) {
      this.toastr.setRootViewContainerRef(vcr);
  }

  addItem()
  {
    this.overlayOpen = true;
  }

  addSurgery(id)
  {
    const indexArray = this.selectedSurgeries.indexOf(id);
    if (indexArray === -1){
        this.selectedSurgeries.push(id);
    }else{
        this.selectedSurgeries.pop(indexArray);
    }

    console.log(this.selectedSurgeries);
  }

  create()
  {
      this.apiService.post('products', this.model).then(() => {
          this.getProducts();
          this.overlayOpen = false;
          this.toastr.success('Product succesvol toegevoegd.', 'Gelukt!');
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
      this.toastr.info('Product succesvol verwijderd.', 'Gelukt!');
    });
  }

  fillCountries()
  {
    // to-do: fill selectedCountry array with data from API call. Currently not getting country data per product.
    for (const country of this.countries)
    {
      this.unselectedCountries.push(country.id);
    }

  }

  getCountries()
  {
    this.apiService.get('countries').then((countries) => {
        this.countries = countries;
    });
  }

  getCountryNameById(id)
  {
    for (const country of this.countries)
    {
      if (country.id === id)
      {
        return country.name;
      }
    }
  }

  getPositions()
  {
    this.apiService.get('positions/').then((positions) => {
      this.positions = positions;
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

  getProductLineNameById(id)
  {
    if (this.productLines !== undefined)
    {
        for (const productLine of this.productLines)
        {
            if (productLine.id === id)
            {
                return productLine.name;
            }
        }
    }
    return 'Geen';
  }

  getProductLines()
  {
    this.apiService.get('productlines').then((productlines) => {
        this.productLines = productlines;
    });
  }

  getSurgeries()
  {
    this.apiService.get('surgeries').then((surgeries) => {
        this.surgeries = surgeries;
    });
  }

  hideOverlay()
  {
    this.overlayOpen = false;
    this.overlaySelected = false;
    this.overlayCountry = false;
    this.overlaySurgery = false;
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
    this.getPositions();
    this.getSurgeries();
  }

  update(id)
  {
    this.apiService.update('product', this.selectedProduct , id).then(() => {
      this.getProducts();
      this.hideOverlay();
      this.toastr.success('Product succesvol aangepast.', 'Gelukt!');
    });
  }

  reset()
  {
    // Product
    this.selectedProduct = {};

    // Countries
    this.selectedCountries = [];
    this.unselectedCountries = [];
    this.allCountriesSelected = false;

    // Surgeries
    this.selectedSurgeries = [];
  }

  setSearchParam(event: any)
  {

      for (let i = 0; i < this.products.length - 1; i++)
      {
        if (this.products[i].name.match(event.target.value))
        {
          this.searchProducts[i] = this.products[i];
        }else{
          this.searchProducts[i] = {};
        }
      }

      console.log(this.searchProducts);
      this.products = this.searchProducts;
  }

  selectCountry(id)
  {
    this.unselectedCountries.splice(this.unselectedCountries.indexOf(id), 1);
    this.selectedCountries.push(id);
  }

  unselectCountry(id)
  {
    this.selectedCountries.splice(this.selectedCountries.indexOf(id), 1);
    this.unselectedCountries.push(id);
  }

  updateCountries(id)
  {
    this.selectedProduct.countries = this.selectedCountries;
    this.update(id);
    this.reset();
  }

  updateSurgeries(id)
  {
      console.log(this.selectedPositionsPerSurgery);
  }

  selectAllCountries() {
    this.allCountriesSelected = !this.allCountriesSelected;
    if (this.allCountriesSelected)
    {
        for (const country of this.countries)
        {
            if (this.selectedCountries.indexOf(country.id) === -1)
            {
                this.selectCountry(country.id);
            }
        }
    }else
    {
        for (const country of this.countries)
        {
          if (this.selectedCountries.indexOf(country.id) !== -1)
          {
            this.unselectCountry(country.id);
          }
        }
    }

  }

  surgeryInArray(id)
  {
    if (this.selectedSurgeries.indexOf(id) === -1)
    {
      return false;
    }
    return true;
  }

  viewDetails(id)
  {
    this.getProduct(id);
  }

  viewSurgery(id)
  {
    this.reset();
    this.loadProduct(id);
    this.overlaySurgery = true;
  }

  viewCountries(id)
  {
    this.reset();
    this.loadProduct(id);
    this.fillCountries();
    this.overlayCountry = true;
  }
}
