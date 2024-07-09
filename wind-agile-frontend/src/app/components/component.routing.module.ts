import { Routes } from '@angular/router';
import { AuthorizationGuard } from '../guards/authorization.guard';

import { TasksListComponent } from './tasks-list/tasks-list.component';
import { CompaniesComponent } from './companies/companies.component';
import { AddCompanyComponent } from './add-company/add-company.component';
import { UpdateCompanyDialogComponent } from './update-company-dialog/update-company-dialog.component';
import { UsersComponent } from './users/users.component';
import { AddUserComponent } from './add-user/add-user.component';
import { UpdateUserDialogComponent } from './update-user-dialog/update-user-dialog.component';
import { TeamsComponent } from './teams/teams.component';
import { TeamDetailsComponent } from './team-details/team-details.component';
import { ProjectsComponent } from './projects/projects.component';
import { BacklogComponent } from './backlog/backlog.component';
import { SprintComponent } from './sprint/sprint.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { UpdateUserProfileComponent } from './update-user-profile/update-user-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AddTeamComponent } from './add-team/add-team.component';
import { UpdateTeamDialogComponent } from './update-team-dialog/update-team-dialog.component';
import { AddUserToTeamDialogComponentComponent } from './add-user-to-team-dialog-component/add-user-to-team-dialog-component.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
//import { BacklogCopyComponent } from './backlog-copy/backlog-copy.component';
import { TasksComponent } from './tasks/tasks.component';
import { SprintDetailsComponent } from './sprint-details/sprint-details.component';
import { SprintListComponent } from './sprint-list/sprint-list.component';
import { ProjectBacklogComponent } from './project-backlog/project-backlog.component';
import { ProjectSprintsComponent } from './project-sprints/project-sprints.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { UserTasksComponent } from './user-tasks/user-tasks.component';
import { UserTeamsComponent } from './user-teams/user-teams.component';
import { TeamProjectsComponent } from './team-projects/team-projects.component';
import { TimelineComponent } from './timeline/timeline.component';
import { CompanyDashboardComponent } from './company-dashboard/company-dashboard.component';
import { UserTasksKanbanComponent } from './user-tasks-kanban/user-tasks-kanban.component';
import { UserHomepageComponent } from './user-homepage/user-homepage.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserTimelineComponent } from './user-timeline/user-timeline.component';

export const ComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'taskslist',
        component: TasksListComponent,
        canActivate: [AuthorizationGuard],


      },
      {
        path: 'companies',
        component: CompaniesComponent,
        canActivate: [AuthorizationGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'addcompany',
        component: AddCompanyComponent,
        canActivate: [AuthorizationGuard],
        data: { roles: ['ADMIN'] }


      },
      {
        path: 'updatecompany',
        component: UpdateCompanyDialogComponent,
        canActivate: [AuthorizationGuard],
        data: { roles: ['ADMIN'] }


      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthorizationGuard],
       data: { roles: ['COMPANY'] }
      },
      {
        path: 'adduser',
        component: AddUserComponent,
        canActivate: [AuthorizationGuard],
        data: { roles: ['COMPANY'] }


      },
      {
        path: 'updateuser',
        component: UpdateUserDialogComponent,
        canActivate: [AuthorizationGuard],
        data: { roles: ['COMPANY'] }


      },
      {
        path: 'teams',
        component: TeamsComponent,
        canActivate: [AuthorizationGuard],
        data: { roles: ['COMPANY'] },


      },
      {
        path: 'teamdetails/:id',
        component: TeamDetailsComponent,
        canActivate: [AuthorizationGuard],
        data: { roles: ['COMPANY'] },


      },
      {
        path: 'projects',
        component: ProjectsComponent,
        canActivate: [AuthorizationGuard],
        data: { roles: ['COMPANY'] },


      },
      {
        path: 'backlog',
        component: BacklogComponent,
        canActivate: [AuthorizationGuard],

      },

      {
        path: 'sprint',
        component: SprintComponent,
        canActivate: [AuthorizationGuard],

      },
      {
        path: 'updateprofile',
        component: UpdateProfileComponent,
        canActivate: [AuthorizationGuard],
        data: { roles: ['COMPANY'] }


      },
      {
        path: 'updateuserprofile',
        component: UpdateUserProfileComponent,
        canActivate: [AuthorizationGuard],
        data: { roles: ['EMPLOYEE','LEADER'] }


      },
      {
        path: 'changepassword',
        component: ChangePasswordComponent,
        canActivate: [AuthorizationGuard],
        data: { roles: ['EMPLOYEE','LEADER','COMPANY','ADMIN'] }


      },
      {
        path: 'addteam',
        component: AddTeamComponent,
        canActivate: [AuthorizationGuard],
        data: { roles: ['COMPANY'] }


      },
      {
        path: 'updateteam',
        component: UpdateTeamDialogComponent,
        canActivate: [AuthorizationGuard],
        data: { roles: ['COMPANY'] }


      },
      {
        path: 'addusertoteam',
        component: AddUserToTeamDialogComponentComponent,
        canActivate: [AuthorizationGuard],
        data: { roles: ['COMPANY'] }


      },
      {
        path: 'addproject',
        component: AddProjectComponent,
        canActivate: [AuthorizationGuard],
        data: { roles: ['COMPANY'] }


      },
      {
        path: 'projectdetails/:id',
        component: ProjectDetailsComponent,



      },
     /**  {
        path: 'backlogcopy',
        component: BacklogCopyComponent,
      },
      */
      {
        path: 'tasks',
        component: TasksComponent,
        canActivate: [AuthorizationGuard],

      },
      {
        path: 'sprintdetails/:id/:teamId',
        component: SprintDetailsComponent,

      },
      {
        path: 'sprintlist',
        component: SprintListComponent,
        canActivate: [AuthorizationGuard],

      },
      {
        path: 'mytasks',
        component:UserTasksComponent,
        canActivate: [AuthorizationGuard],
        data: { roles: ['LEADER','EMPLOYEE'] }


      },
      {
        path: 'projectbacklog',
        component: ProjectBacklogComponent,
        canActivate: [AuthorizationGuard],

      },
      {
        path: 'projectsprints',
        component: ProjectSprintsComponent,
        canActivate: [AuthorizationGuard],

      },
      { path: 'taskdetails/:id',
        component: TaskDetailsComponent ,
      },


        { path: 'myteams',
        component: UserTeamsComponent ,
        canActivate: [AuthorizationGuard],
        data: { roles: ['LEADER','EMPLOYEE'] }



      },
        { path: 'teamprojects/:id',
        component: TeamProjectsComponent ,
      },
        { path: 'timeline',
        component: TimelineComponent ,
        canActivate: [AuthorizationGuard],
      },
        { path: 'companydashboard',
        component: CompanyDashboardComponent ,
        canActivate: [AuthorizationGuard],
        data: { roles: ['COMPANY'] }

      },
        { path: 'mykanbantasks',
        component: UserTasksKanbanComponent ,
        canActivate: [AuthorizationGuard],
        data: { roles: ['LEADER','EMPLOYEE'] }

      },
        { path: 'myhomepage',
        component: UserHomepageComponent ,
        canActivate: [AuthorizationGuard],
        data: { roles: ['LEADER','EMPLOYEE'] }

      },
        { path: 'timeline',
        component: TimelineComponent ,
        canActivate: [AuthorizationGuard],

      },
        { path: 'admindashboard',
        component: AdminDashboardComponent,
        canActivate: [AuthorizationGuard],
        data: { roles: ['ADMIN'] }

      },

      { path: 'usertimeline',
      component: UserTimelineComponent ,

    },








    ],
  },
];
