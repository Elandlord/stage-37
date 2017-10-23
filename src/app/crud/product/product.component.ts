import {Component, OnInit, ViewContainerRef} from '@angular/core';

import * as _ from 'lodash';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { Country } from '../../models/country/country';
import { Position } from '../../models/position/position';
import { Product } from '../../models/product/product';
import {Surgery } from '../../models/surgery/surgery';
import { ProductLine } from '../../models/product-line/product-line';
import { ProductSetting } from '../../models/product-setting/product-setting';
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
  overlaySettings = false;

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
  referenceProducts: Product[];
  selectedCombinedProducts: any = {};
  combinedProductsArray: any = [];
  selectedProduct: any = {};

  // product from search
  searchProducts: Product[];

  // Productsetings
  productSettings: ProductSetting[];

  // Surgeries
  surgeries: Surgery[];
  selectedSurgeries: any = [];
  selectedPositionsPerSurgery: any = {};

  constructor(private apiService: ApiService, public toastr: ToastsManager, vcr: ViewContainerRef) {
      this.toastr.setRootViewContainerRef(vcr);
  }

  addItem()
  {
    this.overlayOpen = true;
  }

  addPositionToSurgery(surgery_id, position_id)
  {
    if (this.selectedPositionsPerSurgery[surgery_id] === undefined)
    {
        this.selectedPositionsPerSurgery[surgery_id] = {
            positions: {}
        };
    }
    this.selectedPositionsPerSurgery[surgery_id].positions[position_id] = new Position(position_id);
  }

  addSurfaceToSurgeryPosition(surgery_id, position_id, event: any)
  {
    this.selectedPositionsPerSurgery[surgery_id].positions[position_id].surface_area = event.target.value;
  }

  toggleCombinedProduct(id)
  {
    const indexArray = this.combinedProductsArray.indexOf(id);
    if (indexArray === -1)
    {
        this.combinedProductsArray.push(id);
    }else
    {
        this.combinedProductsArray.pop(indexArray);
    }
    console.log(this.combinedProductsArray);
  }

  toggleSurgery(id)
  {
    const indexArray = this.selectedSurgeries.indexOf(id);
    if (indexArray === -1){
        this.selectedSurgeries.push(id);
    }else{
        this.selectedSurgeries.pop(indexArray);
    }
  }

  checkProductCombined(id)
  {
    const indexArray = this.combinedProductsArray.indexOf(id);
    if (indexArray === -1)
    {
      return '';
    }
    return 'checked';
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

  fillCombinedProducts()
  {
    _.forEach(this.products, (product) => {
      _.forEach(product.combine_with, (combinedProduct) => {
          this.combinedProductsArray.push(combinedProduct);
      });
    });
  }

  fillCountries()
  {
    // to-do: fill selectedCountry array with data from API call. Currently not getting country data per product.
    _.forEach(this.countries, (country) => this.unselectedCountries.push(country.id));
  }

  fillProductSettings()
  {

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
    this.apiService.get('positions').then((positions) => {
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
          this.referenceProducts = products;
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

  getProductSettings()
  {
    this.apiService.get('productsettings').then((productsettings) => {
        this.productSettings = productsettings;
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
    this.overlaySettings = false;
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
    this.getProductSettings();
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
    this.combinedProductsArray = [];

    // Countries
    this.selectedCountries = [];
    this.unselectedCountries = [];
    this.allCountriesSelected = false;

    // Surgeries
    this.selectedSurgeries = [];
  }

  setSearchParam(event: any)
  {
      this.searchProducts = _.filter(this.referenceProducts, (product) => {
        return product.name.toLowerCase().match(event.target.value.toLowerCase());
      });

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

  updateProductSettings(id)
  {

  }

  updateSurgeries(id)
  {
    // TO-DO POST values to DB via update
      console.log(this.selectedPositionsPerSurgery);
  }

  selectAllCountries() {
    this.allCountriesSelected = !this.allCountriesSelected;

    if (this.allCountriesSelected)
    {
        _.filter(this.countries, (country) => {
          return this.selectedCountries.indexOf(country.id) === -1;
        }).forEach((country) => {
          this.selectCountry(country.id);
        });
    }else
    {
        _.filter(this.countries, (country) => {
            return this.selectedCountries.indexOf(country.id) !== -1;
        }).forEach((country) => {
            this.unselectCountry(country.id);
        });
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
    this.reset();
    this.fillCombinedProducts();
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

  viewProductSettings(id)
  {
    this.reset();
    this.loadProduct(id);
    this.fillProductSettings();
    this.overlaySettings = true;
  }
}
