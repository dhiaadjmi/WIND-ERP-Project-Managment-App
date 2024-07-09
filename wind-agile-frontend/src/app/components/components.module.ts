import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';
import { ComponentsRoutes } from './component.routing.module';
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { CompaniesComponent } from './companies/companies.component';
import { HeaderComponent } from '../layouts/full/header/header.component';
import { AddCompanyComponent } from './add-company/add-company.component';
import { UpdateCompanyDialogComponent } from './update-company-dialog/update-company-dialog.component';
import { UsersComponent } from './users/users.component';
import { AddUserComponent } from './add-user/add-user.component';
import { UpdateUserDialogComponent } from './update-user-dialog/update-user-dialog.component';
import { TeamsComponent } from './teams/teams.component';
import { TeamDetailsComponent } from './team-details/team-details.component';
import { ProjectsComponent } from './projects/projects.component';
import { BacklogComponent } from './backlog/backlog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SprintComponent } from './sprint/sprint.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { UpdateUserProfileComponent } from './update-user-profile/update-user-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AddTeamComponent } from './add-team/add-team.component';
import { UpdateTeamDialogComponent } from './update-team-dialog/update-team-dialog.component';
import { AddUserToTeamDialogComponentComponent } from './add-user-to-team-dialog-component/add-user-to-team-dialog-component.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { UpdateProjectDialogComponent } from './update-project-dialog/update-project-dialog.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { TasksComponent } from './tasks/tasks.component';
import { SprintDetailsComponent } from './sprint-details/sprint-details.component';
import { SprintListComponent } from './sprint-list/sprint-list.component';
import { ProjectBacklogComponent } from './project-backlog/project-backlog.component';
import { ProjectSprintsComponent } from './project-sprints/project-sprints.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { AddSprintComponent } from './add-sprint/add-sprint.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { UpdateSprintDialogComponent } from './update-sprint-dialog/update-sprint-dialog.component';
import { UpdateBacklogDialogComponent } from './update-backlog-dialog/update-backlog-dialog.component';
import { UpdateTaskDialogComponent } from './update-task-dialog/update-task-dialog.component';
import { UserTasksComponent } from './user-tasks/user-tasks.component';
import { UserTeamsComponent } from './user-teams/user-teams.component';
import { TeamProjectsComponent } from './team-projects/team-projects.component';
import { AddBacklogComponent } from './add-backlog/add-backlog.component';
import { AddTaskForBacklogComponent } from './add-task-for-backlog/add-task-for-backlog.component';
import { TimelineComponent } from './timeline/timeline.component';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';
import { ImageScreenDialogComponent } from './image-screen-dialog/image-screen-dialog.component';
import { CompanyDashboardComponent } from './company-dashboard/company-dashboard.component';
import { UserTasksKanbanComponent } from './user-tasks-kanban/user-tasks-kanban.component';
import { UserHomepageComponent } from './user-homepage/user-homepage.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { GridAllModule } from '@syncfusion/ej2-angular-grids'
import { GanttModule, LabelSettingsModel, EditService, ToolbarService, SortService } from '@syncfusion/ej2-angular-gantt';
import { UserTimelineComponent } from './user-timeline/user-timeline.component';





@NgModule({
  declarations: [
    TasksListComponent,
    CompaniesComponent,
    AddCompanyComponent,
    UpdateCompanyDialogComponent,
    UsersComponent,
    AddUserComponent,
    UpdateUserDialogComponent,
    TeamsComponent,
    TeamDetailsComponent,
    ProjectsComponent,
    BacklogComponent,
    SprintComponent,
    UpdateProfileComponent,
    UpdateUserProfileComponent,
    ChangePasswordComponent,
    AddTeamComponent,
    UpdateTeamDialogComponent,
    AddUserToTeamDialogComponentComponent,
    AddProjectComponent,
    UpdateProjectDialogComponent,
    ProjectDetailsComponent,
    TasksComponent,
    SprintDetailsComponent,
    SprintListComponent,
    ProjectBacklogComponent,
    ProjectSprintsComponent,
    TaskDetailsComponent,
    UserDetailsComponent,
    AddSprintComponent,
    AddTaskComponent,
    UpdateSprintDialogComponent,
    UpdateBacklogDialogComponent,
    UpdateTaskDialogComponent,
    UserTasksComponent,
    UserTeamsComponent,
    TeamProjectsComponent,
    AddBacklogComponent,
    AddTaskForBacklogComponent,
    TimelineComponent,
    ImageDialogComponent,
    ImageScreenDialogComponent,
    CompanyDashboardComponent,
    UserTasksKanbanComponent,
    UserHomepageComponent,
TimelineComponent,
AdminDashboardComponent,
UserTimelineComponent




  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    GanttModule,


    RouterModule.forChild(ComponentsRoutes),
    TablerIconsModule.pick(TablerIcons),
    GridAllModule,





  ],
  exports: [TablerIconsModule],
  providers: [DatePipe,
    EditService,
    ToolbarService,
    SortService
  ],

})
export class ComponentModule {}
