import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(array: any[], fieldValue: string, order: string): any {
    if(!Array.isArray(array)) return undefined;

    if(order === 'asc') {
      array.sort((a, b) => {
        if(a[fieldValue] > b[fieldValue]) return 1;
        if(a[fieldValue] < b[fieldValue]) return -1;
        else return 0;
      });

      return array;
    }
    else if(order === 'desc') {
      array.sort((a, b) => {
        if(a[fieldValue] < b[fieldValue]) return 1;
        if(a[fieldValue] > b[fieldValue]) return -1;
        else return 0;
      });

      return array;
    }
    
    return undefined;
  }

}
