import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalWizardComponent } from './journal-wizard.component';

describe('JournalWizardComponent', () => {
  let component: JournalWizardComponent;
  let fixture: ComponentFixture<JournalWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalWizardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
