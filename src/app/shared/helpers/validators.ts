import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class CustomValidators {
  static matchPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get("password")?.value;
      const passwordrepeat = control.get("passwordrepeat")?.value;
      if (password && passwordrepeat && password != passwordrepeat) control.get("passwordrepeat")?.setErrors({ notmatching: true });
      return null;
    };
  }
}
