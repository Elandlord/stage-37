import { Component, OnInit } from '@angular/core';

import { Advice } from '../../models/advice/advice';
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

    selectedAdvice: any = {};
    overlaySelected = false;

    constructor(private apiService: ApiService) {}

    addItem()
    {
        this.overlayOpen = true;
    }

    create()
    {
        this.apiService.post('advices', this.model).then(() => {
            this.getAdvices();
            this.overlayOpen = false;
        });
    }

    destroy(id)
    {
        this.apiService.delete('advice', id).then(() => {
            this.getAdvices();
        });
    }

    getAdvice(id)
    {
        this.apiService.get('position/' + id).then((advice) => {
            this.selectedAdvice = advice;
            this.overlaySelected = true;
        });
    }

    getAdvices()
    {
        this.loading = true;
        this.apiService.get('positions').then((advices) => {
            this.advices = advices;
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
        this.getAdvices();
    }

    update(id)
    {
        this.apiService.update('position', this.selectedAdvice, id).then(() => {
            this.getAdvices();
            this.hideOverlay();
        });
    }

    viewDetails(id)
    {
        this.getAdvice(id);
    }


}
