import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.module';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Manaana Sos',
      'Live in Hanoi City',
      'https://static-images.vnncdn.net/files/publish/2022/11/10/world-cup-2022-3-414.jpg',
      999.99,
      new Date('2022-01-01'),
      new Date('2022-12-31'),
      'abc'
    ),
    new Place(
      'p2',
      'Hasdna Boss',
      'Live in HCM City',
      'https://ocdn.eu/images/pulscms/ZDA7MDA_/ac7fb458170768b1cf6b04cf46b315e5.jpg',
      89.99,
      new Date('2022-01-01'),
      new Date('2022-12-31'),
      'abc'
    ),
    new Place(
      'p3',
      'Vesres OOO',
      'Live asd12312 City',
      'https://assets.goal.com/v3/assets/bltcc7a7ffd2fbf71f5/bltaa2d6f726c434445/62581a4ca94b2956de108200/World_Cup_2022_trophy_general_view.jpg?auto=webp&fit=crop&format=jpg&height=800&quality=60&width=1200',
      459.99,
      new Date('2022-01-01'),
      new Date('2022-12-31'),
      'abc'
    ),
  ]);

  get places() {
    return this._places.asObservable()
  }

  getPlace(id: string) {
    return this.places.pipe(take(1), map(places => {
      return { ...places.find(p => p.id === id) }
    }))
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

    return this.places.pipe(take(1), delay(1000), tap(places => {
      this._places.next(places.concat(newPlace))
    }))
  }

  constructor(private authService: AuthService) {}
}
