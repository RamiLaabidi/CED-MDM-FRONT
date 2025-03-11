import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextNumberComponent } from './next-number.component';

describe('NextNumberComponent', () => {
  let component: NextNumberComponent;
  let fixture: ComponentFixture<NextNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextNumberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NextNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
