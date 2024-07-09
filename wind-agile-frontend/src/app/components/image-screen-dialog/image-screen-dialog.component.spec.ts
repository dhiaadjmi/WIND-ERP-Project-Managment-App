import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageScreenDialogComponent } from './image-screen-dialog.component';

describe('ImageScreenDialogComponent', () => {
  let component: ImageScreenDialogComponent;
  let fixture: ComponentFixture<ImageScreenDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageScreenDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageScreenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
