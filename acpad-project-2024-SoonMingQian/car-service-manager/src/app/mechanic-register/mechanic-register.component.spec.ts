import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MechanicRegisterComponent } from './mechanic-register.component';

describe('MechanicRegisterComponent', () => {
  let component: MechanicRegisterComponent;
  let fixture: ComponentFixture<MechanicRegisterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MechanicRegisterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MechanicRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
