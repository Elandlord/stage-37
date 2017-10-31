import {Component, OnInit, ViewContainerRef} from '@angular/core';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { Category } from '../../models/category/category';
import { ApiService } from '../../core/api.service';
import {LanguageService} from '../../services/language.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

    loading = false;
    title = 'Categorieën';
    overlayOpen = false;

    model: any = {};
    categories: Category[];

    selectedCategory: any = {};
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
        this.apiService.post('categories', this.model).then(() => {
            this.getCategories();
            this.overlayOpen = false;
            this.toastr.success('Categorie succesvol toegevoegd.', 'Gelukt!');
        });
    }

    destroy(id)
    {
        this.apiService.delete('category', id).then(() => {
            this.getCategories();
            this.toastr.info('Categorie succesvol verwijderd.', 'Gelukt!');
        });
    }

    getCategory(id)
    {
        this.apiService.get('category/' + id).then((category) => {
            this.selectedCategory = category;
            this.overlaySelected = true;
        });
    }

    getCategories()
    {
        this.loading = true;
        this.apiService.get('categories').then((categories) => {
            this.categories = categories;
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
        this.getCategories();
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
        this.apiService.update('category', this.selectedCategory , id).then(() => {
            this.getCategories();
            this.hideOverlay();
            this.toastr.success('Categorie succesvol aangepast.', 'Gelukt!');
        })
    }

    viewDetails(id)
    {
        this.getCategory(id);
    }
}
