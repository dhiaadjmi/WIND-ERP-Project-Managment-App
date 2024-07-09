import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private backlogCreatedSource = new BehaviorSubject<boolean>(false);

  private backlogUpdatedSource = new Subject<void>();

  backlogUpdated$ = this.backlogUpdatedSource.asObservable();

  private sprintAddedSource = new Subject<void>();
  sprintAdded$ = this.sprintAddedSource.asObservable();

  notifyBacklogUpdated() {
    this.backlogUpdatedSource.next();
  }

  backlogCreated$ = this.backlogCreatedSource.asObservable();

  notifyBacklogCreated() {
    this.backlogCreatedSource.next(true);
  }
  backlogAddedForSprint: EventEmitter<number> = new EventEmitter<number>();

  notifySprintAdded() {
    this.sprintAddedSource.next();
  }

}
