import { AfterViewInit, Component, Injector, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../base/BaseComponent';
import { GridComponent } from './../../../shared/components/grid/grid';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { ErrorCallback } from './../../base/Callback';
import { PageIdentifier } from './../../base/PageIdentifier';
import { AppModuleRoutes, CCMModuleRoutes } from './../../base/PageRoutes';

@Component({
    templateUrl: 'iCABSCMCustomerContactDetailGrid.html',
    styles: [`
        :host /deep/ .gridtable tbody tr td:nth-child(1) input {
            cursor: pointer;
        }
    `]
})
export class CMCustomerContactDetailGridComponent extends BaseComponent implements AfterViewInit, ErrorCallback {
    @ViewChild('errorModal') public errorModal;
    @ViewChild('contactDetailGrid') contactDetailGrid: GridComponent;
    public pageId: string = ' ';
    public controls = [
        { name: 'CustomerContactNumber', disabled: true },
        { name: 'ContactTypeCode', disabled: true },
        { name: 'ContactTypeDesc', disabled: true },
        { name: 'AccountNumber', disabled: true },
        { name: 'AccountName', disabled: true },
        { name: 'ClosedDate', disabled: true },
        { name: 'ClosedTime', disabled: true },
        { name: 'ActionCount', disabled: true },
        { name: 'ContractNumber', disabled: true },
        { name: 'ContractName', disabled: true },
        { name: 'CurrentOwnerEmployeeCode', disabled: true },
        { name: 'CurrentOwnerEmployeeName', disabled: true },
        { name: 'PremiseNumber', disabled: true },
        { name: 'PremiseName', disabled: true },
        { name: 'CurrentActionEmployeeCode', disabled: true },
        { name: 'CurrentActionEmployeeName', disabled: true },
        { name: 'ProductCode', disabled: true },
        { name: 'ProductDesc', disabled: true },
        { name: 'CustomerContactName', disabled: true },
        { name: 'CreatedDate', disabled: true },
        { name: 'CreatedTime', disabled: true },
        { name: 'CreatedByEmployeeCode', disabled: true },
        { name: 'CreatedByEmployeeName', disabled: true },
        { name: 'ContactNarrative', disabled: true },
        { name: 'ServiceCoverNumber' },
        { name: 'CustomerContact' }
    ];
    private readonly headerParams: any = {
        method: 'ccm/maintenance',
        module: 'tickets',
        operation: 'ContactManagement/iCABSCMCustomerContactDetailGrid'
    };
    public gridParams: any = {
        totalRecords: 0,
        maxColumn: 8,
        itemsPerPage: 10,
        currentPage: 1,
        riGridMode: 0,
        riGridHandle: 16582842
    };
    public showMessageHeader = true;
    public validateProperties: Array<any> = [{
        'type': MntConst.eTypeInteger,
        'index': 0
    }, {
        'type': MntConst.eTypeText,
        'index': 1
    }, {
        'type': MntConst.eTypeText,
        'index': 2
    }, {
        'type': MntConst.eTypeText,
        'index': 3
    }, {
        'type': MntConst.eTypeText,
        'index': 4
    }, {
        'type': MntConst.eTypeText,
        'index': 5
    }, {
        'type': MntConst.eTypeText,
        'index': 6
    }, {
        'type': MntConst.eTypeCode,
        'index': 7
    }, {
        'type': MntConst.eTypeCode,
        'index': 8
    }, {
        'type': MntConst.eTypeText,
        'index': 9
    }, {
        'type': MntConst.eTypeText,
        'index': 12
    }, {
        'type': MntConst.eTypeText,
        'index': 13
    }, {
        'type': MntConst.eTypeText,
        'index': 14
    }];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMCUSTOMERCONTACTDETAILGRID;
        this.pageTitle = this.browserTitle = 'Ticket History';
    }

    public ngAfterViewInit(): void {
        this.setErrorCallback(this);
        let controlsToPopulate: Array<string> = [
            'CustomerContactNumber',
            'AccountNumber',
            'AccountName',
            'ContractNumber',
            'ContractName',
            'PremiseNumber',
            'PremiseName',
            'ProductCode',
            'ProductDesc',
            'ServiceCoverNumber',
            'CurrentOwnerEmployeeCode',
            'CurrentActionEmployeeName',
            'CurrentActionEmployeeCode',
            'CurrentOwnerEmployeeName',
            'CustomerContactName',
            'CreatedDate',
            'CreatedTime',
            'CreatedByEmployeeCode',
            'CreatedByEmployeeName',
            'ActionCount',
            'ClosedDate',
            'ClosedTime',
            'ContactTypeCode',
            'ContactTypeDesc',
            'ContactNarrative'
        ];
        let parentMode: string = this.riExchange.getParentMode();
        switch (parentMode) {
            case 'CallCentreSearch':
                this.setControlValue('CustomerContact', this.riExchange.getParentAttributeValue('CustomerContactRowID'));
                break;
            case 'ContactRelatedTicket':
                this.setControlValue('CustomerContact', this.riExchange.getParentAttributeValue('RelatedCustomerContactRowID'));
                break;
            case 'CallCentreReview':
            case 'ContactCentreAssign':
                this.setControlValue('CustomerContact', this.riExchange.getParentAttributeValue('CustomerContactNumberRowID'));
                break;
            case 'Contact':
                this.setControlValue('CustomerContact', this.riExchange.getParentAttributeValue('CustomerContactRowID'));
                break;
            case 'ContactHistory':
                this.setControlValue('CustomerContact', this.riExchange.getParentAttributeValue('AccountNumberRowID'));
                break;
            default:
                for (let i = 0; i < controlsToPopulate.length; i++) {
                    this.setControlValue(controlsToPopulate[i], this.riExchange.getParentHTMLValue(controlsToPopulate[i]));
                }
                this.loadGrid();
                break;
        }
        if (this.getControlValue('CustomerContact')) {
            this.fetchRecordByRowId();
        }
    }

    public showErrorModal(data: any): void {
        this.errorModal.show({ msg: data, title: 'Error' }, false);
    }

    private fetchRecordByRowId(): void {
        let searchParams: URLSearchParams = this.getURLSearchParamObject();

        searchParams.set(this.serviceConstants.Action, '0');
        searchParams.set('CustomerContactROWID', this.getControlValue('CustomerContact'));
        searchParams.set('CustomerContactNumber', this.getControlValue('CustomerContactNumber'));

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(
            this.headerParams.method,
            this.headerParams.module,
            this.headerParams.operation,
            searchParams
        ).subscribe(data => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data.errorNumber) {
                this.displayError(data.errorMessage);
                return;
            }
            for (let key in data) {
                if (!key || !this.uiForm.controls[key]) {
                    continue;
                }
                this.setControlValue(key, data[key]);
                if (key === 'CreatedTime') {
                    this.setControlValue(key, this.utils.timeInHourMinutes(data[key]));
                }
            }
            this.loadGrid();
            this.getDetails();
        }, error => {
            this.displayError(MessageConstant.Message.GeneralError, error);
        });
    }

    private getDetails(): void {
        let searchParams: URLSearchParams = this.getURLSearchParamObject();
        let formData: any = {};

        searchParams.set(this.serviceConstants.Action, '5');

        formData['CustomerContactROWID'] = this.getControlValue('CustomerContact');
        formData['AccountNumber'] = this.getControlValue('AccountNumber');
        formData['ContractNumber'] = this.getControlValue('ContractNumber');
        formData['PremiseNumber'] = this.getControlValue('PremiseNumber');
        formData['ServiceCoverNumber'] = this.getControlValue('ServiceCoverNumber');
        formData['ProductCode'] = this.getControlValue('ProductCode');
        formData['ContactTypeCode'] = this.getControlValue('ContactTypeCode');
        formData['CreatedByEmployeeCode'] = this.getControlValue('CreatedByEmployeeCode');
        formData['CurrentOwnerEmployeeCode'] = this.getControlValue('CurrentOwnerEmployeeCode');
        formData['CurrentActionEmployeeCode'] = this.getControlValue('CurrentActionEmployeeCode');
        formData['LanguageCode'] = this.riExchange.LanguageCode();

        this.httpService.makePostRequest(this.headerParams.method,
            this.headerParams.module,
            this.headerParams.operation,
            searchParams,
            formData).subscribe(data => {
                if (data.errorMessage) {
                    this.errorModal.show(data, true);
                    return;
                }
                for (let key in data) {
                    if (key) {
                        this.setControlValue(key, data[key]);
                    }
                }
            }, error => {
                this.errorModal.show(error, true);
            });
    }

    private loadGrid(): void {
        let gridURLParams: URLSearchParams = this.getURLSearchParamObject();
        let gridInputParams: any = {};

        gridURLParams.set(this.serviceConstants.GridMode, this.gridParams.riGridMode);
        gridURLParams.set(this.serviceConstants.GridHandle, this.gridParams.riGridHandle);
        gridURLParams.set(this.serviceConstants.PageSize, this.gridParams.itemsPerPage);
        gridURLParams.set(this.serviceConstants.PageCurrent, this.gridParams.currentPage);
        gridURLParams.set(this.serviceConstants.Action, '2');
        gridURLParams.set('CustomerContactNumber', this.getControlValue('CustomerContactNumber'));

        gridInputParams = this.headerParams;
        gridInputParams['search'] = gridURLParams;

        this.contactDetailGrid.loadGridData(gridInputParams);
    }

    public getCurrentPage(curPage: any): void {
        this.gridParams.currentPage = curPage ? curPage.value : this.gridParams.currentPage;
        this.loadGrid();
    }

    public onGridRowDoubleClick(data: any): void {
        this.navigate('', AppModuleRoutes.CCM + CCMModuleRoutes.ICABSCMCONTACTACTIONMAINTENANCE, {
            ContactActionNumber: data['cellData']['text'],
            CustomerContactNumber: this.getControlValue('CustomerContactNumber')
        });
    }
    public getGridInfo(info: any): void {
        let gridTotalItems = this.gridParams.itemsPerPage;
        if (info) {
            this.gridParams.totalRecords = info.totalRows;
        }
    }

    public refresh(): void {
        this.gridParams.currentPage = 1;
        this.loadGrid();
    }

    public displayError(error: any, apiError?: any): void {
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        this.errorService.emitError(error);
        if (apiError) {
            this.logger.error(apiError);
        }
    }
}
