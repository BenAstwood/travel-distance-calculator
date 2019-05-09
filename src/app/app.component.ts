import {Component, OnInit} from "@angular/core";
import {CalcTravelComponent} from "./components/calc-travel/calc-travel.component";

@Component({selector: "app-root", templateUrl: "./app.component.html", styleUrls: ["./app.component.scss"]})
export class AppComponent implements OnInit {
  title = "Check your travel distance!";

  ngOnInit() {}
}
