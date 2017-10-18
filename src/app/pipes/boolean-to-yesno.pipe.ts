import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booleanToYesno'
})
export class BooleanToYesnoPipe implements PipeTransform {

  transform(value){
    if(value === 0){
      return 'Nee';
    }else{
      return 'Ja';
    }
  }

}
