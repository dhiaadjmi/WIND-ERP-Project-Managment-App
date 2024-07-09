import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { AddSprintComponent } from '../add-sprint/add-sprint.component';
import { AddTaskComponent } from '../add-task/add-task.component';
import { SprintService } from 'src/app/services/sprint.service';
import { UpdateSprintDialogComponent } from '../update-sprint-dialog/update-sprint-dialog.component';
import { UserService } from 'src/app/services/user.service';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { TaskService } from 'src/app/services/task.service';
import Swal from 'sweetalert2';
import { TeamService } from 'src/app/services/team.service';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';
import { TaskUpdateService } from 'src/app/services/task-update.service';
import { SharedService } from 'src/app/services/shared.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project-sprints',
  templateUrl: './project-sprints.component.html',
  styleUrls: ['./project-sprints.component.scss']
})
export class ProjectSprintsComponent {


  //@Input() sprints: any[];
  sprints: any[];
  @Input() backlog: any;
  @Input() teamId: number;
  usersInfo: any = {};
  userRole:any;
  selectedTaskIdtaskId: number;
  selectedSprintId: number;
  selectedTaskId: number;
  backlogId: number;
  teamInfo: any;
  userMenu: any;
  tasks: any[];

  selectedUserId:any;
  IN_PROGRESS = 'IN_PROGRESS';

  filteredSprints: any[];
  selectedFilter: string = 'ALL';
  stateTranslations: Record<string, string> = {
    IN_PROGRESS: 'En cours',
    COMPLETED: 'Terminé',
    ON_HOLD: 'En attente',
    REPORTED: 'Reporté'
  };

  taskStateTranslations: Record<string, string> = {
    IN_PROGRESS: 'En cours',
    COMPLETED: 'Terminé',
    ON_HOLD: 'En attente',
    CANCELED: 'Annulé'
  };
  constructor(private router: Router,
    private dialog: MatDialog,
    private sprintService: SprintService,
    private userService: UserService,
    private authService: AuthenticationService,
    private taskService: TaskService,
     private taskUpdateService: TaskUpdateService,
    private teamService: TeamService,
    private sharedService: SharedService,
    private toastr: ToastrService) {}



  ngOnInit(): void {
    this.sharedService.backlogAddedForSprint.subscribe((backlogId: number) => {
      this.getSprintsByBacklog(backlogId);
    });


    this.getSprintsByBacklog(this.backlog.id);


    this.sharedService.backlogUpdated$.subscribe(() => {
      this.getSprintsByBacklog(this.backlog.id);
    });




    this.backlogId = this.backlog ? this.backlog.id : null;
    this.filteredSprints = this.sprints;

    this.userRole = this.authService.getRole();
    this.getTeamInfo(this.teamId);
    this.loadSprintsForTasks();



  }

