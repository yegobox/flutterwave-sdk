import { Component, OnInit, Input, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ILatLng } from '../app-directions-map.directive';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'location-button',
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
  template: `
<div *ngIf="url">
  <ng-template #content let-modal>
  <div class="animated bounceIn" [class.preview]="preview"  tabindex="-1">
      <div class="modal-header">
          <h4 class="modal-title" id="modal-basic-title">Map</h4>
          <button type="button" class="close" aria-label="Close" (click)="modal.dismiss('Cross click')">
              <span aria-hidden="true">&times;</span>
          </button>
      </div>
      <div class="modal-body">
          <agm-map appAppDirectionsMap [showDirection]="this.displayDirections" [origin]="origin"
              [destination]="destination" [zoom]="_zoom" [disableDefaultUI]="false" [zoomControl]="false">

              <agm-marker [latitude]="origin.latitude" [longitude]="origin.longitude">
              </agm-marker>
          </agm-map>
      </div>
      <div class="modal-footer">
         <button type="button" class="btn btn-info" (click)="togglePreview()">Zoom {{preview?'Out':'In'}}</button>
          <button type="button" class="btn btn-primary" (click)="modal.close('Save click')">Close</button>
      </div>
      </div>
  </ng-template>
  <div *ngIf="!showbutton && !shouldpop ">
      <agm-map appAppDirectionsMap [showDirection]="this.displayDirections" [origin]="origin"
          [destination]="destination" [zoom]="_zoom" [disableDefaultUI]="false" [zoomControl]="false">

          <agm-marker [latitude]="origin.latitude" [longitude]="origin.longitude">
          </agm-marker>
      </agm-map>
  </div>
  <div *ngIf="showbutton">
      <button class="btn btn-primary" id="map-opener" (click)="open(content)">Location</button>
  </div>
 
</div>`,

})
export class LocationComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() public simulating: string;
  @Input() public shouldpop: any;

  constructor(private modalService: NgbModal, private http: HttpClient) {

  }
  preview:boolean=false;
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
  public color: string = 'red';

  @Input()
  public size: number = 1;

  @Input() showMapByDefault = true;
  togglePreview(){
    this.preview=!this.preview;
  }
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'grid-map', size: 'lg' }).result.then((result) => {
    }, (reason) => {
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
      this.callgridAuth();
    } else {
      console.log("simulating");
      console.log('zoom', this.zoom);
    }
    if (this.shouldpop === "true" || this.shouldpop === true) {

      let element: HTMLElement = document.getElementById("map-opener") as HTMLElement;
      element.click();
    }

  }

  public callgridAuth() {
    let url = null;
    let a = this.auth;
    return this.http.get<any>(this.url + "/partnergridsearch?gridCode=" + this.grid + "&Countrycode=" + this.country, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': `Basic ${a}`
      }
    }).subscribe(response => {

      url = response.GoogleMapURL;
      url.split("?q=")[1].split(",");
      this.destination = {
        latitude: parseFloat(url.split("?q=")[1].split(",")[0]),
        longitude: parseFloat(url.split("?q=")[1].split(",")[1])
      } as ILatLng
    });
  }

  ngOnChanges(changes: SimpleChanges): void {

    this.destination = {
      latitude: this.destlatitude,
      longitude: this.destlongitude
    } as ILatLng;

    if (changes.origin) {
    }
  }
}
