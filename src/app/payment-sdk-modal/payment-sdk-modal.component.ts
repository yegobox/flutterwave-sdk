import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-payment-sdk-modal',
  templateUrl: './payment-sdk-modal.component.html',
  styleUrls: ['./payment-sdk-modal.component.css']
})
export class PaymentSdkModalComponent implements OnInit {
  

  constructor(
    public dialogRef: MatDialogRef<PaymentSdkModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      dialogRef.disableClose = true;
     }

  ngOnInit(): void {
  
  }
  payamentDetails(event){
      this.dialogRef.close(event);
  }



}
