import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from '../add-task/add-task.component';
import { UpdateTaskDialogComponent } from '../update-task-dialog/update-task-dialog.component';
import { SprintService } from 'src/app/services/sprint.service';
import { UserService } from 'src/app/services/user.service';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { TaskService } from 'src/app/services/task.service';
import { TaskUpdateService } from 'src/app/services/task-update.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit {
  @Input() sprintId: any;
  @Input() teamId: any;

  stateUpdated: EventEmitter<{ taskId: number, newState: string }> = new EventEmitter();
  taskUpdatedData: EventEmitter<{ }> = new EventEmitter();
  taskDeleted: EventEmitter<{ }> = new EventEmitter();

  sprint: any;
  tasks: any[];
  addTaskForm: FormGroup;
  updateIndex: any;
  usersInfo: any = {};
  userRole: any;
  backlogId: any;


  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private sprintService: SprintService,
   private userService:UserService,
   private authService:AuthenticationService,
   private taskService:TaskService,
   private taskUpdateService:TaskUpdateService,
   private toastr: ToastrService



  ) {}

  ngOnInit(): void {
    console.log('ID du sprint pour lrecuperers les taches :', this.sprintId);
    this.loadSprintTasks(this.sprintId);
    this.userRole = this.authService.getRole();
    this.loadSprint(this.sprintId)

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
/**
  loadSprintTasks(sprintId: number): void {
    this.sprintService.getSprintById(sprintId).subscribe(
      (sprintData: any) => {
        this.sprint = sprintData;
        this.tasks = sprintData?.tasks || [];
        console.log('Sprint récupéré :', this.sprint);
        console.log('Tasks reçues :', this.tasks);

        this.fetchUserDetails(0);
      },
      (error) => {
        console.error('Une erreur s\'est produite lors du chargement du sprint :', error);
      }
    );
  }
*/

loadSprint(sprintId: number): void {
  this.sprintService.getSprintById(sprintId).subscribe(
    (sprintData: any) => {
      this.sprint = sprintData;
      this.backlogId = sprintData?.backlogId ;
      console.log('Sprint récupéré :', this.sprint);



    },
    (error) => {
      console.error('Une erreur s\'est produite lors du chargement du sprint :', error);
    }
  );
}

  fetchUserDetails(index: number): void {
    if (index < this.tasks.length) {
      const task = this.tasks[index];
      this.userService.getUserDetails(task.userId).subscribe(
        (userData: any) => {
          console.log("User data for user ID", task.userId, ":", userData);
          this.usersInfo[task.userId] = userData;
          if (userData.profileImageUrl) {
            this.usersInfo[task.userId].profileImageUrl = this.generateProfileImageUrl(userData.profileImageUrl);
          }
          this.fetchUserDetails(index + 1);
        },
        (error) => {
          console.error('An error occurred while fetching user details:', error);
          this.fetchUserDetails(index + 1);
        }
      );
    }
  }


  generateProfileImageUrl(imageUrl: string): string {
    return 'http://localhost:8060/images/' + imageUrl;
  }




/**
  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

    }
  }
*/



openAddTaskDialog(): void {
  const dialogRef = this.dialog.open(AddTaskComponent, {
    width: '1200px',
    position: { right: '10px' },
    data: { sprintId: this.sprintId, backlogId: this.sprint.backlogId, teamId: this.teamId }
  });

  dialogRef.componentInstance.taskAdded.subscribe(() => {
    this.loadSprintTasks(this.sprintId);
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('Le dialogue a été fermé avec le résultat :', result);
  });
}

  getTasksByState(state: string): any[] {
    return this.tasks.filter((task: { state: string; }) => task.state === state);
  }
  openUpdateTaskDialog(taskId:any): void {
    const dialogRef = this.dialog.open(UpdateTaskDialogComponent, {
      width: '1200px',
      data: { taskId},
      position: { right: '10px' }
    });

    dialogRef.componentInstance.taskUpdated.subscribe(() => {

      this.loadSprintTasks(this.sprintId);
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openUserDetails(userId: number): void {
    const user = this.usersInfo[userId];
    if (user) {
      this.dialog.open(UserDetailsComponent, {
        width: '600px',
        position: { right: '290px' },
        data: user
      });
    }
  }
  openTaskDetails(taskId: number): void {

    const dialogRef = this.dialog.open(TaskDetailsComponent, {
      width: '1000px',
      height:'800px',
      data: { taskId: taskId },
      position: { right: '190px' }

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


  updateTaskState(taskId: number, newState: string): void {
    const updatedTaskState = { state: newState };
    this.taskService.updateTaskState(taskId, updatedTaskState).subscribe(
      (response) => {
        console.log('L\'état de la tâche a été mis à jour avec succès :', response);
        this.loadSprintTasks(this.sprintId);
        this.taskUpdateService.stateUpdated.emit({ taskId, newState });


      },
      (error) => {
        console.error('Une erreur s\'est produite lors de la mise à jour de l\'état de la tâche :', error);
      }
    );
  }



  drop(event: CdkDragDrop<any>) {
    if (this.userRole === 'EMPLOYEE') {
      console.warn('Drag and drop is disabled for EMPLOYEE role.');
      return;
    }

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


onDeleteTask(taskId: number): void {
  Swal.fire({
    title: 'Êtes-vous sûr?',
    text: 'Vous ne pourrez pas revenir en arrière!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Oui, supprimez-le!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.taskService.softDeleteTask(taskId).subscribe(() => {
        this.toastr.success('La tâche a été supprimée avec succès.', 'Supprimé!', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          progressBar: true,
        });
        this.loadSprintTasks(this.sprintId);
        this.taskUpdateService.taskdeleted.emit({});
      }, (error) => {
        this.toastr.error('Une erreur s\'est produite lors de la suppression de la tâche.', 'Erreur!', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          progressBar: true,
        });
        console.error('Error soft deleting task:', error);
      });
    }
  });
}




}








