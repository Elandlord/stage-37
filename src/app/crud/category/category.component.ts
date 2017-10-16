import { Component, OnInit } from '@angular/core';

import { Category } from '../../models/category/category';
import { ApiService } from '../../core/api.service';

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

    constructor(private apiService: ApiService) {}

    addItem()
    {
        this.overlayOpen = true;
    }

    create()
    {
        this.apiService.post('categories', this.model).then(() => {
            this.getCategories();
            this.overlayOpen = false;
        });
    }

    destroy(id)
    {
        this.apiService.delete('category', id).then(() => {
            this.getCategories();
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

    ngOnInit()
    {
        this.getCategories();
    }

    update(id)
    {
        this.apiService.update('category', this.selectedCategory , id).then(() => {
            this.getCategories();
            this.hideOverlay();
        })
    }

    viewDetails(id)
    {
        this.getCategory(id);
    }
}
