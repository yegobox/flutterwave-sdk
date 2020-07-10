import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-payment-sdk-modal',
  templateUrl: './payment-sdk-modal.component.html',
  styleUrls: ['./payment-sdk-modal.component.css']
})
export class PaymentSdkModalComponent {

  constructor(
    public dialogRef: MatDialogRef<PaymentSdkModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.disableClose = true;
  }

  payamentResponse(event) {

    if(event.status=='successful' || event.status=='success'){
      setTimeout(()=> {
        this.dialogRef.close(event);
      },this.data.timeout);
    }
   
  }
}
