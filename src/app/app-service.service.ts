import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { timer, Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  cowidApi = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict';
  constructor (private http: HttpClient, private datepipe: DatePipe) { }

  subscribeTodata(): Observable<Observable<any[]>> {
    const source = timer(0, 1000 * 30);
    return source.pipe(map(val => this.callCowidApi(770, this.datepipe.transform(new Date(), 'dd-MM-yyyy'))));
  }

  callCowidApi(distId, date) {
    return this.http.get(`${this.cowidApi}?district_id=${distId}&date=${date}`).pipe(
      map(data => this.transformApiResponse(data))
    );
  }

  transformApiResponse(data: any) {
    let centers: any[] = data.centers;

    return centers.flatMap(center => this.mapCenterWithSlots(center)).filter(c => c.min_age_limit === 18 && c.available_capacity > 0);

  }

  mapCenterWithSlots(center) {
    return center.sessions.map(s => ({
      name: center.name,
      pincode: center.pincode,
      vaccine: s.vaccine,
      min_age_limit: s.min_age_limit,
      available_capacity: s.available_capacity,
      date: s.date
    }));
  }
}