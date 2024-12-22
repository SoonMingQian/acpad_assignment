import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MechanicAppointmentComponent } from './mechanic-appointment.component';

describe('MechanicAppointmentComponent', () => {
  let component: MechanicAppointmentComponent;
  let fixture: ComponentFixture<MechanicAppointmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MechanicAppointmentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MechanicAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
