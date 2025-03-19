import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateJournalComponent } from './update-journal.component';

describe('UpdateJournalComponent', () => {
  let component: UpdateJournalComponent;
  let fixture: ComponentFixture<UpdateJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateJournalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
