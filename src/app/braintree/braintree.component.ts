import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-braintree',
  templateUrl: './braintree.component.html',
  styleUrls: ['./braintree.component.scss']
})
export class BraintreeComponent implements OnInit {

  paymentResponse:any;
  constructor() { }

  ngOnInit() {
  }
  onPaymentStatus(response):void
  {
  this.paymentResponse=response;  
  }
}