  onFilterChange(event: any) {
    this.selectedFilter = event.value;
    const filterValue = this.selectedFilter.toUpperCase();

    console.log("Valeur du filtre :", filterValue);

    if (filterValue === 'ALL') {
        this.filteredSprints = this.sprints;
    } else {
      this.filteredSprints = this.sprints.filter(sprint => {
        const sprintState = sprint.state ? sprint.state.toUpperCase() : null;
        const isFiltered = sprintState === filterValue;
        console.log("Sprint :", sprint, "Filtré ?", isFiltered);
        return isFiltered;
    });

    }

    console.log("Sprints filtrés :", this.filteredSprints);
}
/**
getSprintsByBacklog(backlogId: number): void {
  console.log('ID du backlog de sprint :', backlogId);
  this.sprintService.getSprintsByBacklog(backlogId).subscribe(
    (data: any[]) => {
      console.log("jszb", data);
      data.sort((a, b) => {
        if (a.defaultSprint && !b.defaultSprint) {
          return -1;
        } else if (!a.defaultSprint && b.defaultSprint) {
          return 1;
        } else {
          return 0;
        }
      });
      this.sprints = data;
      this.filteredSprints = this.sprints;
      this.sprints.forEach(sprint => {
        this.loadSprintTasks(sprint.id);
      });
    },
    (error) => {
      console.log('Une erreur s\'est produite lors de la récupération des sprints :', error);
    }
  );
}
*/




/**getSprintsByBacklog(backlogId: number): void {
  console.log('ID du backlog de sprint :', backlogId);
  this.sprintService.getSprintsByBacklog(backlogId).subscribe(
    (data: any[]) => {
      console.log("jszb", data);
      // Trier les sprints par priorité
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
      this.filteredSprints = this.sprints;
      this.sprints.forEach(sprint => {
        this.loadSprintTasks(sprint.id);
      });
    },
    (error) => {
      console.log('Une erreur s\'est produite lors de la récupération des sprints :', error);
    }
  );
}
*/
getSprintsByBacklog(backlogId: number): void {
  console.log('ID du backlog de sprint :', backlogId);
  this.sprintService.getSprintsByBacklog(backlogId).subscribe(
    (data: any[]) => {
      console.log("Sprints récupérés :", data);
      const filteredData = data.filter(sprint => !sprint.defaultSprint);

      filteredData.sort((a, b) => a.priority - b.priority);

      this.sprints = filteredData.map((sprint, index) => {
        sprint.displayName = `Sprint ${index + 1}: ${sprint.name}`;
        return sprint;
      });
      this.filteredSprints = this.sprints;
      this.sprints.forEach(sprint => {
        this.loadSprintTasks(sprint.id);
      });
    },
    (error) => {
      console.log('Une erreur s\'est produite lors de la récupération des sprints :', error);
    }
  );
}



loadSprintTasks(sprintId: number): void {
  console.log("Chargement des tâches pour le sprint avec l'ID :", sprintId);
  this.taskService.getTasksBySprintId(sprintId).subscribe(
    (tasks: any[]) => {
      console.log("Tâches chargées pour le sprint avec l'ID", sprintId, ":", tasks);
      const sprint = this.sprints.find(s => s.id === sprintId);
      if (sprint) {
        sprint.tasks = tasks;
        tasks.forEach(task => {
          this.userService.getUserDetails(task.userId).subscribe(
            (userData: any) => {
              if (!this.usersInfo[task.userId]) {
                this.usersInfo[task.userId] = userData;
                if (userData.profileImageUrl) {
                  this.usersInfo[task.userId].profileImageUrl = this.generateProfileImageUrl(userData.profileImageUrl);
                }
              }
            },
            (error) => {
              console.error('Une erreur s\'est produite lors de la récupération des détails de l\'utilisateur :', error);
            }
          );
        });
      }
    },
    (error) => {
      console.error('Une erreur s\'est produite lors du chargement des tâches du sprint :', error);
    }
  );
}





generateProfileImageUrl(imageUrl: string): string {
  return 'http://localhost:8060/images/' + imageUrl;
}











