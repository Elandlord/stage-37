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
  selectedProductSettings: any = {};
  toggledProductSettings: any = [];

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

  addPositionToSurgery(surgery_id, position_id)
  {
      const surgery_position_index = _.findIndex(this.selectedPositionsPerSurgery,
          {
            'surgery_id': surgery_id,
            'position_id': position_id
          });

      if (surgery_position_index === -1)
      {
          const surgery_position = {
              'surgery_id': surgery_id,
              'position_id': position_id,
              'surface_area': 0
          };

          // if surgery + position combination doesn't exist, push to array
          this.selectedPositionsPerSurgery.push(surgery_position);
      }else
      {
        // if surgery + position combination already exist, pop from array
        this.selectedPositionsPerSurgery.pop(surgery_position_index);
      }

      console.log(this.selectedPositionsPerSurgery);
  }

  addSurfaceToSurgeryPosition(surgery_id, position_id, event: any)
  {
      const surgery_position_index = _.findIndex(this.selectedPositionsPerSurgery,
          {
            'surgery_id': surgery_id,
            'position_id': position_id
          });

      this.selectedPositionsPerSurgery[surgery_position_index].surface_area = parseFloat(event.target.value);
      console.log(this.selectedPositionsPerSurgery);
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

  combineProduct()
  {
      this.model.combined_with = this.combinedProductsArray;
      this.create();
  }

  create()
  {
      this.apiService.post('products', this.model).then(() => {
          this.getProducts();
          this.hideOverlay();
          this.toastr.success('Product succesvol toegevoegd.', 'Gelukt!');
      }).catch(() => {
          this.toastr.warning('Toevoegen mislukt. Controleer of de velden correct gevuld zijn..', 'Oeps!');
      });
  }

  createSurgeryPosition(product_id)
  {
    const surgery_position = {
      'surgery_position': this.selectedPositionsPerSurgery
    };
    this.apiService.post('product/' + product_id + '/surgeryposition', surgery_position).then(() => {
        this.getProducts();
        this.hideOverlay();
        this.toastr.success('Operaties en posities succesvol aangepast', 'Gelukt!');
    }).catch(() => {
        this.toastr.warning('Aanpassen mislukt. Controleer of de velden correct gevuld zijn..', 'Oeps!');
    });
  }

  createCountries(product_id)
  {
    const saveCountries = {
      'countries': this.selectedCountries
    };

    this.apiService.post('product/' + product_id + '/countries', saveCountries).then(() => {
        this.getProducts();
        this.hideOverlay();
        this.toastr.success('Landen succesvol aangepast', 'Gelukt!');
    }).catch(() => {
        this.toastr.warning('Aanpassen mislukt. Controleer of de velden correct gevuld zijn..', 'Oeps!');
    });
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

    // fill unselectedCountries array with all countries
    _.forEach(this.countries, (country) => this.unselectedCountries.push(country.id));

    // select countries from back-end call
    _.forEach(this.selectedProduct.countries.data, (country) => {
        this.selectCountry(country);
    });
  }

  fillProductSettings()
  {
    this.selectedProductSettings = _.filter(this.productSettings, (productsetting) => {
      return productsetting.product_id === this.selectedProduct.id;
    });
  }

  fillSurgeryPositions()
  {
    _.forEach(this.selectedProduct.position_product_surgery.data, (surgery) => {
      if(this.selectedSurgeries.indexOf(surgery.surgery_id) === -1)
      {
        this.selectedSurgeries.push(surgery.surgery_id);
      }
    });

    console.log(this.selectedSurgeries);
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
      this.apiService.get('products?include=combined_products').then((products) => {
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
    this.apiService.get('product/' + id + '?include=countries,settings,combined_products,position_product_surgery').then( (product) => {
        this.selectedProduct = product;
        this.fillProductSettings();
        this.fillCountries();
        this.fillSurgeryPositions();
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
    }).catch(() => {
        this.toastr.warning('Aanpassen mislukt. Controleer of de velden correct gevuld zijn..', 'Oeps!');
    });
  }

  reset()
  {
    // Product
    this.selectedProduct = {};
    this.combinedProductsArray = [];

    // Productsettings
    this.selectedProductSettings = {};
    this.toggledProductSettings = [];

    // Countries
    this.selectedCountries = [];
    this.unselectedCountries = [];

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
    _.pull(this.unselectedCountries, id);
    this.selectedCountries.push(id);
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

  toggleProductSetting(id)
  {
      const indexArray = this.toggledProductSettings.indexOf(id);
      if (indexArray === -1){
          this.toggledProductSettings.push(id);
      }else{
          this.toggledProductSettings.pop(indexArray);
      }
  }

  unselectCountry(id)
  {
    _.pull(this.selectedCountries, id);
    this.unselectedCountries.push(id);
  }

  updateCountries(id)
  {
    this.selectedProduct.countries = this.selectedCountries;
    this.createCountries(id);
    this.reset();
  }

  updateProduct(id)
  {
    this.selectedProduct.combine_with = this.combinedProductsArray;
    this.update(id);
  }

  updateProductSettings(id)
  {
    this.selectedProduct.settings = this.toggledProductSettings;
    this.update(id);
  }

  updateSurgeries(id)
  {
      this.createSurgeryPosition(id);
  }

  selectAllCountries()
  {
      _.filter(this.countries, (country) => {
        return this.selectedCountries.indexOf(country.id) === -1;
      }).forEach((country) => {
        this.selectCountry(country.id);
      });
  }

  deselectAllCountries()
  {
      _.filter(this.countries, (country) => {
          return this.selectedCountries.indexOf(country.id) !== -1;
      }).forEach((country) => {
          this.unselectCountry(country.id);
      });
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
    this.overlayCountry = true;
  }

  viewProductSettings(id)
  {
    this.reset();
    this.loadProduct(id);
    this.overlaySettings = true;
  }
}
