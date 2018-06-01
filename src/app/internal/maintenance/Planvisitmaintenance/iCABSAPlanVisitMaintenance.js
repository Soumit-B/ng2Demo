var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { ProductSearchGridComponent } from './../../search/iCABSBProductSearch';
import { ScreenNotReadyComponent } from './../../../../shared/components/screenNotReady';
import { PremiseLocationSearchComponent } from './../../search/iCABSAPremiseLocationSearch.component';
import { BranchServiceAreaSearchComponent } from './../../search/iCABSBBranchServiceAreaSearch';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { BaseComponent } from '../../../base/BaseComponent';
import { URLSearchParams } from '@angular/http';
import { Component, ViewChild, EventEmitter, Injector } from '@angular/core';
export var PlanVisitMaintenanceComponent = (function (_super) {
    __extends(PlanVisitMaintenanceComponent, _super);
    function PlanVisitMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.vTimeSeparator = ':';
        this.routeParams = {};
        this.vbTimeSeparator = ':';
        this.contractNumberLabel = 'Contract number';
        this.cancelVisitReasons = [{}];
        this.showCloseButton = true;
        this.showHeader = true;
        this.OriginalVisitDueDate = new Date();
        this.setFocusCancelReinstatePlanVisit = new EventEmitter();
        this.setFocusOriginalVisitDueDate = new EventEmitter();
        this.disableOriginalVisitDueDate = false;
        this.showRealignPlanVisits = true;
        this.showCustomerIntegration = false;
        this.showOriginalVisitDuration = true;
        this.showVisitDuration = true;
        this.showVisitNarrative = true;
        this.showVisitDetailText = true;
        this.showVisitDurationDefault = true;
        this.showInvoiceUnitValue = true;
        this.showAdditionalCharge = true;
        this.showDisplayBlock = false;
        this.showLocation = false;
        this.showCancelReason = false;
        this.showRemoveComponent = false;
        this.showInstallComponent = false;
        this.showRemoveQty = false;
        this.showHardSlottype = false;
        this.showCancelReinstate = false;
        this.showBlank = false;
        this.showBlank2 = false;
        this.grdCustomerIntegration = false;
        this.showMessageHeader = true;
        this.mainPageInputs = [];
        this.arrPlannerStatus = [];
        this.cancelReinstateLabel = 'Cancel/Reinstate Visit';
        this.uiDisplay = {
            tab: {
                tab1: { visible: true, active: true },
                tab2: { visible: true, active: false },
                tab3: { visible: this.showCustomerIntegration, active: false },
                tab4: { visible: true, active: false }
            }
        };
        this.ellipsisConfig = {
            visitNarrative: {
                disabled: false,
                showCloseButton: true,
                showHeader: true,
                parentMode: 'LookUp',
                showAddNew: false,
                component: ScreenNotReadyComponent
            },
            serviceCoverItem: {
                disabled: false,
                showCloseButton: true,
                showHeader: true,
                parentMode: 'LookUp',
                showAddNew: false,
                component: ScreenNotReadyComponent
            },
            premiseLocation: {
                disabled: false,
                showCloseButton: true,
                showHeader: true,
                parentMode: 'LookUp',
                showAddNew: false,
                ContractNumber: '',
                ContractName: '',
                PremiseNumber: '',
                PremiseName: '',
                component: PremiseLocationSearchComponent
            },
            product: {
                disabled: false,
                showCloseButton: true,
                showHeader: true,
                parentMode: 'DisplayEntry',
                showAddNew: false,
                component: ProductSearchGridComponent
            },
            productRemoved: {
                disabled: false,
                showCloseButton: true,
                showHeader: true,
                parentMode: 'DisplayEntry',
                showAddNew: false,
                component: ProductSearchGridComponent
            },
            branchServiceArea: {
                disabled: false,
                showCloseButton: true,
                showHeader: true,
                parentMode: 'LookUp-ServiceEmp',
                showAddNew: false,
                component: BranchServiceAreaSearchComponent
            }
        };
        this.headerParams = {
            method: 'service-planning/maintenance',
            module: 'plan-visits',
            operation: 'Application/iCABSAPlanVisitMaintenance'
        };
        this.controls = [
            { name: 'BranchNumber' },
            { name: 'BranchName' },
            { name: 'ContractNumber', disabled: true },
            { name: 'ContractName', disabled: true },
            { name: 'BranchServiceAreaCodeSC', disabled: true },
            { name: 'BranchServiceAreaDescSC', disabled: true },
            { name: 'PremiseNumber', disabled: true },
            { name: 'PremiseName', disabled: true },
            { name: 'BranchServiceAreaCode', required: true },
            { name: 'EmployeeSurname', disabled: true },
            { name: 'ProductCode', disabled: true },
            { name: 'ProductDesc', disabled: true },
            { name: 'VisitTypeCode', disabled: true },
            { name: 'VisitTypeDesc', disabled: true },
            { name: 'ActualVisitTypeCode', disabled: true },
            { name: 'ActualVisitTypeDesc', disabled: true },
            { name: 'PlanVisitStatusCode', disabled: true },
            { name: 'PlanVisitStatusDesc', disabled: true },
            { name: 'RealignPlanVisits' },
            { name: 'PlanQuantity', disabled: true },
            { name: 'PlannedVisitDate', disabled: true },
            { name: 'StaticVisitDate', disabled: true },
            { name: 'CancelReinstatePlanVisit', value: false },
            { name: 'SelReason' },
            { name: 'ActualQuantity', disabled: true },
            { name: 'ActualVisitDate', disabled: true },
            { name: 'RoutingVisitStartTime' },
            { name: 'HardSlotInd', value: false },
            { name: 'selHardSlotType', disabled: true },
            { name: 'PlanRemQuantity', disabled: true },
            { name: 'RemovalQuantity', disabled: true },
            { name: 'EstimatedDuration' },
            { name: 'AppointmentConfirmed', value: false },
            { name: 'AppointmentConfirmedReason' },
            { name: 'ProcessedDateTime', disabled: true },
            { name: 'PlanVisitUserCode' },
            { name: 'VisitDurationDefault', disabled: true },
            { name: 'SelConfirmationType' },
            { name: 'PlannedVisitDuration', disabled: true },
            { name: 'ActualVisitDuration', disabled: true },
            { name: 'OriginalVisitDuration', disabled: true },
            { name: 'ExcludeFromRouting', value: false },
            { name: 'RoutingExclusionReason' },
            { name: 'ServiceVisitText' },
            { name: 'ServicePlanNumber', disabled: true },
            { name: 'OriginalValue', disabled: true },
            { name: 'SelPlannerStatus' },
            { name: 'ClientReference' },
            { name: 'TelesalesOrderNumber', disabled: true },
            { name: 'CmdTelesalesOrder' },
            { name: 'VisitNarrativeCode' },
            { name: 'VisitNarrativeDesc', disabled: true },
            { name: 'TelesalesOrderLineNumber', disabled: true },
            { name: 'CmdTelesalesOrderLine' },
            { name: 'ServiceCoverItemNumber', disabled: true },
            { name: 'ItemDescription', disabled: true },
            { name: 'PremiseLocationNumber' },
            { name: 'PremiseLocationDesc', disabled: true },
            { name: 'ProductComponentRemoved', disabled: true },
            { name: 'ProductComponentRemDesc', disabled: true },
            { name: 'ProductComponentCode', disabled: true },
            { name: 'ProductComponentDesc', disabled: true },
            { name: 'InvoiceUnitValue', disabled: true },
            { name: 'AdditionalChargeValue', disabled: true },
            { name: 'PlanVisitSeqNo', disabled: true },
            { name: 'SpecialInstructions' },
            { name: 'CICustomerRef', disabled: true },
            { name: 'LinkedCICustomerRef', disabled: true },
            { name: 'CISLAStartDate', disabled: true },
            { name: 'CISLAStartTime', disabled: true },
            { name: 'VisitNotes' },
            { name: 'RequireAnnualTimeInd' },
            { name: 'RequiresVisitDetailTextInd' },
            { name: 'RequiresManualVisitPlanningInd' },
            { name: 'VisitStatusReasonCode' },
            { name: 'DisplayLevelInd', value: false },
            { name: 'CICustRefReq' },
            { name: 'ServiceCoverNumber' },
            { name: 'SelProductCode' },
            { name: 'SelProductDesc' },
            { name: 'SelComponentTypeCode' },
            { name: 'PlanVisitRowID' },
            { name: 'ErrorMessage' },
            { name: 'PlannerStatus' },
            { name: 'ConfirmationType' },
            { name: 'HardSlotType' },
            { name: 'ProdReplacement', value: false },
            { name: 'VisitDurationExists', value: false },
            { name: 'BusinessCode' },
            { name: 'ReasonCode' },
            { name: 'ReasonDesc' },
            { name: 'EmployeeCode' },
            { name: 'Password' }
        ];
        this.pageTitle = 'Planned Visit Maintenance';
        this.pageId = PageIdentifier.ICABSAPLANVISITMAINTENANCE;
    }
    PlanVisitMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.loadSpeedScript();
        this.utils.disableCBB(true);
    };
    PlanVisitMaintenanceComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    PlanVisitMaintenanceComponent.prototype.loadSpeedScript = function () {
        var _this = this;
        this.vBusinessCode = this.utils.getBusinessCode();
        this.vCountryCode = this.utils.getCountryCode();
        var sysCharNumbers = [
            this.sysCharConstants.SystemCharEnableServiceCoverDisplayLevel,
            this.sysCharConstants.SystemCharEnableTimePlanning
        ];
        var sysCharIP = {
            operation: 'iCABSAPlanVisitMaintenance',
            action: 0,
            businessCode: this.vBusinessCode,
            countryCode: this.vCountryCode,
            SysCharList: sysCharNumbers.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe(function (data) {
            _this.vbEnableServiceCoverDispLev = data['records'][0].Required;
            _this.vbEnableTimePlanning = data['records'][1].Required;
            if (_this.vbEnableTimePlanning === true) {
                _this.showVisitDurationDefault = true;
            }
            for (var iCount = 0; iCount < 14; iCount++) {
                var ttPlannerStatus = {};
                ttPlannerStatus.PlannerStatusCode = iCount;
                switch (iCount) {
                    case 0:
                        ttPlannerStatus.PlannerStatusDesc = _this.speedScriptConstants.PLANNERSTATUS_00;
                        ttPlannerStatus.SeqNo = 1;
                        break;
                    case 14:
                        ttPlannerStatus.PlannerStatusDesc = _this.speedScriptConstants.PLANNERSTATUS_14;
                        ttPlannerStatus.SeqNo = 2;
                        break;
                    case 13:
                        ttPlannerStatus.PlannerStatusDesc = _this.speedScriptConstants.PLANNERSTATUS_13;
                        ttPlannerStatus.SeqNo = 3;
                        break;
                    case 12:
                        ttPlannerStatus.PlannerStatusDesc = _this.speedScriptConstants.PLANNERSTATUS_12;
                        ttPlannerStatus.SeqNo = 4;
                        break;
                    case 11:
                        ttPlannerStatus.PlannerStatusDesc = _this.speedScriptConstants.PLANNERSTATUS_11;
                        ttPlannerStatus.SeqNo = 5;
                        break;
                    case 10:
                        ttPlannerStatus.PlannerStatusDesc = _this.speedScriptConstants.PLANNERSTATUS_10;
                        ttPlannerStatus.SeqNo = 6;
                        break;
                    case 9:
                        ttPlannerStatus.PlannerStatusDesc = _this.speedScriptConstants.PLANNERSTATUS_09;
                        ttPlannerStatus.SeqNo = 7;
                        break;
                    case 8:
                        ttPlannerStatus.PlannerStatusDesc = _this.speedScriptConstants.PLANNERSTATUS_08;
                        ttPlannerStatus.SeqNo = 8;
                        break;
                    case 7:
                        ttPlannerStatus.PlannerStatusDesc = _this.speedScriptConstants.PLANNERSTATUS_07;
                        ttPlannerStatus.SeqNo = 9;
                        break;
                    case 6:
                        ttPlannerStatus.PlannerStatusDesc = _this.speedScriptConstants.PLANNERSTATUS_06;
                        ttPlannerStatus.SeqNo = 10;
                        break;
                    case 5:
                        ttPlannerStatus.PlannerStatusDesc = _this.speedScriptConstants.PLANNERSTATUS_05;
                        ttPlannerStatus.SeqNo = 11;
                        break;
                    case 4:
                        ttPlannerStatus.PlannerStatusDesc = _this.speedScriptConstants.PLANNERSTATUS_04;
                        ttPlannerStatus.SeqNo = 12;
                        break;
                    case 3:
                        ttPlannerStatus.PlannerStatusDesc = _this.speedScriptConstants.PLANNERSTATUS_03;
                        ttPlannerStatus.SeqNo = 13;
                        break;
                    case 2:
                        ttPlannerStatus.PlannerStatusDesc = _this.speedScriptConstants.PLANNERSTATUS_02;
                        ttPlannerStatus.SeqNo = 14;
                        break;
                    case 1:
                        ttPlannerStatus.PlannerStatusDesc = _this.speedScriptConstants.PLANNERSTATUS_01;
                        ttPlannerStatus.SeqNo = 15;
                        break;
                }
                _this.arrPlannerStatus.push(ttPlannerStatus);
            }
            _this.onWindowLoad();
        });
    };
    PlanVisitMaintenanceComponent.prototype.onWindowLoad = function () {
        var strInpTitle = '^1^ Number';
        var currentContractType = this.utils.getCurrentContractType(this.routeParams.ContractType);
        var currentContractTypeLabel = this.utils.getCurrentContractLabel(currentContractType);
        this.contractNumberLabel = strInpTitle.replace('^1^', currentContractTypeLabel);
        this.riExchange.riInputElement.Disable(this.uiForm, 'SelReason');
        this.riExchange.riInputElement.Disable(this.uiForm, 'SelPlannerStatus');
        this.riExchange.riInputElement.Disable(this.uiForm, 'SelConfirmationType');
        this.setPageAsParentMode();
    };
    PlanVisitMaintenanceComponent.prototype.setPageAsParentMode = function () {
        var vrRowid;
        switch (this.parentMode) {
            case 'ContactHistory':
                vrRowid = this.riExchange.getParentAttributeValue('RowID');
                break;
            case 'TechVisitDiary':
                vrRowid = this.riExchange.getParentHTMLValue('PlanVisitRowId');
                this.setControlValue('PlanVisitRowID', vrRowid);
                break;
            default:
                vrRowid = this.riExchange.getParentAttributeValue('PlanVisitRowID');
                break;
        }
        if (vrRowid !== '') {
            this.setControlValue('PlanVisitRowID', vrRowid);
        }
        this.fetchRecord(vrRowid);
    };
    PlanVisitMaintenanceComponent.prototype.fetchRecord = function (vrRowid) {
        var _this = this;
        var searchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        searchParams.set(this.serviceConstants.Action, '0');
        searchParams.set('PlanVisitROWID', vrRowid);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.messageModal.show(data, true);
                return;
            }
            _this.routeAwayGlobals.setSaveEnabledFlag(true);
            var checkBoxList = ['AppointmentConfirmed', 'VisitDurationExists', 'DisplayLevelInd', 'CancelReinstatePlanVisit',
                'ProdReplacement', 'ExcludeFromRouting', 'HardSlotInd', 'CICustRefReq', 'RealignPlanVisits'];
            for (var key in data) {
                if (key) {
                    if (checkBoxList.indexOf(key) >= 0) {
                        _this.setControlValue(key, _this.utils.convertResponseValueToCheckboxInput(data[key]));
                        continue;
                    }
                    else if (key === 'OriginalVisitDueDate') {
                        var dt = _this.utils.convertDate(data[key]);
                        _this.OriginalVisitDueDate = new Date(dt);
                    }
                    else if (key === 'OriginalValue' || key === 'AdditionalChargeValue' || key === 'InvoiceUnitValue') {
                        _this.setControlValue(key, _this.utils.cCur(data[key]));
                    }
                    else if (key === 'RoutingVisitStartTime' || key === 'CISLAStartTime') {
                        _this.setControlValue(key, _this.utils.secondsToHms(data[key]));
                    }
                    else if (key === 'PlanVisit') {
                        _this.setControlValue('PlanVisitRowID', data[key]);
                    }
                    else {
                        _this.setControlValue(key, data[key]);
                    }
                }
            }
            _this.ellipsisConfig.premiseLocation.ContractNumber = data['ContractNumber'];
            _this.ellipsisConfig.premiseLocation.PremiseNumber = data['PremiseNumber'];
            _this.lookup();
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    PlanVisitMaintenanceComponent.prototype.lookup = function () {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var lookup_details = [{
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode,
                    'ContractNumber': this.getControlValue('ContractNumber')
                },
                'fields': ['ContractName']
            }, {
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode,
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber')
                },
                'fields': ['PremiseName', 'CICustRefReq']
            }, {
                'table': 'Product',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode,
                    'ProductCode': this.getControlValue('ProductCode')
                },
                'fields': ['ProductDesc', 'RequireAnnualTimeInd', 'RequiresVisitDetailTextInd', 'RequiresManualVisitPlanningInd']
            }, {
                'table': 'Branch',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode,
                    'BranchNumber': this.getControlValue('BranchNumber')
                },
                'fields': ['BranchName']
            }, {
                'table': 'BranchServiceArea',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode,
                    'BranchNumber': this.getControlValue('BranchNumber'),
                    'BranchServiceAreaCode': this.getControlValue('BranchServiceAreaCode')
                },
                'fields': ['EmployeeCode', 'BranchServiceAreaDesc']
            }, {
                'table': 'VisitType',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode,
                    'VisitTypeCode': this.getControlValue('VisitTypeCode')
                },
                'fields': ['VisitTypeDesc', 'ActualVisitTypeDesc']
            }, {
                'table': 'PlanVisitStatusLang',
                'query': {
                    'LanguageCode': this.riExchange.LanguageCode(),
                    'PlanVisitStatusCode': this.getControlValue('PlanVisitStatusCode')
                },
                'fields': ['PlanVisitStatusDesc']
            }, {
                'table': 'VisitNarrative',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode,
                    'VisitNarrativeCode': this.getControlValue('VisitNarrativeCode')
                },
                'fields': ['VisitNarrativeDesc']
            }];
        if (this.vbEnableServiceCoverDispLev && this.getControlValue('ProdReplacement') === true) {
            lookup_details.push({
                'table': 'ServiceCoverItem',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode,
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber'),
                    'ProductCode': this.getControlValue('ProductCode'),
                    'ServiceCoverNumber': this.getControlValue('ServiceCoverNumber'),
                    'ServiceCoverItemNumber': this.getControlValue('ServiceCoverItemNumber')
                },
                'fields': ['ItemDescription']
            });
            lookup_details.push({
                'table': 'PremiseLocation',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode,
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber'),
                    'PremiseLocationNumber': this.getControlValue('PremiseLocationNumber')
                },
                'fields': ['PremiseLocationDesc']
            });
        }
        this.LookUp.lookUpRecord(lookup_details).subscribe(function (data) {
            if (data.length > 0) {
                var contractData = data[0];
                var premiseData = data[1];
                var productData = data[2];
                var branchData = data[3];
                var branchServiceData = data[4];
                var visitTypeData = data[5];
                var planVisitStatusData = data[6];
                var visitNarrativeData = data[7];
                if (contractData.length > 0) {
                    _this.setControlValue('ContractName', contractData[0].ContractName);
                    _this.ellipsisConfig.premiseLocation.ContractName = contractData[0].ContractName;
                }
                if (premiseData.length > 0) {
                    _this.setControlValue('PremiseName', premiseData[0].PremiseName);
                    _this.setControlValue('CICustRefReq', premiseData[0].CICustRefReq);
                    _this.ellipsisConfig.premiseLocation.PremiseName = premiseData[0].PremiseName;
                    if (_this.riExchange.riInputElement.checked(_this.uiForm, 'CICustRefReq')) {
                        _this.showCustomerIntegration = premiseData[0].CICustRefReq;
                    }
                }
                if (productData.length > 0) {
                    _this.setControlValue('ProductDesc', productData[0].ProductDesc);
                    _this.setControlValue('RequiresManualVisitPlanningInd', productData[0].RequiresManualVisitPlanningInd);
                    _this.setControlValue('RequireAnnualTimeInd', productData[0].RequireAnnualTimeInd);
                    _this.setControlValue('RequiresVisitDetailTextInd', productData[0].RequiresVisitDetailTextInd);
                    if (!_this.riExchange.riInputElement.checked(_this.uiForm, 'RequireAnnualTimeInd')) {
                        _this.showOriginalVisitDuration = false;
                        _this.showVisitDuration = false;
                        _this.showBlank = true;
                    }
                    if (_this.riExchange.riInputElement.checked(_this.uiForm, 'RequiresVisitDetailTextInd')) {
                        _this.showVisitDetailText = false;
                    }
                }
                if (branchData.length > 0) {
                    _this.setControlValue('BranchName', branchData[0].BranchName);
                }
                if (branchServiceData.length > 0) {
                    _this.setControlValue('BranchServiceAreaDescSC', branchServiceData[0].BranchServiceAreaDesc);
                    _this.setControlValue('EmployeeCode', branchServiceData[0].EmployeeCode);
                    _this.getEmployeeSurname(branchServiceData[0].EmployeeCode);
                }
                if (visitTypeData.length > 0) {
                    _this.setControlValue('VisitTypeDesc', visitTypeData[0].VisitTypeDesc);
                    if (_this.getControlValue('ActualVisitTypeCode')) {
                        _this.setControlValue('ActualVisitTypeDesc', visitTypeData[0].VisitTypeDesc);
                    }
                }
                if (planVisitStatusData.length > 0) {
                    _this.setControlValue('PlanVisitStatusDesc', planVisitStatusData[0].PlanVisitStatusDesc);
                }
                if (visitNarrativeData.length > 0) {
                    _this.setControlValue('VisitNarrativeDesc', visitNarrativeData[0].VisitNarrativeDesc);
                }
                if (_this.vbEnableServiceCoverDispLev && _this.getControlValue('ProdReplacement') === true) {
                    var serviceCoverItemData = data[8];
                    var premiseLocationData = data[9];
                    if (serviceCoverItemData.length > 0) {
                        _this.setControlValue('ItemDescription', visitNarrativeData[0].ItemDescription);
                    }
                    if (premiseLocationData.length > 0) {
                        _this.setControlValue('PremiseLocationDesc', visitNarrativeData[0].PremiseLocationDesc);
                    }
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.updatePageView();
        });
    };
    PlanVisitMaintenanceComponent.prototype.updatePageView = function () {
        var premiseLocationNumber = this.getControlValue('PremiseLocationNumber');
        if (premiseLocationNumber !== '0' && !premiseLocationNumber) {
            this.premiseLocationNumber_onChange();
        }
        var serviceCoverItemNumber = this.getControlValue('ServiceCoverItemNumber');
        if (serviceCoverItemNumber !== '0' && !serviceCoverItemNumber) {
            this.setServiceCoverItemDesc();
        }
        this.setFieldLabels();
        if (!this.getIsSCHardSlot()) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'HardSlotInd');
        }
        else {
            this.riExchange.riInputElement.Enable(this.uiForm, 'HardSlotInd');
        }
        this.hardSlotInd_OnClick();
        this.riExchange.riInputElement.Disable(this.uiForm, 'CmdTelesalesOrder');
        this.riExchange.riInputElement.Disable(this.uiForm, 'CmdTelesalesOrderLine');
        if (this.getControlValue('TelesalesOrderNumber') !== '0') {
            this.riExchange.riInputElement.Enable(this.uiForm, 'CmdTelesalesOrder');
            this.riExchange.riInputElement.Enable(this.uiForm, 'CmdTelesalesOrderLine');
        }
        this.updateVisibilityStatus();
        this.loadCancelPage();
        this.setValue();
    };
    PlanVisitMaintenanceComponent.prototype.setFieldLabels = function () {
        var _this = this;
        this.showCancelReason = false;
        var planVisitStatusCode = this.getControlValue('PlanVisitStatusCode');
        switch (planVisitStatusCode) {
            case 'C':
                this.showCancelReinstate = true;
                this.showCancelReason = true;
                this.utils.getTranslatedval('Reinstate Visit').then(function (res) { _this.cancelReinstateLabel = res; });
                this.setControlValue('SelReason', '');
                break;
            case 'U':
            case 'I':
            case 'P':
                this.showCancelReason = true;
                this.showCancelReinstate = true;
                this.utils.getTranslatedval('Cancel Visit').then(function (res) { _this.cancelReinstateLabel = res; });
                this.setControlValue('SelReason', '');
                break;
            case 'V':
                this.showCancelReinstate = false;
        }
    };
    PlanVisitMaintenanceComponent.prototype.getIsSCHardSlot = function () {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var searchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        searchParams.set(this.serviceConstants.Action, '0');
        searchParams.set('Function', 'IsSCHardSlot');
        searchParams.set('ContractNumber', this.getControlValue('ContractNumber'));
        searchParams.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        searchParams.set('ProductCode', this.getControlValue('ProductCode'));
        searchParams.set('ServiceCoverNumber', this.getControlValue('ServiceCoverNumber'));
        searchParams.set(this.serviceConstants.Action, '0');
        var isSCHardSlot;
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams).subscribe(function (data) {
            if (!data.error) {
                if (data.IsSCHardSlot) {
                    isSCHardSlot = true;
                }
                else {
                    isSCHardSlot = false;
                }
                _this.setControlValue('selHardSlotType', data.HardSlotType);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
        return isSCHardSlot;
    };
    PlanVisitMaintenanceComponent.prototype.loadCancelPage = function () {
        var _this = this;
        var searchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        searchParams.set(this.serviceConstants.Action, '0');
        var bodyParams = {};
        bodyParams['Function'] = 'LoadCancelPage';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams, bodyParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.setControlValue('ReasonCode', data.ReasonCode);
            _this.setControlValue('ReasonDesc', data.ReasonDesc);
            _this.setControlValue('Password', data.Password);
            _this.cancelVisitReasons = [];
            var vcReasonCodes = data.ReasonCode.split(';');
            var vcReasonDescs = data.ReasonDesc.split(';');
            for (var i = -1; i < vcReasonCodes.length; i++) {
                var obj = {
                    key: vcReasonCodes[i],
                    value: vcReasonDescs[i]
                };
                _this.cancelVisitReasons.push(obj);
            }
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    PlanVisitMaintenanceComponent.prototype.setValue = function () {
        var _this = this;
        var searchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        searchParams.set(this.serviceConstants.Action, '0');
        var bodyParams = {};
        bodyParams['Function'] = 'SetValue';
        bodyParams['PlanVisitROWID'] = this.getControlValue('PlanVisitRowID');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams, bodyParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.messageModal.show(data, true);
                return;
            }
            _this.vbIsFollowUp = data.IsFollowUp;
            _this.setControlValue('PlanVisitUserCode', data.PlanVisitUserCode);
            if (_this.vbIsFollowUp === 'False') {
                _this.riExchange.riInputElement.Disable(_this.uiForm, 'EstimatedDuration');
            }
            if (_this.getControlValue('PlanVisitStatusCode') === 'C') {
                _this.setControlValue('SelReason', _this.getControlValue('VisitStatusReasonCode'));
            }
            else {
                _this.setValidCancelReason();
            }
            _this.setControlValue('SelPlannerStatus', _this.getControlValue('PlannerStatus'));
            if (_this.getControlValue('ConfirmationType') === '') {
                _this.setControlValue('SelConfirmationType', '');
            }
            else {
                _this.setControlValue('SelConfirmationType', _this.getControlValue('ConfirmationType').toLowerCase());
            }
            _this.appointmentConfirmed_OnClick();
            _this.excludeFromRouting_OnClick();
            if (_this.parentMode === 'ServicePlanningNote') {
                _this.renderTab(2);
            }
            _this.beforeUpdate();
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    PlanVisitMaintenanceComponent.prototype.setValidCancelReason = function () {
        var _this = this;
        this.cancelVisitReasons.pop();
        this.cancelVisitReasons = [];
        var searchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        searchParams.set(this.serviceConstants.Action, '0');
        var bodyParams = {};
        bodyParams['Function'] = 'SetValidCancelReason';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams, bodyParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (!data.error) {
                _this.setControlValue('ReasonCode', data.ReasonCode);
                _this.setControlValue('ReasonDesc', data.ReasonDesc);
                _this.cancelVisitReasons = [];
                var vcReasonCodes = data.ReasonCode.split(';');
                var vcReasonDescs = data.ReasonDesc.split(';');
                for (var i = -1; i < vcReasonCodes.length; i++) {
                    var obj = {
                        key: vcReasonCodes[i],
                        value: vcReasonDescs[i]
                    };
                    _this.cancelVisitReasons.push(obj);
                }
            }
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    PlanVisitMaintenanceComponent.prototype.updateVisibilityStatus = function () {
        if (this.vbEnableServiceCoverDispLev) {
            this.showVisitDetailText = true;
            this.showVisitNarrative = true;
            this.showInvoiceUnitValue = true;
            this.showAdditionalCharge = true;
            if (this.getControlValue('ProdReplacement') === true) {
                this.showDisplayBlock = true;
                this.showLocation = true;
                this.showRemoveComponent = true;
                this.showInstallComponent = true;
                this.showRemoveQty = true;
            }
            else {
                this.showDisplayBlock = false;
                this.showLocation = false;
                this.showRemoveComponent = false;
                this.showInstallComponent = false;
                this.showRemoveQty = false;
            }
        }
        else {
            this.showVisitNarrative = false;
            this.showAdditionalCharge = false;
            this.showInvoiceUnitValue = false;
            this.showInstallComponent = false;
            this.showRemoveComponent = false;
            this.showLocation = false;
            this.showDisplayBlock = false;
            this.showRemoveQty = false;
        }
    };
    PlanVisitMaintenanceComponent.prototype.setServiceCoverItemDesc = function () {
        var _this = this;
        if (this.getControlValue('PremiseLocationNumber')) {
            var searchParams = new URLSearchParams();
            searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            searchParams.set(this.serviceConstants.Action, '0');
            searchParams.set('Function', 'SetItemDescription');
            searchParams.set('ContractNumber', this.getControlValue('ContractNumber'));
            searchParams.set('PremiseNumber', this.getControlValue('PremiseNumber'));
            searchParams.set('ProductCode', this.getControlValue('ProductCode'));
            searchParams.set('ServiceCoverNumber', this.getControlValue('ServiceCoverNumber'));
            searchParams.set('ServiceCoverItemNumber', this.getControlValue('ServiceCoverItemNumber'));
            this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams).subscribe(function (data) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                _this.setControlValue('ItemDescription', data.ItemDescription);
            }, function (error) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
        else {
            this.setControlValue('ItemDescription', '');
        }
    };
    PlanVisitMaintenanceComponent.prototype.visitNarrativeCode_onchange = function () {
        var _this = this;
        if (this.getControlValue('VisitNarrativeCode')) {
            var searchParams = new URLSearchParams();
            searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            searchParams.set(this.serviceConstants.Action, '0');
            searchParams.set('Function', 'GetVisitNarrativeDesc');
            searchParams.set('VisitNarrativeCode', this.getControlValue('VisitNarrativeCode'));
            this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams).subscribe(function (data) {
                if (data.VisitNarrativeDesc) {
                    _this.setControlValue('VisitNarrativeDesc', data.VisitNarrativeDesc);
                }
                else {
                    _this.setControlValue('VisitNarrativeCode', '');
                    _this.setControlValue('VisitNarrativeDesc', '');
                }
            }, function (error) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
        else {
            this.setControlValue('VisitNarrativeDesc', '');
        }
    };
    PlanVisitMaintenanceComponent.prototype.serviceCoverItemNumber_onchange = function () {
        var _this = this;
        if (this.getControlValue('ServiceCoverItemNumber')) {
            var searchParams = new URLSearchParams();
            searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            searchParams.set(this.serviceConstants.Action, '0');
            searchParams.set('Function', 'GetServiceCoverItemNumberDesc');
            searchParams.set('ContractNumber', this.getControlValue('ContractNumber'));
            searchParams.set('PremiseNumber', this.getControlValue('PremiseNumber'));
            searchParams.set('ProductCode', this.getControlValue('ProductCode'));
            searchParams.set('ServiceCoverNumber', this.getControlValue('ServiceCoverNumber'));
            searchParams.set('ServiceCoverItemNumber', this.getControlValue('ServiceCoverItemNumber'));
            this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams).subscribe(function (data) {
                _this.setControlValue('ItemDescription', data.ItemDescription);
                _this.setControlValue('PremiseLocationNumber', data.PremiseLocationNumber);
                _this.setControlValue('PremiseLocationDesc', data.PremiseLocationDesc);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                _this.setControlValue('ServiceCoverItemNumber', '0');
                _this.setControlValue('ItemDescription', '');
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
        else {
            this.setControlValue('VisitNarrativeDesc', '');
        }
    };
    PlanVisitMaintenanceComponent.prototype.premiseLocationNumber_onChange = function () {
        var _this = this;
        if (this.getControlValue('PremiseLocationNumber')) {
            var searchParams = new URLSearchParams();
            searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            searchParams.set(this.serviceConstants.Action, '0');
            searchParams.set('Function', 'GetServiceCoverItemNumberDesc');
            searchParams.set('ContractNumber', this.getControlValue('ContractNumber'));
            searchParams.set('PremiseNumber', this.getControlValue('PremiseNumber'));
            searchParams.set('PremiseLocationNumber', this.getControlValue('ProductCode'));
            this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams).subscribe(function (data) {
                _this.setControlValue('PremiseLocationDesc', data.PremiseLocationDesc);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                _this.setControlValue('PremiseLocationNumber', '0');
                _this.setControlValue('PremiseLocationDesc', '');
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
        else {
            this.setControlValue('PremiseLocationDesc', '');
        }
    };
    PlanVisitMaintenanceComponent.prototype.productComponentRemoved_onChange = function () {
        var _this = this;
        if (this.getControlValue('ProductComponentRemoved')) {
            var searchParams = new URLSearchParams();
            searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            searchParams.set(this.serviceConstants.Action, '0');
            searchParams.set('Function', 'GetProductComponentRemDesc');
            searchParams.set('ProductComponentRemoved', this.getControlValue('ContractNumber'));
            this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams).subscribe(function (data) {
                _this.setControlValue('ProductComponentRemDesc', data.ProductComponentRemDesc);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                _this.setControlValue('ProductComponentRemDesc', '');
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
        else {
            this.setControlValue('ProductComponentRemDesc', '');
        }
    };
    PlanVisitMaintenanceComponent.prototype.productComponentCode_onChange = function () {
        var _this = this;
        if (this.getControlValue('ProductComponentCode')) {
            var searchParams = new URLSearchParams();
            searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            searchParams.set(this.serviceConstants.Action, '0');
            searchParams.set('Function', 'GetProductComponentDesc');
            searchParams.set('ProductComponentCode', this.getControlValue('ProductComponentCode'));
            this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams).subscribe(function (data) {
                _this.setControlValue('ProductComponentDesc', data.ProductComponentRemDesc);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                _this.setControlValue('ProductComponentDesc', '');
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
        else {
            this.setControlValue('ProductComponentDesc', '');
        }
    };
    PlanVisitMaintenanceComponent.prototype.inputField_OnChange = function (e, name) {
        if (name === 'VisitNarrative') {
            this.visitNarrativeCode_onchange();
        }
        else if (name === 'ServiceCoverItem') {
            this.serviceCoverItemNumber_onchange();
        }
        else if (name === 'PremiseLocation') {
            this.setControlValue('PremiseLocationNumber', e.PremiseLocationNumber);
            this.setControlValue('PremiseLocationDesc', e.PremiseLocationDesc);
        }
        else if (name === 'ProductRemoved') {
            this.setControlValue('ProductComponentRemoved', e.SelProductCode);
            this.setControlValue('ProductComponentRemDesc', e.SelProductDesc);
        }
        else if (name === 'Product') {
            this.setControlValue('ProductComponentCode', e.SelProductCode);
            this.setControlValue('ProductComponentDesc', e.SelProductDesc);
        }
        else if (name === 'BranchServiceArea') {
            this.setControlValue('BranchServiceAreaCode', e.BranchServiceAreaCode);
            this.setControlValue('EmployeeSurname', e.EmployeeSurname);
        }
    };
    PlanVisitMaintenanceComponent.prototype.visitDurationDefault_OnChange = function () {
        this.processTimeString('VisitDurationDefault');
    };
    PlanVisitMaintenanceComponent.prototype.estimatedDuration_OnChange = function () {
        this.processTimeString('EstimatedDuration');
    };
    PlanVisitMaintenanceComponent.prototype.originalVisitDueDate_onDeactivate = function () {
        if (this.getControlValue('AppointmentConfirmed')) {
            this.setControlValue('PlannedVisitDate', this.OriginalVisitDueDate);
        }
    };
    PlanVisitMaintenanceComponent.prototype.branchServiceAreaCode_onChange = function () {
        var _this = this;
        if (this.getControlValue('GetEmployeeSurname')) {
            var searchParams = new URLSearchParams();
            searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            searchParams.set(this.serviceConstants.Action, '0');
            searchParams.set('Function', 'GetProductComponentDesc');
            searchParams.set('BranchNumber', this.getControlValue('BranchNumber'));
            searchParams.set('BranchServiceAreaCode', this.getControlValue('BranchServiceAreaCode'));
            this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams).subscribe(function (data) {
                _this.setControlValue('EmployeeCode', data.EmployeeCode);
                _this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                _this.setControlValue('EmployeeCode', '');
                _this.setControlValue('EmployeeSurname', '');
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
    };
    PlanVisitMaintenanceComponent.prototype.getEmployeeSurname = function (empCode) {
        var _this = this;
        var employee_details = [{
                'table': 'Employee',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode,
                    'EmployeeCode': empCode
                },
                'fields': ['EmployeeSurname']
            }];
        this.LookUp.lookUpRecord(employee_details).subscribe(function (data) {
            if (data.length > 0) {
                var empData = data[0];
                _this.setControlValue('EmployeeSurname', empData[0].EmployeeSurname);
            }
        });
    };
    PlanVisitMaintenanceComponent.prototype.processTimeString = function (vbTimeField) {
        var vbTime;
        var vbDurationHours;
        var vbDurationMinutes;
        var vbTimeSec;
        var vbVisitDurationSec;
        var vbError = false;
        var vbMsgResult;
        var vbTimeFormat = '00' + this.vbTimeSeparator + '00';
        switch (vbTimeField) {
            case 'EstimatedDuration':
                vbTime = this.getControlValue('EstimatedDuration').replace(this.vbTimeSeparator, '');
                break;
            case 'VisitDurationDefault':
                vbTime = this.getControlValue('VisitDurationDefault').replace(this.vbTimeSeparator, '');
                break;
        }
        if ((vbTime.length > 4 && vbTime.length < 7) || (vbTime !== 0)) {
            vbDurationHours = vbTime.substr(1, vbTime.length - 2);
            vbDurationMinutes = this.utils.Right(vbTime, 2);
            if (vbDurationMinutes > 59) {
                var translatedMsg1 = void 0, translatedMsg2 = void 0;
                var msg1 = this.getTranslatedValue('Minutes Entered Cannot Be Greater Than 59');
                var msg2 = this.getTranslatedValue('Warning');
                var errMessage = void 0;
                errMessage['errorMessage'] = msg1 + '!' + msg2;
                this.messageModal.show(errMessage, true);
                vbError = true;
            }
            else {
                vbTimeSec = (vbDurationHours * 60 * 60) + (vbDurationMinutes * 60);
            }
        }
        switch (vbTimeField) {
            case 'EstimatedDuration':
                if (!vbError) {
                    this.setControlValue('EstimatedDuration', vbTimeFormat);
                }
                else {
                    this.setControlValue('EstimatedDuration', '');
                }
                break;
            case 'VisitDurationDefault':
                if (!vbError) {
                    this.setControlValue('VisitDurationDefault', vbTimeFormat);
                }
                else {
                    this.setControlValue('VisitDurationDefault', '');
                }
                break;
        }
    };
    PlanVisitMaintenanceComponent.prototype.getIsTelesales = function () {
        var _this = this;
        var searchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        searchParams.set(this.serviceConstants.Action, '0');
        searchParams.set('Function', 'IsTelesales');
        searchParams.set('PlanVisitROWID', this.getControlValue('PlanVisitRowID'));
        var isTelesales;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.messageModal.show(data, true);
                return;
            }
            if (data.IsTelesales) {
                isTelesales = true;
            }
            else {
                isTelesales = false;
            }
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
        return isTelesales;
    };
    PlanVisitMaintenanceComponent.prototype.hardSlotInd_OnClick = function () {
        if (this.getControlValue('HardSlotInd') === true) {
            this.showHardSlottype = true;
        }
        else {
            this.showHardSlottype = false;
        }
    };
    PlanVisitMaintenanceComponent.prototype.updateDatePickerValue = function (value) {
        if (value && value.value) {
            this.dtOriginalVisit = value.value;
            if (window['moment'](this.dtOriginalVisit, 'DD/MM/YYYY', true).isValid()) {
                this.dtOriginalVisit = this.utils.convertDate(this.dtOriginalVisit);
            }
            else {
                this.dtOriginalVisit = this.utils.formatDate(this.dtOriginalVisit);
            }
            if (!this.dtOriginalVisit) {
                this.OriginalVisitDueDate = null;
            }
            else {
                this.OriginalVisitDueDate = new Date(this.dtOriginalVisit);
            }
            var formattedDate = this.utils.formatDate(this.OriginalVisitDueDate);
        }
    };
    PlanVisitMaintenanceComponent.prototype.cancelReinstatePlanVisit_OnClick = function () {
        if (this.getControlValue('PlanVisitStatusCode') === 'U' ||
            this.getControlValue('PlanVisitStatusCode') === 'I' ||
            this.getControlValue('PlanVisitStatusCode') === 'P') {
            if (this.getControlValue('CancelReinstatePlanVisit') === true) {
                this.riExchange.riInputElement.Enable(this.uiForm, 'SelReason');
            }
            else {
                this.riExchange.riInputElement.Disable(this.uiForm, 'SelReason');
                this.setControlValue('SelReason', 'None');
            }
        }
    };
    PlanVisitMaintenanceComponent.prototype.selConfirmationType_OnChange = function () {
        if (this.getControlValue('SelConfirmationType') !== '') {
            this.setControlValue('AppointmentConfirmed', true);
            this.setControlValue('PlannedVisitDate', this.OriginalVisitDueDate);
        }
        else {
            this.setControlValue('AppointmentConfirmed', false);
            this.setControlValue('PlannedVisitDate', '');
        }
        this.appointmentConfirmed_OnClick();
    };
    PlanVisitMaintenanceComponent.prototype.appointmentConfirmed_OnClick = function () {
        var appointmentConfirmed = this.getControlValue('AppointmentConfirmed');
        if (appointmentConfirmed) {
            this.riExchange.riInputElement.Enable(this.uiForm, 'AppointmentConfirmedReason');
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'RoutingVisitStartTime', true);
            this.setControlValue('PlannedVisitDate', this.utils.formatDate(this.OriginalVisitDueDate));
        }
        else {
            this.riExchange.riInputElement.Disable(this.uiForm, 'AppointmentConfirmedReason');
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'RoutingVisitStartTime', false);
            this.setControlValue('AppointmentConfirmedReason', '');
            this.setControlValue('PlannedVisitDate', '');
            this.setControlValue('SelConfirmationType', '');
        }
    };
    PlanVisitMaintenanceComponent.prototype.excludeFromRouting_OnClick = function () {
        if (this.getControlValue('ExcludeFromRouting') === true) {
            this.riExchange.riInputElement.Enable(this.uiForm, 'RoutingExclusionReason');
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'RoutingExclusionReason', true);
        }
        else {
            this.riExchange.riInputElement.Disable(this.uiForm, 'RoutingExclusionReason');
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'RoutingExclusionReason', false);
            this.setControlValue('RoutingExclusionReason', '');
        }
    };
    PlanVisitMaintenanceComponent.prototype.renderTab = function (tabindex) {
        switch (tabindex) {
            case 1:
                this.uiDisplay.tab.tab1.active = true;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = false;
                break;
            case 2:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = true;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = false;
                break;
            case 3:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = true;
                this.uiDisplay.tab.tab4.active = false;
                break;
            case 4:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = true;
                break;
        }
    };
    PlanVisitMaintenanceComponent.prototype.beforeSave = function () {
        var vbMessageResult;
        if (this.getControlValue('CancelReinstatePlanVisit') === true) {
            if (this.getIsTelesales()) {
                this.promptTitle = 'Warning';
                var errorMsg = this.getControlValue('ErrorMessage');
                this.promptModal.show();
                return;
            }
        }
        this.setControlValue('VisitStatusReasonCode', this.getControlValue('SelReason'));
        this.setControlValue('PlannerStatus', this.getControlValue('SelPlannerStatus'));
        this.setControlValue('ConfirmationType', this.getControlValue('SelConfirmationType'));
        var formValid = true;
        for (var control in this.uiForm.controls) {
            if (control) {
                this.riExchange.riInputElement.isError(this.uiForm, control);
            }
        }
        if (this.uiForm.invalid)
            return;
        this.promptTitle = MessageConstant.Message.ConfirmRecord;
        this.promptModal.show();
        this.utils.disableCBB(true);
    };
    PlanVisitMaintenanceComponent.prototype.beforeUpdate = function () {
        var appointmentConfirmed = this.getControlValue('AppointmentConfirmed');
        if (!appointmentConfirmed) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'AppointmentConfirmedReason');
        }
        else {
            this.riExchange.riInputElement.Enable(this.uiForm, 'AppointmentConfirmedReason');
        }
        if (this.getControlValue('RequiresManualVisitPlanningInd') === 'true') {
            this.showRealignPlanVisits = false;
            this.disableOriginalVisitDueDate = true;
            this.originalVisitDueDate_onDeactivate();
            if (!this.showCancelReinstate) {
                this.setFocusCancelReinstatePlanVisit.emit(true);
            }
        }
        else {
            this.setFocusOriginalVisitDueDate.emit(true);
        }
        this.riExchange.riInputElement.Enable(this.uiForm, 'SelConfirmationType');
        if (this.parentMode === 'Cancel') {
            this.disableOriginalVisitDueDate = true;
            this.originalVisitDueDate_onDeactivate();
            this.riExchange.riInputElement.Disable(this.uiForm, 'RealignPlanVisits');
            this.riExchange.riInputElement.Disable(this.uiForm, 'AppointmentConfirmed');
            this.setControlValue('CancelReinstatePlanVisit', true);
            this.cancelReinstatePlanVisit_OnClick();
        }
    };
    PlanVisitMaintenanceComponent.prototype.saveRecord = function () {
        var _this = this;
        var searchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        searchParams.set(this.serviceConstants.Action, '2');
        var checkBoxList = ['AppointmentConfirmed', 'VisitDurationExists', 'DisplayLevelInd', 'CancelReinstatePlanVisit',
            'ProdReplacement', 'ExcludeFromRouting', 'HardSlotInd', 'CICustRefReq', 'RealignPlanVisits'];
        var saveControls = [
            'RealignPlanVisits', 'CancelReinstatePlanVisit', 'ActualVisitTypeCode', 'OriginalValue', 'PlanVisitUserCode', 'RemovalQuantity', 'PlanVisitSeqNo', 'SpecialInstructions', 'BranchServiceAreaCodeSC', 'EmployeeCode', 'CICustomerRef',
            'LinkedCICustomerRef', 'PlanVisitRowID', 'ContractNumber', 'PremiseNumber', 'ProductCode', 'BusinessCode', 'BranchNumber', 'BranchServiceAreaCode', 'VisitTypeCode', 'PlannedVisitDate', 'ActualVisitDate', 'ActualQuantity',
            'PlanQuantity', 'PlanRemQuantity', 'PlanVisitStatusCode', 'AppointmentConfirmedReason', 'VisitStatusReasonCode', 'DisplayLevelInd', 'ProdReplacement', 'VisitDurationExists', 'OriginalVisitDueDate', 'AppointmentConfirmed', 'HardSlotInd',
            'OriginalVisitDuration', 'PlannedVisitDuration', 'ActualVisitDuration', 'VisitDurationDefault', 'ServiceVisitText', 'ServicePlanNumber', 'ProcessedDateTime', 'VisitNarrativeCode', 'VisitNarrativeDesc', 'ServiceCoverNumber', 'ServiceCoverItemNumber',
            'ItemDescription', 'PremiseLocationNumber', 'PremiseLocationDesc', 'ProductComponentRemoved', 'ProductComponentRemDesc', 'ProductComponentCode', 'ProductComponentDesc', 'InvoiceUnitValue', 'AdditionalChargeValue', 'ClientReference', 'EstimatedDuration',
            'RoutingVisitStartTime', 'VisitNotes', 'ExcludeFromRouting', 'RoutingExclusionReason', 'PlannerStatus', 'ConfirmationType', 'StaticVisitDate', 'TelesalesOrderNumber', 'TelesalesOrderLineNumber', 'CISLAStartDate', 'CISLAStartTime'];
        var bodyParams = {};
        for (var i = 0; i < saveControls.length; i++) {
            if (checkBoxList.indexOf(saveControls[i]) > -1) {
                bodyParams[saveControls[i]] = this.utils.convertCheckboxValueToRequestValue(this.getControlValue(saveControls[i]));
            }
            else if (saveControls[i] === 'PlanVisitRowID') {
                bodyParams['PlanVisitROWID'] = this.getControlValue('PlanVisitRowID');
            }
            else if (saveControls[i] === 'OriginalValue' || saveControls[i] === 'AdditionalChargeValue' || saveControls[i] === 'InvoiceUnitValue') {
                bodyParams[saveControls[i]] = this.utils.CCurToNum(this.getControlValue(saveControls[i]));
            }
            else if (saveControls[i] === 'RoutingVisitStartTime' || saveControls[i] === 'CISLAStartTime') {
                bodyParams[saveControls[i]] = this.utils.hmsToSeconds(this.getControlValue(saveControls[i]));
            }
            else if (saveControls[i] === 'OriginalVisitDueDate') {
                bodyParams[saveControls[i]] = this.utils.formatDate(this.OriginalVisitDueDate);
            }
            else {
                bodyParams[saveControls[i]] = this.getControlValue(saveControls[i]);
            }
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams, bodyParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.messageModal.show(data, true);
                return;
            }
            _this.routeAwayGlobals.setSaveEnabledFlag(false);
            _this.location.back();
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    PlanVisitMaintenanceComponent.prototype.promptSave = function (e) {
        this.saveRecord();
    };
    PlanVisitMaintenanceComponent.prototype.onAbandonClick = function () {
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        this.location.back();
    };
    PlanVisitMaintenanceComponent.prototype.cmdTelesalesOrder_onclick = function () {
    };
    PlanVisitMaintenanceComponent.prototype.cmdTelesalesOrderLine_onclick = function () {
    };
    PlanVisitMaintenanceComponent.prototype.onAppReasonChange = function () {
        this.setControlValue('AppointmentConfirmedReason', this.getControlValue('AppointmentConfirmedReason').toUpperCase());
    };
    PlanVisitMaintenanceComponent.prototype.canDeactivate = function () {
        return this.routeAwayComponent.canDeactivate();
    };
    PlanVisitMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAPlanVisitMaintenance.html'
                },] },
    ];
    PlanVisitMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    PlanVisitMaintenanceComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return PlanVisitMaintenanceComponent;
}(BaseComponent));
