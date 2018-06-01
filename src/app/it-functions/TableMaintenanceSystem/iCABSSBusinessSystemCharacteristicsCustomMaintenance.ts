import { Component, Injector, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Http, URLSearchParams } from '@angular/http';
import { HttpService } from '../../../shared/services/http-service';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { MessageConstant } from './../../../shared/constants/message.constant';
@Component({

    templateUrl: 'iCABSSBusinessSystemCharacteristicsCustomMaintenance.html'
})

export class BusinessSystemCharacteristicsCustomMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {

    @ViewChild('Module') ModuleOptions: DropdownStaticComponent;
    @ViewChild('grdGrid') sysCharGrid: GridComponent;
    @ViewChild('sysCharPagination') sysCharPagination: PaginationComponent;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    public pageId: string = '';
    public inputParams: any = {};
    public method: string = 'it-functions/admin';
    public module: string = 'configuration';
    public operation: string = 'System/iCABSSBusinessSystemCharacteristicsCustomMaintenance';
    public search: URLSearchParams;
    public ModuleText: Array<any>;
    public ModuleObject: Array<any> = [];
    public ModuleData: Array<any> = [{}];
    public pageCurrent: string = '1';
    public curPage: number = 1;
    public pageSize: number = 10;
    public maxColumn: number = 8;
    public itemsPerPage: number = 10;
    public scModule: string = 'X';
    public rowUpdate: boolean = false;
    public isBlur: boolean = false;
    public controls = [{
        name: 'BusinessCode',
        readonly: true,
        disabled: true,
        required: false,
        type: MntConst.eTypeCode
    },
    {
        name: 'BusinessDesc',
        readonly: true,
        disabled: true,
        required: false,
        type: MntConst.eTypeText
    },
    {
        name: 'TextFilter',
        readonly: false,
        disabled: false,
        required: false
    },
    {
        name: 'NumberFilter',
        readonly: true,
        disabled: false,
        required: false
    },
    {
        name: 'SelectedLineRow'
    },
    {
        name: 'SelectedLineRowID'
    }

    ];
    public totalRecords: number = 15;
    public showMessageHeader: boolean = true;
    constructor(private injector: Injector, private _httpService: HttpService) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSBUSINESSSYSTEMCHARACTERISTICSCUSTOMMAINTENANCE;
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.inputParams.module = this.module;

        this.riGrid.DefaultBorderColor = 'ADD8E6';
        this.riGrid.DefaultTextColor = '0000FF';
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = this.pageSize;
        this.riGrid.FunctionUpdateSupport = true;
        this.initForm();
        this.setupPage();
        this.utils.setTitle('Business System Characteristics Maintenance');
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.AddColumn('SCNumber', 'SCNumber', 'SCNumber', MntConst.eTypeInteger, 3, false, '');
        this.riGrid.AddColumnUpdateSupport('SCNumber', false);
        this.riGrid.AddColumnOrderable('SCNumber', true);
        this.riGrid.AddColumn('SCDescription', 'SCDescription', 'SCDescription', MntConst.eTypeTextFree, 30, false, '');
        this.riGrid.AddColumnUpdateSupport('SCDescription', false);
        this.riGrid.AddColumnOrderable('SCDescription', true);
        this.riGrid.AddColumn('SCExists', 'SCExists', 'SCExists', MntConst.eTypeImage, 1, false, '');
        this.riGrid.AddColumnUpdateSupport('SCExists', false);
        this.riGrid.AddColumn('SCRequired', 'SCRequired', 'SCRequired', MntConst.eTypeImage, 1, false, '');
        this.riGrid.AddColumnUpdateSupport('SCRequired', false);
        this.riGrid.AddColumn('SCLogical', 'SCLogical', 'SCLogical', MntConst.eTypeImage, 1, false, '');
        this.riGrid.AddColumnUpdateSupport('SCLogical', false);
        this.riGrid.AddColumn('SCText', 'SCText', 'SCText', MntConst.eTypeTextFree, 40, false, '');
        this.riGrid.AddColumnUpdateSupport('SCText', true);
        this.riGrid.AddColumn('SCValue', 'SCValue', 'SCValue', MntConst.eTypeDecimal2, 8, false, '');
        this.riGrid.AddColumnUpdateSupport('SCValue', true);
        this.riGrid.AddColumn('SCInteger', 'SCInteger', 'SCInteger', MntConst.eTypeInteger, 6, false, '');
        this.riGrid.AddColumnUpdateSupport('SCInteger', true);
        this.riGrid.Complete();

