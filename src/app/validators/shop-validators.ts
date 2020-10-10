import {FormControl, ValidationErrors} from '@angular/forms';

export class ShopValidators {
  // Whitespace validation
  static notOnlyWhiteSpace(control: FormControl): ValidationErrors{

    // check to see if the string only has whitespace
    if ((control.value !== null) && (control.value.trim().length === 0)){
      // invalid, return error object
      return { 'notOnlyWhiteSpace': true};
    }
    else {
      return null;
    }
  }
}
