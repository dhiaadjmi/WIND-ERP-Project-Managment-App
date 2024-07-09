import { Component, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { MatDialog } from '@angular/material/dialog';
import { UpdateBacklogDialogComponent } from '../update-backlog-dialog/update-backlog-dialog.component';
import { BacklogService } from 'src/app/services/backlog.service';
import { UpdateTaskDialogComponent } from '../update-task-dialog/update-task-dialog.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AddBacklogComponent } from '../add-backlog/add-backlog.component';
import { AddTaskComponent } from '../add-task/add-task.component';
import { AddTaskForBacklogComponent } from '../add-task-for-backlog/add-task-for-backlog.component';
import Swal from 'sweetalert2';
import { TaskService } from 'src/app/services/task.service';
import { ProjectService } from 'src/app/services/project.service';
import { SharedService } from 'src/app/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TaskUpdateService } from 'src/app/services/task-update.service';
import { SprintService } from 'src/app/services/sprint.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-project-backlog',
  templateUrl: './project-backlog.component.html',
  styleUrls: ['./project-backlog.component.scss']
})
export class ProjectBacklogComponent {

  @Input() backlogId: any;
  @Input() projectId: any;
  @Input() teamId: any;

  backlog: any;
  userRole: string;
  defaultSprintId: number | null;
  tasks: any[] = [];
  project: any;
  sprints: any[] = [];
  selectedSprintId: number;
  selectedTaskId: number;
  teamInfo: any;
  selectedUserId:any;

  sprintStateTranslations: Record<string, string> = {
    IN_PROGRESS: 'En cours',
    COMPLETED: 'Terminé',
    ON_HOLD: 'En attente',
    CANCELED: 'Annulé'
  };

  taskStateTranslations: Record<string, string> = {
    IN_PROGRESS: 'En cours',
    COMPLETED: 'Terminé',
    ON_HOLD: 'En attente',
    CANCELED: 'Annulé'
  };

  constructor(private router: Router,
    private dialog: MatDialog,
    private backlogService: BacklogService,
    private authService: AuthenticationService,
    private taskService: TaskService,
    private projectService: ProjectService,
    private sharedService: SharedService,
    private toastr: ToastrService,
    private taskUpdateService: TaskUpdateService,
    private sprintService: SprintService,
    private teamService: TeamService



    ) {}


    ngOnInit(): void {
      this.userRole = this.authService.getRole();
      if (this.projectId) {
        this.getBacklogDetails(this.projectId);
        this.taskUpdateService.taskAddedForBacklog.subscribe((taskId: number) => {
          this.getBacklogDetails(this.projectId);
        });
        this.taskUpdateService.sprintAddedForBacklog.subscribe((sprintId: number) => {
          this.getBacklogDetails(this.projectId);
        });
      } else {
        console.error('Project ID is not defined');
      }
      this.sharedService.backlogAddedForSprint.subscribe(() => {
        this.getSprintsByBacklog(this.backlogId);
      });

      // this.getSprintsByBacklog(this.backlog.id);

      this.sharedService.backlogUpdated$.subscribe(() => {
        this.getSprintsByBacklog(this.backlogId);
      });

    this.sharedService.sprintAdded$.subscribe(() => {
        this.getSprintsByBacklog(this.backlogId);

    });

      this.getTeamInfo(this.teamId);

    }

    getBacklogDetails(projectId: number): void {
      this.projectService.getProjectById(projectId).subscribe(
        (projectData: any) => {
          this.project = projectData;
          console.log('Détails du projet récupérés avec succès :', this.project);

          if (this.project && this.project.backlog) {
            this.backlog = this.project.backlog;
            this.backlogId = this.backlog.id;
            console.log('Backlog associé récupéré avec succès :', this.backlog);

            this.defaultSprintId = this.getDefaultSprintId(this.backlog);
            console.log('id de défaut du sprint :', this.defaultSprintId);

            if (this.defaultSprintId !== null) {
              this.loadBacklogTasks(this.defaultSprintId);
            }
            this.sharedService.notifyBacklogUpdated();

            this.getSprintsByBacklog(this.backlog.id);

          } else {
            console.error('Aucun backlog trouvé pour ce projet');
          }
        },
        (error) => {
          console.error('Une erreur s\'est produite lors de la récupération des détails du projet :', error);
        }
      );
    }



  getDefaultSprintId(backlog: any): number | null {
    if (backlog && backlog.sprints) {
      const defaultSprint = backlog.sprints.find((sprint: any) => sprint.defaultSprint === true);
      return defaultSprint ? defaultSprint.id : null;
    }
    return null;
  }

  loadBacklogTasks(sprintId: number): void {
    this.taskService.getTasksBySprintId(sprintId).subscribe(
      (tasks: any[]) => {
        this.tasks = tasks.filter(task => !task.isDeleted);
        console.log('Tasks received:', this.tasks);
      },
      (error) => {
        console.error('An error occurred while loading sprint:', error);
      }
    );
  }








  openAddBacklogDialog(): void {
    const dialogRef = this.dialog.open(AddBacklogComponent, {
      width: '600px',
      position: { right: '290px' },
      data: { projectId: this.projectId }    });



      dialogRef.componentInstance.backlogAdded.subscribe(() => {
        this.getBacklogDetails(this.projectId);
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Le dialogue est fermé', result);
    });
  }


