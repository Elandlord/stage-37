import { Component, OnInit } from '@angular/core';

import { Product } from '../../models/product/product';
import { ProductSetting } from '../../models/product-setting/product-setting';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-product-setting',
  templateUrl: './product-setting.component.html',
  styleUrls: ['./product-setting.component.css']
})
export class ProductSettingComponent implements OnInit {

    loading = false;
    title = 'Productsettings';
    overlayOpen = false;

    model: any = {};
    productSettings: ProductSetting[];
    products: Product[];

    selectedProductSetting: any = {};
    overlaySelected = false;

    constructor(private apiService: ApiService) {}

    addItem()
    {
        this.overlayOpen = true;
    }

    create()
    {
        this.apiService.post('productsettings', this.model).then(() => {
            this.getProductSettings();
            this.overlayOpen = false;
        });
    }

    destroy(id)
    {
        this.apiService.delete('productsetting', id).then(() => {
            this.getProductSettings();
        });
    }

    getProducts()
    {
        this.apiService.get('products').then((products) => {
            this.products = products;
        });
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
            this.loading = false;
        });
    }

    hideOverlay()
    {
        this.overlayOpen = false;
        this.overlaySelected = false;
    }

    ngOnInit()
    {
        this.getProducts();
        this.getProductSettings();
    }

    update(id)
    {
        this.apiService.update('productsetting', this.selectedProductSetting, id).then(() => {
            this.getProductSettings();
            this.hideOverlay();
        })
    }

    viewDetails(id)
    {
        this.getProductSetting(id);
    }

}
