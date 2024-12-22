import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManagerTabsComponent } from './manager-tabs.component';

describe('ManagerTabsComponent', () => {
  let component: ManagerTabsComponent;
  let fixture: ComponentFixture<ManagerTabsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ManagerTabsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
