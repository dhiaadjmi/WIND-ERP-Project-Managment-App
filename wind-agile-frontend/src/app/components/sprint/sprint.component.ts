import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.scss']
})
export class SprintComponent {

    sprints = [
      {
        sprintName: 'Sprint 1',
        objective: 'Objectif du sprint 1',
        startDate: '2024-03-01',
        endDate: '2024-03-15',
        state: 'En cours',
        priority: 'Haute',
        tasks: [
          { name: 'Tâche 1', startDate: '2024-03-01', endDate: '2024-03-05' },
          { name: 'Tâche 2', startDate: '2024-03-02', endDate: '2024-03-08' },
          { name: 'Tâche 3', startDate: '2024-03-03', endDate: '2024-03-10' }
        ]
      },
      {
        sprintName: 'Sprint 2',
        objective: 'Objectif du sprint 1',
        startDate: '2024-03-01',
        endDate: '2024-03-15',
        state: 'En cours',
        priority: 'Haute',
        tasks: [
          { name: 'Tâche 1', startDate: '2024-03-01', endDate: '2024-03-05' },
          { name: 'Tâche 2', startDate: '2024-03-02', endDate: '2024-03-08' },
          { name: 'Tâche 3', startDate: '2024-03-03', endDate: '2024-03-10' }
        ]
      },
      {
        sprintName: 'Sprint 3',
        objective: 'Objectif du sprint 1',
        startDate: '2024-03-01',
        endDate: '2024-03-15',
        state: 'En cours',
        priority: 'Haute',
        tasks: [
          { name: 'Tâche 1', startDate: '2024-03-01', endDate: '2024-03-05' },
          { name: 'Tâche 2', startDate: '2024-03-02', endDate: '2024-03-08' },
          { name: 'Tâche 3', startDate: '2024-03-03', endDate: '2024-03-10' }
        ]
      },
      {
        sprintName: 'Sprint 4',
        objective: 'Objectif du sprint 1',
        startDate: '2024-03-01',
        endDate: '2024-03-15',
        state: 'En cours',
        priority: 'Haute',
        tasks: [
          { name: 'Tâche 1', startDate: '2024-03-01', endDate: '2024-03-05' },
          { name: 'Tâche 2', startDate: '2024-03-02', endDate: '2024-03-08' },
          { name: 'Tâche 3', startDate: '2024-03-03', endDate: '2024-03-10' }
        ]
      },
    ];

    drop(event: CdkDragDrop<any[]>) {
      moveItemInArray(this.sprints, event.previousIndex, event.currentIndex);
    }

    onTaskDrop(event: CdkDragDrop<any[]>) {
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


}
