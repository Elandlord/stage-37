import {Component, OnInit, ViewContainerRef} from '@angular/core';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { Position } from '../../models/position/position';
import {ApiService} from '../../core/api.service';
import {LanguageService} from '../../services/language.service';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css']
})
export class PositionComponent implements OnInit {

    loading = false;
    title = 'Posities';
    overlayOpen = false;

    model: any = {};
    positions: Position[];

    selectedPosition: any = {};
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
        this.apiService.post('positions', this.model).then(() => {
            this.getPositions();
            this.overlayOpen = false;
            this.toastr.success('Positie succesvol toegevoegd.', 'Gelukt!');
        });
    }

    destroy(id)
    {
        this.apiService.delete('position', id).then(() => {
            this.getPositions();
            this.toastr.info('Positie succesvol verwijderd.', 'Gelukt!');
        });
    }

    getPosition(id)
    {
        this.apiService.get('position/' + id).then((position) => {
            this.selectedPosition = position;
            this.overlaySelected = true;
        });
    }

    getPositions()
    {
        this.loading = true;
        this.apiService.get('positions').then((positions) => {
            this.positions = positions;
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
        this.getPositions();
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
        this.apiService.update('position', this.selectedPosition, id).then(() => {
            this.getPositions();
            this.hideOverlay();
            this.toastr.success('Positie succesvol aangepast.', 'Gelukt!');
        });
    }

    viewDetails(id)
    {
        this.getPosition(id);
    }


}
