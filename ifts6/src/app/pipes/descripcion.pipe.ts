import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'descripcion'
})
export class DescripcionPipe implements PipeTransform {

  transform(value: String, ...args: unknown[]): unknown {
    let text = "";
    let listo = false;
    for (let i = 0; i < value.length && !listo; i++) {
      text += value.at(i);
      if (i >= 99) {
        console.log(text.at(i)+ " " +text.charCodeAt(i));
        // 10 = enter, 46 = dot, 32 = space
        if (text.charCodeAt(i) == 10 || text.charCodeAt(i) == 46 || text.charCodeAt(i) == 32) {
          listo = true;
          if(text.charCodeAt(i) == 10){
            text = text.slice(0,i-2);
          }else{
            text = text.slice(0,i);
          }
          text += "...";
        }
      }
    }
    return text;
  }

}
