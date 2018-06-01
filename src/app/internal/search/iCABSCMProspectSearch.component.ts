import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, Injector, OnInit, OnDestroy, AfterViewInit, ViewChild, Input } from '@angular/core';
import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';
import { TableComponent } from '../../../shared/components/table/table';
import { URLSearchParams } from '@angular/http';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
@Component({
    templateUrl: 'iCABSCMProspectSearch.html'
})

export class ProspectSearchComponent extends BaseComponent implements OnInit, OnDestroy {


    @ViewChild('ProspectSearchTable') ProspectSearchTable: TableComponent;
    @ViewChild('ProspectSearchValue') ProspectSearchValue;
    @ViewChild('errorModal') public errorModal;
    @Input() inputParams: any;
    public pageId: string = '';
    public controls = [
        { name: 'StatusSelect' },
        { name: 'DateSelect', type: MntConst.eTypeDate },
        { name: 'ProspectSearchType' },
        { name: 'ProspectSearchValue' },
        { name: 'DateCompare', type: MntConst.eTypeDate }
    ];
    public showTable: boolean = true;
    public showMessageHeader: boolean = true;
    public enableAddNew = true;
    public showAddNew = true;
    public columns: Array<any> = [];
    public rows: Array<any> = [];
    public rowmetadata: Array<any> = [];
    public strDocTitle: any;
    public queryParams: any = {
        operation: 'ContactManagement/iCABSCMProspectSearch',
        module: 'prospect',
        method: 'prospect-to-contract/search'
    };
    public tdMenuDisplay: boolean = true;
    public itemsPerPage: number = 10;
    public page: number = 1;
    // public totalItem: number = 11;
    public tableheading: string;
    public isCopyMode: boolean = false;
    private selectedStatus: string = '';
    public strProspectOriginCode: any;
    public prospectValueSize: any = 30;

