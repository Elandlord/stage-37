import { Component, OnInit } from '@angular/core';

import { Position } from '../../models/position/position';
import {ApiService} from '../../core/api.service'; ( ApiService);

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

    constructor(private apiService: ApiService) {}

    addItem()
    {
        this.overlayOpen = true;
    }

    create()
    {
        this.apiService.post('positions', this.model).then(() => {
            this.getPositions();
            this.overlayOpen = false;
        });
    }

    destroy(id)
    {
        this.apiService.delete('position', id).then(() => {
            this.getPositions();
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

    ngOnInit()
    {
        this.getPositions();
    }

    update(id)
    {
        this.apiService.update('position', this.selectedPosition, id).then(() => {
            this.getPositions();
            this.hideOverlay();
        });
    }

    viewDetails(id)
    {
        this.getPosition(id);
    }


}
