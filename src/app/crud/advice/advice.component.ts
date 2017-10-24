import {Component, OnInit, ViewContainerRef} from '@angular/core';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import * as _ from 'lodash';

import { Advice } from '../../models/advice/advice';
import { Surgery } from "../../models/surgery/surgery";
import { Position } from "../../models/position/position";
import { Product} from "../../models/product/product";
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-advice',
  templateUrl: './advice.component.html',
  styleUrls: ['./advice.component.css']
})
export class AdviceComponent implements OnInit {

    loading = false;
    title = 'Adviezen';
    overlayOpen = false;

    model: any = {};
    // Advices is not the correct plural form of Advice
    advices: Advice[];
    positions: Position[];
    products: Product[];

    selectedProducts: any = [];
    unselectedProducts: any = [];

    selectedAdvice: any = {};
    overlaySelected = false;
    overlayProducts = false;

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

    addSurgery(id)
    {
        const indexArray = this.selectedSurgeries.indexOf(id);
        if (indexArray === -1){
            this.selectedSurgeries.push(id);
        }else{
            this.selectedSurgeries.pop(indexArray);
        }
    }

    create()
    {
        this.apiService.post('advices', this.model).then(() => {
            this.getAdvices();
            this.overlayOpen = false;
            this.toastr.success('Advies succesvol toegevoegd.', 'Gelukt!');
        });
    }

    destroy(id)
    {
        this.apiService.delete('advice', id).then(() => {
            this.getAdvices();
            this.toastr.info('Advies succesvol verwijderd.', 'Gelukt!');
        });
    }

    fillProducts()
    {
        // unselect all products
        _.forEach(this.products, (product) => this.unselectedProducts.push(product.id));

        // select products per advice
        _.forEach(this.advices, (advice) => {
            _.forEach(advice.product_id, (product) => this.selectProduct(product));
        });

    }

    getAdvice(id)
    {
        this.apiService.get('advice/' + id).then((advice) => {
            this.selectedAdvice = advice;
            this.overlaySelected = true;
        });
    }

    getAdvices()
    {
        this.apiService.get('advices').then((advices) => {
            this.advices = advices;
        });
    }

    getPositions()
    {
        this.apiService.get('positions').then((positions) => {
            this.positions = positions;
        });
    }

    getProductNameById(id)
    {
        for (const product of this.products)
        {
            if (product.id === id)
            {
                return product.name;
            }
        }
    }

    getProducts()
    {
        this.apiService.get('products').then((products) => {
            this.products = products;
        });
    }

    getSurgeries()
    {
        this.loading = true;
        this.apiService.get('surgeries').then((surgeries) => {
            this.surgeries = surgeries;
            this.loading = false;
        });
    }

    hideOverlay()
    {
        this.overlayOpen = false;
        this.overlaySelected = false;
        this.overlayProducts = false;
    }

    loadAdvice(id)
    {
        this.apiService.get('advice/' + id).then((advice) => {
            this.selectedAdvice = advice;
        });
    }

    ngOnInit()
    {
        this.getAdvices();
        this.getPositions();
        this.getSurgeries();
        this.getProducts();
    }

    reset()
    {
        this.selectedAdvice = {};
        this.selectedProducts = [];
        this.unselectedProducts = [];
    }

    selectProduct(id)
    {
        this.unselectedProducts.splice(this.unselectedProducts.indexOf(id), 1);
        this.selectedProducts.push(id);
    }

    surgeryInArray(id)
    {
        if (this.selectedSurgeries.indexOf(id) === -1)
        {
            return false;
        }
        return true;
    }

    unselectProduct(id)
    {
        this.selectedProducts.splice(this.selectedProducts.indexOf(id), 1);
        this.unselectedProducts.push(id);
    }

    update(id)
    {
        this.apiService.update('advice', this.selectedAdvice, id).then(() => {
            this.getAdvices();
            this.hideOverlay();
            this.toastr.success('Advies succesvol aangepast.', 'Gelukt!');
        });
    }

    updateProducts(id)
    {
        this.selectedAdvice.product_id = this.selectedProducts;
        this.update(id);
        this.reset();
    }

    viewDetails(id)
    {
        this.getAdvice(id);
    }

    viewProducts(id)
    {
        this.reset();
        this.fillProducts();
        this.loadAdvice(id);
        this.overlayProducts = true;
    }

}