    constructor(injector: Injector,
        private ellipsis: EllipsisComponent) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMPROSPECTSEARCH;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Prospect Search';
        this.riExchange.riInputElement.SetValue(this.uiForm, 'StatusSelect', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProspectSearchType', 'number');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'DateSelect', 'From');
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public onAddNew(data: number): void {
        let returnObj = {
            'AddMode': true
        };
        this.ellipsis.sendDataToParent(returnObj);
    }

    public buildTableColumns(): void {
        this.showTable = true;
        if (this.getControlValue('ProspectSearchType') === 'number' && this.getControlValue('ProspectSearchValue')) {
            let patt = new RegExp('^[0-9]*$');
            if (!patt.test(this.getControlValue('ProspectSearchValue'))) {
                this.showTable = false;
                this.errorModal.show({ msg: 'Type mismatch', title: 'Error' }, false);
            } else {
                this.callTable();
            }
        } else {
            this.callTable();

        }
    }

    private callTable(): void {
        this.showTable = true;
        this.columns = new Array();
        this.getTranslatedValue('Number', null).subscribe((res: string) => {
            if (res) {
                this.columns.push({ title: res, name: 'ProspectNumber', type: MntConst.eTypeInteger });
            } else {
                this.columns.push({ title: 'Number', name: 'ProspectNumber', type: MntConst.eTypeInteger });
                // this.columns.push({ title: 'Number', name: 'ProspectNumber', sort: 'DESC' });
            }
        });
        if (this.inputParams.vAddURLParam) {
            if (this.inputParams.vAddURLParam.match(new RegExp('Confirm', 'i'))) {
                this.getTranslatedValue('Branch', null).subscribe((res: string) => {
                    if (res) {
                        this.columns.push({ title: res, name: 'BranchNumber', type: MntConst.eTypeInteger });
                    } else {
                        this.columns.push({ title: 'Branch', name: 'BranchNumber', type: MntConst.eTypeInteger });
                    }
                });
            }
        }
        this.getTranslatedValue('Name', null).subscribe((res: string) => {
            if (res) {
                this.columns.push({ title: res, name: 'Name', type: MntConst.eTypeText });
            } else {
                this.columns.push({ title: 'Name', name: 'Name', type: MntConst.eTypeText });
            }
        });
        this.getTranslatedValue('Date', null).subscribe((res: string) => {
            if (res) {
                this.columns.push({ title: res, name: 'ProspectDate', type: MntConst.eTypeDate });
            } else {
                this.columns.push({ title: 'Date', name: 'ProspectDate', type: MntConst.eTypeDate });
            }
        });
        this.getTranslatedValue('Origin', null).subscribe((res: string) => {
            if (res) {
                this.columns.push({ title: res, name: 'ProspectOriginDesc', type: MntConst.eTypeText });
            } else {
                this.columns.push({ title: 'Origin', name: 'ProspectOriginDesc', type: MntConst.eTypeText });
            }
        });
        this.getTranslatedValue('Status', null).subscribe((res: string) => {
            if (res) {
                this.columns.push({ title: res, name: 'ProspectStatusDesc', type: MntConst.eTypeText });
            } else {
                this.columns.push({ title: 'Status', name: 'ProspectStatusDesc', type: MntConst.eTypeText });
            }
        });
        this.getTranslatedValue('Line of Service', null).subscribe((res: string) => {
            if (res) {
                this.columns.push({ title: res, name: 'LOSCode', type: MntConst.eTypeInteger });
            } else {
                this.columns.push({ title: 'Line of Service', name: 'LOSCode', type: MntConst.eTypeInteger });
            }
        });
        this.getTranslatedValue('Line of Service', null).subscribe((res: string) => {
            if (res) {
                this.columns.push({ title: res, name: 'LOSName', type: MntConst.eTypeText });
            } else {
                this.columns.push({ title: 'Line of Service', name: 'LOSName', type: MntConst.eTypeText });
            }
        });

        this.buildTable();
    }

    private buildTable(): void {
        let search = new URLSearchParams();
        search.set('action', '0');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (this.strProspectOriginCode !== '') {
            search.set('ProspectOriginCode', this.strProspectOriginCode);
        }
        if (this.inputParams.vAddURLParam) {
            if (!this.inputParams.vAddURLParam.match(new RegExp('Confirm', 'i'))) {
                search.set('BranchNumber', this.utils.getBranchCode());
            }
        }
        if (this.getControlValue('StatusSelect') !== '') {
            search.set('StatusSelect', this.getControlValue('StatusSelect'));
        }
        //   if (this.getControlValue('ProspectSearchValue') !== '') {
        switch (this.getControlValue('ProspectSearchType')) {
            case 'namebegins':
                search.set('ProspectName', this.getControlValue('ProspectSearchValue'));
                search.set('search.op.ProspectName', 'BEGINS');
                search.set('SearchType', 'name');
                break;
            case 'namematches':
                search.set('ProspectName', this.getControlValue('ProspectSearchValue'));
                search.set('search.op.ProspectName', 'CONTAINS');
                search.set('SearchType', 'name');
                break;
            case 'number':
                search.set('ProspectNumber', this.getControlValue('ProspectSearchValue'));
                search.set('search.op.ProspectNumber', 'LE');
                search.set('SearchType', 'number');
                break;
        }
        //  }
        if (this.getControlValue('DateCompare') && this.getControlValue('DateCompare') !== '') {
            if (this.getControlValue('DateSelect') === 'From') {
                search.set('DateFrom', this.getControlValue('DateCompare'));
                search.set('search.op.DateFrom', 'GE');
            }
            if (this.getControlValue('DateSelect') === 'To') {
                search.set('DateTo', this.getControlValue('DateCompare'));
                search.set('search.op.DateTo', 'LE');
            }
        }

        switch (this.getControlValue('ProspectSearchType')) {
            case 'namebegins':
            case 'namematches':
                // search.set('search.sortby', 'ProspectName');
                // search.set('jsonSortField', 'Prospect.ProspectName');
                break;
            case 'number':
                // search.set('search.sortby', 'ProspectNumber DESC');
                // search.set('jsonSortField', 'Prospect.ProspectNumber');
                break;
        }
        //search.set('sort', 'true');
        this.queryParams.search = search;
        this.ProspectSearchTable.loadTableData(this.queryParams);
    }

    public tableRowClick(event: any): void {
        let returnObj: any;
        let vntReturnData = event.row;
        switch (this.inputParams.parentMode) {
            case 'LookUp':
                returnObj = {
                    'ProspectNumber': vntReturnData.ProspectNumber,
                    'LOSCode': vntReturnData.LOSCode
                };
                this.ellipsis.sendDataToParent(returnObj);
                break;
            case 'LookUp-AddressCleansing':
                returnObj = {
                    'ProspectNumber': vntReturnData.ProspectNumber,
                    'Name': vntReturnData.Name,
                    'LOSCode': vntReturnData.LOSCode
                };
                this.ellipsis.sendDataToParent(returnObj);
                break;
            case 'LookUp-AdvantageReport':
                returnObj = {
                    'ProspectNumber': vntReturnData.ProspectNumber,
                    'PremiseName': vntReturnData.Name
                };
                this.ellipsis.sendDataToParent(returnObj);
                break;
            case 'ProspectCopy':
                this.copyProspect(vntReturnData);
                break;
            default:
                returnObj = {
                    'ProspectNumber': vntReturnData.ProspectNumber,
                    'LOSCode': vntReturnData.LOSCode
                };
                this.ellipsis.sendDataToParent(returnObj);
                break;
        }
    }

    private copyProspect(data: any): void {
        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '6');
        let postParams: any = {};
        let returnObj: any;
        postParams.ProspectNumber = data.ProspectNumber;
        postParams.FunctionName = 'ProspectCopy';

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.errorService.emitError(new Error(e['errorMessage']));
                    } else {
                        returnObj = {
                            'BusinessCode': e.BusinessCode,
                            'ProspectNumber': e.ProspectNumber,
                            'ProspectName': e.Name,
                            'AddressLine1': e.AddressLine1,
                            'AddressLine2': e.AddressLine2,
                            'AddressLine3': e.AddressLine3,
                            'AddressLine4': e.AddressLine4,
                            'AddressLine5': e.AddressLine5,
                            'Postcode': e.Postcode,
                            'ContactName': e.ContactName,
                            'ContactPosition': e.ContactPosition,
                            'ContactTelephone': e.ContactTelephone,
                            'ContactFax': e.ContactFax,
                            'ContactMobile': e.ContactMobile,
                            'ContactEmail': e.ContactEMail,
                            'ContactMediumCode': e.ContactMediumCode,
                            'SMSMessage': e.SMSMessage,
                            'AccountNumber': e.AccountNumber,
                            'ContractNumber': e.ContractNumber,
                            'PremiseNumber': e.PremiseNumber,
                            'CommenceDate': e.CommenceDate,
                            'ContractExpiryDate': e.ContractExpiryDate,
                            'PaymentTypeCode': e.PaymentTypeCode,
                            'CustomerTypeCode': e.CustomerTypeCode,
                            'InvoiceGroupNumber': e.InvoiceGroupNumber,
                            'NegotiatingSalesEmployeeCode': e.NegotiatingSalesEmployeeCode,
                            'ServicingSalesEmployeeCode': e.ServicingSalesEmployeeCode,
                            'PurchaseOrderNumber': e.PurchaseOrderNumber,
                            'ClientReference': e.ClientReference,
                            'PremiseName': e.PremiseName,
                            'PremiseAddressLine1': e.PremiseAddressLine1,
                            'PremiseAddressLine2': e.PremiseAddressLine2,
                            'PremiseAddressLine3': e.PremiseAddressLine3,
                            'PremiseAddressLine4': e.PremiseAddressLine4,
                            'PremiseAddressLine5': e.PremiseAddressLine5,
                            'PremisePostcode': e.PremisePostcode,
                            'BranchNumber': e.BranchNumber,
                            'PremiseContactName': e.PremiseContactName,
                            'PremiseContactPosition': e.PremiseContactPosition,
                            'PremiseContactTelephone': e.PremiseContactTelephone,
                            'PremiseContactMobile': e.PremiseContactMobile,
                            'PremiseContactFax': e.PremiseContactFax,
                            'PremiseContactEmail': e.PremiseContactEmail,
                            'BusinessOriginCode': e.BusinessOriginCode,
                            'BusinessSourceCode': e.BusinessSourceCode,
                            'BusinessOriginDetailCode': e.BusinessOriginDetailCode,
                            'ContactTypeCode': e.ContactTypeCode,
                            'ContactTypeDetailCode': e.ContactTypeDetailCode,
                            'CallLogID': e.CallLogID,
                            'ProspectStatusCode': e.ProspectStatusCode,
                            'Narrative': e.Narrative,
                            'ConvertedToNumber': e.ConvertedToNumber,
                            'PDALeadEmployeeCode': e.PDALeadEmployeeCode,
                            'DaysOld': e.DaysOld,
                            'Probability': e.Probability,
                            'EstimatedContractQuotes': e.EstimatedContractQuotes,
                            'EstimatedJobQuotes': e.EstimatedJobQuotes,
                            'EstimatedProductSaleQuotes': e.EstimatedProductSaleQuotes,
                            'EstimatedContractValue': e.EstimatedContractValue,
                            'EstimatedJobValue': e.EstimatedJobValue,
                            'EstimatedProductSaleValue': e.EstimatedProductSaleValue,
                            'ExpectedValue': e.ExpectedValue,
                            'ExpectedJobValue': e.ExpectedJobValue,
                            'ExpectedProductSaleValue': e.ExpectedProductSaleValue,
                            'EstimatedClosedDate': e.EstimatedClosedDate,
                            'WODate': e.WODate,
                            'WOStartTime': e.WOStartTime,
                            'WOEndTime': e.WOEndTime,
                            'DefaultAssigneeEmployeeCode': e.DefaultAssigneeEmployeeCode,
                            'DecisionMakerInd': e.DecisionMakerInd
                        };
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.ellipsis.sendDataToParent(returnObj);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.ellipsis.sendDataToParent(returnObj);
            });

    }

    public refresh(): void {
        this.buildTableColumns();
    }

    public updateView(params: any): void {
        this.inputParams = params;
        if (this.inputParams && this.inputParams.showAddNew === true) {
            this.showAddNew = true;
        } else {
            this.showAddNew = false;
        }
        this.strDocTitle = 'Prospect Search';
        this.tableheading = this.strDocTitle;
        if (this.inputParams.vAddURLParam) {
            if (this.inputParams.vAddURLParam.match(new RegExp('Prospect', 'i'))) {
                this.strDocTitle = 'Prospect Search';
                this.getTranslatedValue(this.strDocTitle, null).subscribe((res: string) => {
                    if (res) { this.strDocTitle = res; }
                });
                this.strProspectOriginCode = '02';
            }
            if (this.inputParams.vAddURLParam.match(new RegExp('NatAxJob', 'i'))) {
                this.strDocTitle = 'National Account Job Search';
                this.getTranslatedValue(this.strDocTitle, null).subscribe((res: string) => {
                    if (res) { this.strDocTitle = res; }
                });
                this.strProspectOriginCode = '03';
            }
            if (this.inputParams.vAddURLParam.match(new RegExp('Confirm', 'i'))) {
                this.strDocTitle = 'National Account Job Search';
                this.getTranslatedValue(this.strDocTitle, null).subscribe((res: string) => {
                    if (res) { this.strDocTitle = res; }
                    this.utils.setTitle(this.strDocTitle);
                });
                this.strProspectOriginCode = '03';
            }
            this.utils.getBusinessDesc(this.utils.getBusinessCode()).subscribe((data) => {
                let businessName = data.BusinessDesc;
                this.tableheading = this.strDocTitle + ' - ' + businessName;
            });
        }
        this.buildTableColumns();
    }

    public dateFromSelectedValue(value: any): void {
        if (value && value.value) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateCompare', value.value);
        } else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateCompare', '');
        }
    }

    public prospectSearchType_onchange(): void {
        this.UpdateHTML();
    }

    private UpdateHTML(): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProspectSearchValue', '');
        switch (this.getControlValue('ProspectSearchType')) {
            case 'namebegins':
            case 'namematches':
                this.prospectValueSize = 30;
                break;
            case 'number':
                this.prospectValueSize = 8;
                break;
        }
        this.ProspectSearchValue.nativeElement.focus();
    }

    public cmdSearch_onclick(): void {
        this.buildTableColumns();
    }
}

