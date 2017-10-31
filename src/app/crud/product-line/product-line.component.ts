import {Component, OnInit, ViewContainerRef} from '@angular/core';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { ProductLine } from '../../models/product-line/product-line';
import {ApiService} from '../../core/api.service';
import {LanguageService} from '../../services/language.service';

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

    constructor(private apiService: ApiService, public toastr: ToastsManager, private languageService: LanguageService, vcr: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    addItem()
    {
        this.overlayOpen = true;
    }

    create()
    {
        this.apiService.post('productlines', this.model).then(() => {
            this.getProductLines();
            this.overlayOpen = false;
            this.toastr.success('Productlijn succesvol toegevoegd.', 'Gelukt!');
        });
    }

    destroy(id)
    {
        this.apiService.delete('productline', id).then(() => {
            this.getProductLines();
            this.toastr.info('Productlijn succesvol verwijderd.', 'Gelukt!');
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

    init(){
        this.getProductLines();
    }

    ngOnInit()
    {
        this.init();
        this.languageService.languageChanged.subscribe( value => {
            if (value === true) {
                this.init();
            }
        });
    }

    update(id)
    {
        this.apiService.update('productline', this.selectedProductLine, id).then(() => {
          this.getProductLines();
          this.hideOverlay();
            this.toastr.success('Productlijn succesvol aangepast.', 'Gelukt!');
        })
    }

    viewDetails(id)
    {
        this.getProductLine(id);
    }

}
