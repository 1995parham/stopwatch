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
  private offset: number;
  private stop$: Subject<boolean> = new Subject<boolean>();

  public delta: Date = new Date(0);
  public active: boolean;

  constructor() {
    this.offset = 0;
    this.active = false;
  }

  private update(): void {
    this.delta = new Date(performance.now() - this.since + this.offset);
  }

  /**
   * handles space event to stop/start the timer with ease
   */
  @HostListener('window:keyup.space', ['$event'])
  public spaceHandler($event: any) {
    if (!this.active) {
      this.start();
    } else {
      this.stop();
    }
  }


  /**
   * prevents page from refreshing when user have unsaved data.
   */
  @HostListener('window:beforeunload', ['$event'])
  public unloadNotification(event: any) {
    event.preventDefault();

    if (!this.active && this.offset === 0) {
      return;
    }

    event.returnValue = 'It looks like you have been editing something. '
      + 'If you leave before saving, your changes will be lost.';
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
    this.offset = this.delta.getTime();
  }

  /**
   * reset resets all parameters to zero
   */
  public reset(): void {
    this.stop();
    this.delta = new Date(0);
    this.offset = 0;
  }
}
