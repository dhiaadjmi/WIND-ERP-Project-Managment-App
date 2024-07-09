import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskUpdateService {
  stateUpdated: EventEmitter<{ taskId: number, newState: string }> = new EventEmitter();
  taskUpdatedTimeline: EventEmitter<{ }> = new EventEmitter();
  taskAddedTimeline: EventEmitter<{ taskId: number}> = new EventEmitter();
  taskdeleted: EventEmitter<{ }> = new EventEmitter();
  taskAddedForBacklog: EventEmitter<{taskId: number}> = new EventEmitter();
sprintAddedForBacklog:EventEmitter<{sprintId: number}> = new EventEmitter();
  constructor() { }
}
