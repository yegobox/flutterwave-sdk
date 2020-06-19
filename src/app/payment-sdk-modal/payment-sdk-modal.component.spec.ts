import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSdkModalComponent } from './payment-sdk-modal.component';

describe('PaymentSdkModalComponent', () => {
  let component: PaymentSdkModalComponent;
  let fixture: ComponentFixture<PaymentSdkModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentSdkModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSdkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
