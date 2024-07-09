import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaskForBacklogComponent } from './add-task-for-backlog.component';

describe('AddTaskForBacklogComponent', () => {
  let component: AddTaskForBacklogComponent;
  let fixture: ComponentFixture<AddTaskForBacklogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTaskForBacklogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTaskForBacklogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
