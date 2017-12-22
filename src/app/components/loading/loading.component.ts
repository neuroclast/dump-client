import { Component, OnInit } from '@angular/core';

declare var $;

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  hideLoading() {
    $('#loadingModal').modal("hide");
  }

}
