import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UpdateTaskDialogComponent } from '../update-task-dialog/update-task-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { UserService } from 'src/app/services/user.service';
import { TeamService } from 'src/app/services/team.service';
import { ProjectService } from 'src/app/services/project.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-user-tasks',
  templateUrl: './user-tasks.component.html',
  styleUrls: ['./user-tasks.component.scss']
})
export class UserTasksComponent implements OnInit {
  tasks: any[] = [];
  tasksByProject: any[] = [];
  filteredTasks: any[] = [];
  filteredTasksByProject: any[] = [];
  projects: any[] = [];
  userId: number;

  selectedFilter: string = 'ALL';
  selectedProjectId: number | null = null;
  taskStateTranslations: Record<string, string> = {
    IN_PROGRESS: 'En cours',
    COMPLETED: 'Terminé',
    ON_HOLD: 'En attente',
    CANCELED: 'Annulé'
  };

  constructor(
    private taskService: TaskService,
    private authService: AuthenticationService,
    private userService: UserService,
    private teamService: TeamService,
    private projectService: ProjectService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (this.userId) {
      this.getTasksByUser(this.userId);
      this.loadUserTeams();
    } else {
      console.error('User ID not found in local storage');
    }
  }

  getTasksByUser(userId: number): void {
    this.taskService.getTaskByUserId(userId).subscribe(tasks => {
      console.log("tasks de projet:", tasks);
      this.tasks = tasks;
      this.filteredTasks = tasks;
      this.filterTasks();
    });
  }

  onFilterChange(event: any) {
    this.selectedFilter = event.value;
    this.filterTasks();
  }

  filterTasks() {
    if (this.selectedFilter === 'ALL') {
      this.filteredTasks = this.tasks;
      this.filteredTasksByProject = this.tasksByProject;
    } else {
      this.filteredTasks = this.tasks.filter(task => task.state === this.selectedFilter);
      this.filteredTasksByProject = this.tasksByProject.filter(task => task.state === this.selectedFilter);
    }
  }

  openUpdateTaskDialog(taskId: any): void {
    const dialogRef = this.dialog.open(UpdateTaskDialogComponent, {
      width: '1200px',
      data: { taskId },
      position: { right: '10px' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openTaskDetails(taskId: number): void {
    const dialogRef = this.dialog.open(TaskDetailsComponent, {
      width: '1000px',
      height: '600px',
      data: { taskId: taskId },
      position: { right: '80px' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  loadUserTeams(): void {
    this.userService.getUserDetails(this.userId).subscribe(user => {
      user.teams.forEach((team: { id: number }) => {
        this.teamService.findTeamById(team.id).subscribe(teamDetails => {
          console.log('Détails de l\'équipe :', teamDetails);
          this.fetchTeamProject(team.id);
        });
      });
    });
  }

  fetchTeamProject(teamId: number): void {
    this.projectService.getProjectByTeamId(teamId).subscribe(
      (project) => {
        console.log(`Projet de l'équipe avec l'ID ${teamId} :`, project);
        this.projects.push(project);
        console.log('Liste des projets après ajout:', this.projects);
        this.cdr.detectChanges();
      },
      (error) => {
        console.error(`Erreur lors de la récupération des projets de l'équipe avec l'ID ${teamId}:`, error);
      }
    );
  }

  showAllTasks(): void {
    this.selectedProjectId = null;
    this.getTasksByUser(this.userId);
  }

  onProjectClick(projectId: number): void {
    this.selectedProjectId = projectId;
    this.getTasksByProjectId(projectId);
  }

  getTasksByProjectId(projectId: number): void {
    if (this.userId) {
      this.taskService.getTasksByUserIdAndProjectId(projectId, this.userId).subscribe(tasks => {
        this.tasksByProject = tasks;
        console.log("Tâches du projet:", this.tasksByProject);
        this.filterTasks();
      }, error => {
        console.error("Erreur lors de la récupération des tâches du projet:", error);
      });
    } else {
      console.warn("User ID is not set.");
    }
  }
}
