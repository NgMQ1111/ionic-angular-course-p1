import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Place } from 'src/app/places/place.module';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace!: Place;
  @Input() selecterMode!: 'select' | 'random'
  @ViewChild('f', { static: true }) form!: NgForm;
  @ViewChild('startDateCtrl', { static: true }) startDate!: NgModel;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
  }

  onBookPlace() {
    if (!this.form.valid && !this.datesValid) {
      return;
    }

    this.modalCtrl.dismiss(
      {
        bookingData: {
          firstName: this.form.value['first-name'],
          lastName: this.form.value['last-name'],
          guestNumber: +this.form.value['guest-number'],
          startDate: new Date(this.form.value['date-from']),
          endDate: new Date(this.form.value['date-to'])
        }
      },
      'confirm'
    );
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel')
  }


  //! Yêu cầu ngày về phải lớn hơn ngày đi
  datesValid(){
    const startDate = new Date(this.form.value['date-from'])
    const endDate = new Date(this.form.value['date-to'])
    return endDate > startDate
  }
}
