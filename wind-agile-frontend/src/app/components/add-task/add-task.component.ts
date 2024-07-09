import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskService } from 'src/app/services/task.service';
import { MatDialogRef } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { TeamService } from 'src/app/services/team.service';
import { TaskUpdateService } from 'src/app/services/task-update.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent {
  userId:any
  newTask: any = {};
  teamInfo: any;
  @Output() taskAdded: EventEmitter<any> = new EventEmitter();
  @Output() taskAddedTimeline: EventEmitter<any> = new EventEmitter();


  constructor(    private taskService: TaskService,private teamService:TeamService,
    private taskUpdateService:TaskUpdateService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AddTaskComponent>,


    @Inject(MAT_DIALOG_DATA) public data: any) {
      console.log('Team ID:', this.data.teamId);
      this.getTeamInfo(this.data.teamId);


    }


    addTask(): void {
      if (this.userId) {
        this.taskService.createTaskInSprint(this.newTask, this.data.sprintId, this.data.backlogId, this.userId)
          .subscribe(
            (response) => {
              console.log('Tâche créée avec succès :', response);
              this.toastr.success('La tâche a été ajoutée avec succès.', 'Succès', {
                timeOut: 3000,
                positionClass: 'toast-top-right',
                progressBar: true,
              });
              this.taskAdded.emit();
              this.taskUpdateService.taskAddedTimeline.emit();
              this.taskUpdateService.taskAddedForBacklog.emit(this.newTask.id);

            },
            (error) => {
              console.error('Erreur lors de la création de la tâche :', error);
              this.toastr.error('Une erreur est survenue lors de l\'ajout de la tâche.', 'Erreur', {
                timeOut: 3000,
                positionClass: 'toast-top-right',
                progressBar: true,
              });
            }
          );
      } else {
        console.error('Aucun utilisateur sélectionné.');
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
    closeDialog(): void {
      this.dialogRef.close();
    }
}
