import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'tl-download-record',
  templateUrl: './download-record.component.html',
  styleUrls: ['./download-record.component.css']
})

export class DownloadRecordComponent implements OnInit {

  @Output() onClickProductDetails: EventEmitter<any> = new EventEmitter();

  public showContentFlag: string = 'LIST';
  public goodsInfo;

  constructor() { }

  ngOnInit() { }

  clickProductDetails(event) {
    this.showContentFlag = 'DETAILS';
    console.log('--------------------goodsInfo----------------');
    console.log(event);
    this.goodsInfo = event;
  }
}


