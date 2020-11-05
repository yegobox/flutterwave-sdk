import { Component, OnInit, Input, Output, EventEmitter, SecurityContext } from '@angular/core';
import { PaymentSdkModalComponent } from '../payment-sdk-modal/payment-sdk-modal.component';
import { DialogSize, DialogService } from '@enexus/flipper-dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'payment-sdk',
  templateUrl: './payment-sdk.component.html',
  styleUrls: ['./payment-sdk.component.css']
})
export class PaymentSdkComponent implements OnInit {

  
  @Input() public enablemomo: string;
  @Input()  amount: any = 0.00;
  @Input()  account_id: string = '';
  @Input() action: string = "Pay";
  @Input() currency: string = "RWF";
  @Input() redirecturl: string = "";
  @Input() showbutton: any = false;
  @Input() is_creator_account: any = false || 'false';

  @Input() enableredirect: any = false || 'false';
  @Input() timeout: any = 3000;
  @Input() modal: any = 'md';
  data: any;

  @Output() response = new EventEmitter<{ data: any, status: string }>();

  @Input() class: string = 'payment-button';


  constructor(public dialog: DialogService,private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
   
    this.data = {
      amount: this.amount,
      action: this.action,
      enableMomo:this.enablemomo,
      currency: this.currency,
      redirecturl:this.redirecturl,
      account_id:this.account_id,
      is_creator_account:this.is_creator_account,

      timeout:parseInt(this.timeout)
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
              this.payamentResponse(result);
            }

      });
  }


      payamentResponse(event) {

        this.response.emit(event);

        if(this.enableredirect=='true' || this.enableredirect==true){
          if(event.status=='successful' || event.status=='success'){

            setTimeout(()=> {
              return window.location.href=this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustResourceUrl(this.redirecturl));
            },parseInt(this.timeout));
          
        
        }
        }
       
    }

}
