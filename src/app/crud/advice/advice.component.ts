import {Component, OnInit, ViewContainerRef} from '@angular/core';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';

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

    constructor(private apiService: ApiService, public toastr: ToastsManager, vcr: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    addItem()
    {
        this.overlayOpen = true;
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

    getAdvice(id)
    {
        this.apiService.get('advice/' + id).then((advice) => {
            this.selectedAdvice = advice;
            this.overlaySelected = true;
        });
    }

    getAdvices()
    {
        this.loading = true;
        this.apiService.get('advices').then((advices) => {
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
        this.apiService.update('advice', this.selectedAdvice, id).then(() => {
            this.getAdvices();
            this.hideOverlay();
            this.toastr.success('Advies succesvol aangepast.', 'Gelukt!');
        });
    }

    viewDetails(id)
    {
        this.getAdvice(id);
    }


}
