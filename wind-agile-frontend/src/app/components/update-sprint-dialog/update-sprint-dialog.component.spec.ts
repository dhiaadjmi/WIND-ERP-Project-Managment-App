import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSprintDialogComponent } from './update-sprint-dialog.component';

describe('UpdateSprintDialogComponent', () => {
  let component: UpdateSprintDialogComponent;
  let fixture: ComponentFixture<UpdateSprintDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateSprintDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateSprintDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
