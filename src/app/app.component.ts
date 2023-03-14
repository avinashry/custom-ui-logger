import { Component, OnInit } from '@angular/core';
import { ConsoleApiName, ConsoleLog, initConsoleObservable } from 'src/consolemonitor/consoleObservable';
import { startLogs } from 'src/consolemonitor/startLogs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements  OnInit  {
  title = 'custom-ui-logger';
  public message ="";

  ngOnInit() {
 // all code for remote logger is in folder consolemonitor
  startLogs();
  //to simulate log 
  setInterval(() => {
    console.log("Polling is 5000 ms")
    console.warn("Polling is 5000 ms warn")
    console.info("Polling is 5000 ms info")
    console.debug("Polling is 5000 ms debug")
    }, 5000);
}


}
