import { Component, OnInit, Input, OnChanges, AfterViewInit, SimpleChanges } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ILatLng } from "../app-directions-map.directive";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";


@Component({
  selector: "payment-sdk",
  styles: [`
  .preview{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    margin: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    background:#fff;
  }
  agm-map {
    height: 70vh;
  }
`],
  templateUrl:"payment.html",

})
export class LocationComponent implements OnInit, OnChanges, AfterViewInit {

  showCard;
  currency:string;
  amount:number;
  loading:boolean = false;
  public ccNumMissingTxt = new BehaviorSubject("CCV number is required");
  public cardExpiredTxt = new BehaviorSubject("Card has expired");

  @Input() public simulating: string;
  @Input() public shouldpop: any;

  constructor(private modalService: NgbModal, private http: HttpClient) {

  }
  preview: boolean = false;
  @Input()
  public name: string;

  @Input()
  public auth: string;

  @Input()
  public grid: string;

  @Input()
  public country: string;

  @Input()
  public showbutton: boolean = false;

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
  }
  ngAfterViewInit(): void {
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
  submitCard(data){
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
      "&amount="+ "400"+
      "&pay_type="+ "CARD"+
      "&userId="+ "1";

    let xhr = new XMLHttpRequest();
    


    xhr.open("POST", environment.paymentUrl+"charge", true);

    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onload = (d) => {

      // let json = JSON.parse(xhr.response);
      console.log("payment response ....",xhr.response);
      
    };

    

    xhr.send(formSubscription);

    console.log(formSubscription);
  }
}
