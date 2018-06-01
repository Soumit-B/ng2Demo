import { Pipe, PipeTransform, Output } from '@angular/core';
/*
 * replace the translated value with dynamic text
 * Usage:
 *   value | replaceText:['pattern1', 'pattern2']:[newvalue1, newvalue2]
 * Example:
 *    <div *ngFor="let item of Arr">
 *      {{ 'Invoice Layout ^1^ ^2^' | translate | replaceText:['\\^1\\^', '\\^2\\^'],[item1, item2] }}
 *    </div>
 * Output:
 *    <div>Invoice Layout 1</div>
 *    <div>Invoice Layout 2</div>
*/
@Pipe({ name: 'replaceText' })
export class ReplaceTextPipe implements PipeTransform {
  transform(value: string, pattern?: string[], newValue?: string[]): any {
    if (!value) return value;
    newValue.forEach((item: any, index: number): any => {
      let reg = new RegExp(pattern[index], 'g');
      value = value.replace(reg, (txt: string): string => { return item; });
    });
    return value;
  }
}
