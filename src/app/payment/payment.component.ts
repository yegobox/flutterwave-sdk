import { Component, OnInit, ChangeDetectorRef, Inject, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  step: any = 0;
  flipperPlan = 400;
  message = { message: null, momo: null, error: false };
  isFocused: string = '';
  buyForm: FormGroup;
  noAmountError: boolean = false;
  payment_fonfirmed: boolean;
  panding_payment: boolean;
  public loading = new BehaviorSubject(false);
  @Input() inputData: any;
  cardForm: FormGroup;
  @Output() payamentDetails = new EventEmitter < {data:any,status:string} > ();
  constructor(
    private component: ChangeDetectorRef
    ) { }

  ngOnInit(): void {
    this.buyForm = new FormGroup({
      mobilephone: new FormControl('', [Validators.required]),
    });
    this.cardForm = new FormGroup({
      cardNumber: new FormControl('', [Validators.required,Validators.pattern('^[0-9]*$')]),
      cardHolder: new FormControl('', [Validators.required]),
      expirationMonth: new FormControl('', [Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(2),
        Validators.maxLength(2)
      ]),
      ccv: new FormControl('', [Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(3),
        Validators.maxLength(4)
      ]),
      expirationYear: new FormControl('', [Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(4),
        Validators.maxLength(4)
      ]),
    });
  }
  get cardNumber() {
    return this.cardForm.get('cardNumber');
  }

  get expirationYear() {
    return this.cardForm.get('expirationYear');
  }
  get ccv() {
    return this.cardForm.get('ccv');
  } get cardHolder() {
    return this.cardForm.get('cardHolder');
  }
  get expirationMonth() {
    return this.cardForm.get('expirationMonth');
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  get mobilephone() {
    return this.buyForm.get('mobilephone');
  }
  focusing(value: any) {
    this.isFocused = value;
    this.buyForm.controls.mobilephone.setValue('');
  }
  focusingOut() {
    this.isFocused = '';
  }

  submitCard(){
   
    if(null == this.inputData.amount){
      this.noAmountError = true;
      this.component.markForCheck();
      return;
    }
    console.log('hhh');
    this.message.error = false;
    this.message.message = '';
    // if (this.cardForm.invalid) {
    //   this.component.markForCheck();
    //   return;
    // }
    const formSubscription = "cardno="+ this.cardForm.value.cardNumber + 
      "&expirymonth="+ this.cardForm.value.expirationMonth +
      "&expiryyear="+ this.cardForm.value.expirationYear+
      "&vcc="+ this.cardForm.value.ccv+
      "&email="+ "email@gmail.com"+
      "&firstname="+ this.cardForm.value.cardHolder+
      "&lastname="+ this.cardForm.value.cardHolder+
      "&planid="+ "5422"+
      "&appname="+ "FLIPPER"+
      "&phone="+ "07888888888"+
      "&transactionid="+ Date.now()+
      "&amount="+ this.inputData.amount+
      "&pay_type="+ "CARD"+
      "&userId="+ "1";
// console.log(formSubscription);
    let xhr = new XMLHttpRequest();

    this.loading.next(true);
    xhr.open("POST", environment.paymentUrl+"charge", true);

    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    // 5531886652142950

    xhr.onload = (d) => {
      this.loading.next(false);
      let json = JSON.parse(xhr.response);
      // console.log(xhr.response);
      
      if(json.message.status == 'error'){
        this.message.error = true;

          if (json.message.data.code === 'CARD_ERR') {
            this.message.message = json.message.data.message;
          }
          if (json.message.data.code === 'ERR') {
            this.message.message = 'Card has expired';
          }

       
        if(null !=json.message.data){
          this.message.message = json.message.data.message;
        }else if(null !=json.message.message){
          this.message.message = json.message.message;
        }
        
      }else if(json.message.status =="success"){
        this.message.error = false;
          this.message.message = 'Card has expired';
          
          if (json.message.data.status === 'approved'
          || json.message.data.status === 'successful'
          || json.message.data.status === 'Approved'
          || json.message.data.status === 'Successful') {
          // return this.saveExpiredDate();
          this.payamentDetails.emit({status:'successful',data:json.message.data});
        } else {
          this.message.error = false;
          this.message.message = json.message.data.chargeResponseMessage;
          this.payamentDetails.emit({status:'successful',data:json.message.data});
          // this.openValidateCardDialog(json.message.data);
        }
          
          this.component.markForCheck();
      }else if(json.message.status =="pending"){
        this.panding_payment = true;
        this.component.markForCheck();
        // this.payamentDetails.emit({status:'pending',data:json.message.data});
      }else{
        // in case we have card that needs verification. then we can call endPoint to verify the card here.
        console.log("else",json);
        // this.payamentDetails.emit({status:'failed',data:json.message.data});
      }
    };

    

    xhr.send(formSubscription);

  }
  submitMomo(){
    if(null == this.inputData.amount){
      this.noAmountError = true;
      this.component.markForCheck();
      return;
    }
    const formSubscription = "cardno=" +
      "&expirymonth="+
      "&expiryyear="+
      "&vcc=" +
      "&email="+
      "&firstname=Name"+
      "&lastname=Name"+
      "&planid=5422"+
      "&phonenumber="+ this.buyForm.value.mobilephone+
      "&amount="+ this.inputData.amount+
      "&pay_type=MOMO-RWANDA"+
      "&appname=DOMAINS"+
      "&transactionid=12345"+
      "&userId=1" ;
     

    this.message.error = false;
    this.message.message = '';
    if (this.buyForm.invalid) {
      this.component.markForCheck();
      return;
    }
    let xhr = new XMLHttpRequest();
    this.loading.next(true);
    xhr.open("POST", environment.paymentUrl+"charge", true);

    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onload = (d) => {
     
      this.loading.next(false);
      let json = JSON.parse(xhr.response);
      
      if(json.message.status == 'error'){
        
        this.message.error = true;
        this.message.message = json.message.data.message;
      }else if(json.message.status == 'success' && json.message.message == 'Momo initiated'){
        
        this.message.error = true;
        this.message.message = 'Sorry, Mobile money is not working! please use credit card!';
      }
      
    else{
      this.message.error = false;
      this.message.message = json.message.data.chargeResponseMessage;
    }
  }
    xhr.send(formSubscription);

    
  }

  close(){

  }

}
