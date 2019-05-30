import {Component, OnInit} from "@angular/core";
import init from "../../../assets/js/features/travelCalc/init";
import {GetDataService} from "../../services/get-data.service";

@Component({selector: "app-calc-travel", templateUrl: "./calc-travel.component.html", styleUrls: ["./calc-travel.component.scss"]})
export class CalcTravelComponent implements OnInit {
  public data = {};
  public outcomes = null;

  constructor(private _travelData : GetDataService) {
    this.initData();
    this.updateState(this.data);
  }

  /**
   * Checks and waits for outcomes data,
   * passes data for travelCalc methods. Then sets return value to the outcomes variable.
   *
   * @param {Object} data
   *
   */
  updateState(data) {
    if (!data.flight || !data.journey) {
      const checkInterval = setInterval(() => {
        if (data["price"]) {
          clearInterval(checkInterval);
          this.outcomes = init(data);
        }
      }, 5);
    } else {
      this.outcomes = init(data).route;
    }
  }

  /**
   * Function that invokes the data fetching functions and catches the response.
   */
  initData() {
    this
      ._travelData
      .getFlights()
      .subscribe(res => {
        return (this.data["flight"] = res);
      });

    this
      ._travelData
      .getJourneys()
      .subscribe(res => {
        return (this.data["journeys"] = res);
      });

    this
      ._travelData
      .getPrices()
      .subscribe(res => {
        return (this.data["price"] = res);
      });
  }

  ngOnInit() {}
}
