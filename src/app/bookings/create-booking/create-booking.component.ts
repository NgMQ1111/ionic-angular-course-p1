import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Form, NgForm, NgModel } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Place } from 'src/app/places/place.module';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selecterPlace!: Place;
  @Input() selecterMode!: 'select' | 'random'
  @ViewChild('f', { static: true }) form!: NgForm;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  onBookPlace(form: NgModel) {
    this.modalCtrl.dismiss({ message: 'This is a dummy message!' }, 'confirm')
    console.log(form.value);
    console.log(this.selecterPlace.availabelFrom?.toISOString());


  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel')
  }


  //! Yêu cầu ngày về phải lớn hơn ngày đi
  datesValid(){
    const startDate = new Date(this.form.value['date-form'])
    const endDate = new Date(this.form.value['date-to'])
    return endDate > startDate
  }
}
