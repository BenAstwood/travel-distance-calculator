import { Component, OnInit } from "@angular/core";
import { travelCalc } from "../../../assets/js/features/travelCalc";
import { GetDataService } from "../../services/get-data.service";

@Component({
  selector: "app-calc-travel",
  templateUrl: "./calc-travel.component.html",
  styleUrls: ["./calc-travel.component.scss"]
})
export class CalcTravelComponent implements OnInit {
  public data = {};
  public outcomes = null;

  constructor(private _travelData: GetDataService) {
    this.initData();
    this.updateState(this.data);
  }

  updateState(data) {
    if (!data.flight || !data.journey) {
      const checkInterval = setInterval(() => {
        if (data["price"]) {
          clearInterval(checkInterval);
          this.outcomes = travelCalc.init(data);
        }
      }, 5);
    } else {
      this.outcomes = travelCalc.init(data).route;
    }
  }

  initData() {
    this._travelData.getFlights().subscribe(res => {
      return (this.data["flight"] = res);
    });

    this._travelData.getJourneys().subscribe(res => {
      return (this.data["journeys"] = res);
    });

    this._travelData.getPrices().subscribe(res => {
      return (this.data["price"] = res);
    });
  }

  ngOnInit() {}
}
