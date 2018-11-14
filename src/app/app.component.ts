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
    this.shift = 0;
  }

  private update(): void {
    this.delta = new Date(performance.now() - this.since + this.shift);
  }

  ngOnInit() {
  }

  /**
   * start starts the timer by registering it.
   * it changes since parameter.
   */
  public start(): void {
    this.since = performance.now();

    this.timerID = window.setInterval(
      this.update.bind(this), 10
    ); // each 10 ms updates the time difference.
  }

  /**
   * stop stops timer and saves its last value
   */
  public stop(): void {
    if (this.timerID) {
      window.clearInterval(this.timerID);
    }
    this.shift = this.delta.getTime();
  }

  /**
   * reset resets all parameters to zero
   */
  public reset(): void {
    this.stop();
    this.delta = new Date(0);
    this.shift = 0;
  }
}