        this.riGrid_BeforeExecute();
    }

    private riGrid_BeforeExecute(): void {
        let gridParams: URLSearchParams = new URLSearchParams();
        gridParams.set(this.serviceConstants.Action, '2');
        gridParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        gridParams.set(this.serviceConstants.CountryCode, this.countryCode());
        gridParams.set('SCModule', this.scModule);
        gridParams.set('TextFilter', this.riExchange.riInputElement.GetValue(this.uiForm, 'TextFilter'));
        gridParams.set('NumberFilter', this.riExchange.riInputElement.GetValue(this.uiForm, 'NumberFilter'));
        gridParams.set('FileUploaded', '');
        gridParams.set('riSortOrder', this.riGrid.SortOrder);
        gridParams.set(this.serviceConstants.GridMode, '0');
        gridParams.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        gridParams.set(this.serviceConstants.PageSize, this.pageSize.toString());
        gridParams.set(this.serviceConstants.PageCurrent, this.curPage.toString());
        gridParams.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.method, this.module, this.operation, gridParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isBlur = false;
                if (data.errorMessage) {
                    return;
                }
                this.curPage = data.pageData ? data.pageData.pageNumber : 1;
                this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.pageSize : 1;

                if (this.riGrid.Update && this.getControlValue('SelectedLineRow')) {
                    this.riGrid.StartRow = this.getControlValue('SelectedLineRow');
                    this.riGrid.StartColumn = 0;
                    this.riGrid.UpdateHeader = false;
                    this.riGrid.UpdateFooter = false;
                }
                this.riGrid.UpdateHeader = true;
                this.riGrid.UpdateBody = true;
                this.riGrid.UpdateFooter = true;
                this.riGrid.Execute(data);
            },
            (error) => {
                this.logger.log('Error', error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public getCurrentPage(currentPage: any): void {
        this.curPage = currentPage.value;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid_BeforeExecute();
    }

    public refresh(): void {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public tbody_onDblclick(event: any): void {
        if (event.srcElement.className === 'pointer') {
            switch (event.srcElement.parentElement.getAttribute('name')) {
                case 'SCRequired':
                case 'SCLogical':
                    this.riGrid.Mode = MntConst.eModeNormal;
                    this.gridFocus(event.srcElement.parentElement.parentElement.parentElement.children[0].children[0].children[0]);
                    this.callRequiredChnagedrequest(this.getControlValue('SelectedLineRowID'), event.srcElement.parentElement.getAttribute('name'));
                    break;
            }
        }
    }

    public updatedata(): void {
        let gridParams: URLSearchParams = this.getURLSearchParamObject();
        gridParams.set(this.serviceConstants.Action, '0');
        gridParams.set('SCNumberRowID', this.riGrid.Details.GetAttribute('SCNumber', 'rowID'));
        gridParams.set('SCNumber', this.riGrid.Details.GetValue('SCNumber'));
        gridParams.set('SCDescription', this.riGrid.Details.GetValue('SCDescription'));
        gridParams.set('SCTextRowID', this.riGrid.Details.GetAttribute('SCText', 'rowID'));
        gridParams.set('SCText', this.riGrid.Details.GetValue('SCText'));
        gridParams.set('SCValueRowID', this.riGrid.Details.GetAttribute('SCValue', 'rowID'));
        gridParams.set('SCValue', this.riGrid.Details.GetValue('SCValue'));
        gridParams.set('SCIntegerRowID', this.riGrid.Details.GetAttribute('SCInteger', 'rowID'));
        gridParams.set('SCInteger', this.riGrid.Details.GetValue('SCInteger'));
        gridParams.set('SCModule', this.scModule);
        gridParams.set('TextFilter', this.riExchange.riInputElement.GetValue(this.uiForm, 'TextFilter'));
        gridParams.set('NumberFilter', this.riExchange.riInputElement.GetValue(this.uiForm, 'NumberFilter'));
        gridParams.set('FileUploaded', '');
        gridParams.set('riSortOrder', this.riGrid.SortOrder);
        gridParams.set(this.serviceConstants.GridMode, '3');
        gridParams.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        gridParams.set(this.serviceConstants.PageSize, this.pageSize.toString());
        gridParams.set(this.serviceConstants.PageCurrent, this.curPage.toString());
        gridParams.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.method, this.module, this.operation, gridParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.logger.log('Error', error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public onHeaderClick(): void {
        this.riGrid_BeforeExecute();
    }

    private gridFocus(rsrcElement: any): void {
        rsrcElement.select();
        this.setControlValue('Sequence', rsrcElement.value);
        this.setControlValue('SelectedLineRowID', rsrcElement.getAttribute('RowID'));
        this.setControlValue('SelectedLineRow', rsrcElement.parentElement.parentElement.parentElement.sectionRowIndex);
    }

    public riGrid_BodyColumnBlur(event: any): void {
        let oldValue: string = '';
        this.riGrid.Mode = MntConst.eModeNormal;
        this.isBlur = true;
        switch (event.srcElement.parentElement.getAttribute('name')) {
            case 'SCText':
                oldValue = this.riGrid.previousValues[5].value;
                break;
            case 'SCValue':
                oldValue = this.riGrid.previousValues[6].value;
                break;
            case 'SCInteger':
                oldValue = this.riGrid.previousValues[7].value;
                break;
            default:
                break;
        }
        let newValue: string = event.target.value;
        if (oldValue !== newValue) {
            this.updatedata();
        }
    }



    public riGrid_AfterExecute(): void {
        if (!this.riGrid.Update) {
            let rowIndex = this.getControlValue('SelectedLineRow') ? this.getControlValue('SelectedLineRow') : 0;
            let rsrcElement = this.riGrid.HTMLGridBody.children[rowIndex].children[0].children[0].children[0];
            this.gridFocus(rsrcElement);
            rsrcElement.focus();
            rsrcElement.select();
        }  // trans successful
    }

    private initForm(): void {
        this.riExchange.renderForm(this.uiForm, this.controls);
    }

    public setupPage(): void {

        this.formData.BusinessCode = this.businessCode();
        let countryCode = this.countryCode();

        this.utils.getBusinessDesc(this.businessCode()).subscribe((data) => {
            this.formData.BusinessDesc = data.BusinessDesc;
            this.populateUIFromFormData();
        });
        this.loadModuleData(this.inputParams);


    }

    public callRequiredChnagedrequest(rowID: string, sc: string): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        this.inputParams.search = this.search;
        let formdata: Object = {};
        formdata['fn'] = 'CheckBox';
        formdata['FieldName'] = sc;
        formdata['Rowid'] = rowID;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
            .subscribe(
            (data) => {
                if (data.errorMessage) {
                    this.errorModal.show(data, true);
                } else {
                    this.refresh();
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorModal.show(error, true);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public updateView(): void {
        this.buildGrid();
    }

    public loadModuleData(params: any): void {
        this.setFilterValuesForBuildModule(params);

        this.inputParams.search = this.search;
        this._httpService.makeGetRequest(this.inputParams.method, this.inputParams.module,
            this.inputParams.operation, this.inputParams.search)
            .subscribe(
            (data) => {
                this.ModuleText = data['ValidList'].split(',');
                for (let i = 0; i < this.ModuleText.length; i++) {
                    let x = this.ModuleText[i].split('|');

                    let a = {
                        'text': x[1],
                        'value': x[0]
                    };
                    this.ModuleObject.push(a);
                }

                this.ModuleData = this.ModuleObject;
            },
            error => {
                this.errorModal.show(error, true);
            }
            );

    }

    public loadData(params: any): void {
        //this.setFilterValuesForGrid(params);
        this.inputParams.search = this.search;
        this.sysCharGrid.loadGridData(this.inputParams);
        this.setFormMode(this.c_s_MODE_UPDATE);
    }

    public loadExportData(params: any): void {
        this.setFilerValueforExport(params);

        this.inputParams.search = this.search;
        this._httpService.makeGetRequest(this.inputParams.method, this.inputParams.module,
            this.inputParams.operation, this.inputParams.search)
            .subscribe(
            (data) => {
                if (data['SuperUserAllowInd'] === 'Y') {
                    this.zone.run(() => {
                        this.messageModal.show({
                            msg: MessageConstant.PageSpecificMessage.exportedFile,
                            title: MessageConstant.Message.MessageTitle
                        }, false);

                    });
                }
            },
            error => {
                this.errorModal.show(error, true);

            }
            );
    }

    public setFilterValuesForBuildModule(params: any): void {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set('fn', 'BuildModuleCombo');
        this.search.set('DTE', this.utils.formatDate(new Date()));
        this.search.set('TME', new Date().getTime().toString());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
    }

    public setFilerValueforExport(param: any): void {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set('fn', 'ExportSystemChars');
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
    }

    public BuildModuleCombo(): void {
        // statement
    }

    public btnImportBSC_onclick(event: any): void {
        /*
        Page will be navigate to Application/iCABSAFileUpload.htm
        */
        this.zone.run(() => {

            this.messageModal.show({
                msg: 'Page under construction.',
                title: 'Message'
            }, false);
        });
    }

    public btnExportBSC_onclick(event: any): void {
        this.loadExportData(this.inputParams);
    }



    public onModuleOptionChange(event: any): void {
        if (this.ModuleOptions.selectedItem) {
            this.scModule = this.ModuleOptions.selectedItem;
            this.riGrid.RefreshRequired();
            this.updateView();
        }
    }

    public getGridInfo(info: any): void {
        this.sysCharPagination.totalItems = info.totalRows;
    }

    public onSubmit(): void {
        return;
    }

}
