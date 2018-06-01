import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';

import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { BranchServiceAreaSearchComponent } from './../../internal/search/iCABSBBranchServiceAreaSearch';
import { ServicePlanSearchComponent } from './../../internal/search/iCABSSeServicePlanSearch.component';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { ContractSearchComponent } from './../../internal/search/iCABSAContractSearch';
import { AppModuleRoutes, InternalGridSearchSalesModuleRoutes } from './../../base/PageRoutes';


@Component({
    templateUrl: 'iCABSSeServiceActivityUpdateGrid.html'
})

export class ServiceActivityUpdateGridComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('planSearchEllipsis') planSearchEllipsis: EllipsisComponent;
    @ViewChild('formBranchServiceAreaCode') formBranchServiceAreaCode;
    private pageCurrent: number = 1;
    private xhrParams: any = {
        operation: 'Service/iCABSSeServiceActivityUpdateGrid',
        module: 'pda',
        method: 'service-delivery/maintenance'
    };
    private pageMessageModal: ICabsModalVO;
    private search: any;
    private lookUp: any;
    public pageId: string = '';
    public totalRecords: number;
    public itemsPerPage: number = 10;
    public isCustomDTP: boolean = false;
    public controls = [
        { name: 'BranchServiceAreaCode', type: MntConst.eTypeCode , commonValidator: true},
        { name: 'BranchServiceAreaDesc', type: MntConst.eTypeText , commonValidator: true},
        { name: 'EmployeeCode', type: MntConst.eTypeCode , commonValidator: true},
        { name: 'EmployeeSurname', type: MntConst.eTypeText , commonValidator: true},
        { name: 'ContractNumber', type: MntConst.eTypeCode , commonValidator: true},
        { name: 'ContractName', type: MntConst.eTypeText , commonValidator: true},
        { name: 'ServicePlanNumber', type: MntConst.eTypeInteger , commonValidator: true},
        { name: 'ServiceWeekNumber', type: MntConst.eTypeInteger , commonValidator: true},
        { name: 'LogInTime', type: MntConst.eTypeTime , commonValidator: true},
        { name: 'LogInMileage', type: MntConst.eTypeInteger , commonValidator: true},
        { name: 'LogOutTime', type: MntConst.eTypeTime , commonValidator: true},
        { name: 'LogOutMileage', type: MntConst.eTypeInteger , commonValidator: true},
        { name: 'BusinessCode', type: MntConst.eTypeCode, required: true , commonValidator: true},
        { name: 'BranchNumber', type: MntConst.eTypeInteger , commonValidator: true},
        { name: 'ServicePlanStartDate', type: MntConst.eTypeDate , commonValidator: true},
        { name: 'ServicePlanEndDate', type: MntConst.eTypeDate , commonValidator: true},
        { name: 'ServiceDate', type: MntConst.eTypeDate , commonValidator: true},
        { name: 'Visited', type: MntConst.eTypeCheckBox, value: false , commonValidator: true},
        { name: 'DateFrom', type: MntConst.eTypeDate, required: true , commonValidator: true},
        { name: 'DateTo', type: MntConst.eTypeDate, required: true , commonValidator: true},
        { name: 'GridPageSize', type: MntConst.eTypeInteger, required: true , commonValidator: true},
        { name: 'PremiseNumber', type: MntConst.eTypeInteger , commonValidator: true},
        { name: 'PremiseName', type: MntConst.eTypeText , commonValidator: true},
        { name: 'ShowType' },
        { name: 'ConfirmFromPlan', type: MntConst.eTypeCheckBox, value: true , commonValidator: true},
        { name: 'EnterLogInLogOut', type: MntConst.eTypeCheckBox , commonValidator: true},
        { name: 'ViewType' }
    ];

    public ellipsis = {
        serviceAreaEllipsis: {
            showCloseButton: true,
            showHeader: true,
            childparams: {
                parentMode: 'LookUp-UpdateParent'
            },
            component: BranchServiceAreaSearchComponent
        },
        servicePlanEllipsis: {
            showCloseButton: true,
            showHeader: true,
            childparams: {
                parentMode: 'LookUp',
                branchServiceAreaCode: ''

            },
            component: ServicePlanSearchComponent
        },
        employeeCodeEllipsis: {
            showCloseButton: true,
            showHeader: true,
            childparams: {
                parentMode: 'LookUp-Service-All'

            },
            component: EmployeeSearchComponent
        },
        contractEllipsis: {
            showCloseButton: true,
            showHeader: true,
            childparams: {
                parentMode: 'LookUp-All',
                currentContractType: this.riExchange.getCurrentContractType()

            },
            component: ContractSearchComponent
        }
    };

    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEACTIVITYUPDATEGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.getSysCharDtetails();
    }

    ngAfterViewInit(): void {
        this.pageTitle = 'Service Activity Update';
        this.utils.setTitle('Service Activity Update');
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private getSysCharDtetails(): void {
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableServiceActivityGridColumns
        ];

        let sysCharIP: Object = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };

        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.pageParams.vViewColumns = record[0]['Required'];
            this.windowOnLoad();
        });
    }

    private setCurrentContractType(): void {
        this.pageParams.currentContractType = this.riExchange.getCurrentContractType();
        this.pageParams.currentContractTypeLabel = this.riExchange.getCurrentContractTypeLabel();
    }

    private windowOnLoad(): void {
        this.search = this.getURLSearchParamObject();
        this.setCurrentContractType();
        this.lookUp = '';
        this.riGrid.DefaultBorderColor = 'ADD8E6';
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = 10;
        this.buildGrid();
        this.disableControl('BusinessCode', true);
        this.disableControl('BranchNumber', true);
        this.disableControl('BranchServiceAreaDesc', true);
        this.disableControl('ServiceWeekNumber', true);
        this.disableControl('ServicePlanStartDate', true);
        this.disableControl('ServicePlanEndDate', true);
        this.disableControl('EmployeeSurname', true);
        this.disableControl('ContractName', true);
        this.setControlValue('BusinessCode', this.utils.getBusinessCode());
        this.setControlValue('BranchNumber', this.utils.getBranchCode());
        this.setControlValue('DateFrom', this.globalize.parseDateToFixedFormat(new Date(new Date().getFullYear(), new Date().getMonth(), 1)));
        this.setControlValue('DateTo', this.globalize.parseDateToFixedFormat(new Date()));
        this.onChangeConfirmFromPlan();
        this.onClickEnterLogInLogOut();
        this.setControlValue('ConfirmFromPlan', true);
        this.setControlValue('ShowType', 'AllEmployees');
        this.formBranchServiceAreaCode.nativeElement.focus();
        if (this.isReturning()) {
            this.populateUIFromFormData();
        }
    }

    private viewActivitiesFunction(): void {
        this.pageParams.viewPlan = true;
        this.pageParams.viewActivities = false;
        this.pageParams.visited = false;
        this.pageParams.showType = this.getControlValue('EmployeeCode') ? false : true;
        this.setControlValue('ViewType', 'CreateActivity');
    }



    private onClickEnterLogInLogOut(): void {
        this.pageParams.logInLogOut = this.getControlValue('EnterLogInLogOut') ? true : false;
    }

    private buildGrid(): void {
        this.riGrid.Clear();
        switch (this.getControlValue('ViewType')) {
            case 'ConfirmActivity':
                if (!this.getControlValue('BranchServiceAreaCode')) {
                    this.riGrid.AddColumn('BranchServiceAreaCode', 'Activity', 'BranchServiceAreaCode', MntConst.eTypeCode, 6);
                    this.riGrid.AddColumnAlign('BranchServiceAreaCode', MntConst.eAlignmentCenter);
                }
                if (!this.getControlValue('ServicePlanNumber')) {
                    this.riGrid.AddColumn('ServicePlanNumber', 'Activity', 'ServicePlanNumber', MntConst.eTypeInteger, 3);
                    this.riGrid.AddColumnAlign('ServicePlanNumber', MntConst.eAlignmentCenter);
                }
                this.riGrid.AddColumn('PlannedVisitDate', 'Activity', 'PlannedVisitDate', MntConst.eTypeDate, 10);
                this.riGrid.AddColumnAlign('PlannedVisitDate', MntConst.eAlignmentCenter);
                this.riGrid.AddColumnOrderable('PlannedVisitDate', true);
                this.riGrid.AddColumn('ContractNum', 'Activity', 'ContractNum', MntConst.eTypeCode, 8);
                this.riGrid.AddColumnAlign('ContractNum', MntConst.eAlignmentCenter);
                this.riGrid.AddColumn('PremiseNum', 'Activity', 'PremiseNum', MntConst.eTypeInteger, 5);
                this.riGrid.AddColumnAlign('PremiseNum', MntConst.eAlignmentCenter);
                this.riGrid.AddColumn('PremiseNam', 'Activity', 'PremiseNam', MntConst.eTypeText, 15);
                this.riGrid.AddColumn('Products', 'Activity', 'Products', MntConst.eTypeCode, 10);
                this.riGrid.AddColumn('PremiseVisitDate', 'Activity', 'PremiseVisitDate', MntConst.eTypeDate, 10);
                this.riGrid.AddColumnAlign('PremiseVisitDate', MntConst.eAlignmentCenter);
                this.riGrid.AddColumnOrderable('PremiseVisitDate', true);
                this.riGrid.AddColumn('PremiseStartTime', 'Activity', 'PremiseStartTime', MntConst.eTypeTime, 6);
                this.riGrid.AddColumnAlign('PremiseStartTime', MntConst.eAlignmentCenter);
                this.riGrid.AddColumn('PremiseEndTime', 'Activity', 'PremiseEndTime', MntConst.eTypeTime, 6);
                this.riGrid.AddColumnAlign('PremiseEndTime', MntConst.eAlignmentCenter);
                this.riGrid.AddColumn('ConfirmVisit', 'Activity', 'ConfirmVisit', MntConst.eTypeImage, 1);
                this.riGrid.AddColumnAlign('ConfirmVisit', MntConst.eAlignmentCenter);
                if (this.pageParams.vViewColumns) {
                    this.riGrid.AddColumn('ServiceDocketNumber', 'PlanVisit', 'ServiceDocketNumber', MntConst.eTypeText, 15);
                    this.riGrid.AddColumnAlign('ServiceDocketNumber', MntConst.eAlignmentCenter);

                    this.riGrid.AddColumn('PrintSingleDocket', 'PlanVisit', 'PrintSingleDocket', MntConst.eTypeImage, 1, true);
                    this.riGrid.AddColumnAlign('ServiceDocketNumber', MntConst.eAlignmentCenter);
                }
                break;
            case 'CreateActivity':
                this.riGrid.AddColumn('EmployeeCode', 'Activity', 'EmployeeCode', MntConst.eTypeCode, 6);
                this.riGrid.AddColumnAlign('EmployeeCode', MntConst.eAlignmentCenter);
                this.riGrid.AddColumn('ServiceDateStart', 'Activity', 'ServiceDateStart', MntConst.eTypeDate, 10);
                this.riGrid.AddColumnAlign('ServiceDateStart', MntConst.eAlignmentCenter);
                this.riGrid.AddColumn('KeyedStartTime', 'Activity', 'KeyedStartTime', MntConst.eTypeTime, 6);
                this.riGrid.AddColumnAlign('KeyedStartTime', MntConst.eAlignmentCenter);
                this.riGrid.AddColumn('KeyedEndTime', 'Activity', 'KeyedEndTime', MntConst.eTypeTime, 6);
                this.riGrid.AddColumnAlign('KeyedEndTime', MntConst.eAlignmentCenter);
                this.riGrid.AddColumn('ActivityDesc', 'Activity', 'ActivityDesc', MntConst.eTypeText, 15);
                this.riGrid.AddColumn('ConNumber', 'Activity', 'ConNumber', MntConst.eTypeCode, 8);
                this.riGrid.AddColumnAlign('ConNumber', MntConst.eAlignmentCenter);
                this.riGrid.AddColumn('PremNumber', 'Activity', 'PremNumber', MntConst.eTypeInteger, 5);
                this.riGrid.AddColumnAlign('PremNumber', MntConst.eAlignmentCenter);
                this.riGrid.AddColumn('PremName', 'Activity', 'PremName', MntConst.eTypeText, 15);
                this.riGrid.AddColumn('VisitTypeCode', 'Activity', 'VisitTypeCode', MntConst.eTypeCode, 2);
                this.riGrid.AddColumnAlign('VisitTypeCode', MntConst.eAlignmentCenter);
                this.riGrid.AddColumn('ProdCode', 'Activity', 'ProdCode', MntConst.eTypeCode, 10);
                this.riGrid.AddColumnAlign('ProdCode', MntConst.eAlignmentCenter);
                this.riGrid.AddColumn('ServicedQuantity', 'Activity', 'ServicedQuantity', MntConst.eTypeInteger, 3);
                this.riGrid.AddColumnAlign('ServicedQuantity', MntConst.eAlignmentCenter);
                this.riGrid.AddColumn('Duration', 'Activity', 'Duration', MntConst.eTypeTime, 6);
                this.riGrid.AddColumnAlign('Duration', MntConst.eAlignmentCenter);
                this.riGrid.AddColumn('Mileage', 'Activity', 'Mileage', MntConst.eTypeInteger, 5);
                break;
            default:
                break;
        }
        this.riGrid.Complete();
        this.riGridBeforeExecute();
    }

    private validateLogOutParameters(): boolean {
        let blnReturn: boolean = true;
        if (!this.getControlValue('EmployeeCode')) {
            blnReturn = false;
            this.setErrorStatusOfFormElement('EmployeeCode', true);
        }
        if (!this.getControlValue('ServiceDate')) {
            blnReturn = false;
            this.setErrorStatusOfFormElement('ServiceDate', true);
            this.isCustomDTP = true;
        }
        if (!this.getControlValue('LogOutTime') || this.riExchange.riInputElement.isError(this.uiForm, 'LogOutTime')) {
            blnReturn = false;
            this.setErrorStatusOfFormElement('LogOutTime', true);
        }
        if (!this.getControlValue('LogOutMileage') || this.riExchange.riInputElement.isError(this.uiForm, 'LogOutMileage')) {
            blnReturn = false;
            this.setErrorStatusOfFormElement('LogOutMileage', true);
        }
        return blnReturn;
    }

    private validateLogInParameters(): boolean {
        let blnReturn: boolean = true;
        if (!this.getControlValue('EmployeeCode')) {
            blnReturn = false;
            this.setErrorStatusOfFormElement('EmployeeCode', true);
        }
        if (!this.getControlValue('ServiceDate')) {
            blnReturn = false;
            this.setErrorStatusOfFormElement('ServiceDate', true);
            this.isCustomDTP = true;
        }
        if (!this.getControlValue('LogInTime') || this.riExchange.riInputElement.isError(this.uiForm, 'LogInTime')) {
            blnReturn = false;
            this.setErrorStatusOfFormElement('LogInTime', true);
        }
        if (!this.getControlValue('LogInMileage') || this.riExchange.riInputElement.isError(this.uiForm, 'LogInMileage')) {
            blnReturn = false;
            this.setErrorStatusOfFormElement('LogInMileage', true);
        }
        return blnReturn;
    }

    private onFocusRow(rsrcElement: any): void {
        let objTRS: any = rsrcElement.parentElement.parentElement.parentElement;
        this.setAttribute('ServicePlanNumber', this.riGrid.Details.GetValue('ServicePlanNumber') || this.getControlValue('ServicePlanNumber'));
        this.setAttribute('PlannedVisitDate', this.riGrid.Details.GetValue('PlannedVisitDate'));
        this.setAttribute('ContractNumber', this.riGrid.Details.GetValue('ContractNum').split('/')[1] || this.getControlValue('ContractNumber'));
        this.setAttribute('PremiseNumber', this.riGrid.Details.GetValue('PremiseNum') || this.getControlValue('PremiseNumber'));
        this.setAttribute('ReportNumber', this.riGrid.Details.GetValue('ServiceDocketNumber'));
    }

    private setErrorStatusOfFormElement(frmCtrlName: string, flag: boolean): void {
        this.riExchange.riInputElement.SetMarkedAsTouched(this.uiForm, frmCtrlName, flag);
        if (flag) {
            this.riExchange.riInputElement.markAsError(this.uiForm, frmCtrlName);
        }
    }

    private validateScreenParameters(): boolean {
        let blnReturn: boolean = true;
        if (!this.getControlValue('DateFrom')) {
            blnReturn = false;
            this.setErrorStatusOfFormElement('DateFrom', true);
        }
        if (!this.getControlValue('DateTo')) {
            blnReturn = false;
            this.setErrorStatusOfFormElement('DateTo', true);
        }
        if (this.getControlValue('ViewType') === 'ConfirmActivity') {
            if (this.getControlValue('ServicePlanNumber') && !this.getControlValue('BranchServiceAreaCode')) {
                blnReturn = false;
                this.setErrorStatusOfFormElement('BranchServiceAreaCode', true);
            }
            else {
                this.setErrorStatusOfFormElement('BranchServiceAreaCode', false);
                this.setErrorStatusOfFormElement('EmployeeCode', false);
                this.setErrorStatusOfFormElement('ServiceDate', false);
                this.isCustomDTP = false;
                this.setErrorStatusOfFormElement('LogInTime', false);
                this.setErrorStatusOfFormElement('LogInMileage', false);
                this.setErrorStatusOfFormElement('LogOutTime', false);
                this.setErrorStatusOfFormElement('LogOutMileage', false);
            }
        }
        return blnReturn;
    }

    private selectedRowFocus(event: any, rsrcElement: any): void {
        let addElement: number;
        addElement = !this.getControlValue('BranchServiceAreaCode') ? 1 : 0;
        let addElement2: number;
        addElement2 = !this.getControlValue('ServicePlanNumber') ? 1 : 0;
        let oTR: any = rsrcElement.parentElement.parentElement.parentElement;
        switch (rsrcElement.parentElement.parentElement.getAttribute('name')) {
            case 'ActivityDesc':
            case 'ConNumber':
            case 'PremNumber':
            case 'PremName':
            case 'ProdCode':
                this.setAttribute('PDAICABSActivityRowID', oTR.children[4].getAttribute('additionalproperty'));
                switch (rsrcElement.parentElement.parentElement.getAttribute('name')) {
                    case 'ConNumber':
                    case 'PremNumber':
                    case 'PremName':
                    case 'ProdCode':
                        switch (oTR.children[2].getAttribute('additionalproperty')) {
                            case 'C':
                                this.pageParams.currentContractTypeURLParameter = '';
                                break;
                            case 'J':
                                this.pageParams.currentContractTypeURLParameter = '<job>';
                                break;
                            case 'P':
                                this.pageParams.currentContractTypeURLParameter = '<product>';
                                break;
                            default:
                                break;
                        }
                        break;
                    default:
                        break;
                }
                switch (rsrcElement.parentElement.parentElement.getAttribute('name')) {
                    case 'ActivityDesc':
                        alert('Service/iCABSSePDAiCABSActivityMaintenance.htm -- Page not yet ready');
                        // TODO
                        // this.navigate('ServiceActivity', 'Service/iCABSSePDAiCABSActivityMaintenance.htm', {
                        //     parentMode: 'ServiceActivity',
                        //     PDAICABSActivityROWID: oTR.children[4].getAttribute('additionalproperty')
                        // });
                        break;

                    case 'ConNumber':
                        if (this.riGrid.Details.GetValue('ConNumber') && oTR.children[5].getAttribute('additionalproperty') !== 'No') {
                            this.setAttribute('ContractRowID', oTR.children[5].getAttribute('additionalproperty'));
                            let objNavigation: any = {
                                ContractNumber: this.riGrid.Details.GetValue('ConNumber'),
                                CurrentContractTypeURLParameter: this.pageParams.currentContractTypeURLParameter,
                                parentMode: 'ServicePlanning',
                                ContractRowID: oTR.children[5].getAttribute('additionalproperty')
                            };
                            switch (this.pageParams.currentContractTypeURLParameter) {
                                case '':
                                    this.navigate('ServicePlanning', this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, objNavigation);
                                    break;
                                case '<job>':
                                    this.navigate('ServicePlanning', this.ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE, objNavigation);
                                    break;
                                case '<product>':
                                    this.navigate('ServicePlanning', this.ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE, objNavigation);
                                    break;
                                default:
                                    break;
                            }
                        }
                        break;
                    case 'PremNumber':
                        if (this.riGrid.Details.GetValue('PremNumber') && oTR.children[6].getAttribute('additionalproperty') !== 'No') {
                            this.setAttribute('PremiseRowID', oTR.children[6].getAttribute('additionalproperty'));
                            this.navigate('ServicePlanning', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, {
                                CurrentContractTypeURLParameter: this.pageParams.currentContractTypeURLParameter,
                                PremiseRowID: oTR.children[6].getAttribute('additionalproperty'),
                                ContractTypeCode: oTR.children[2].getAttribute('additionalproperty'),
                                parentMode: 'ServicePlanning',
                                PremiseNumber: this.riGrid.Details.GetValue('PremNumber')
                            });
                        }
                        break;
                    case 'PremName':
                        if (this.riGrid.Details.GetValue('PremName') && oTR.children[3].getAttribute('additionalproperty') !== '1') {
                            alert('ContactManagement/iCABSCMCustomerContactMaintenance.htm -- Page not yet ready');
                            // TODO
                            // this.navigate('New', 'ContactManagement/iCABSCMCustomerContactMaintenance.htm', {
                            //     CurrentContractTypeURLParameter: this.pageParams.currentContractTypeURLParameter,
                            //     parentMode: 'New',
                            //     ContractNumber: this.riGrid.Details.GetValue('ConNumber'),
                            //     ContractName: oTR.children[3].getAttribute('additionalproperty'),
                            //     PremiseNumber: this.riGrid.Details.GetValue('PremNumber'),
                            //     PremiseName: this.riGrid.Details.GetValue('PremName'),

                            // });
                            this.setControlValue('ContractNumber', this.riGrid.Details.GetValue('ConNumber'));
                            this.setControlValue('ContractName', oTR.children[3].getAttribute('additionalproperty'));
                            this.setControlValue('PremiseNumber', this.riGrid.Details.GetValue('PremNumber'));
                            this.setControlValue('PremiseName', this.riGrid.Details.GetValue('PremName'));
                        }
                        break;
                    case 'ProdCode':
                        if (this.riGrid.Details.GetValue('ProdCode') && oTR.children[9].getAttribute('additionalproperty') !== 'No') {
                            this.setAttribute('ServiceCoverRowID', oTR.children[9].getAttribute('additionalproperty'));

                            switch (this.pageParams.currentContractTypeURLParameter) {
                                case '':
                                    this.navigate('ServicePlanning', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, {
                                        'CurrentContractTypeURLParameter': this.pageParams.currentContractTypeURLParameter,
                                        'parentMode': 'ServicePlanning',
                                        'currentContractType': oTR.children[2].getAttribute('additionalproperty'),
                                        'ServiceCoverRowID': oTR.children[9].getAttribute('additionalproperty')
                                    });
                                    break;
                                case '<job>':
                                    this.navigate('ServicePlanning', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, {
                                        'CurrentContractTypeURLParameter': this.pageParams.currentContractTypeURLParameter,
                                        'parentMode': 'ServicePlanning',
                                        'currentContractType': oTR.children[2].getAttribute('additionalproperty'),
                                        'ServiceCoverRowID': oTR.children[9].getAttribute('additionalproperty')
                                    });
                                    break;
                                case '<product>':
                                    this.navigate('ServicePlanning', InternalGridSearchSalesModuleRoutes.ICABSAPRODUCTSALESSCDETAILMAINTENANCE, {
                                        'CurrentContractTypeURLParameter': this.pageParams.currentContractTypeURLParameter,
                                        'parentMode': 'ServicePlanning',
                                        'currentContractType': oTR.children[2].getAttribute('additionalproperty'),
                                        'ServiceCoverRowID': oTR.children[9].getAttribute('additionalproperty')
                                    });
                                    break;
                                default:
                                    break;
                            }

                        }
                        break;
                    default:
                        break;
                }
                break;

            case 'PrintSingleDocket':
                if (event.target.tagName === 'IMG') {
                    this.onFocusRow(rsrcElement);
                    if (this.getAttribute('ReportNumber')) {
                        let postSearchParams = this.getURLSearchParamObject();
                        postSearchParams.set(this.serviceConstants.Action, '6');
                        let postParams: any = {};
                        postParams.Function = 'SingleServiceDocket';
                        postParams.ReportNumber = this.getAttribute('ReportNumber');
                        postParams.PlannedVisitDate = this.globalize.parseDateToFixedFormat(this.getAttribute('PlannedVisitDate'));
                        postParams.PremiseNumber = '0';
                        this.ajaxSource.next(this.ajaxconstant.START);
                        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, postSearchParams, postParams)
                            .subscribe(
                            (data) => {
                                if ((data['hasError'])) {
                                    this.modalAdvService.emitError(new ICabsModalVO(data['errorMessage'], data['fullError']));

                                } else {
                                    window.open(data.fullError, '_blank');
                                }
                                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                            },
                            (error) => {
                                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                            });
                    }
                }
                break;

            case 'ContractNum':
            case 'PremiseNum':
                this.setAttribute('ContractRowID', oTR.children[1 + addElement + addElement2].getAttribute('additionalproperty'));
                this.setAttribute('PremiseRowID', oTR.children[2 + addElement + addElement2].getAttribute('additionalproperty'));

                switch (oTR.children[addElement + addElement2].getAttribute('additionalproperty')) {
                    case 'C':
                        this.pageParams.currentContractTypeURLParameter = '';
                        break;
                    case 'J':
                        this.pageParams.currentContractTypeURLParameter = '<job>';
                        break;
                    case 'P':
                        this.pageParams.currentContractTypeURLParameter = '<product>';
                        break;
                    default:
                        break;
                }
                switch (rsrcElement.parentElement.parentElement.getAttribute('name')) {
                    case 'ContractNum':
                        let objNavigation: any = {
                            ContractNumber: this.riGrid.Details.GetValue('ConNumber'),
                            CurrentContractTypeURLParameter: this.pageParams.currentContractTypeURLParameter,
                            parentMode: 'ServicePlanning',
                            ContractRowID: oTR.children[1 + addElement + addElement2].getAttribute('additionalproperty')
                        };
                        switch (this.pageParams.currentContractTypeURLParameter) {
                            case '':
                                this.navigate('ServicePlanning', this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, objNavigation);
                                break;
                            case '<job>':
                                this.navigate('ServicePlanning', this.ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE, objNavigation);
                                break;
                            case '<product>':
                                this.navigate('ServicePlanning', this.ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE, objNavigation);
                                break;
                            default:
                                break;
                        }
                        break;
                    case 'PremiseNum':
                        this.navigate('ServicePlanning', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, {
                            CurrentContractTypeURLParameter: this.pageParams.currentContractTypeURLParameter,
                            PremiseRowID: oTR.children[2 + addElement + addElement2].getAttribute('additionalproperty'),
                            ContractTypeCode: this.riGrid.Details.GetValue('ContractNum').split('/')[0],
                            parentMode: 'ServicePlanning',
                            PremiseNumber: this.riGrid.Details.GetValue('PremNumber')
                        });
                        break;
                    default:
                        break;
                }
                break;

            case 'ConfirmVisit':
                let objSrc: any = rsrcElement;
                let objTR: any;
                if (this.UCase(event.target.tagName) === 'IMG') {
                    objTR = objSrc.parentElement.parentElement.parentElement.parentElement;
                }
                else {
                    objTR = objSrc.parentElement.parentElement.parentElement;
                }
                this.setAttribute('BranchServiceAreaCode', this.riGrid.Details.GetValue('BranchServiceAreaCode') || this.getControlValue('BranchServiceAreaCode'));
                this.setAttribute('ServicePlanNumber', this.riGrid.Details.GetValue('ServicePlanNumber') || this.getControlValue('ServicePlanNumber'));
                this.setAttribute('PlannedVisitDate', this.riGrid.Details.GetValue('PlannedVisitDate'));
                this.setAttribute('ContractNumber', this.riGrid.Details.GetValue('ContractNum').split('/')[1] || this.getControlValue('ContractNumber'));
                this.setAttribute('ContractName', this.riGrid.Details.GetValue('PremiseNam') || this.getControlValue('Contractname'));
                this.setAttribute('PremiseNumber', this.riGrid.Details.GetValue('PremiseNum') || this.getControlValue('PremiseNumber'));
                this.setAttribute('PremiseName', this.riGrid.Details.GetValue('PremiseNam') || this.getControlValue('PremiseName'));
                this.setAttribute('PremiseVisitRowID', objTR.children[0].children[8 + addElement + addElement2].children[0].getAttribute('additionalproperty'));
                switch (objTR.children[0].children[addElement + addElement2].getAttribute('additionalproperty')) {
                    case 'C': this.pageParams.currentContractTypeURLParameter = '';
                        break;
                    case 'J': this.pageParams.currentContractTypeURLParameter = '<job>';
                        break;
                    case 'P': this.pageParams.currentContractTypeURLParameter = '<product>';
                        break;
                    default:
                        break;
                }
                alert('Service/iCABSSePremiseActivityGrid.htm - page not ready yet');
                // TODO
                //  this.navigate('ServicePlanning', 'Service/iCABSSePremiseActivityGrid.htm', {
                //                         'CurrentContractTypeURLParameter': this.pageParams.currentContractTypeURLParameter,
                //                         'parentMode': 'ServiceActivity'
                //                     });
                break;
            default:
                break;

        }
    }

    private riExchangeUpdateHTMLDocument(): void {
        if (this.lookUp === 'BranchServiceAreaCode') {
            this.onBlurBranchServiceAreaCode();
            this.lookUp = '';
        }
    }

    private riGridBeforeExecute(): void {
        this.riGrid.RefreshRequired();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set('BranchNumber', this.getControlValue('BranchNumber'));
        this.search.set('BranchServiceAreaCode', this.getControlValue('BranchServiceAreaCode'));
        this.search.set('ServicePlanNumber', this.getControlValue('ServicePlanNumber'));
        this.search.set('EmployeeCode', this.getControlValue('EmployeeCode'));
        let formatteddateFrom: any = this.globalize.parseDateToFixedFormat(this.getControlValue('DateFrom'));
        this.search.set('DateFrom', formatteddateFrom);
        let formatteddateTo: any = this.globalize.parseDateToFixedFormat(this.getControlValue('DateTo'));
        this.search.set('DateTo', formatteddateTo);
        this.search.set('ViewType', this.getControlValue('ViewType'));
        this.search.set('ServiceDate', this.getControlValue('ServiceDate'));
        this.search.set('Visited', this.getControlValue('Visited'));
        this.search.set('Contract', this.getControlValue('ContractNumber'));
        this.search.set('ShowType', this.getControlValue('ShowType'));
        this.search.set(this.serviceConstants.PageSize, (this.itemsPerPage).toString());
        this.search.set(this.serviceConstants.PageCurrent, this.pageCurrent.toString());
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, '26609204');
        let sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        this.search.set('riSortOrder', sortOrder);
        this.search.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        this.search.set('riCacheRefresh', 'True');
        this.xhrParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module,
            this.xhrParams.operation, this.xhrParams.search)
            .subscribe(
            (data) => {
                if (data) {
                    try {
                        this.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                        this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                        if (data && data['hasError']) {
                            this.pageMessageModal = new ICabsModalVO(data['errorMessage'], data['fullError']);
                            this.pageMessageModal.title = MessageConstant.Message.MessageTitle;
                            this.modalAdvService.emitError(this.pageMessageModal);
                        } else {
                            this.riGrid.Execute(data);
                        }

                    } catch (e) {
                        this.logger.log('Problem in grid load', e);
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            error => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.totalRecords = 1;
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public riGridSort(event: any): void {
        this.riGrid.RefreshRequired();
        this.riGridBeforeExecute();
    }

    public clearLogInDetails(): void {
        this.setControlValue('LogInTime', '');
        this.setControlValue('LogInMileage', '');
        this.setControlValue('LogOutTime', '');
        this.setControlValue('LogOutMileage', '');
        this.disableControl('LogInTime', false);
        this.disableControl('LogInMileage', false);
        this.disableControl('LogOutTime', false);
        this.disableControl('LogOutMileage', false);
        this.disableControl('ConfirmLogIn', false);
        this.disableControl('ConfirmLogOut', false);

    }

    public onClickViewActivity(): void {
        this.viewActivitiesFunction();
    }

    public getCurrentPage(currentPage: any): void {
        this.pageCurrent = currentPage.value;
        this.riGridBeforeExecute();
    }

    public refresh(): void {
        this.riGrid.RefreshRequired();
        this.buildGrid();
    }

    public fromDateSelectedValue(value: any): void {
        if (value) {
            this.setControlValue('DateFrom', value.value);
        }
    }

    public toDateSelectedValue(value: any): void {
        if (value) {
            this.setControlValue('DateTo', value.value);
        }
    }

    public serviceDateDateSelectedValue(value: any): void {
        if (value) {
            this.setControlValue('ServiceDate', value.value);
            this.clearLogInDetails();
        }
    }

    public onChangeConfirmFromPlan(): void {
        if (this.getControlValue('ConfirmFromPlan')) {
            this.pageParams.viewTypes = this.pageParams.servicePlanNumber = this.pageParams.serviceWeekNumber = true;
        }
        else {
            this.pageParams.viewTypes = this.pageParams.servicePlanNumber = this.pageParams.serviceWeekNumber = false;
        }
        this.viewActivitiesFunction();
    }

    public onClickConfirmLogOut(): void {
        if (this.validateLogOutParameters()) {
            let postSearchParams = this.getURLSearchParamObject();
            postSearchParams.set(this.serviceConstants.Action, '6');
            let postParams: any = {};
            postParams.Function = 'ConfirmLogOut';
            postParams.BranchNumber = this.getControlValue('BranchNumber');
            postParams.EmployeeCode = this.getControlValue('EmployeeCode');
            postParams.ServiceDate = this.getControlValue('ServiceDate');
            postParams.LogOutTime = this.getControlValue('LogOutTime');
            postParams.LogOutMileage = this.getControlValue('LogOutMileage');
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, postSearchParams, postParams)
                .subscribe(
                (data) => {
                    if ((data['hasError'])) {
                        this.modalAdvService.emitError(new ICabsModalVO(data['errorMessage'], data['fullError']));
                    } else {
                        this.disableControl('LogOutTime', true);
                        this.disableControl('LogOutMileage', true);
                        this.disableControl('ConfirmLogOut', true);
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
    }

    public onClickConfirmLogIn(): void {
        if (this.validateLogInParameters()) {
            let postSearchParams = this.getURLSearchParamObject();
            postSearchParams.set(this.serviceConstants.Action, '6');
            let postParams: any = {};
            postParams.Function = 'ConfirmLogIn';
            postParams.BranchNumber = this.getControlValue('BranchNumber');
            postParams.EmployeeCode = this.getControlValue('EmployeeCode');
            postParams.ServiceDate = this.getControlValue('ServiceDate');
            postParams.LogInTime = this.getControlValue('LogInTime');
            postParams.LogInMileage = this.getControlValue('LogInMileage');
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, postSearchParams, postParams)
                .subscribe(
                (data) => {
                    if ((data['hasError'])) {
                        this.modalAdvService.emitError(new ICabsModalVO(data['errorMessage'], data['fullError']));
                    } else {
                        this.disableControl('LogInTime', true);
                        this.disableControl('LogInMileage', true);
                        this.disableControl('ConfirmLogIn', true);
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
    }

    public onBlurBranchServiceAreaCode(): void {
        if (this.getControlValue('BranchServiceAreaCode')) {
            let postSearchParams = this.getURLSearchParamObject();
            postSearchParams.set(this.serviceConstants.Action, '6');
            let postParams: any = {};
            postParams.PostDesc = 'BranchServiceArea';
            postParams.BranchNumber = this.getControlValue('BranchNumber');
            postParams.BranchServiceAreaCode = this.getControlValue('BranchServiceAreaCode');
            postParams.BranchServiceAreaDesc = this.getControlValue('BranchServiceAreaDesc');
            postParams.EmployeeCode = this.getControlValue('EmployeeCode');
            postParams.EmployeeSurname = this.getControlValue('EmployeeSurname');
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, postSearchParams, postParams)
                .subscribe(
                (data) => {
                    if ((data['hasError'])) {
                        this.modalAdvService.emitError(new ICabsModalVO(data['errorMessage'], data['fullError']));

                    } else {
                        if (data.BranchServiceAreaDesc || data.EmployeeCode || data.EmployeeSurname) {
                            this.setControlValue('BranchServiceAreaDesc', data.BranchServiceAreaDesc);
                            this.setControlValue('EmployeeCode', data.EmployeeCode);
                            this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                            this.pageParams.showType = false;
                        }
                        else {
                            this.setControlValue('BranchServiceAreaCode', '');
                            this.setControlValue('BranchServiceAreaDesc', '');
                            if (!this.getControlValue('EmployeeCode') && this.getControlValue('ViewType') === 'CreateActivity') {
                                this.pageParams.showType = true;
                            }
                        }
                        this.ellipsis.servicePlanEllipsis.childparams['branchServiceAreaCode'] = this.getControlValue('BranchServiceAreaCode');
                        this.planSearchEllipsis.updateComponent();
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
            this.clearLogInDetails();

        }
        else {
            this.setControlValue('BranchServiceAreaCode', '');
            this.setControlValue('BranchServiceAreaDesc', '');
        }
    }

    public onBlurServicePlanNumber(): void {
        if (this.getControlValue('ServicePlanNumber')) {
            let postSearchParams = this.getURLSearchParamObject();
            postSearchParams.set(this.serviceConstants.Action, '6');
            let postParams: any = {};
            postParams.PostDesc = 'ServicePlan';
            postParams.BranchNumber = this.getControlValue('BranchNumber');
            postParams.BranchServiceAreaCode = this.getControlValue('BranchServiceAreaCode');
            postParams.ServicePlanNumber = this.getControlValue('ServicePlanNumber');
            postParams.EmployeeCode = this.getControlValue('EmployeeCode');
            postParams.EmployeeSurname = this.getControlValue('EmployeeSurname');
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, postSearchParams, postParams)
                .subscribe(
                (data) => {
                    if ((data['hasError'])) {
                        this.modalAdvService.emitError(new ICabsModalVO(data['errorMessage'], data['fullError']));

                    } else {
                        if (data.ServiceWeekNumber || data.ServicePlanStartDate || data.ServicePlanEndDate) {
                            this.setControlValue('ServiceWeekNumber', data.ServiceWeekNumber);
                            this.setControlValue('ServicePlanStartDate', data.ServicePlanStartDate);
                            this.setControlValue('ServicePlanEndDate', data.ServicePlanEndDate);
                            this.setControlValue('DateFrom', data.ServicePlanStartDate);
                            this.setControlValue('DateTo', data.ServicePlanEndDate);
                            this.disableControl('DateFrom', true);
                            this.disableControl('DateTo', true);
                        }
                        else {
                            this.setControlValue('ServiceWeekNumber', '');
                            this.setControlValue('ServicePlanStartDate', '');
                            this.setControlValue('ServicePlanEndDate', '');
                            this.disableControl('DateFrom', false);
                            this.disableControl('DateTo', false);
                        }
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });

        }
    }

    public onBlurEmployeeCode(): void {
        if (this.getControlValue('EmployeeCode')) {
            let postSearchParams = this.getURLSearchParamObject();
            postSearchParams.set(this.serviceConstants.Action, '6');
            let postParams: any = {};
            postParams.PostDesc = 'Employee';
            postParams.EmployeeCode = this.getControlValue('EmployeeCode');
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, postSearchParams, postParams)
                .subscribe(
                (data) => {
                    if ((data['hasError'])) {
                        this.modalAdvService.emitError(new ICabsModalVO(data['errorMessage'], data['fullError']));

                    } else {
                        if (data.EmployeeSurname) {
                            this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                            if (this.getControlValue('ViewType') === 'CreateActivity') {
                                this.pageParams.showType = false;
                            }
                        }
                        else {
                            this.setControlValue('EmployeeCode', '');
                            this.setControlValue('EmployeeSurname', '');
                            if (!this.getControlValue('BranchServiceAreaCode') && this.getControlValue('ViewType') === 'CreateActivity') {
                                this.pageParams.showType = true;
                            }
                        }
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
            this.clearLogInDetails();

        }
        else {
            this.setControlValue('EmployeeCode', '');
            this.setControlValue('EmployeeSurname', '');
        }
    }

    public onBlurContract(): void {
        if (this.getControlValue('ContractNumber')) {
            let postSearchParams = this.getURLSearchParamObject();
            postSearchParams.set(this.serviceConstants.Action, '6');
            let postParams: any = {};
            postParams.PostDesc = 'ContractLookup';
            postParams.ContractNumber = this.getControlValue('ContractNumber');
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, postSearchParams, postParams)
                .subscribe(
                (data) => {
                    if ((data['hasError'])) {
                        this.modalAdvService.emitError(new ICabsModalVO(data['errorMessage'], data['fullError']));
                    } else {
                        if (data.ContractDesc) {
                            this.setControlValue('ContractName', data.ContractDesc);
                        }
                        else {
                            this.setControlValue('ContractNumber', '');
                            this.setControlValue('ContractName', '');
                        }
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
        else {
            this.setControlValue('ContractNumber', '');
            this.setControlValue('ContractName', '');
        }
        this.clearLogInDetails();
    }

    public onDataReceivedServiceSearch(data: any): void {
        if (data) {
            this.setControlValue('BranchServiceAreaCode', data.BranchServiceAreaCode);
            this.setControlValue('BranchServiceAreaDesc', data.BranchServiceAreaDesc);
            this.lookUp = 'BranchServiceAreaCode';
            this.onBlurBranchServiceAreaCode();
        }
        this.ellipsis.servicePlanEllipsis.childparams['branchServiceAreaCode'] = this.getControlValue('BranchServiceAreaCode');
        this.planSearchEllipsis.updateComponent();
    }

    public onDataReceivedServicePlan(data: any): void {
        if (data) {
            this.setControlValue('ServicePlanNumber', data.ServicePlanNumber);
        }
    }

    public onDataReceivedEmployeeCode(data: any): void {
        if (data) {
            this.setControlValue('EmployeeCode', data.EmployeeCode);
            this.setControlValue('EmployeeSurname', data.EmployeeSurname);
        }
    }

    public onDataReceivedContract(data: any): void {
        if (data) {
            this.setControlValue('ContractNumber', data.ContractNumber);
            this.setControlValue('ContractName', data.ContractName);
        }
    }

    public riGridBodyOnDBLClick(ev: any): void {
        this.selectedRowFocus(ev, ev.srcElement);
    }

    public onClickViewPlan(): void {
        this.pageParams.viewPlan = false;
        this.pageParams.viewActivities = true;
        this.pageParams.visited = true;
        this.pageParams.showType = false;
        this.setControlValue('ViewType', 'ConfirmActivity');
    }

    public onClickAddActivity(): void {
        alert('Screen not ready yet -- Service/iCABSSePDAiCABSActivityMaintenance.htm');
        // TODO
        // this.navigate('ServiceActivityAdd', 'Service/iCABSSePDAiCABSActivityMaintenance.htm', {
        //     'parentMode': 'ServiceActivityAdd'
        // });
    }

    public onChangeGridPageSize(): void {
        if (this.getControlValue('GridPageSize')) {
            this.riGrid.PageSize = this.getControlValue('GridPageSize');
            this.itemsPerPage = this.getControlValue('GridPageSize').toString();
        }
    }
}



