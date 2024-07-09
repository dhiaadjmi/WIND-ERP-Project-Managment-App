import { Component, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BacklogService } from 'src/app/services/backlog.service';
import { SprintService } from 'src/app/services/sprint.service';
import { Router } from '@angular/router';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss']
})
export class BacklogComponent {
  constructor(private backlogService: BacklogService,private sprintService: SprintService,private router: Router,private dialog: MatDialog) {}

  @Input() backlog: any;

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.backlog[0].sprints, event.previousIndex, event.currentIndex);
  }
  deleteSprint(sprintId: number): void {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce sprint?")) {
      this.sprintService.deleteSprint(sprintId).subscribe(
        () => {
        },
        (error) => {
          console.error("Erreur lors de la suppression du sprint :", error);
        }
      );
    }
  }
  viewSprintDetails(sprintId: number) {
    this.router.navigate(['/component/sprintdetails', sprintId]);
  }

  openTaskDetails(taskId: number): void {

    const dialogRef = this.dialog.open(TaskDetailsComponent, {
      width: '500px',
      data: { taskId: taskId },
      position: { right: '290px' }

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
