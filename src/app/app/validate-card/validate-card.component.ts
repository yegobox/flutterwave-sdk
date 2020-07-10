import { Component, OnInit, Inject, Input, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'validate-opt-card',
  templateUrl: './validate-card.component.html',
  styleUrls: ['./validate-card.component.scss']
})
export class CardValidationComponent implements OnInit {
  public loading = new BehaviorSubject(false);
  form: FormGroup;
  message = { message:null,momo: null, error: false };

  isFocused = '';
  newData=null;

  @Input('data')
  set data(value: any) {
    this.newData = value;
  }

  get data(): any {
    return this.newData;
  }
  @Output() response = new EventEmitter<{ data: any, status: string }>();
  constructor(
    private httpClient: HttpClient,private component: ChangeDetectorRef) {
      
    }
    isSuccess=false;


  ngOnInit() {
   if(this.data){
    this.form = new FormGroup({
      opt: new FormControl('', [Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(4),
        Validators.maxLength(5)
      ]),
       reference: new FormControl(this.data?this.data.flwRef:'')
    });
   }
    
    this.component.markForCheck();
  }


  get reference() {
    return this.form.get('reference');
  }
  get opt() {
    return this.form.get('opt');
  }



  validateCard() {
    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': '*'});

    if (this.form.valid) {
      this.loading.next(true);
      this.isSuccess=false;
      this.message.error = false;
      
      const creds = 'reference=' + this.form.value.reference + '&opt=' + this.form.value.opt;
      // console.log(creds);
      return this.httpClient
         .post(environment.paymentUrl+'validate-transaction',creds,{headers}).
         pipe(finalize(() => this.loading.next(false)))
         .subscribe(res  => {
           this.loading.next(false);
           const response =res as any;

           if(response.message.status==='success' && response.message.data.data.responsemessage==='successful') {
            this.message.error = false;
            this.message.message = response.message.message as any;
            this.isSuccess=true;
            setTimeout(()=> {
              this.response.emit({status:'success',data:response.message.data.data});
            },500);
           } else {
            this.response.emit({status:'error',data:response.message.message});
            this.message.error = true;
            this.message.message = response.message.message as any;
           }

         }, error => {
           this.loading.next(false);
           this.message.error = true;
           const response =error as any;
           this.response.emit({status:'error',data:response.message.message});
           this.message.message = response.message.message as any;
         });
    }


  }
}
