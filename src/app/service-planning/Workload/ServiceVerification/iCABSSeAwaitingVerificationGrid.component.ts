import { Component, OnInit, OnDestroy, ViewChild, NgZone, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { PaginationComponent } from './../../../../shared/components/pagination/pagination';
import { GridComponent } from './../../../../shared/components/grid/grid';
import { BaseComponent } from './../../../../app/base/BaseComponent';
import { PageIdentifier } from './../../../../app/base/PageIdentifier';
import { AuthService } from './../../../../shared/services/auth.service';
import { Http, URLSearchParams } from '@angular/http';
import { Location } from '@angular/common';
import { InternalMaintenanceModuleRoutes, InternalMaintenanceServiceModuleRoutes } from './../../../base/PageRoutes';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
@Component({
    selector: 'icabs-awaiting-verification',
    templateUrl: 'iCABSSeAwaitingVerificationGrid.html',
    styles: [`
        :host /deep/ .gridtable thead tr:nth-child(2) th:nth-child(3) {
            width: 6%;
        }
        :host /deep/ .gridtable thead tr:nth-child(2) th:nth-child(4) {
            width: 10%;
        }
        :host /deep/ .gridtable thead tr:nth-child(2) th:nth-child(11) {
            width: 7%;
        }
        :host /deep/ .gridtable tbody tr td:nth-child(3) input,
        :host /deep/ .gridtable tbody tr td:nth-child(4) input,
        :host /deep/ .gridtable tbody tr td:nth-child(11) input {
            text-align: center;
        }

        :host /deep/ .gridtable tbody tr td:nth-child(3) input,
        :host /deep/ .gridtable tbody tr td:nth-child(4) input,
        :host /deep/ .gridtable tbody tr td:nth-child(11) input,
        :host /deep/ .gridtable tbody tr td:nth-child(13) img,
        :host /deep/ .gridtable tbody tr td:nth-child(14) img {
            cursor: pointer;
        }
    `]
})
export class AwaitingVerificationGridComponent extends BaseComponent implements OnInit {
    public pageId: string = '';
    public controls = [
        { name: 'ServiceBranchNumber', readonly: false, disabled: true, required: false, type: MntConst.eTypeInteger },
        { name: 'BranchName', readonly: false, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ServiceCoverRowID', readonly: false, disabled: false, required: false, type: MntConst.eTypeText },
        { name: 'ContractNumber', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'PremiseNumber', readonly: false, disabled: false, required: false, type: MntConst.eTypeInteger }
    ];
    public validateProperties: Array<any> = [
        {
            'type': MntConst.eTypeCode,
            'index': 0
        }, {
            'type': MntConst.eTypeText,
            'index': 1
        }, {
            'type': MntConst.eTypeInteger,
            'index': 2
        }, {
            'type': MntConst.eTypeCode,
            'index': 3
        }, {
            'type': MntConst.eTypeInteger,
            'index': 4
        }, {
            'type': MntConst.eTypeInteger,
            'index': 5
        }, {
            'type': MntConst.eTypeCurrency,
            'index': 6
        }, {
            'type': MntConst.eTypeInteger,
            'index': 7
        }, {
            'type': MntConst.eTypeInteger,
            'index': 8
        }, {
            'type': MntConst.eTypeCode,
            'index': 9
        }, {
            'type': MntConst.eTypeInteger,
            'index': 10
        }, {
            'type': MntConst.eTypeText,
            'index': 11
        }, {
            'type': MntConst.eTypeImage,
            'index': 12
        }
    ];
    public loggedInBranch: any;
    public inputParams: any = {
        method: 'service-planning/maintenance',
        module: 'areas',
        operation: 'Service/iCABSSeAwaitingVerificationGrid'
    };
    public search: URLSearchParams;
    public maxColumn: number = 14;
    public pageCurrent: string = '1';
    public pageSize: string = '10';
    public totalRecords: number;
    public currentPage: number = 1;

    constructor(injector: Injector, private _authService: AuthService) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEAWAITINGVERIFICATIONGRID;
    }

    @ViewChild('postCodeGrid') postCodeGrid: GridComponent;
    @ViewChild('postCodePagination') postCodePagination: PaginationComponent;

    ngOnInit(): void {
        super.ngOnInit();
        this.pageInitialization();
    }

    public pageInitialization(): void {
        let userCode = this._authService.getSavedUserCode(),
            businessCode = this.utils.getBusinessCode(),
            countryCode = this.utils.getCountryCode();
        this.utils.setTitle('Service Verification');
        this.initForm();
        this.loggedInBranch = this.utils.getBranchCode();
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceBranchNumber', this.loggedInBranch);
        this.lookupBranchName(this.loggedInBranch, businessCode);
        this.loadData(this.inputParams);
    }

    private initForm(): void {
        this.riExchange.renderForm(this.uiForm, this.controls);
    }
    /*# Get and Set Branch Name #*/
    public lookupBranchName(branchNumber: any, businessCode: any): any {
        let lookupIP = [
            {
                'table': 'Branch',
                'query': {
                    'BusinessCode': businessCode,
                    'BranchNumber': branchNumber
                },
                'fields': ['BranchName']
            }
        ];
        this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let Branch = data[0][0];
            if (Branch) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchName', Branch.BranchName);
            }
        });
    }

    public loadData(params: any): void {
        this.setFilterValues(params);
        this.inputParams.search = this.search;
        this.postCodeGrid.loadGridData(this.inputParams);
    }
    public setFilterValues(params: any): void {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set('FilterType', 'All');
        this.search.set('BranchNumber', this.loggedInBranch);//Need to change later
        this.search.set('ReqPremiseLoc', 'True');
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', '919336');
        this.search.set('riCacheRefresh', 'True');
        this.search.set('PageSize', this.pageSize);
        this.search.set('PageCurrent', this.pageCurrent);
        this.search.set('riSortOrder', 'Descending');
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
    }
    public onBackLinkClick(event: any): void {
        event.preventDefault();
        this.location.back();
    }
    public refresh(event: any): void {
        this.pageCurrent = '1';
        this.pageInitialization();
    }

    public getCurrentPage(event: any): void {
        this.pageCurrent = event.value;
        this.updateView();
    }
    public updateView(): void {
        this.loadData(this.inputParams);
    }
    public getGridInfo(info: any): void {
        this.totalRecords = info.totalRows;
    }
    public onGridRowDblClick(event: any): void {
        let cellInfo = 0;
        let ServiceCoverRowID = '';
        let PremiseNumber: any;
        let ContractNumber: any;
        let contractTypeCode = '';
        try {
            cellInfo = event.cellIndex; //event.columnClicked.text.replace(/[\n\r\s]+/g, '');
            ServiceCoverRowID = event.trRowData[2].rowID;
            contractTypeCode = event.trRowData[0].text.split('/')[0];
            ContractNumber = event.trRowData[0].text.split('/')[1];
            PremiseNumber = event.trRowData[2].text;
        } catch (e) {
            this.logger.warn(e);
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverRowID', ServiceCoverRowID);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', ContractNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', PremiseNumber);
        this.riExchange.setParentAttributeValue('ServiceCoverRowID', ServiceCoverRowID);
        this.riExchange.setParentAttributeValue('ContractNumber', ContractNumber);
        this.riExchange.setParentAttributeValue('PremiseNumber', PremiseNumber);

        this.logger.log('DATA', cellInfo, contractTypeCode, ServiceCoverRowID, event);

        switch (cellInfo) {
            case 2: //Premises
                this.router.navigate([this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE], {
                    queryParams: {
                        'parentMode': 'Verification',
                        'PremiseRowID': ServiceCoverRowID,
                        'ContractTypeCode': contractTypeCode
                    }
                });
                break;
            case 3: //ProductCode
                this.router.navigate([this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE], {
                    queryParams: {
                        'parentMode': 'ServiceCoverGrid',
                        'ServiceCoverROWID': event.trRowData[3].rowID,
                        'contractTypeCode': contractTypeCode
                    }
                });
                break;
            case 10: //SeqNo
                this.navigate('Verification', InternalMaintenanceServiceModuleRoutes.ICABSSESERVICEAREASEQUENCEMAINTENANCE, { RowID: event.trRowData[3].rowID });
                break;
            case 12: //Located
                this.navigate('Verification', '/application/premiseLocationAllocation', {
                    'parentMode': 'Verification',
                    'ServiceCoverRowID': ServiceCoverRowID,
                    'currentContractType': contractTypeCode,
                    'ContractNumber': ContractNumber,
                    'PremiseNumber': PremiseNumber
                });
                break;
            case 13: //Verified
                let searchPost = new URLSearchParams();
                let postParams: any = {};
                postParams['ServiceCoverRowID'] = event.trRowData[3].rowID;
                postParams['ReqPremiseLoc'] = 'True';
                searchPost.set(this.serviceConstants.Action, '2');
                searchPost.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                searchPost.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                this.ajaxSource.next(this.ajaxconstant.START);
                this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module,
                    this.inputParams.operation, searchPost, postParams)
                    .subscribe(
                    (e) => {
                        if (e['status'] === 'failure') {
                            this.errorService.emitError(e['oResponse']);
                        } else {
                            if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                                this.errorService.emitError(e['oResponse']);
                            } else if (e['errorMessage']) {
                                this.errorService.emitError(e);
                            } else {
                                this.refreshGridData();
                            }
                        }
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    },
                    (error) => {
                        this.errorService.emitError(error);
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    }
                    );
                break;
            default:
                break;
        }
    }

    public refreshGridData(): void {
        let branchNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber');
        this.loggedInBranch = branchNumber;
        this.lookupBranchName(this.loggedInBranch, this.utils.getBusinessCode());
        this.loadData(this.inputParams);
    }

    public getCellData(eventObj: any): void {
        let ServiceCoverRowID = '';
        let PremiseNumber: any;
        let ContractNumber: any;
        try {
            ServiceCoverRowID = eventObj.trRowData[3].rowID;
            ContractNumber = eventObj.trRowData[0].text.split('/')[1];
            PremiseNumber = eventObj.trRowData[2].text;
        } catch (e) {
            this.logger.warn(e);
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverRowID', ServiceCoverRowID);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', ContractNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', PremiseNumber);
        this.riExchange.setParentAttributeValue('ServiceCoverRowID', ServiceCoverRowID);
        this.riExchange.setParentAttributeValue('ContractNumber', ContractNumber);
        this.riExchange.setParentAttributeValue('PremiseNumber', PremiseNumber);
        let columnName = '';
        columnName = eventObj.columnClicked.text;
        switch (columnName) {
            case 'Located':
                this.router.navigate(['application/premiseLocationAllocation'], { queryParams: { parentMode: 'Verification' } });
                break;
            default:
                break;
        }
    }

    public ServiceCoverFocus(): void {
        let searchPost = new URLSearchParams();
        let postParams: any = {};
        postParams['ServiceCoverRowID'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverRowID');
        postParams['ReqPremiseLoc'] = 'true';
        searchPost.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        searchPost.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        searchPost.set(this.serviceConstants.Action, '2');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module,
            this.inputParams.operation, searchPost, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                        this.errorService.emitError(e['oResponse']);
                    } else if (e['errorMessage']) {
                        this.errorService.emitError(e);
                    } else {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceNumber', e['AccountNumber']);
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }
}

