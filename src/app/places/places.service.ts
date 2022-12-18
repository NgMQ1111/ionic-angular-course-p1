import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, switchMap, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.module';
import { HttpClient } from '@angular/common/http';

// new Place(
//   'p1',
//   'Manaana Sos',
//   'Live in Hanoi City',
//   'https://static-images.vnncdn.net/files/publish/2022/11/10/world-cup-2022-3-414.jpg',
//   999.99,
//   new Date('2022-01-01'),
//   new Date('2022-12-31'),
//   'xxx'
// ),
// new Place(
//   'p2',
//   'Hasdna Boss',
//   'Live in HCM City',
//   'https://ocdn.eu/images/pulscms/ZDA7MDA_/ac7fb458170768b1cf6b04cf46b315e5.jpg',
//   89.99,
//   new Date('2022-01-01'),
//   new Date('2022-12-31'),
//   'abc'
// ),
// new Place(
//   'p3',
//   'Vesres OOO',
//   'Live asd12312 City',
//   'https://assets.goal.com/v3/assets/bltcc7a7ffd2fbf71f5/bltaa2d6f726c434445/62581a4ca94b2956de108200/World_Cup_2022_trophy_general_view.jpg?auto=webp&fit=crop&format=jpg&height=800&quality=60&width=1200',
//   459.99,
//   new Date('2022-01-01'),
//   new Date('2022-12-31'),
//   'abc'
// ),

interface PlaceData {
  availabelFrom: Date;
  availabelTo: Date;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {}

  fetchPlaces() {
    return this.http
      .get<{ [key: string]: PlaceData }>(
        'https://ionic-project-http-request-default-rtdb.asia-southeast1.firebasedatabase.app/offered-places.json'
      )
      .pipe(
        map((resData) => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  resData[key].availabelFrom,
                  resData[key].availabelTo,
                  resData[key].userId
                )
              );
            }
          }

          return places;
        }),
        tap((places) => {
          this._places.next(places);
        })
      );
  }

  getPlace(id: string) {
    return this.http
      .get<PlaceData>(
        `https://ionic-project-http-request-default-rtdb.asia-southeast1.firebasedatabase.app/offered-places/${id}.json`
      )
      .pipe(
        map((placeData) => {
          console.log(placeData);

          return new Place(
            id,
            placeData.title,
            placeData.description,
            placeData.imageUrl,
            placeData.price,
            new Date(placeData.availabelFrom),
            new Date(placeData.availabelTo),
            placeData.userId
          );
        })
      );

    // return this.places.pipe(
    //   take(1),
    //   map((places) => {
    //     return { ...places.find((p) => p.id === id) };
    //   })
    // );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://static-images.vnncdn.net/files/publish/2022/11/10/world-cup-2022-3-414.jpg',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );

    let generatedId: string;

    return this.http
      .post<{ name: string }>(
        'https://ionic-project-http-request-default-rtdb.asia-southeast1.firebasedatabase.app/offered-places.json',
        { ...newPlace, id: null }
      )
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this.places;
        }),
        take(1),
        delay(1000),
        tap((places) => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );

    // return this.places.pipe(
    //   take(1),
    //   delay(1000),
    //   tap((places) => {
    //     this._places.next(places.concat(newPlace));
    //   })
    // );
  }

  onUpdatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap((places) => {
        const updatePlaceIndex = places.findIndex((pl) => pl.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatePlaceIndex];
        updatedPlaces[updatePlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availabelFrom,
          oldPlace.availabelTo,
          oldPlace.userId
        );

        return this.http.put(
          `https://ionic-project-http-request-default-rtdb.asia-southeast1.firebasedatabase.app/offered-places/${placeId}.json`,
          { ...updatedPlaces[updatePlaceIndex], id: null }
        );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );

    // return this.places.pipe(
    //   take(1),
    //   delay(1000),
    //   tap((places) => {
    //     const updatePlaceIndex = places.findIndex((pl) => pl.id === placeId);
    //     const updatedPlaces = [...places];
    //     const oldPlace = updatedPlaces[updatePlaceIndex];
    //     updatedPlaces[updatePlaceIndex] = new Place(
    //       oldPlace.id,
    //       title,
    //       description,
    //       oldPlace.imageUrl,
    //       oldPlace.price,
    //       oldPlace.availabelFrom,
    //       oldPlace.availabelTo,
    //       oldPlace.userId
    //     );

    //     this._places.next(updatedPlaces);
    //   })
    // );
  }
}
