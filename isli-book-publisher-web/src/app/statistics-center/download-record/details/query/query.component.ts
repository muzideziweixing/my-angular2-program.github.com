import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DropDownBoxObj } from '../../../../shared';

@Component({
  selector: 'tl-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class QueryComponent implements OnInit {
  @Output() onQuery: EventEmitter<any> = new EventEmitter();

  @Input() platformValue: any;

  public dropDownBoxObj: DropDownBoxObj;
  public flatform: any;
  public beginEndDate: any;

  constructor() { }

  ngOnInit() {
    this.dropDownBoxInit();
  }

  // 搜索
  query() {
    this.onQuery.emit({
      flatform: this.flatform,
      order_at_start: this.beginEndDate.startDate,
      order_at_end: this.beginEndDate.endDate
    });
  }

  // 平台来源初始化
  dropDownBoxInit() {
    this.dropDownBoxObj = new DropDownBoxObj(200, 26);
    this.platformValue = {
      value: [
        { id: '', name: '全部' },
        { id: '1', name: 'Andriod' },
        { id: '2', name: 'iOS' },
        { id: '3', name: 'Mac' },
        { id: '4', name: 'Windows' },
      ]
    };
  }
}