  openTaskDetails(taskId: number): void {

    const dialogRef = this.dialog.open(TaskDetailsComponent, {
      width: '800px',
      height:'600px',
      data: { taskId: taskId },
     // position: { right: '190px' }

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openUpdateBacklogDialog(): void {
    const dialogRef = this.dialog.open(UpdateBacklogDialogComponent, {
      width: '600px',
      data: { backlogId: this.backlog.id },
     // position: { right: '290px' }
    });
    dialogRef.componentInstance.backlogUpdated.subscribe(() => {
      this.getBacklogDetails(this.projectId);
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  openUpdateTaskDialog(taskId:any): void {
    const dialogRef = this.dialog.open(UpdateTaskDialogComponent, {
      width: '1200px',
      data: { taskId},
     // position: { right: '10px' }
    });
    dialogRef.componentInstance.taskUpdated.subscribe(() => {
      this.getBacklogDetails(this.projectId);
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }



  openAddTaskDialog(): void {
    const dialogRef = this.dialog.open(AddTaskForBacklogComponent, {
      width: '1200px',
      position: { right: '10px' },
      data: { sprintId:  this.defaultSprintId ,backlogId: this.backlog.id,teamId: this.teamId }
    });
    dialogRef.componentInstance.taskForBacklogAdded.subscribe(() => {
      this.getBacklogDetails(this.projectId);
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Le dialogue a été fermé avec le résultat :', result);
    });
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
          this.getBacklogDetails(this.backlogId);
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




  getSprintsByBacklog(backlogId: number): void {
    console.log('ID du backlog de sprint :', backlogId);
    this.sprintService.getSprintsByBacklog(backlogId).subscribe(
      (data: any[]) => {
        console.log("Sprints reçus:", data);
        data.sort((a, b) => {
          if (a.defaultSprint && !b.defaultSprint) {
            return -1;
          } else if (!a.defaultSprint && b.defaultSprint) {
            return 1;
          } else {
            return a.priority - b.priority;
          }
        });
        this.sprints = data.map((sprint, index) => {
          if (index === 0) {
            sprint.displayName = sprint.name;
          } else {
            sprint.displayName = `Sprint ${index}: ${sprint.name}`;
          }
          return sprint;
        });
        console.log("Sprints mis à jour :", this.sprints);
      },
      (error) => {
        console.log('Une erreur s\'est produite lors de la récupération des sprints :', error);
      }
    );
  }




  selectSprint(sprintId: number, taskId: number) {
    this.selectedSprintId = sprintId;
    this.selectedTaskId = taskId;

}


associateToSprint(taskId: number, sprintId: number) {
  if (this.backlog) {

    this.taskService.associateTaskWithSprint(taskId, sprintId, this.backlog.id).subscribe(
      response => {
        console.log('Tâche associée avec succès au sprint :', sprintId);
        this.taskService.getTasksBySprintId(sprintId).subscribe((tasks: any[]) => {
          const sprint = this.sprints.find(s => s.id === sprintId);
          if (sprint) {
            sprint.tasks = tasks;
          }
        });
        this.toastr.success('Tâche associée avec succès au sprint.', 'Succès');
        this.getBacklogDetails(this.projectId);
        if (this.defaultSprintId !== null) {
          this.loadBacklogTasks(this.defaultSprintId);
        }
        this.sharedService.notifyBacklogUpdated();

        this.getSprintsByBacklog(this.backlog.id);


      },
      error => {
        console.error('Erreur lors de l\'association de la tâche au sprint :', error);
        this.toastr.error('Erreur lors de l\'association de la tâche au sprint.', 'Erreur');
      }
    );
  } else {
    console.error('Erreur: backlog non défini.');
  }
}



getTeamInfo(teamId: number): void {
  this.teamService.findTeamById(teamId).subscribe(
    (teamInfo: any) => {
      this.teamInfo = teamInfo;
      console.log('Informations sur l\'équipe:', this.teamInfo);
      this.teamInfo.users.forEach((user: { profileImageUrl: string; }) => {
        user.profileImageUrl = this.generateProfileImageUrl(user.profileImageUrl);
      });
    },
    (error) => {
      console.error('Erreur lors de la récupération des informations sur l\'équipe :', error);
    }
  );

}
generateProfileImageUrl(imageUrl: string): string {
  return 'http://localhost:8060/images/' + imageUrl;
}

selectUser(userId: number) {
  this.selectedUserId = userId;
}

associateToUser(taskId: number | null, userId: number | null) {
  console.log('Selected Task ID:', taskId);
  console.log('User ID:', userId);

  if (!taskId) {
    console.error('Erreur: aucune tâche sélectionnée.');
    this.toastr.error('Erreur: aucune tâche sélectionnée.', 'Erreur');
    return;
  }

  if (!userId) {
    console.error('Erreur: aucun utilisateur sélectionné.');
    this.toastr.error('Erreur: aucun utilisateur sélectionné.', 'Erreur');
    return;
  }

  this.taskService.assignTaskToUser(taskId, userId).subscribe(
    response => {
      console.log('Tâche associée avec succès à l\'utilisateur :', userId);
      this.toastr.success('Tâche associée avec succès à l\'utilisateur.', 'Succès');
      //this.getSprintsByBacklog(this.backlog.id);

      if (this.defaultSprintId !== null) {
        this.loadBacklogTasks(this.defaultSprintId);
      }
      this.sharedService.notifyBacklogUpdated();

      this.getSprintsByBacklog(this.backlog.id);

    },
    error => {
      console.error('Erreur lors de l\'association de la tâche à l\'utilisateur :', error);
      this.toastr.error('Erreur lors de l\'association de la tâche à l\'utilisateur.', 'Erreur');
    }
  );
}


}
