import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dia'
})
export class DiaPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    let f = value.split("T");
    let fecha : string[] = f[0].split("-");
    console.log(fecha);
    return fecha[2]+"-"+fecha[1]+"-"+fecha[0];
  }

}
