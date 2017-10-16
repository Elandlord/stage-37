import { Pipe, PipeTransform } from '@angular/core';

import { ProductLine } from '../models/product-line/product-line';
import {ApiService} from '../core/api.service';

@Pipe({
  name: 'productLineIdToName'
})
export class ProductLineIdToNamePipe implements PipeTransform {

  productLine: any = {};

  constructor(private apiService: ApiService){}

  transform(id){
    this.getProductLine(id);

  }

  getProductLine(id){
      this.apiService.get('productline/' + id).then((productline) => {
          this.productLine = productline;
          return this.productLine.name;
      });
  }

}
