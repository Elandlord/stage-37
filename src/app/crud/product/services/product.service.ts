import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Product } from '../../../models/product/product';

@Injectable()
export class ProductService {

  private url = 'https://api.37company.rapide.software/v1/products';
  private headers = new Headers({'Accept': 'application/json', 'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjViNTQ2MjE1ODEwZWQxNzdiYjdhMDIzMzhjMWRlZGRhMTdmYTEzMmNkMDFlMWQxZDRkNzU5YjRjZTk2MjljNWY2ZTQwOTZjZmEzZWQxY2RjIn0.eyJhdWQiOiIxIiwianRpIjoiNWI1NDYyMTU4MTBlZDE3N2JiN2EwMjMzOGMxZGVkZGExN2ZhMTMyY2QwMWUxZDFkNGQ3NTliNGNlOTYyOWM1ZjZlNDA5NmNmYTNlZDFjZGMiLCJpYXQiOjE1MDc3MjQwNzEsIm5iZiI6MTUwNzcyNDA3MSwiZXhwIjoxNTA3ODEwNDcxLCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.KzXQFpBzm7H5-bVrGdl45L6VNEFqegPBHcJ0ZMhbJl5D-N4ce_rmPq8-9v64xThIJP0R43Ks_KnkU037dAEZ071YTsHYKcmDA2I8t1WJQsc1qjRje6i0P6cnZdWz-P_g6BVGaH5eT_8h4mO8-rWVb-IX8bWaTnE5j17R5UaJQIJXPSMQUW7glVTvI-k3Wd_Y7X4BD3POuk6MZc68PhS0QaGqhu76SpxtaCB8o2mXrvSJI4yLufOLAIC3az_W5uzb2k8udtQiwapCmvLbBhMKxcleTFLQRuBWN4mump6LXqq0NwXao4Rs5naki-FJDyrcRPgINdmW0YcIJnkqon9QIqkobHdoszTasdrBaE4xQsNYyfQHufkfaAi3lW49Y6o_YFkqzsgQj-adTyMg9yTyJE7GZD3XW6zQAyLRCtKSUCWTeAAmYCt5VBo1SLrR56pbn9N2EP8BwyY3yUnUIVmsI3eDjLHDmsoKti7SM3SMJ0PXEjJu9883cbSTQJTMlooFyOUN-nLNKT-Jq0EtP-sHxu3JCKvLc3WyuysKxCqfce47DzbO-tPIBb2DxgwszLiSzvunp_3matflbf6mupZAqM_pVNKyJBuyJdpqDMN-UcalwuuxGClEiVcapmrQN5slou_ar0zPQeOoVSqODteMmJgFJF6_j7phz6KFq2zrNHw'});

  constructor(private http: Http) { }

  getProducts(): Promise<Product[]>{
    return this.http.get(this.url, {
      headers: this.headers
    })
        .toPromise()
        .then(response => response.json().data as Product[])
        .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
      console.error('An error occurred', error); // for demo purposes only
      return Promise.reject(error.message || error);
  }
}
