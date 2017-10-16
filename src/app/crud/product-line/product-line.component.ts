import { Component, OnInit } from '@angular/core';

import { ProductLine } from '../../models/product-line/product-line';
import {ApiService} from '../../core/api.service';

@Component({
  selector: 'app-product-line',
  templateUrl: './product-line.component.html',
  styleUrls: ['./product-line.component.css']
})
export class ProductLineComponent implements OnInit {

    loading = false;
    title = 'Productlijnen';
    overlayOpen = false;

    model: any = {};
    productLines: ProductLine[];

    selectedProductLine: any = {};
    overlaySelected = false;

    constructor(private apiService: ApiService) {}

    addItem()
    {
        this.overlayOpen = true;
    }

    create()
    {
        this.apiService.post('productlines', this.model).then(() => {
            this.getProductLines();
            this.overlayOpen = false;
        });
    }

    destroy(id)
    {
        this.apiService.delete('productline', id).then(() => {
            this.getProductLines();
        });
    }

    getProductLine(id)
    {
        this.apiService.get('productline/' + id).then((productline) => {
            this.selectedProductLine = productline;
            this.overlaySelected = true;
        });
    }

    getProductLines()
    {
        this.loading = true;
        this.apiService.get('productlines').then((productlines) => {
            this.productLines = productlines;
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
        this.getProductLines();
    }

    update(id)
    {
        this.apiService.update('productline', this.selectedProductLine, id).then(() => {
          this.getProductLines();
          this.hideOverlay();
        })
    }

    viewDetails(id)
    {
        this.getProductLine(id);
    }

}
