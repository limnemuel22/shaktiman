import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { PlatformLocation } from "@angular/common";
import { DatabaseService } from "../../services/database.service";

declare const $;

@Component({
  selector: "app-productdetails",
  templateUrl: "./productdetails.component.html",
  styleUrls: ["./productdetails.component.css"]
})
export class ProductdetailsComponent implements OnInit {
  productName;
  descriptions;
  advantages;
  subtitle;
  srts;
  rotary;
  domain = "http://shaktiman-comretro.ditosoft.com/assets/pdf/";
  filePath;
  filename;
  currentUrl = "";

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private dbService: DatabaseService,
    private location: PlatformLocation
  ) {
    this.location.onPopState(() => {
      setTimeout(() => {
        this.router.navigate([this.router.url]);
      }, 100);
    });

    this.router.events.subscribe(event => {
      this.loadDetails();
    });
  }

  ngOnInit() {}

  goto(val) {
    this.router.navigate(["/products/" + val]);
  }

  loadDetails() {
    let url = this.router.url;
    // console.log(url);
    if (url.split("/")[1] === "products") {
      url = url.replace("/products/", "");
      if (url !== this.currentUrl) {
        this.currentUrl = url;
        this.rotary =
          url === "mini-series" ||
          url === "regular-series" ||
          url === "semi-champion-series" ||
          url === "champion-series"
            ? true
            : false;
        this.setDescriptions(url);
      }
    }
  }

  setDescriptions(val) {
    this.dbService.getPDF("products").subscribe(data => {
      const _ = data[val];
      this.srts = _.srts;
      this.descriptions = _.descriptions;
      this.advantages = _.advantages;
      this.filePath = this.domain + _.fielpath;
      this.productName = _.name;
      this.filename = this.productName + ".pdf";
      this.subtitle = _.subtitle;
      $("#3a").html(_.a3);
      if (val === "post-hole-digger") {
        $("#1a").html(_.a1);
        $("#2a").html(_.a2);
      }

      setTimeout(() => {
        $("#image1").attr("src", _.images[0]);
        $("#image2").attr("src", _.images[1]);
        $("#image3").attr("src", _.images[2]);
        $("#tabimage1").css("background-image", "url(" + _.images[0] + ")");
        $("#tabimage2").css("background-image", "url(" + _.images[1] + ")");
        $("#tabimage3").css("background-image", "url(" + _.images[2] + ")");
        $("#tabvideo").css("background-image", "url(" + _.video[0] + ")");
        $("#videoURL").attr("src", _.images[1]);
      }, 1000);
    });
  }
}
