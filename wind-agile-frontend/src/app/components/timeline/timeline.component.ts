import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SprintService } from 'src/app/services/sprint.service';
import { UserService } from 'src/app/services/user.service';
import { UserDetailsComponent } from 'src/app/components/user-details/user-details.component';
import { TaskUpdateService } from 'src/app/services/task-update.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  @Input() sprintId: any;
  sprint: any;
  tasks: any[] = [];
  usersInfo: any = {};
  taskPriorityTranslations: Record<string, string> = {
    HIGH: 'Élevée',
    MEDIUM: 'Moyenne',
    LOW: 'Faible'
  };


  public data?: object[];
  public taskSettings?: object;
  public timelineSettings?: object;
  public labelSettings?: object;
  public taskbarHeight?: number;
  public rowHeight: any;
  taskStateTranslations: Record<string, string> = {
    IN_PROGRESS: 'En cours',
    COMPLETED: 'Terminé',
    ON_HOLD: 'En attente',
    CANCELED: 'Annulé'
  };

  constructor(
    private sprintService: SprintService,
    private userService: UserService,
    public dialog: MatDialog,
    private taskUpdateService:TaskUpdateService,
    private taskService:TaskService



  ) { }

  ngOnInit(): void {
    console.log('ID sprint for timeline :', this.sprintId);
    this.loadSprintTasks(this.sprintId);


    this.taskUpdateService.stateUpdated.subscribe((updatedTask: { taskId: number, newState: string }) => {
      this.loadSprintTasks(this.sprintId);
    });
    this.taskUpdateService.taskUpdatedTimeline.subscribe(( updatedTask: { taskId: number, newState: string }) => {
      this.loadSprintTasks(this.sprintId);
    });
    this.taskUpdateService.taskAddedTimeline.subscribe(( addedTask: { taskId: number }) => {
      this.loadSprintTasks(this.sprintId);
    });
    this.taskUpdateService.taskdeleted.subscribe(({ }) => {
      this.loadSprintTasks(this.sprintId);
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

    this.labelSettings = {
      rightLabel: this.taskPriorityTranslations['priority']
    };

    this.rowHeight = 51;
    this.taskbarHeight = 40;
  }
  loadSprintTasks(sprintId: number): void {
    this.taskService.getTasksBySprintId(sprintId).subscribe(
      (tasks: any[]) => {
        this.tasks = tasks;
        console.log('Tasks received:', this.tasks);
        this.fetchUserDetails(0);
      },
      (error) => {
        console.error('An error occurred while loading sprint:', error);
      }
    );
  }

  fetchUserDetails(index: number): void {
    if (index < this.tasks.length) {
      const task = this.tasks[index];
      if (task.userId) {
        this.userService.getUserDetails(task.userId).subscribe(
          (userData: any) => {
            console.log("User data for user ID", task.userId, ":", userData);
            task.profileImageUrl = this.generateProfileImageUrl(userData.profileImageUrl);
            task.firstname = userData.firstname;
            task.lastname = userData.lastname;
            this.fetchUserDetails(index + 1);

          },
          (error) => {
            console.error('An error occurred while fetching user details:', error);
            this.fetchUserDetails(index + 1);
          }
        );
      } else {
        this.fetchUserDetails(index + 1);
      }
    } else {
      this.initializeGanttData();
    }
  }

  generateProfileImageUrl(imageUrl: string): string {
    return 'http://localhost:8060/images/' + imageUrl;
  }

  initializeGanttData(): void {
    this.data = this.tasks.map(task => ({
      id: task.id,
      name: task.name,
      state: task.state,
      startDate: task.startDate,
      endDate: this.calculateEndDate(task.startDate, task.estimation),
      profileImageUrl: task.profileImageUrl,
      firstname: task.firstname,
    lastname: task.lastname,
      estimation: task.estimation,
      priority: task.priority,
      userId: task.userId
    }));
    console.log("taks data for timeline",this.data)

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
