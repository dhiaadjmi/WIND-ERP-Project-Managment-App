import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';
import { TaskUpdateService } from 'src/app/services/task-update.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-user-timeline',
  templateUrl: './user-timeline.component.html',
  styleUrls: ['./user-timeline.component.scss']
})
export class UserTimelineComponent implements OnInit {
  @Input() userId: any;
  tasks: any[] = [];
  userInfo: any = {};

  public data?: object[];
  public taskSettings?: object;
  public timelineSettings?: object;
  public labelSettings?: object;
  public taskbarHeight?: number;
  public rowHeight: any;

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private dialog: MatDialog,
    private taskUpdateService: TaskUpdateService,
    private authService: AuthenticationService,

  ) { }

  ngOnInit(): void {
    const userId = this.authService.getUserId();

    console.log('User ID for timeline:', userId);
    this.getTasksByUser(userId);
    console.log("Tâches de l'utilisateur:", this.tasks);


    this.taskUpdateService.stateUpdated.subscribe((updatedTask: { taskId: number, newState: string }) => {
      this.getTasksByUser(this.userId);
    });
    this.taskUpdateService.taskUpdatedTimeline.subscribe((updatedTask: { taskId: number, newState: string }) => {
      this.getTasksByUser(this.userId);
    });
    this.taskUpdateService.taskAddedTimeline.subscribe((addedTask: { taskId: number }) => {
      this.getTasksByUser(this.userId);
    });
    this.taskUpdateService.taskdeleted.subscribe(({ }) => {
      this.getTasksByUser(this.userId);
    });

    this.taskSettings = {
      id: 'id',
      name: 'name',
      startDate: 'startDate',
      endDate: 'endDate',
      state: 'state',
      profileImageUrl: 'profileImageUrl',
      estimation: 'estimation',
      priority: 'priority',
      firstname: 'firstname',
      lastname: 'lastname',
    };

    this.timelineSettings = {
      topTier: {
        format: 'MMM dd, yyyy',
        unit: 'Week',
      },
      bottomTier: {
        unit: 'Day',
      },
      taskbarTemplate: '#taskbarTemplate'
    };

   /**  this.labelSettings = {
      rightLabel: 'priority'
    };
    */
    this.rowHeight = 51;
    this.taskbarHeight = 40;
  }

  getTasksByUser(userId: number): void {
    this.taskService.getTaskByUserId(userId).subscribe(tasks => {
      console.log("Tasks for user:", tasks);
      this.tasks = tasks;
      this.initializeGanttData();
    });
  }

  initializeGanttData(): void {
    this.data = this.tasks.map(task => ({
      id: task.id,
      name: task.name,
      state: task.state,
      startDate: task.startDate,
      endDate: this.calculateEndDate(task.startDate, task.estimation),
      firstname: task.firstname,
      lastname: task.lastname,
      estimation: task.estimation,
      priority: task.priority,
      userId: task.userId
    }));
    console.log("Tasks data for timeline", this.data);
  }

  calculateEndDate(startDate: string, estimation: number): string {
    const start = new Date(startDate);
    start.setDate(start.getDate() + estimation);
    return start.toISOString().split('T')[0];
  }

  getTaskbarColor(state: string): string {
    switch (state) {
      case 'ON_HOLD':
        return '#facc15';
      case 'IN_PROGRESS':
        return '#86B6F6';
      case 'CANCELED':
        return '#FA7070';
      case 'COMPLETED':
        return '#A1EEBD';
      default:
        return 'transparent';
    }
  }
}
