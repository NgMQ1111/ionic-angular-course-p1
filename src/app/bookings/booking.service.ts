import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, switchMap, take, tap } from 'rxjs';
import { Booking } from './booking.module';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';

interface BookingData {
  bookedFrom: string;
  bookedTo: string;
  fisrtName: string;
  guestNumber: number;
  lastName: string;
  placeId: string;
  placeImage: string;
  placeTitle: string;
  userId: string;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private _bookings = new BehaviorSubject<Booking[]>([]);

  get bookings() {
    return this._bookings.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {}

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    fisrtName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let generatedId: string;
    const newBooking = new Booking(
      Math.random().toString(),
      placeId,
      this.authService.userId,
      placeTitle,
      placeImage,
      fisrtName,
      lastName,
      guestNumber,
      dateFrom,
      dateTo
    );

    return this.http
      .post<{ name: string }>(
        'https://ionic-project-http-request-default-rtdb.asia-southeast1.firebasedatabase.app/bookings.json',
        { ...newBooking, id: null }
      )
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this.bookings;
        }),
        take(1),
        delay(1000),
        tap((bookings) => {
          this._bookings.next(bookings.concat(newBooking));
        })
      );

    // return this.bookings.pipe(
    //   take(1),
    //   delay(1000),
    //   tap((bookings) => {
    //     this._bookings.next(bookings.concat(newBooking));
    //   })
    // );
  }

  cancelBooking(bookingId: string) {
    return this.http
      .delete(
        `https://ionic-project-http-request-default-rtdb.asia-southeast1.firebasedatabase.app/bookings/${bookingId}.json`
      )
      .pipe(
        switchMap(() => {
          return this.bookings;
        }),
        take(1),
        delay(1000),
        tap((bookings) => {
          this._bookings.next(bookings.filter((b) => b.id !== bookingId));
        })
      );

    // return this.bookings.pipe(
    //   take(1),
    //   delay(1000),
    //   tap((bookings) => {
    //     this._bookings.next(bookings.filter((b) => b.id !== bookingId));
    //   })
    // );
  }

  fetchBooking() {
    return this.http
      .get<{ [key: string]: BookingData }>(
        `https://ionic-project-http-request-default-rtdb.asia-southeast1.firebasedatabase.app/bookings.json?orderBy="userId"&equalTo="${this.authService.userId}"`
      )
      .pipe(
        map((bookingData) => {
          const bookings = [];
          for (const key in bookingData) {
            if (bookingData.hasOwnProperty(key)) {
              bookings.push(
                new Booking(
                  key,
                  bookingData[key].placeId,
                  bookingData[key].userId,
                  bookingData[key].placeTitle,
                  bookingData[key].placeImage,
                  bookingData[key].fisrtName,
                  bookingData[key].lastName,
                  bookingData[key].guestNumber,
                  new Date(bookingData[key].bookedFrom),
                  new Date(bookingData[key].bookedTo)
                )
              );
            }
          }
          return bookings;
        }),
        tap((bookings) => {
          this._bookings.next(bookings);
        })
      );
  }
}
