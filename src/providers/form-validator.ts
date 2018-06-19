import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';

/*
  Generated class for the FormValidatorProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FormValidatorProvider {
  constructor() {}

  private findErrorMessages(form: NgForm): string[] {
    const controls = form.controls;
    const errorMsgList: string[] = [];
    for (const key in controls) {
      if (controls[key].valid) {
        continue;
      }
      const errors = controls[key].errors;
      for (const errKey in errors) {
        switch (errKey) {
          case 'required':
            errorMsgList.push(key + ' cannot empty.');
            break;
          case 'pattern':
            if (key === 'Password') errorMsgList.push('Pattern ' + key + ' is wrong, only number, word dan symbol "@#$%^&+=" is allowed.');
            else if (key === 'Corporate Email') errorMsgList.push('Pattern ' + key + ' is wrong.');
            else if (key === 'Handphone') errorMsgList.push('Pattern ' + key + ' is wrong, only 6281xxx or 081xxx is allowed.');
            break;
          case 'validateEqual':
            errorMsgList.push(key + ' is not match.');
            break;
          default:
            break;
        }
      }
    }
    return errorMsgList;
  }

  getErrorMessage(form: NgForm): string {
    if (!form.valid) return this.findErrorMessages(form)[0];
    else return;
  }

  showErrorMessages(form: NgForm): string {
    if (!form.valid) return this.findErrorMessages(form).join('\n\r');
    else return;
  }
}
