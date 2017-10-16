import { Component, OnInit } from '@angular/core';

import { Article} from '../../models/article/article';
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

    selectedArticle: any = {};
    overlaySelected = false;

    constructor(private apiService: ApiService) {}

    addItem()
    {
        this.overlayOpen = true;
    }

    create()
    {
        this.apiService.post('articles', this.model).then(() => {
            this.getArticles();
            this.overlayOpen = false;
        });
    }

    destroy(id)
    {
        this.apiService.delete('article', id).then(() => {
            this.getArticles();
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

    hideOverlay()
    {
        this.overlayOpen = false;
        this.overlaySelected = false;
    }

    ngOnInit()
    {
        this.getArticles();
    }

    update(id)
    {
        this.apiService.update('article', this.selectedArticle, id).then(() => {
            this.getArticles();
            this.hideOverlay();
        })
    }

    viewDetails(id)
    {
        this.getArticle(id);
    }

}
