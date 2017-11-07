import {Component, OnInit, ViewContainerRef} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';


import * as _ from 'lodash';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { Surgery } from '../../models/surgery/surgery';
import { ApiService } from '../../core/api.service';
import {LanguageService} from '../../services/language.service';

@Component({
    selector: 'app-surgery',
    templateUrl: './surgery.component.html',
    styleUrls: ['./surgery.component.css']
})
export class SurgeryComponent implements OnInit {

    loading = false;
    title = 'Operaties';
    overlayOpen = false;

    model: any = {};
    surgeries: Surgery[];
    referenceSurgeries: Surgery[];
    searchSurgeries: Surgery[];

    selectedSurgery: any = {};
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
        this.apiService.post('surgeries', this.model).then(() => {
            this.getSurgeries();
            this.overlayOpen = false;
            this.toastr.success('Operatie succesvol toegevoegd.', 'Gelukt!');
        });
    }

    destroy(id)
    {
        this.apiService.delete('surgery', id).then(() => {
            this.getSurgeries();
            this.toastr.info('Operatie succesvol verwijderd.', 'Gelukt!');
        });
    }

    getSurgery(id)
    {
        this.apiService.get('surgery/' + id).then((surgery) => {
            this.selectedSurgery = surgery;
            this.overlaySelected = true;
        });
    }

    getSurgeries()
    {
        this.loading = true;
        this.apiService.get('surgeries').then((surgeries) => {
            this.surgeries = surgeries;
            this.referenceSurgeries = surgeries;
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
        this.getSurgeries();
    }

    ngOnInit()
    {
        this.init();
        this.languageService.languageChanged.subscribe( value => {
            if (value === true && this.router.url === '/surgeries') {
                this.init();
            }
        });
    }

    setSearchParam(event: any)
    {
        this.searchSurgeries = _.filter(this.referenceSurgeries, (surgery) => {
            return surgery.name.toLowerCase().match(event.target.value.toLowerCase());
        });

        this.surgeries = this.searchSurgeries;
    }


    update(id)
    {
        this.apiService.update('surgery', this.selectedSurgery, id).then(() => {
            this.getSurgeries();
            this.hideOverlay();
            this.toastr.success('Operatie succesvol aangepast.', 'Gelukt!');
        })
    }

    viewDetails(id)
    {
        this.getSurgery(id);
    }

}
