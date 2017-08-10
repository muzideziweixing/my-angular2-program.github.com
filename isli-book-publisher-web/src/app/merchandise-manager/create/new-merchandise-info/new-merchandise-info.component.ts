import { Component, OnInit, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { CalendarObj, FormUtil, CommonFuncService, SubscriptionService } from "../../../shared";
import { FileUploadModule } from 'primeng/primeng';
import { CreateService } from '../create.service';

@Component({
    selector: 'tl-new-merchandise-info',
    templateUrl: './new-merchandise-info.component.html',
    styleUrls: ['./new-merchandise-info.component.css']
})
export class NewMerchandiseInfoComponent implements OnInit {

    @Input() goodsId;

    @Output() OnNoBaseInfoNext: EventEmitter<any> = new EventEmitter();

    public newMerchandiseForm: FormGroup;
    public formUtil: FormUtil;
    public languagesInfo = [];
    public linkEBookFlag = false;
    public isReadonly: boolean = false;
    public calendarObj: CalendarObj;
    public bookCover = 'assets/images/picDefault.png';
    public ImgDefault = 'assets/images/picDefault.png';
    public uploadFile: File;
    public qtRef: any;
    public keyName: string = 'name';

    public wordLength: number = 0;
    private isRelevancy = false;


    constructor(private el: ElementRef, private fb: FormBuilder, private cs: CreateService, private subs: SubscriptionService) {
        this.calendarObj = new CalendarObj();
        this.calendarObj.placeholder = '请选择制作日期';
        this.calendarObj.readonly = true;
        this.calendarObj.yearNavigator = true;
        this.calendarObj.monthNavigator = true;
        this.calendarObj.showOtherMonths = true;
        // this.buildDialog();
        this.buildForm();
    }
    // isbnReadonly(value) {
    //     if (!value) { return null; }
    //     let arr = value.split(',');
    //     for (let i of arr) {
    //         if (!i) { return null; }
    //     }
    //     return this.isReadonly && this.isRelevancy ? 'readonly' : null;
    // }

    // readonly(value) {
    //     return this.isReadonly && this.isRelevancy && value ? 'readonly' : null;
    // } 
    ngOnInit() {
        this.formUtil = new FormUtil(this.el, this.newMerchandiseForm, this.validationMessages);
        console.log(this.formUtil);
        //语种信息请求
        // this.cs.getLanguagesInfo().then(
        //     (respObj) => {
        //         this.languagesInfo = respObj.data;
        //         this.newMerchandiseForm.patchValue({ book_lang: this.getBookLang(this.newMerchandiseForm.value.book_lang) });
        //     }, (error) => {
        //         console.dir(error);
        //     }
        // );
    }
    //图片上传
    imgUpLoading(event) {
        if (!event.target.files.length) {
            this.bookCover = undefined;
            this.uploadFile = undefined;
            this.newMerchandiseForm.patchValue({ transaction_voucher: '' });
            return;
        }
        let oFReader = new FileReader();
        oFReader.onload = (ofEvent: any) => {
            this.bookCover = ofEvent.target.result;
        };
        oFReader.readAsDataURL(event.target.files[0]);
        this.uploadFile = event.target.files[0];
        this.newMerchandiseForm.patchValue({ imgs: 'self_upload' });
    }
    selectLocalPic() {
        this.qtRef.qtSelectPictureDialg("local", "local");
    }
    //字符串转化为日期格式
    strToDate(str) {
        let arr = str.split('-');
        let date = new Date(arr[0], (Number(arr[1]) - 1), arr[2]);
        return date;
    }
    //日期格式转化
    formatDate = function (date) {
        if (!date) {
            return '';
        }
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '-' + m + '-' + d;
    };
    //获取book_lang--语种
    getBookLong(value) {
        if (!value && this.languagesInfo && this.languagesInfo.length) {
            return '汉语';
        }
        return value;
    }
    //图书简介字数统计
    countLength(event) {
        this.wordLength = event.target.textLength;
        console.log(event);
    }
    //提交
    onSubmit() {
        this.formUtil.validate();
        // if (this.newMerchandiseForm.valid) { 
        //     this.linkEBookFlag = false;
        // }

        if (this.newMerchandiseForm.valid) {
            // if (this.uploadFile && (this.bookCover != this.bookCoverReadOnly)) {
            //     this.cs.uploadImg(this.goodsId, this.uploadFile);
            //     this.bookCoverReadOnly = this.bookCover;
            // }
            // this.onDone.emit({
            //     pubInfoForm: this.pubInfoForm.value,
            //     fmr_book_cover: this.bookCover
            // });
        }
    }


    //----------------start 表单验证------------------
    buildForm() {
        this.newMerchandiseForm = this.fb.group({
            'book_file': ['', [Validators.required]],
            'book_name': ['', [Validators.required]],
            'book_isbn': this.fb.group({
                'book_isbn1': ['', [Validators.required, Validators.pattern(/^(978|979)$/)]],
                'book_isbn2': ['', [Validators.required, Validators.pattern(/^\d{1}$/)]],
                'book_isbn3': ['', [Validators.required, Validators.pattern(/^\d{2,7}$/)]],
                'book_isbn4': ['', [Validators.required, Validators.pattern(/^\d{1,6}$/)]],
                'book_isbn5': ['', [Validators.required, Validators.pattern(/^\d{1}$/)]]
            }, { validator: this.isbnValid('book_isbn1', 'book_isbn2', 'book_isbn3', 'book_isbn4', 'book_isbn5') }),
            'book_desc': ['', [Validators.required, Validators.maxLength]],
            'book_author': ['', [Validators.required]],
            'book_distributor': ['', [Validators.required]],
            'book_language_id': ['汉语', [Validators.required, Validators.pattern(/^\S+$/)]],
            'book_make_time': ['', [Validators.required]],
            'book_pic_upload': ['', [Validators.required, this.ImageSizeVaild(), this.ImageWidthHeightValid()]],
        });
    }
    mesg(field: string) {
        return this.formUtil.mesg(field);
    }
    validationMessages = {
        'book_file': { 'required': '请上传图书文件' },
        'book_name': { 'required': '请输入书名', 'maxlength': '请输入小于300长度的字符' },
        'book_isbn': { 'isbnPart': '第三组和第四组一共为8位数字', 'isbn': '请输入正确的ISBN号', },
        'book_isbn1': { 'required': '请输入完整的ISBN号', 'pattern': '第一组必须为978或979' },
        'book_isbn2': { 'required': '请输入完整的ISBN号', 'pattern': '第二组为1位数字' },
        'book_isbn3': { 'required': '请输入完整的ISBN号', 'pattern': '第三组2~7位数字' },
        'book_isbn4': { 'required': '请输入完整的ISBN号', 'pattern': '第四组为1~6位数字' },
        'book_isbn5': { 'required': '请输入完整的ISBN号', 'pattern': '第五组为1位数字' },
        'book_desc': { 'required': '请输入图书简介' },
        'book_author': { 'required': '请输入著作者' },
        'book_distributor': { 'required': '请输入发行者', 'maxlength': '请输入小于100长度的字符' },
        'book_language_id': { 'required': '请选择语种信息' },
        'book_make_time': { 'required': '请选择制作时间' },
        'book_pic_upload': { 'required': '请选择图书封面', 'imageSize': '图片大小不符合要求', 'imageHeightWidth': '图片长宽不符合要求' },
    };
    /**
     * 验证第三组和第四组一共为8位数字
     * @param ctrlN1
     * @param ctrlN2
     * @returns {any}
     */
    isbnPartValidator(ctrlN1: string, ctrlN2: string): ValidatorFn {
        return ((control: AbstractControl): { [key: string]: any } => {
            const ctrl1 = control.get(ctrlN1);
            const ctrl2 = control.get(ctrlN2);
            return ((ctrl1 && ctrl1.value && ctrl2 && ctrl2.value && (ctrl2.value.length + ctrl1.value.length) || 0) > 8) ? {
                'isbnPart': {
                    'ctrl1': ctrl1 && ctrl1.value && ctrl1.value.length,
                    'ctrl2': ctrl2 && ctrl2.value && ctrl2.value.length
                }
            } : null;
        });
    }
    isbnValid(ctrlN1: string, ctrlN2: string, ctrlN3: string, ctrlN4: string, ctrlN5: string) {
        return ((control: AbstractControl): { [key: string]: any } => {
            const book_isbn1 = control.get(ctrlN1).value;
            const book_isbn2 = control.get(ctrlN2).value;
            const book_isbn3 = control.get(ctrlN3).value;
            const book_isbn4 = control.get(ctrlN4).value;
            const book_isbn5 = control.get(ctrlN5).value;
            if (book_isbn3 && book_isbn4 && (book_isbn4.length + book_isbn3.length != 8)) {
                return {
                    'isbnPart': {
                        'ctrl1': book_isbn3 && book_isbn3.length,
                        'ctrl2': book_isbn4 && book_isbn4.length
                    }
                };
            }
            return this.validISBNCode([book_isbn1, book_isbn2, book_isbn3, book_isbn4, book_isbn5].join('')) ? null : {
                isbn: true
            };
        });
    }

    isBarCode(s) {
        if (s.length != 13) {
            return false;
        }
        var reg = new RegExp(/^[0-9]{12}$/);
        return reg.exec(s.substring(0, 12));
    }

    validISBNCode(s) {
        if (!this.isBarCode(s)) {
            return false;
        }
        var a = 0, b = 0, c = 0, d = 0, d = 0, e;
        for (var i = 1; i <= 12; i++) {
            var sc = parseInt(s[i - 1]);
            if (i <= 12 && i % 2 == 0) {
                a += sc;
            } else if (i <= 11 && i % 2 == 1) {
                b += sc;
            }
        }
        c = a * 3;
        d = b + c;
        if (d % 10 == 0)
            e = d - d;
        else
            e = d + (10 - d % 10) - d;
        return e == parseInt(s[i - 1]);
    }
    /*验证上传图书封面*/
    ImageSizeVaild() {
        return ((control): { [key: string]: any } => {
            const fileName = control.value;
            if (!fileName || fileName.substr(0, 'self_qt_image'.length) != 'self_qt_image') {
                return null;
            }
            let splitStr = fileName.split('_');
            let fileSize = splitStr.pop();
            fileSize = parseInt(fileSize, 10);
            if (fileSize > 1024 * 1024 * 2) {
                return { 'imageSize': false };
            }
            return null;
        });
    }
    ImageWidthHeightValid() {
        return ((control): { [key: string]: any } => {
            const fileName = control.value;
            if (!fileName || fileName.substr(0, 'self_qt_image'.length) != 'self_qt_image') {
                return null;
            }
            let splitStr = fileName.split('_');
            splitStr.pop();
            let height = splitStr.pop();
            let width = splitStr.pop();
            height = parseInt(height, 10);
            width = parseInt(width, 10);
            if (height < 840 || width < 600) {
                return { 'imageHeightWidth': false };
            }
            return null;
        });
    }
}
