import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SprintService } from '../../services/sprint.service';

@Component({
  selector: 'app-sprint-details',
  templateUrl: './sprint-details.component.html',
  styleUrls: ['./sprint-details.component.scss']
})
export class SprintDetailsComponent {
  sprint: any;
  sprintId:number;
  sprintTasks: any[] = [];
  backlogId: number;
  teamId: number;

  sprintStateTranslations: Record<string, string> = {
    IN_PROGRESS: 'En cours',
    COMPLETED: 'Terminé',
    ON_HOLD: 'En attente',
  };


  constructor(private route: ActivatedRoute,private sprintService: SprintService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const sprintId = +params['id'];
      const teamId = +params['teamId'];

      if (sprintId) {
        this.sprintId = sprintId;
        this.getSprintDetails(sprintId);
      }
      if (teamId) {
        this.teamId = teamId;
        console.log('Team ID:', this.teamId);
      }

    });
  }

  getSprintDetails(sprintId: number) {
    this.sprintService.getSprintById(sprintId).subscribe(
      data => {
        this.sprint = data;
        console.log('Détails du sprint :', this.sprint);
        this.sprint = this.sprint;
        this.backlogId = this.sprint.backlogId;
        this.sprintId = this.sprint.id;

      },
      error => {
        console.error('Erreur lors de la récupération des détails du sprint :', error);
      }
    );
  }
}
