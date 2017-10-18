import {Component, OnInit, ViewContainerRef} from '@angular/core';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { Article} from '../../models/article/article';
import { Category } from '../../models/category/category';
import {ApiService} from '../../core/api.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

    loading = false;
    title = 'Artikelen';
    overlayOpen = false;

    model: any = {};
    articles: Article[];
    categories: Category[];

    selectedArticle: any = {};
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
        this.apiService.post('articles', this.model).then(() => {
            this.getArticles();
            this.overlayOpen = false;
            this.toastr.success('Artikel succesvol toegevoegd.', 'Gelukt!');
        });
    }

    destroy(id)
    {
        this.apiService.delete('article', id).then(() => {
            this.getArticles();
            this.toastr.info('Artikel succesvol verwijderd.', 'Gelukt!');
        });
    }

    getArticle(id)
    {
        this.apiService.get('article/' + id).then((article) => {
            this.selectedArticle = article;
            this.overlaySelected = true;
        });
    }

    getArticles()
    {
        this.loading = true;
        this.apiService.get('articles').then((articles) => {
            this.articles = articles;
            this.loading = false;
        });
    }

    getCategories()
    {
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
        this.getArticles();
        this.getCategories();
    }

    update(id)
    {
        this.apiService.update('article', this.selectedArticle, id).then(() => {
            this.getArticles();
            this.hideOverlay();
            this.toastr.success('Artikel succesvol aangepast.', 'Gelukt!');
        })
    }

    viewDetails(id)
    {
        this.getArticle(id);
    }

}
