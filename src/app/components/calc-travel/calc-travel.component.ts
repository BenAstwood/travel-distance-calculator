import {Component, OnInit} from "@angular/core";
import {travelCalc} from "../../../assets/js/features/travelCalc";
import {GetDataService} from '../../services/get-data.service';

@Component({selector: "app-calc-travel", templateUrl: "./calc-travel.component.html", styleUrls: ["./calc-travel.component.scss"]})
export class CalcTravelComponent implements OnInit {

  public data = {};

  constructor(private _travelData : GetDataService) {}

  async initData() {

    await this
      ._travelData
      .getFlights()
      .subscribe(res => {
        return this.data['flight'] = res;
      });

    await this
      ._travelData
      .getJourneys()
      .subscribe(res => {
        return this.data['journeys'] = res;
      });

    await this
      ._travelData
      .getPrices()
      .subscribe(res => {
        return this.data['mileage-price'] = res;
      });
  }

  ngOnInit() {
    this.initData();
    travelCalc.init(this.data);

  }
}
