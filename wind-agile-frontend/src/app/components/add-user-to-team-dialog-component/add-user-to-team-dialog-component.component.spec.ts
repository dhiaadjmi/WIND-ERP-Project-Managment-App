import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserToTeamDialogComponentComponent } from './add-user-to-team-dialog-component.component';

describe('AddUserToTeamDialogComponentComponent', () => {
  let component: AddUserToTeamDialogComponentComponent;
  let fixture: ComponentFixture<AddUserToTeamDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUserToTeamDialogComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUserToTeamDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
