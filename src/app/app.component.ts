import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  private since: number;
  private shift: number;
  private timerID: number;

  public delta: Date = new Date(0);

  constructor() {
  }

  private update(): void {
    this.delta = new Date(performance.now() - this.since + this.shift);
  }

  ngOnInit() {
  }

  public start(): void {
    this.since = performance.now();

    this.timerID = window.setInterval(
      this.update.bind(this), 100
    ); // each 100ms updates UI
  }

  public stop(): void {
    if (this.timerID) {
      window.clearInterval(this.timerID);
    }
    this.shift = this.delta.getTime();
  }

  public reset(): void {
    this.stop();
    this.delta = new Date(0);
    this.shift = 0;
  }
}
