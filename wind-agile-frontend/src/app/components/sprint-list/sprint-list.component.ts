import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sprint-list',
  templateUrl: './sprint-list.component.html',
  styleUrls: ['./sprint-list.component.scss']
})
export class SprintListComponent implements OnInit {
  @Input() sprints: any[];

  todoForm: FormGroup;
  addSprintForm: FormGroup;
  inprogress: any[] = [];
  done: any[] = [];
  updateIndex: any;
  isEditEnabled: boolean = false;

  constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {
    console.log('sprints reçues :', this.sprints);
  }

  addSprint() {
    this.sprints.push({
      description: this.todoForm.value.item,
      done: false
    });
    this.todoForm.reset();
  }

  onEdit(item: any, i: number) {
    this.todoForm.controls['item'].setValue(item.description);
    this.updateIndex = i;
    this.isEditEnabled = true;
  }

  updateSprint() {
    this.sprints[this.updateIndex].description = this.todoForm.value.item;
    this.sprints[this.updateIndex].done = false;
    this.todoForm.reset();
    this.updateIndex = undefined;
    this.isEditEnabled = false;
  }

  deleteSprint(i: number) {
    this.sprints.splice(i, 1);
  }

  deleteInProgressSprint(i: number) {
    this.inprogress.splice(i, 1);
  }

  deleteDoneSprint(i: number) {
    this.done.splice(i, 1);
  }

  drop(event: CdkDragDrop<any[]>) {
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

  addSprintFromDialog(): void {


  }

  getSprintsByState(state: string): any[] {
    return this.sprints.filter(sprint => sprint.state === state);
  }
  getDefaultSprint(): any {
    return this.sprints.find(sprint => sprint.defaultSprint === true);
  }

}
