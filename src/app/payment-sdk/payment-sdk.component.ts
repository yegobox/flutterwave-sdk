import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PaymentSdkModalComponent } from '../payment-sdk-modal/payment-sdk-modal.component';
import { DialogSize, DialogService } from '@enexus/flipper-dialog';

@Component({
  selector: 'payment-sdk',
  templateUrl: './payment-sdk.component.html',
  styleUrls: ['./payment-sdk.component.css']
})
export class PaymentSdkComponent implements OnInit {

  @Input() amount: any = 0.00;
  @Input() action: string = "Pay";
  @Input() currency: string = "RWF";
  @Input() showbutton: any = false;
  @Input() modal: any = 'md';
  data: any;
  @Output() payamentDetails = new EventEmitter<{ data: any, status: string }>();
  @Input() class: string = 'payment-button';

  constructor(public dialog: DialogService) { }

  ngOnInit(): void {
    this.data = {
      amount: this.amount,
      action: this.action,
      currency: this.currency
    };
  }
  openDialog() {
    let model = null;
    if (this.modal == 'sm' || this.modal == 'small') {
      model = DialogSize.SIZE_SM;
    } else if (this.modal == 'md' || this.modal == 'medium') {
      model = DialogSize.SIZE_MD;
    } else if (this.modal == 'lg' || this.modal == 'large') {
      model = DialogSize.SIZE_LG;
    } else if (this.modal == 'full') {
      model = DialogSize.SIZE_FULL;
    } else {
      model = DialogSize.SIZE_MD;
    }

    return this.dialog.open(PaymentSdkModalComponent, model, this.data)
      .subscribe(result => {
        if (result) {
          this.payamentDetails.emit(result);
        }

      }

      );
  }
  payamentData(event) {
    this.payamentDetails.emit(event);
  }
}
