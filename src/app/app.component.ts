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
  notiAlert = 'Click here to enable Notification Sound';
  notiColor = 'error';
  sound: any;
  tableRefresh = false;

  constructor (private service: AppServiceService) {
    this.service.subscribeTodata();
  }

  ngOnInit(): void {
    this.sound = new Howl({
      src: ['../assets/mp3/sound.mp3']
    });

    this.service.subscribeTodata().subscribe(data => data.subscribe((data: any[]) => {
      this.listOfData = [];
      this.listOfData = data;
      this.counter = 30;

      if (this.listOfData && this.listOfData.length > 0) {
        this.sound.play();
      }

      this.tableRefresh = true;
      setTimeout(() => {
        this.tableRefresh = false;
      }, 1500);

    }));

    const fixedValue = 29;
    this.service.subscribeTodata().pipe(switchMap(() => interval(1000))).subscribe(val => this.counter = fixedValue - val);
  }

  enableSound() {
    this.notiAlert = 'Notification Sound Enabled';
    this.notiColor = 'success';
    this.sound.play();
  }
}