import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {PointService} from "../../service/point.service";
import {FormBuilder, ɵElement, ɵValue} from "@angular/forms";
import {PointRequestDto} from "../../dto/point-request-dto";
import {PointResponse} from "../../dto/point-response";

@Component({
  selector: 'app-point-form',
  templateUrl: './point-form.component.html',
  styleUrls: ['./point-form.component.css']
})
export class PointFormComponent {

  pointForm = this.formBuilder.group({
    x_value: '',
    y_value: '',
    r_value: ''
  });


  @Output() addEvent = new EventEmitter<PointResponse>();
  @Output() rChangeEvent = new EventEmitter<number>()
  errorMessage: string = "";


  x_values: string[] = ['-5', '-4', '-3', '-2', '-1', '0', '1', '2', '3'];
  r_values: string[] = ['-5', '-4', '-3', '-2', '-1', '0', '1', '2', '3'];
  y_values: any;

  constructor(private pointService: PointService,
              private formBuilder: FormBuilder) {
  }

  onSubmit(): void {
    this.errorMessage = "";

    if (this.pointForm.value.x_value === '' || this.pointForm.value.x_value == null) {
      this.errorMessage = "X value is required";
    } else if (this.pointForm.value.y_value === '' || this.pointForm.value.y_value == null) {
      this.errorMessage = "Y value is required";
    } else if (this.pointForm.value.r_value === '' || this.pointForm.value.r_value == null) {
      this.errorMessage = "R value is required";
    } else if (!this.checkR(this.pointForm.value.r_value)) {
      this.errorMessage = "R value should be more than 0";
    } else {

      console.log('Form data: ', this.pointForm.value);
      for (let i= 0; i < this.pointForm.value.x_value.length; i++) {
        for (let j = 0; j < this.pointForm.value.r_value.length; j++) {
          let point = new PointRequestDto(
            +this.pointForm.value.x_value[i],
            +this.pointForm.value.y_value,
            +this.pointForm.value.r_value[j],
          );

          this.pointService.savePoint(point).subscribe(
            data => {
              console.log("New point " + data.currentTime);
              this.addEvent.emit(data);
            },

            error => {
              console.log(error);
            }
          );
        }
      }


    }

  }
  onChangeR(event: any):void{
    const selectedValues = event.value;

    if (selectedValues && selectedValues.length > 0) {
      const selectedValue = selectedValues[selectedValues.length - 1];
      this.rChangeEvent.emit(selectedValue);
    }
  }

  checkR(r_values: string): boolean{
    for (let i = 0; i < r_values.length; i++) {
      console.log(r_values[i]);
      if (parseInt(r_values[i]) <= 0){
        return false;
      }
    }
    return true;
  }
}
