import { Component, OnInit } from '@angular/core';

import { Surgery } from '../../models/surgery/surgery';
import { ApiService } from '../../core/api.service';

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

    selectedSurgery: any = {};
    overlaySelected = false;

    constructor(private apiService: ApiService) {}

    addItem()
    {
        this.overlayOpen = true;
    }

    create()
    {
        this.apiService.post('surgeries', this.model).then(() => {
            this.getSurgeries();
            this.overlayOpen = false;
        });
    }

    destroy(id)
    {
        this.apiService.delete('surgery', id).then(() => {
            this.getSurgeries();
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
        this.getSurgeries();
    }

    update(id)
    {
        this.apiService.update('surgery', this.selectedSurgery, id).then(() => {
            this.getSurgeries();
            this.hideOverlay();
        })
    }

    viewDetails(id)
    {
        this.getSurgery(id);
    }

}
