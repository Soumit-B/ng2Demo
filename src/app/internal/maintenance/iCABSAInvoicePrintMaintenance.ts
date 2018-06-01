import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { InternalMaintenanceSalesModuleRoutes } from './../../base/PageRoutes';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { InvoiceSearchComponent } from './../search/iCABSInvoiceSearch.component';
import { GridComponent } from './../../../shared/components/grid/grid';
import { ErrorCallback, MessageCallback } from './../../base/Callback';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { URLSearchParams } from '@angular/http';
import { BCompanySearchComponent } from './../search/iCABSBCompanySearch';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, Injector, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';

@Component({
    templateUrl: 'iCABSAInvoicePrintMaintenance.html',
    styles: [`
    :host /deep/ .gridtable tbody tr td:nth-child(2),
    :host /deep/ .gridtable tbody tr td:nth-child(2) div,
    :host /deep/ .gridtable tbody tr td:nth-child(2) div span {
        cursor: pointer;
    }`]
})

export class InvoicePrintMaintenanceComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy, ErrorCallback, MessageCallback {
    @ViewChild('companyDropdown') companyDropdown: BCompanySearchComponent;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('invoicePrintLineGrid') invoicePrintLineGrid: GridComponent;
    @ViewChild('promptConfirmModal') public promptConfirmModal;
    @ViewChild('invoiceSearchEllipsis') public invoiceSearchEllipsis: EllipsisComponent;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public pageId: string = '';
    public controls: any = [
        { name: 'CompanyInvoiceNumber' },
        { name: 'CopyInvoice' },
        { name: 'InvoiceName' },
        { name: 'InvoiceAddressLine1' },
        { name: 'InvoiceAddressLine2' },
        { name: 'InvoiceAddressLine3' },
        { name: 'InvoiceAddressLine4' },
        { name: 'InvoiceAddressLine5' },
        { name: 'InvoicePostcode' },
        { name: 'CompanyVATNumber' },
        { name: 'InvoiceNumber', type: MntConst.eTypeInteger },
        { name: 'PrintLineNumber' },
        { name: 'CompanyCode' },
        { name: 'CompanyDesc' }
    ];
    public tabs: any = {
        tab0: { active: true },
        tab1: { active: false },
        tab2: { active: false }
    };
    public gridParams: any = {
        totalRecords: 0,
        maxColumn: 4,
        itemsPerPage: 10,
        currentPage: 1,
        riGridMode: 0,
        riGridHandle: 16582842,
        riSortOrder: 'Descending'
    };
    private headerParams: any = {
        method: 'bill-to-cash/maintenance',
        module: 'invoicing',
        operation: 'Application/iCABSAInvoicePrintMaintenance'
    };
    public companyInputParams: any = {};
    public showMessageHeader: boolean = true;
    private sysCharParams: any = {
        enableCompanyCode: false
    };
    public showPromptHeader: boolean = true;
    public promptConfirmContent: string;
    public companyDefault: Object = {
        id: '',
        text: ''
    };
    public isFormDisabled: boolean = true;
    public invoiceSearchComponent = InvoiceSearchComponent;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public inputParams: any = {
        parentMode: 'InvoicePrintMaintenance'
    };
    public validateProperties: Array<any> = [{
        'type': MntConst.eTypeInteger,
        'index': 0
    }, {
        'type': MntConst.eTypeText,
        'index': 1
    }, {
        'type': MntConst.eTypeDecimal2,
        'index': 2
    }, {
        'type': MntConst.eTypeDecimal2,
        'index': 3
    }];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAINVOICEPRINTMAINTENANCE;
        this.pageTitle = 'Invoice Print Maintenance';
        this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;

