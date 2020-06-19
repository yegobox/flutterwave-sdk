import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSdkComponent } from './payment-sdk.component';

describe('PaymentSdkComponent', () => {
  let component: PaymentSdkComponent;
  let fixture: ComponentFixture<PaymentSdkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentSdkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSdkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
