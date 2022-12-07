import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { Place } from '../../place.module';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  place!: Place;
  private placeSub!: Subscription

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      console.log(paramMap.get('placeId'));

      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.placeSub = this.placesService.getPlace(paramMap.get('placeId')!).subscribe(place => {
        this.place = place
      })

      console.log(this.place);
    });
  }

  ngOnDestroy(): void {
    if(this.placeSub){
      this.placeSub.unsubscribe()
    }
  }

  onBookPlace() {
    // this.router.navigateByUrl('/places/tabs/discover')
    // this.navCtrl.navigateBack('/places/tabs/discover');

    this.modalCtrl
      .create({
        component: CreateBookingComponent,
        componentProps: { selecterPlace: this.place },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss()
      }).then(resultData => {
        console.log(resultData);
        if(resultData.role === 'confirm'){
          console.log('BOOK!');
        }
      })

      this.actionSheetCtrl.create({
        header: 'Choose an Action',
        buttons: [
          {
            text: 'Select Date',
            handler: () => {
              this.openBookingModal('select')
            }
          },
          {
            text: 'Random Date',
            handler: () => {
              this.openBookingModal('random')
            }
          },
          {
            text: 'Cancel',
            role: 'cancel'
          },
        ]
      }).then(actionSheetEl => {
        actionSheetEl.present()
      })
  }

  openBookingModal(mode: 'select' | 'random'){
    console.log(mode);

  }
}
