import { Component } from '@angular/core';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { UpdateTaskDialogComponent } from '../update-task-dialog/update-task-dialog.component';
import { TaskService } from 'src/app/services/task.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-user-tasks-kanban',
  templateUrl: './user-tasks-kanban.component.html',
  styleUrls: ['./user-tasks-kanban.component.scss']
})
export class UserTasksKanbanComponent {
  tasks: any;
  filteredTasks: any;
  userInfo: any = {};

  constructor(private taskService: TaskService,
    private authService:AuthenticationService,
    private userService:UserService,

    private dialog: MatDialog,
    ) {}
    ngOnInit(): void {
      const userId = this.authService.getUserId();
      console.log("User ID:", userId);

      if (userId) {
        this.getTasksByUser(Number(userId));
      } else {
        console.error('User ID not found in local storage');
      }
      this.fetchUserDetails()
    }
    getTasksByUser(userId: number): void {
      this.taskService.getTaskByUserId(userId).subscribe(tasks => {
        console.log("tasks de projet:", tasks);
        this.tasks = tasks;
        this.filteredTasks = tasks;
      });
    }
    openUpdateTaskDialog(taskId:any): void {
      const dialogRef = this.dialog.open(UpdateTaskDialogComponent, {
        width: '1200px',
        data: { taskId},
        position: { right: '10px' }
      });


      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }
    openTaskDetails(taskId: number): void {

      const dialogRef = this.dialog.open(TaskDetailsComponent, {
        width: '1000px',
        height:'600px',
        data: { taskId: taskId },
        position: { right: '80px' }

      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }
    getTasksByState(state: string): any[] {
      return this.tasks.filter((task: { state: string; }) => task.state === state);
    }
    fetchUserDetails(): void {
      const userId = this.authService.getUserId();

      this.userService.getUserDetails(userId).subscribe(
        (userData: any) => {
          console.log("User data for user ID", userId, ":", userData);
          // Assurez-vous que userData contient profileImageUrl
          console.log("Profile image URL:", userData.profileImageUrl);
          this.userInfo = userData;
          if (userData.profileImageUrl) {
            this.userInfo.profileImageUrl = this.generateProfileImageUrl(userData.profileImageUrl);
          }
        },
        (error) => {
          console.error('An error occurred while fetching user details:', error);
        }
      );
    }


    generateProfileImageUrl(imageUrl: string): string {
      return 'http://localhost:8060/images/' + imageUrl;
    }


    updateTaskState(taskId: number, newState: string): void {
      const userId = this.authService.getUserId();

      const updatedTaskState = { state: newState };
      this.taskService.updateTaskState(taskId, updatedTaskState).subscribe(
        (response) => {
          console.log('L\'état de la tâche a été mis à jour avec succès :', response);
          this.getTasksByUser(Number(userId));


        },
        (error) => {
          console.error('Une erreur s\'est produite lors de la mise à jour de l\'état de la tâche :', error);
        }
      );
    }



    drop(event: CdkDragDrop<any>) {
      const taskIdAttribute = event.item.element.nativeElement.getAttribute('data-task-id');
      if (!taskIdAttribute) {
        console.error('L\'attribut data-task-id est manquant.');
        return;
      }

      const taskId = parseInt(taskIdAttribute);
      let newState: string;

      if (event.previousContainer === event.container) {
        newState = this.getTaskStateFromColumnId(event.container.id);
      } else {
        newState = this.getNewTaskState(event.container.id);
      }

      this.updateTaskState(taskId, newState);
    }



  private getTaskStateFromColumnId(columnId: string): string {
    switch (columnId) {
      case 'onHoldColumn':
        return 'ON_HOLD';
      case 'inProgressColumn':
        return 'IN_PROGRESS';
      case 'completedColumn':
        return 'COMPLETED';
      case 'canceledColumn':
        return 'CANCELED';
      default:
        throw new Error(`Identifiant de colonne non reconnu : ${columnId}`);
    }
  }

  private getNewTaskState(columnId: string): string {
    switch (columnId) {
      case 'onHoldColumn':
        return 'ON_HOLD';
      case 'inProgressColumn':
        return 'IN_PROGRESS';
      case 'completedColumn':
        return 'COMPLETED';
      case 'canceledColumn':
        return 'CANCELED';
      default:
        throw new Error(`Identifiant de colonne non reconnu : ${columnId}`);
    }
  }







    }




