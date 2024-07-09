import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tasks-copy',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent {
  @Input() tasks: any[];




}