  openTaskDetails(taskId: number): void {

    const dialogRef = this.dialog.open(TaskDetailsComponent, {
      width: '1000px',
      height: '600px',


      data: { taskId: taskId },
     // position: { right: '80px' }

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
 /**  reloadSprints(backlogId: number): void {
    this.sprintService.getSprintsByBacklog(backlogId).subscribe(
      (sprints: any[]) => {
        this.sprints = sprints;
        this.filteredSprints = this.sprints;
      },
      error => {
        console.error('Erreur lors du chargement des sprints :', error);
      }
    );
  }
*/

  openAddSprintDialog(): void {
    const dialogRef = this.dialog.open(AddSprintComponent, {
      width: '1200px',
     // position: { right: '10px' },
      data: { backlogId: this.backlog.id }

    });
    dialogRef.componentInstance.sprintAdded.subscribe(() => {
   //   this.reloadSprints(this.backlog.id);
   this.getSprintsByBacklog(this.backlog.id);
   this.sharedService.notifySprintAdded();



       });

    dialogRef.afterClosed().subscribe(result => {

      console.log('Le dialogue a été fermé avec le résultat :', result);
    });
  }

  viewSprintDetails(sprintId: number) {
    this.router.navigate(['/component/sprintdetails', sprintId,this.teamId]);
  }
  openAddTaskDialog(sprintId: number): void {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '1200px',
     // position: { right: '10px' },
      data: { sprintId: sprintId ,backlogId: this.backlog.id,teamId: this.teamId  }
    });
    dialogRef.componentInstance.taskAdded.subscribe(() => {
   //   this.reloadSprints(this.backlog.id);
   this.getSprintsByBacklog(this.backlog.id);

     });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Le dialogue a été fermé avec le résultat :', result);
    });
  }

  openUpdateSprintDialog(sprintId: number): void {
    const dialogRef = this.dialog.open(UpdateSprintDialogComponent, {
      width: '1200px',
      data: { sprintId: sprintId },
     // position: { right: '10px' }
    });
    dialogRef.componentInstance.sprintUpdated.subscribe(() => {
   //   this.reloadSprints(this.backlog.id);
   this.getSprintsByBacklog(this.backlog.id);
  });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Le dialogue de mise à jour du sprint a été fermé avec le résultat :', result);
    });
  }

  openUserDetails(user: any): void {
    this.dialog.open(UserDetailsComponent, {
      width: '600px',
     // position: { right: '290px' },
      data: user
    });
  }
  selectSprint(sprintId: number, taskId: number) {
    this.selectedSprintId = sprintId;
    this.selectedTaskId = taskId;

}

/**
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
*/

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
selectUser(userId: number) {
  this.selectedUserId = userId;
}

associateToUser(taskId: number, userId: number) {
  this.taskService.assignTaskToUser(taskId, userId).subscribe(
    response => {
      console.log('Tâche associée avec succès à l\'utilisateur :', userId);
      this.toastr.success('Tâche associée avec succès à l\'utilisateur.', 'Succès');
      this.getSprintsByBacklog(this.backlog.id);
    },
    error => {
      console.error('Erreur lors de l\'association de la tâche à l\'utilisateur :', error);
      this.toastr.error('Erreur lors de l\'association de la tâche à l\'utilisateur.', 'Erreur');
    }
  );
}

  loadSprintsForTasks(): void {
    this.sprints.forEach((sprint) => {
      sprint.tasks.forEach((task: any) => {
        this.getSprintsForTask(task.id);
      });
    });
  }


  getSprintsForTask(taskId: number): void {
    this.sprintService.getSprintsByTaskId(taskId).subscribe(
      (data: any[]) => {
        console.log('Nombre de sprints pour la tâche avec l\'ID', taskId, ':', data.length);
        const taskToUpdate = this.sprints.find(task => task.id === taskId);
        if (taskToUpdate) {
          taskToUpdate.numSprints = data.length;
        }
      },
      (error) => {
        console.log('Une erreur s\'est produite lors de la récupération des sprints pour la tâche :', error);
      }
    );
  }

  openImageDialog(taskId: string): void {
    const dialogRef = this.dialog.open(ImageDialogComponent, {
      width: '600px',
      data: { taskId: taskId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
    });
  }

  startSprint(sprintId: number): void {
    const backlogId = this.backlogId;
    this.sprintService.startSprint(sprintId, backlogId).subscribe(
      (response: any) => {
        console.log('Sprint started successfully:', response);
        this.getSprintsByBacklog(this.backlogId);

        this.toastr.success('Sprint démarré avec succès.', 'Succès', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          progressBar: true
        });
      },
      (error: any) => {
        console.error('Error starting sprint:', error);
        this.toastr.error('Une erreur s\'est produite lors du démarrage du sprint. Veuillez réessayer.', 'Erreur', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          progressBar: true
        });
      }
    );
  }


  onDeleteSprint(sprintId: number): void {
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
        this.sprintService.softDeleteSprint(sprintId).subscribe(() => {
          this.toastr.success('Le sprint a été supprimé avec succès.', 'Supprimé!', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
          });
          this.getSprintsByBacklog(this.backlog.id);
        }, (error) => {
          this.toastr.error('Une erreur s\'est produite lors de la suppression du sprint.', 'Erreur!', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
          });
          console.error('Error soft deleting sprint:', error);
        });
      }
    });
  }



}


