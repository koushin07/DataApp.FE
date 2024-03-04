import { Component, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css'
})
export class DatePickerComponent implements ControlValueAccessor {
  @Input() label: string = ''
  @Input() maxDate: Date | undefined
  bsConfig: Partial<BsDatepickerConfig> | undefined

  constructor(private ngControl: NgControl) {
    ngControl.valueAccessor = this // the = this means ngControl.valueAccessor = DatePickerComponent(the class it self)
    this.bsConfig = {
      containerClass: 'theme-default',
      dateInputFormat: 'DD MMMM YYYY'
    }
  }
  writeValue(obj: any): void {
  }
  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }
  setDisabledState?(isDisabled: boolean): void {
  }

  get control(): FormControl {
    return this.ngControl.control as FormControl
  }

}
