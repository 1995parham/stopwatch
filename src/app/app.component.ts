import { Component, HostListener } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  private since: number;
  private shift: number;
  private stop$: Subject<boolean> = new Subject<boolean>();

  public delta: Date = new Date(0);
  public active: boolean;

  constructor() {
    this.shift = 0;
    this.active = false;
  }

  private update(): void {
    this.delta = new Date(performance.now() - this.since + this.shift);
  }

  ngOnInit() {
  }

  /**
   * prevents page from refreshing when user have unsaved data.
   */
  @HostListener('window:beforeunload', ['$event'])
  public unloadNotification($event: any) {
    if (!this.active && this.shift === 0) {
      return undefined;
    }

    var confirmationMessage = 'It looks like you have been editing something. '
      + 'If you leave before saving, your changes will be lost.';

    ($event || window.event).returnValue = confirmationMessage; //Gecko + IE
    return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
  }

  /**
   * start starts the timer by registering it.
   * it changes since parameter.
   */
  public start(): void {
    // do nothing if the timer is in the running state
    if (this.active) {
      return;
    }
    // changes timer state to running
    this.active = true;

    this.since = performance.now();

    interval(10).pipe(takeUntil(this.stop$)).subscribe(
      () => this.update()
    ); // each 10 ms updates the time difference.
  }

  /**
   * stop stops timer and saves its last value
   */
  public stop(): void {
    this.stop$.next(true);
    this.active = false;
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
