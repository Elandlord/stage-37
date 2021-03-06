import {Component, OnInit, ViewContainerRef} from '@angular/core';
import { Router } from '@angular/router';

import * as _ from 'lodash';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { Country } from '../../models/country/country';
import { Position } from '../../models/position/position';
import { Product } from '../../models/product/product';
import {Surgery } from '../../models/surgery/surgery';
import { ProductLine } from '../../models/product-line/product-line';
import { ProductSetting } from '../../models/product-setting/product-setting';
import {ApiService} from '../../core/api.service';
import {LanguageService} from '../../services/language.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

    // Loading
    loading = false;
    loadingProduct = false;

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
    overlayCombinedProducts = false;

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
    searchProducts: Product[];
    selectedCombinedProducts: any = [];
    selectedProduct: any = {};

    // Productsettings
    productSettings: ProductSetting[];
    referenceProductSettings: ProductSetting[];
    selectedProductSettings: any = [];

    // Surgeries
    surgeries: Surgery[];
    selectedSurgeries: any = [];
    selectedPositionsPerSurgery: any = [];

    constructor(private apiService: ApiService,
                public toastr: ToastsManager,
                private languageService: LanguageService,
                vcr: ViewContainerRef,
                private router: Router,) {
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
          const surgery = _.findIndex(this.selectedPositionsPerSurgery, {
            'surgery_id': surgery_id
          });

          const surgery_position = {
              'surgery_id': surgery_id,
              'position_id': position_id,
              'surface_area': 0
          };

          if ( Object.keys(this.selectedPositionsPerSurgery[surgery]).length === 1) {
              // if surgery_id is added, but doesn't contain a position yet
              this.selectedPositionsPerSurgery[surgery] = surgery_position;
          }else {
              // if surgery + position combination doesn't exist, push to array
              this.selectedPositionsPerSurgery.push(surgery_position);
          }
      }else {
        // if surgery + position combination already exist, pop from array
        this.selectedPositionsPerSurgery.splice(surgery_position_index, 1);
      }
    }

    addSurfaceToSurgeryPositionEvent(surgery_id, position_id, surface_area)
    {
      const surgery_position_index = _.findIndex(this.selectedPositionsPerSurgery,
          {
              'surgery_id': surgery_id,
              'position_id': position_id
          });

      this.selectedPositionsPerSurgery[surgery_position_index].surface_area = parseFloat(surface_area);
    }

    addSurfaceToSurgeryPosition(surgery_id, position_id, event: any)
    {
      const surgery_position_index = _.findIndex(this.selectedPositionsPerSurgery,
          {
            'surgery_id': surgery_id,
            'position_id': position_id
          });

      this.selectedPositionsPerSurgery[surgery_position_index].surface_area = parseFloat(event.target.value);
    }

    checkboxPositionInSurgery(surgery_id, position_id)
    {
      const surgery_position_index = _.findIndex(this.selectedPositionsPerSurgery,
          {
              'surgery_id': surgery_id,
              'position_id': position_id
          });

      if (surgery_position_index !== -1)
      {
          return 'checked';
      }
    }

    checkProductCombined(product_id)
    {
      const index = this.selectedCombinedProducts.indexOf(product_id);

      if (index !== -1){
          return 'checked';
      }
    }

    create()
    {
        this.apiService.post('products', this.model).then(() => {
            this.toastr.success('Product succesvol toegevoegd.', 'Gelukt!');
            this.hideOverlay();
            this.getProducts();
        }).catch(() => {
          this.toastr.warning('Toevoegen mislukt. Controleer of de velden correct gevuld zijn..', 'Oeps!');
        });
    }

    createCombinedProduct(product_id)
    {
        const combined_products = {
          'combined_products': this.selectedCombinedProducts
        };

        this.apiService.post('product/' + product_id + '/combined_products', combined_products).then(() => {
            this.toastr.success('Producten succesvol gecombineerd', 'Gelukt!');
            this.hideOverlay();
            this.getProducts();
        }).catch(() => {
          this.toastr.warning('Aanpassen mislukt. Controleer of de velden correct gevuld zijn..', 'Oeps!');
        });
    }

    createProductSettings(product_id)
    {
        const productsettings = {
          'settings': this.selectedProductSettings
        };

        this.apiService.post('product/' + product_id + '/settings', productsettings).then(() => {
            this.toastr.success('Productinstellingen succesvol aangepast', 'Gelukt!');
            this.hideOverlay();
            this.getProducts();
        }).catch(() => {
          this.toastr.warning('Aanpassen mislukt. Controleer of de velden correct gevuld zijn..', 'Oeps!');
        });
    }

    createSurgeryPosition(product_id)
    {
        const surgery_position = {
          'surgery_position': this.selectedPositionsPerSurgery
        };
        this.apiService.post('product/' + product_id + '/surgeryposition', surgery_position).then(() => {
            this.toastr.success('Operaties en posities succesvol aangepast', 'Gelukt!');
            this.hideOverlay();
            this.getProducts();
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
            this.toastr.success('Landen succesvol aangepast', 'Gelukt!');
            this.hideOverlay();
            this.getProducts();
        }).catch(() => {
            this.toastr.warning('Aanpassen mislukt. Controleer of de velden correct gevuld zijn..', 'Oeps!');
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

    destroy(id)
    {
        this.apiService.delete('product', id).then(() => {
            this.toastr.info('Product succesvol verwijderd.', 'Gelukt!');
            this.getProducts();
        });
    }

    fillCombinedProducts()
    {
        _.forEach(this.selectedProduct.combined_products.data, (combined_product) => {
          this.selectedCombinedProducts.push(combined_product.id);
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

    fillProductSettings(id)
    {
        this.productSettings = _.filter(this.referenceProductSettings, {
         'product_id': id
        });

        _.forEach(this.selectedProduct.settings.data, (productsetting) => {
          this.selectedProductSettings.push(productsetting.id);
        });
    }

    fillSurgeryPositions()
    {
        _.forEach(this.selectedProduct.position_product_surgery.data, (surgery) => {
            const surgery_index = _.findIndex(this.selectedPositionsPerSurgery, {
                'surgery_id': surgery.surgery_id,
            });

            if (surgery_index === -1){
                this.toggleSurgery(surgery.surgery_id);
            }

            this.addPositionToSurgery(surgery.surgery_id, surgery.position_id);
            this.addSurfaceToSurgeryPositionEvent(surgery.surgery_id, surgery.position_id, surgery.surface_area);
        });
    }


    getCountries()
    {
        this.apiService.get('countries').then((countries) => {
            this.countries = countries;
        });
    }

    getCountryNameById(id)
    {
        const country = _.find(this.countries, (country_iteratee) => {
            return country_iteratee.id === id;
        });

        if(country.id !== null){
            return country.name;
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
            const productline = _.find(this.productLines, (productLine) => {
                return productLine.id === id;
            });

            if(productline.id !== null){
                return productline.name;
            }
            return 'Geen';
        }
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
            this.referenceProductSettings = productsettings;
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
        this.overlayCombinedProducts = false;
    }

    init()
    {
        this.getProducts();
        this.getProductLines();
        this.getCountries();
        this.getPositions();
        this.getSurgeries();
        this.getProductSettings();
    }

    loadProduct(id)
    {
        this.loadingProduct = true;
        this.apiService.get('product/' + id + '?include=countries,settings,combined_products,position_product_surgery').then( (product) => {
            this.selectedProduct = product;
            this.fillProductSettings(id);
            this.fillCountries();
            this.fillSurgeryPositions();
            this.fillCombinedProducts();
            this.loadingProduct = false;
        });
    }

    ngOnInit(): void {
        this.init();
        this.languageService.languageChanged.subscribe( value => {
          if (value === true && this.router.url === '/products') {
              this.init();
          }
        });
    }

    positionInSurgery(surgery_id, position_id)
    {
        const surgery_position_index = _.findIndex(this.selectedPositionsPerSurgery,
          {
              'surgery_id': surgery_id,
              'position_id': position_id
          });

        if (surgery_position_index !== -1){
            return this.selectedPositionsPerSurgery[surgery_position_index].surface_area;
        }
    }

    reset()
    {
        // Product
        this.selectedProduct = {};
        this.selectedCombinedProducts = [];

        // Productsettings
        this.selectedProductSettings = [];
        this.productSettings = [];

        // Countries
        this.selectedCountries = [];
        this.unselectedCountries = [];

        // Surgeries
        this.selectedSurgeries = [];
        this.selectedPositionsPerSurgery = [];
    }

    selectAllCountries()
    {
        _.filter(this.countries, (country) => {
            return this.selectedCountries.indexOf(country.id) === -1;
        }).forEach((country) => {
            this.selectCountry(country.id);
        });
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

    surgeryInArray(id)
    {
        const index = _.findIndex(this.selectedPositionsPerSurgery, {
            'surgery_id': id,
        });

        if (index !== -1){
            return true;
        }
        return false;
    }

    toggleCombinedProduct(product_id)
    {
        const index = this.selectedCombinedProducts.indexOf(product_id);

        if (index !== -1)
        {
            this.selectedCombinedProducts.splice(index, 1);
        }else{
            this.selectedCombinedProducts.push(product_id);
        }
    }

    toggleSurgery(surgery_id)
    {
        if (this.surgeryInArray(surgery_id))
        {
          const index = _.filter(this.selectedPositionsPerSurgery, {
              'surgery_id': surgery_id,
          });

          _.forEach(index, (surgery) => {
              const surgery_position_index = _.findIndex(this.selectedPositionsPerSurgery, {
                  'surgery_id': surgery.surgery_id,
                  'position_id': surgery.position_id
              });

              this.selectedPositionsPerSurgery.splice(surgery_position_index, 1);
          });
        }else{
          const surgery = {'surgery_id': surgery_id};
          this.selectedPositionsPerSurgery.push(surgery);
        }
    }

    unselectCountry(id)
    {
        _.pull(this.selectedCountries, id);
        this.unselectedCountries.push(id);
    }


    update(id)
    {
        this.apiService.update('product', this.selectedProduct , id).then(() => {
            this.toastr.success('Product succesvol aangepast.', 'Gelukt!');
            this.hideOverlay();
            this.getProducts();
        }).catch(() => {
            this.toastr.warning('Aanpassen mislukt. Controleer of de velden correct gevuld zijn..', 'Oeps!');
        });
    }

    updateCombinedProducts(id)
    {
        this.createCombinedProduct(id);
        this.reset();
    }

    updateCountries(id)
    {
        this.selectedProduct.countries = this.selectedCountries;
        this.createCountries(id);
        this.reset();
    }

    updateProduct(id)
    {
        this.selectedProduct.combine_with = this.selectedCombinedProducts;
        this.update(id);
    }

    updateProductSettings(id)
    {
        this.selectedProduct.settings = this.selectedProductSettings;
        this.createProductSettings(id);
    }

    updateSurgeries(id)
    {
        this.createSurgeryPosition(id);
    }

    viewDetails(id)
    {
        this.reset();
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

    viewCombinedProducts(id)
    {
        this.reset();
        this.loadProduct(id);
        this.overlayCombinedProducts = true;
    }
}
