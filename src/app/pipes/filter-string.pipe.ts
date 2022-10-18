import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterString',
  pure: false
})
export class FilterStringPipe implements PipeTransform {

  transform(array: any[], fieldValue: string, value: string): any {
    if(!Array.isArray(array)) return undefined;

    let filter = [];
    filter = array.filter(e => e[fieldValue].includes(value));

    return filter;
  }

}
