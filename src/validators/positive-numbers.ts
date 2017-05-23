import { FormControl } from '@angular/forms';

export const RegEx = /^\d*[1-9]\d*$/;

export function PositiveNumbersValidator(control: FormControl): {[key: string]: boolean} {
  if (!RegEx.test(control.value)) {
    return {'positiveNumbersOnly': true};
  }
  return null;
}
