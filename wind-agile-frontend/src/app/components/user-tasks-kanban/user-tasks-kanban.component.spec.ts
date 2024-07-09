import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTasksKanbanComponent } from './user-tasks-kanban.component';

describe('UserTasksKanbanComponent', () => {
  let component: UserTasksKanbanComponent;
  let fixture: ComponentFixture<UserTasksKanbanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserTasksKanbanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTasksKanbanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
