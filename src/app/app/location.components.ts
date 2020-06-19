import { Component, OnInit, Input, OnChanges, AfterViewInit, SimpleChanges, ChangeDetectorRef, ViewEncapsulation } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ILatLng } from "../app-directions-map.directive";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({

  selector: "payment-sdk",
  styleUrls:['style.scss'],
  templateUrl:"payment.html",
  encapsulation: ViewEncapsulation.ShadowDom,
  // animations: [
  //   trigger('insertLogin', [
  //     transition(':enter', useAnimation(fadeInAnimation, { params: { duration: '1s' } }))
  //   ]),
  // ],
})
export class LocationComponent implements OnInit, OnChanges, AfterViewInit {

  showCard;
  currency:string;
  buyForm: FormGroup;
  public loading = new BehaviorSubject(false);
 
  public ccNumMissingTxt = new BehaviorSubject("CCV number is required");
  public cardExpiredTxt = new BehaviorSubject("Card has expired");

  @Input() public simulating: string;
  @Input() public shouldpop: any;
  noAmountError: boolean = false;
  step: any = 0;
  flipperPlan = 400;

  message = { message: null, momo: null, error: false };
  isFocused: string = '';
  payment_fonfirmed: boolean = false;
  panding_payment: boolean = false;

  constructor(private modalService: NgbModal,
    private component: ChangeDetectorRef, 
    private http: HttpClient,private _snackBar: MatSnackBar) {

  }
  preview: boolean = false;
  @Input()
  public name: string;

  @Input()
  public amount: number;

  @Input()
  public auth: string;

  @Input()
  public grid: string;

  @Input()
  public country: string;

  @Input()
  public showbutton: boolean = false;

  @Input() 
  public displayText: string = "Donate Now";

  @Input()
  public action:string = "dd";

  @Input()
  public url: string;


  @Input()
  public color: string = "red";

  @Input()
  public size: number = 1;

  @Input() showMapByDefault = true;
  togglePreview() {
    this.preview = !this.preview;
  }
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: "grid-map", size: "lg" }).result.then(() => {
    }, () => {
    });
  }

  origin: ILatLng = {
    latitude: 0,
    longitude: 0
  };
  destination: ILatLng = {
    latitude: 0,
    longitude: 0
  };

  //origin
  @Input() orglatitude: any;
  @Input() orglongitude: any;
  //destination
  @Input() destlatitude: any;
  @Input() destlongitude: any;

  _zoom: number;
  @Input() zoom: any = 13;


  displayDirections = true;

  ngOnInit() {
    
    this.destination = {
      latitude: this.destlatitude,
      longitude: this.destlongitude
    } as ILatLng;
    this._zoom = parseInt(this.zoom);

    this.buyForm = new FormGroup({
      mobilephone: new FormControl('', [Validators.required]),
    });
    
  }
  ngAfterViewInit(): void {
    console.log(this.action);

    this._zoom = parseInt(this.zoom);
    this.destination = {
      latitude: parseFloat(this.destlatitude),
      longitude: parseFloat(this.destlongitude)
    } as ILatLng;

    navigator.geolocation.getCurrentPosition((position) => {
      this.origin.latitude = position.coords.latitude;
      this.origin.longitude = position.coords.longitude;
    });

    //call grid auth to overwride the destination passed when testing.
    if (this.simulating != "true") {
      console.log("not simulating");

      // this.callgridAuth();
    } else {
      console.log("simulating");
      console.log("zoom", this.zoom);
    }
    if (this.shouldpop === "true" || this.shouldpop === true) {

      let element: HTMLElement = document.getElementById("map-opener") as HTMLElement;
      element.click();
    }
  }

  public callgridAuth() {

    // TODO: call yegobox to save the location for user making payment when necessary.
    // let url = null;
    // let a = this.auth;
    // return this.http.get<any>(this.url + "/partnergridsearch?gridCode=" + this.grid + "&Countrycode=" + this.country, {
    //   headers: {
    //     "Content-Type": "application/json; charset=utf-8",
    //     "Accept": "application/json",
    //     "Authorization": `Basic ${a}`
    //   }
    // }).subscribe(response => {

    //   url = response.GoogleMapURL;
    //   url.split("?q=")[1].split(",");
    //   this.destination = {
    //     latitude: parseFloat(url.split("?q=")[1].split(",")[0]),
    //     longitude: parseFloat(url.split("?q=")[1].split(",")[1])
    //   } as ILatLng
    // });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.destination = {
      latitude: this.destlatitude,
      longitude: this.destlongitude
    } as ILatLng;

    if (changes.origin) {
    }
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
  submitCard(data){
    if(null == this.amount){
      this.noAmountError = true;
      this.component.markForCheck();
      return;
    }
    const formSubscription = "cardno="+ data.cardNumber + 
      "&expirymonth="+ data.expirationMonth +
      "&expiryyear="+ data.expirationYear+
      "&vcc="+ data.ccv+
      "&email="+ "email@gmail.com"+
      "&firstname="+ data.cardHolder+
      "&lastname="+ data.cardHolder+
      "&planid="+ "5422"+
      "&appname="+ "FLIPPER"+
      "&phone="+ "07888888888"+
      "&transactionid="+ Date.now()+
      "&amount="+ this.amount+
      "&pay_type="+ "CARD"+
      "&userId="+ "1";

    let xhr = new XMLHttpRequest();


    xhr.open("POST", environment.paymentUrl+"charge", true);

    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    // 5531886652142950

    xhr.onload = (d) => {

      let json = JSON.parse(xhr.response);
      console.log("then",json);
      
      if(json.message.status == 'error'){
        
        this.message.error = true;
        if(null !=json.message.data){
          this.message.message = json.message.data.message;
        }else if(null !=json.message.message){
          this.message.message = json.message.message;
        }
        
      }else if(json.message.status =="success"){
          this.payment_fonfirmed = true;
          this.component.markForCheck();
      }else if(json.message.status =="pending"){
        this.panding_payment = true;
        this.component.markForCheck();
      }else{
        // in case we have card that needs verification. then we can call endPoint to verify the card here.
        console.log("else",json);
      }
    };

    

    xhr.send(formSubscription);

  }
  submitMomo(){
    if(null == this.amount){
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
      "&phone"+ this.buyForm.value.mobilephone+
      "&amount"+ this.amount+
      "&pay_type=MOMO-RWANDA"+
      "&userId=1" ;

    this.message.error = false;
    this.message.message = '';
    if (!this.buyForm.value.mobilephone) {
      this.message.error = true;
      this.message.message = 'Mobile number is required';
    }
    let xhr = new XMLHttpRequest();
    
    xhr.open("POST", environment.paymentUrl+"charge", true);

    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onload = (d) => {

      let json = JSON.parse(xhr.response);
      
      if(json.message.status == 'error'){
        
        this.message.error = true;
        this.message.message = json.message.data.message;
      }
      
    };

    xhr.send(formSubscription);
  }
}
