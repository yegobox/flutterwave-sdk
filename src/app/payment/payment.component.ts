import { Component, OnInit, ChangeDetectorRef, Inject, Input, Output, EventEmitter, SecurityContext } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';


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
  jsonResponseData:any;

  @Input() inputData: any;
  cardForm: FormGroup;
  allowOptVerification:boolean=false;
  paymentMadeSuccess:boolean=false;

  @Output() response = new EventEmitter < {data:any,status:string} > ();

  verifyForm: FormGroup;
  constructor(
    private sanitizer: DomSanitizer,
    private httpClient: HttpClient,
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

    // Verification card

  
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
    this.allowOptVerification=false;
    this.paymentMadeSuccess=false;

    if(null == this.inputData.amount){
      this.noAmountError = true;
      this.component.markForCheck();
      return;
    }
    
    this.message.error = false;
    this.message.message = '';
   
    const formSubscription = "cardno="+ this.cardForm.value.cardNumber + 
      "&expirymonth="+ this.cardForm.value.expirationMonth +
      "&expiryyear="+ this.cardForm.value.expirationYear+
      "&vcc="+ this.cardForm.value.ccv+
      "&email="+ "email@gmail.com"+
      "&firstname="+ this.cardForm.value.cardHolder+
      "&lastname="+ this.cardForm.value.cardHolder+
      "&planid="+ "5422"+
      "&appname="+ "DECIDEX"+
      "&currency="+ "RWF"+
      "&phone="+ "07888888888"+
      "&transactionid="+ Date.now()+
      "&amount="+ this.inputData.amount+
      "&pay_type="+ "CARD"+
      "&userId="+ "1"+
      "&redirect_url="+this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustResourceUrl(this.inputData.redirecturl));


    this.loading.next(true);

    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': '*'});


    return this.httpClient
    .post(environment.paymentUrl+'charge',formSubscription,{headers}).
    pipe(finalize(() => this.loading.next(false)))
    .subscribe(res  => {
      this.loading.next(false);

      const json =res as any;

      // console.log(json);

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
        this.response.emit({status:'error',data:json.message.data});

      }else if(json.message.status =="success"){
          
        this.message.error = false;
          
        // console.log(json.message.data);
          if (json.message.data.status === 'approved'
          || json.message.data.status === 'successful'
          || json.message.data.status === 'Approved'
          || json.message.data.status === 'Successful') {
            this.paymentMadeSuccess=true;
          this.response.emit({status:'success',data:json.message.data});

        } else {
          this.openValidateCardDialog(json.message.data);
        }
          
        
      } else if(json.message.status =="pending"){
        this.message.error = false;
        this.response.emit({status:'pending',data:json.message.data});
        this.openValidateCardDialog(json.message.data);
      }

      this.component.markForCheck();

    }, error => {
      this.loading.next(false);
      this.message.error = true;
      const response =error as any;
      this.message.message = response.message.message as any;
    });
    
  

  }
  openValidateCardDialog(data:any){
        this.allowOptVerification=true;
        this.jsonResponseData=data;
        this.component.markForCheck();
  }
  submitMomo(){
    if(null == this.inputData.amount){
      this.noAmountError = true;
      this.component.markForCheck();
      return;
    }
    // console.log(this.inputData.redirecturl);

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
      "&transactionid=decidex12345"+
      "&currency="+this.inputData.currency+
      "&userId=1"+
      "&redirect_url="+this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustResourceUrl(this.inputData.redirecturl));
     
 console.log(formSubscription);

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
      // console.log("submit the momo",json);
      
      if(json.message.status == 'error'){
        
        this.message.error = true;
        this.message.message = json.message.data.message;

      }else  if (json.message.status === 'success') {
        this.message.error = false;
        if(json.message.meta && json.message.meta.authorization && json.message.meta.authorization.mode=='redirect'){
             return window.location.href= json.message.meta.authorization.redirect;
          }
      }
    }
    xhr.send(formSubscription);

    
  }

  

  close(){

  }
  payamentResponse(event) {
    this.response.emit(event);
  }

}
