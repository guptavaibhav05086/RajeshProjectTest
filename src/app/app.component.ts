import { Component, OnInit, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '../../node_modules/@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  title = 'app';
  public showNav: boolean;
  public currentUrl: string;

  constructor(public router: Router, @Inject(DOCUMENT) document: any){
    this.currentUrl = document.location.href;
  }

  ngOnInit(): void {
    this.showNav = !this.currentUrl.includes("login");
    this.subscribeToRoute();
  }

  private subscribeToRoute() : void {
    this.router.events.subscribe((val) => {
      if( val instanceof NavigationEnd) {
       //console.log(val);
       this.showNav = !(val.url.includes("/login"));
      }
   });
  }
}
