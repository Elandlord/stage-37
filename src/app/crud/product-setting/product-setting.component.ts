import {Component, OnInit, ViewContainerRef} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';

import * as _ from 'lodash';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { Product } from '../../models/product/product';
import { ProductSetting } from '../../models/product-setting/product-setting';
import { ApiService } from '../../core/api.service';
import {LanguageService} from '../../services/language.service';

@Component({
  selector: 'app-product-setting',
  templateUrl: './product-setting.component.html',
  styleUrls: ['./product-setting.component.css']
})
export class ProductSettingComponent implements OnInit {

    loading = false;
    title = 'Productinstellingen';
    overlayOpen = false;

    model: any = {};
    productSettings: ProductSetting[];
    referenceProductSettings: ProductSetting[];
    searchProductSettings: ProductSetting[];

    products: Product[];

    selectedProductSetting: any = {};
    overlaySelected = false;

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

    create()
    {
        this.apiService.post('productsettings', this.model).then(() => {
            this.getProductSettings();
            this.overlayOpen = false;
            this.toastr.success('Productsetting succesvol toegevoegd.', 'Gelukt!');
        });
    }

    destroy(id)
    {
        this.apiService.delete('productsetting', id).then(() => {
            this.getProductSettings();
            this.toastr.info('Productsetting succesvol verwijderd.', 'Gelukt!');
        });
    }

    getProducts()
    {
        this.apiService.get('products').then((products) => {
            this.products = products;
        });
    }

    getProductNameBySettingId(id)
    {
        if(this.products !== undefined)
        {
            return _.find(this.products, (product) => product.id === id);
        }

        return 'Geen';
    }

    getProductSetting(id)
    {
        this.apiService.get('productsetting/' + id).then((productsetting) => {
            this.selectedProductSetting = productsetting;
            this.overlaySelected = true;
        });
    }

    getProductSettings()
    {
        this.loading = true;
        this.apiService.get('productsettings').then((productsettings) => {
            this.productSettings = productsettings;
            this.referenceProductSettings = productsettings;
            this.loading = false;
        });
    }

    hideOverlay()
    {
        this.overlayOpen = false;
        this.overlaySelected = false;
    }

    init()
    {
        this.getProducts();
        this.getProductSettings();
    }

    ngOnInit()
    {
        this.init();
        this.languageService.languageChanged.subscribe( value => {
            if (value === true && this.router.url === '/product-settings') {
                this.init();
            }
        });
    }

    setSearchParam(event: any)
    {
        this.searchProductSettings = _.filter(this.referenceProductSettings, (productSetting) => {
            return productSetting.name.toLowerCase().match(event.target.value.toLowerCase());
        });

        this.productSettings = this.searchProductSettings;
    }

    update(id)
    {
        this.apiService.update('productsetting', this.selectedProductSetting, id).then(() => {
            this.getProductSettings();
            this.hideOverlay();
            this.toastr.success('Productsetting succesvol aangepast.', 'Gelukt!');
        });
    }

    viewDetails(id)
    {
        this.getProductSetting(id);
    }

}
