import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../place.module';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  offers!: Place[];
  isLoading = false
  private placesSub!: Subscription

  constructor(private placesService: PlacesService, private router: Router) {}

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe(places => {
      this.offers = places
    })
  }

  ionViewWillEnter(){
    this.isLoading = true
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false
    })
  }

  ngOnDestroy(): void {
    if(this.placesSub){
      this.placesSub.unsubscribe()
    }
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/places/tabs/offers/edit', offerId])
    console.log('Editting item', offerId);
  }
}
