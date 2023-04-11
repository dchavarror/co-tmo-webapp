import { formatCurrency , DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {
 decimal: DecimalPipe = new DecimalPipe('en-US') ;
  transform(monto: string): string {
      const valor: string =  this.decimal.transform(monto, '2.0-2'); //formatCurrency(monto, 'es', '', '', '');
      return valor;
  }

}
