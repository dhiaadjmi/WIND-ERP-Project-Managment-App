import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBacklogDialogComponent } from './update-backlog-dialog.component';

describe('UpdateBacklogDialogComponent', () => {
  let component: UpdateBacklogDialogComponent;
  let fixture: ComponentFixture<UpdateBacklogDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateBacklogDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateBacklogDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