        this.companyInputParams[this.serviceConstants.CountryCode] = this.utils.getCountryCode();
        this.companyInputParams[this.serviceConstants.BusinessCode] = this.utils.getBusinessCode();
        this.companyInputParams['parentMode'] = 'LookUp';
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.utils.setTitle('Invoice Print Maintenance');
    }

    public ngAfterViewInit(): void {
        this.setErrorCallback(this);
        this.setMessageCallback(this);

        this.getSysChars();

        if (this.isReturning()) {
            this.onTabClick(1);
            this.populateUIFromFormData();
            this.companyDefault = {
                id: this.getControlValue('CompanyCode'),
                text: this.getControlValue('CompanyCode') + ' - ' + this.getControlValue('CompanyDesc')
            };
            this.loadGrid();
            this.enableForm(true, []);
            return;
        }

        if (this.riExchange.getParentHTMLValue('CompanyCode')) {
            this.populateControlsFromParent();
        }

        this.enableForm(false, []);
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public onTabClick(index: number): void {
        if (this.tabs['tab' + index].active) {
            return;
        }

        for (let key in this.tabs) {
            if (!key) {
                continue;
            }

            if (key === 'tab' + index) {
                this.tabs[key].active = true;
                continue;
            }

            this.tabs[key].active = false;
        }
    }

    private populateControlsFromParent(): void {
        let companyCode: string = this.riExchange.getParentHTMLValue('CompanyCode');
        let companyDesc: string = this.riExchange.getParentHTMLValue('CompanyDesc');
        let companyInvoiceNumber: string = this.riExchange.getParentHTMLValue('CompanyInvoiceNumber');

        this.companyDefault = {
            id: companyCode,
            text: companyCode + ' - ' + companyDesc
        };

        this.onCompanyChange({
            CompanyCode: companyCode,
            CompanyDesc: companyDesc
        });

        this.setControlValue('CompanyInvoiceNumber', companyInvoiceNumber);

        this.onCompanyInvoiceNumberChange();
    }

    private getInvoiceNumber(): void {
        let lookUpParam: any = [{
            'table': 'InvoiceHeader',
            'query': {
                'CompanyCode': this.getControlValue('CompanyCode'),
                'BusinessCode': this.utils.getBusinessCode(),
                'CompanyInvoiceNumber': this.getControlValue('CompanyInvoiceNumber')
            },
            'fields': ['InvoiceNumber']
        }];

        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpPromise(lookUpParam, 5).then(data => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (!data[0].length) {
                this.errorService.emitError(MessageConstant.Message.noRecordFound);
                return;
            }
            if (data[0].length > 1) {
                this.inputParams = {
                    parentMode: 'InvoicePrintMaintenance',
                    CompanyInvoiceNumber: this.getControlValue('CompanyInvoiceNumber'),
                    companyCode: this.getControlValue('CompanyCode')
                };
                this.invoiceSearchEllipsis.childConfigParams = this.inputParams;
                this.invoiceSearchEllipsis.openModal();
                return;
            }
            this.setControlValue('InvoiceNumber', data[0][0].InvoiceNumber);
            this.getInvoiceDetails();
        }).catch(error => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.logger.log(error);
            this.errorService.emitError(MessageConstant.Message.GeneralError);
        });
    }

    private getInvoiceDetails(): void {
        let searchParams: URLSearchParams = this.getURLSearchParamObject();

        searchParams.set(this.serviceConstants.Action, '0');
        searchParams.set('CompanyInvoiceNumber', this.getControlValue('CompanyInvoiceNumber'));
        searchParams.set('InvoiceNumber', this.getControlValue('InvoiceNumber'));
        searchParams.set('CompanyCode', this.getControlValue('CompanyCode'));

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method,
            this.headerParams.module,
            this.headerParams.operation,
            searchParams).subscribe(data => {
                let controls: Array<string> = ['InvoiceName', 'InvoiceAddressLine1', 'InvoiceAddressLine2', 'InvoiceAddressLine3', 'InvoiceAddressLine4', 'InvoiceAddressLine5', 'InvoicePostcode', 'CompanyVATNumber'];
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.formPristine();

                if (data.errorMessage) {
                    this.displayError(data.errorMessage);
                    return;
                }

                controls.forEach(control => {
                    if (control && data[control]) {
                        this.setControlValue(control, data[control]);
                    }
                });

                this.pageParams.pageData = data;
                this.loadGrid();
                this.enableForm(true, []);
            }, error => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.formPristine();
                this.logger.log(error);
                this.errorService.emitError(MessageConstant.Message.GeneralError);
            });
    }

    public showErrorModal(msg: any): void {
        this.errorModal.show({ msg: msg, title: 'Error' }, false);
    }

    public showMessageModal(msg: any): void {
        this.messageModal.show({ msg: msg, title: 'Message' }, false);
    }

    private populateForm(): void {
        for (let key in this.pageParams.pageData) {
            if (!key) {
                continue;
            }
            this.setControlValue(key, this.pageParams.pageData[key]);
        }

        this.loadGrid();
        this.setFormMode(this.c_s_MODE_UPDATE);
    }

    private loadGrid(): void {
        let gridURLParams: URLSearchParams = this.getURLSearchParamObject();
        let gridInputParams: any = {};

        gridURLParams.set(this.serviceConstants.GridMode, this.gridParams.riGridMode);
        gridURLParams.set(this.serviceConstants.GridHandle, this.gridParams.riGridHandle);
        gridURLParams.set(this.serviceConstants.GridSortOrder, this.gridParams.riSortOrder);
        gridURLParams.set(this.serviceConstants.PageSize, this.gridParams.itemsPerPage);
        gridURLParams.set(this.serviceConstants.PageCurrent, this.gridParams.currentPage);
        gridURLParams.set('InvoiceNumber', this.getControlValue('InvoiceNumber'));
        gridURLParams.set(this.serviceConstants.Action, '2');

        gridInputParams = this.headerParams;
        gridInputParams['search'] = gridURLParams;

        this.invoicePrintLineGrid.loadGridData(gridInputParams);
    }

    private getSysChars(): void {
        let sysCharURLParams: URLSearchParams = this.getURLSearchParamObject();

        // Set list in URL params
        sysCharURLParams.set(this.serviceConstants.SystemCharNumber, '130');

        // Get syschars
        this.httpService.sysCharRequest(sysCharURLParams).subscribe(
            data => {
                let records: Object;

                // If no record is returned break out
                if (!data || !data.records.length) {
                    return;
                }

                records = data.records;

                this.sysCharParams['enableCompanyCode'] = records[0].Required;

                if (this.sysCharParams['enableCompanyCode']) {
                    return;
                }

                let lookUpParam: any = [{
                    'table': 'Company',
                    'query': {
                        'DefaultCompanyInd': 'TRUE',
                        'BusinessCode': this.utils.getBusinessCode()
                    },
                    'fields': ['CompanyCode', 'CompanyDesc']
                }];

                this.ajaxSource.next(this.ajaxconstant.START);
                this.LookUp.lookUpPromise(lookUpParam, 1).then(data => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (!data[0].length) {
                        return;
                    }
                    this.setControlValue('CompanyCode', data[0][0]['CompanyCode']);
                    this.setControlValue('CompanyDesc', data[0][0]['CompanyDesc']);
                    this.disableControl('CompanyInvoiceNumber', false);
                }).catch(error => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.logger.log(error);
                    this.errorService.emitError(MessageConstant.Message.GeneralError);
                });
            },
            error => {
                this.logger.log(error);
                this.errorService.emitError(MessageConstant.Message.GeneralError);
            }
        );
    }

    public onCompanyChange(data: any): void {
        let companyCode: string = data.CompanyCode;
        this.setControlValue('CompanyCode', data.CompanyCode);
        this.setControlValue('CompanyDesc', data.CompanyDesc);
        if (!companyCode) {
            this.enableForm(false, []);
            return;
        }
        this.enableForm(false, ['CompanyInvoiceNumber']);
        if (this.getControlValue('CompanyInvoiceNumber')) {
            this.getInvoiceNumber();
        }
    }

    public onCompanyInvoiceNumberChange(): void {
        if (!this.getControlValue('CompanyInvoiceNumber')) {
            this.isFormDisabled = true;
            this.enableForm(false, ['CompanyInvoiceNumber', 'CompanyCode', 'CompanyDesc']);
            this.invoicePrintLineGrid.clearGridData();
            this.clearControls(['CompanyCode', 'CompanyDesc']);
            return;
        }
        if (this.getControlValue('CompanyCode')) {
            this.getInvoiceNumber();
            this.isFormDisabled = false;
        }
    }

    public getGridInfo(info: any): void {
        let gridTotalItems = this.gridParams.itemsPerPage;
        if (info) {
            this.gridParams.totalRecords = info.totalRows;
        }
    }

    public onRowSelect(data: any): void {
        if (data.cellIndex !== 1) {
            return;
        }
        this.setControlValue('PrintLineNumber', data['trRowData'][0]['text']);
        this.navigate('InvoicePrintLineUpdate', InternalMaintenanceSalesModuleRoutes.ICABSAINVOICEPRINTLINEMAINTENANCE);
    }

    public onInsertLineClick(): void {
        this.navigate('InvoicePrintLineAdd', InternalMaintenanceSalesModuleRoutes.ICABSAINVOICEPRINTLINEMAINTENANCE);
    }

    public onMoveLineClick(): void {
        this.messageService.emitMessage('iCABSAMoveInvoicePrintLine screen is not yet developed!');
    }

    public getCurrentPage(curPage: any): void {
        this.gridParams.currentPage = curPage ? curPage.value : this.gridParams.currentPage;
        this.loadGrid();
    }

    public refresh(): void {
        this.gridParams.currentPage = 1;
        this.loadGrid();
    }

    public printInvoice(): void {
        let printURLParams: URLSearchParams = this.getURLSearchParamObject();

        printURLParams.set(this.serviceConstants.Action, '0');
        printURLParams.set(this.serviceConstants.Function, 'Single');
        printURLParams.set('InvoiceNumber', this.pageParams.pageData.ttInvoiceHeader);
        printURLParams.set('Copy', this.getControlValue('CopyInvoice') ? 'True' : 'False');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method,
            this.headerParams.module,
            this.headerParams.operation,
            printURLParams).subscribe(data => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    this.errorService.emitError(MessageConstant.Message.GeneralError);
                    return;
                }
                window.open(data.url, '_blank');
            }, error => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.logger.log(error);
                this.errorService.emitError(MessageConstant.Message.GeneralError);
            });
    }

    public saveData(): void {
        this.promptConfirmModal.show();
    }

    public confirmSave(event: any): void {
        let isValidForm: boolean = this.riExchange.validateForm(this.uiForm);
        let formData: any = {};
        let saveQueryParams: URLSearchParams = this.getURLSearchParamObject();

        if (!isValidForm) {
            return;
        }

        // Save logic
        for (let control in this.uiForm.controls) {
            if (!control) {
                continue;
            }
            if (control !== 'CopyInvoice' && control !== 'PrintLineNumber') {
                formData[control] = this.getControlValue(control);
            }
        }
        formData['CompanyCode'] = this.getControlValue('CompanyCode');
        formData['ROWID'] = this.pageParams.pageData.ttInvoiceHeader;

        saveQueryParams.set(this.serviceConstants.Action, '2');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(
            this.headerParams.method,
            this.headerParams.module,
            this.headerParams.operation,
            saveQueryParams,
            formData
        ).subscribe(
            data => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    this.errorService.emitError(data.errorMessage);
                    return;
                }

                if (data.InfoMessage) {
                    this.messageService.emitMessage(data.InfoMessage);
                    return;
                }

                this.messageService.emitMessage(MessageConstant.Message.RecordSavedSuccessfully);

                this.getInvoiceDetails();

                this.formPristine();
            },
            error => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.logger.log(error);
                this.errorService.emitError(MessageConstant.Message.GeneralError);
            }
            );
    }

    public cancelChanges(): void {
        this.populateForm();
    }

    public enableForm(enable: boolean, ignore: Array<string>): void {
        if (enable) {
            this.isFormDisabled = false;
            this.uiForm.enable();
        } else {
            this.uiForm.disable();
            for (let i = 0; i < ignore.length; i++) {
                this.uiForm.controls[ignore[i]].enable();
            }
        }
    }

    public onSaveFocus(e: any): void {
        let nextTab: number = 0;
        let code = (e.keyCode ? e.keyCode : e.which);
        let elemList = document.querySelectorAll('.nav.nav-tabs li');
        let currentSelectedIndex = Array.prototype.indexOf.call(elemList, document.querySelector('.nav.nav-tabs li.active'));
        if (code === 9 && currentSelectedIndex < (elemList.length - 1)) {
            nextTab = currentSelectedIndex + 1;
            this.onTabClick(nextTab);
            setTimeout(() => {
                document.querySelector('.tab-content .tab-pane.active input:not([disabled]), .tab-content .tab-pane.active select:not([disabled])')['focus']();
            }, 100);
        }
        return;
    }

    public onInvoiceSearchDataReceived(data: any): void {
        this.setControlValue('InvoiceNumber', data);
        this.getInvoiceDetails();
    }
}
