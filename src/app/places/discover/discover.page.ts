import { Component, OnInit } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../place.module';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

  loadedPlaces!: Place[]
  listedLoadedPlaces!: Place[]
  private placesSub!: Subscription

  constructor(private placesService: PlacesService) { }

  ngOnInit() {
     this.placesSub = this.placesService.places.subscribe(places => {
      this.loadedPlaces = places
      this.listedLoadedPlaces = this.loadedPlaces.slice(1)
    })
  }

  ngOnDestroy(): void {
    if(this.placesSub){
      this.placesSub.unsubscribe()
    }
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>){
    console.log(event.detail)
  }

}
