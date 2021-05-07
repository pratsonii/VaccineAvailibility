import { switchMap } from 'rxjs/operators';
import { AppServiceService } from './app-service.service';
import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { Howl } from 'howler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'vaccine';
  listOfData: any;
  counter = 30;
  constructor (private service: AppServiceService) {
    this.service.subscribeTodata();
  }

  ngOnInit(): void {
    const sound = new Howl({
      src: ['../assets/mp3/sound.mp3']
    });

    this.service.subscribeTodata().subscribe(data => data.subscribe((data: any[]) => {
      this.listOfData = [];
      this.listOfData = data;
      this.counter = 30;

      if (this.listOfData && this.listOfData.length > 0) {
        sound.play();
      }
    }));

    const fixedValue = 29;
    this.service.subscribeTodata().pipe(switchMap(() => interval(1000))).subscribe(val => this.counter = fixedValue - val);
  }
}
interface ItemData {
  name: string;
  age: number;
  address: string;
}