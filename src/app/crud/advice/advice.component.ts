import {Component, OnInit, ViewContainerRef} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';


import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import * as _ from 'lodash';

import { Advice } from '../../models/advice/advice';
import { Surgery } from '../../models/surgery/surgery';
import { Position } from '../../models/position/position';
import { Product} from '../../models/product/product';
import { ApiService } from '../../core/api.service';
import {LanguageService} from '../../services/language.service';

@Component({
  selector: 'app-advice',
  templateUrl: './advice.component.html',
  styleUrls: ['./advice.component.css']
})
export class AdviceComponent implements OnInit {

    loading = false;
    loadingAdvice = false;

    title = 'Adviezen';
    overlayOpen = false;

    model: any = {};
    // Advices is not the correct plural form of Advice
    advices: Advice[];
    referenceAdvices: Advice[];
    adviceProduct: any = [];
    positions: Position[];
    products: Product[];

    selectedProducts: any = [];
    unselectedProducts: any = [];

    selectedAdvice: any = {};
    overlaySelected = false;
    overlayProducts = false;
    overlaySurgery = false;

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

    checkAdviceProduct(product_id)
    {
        const index = this.adviceProduct.indexOf(product_id);

        if (index !== -1){
            return 'checked';
        }
    }

    create()
    {
        this.model.products = this.adviceProduct;

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
        this.adviceProduct = this.selectedAdvice.product_id;
    }

    fillSurgeryPositions()
    {
        _.forEach(this.selectedAdvice.position_surgery_ids, (surgery) => {

            const surgery_index = _.findIndex(this.selectedPositionsPerSurgery, {
                'surgery_id': surgery.surgery_id,
            });

            if (surgery_index === -1){
                this.toggleSurgery(surgery.surgery_id);
            }

            this.addPositionToSurgery(surgery.surgery_id, surgery.position_id);
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
            this.referenceAdvices = advices;
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
        this.overlaySurgery = false;
    }

    loadAdvice(id)
    {
        this.loadingAdvice = true;
        this.apiService.get('advice/' + id).then((advice) => {
            this.selectedAdvice = advice;
            this.fillSurgeryPositions();
            this.fillProducts();
            this.loadingAdvice = false;
        });
    }

    init()
    {
        this.getAdvices();
        this.getPositions();
        this.getSurgeries();
        this.getProducts();
    }

    ngOnInit()
    {
        this.init();
        this.languageService.languageChanged.subscribe( value => {
            if (value === true && this.router.url === '/advices') {
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
        this.selectedAdvice = {};
        this.selectedProducts = [];
        this.unselectedProducts = [];
        this.selectedPositionsPerSurgery = [];
    }

    selectProduct(id)
    {
        this.unselectedProducts.splice(this.unselectedProducts.indexOf(id), 1);
        this.selectedProducts.push(id);
    }

    setSearchParam(event: any)
    {
        const searchAdvices = _.filter(this.referenceAdvices, (advice) => {
            return advice.name.toLowerCase().match(event.target.value.toLowerCase());
        });

        this.advices = searchAdvices;
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

    toggleAdviceProduct(product_id){
        const index = this.adviceProduct.indexOf(product_id);

        if (index !== -1)
        {
            this.adviceProduct.splice(index, 1);
        }else{
            this.adviceProduct.push(product_id);
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
        this.selectedAdvice.products = this.adviceProduct;
        this.update(id);
        this.reset();
    }

    updateSurgeries(id)
    {
        console.log(this.selectedPositionsPerSurgery);
        this.selectedAdvice.position_surgery_ids = this.selectedPositionsPerSurgery;
        this.update(id);
        this.reset();
    }

    viewDetails(id)
    {
        this.getAdvice(id);
    }

    viewProduct(id)
    {
        this.reset();
        this.loadAdvice(id);
        this.overlayProducts = true;
    }

    viewSurgery(id)
    {
        this.reset();
        this.loadAdvice(id);
        this.overlaySurgery = true;
    }

}
