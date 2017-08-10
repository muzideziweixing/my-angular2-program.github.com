import { Injectable } from '@angular/core';
import { DownloadServiceDataService } from './download-service-data.service';
import {
  DownloadProductListValueObj, DownloadProductListSearchObj, DownloadProductDetailsValueObj,
  DownloadProductDetailsSearchObj
} from './download-service.model';
import { HttpPBService, PromiseExt, RespObjModel } from '../../core';

const DOWNLOADPRODUCTLISTVALUEURL = 'downloadProductListValueURL';
const DOWNLOADPRODUCTDETAILSVALUEURL = 'downloadProductDetailsValueURL';

@Injectable()
export class DownloadServicesService {

  constructor(private http: DownloadServiceDataService) { }

  // 获取 - 列表
  public getDownloadProductListValue(page: number, rows: number, args?: DownloadProductListSearchObj) {
    return this.http.get(
      DOWNLOADPRODUCTLISTVALUEURL,
      null,
      Object.assign({ page: page, rows: rows }, args)
    ).then((respObj: DownloadProductListValueObj) => {
      return respObj;
    });
  }

  // 获取 - 详情
  public getDownloadProductDetailsValue(id: any, page: number, rows: number, args?: any) {
    return this.http.get(
      DOWNLOADPRODUCTDETAILSVALUEURL,
      { id: id },
      Object.assign({ page: page, rows: rows }, args)
    ).then((respObj: DownloadProductDetailsSearchObj) => {
      return respObj;
    });
  }
}

