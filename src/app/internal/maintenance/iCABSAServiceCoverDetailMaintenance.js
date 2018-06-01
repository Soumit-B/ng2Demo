var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, Injector, ViewChild, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PremiseSearchComponent } from './../../internal/search/iCABSAPremiseSearch';
import { ContractSearchComponent } from './../../internal/search/iCABSAContractSearch';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
import { ServiceCoverSearchComponent } from './../../internal/search/iCABSAServiceCoverSearch';
import { RiMaintenance, MntConst } from './../../../shared/services/riMaintenancehelper';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ScreenNotReadyComponent } from '../../../shared/components/screenNotReady';
export var ServiceCoverDetailMaintenanceComponent = (function (_super) {
    __extends(ServiceCoverDetailMaintenanceComponent, _super);
    function ServiceCoverDetailMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.ReinstateInd = true;
        this.setFocusReinstateInd = new EventEmitter();
        this.setFocusDetailDeleteDate = new EventEmitter();
        this.setFocusLostBusinessCode = new EventEmitter();
        this.setFocusServiceDetailQty = new EventEmitter();
        this.setFocusDetailCommenceDate = new EventEmitter();
        this.promptTitle = MessageConstant.Message.ConfirmTitle;
        this.promptContent = MessageConstant.Message.ConfirmRecord;
        this.SCEnableProductDetailQty = 'False';
        this.SCEnableDetailLocations = 'False';
        this.visibleServiceDetailQty = true;
        this.displayReinstateInd = false;
        this.disableDetailCommenceDate = false;
        this.disableDetailDeleteDate = false;
        this.visibleLostBusiness = false;
        this.visibleLostBusinessDetail = false;
        this.visibleContractNumberSelectionEllipsis = false;
        this.visiblePremiseNumberSelectionEllipsis = false;
        this.visibleProductCodeSelectionEllipsis = false;
        this.visibleProductDetailSelectionEllipsis = false;
        this.screenNotReadyComponent = ScreenNotReadyComponent;
        this.controls = [
            { name: 'ContractNumber', readonly: true, disabled: true, required: true },
            { name: 'ContractName', readonly: false, disabled: true, required: true },
            { name: 'PremiseNumber', readonly: false, disabled: true, required: true },
            { name: 'PremiseName', readonly: false, disabled: true, required: true },
            { name: 'ProductCode', readonly: false, disabled: true, required: true },
            { name: 'ProductDesc', readonly: false, disabled: true, required: true },
            { name: 'ProductDetailCode', readonly: false, disabled: false, required: true },
            { name: 'ProductDetailDesc', readonly: false, disabled: false, required: true },
            { name: 'DetailCommenceDate', readonly: false, disabled: false, required: true },
            { name: 'DetailDeleteDate', readonly: false, disabled: false, required: false },
            { name: 'ReinstateInd', type: MntConst.eTypeCheckBox, readonly: false, disabled: false, required: false },
            { name: 'DetailReinstateDate', readonly: false, disabled: false, required: false },
            { name: 'ServiceDetailQty', readonly: false, disabled: false, required: false },
            { name: 'ServiceAnnualValue', readonly: false, disabled: false, required: false },
            { name: 'AnnualValueChange', readonly: false, disabled: false, required: false },
            { name: 'LostBusinessCode', readonly: false, disabled: false, required: false },
            { name: 'LostBusinessDesc', readonly: false, disabled: false, required: false },
            { name: 'LostBusinessDetailCode', readonly: false, disabled: false, required: false },
            { name: 'LostBusinessDetailDesc', readonly: false, disabled: false, required: false },
            { name: 'ServiceSalesEmployee', readonly: false, disabled: false, required: true },
            { name: 'EmployeeSurname', readonly: false, disabled: false, required: false },
            { name: 'LostBusinessRequestNumber', readonly: false, disabled: false, required: false },
            { name: 'ServiceBranchNumber', readonly: false, disabled: false, required: false },
            { name: 'ServiceCoverRowID', readonly: false, disabled: false, required: false },
            { name: 'LocationEnabled', type: MntConst.eTypeCheckBox, readonly: false, disabled: false, required: false },
            { name: 'ServiceCoverDetailROWID', readonly: false, disabled: false, required: false },
            { name: 'Pending', readonly: false, disabled: false, required: false }
        ];
        this.xhrParams = {
            operation: 'Application/iCABSAServiceCoverDetailMaintenance',
            module: 'contract-admin',
            method: 'contract-management/maintenance'
        };
        this.ellipsis = {
            contractNumberEllipsis: {
                disabled: false,
                showCloseButton: true,
                showHeader: true,
                childparams: {
                    'parentMode': 'LookUp'
                },
                component: ContractSearchComponent
            },
            premiseNumberEllipsis: {
                disabled: false,
                showCloseButton: true,
                showHeader: true,
                childparams: {
                    'parentMode': 'LookUp',
                    'ContractNumber': '',
                    'ContractName': ''
                },
                component: PremiseSearchComponent
            },
            ProductCodeEllipsis: {
                disabled: false,
                showCloseButton: true,
                showHeader: true,
                childparams: {
                    'parentMode': 'LookUp',
                    'ContractNumber': '',
                    'ContractName': '',
                    'PremiseNumber': '',
                    'PremiseName': ''
                },
                component: ServiceCoverSearchComponent
            },
            employeeSearcEllipsis: {
                disabled: false,
                showCloseButton: true,
                showHeader: true,
                childparams: {
                    'parentMode': 'LookUp-ServiceCoverCommissionEmployee'
                },
                component: EmployeeSearchComponent
            }
        };
        this.parent = this;
        this.pageId = PageIdentifier.ICABSASERVICECOVERDETAILMAINTENANCE;
        this.xhr = this.httpService;
        this.riMaintenance = new RiMaintenance(this.logger, this.xhr, this.LookUp, this.utils, this.serviceConstants);
    }
    ;
    ;
    ServiceCoverDetailMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Contract Service Detail Maintenance';
        this.window_onload();
        this.setErrorCallback(this);
        this.setMessageCallback(this);
    };
    ServiceCoverDetailMaintenanceComponent.prototype.getSysCharDtetails = function () {
        var _this = this;
        var sysCharList = [
            this.sysCharConstants.SystemCharEnableProductDetailQty,
            this.sysCharConstants.SystemCharEnableLocations
        ];
        var sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe(function (data) {
            var record = data.records;
            _this.pageParams.vSCEnableProductDetailQty = record[0]['Required'];
            if (_this.pageParams.vSCEnableProductDetailQty === true)
                _this.SCEnableProductDetailQty = 'True';
            if (_this.SCEnableProductDetailQty === 'False')
                _this.visibleServiceDetailQty = false;
            _this.pageParams.vEnableDetailLocations = record[1]['Logical'];
            if (_this.pageParams.vSCEnableProductDetailQty)
                _this.SCEnableDetailLocations = 'True';
        });
    };
    ServiceCoverDetailMaintenanceComponent.prototype.postRequest = function () {
        var _this = this;
        var searchPost;
        searchPost = this.getURLSearchParamObject();
        searchPost.set(this.serviceConstants.Action, '6');
        var postParams = {};
        postParams.Function = 'GetServiceCoverDetails';
        postParams.ContractNumber = this.getControlValue('ContractNumber');
        postParams.PremiseNumber = this.getControlValue('PremiseNumber');
        postParams.ProductCode = this.getControlValue('ProductCode');
        if (this.getControlValue('ServiceCoverRowID'))
            postParams.ServiceCoverRowID = this.getControlValue('ServiceCoverRowID');
        else
            postParams.ServiceCoverRowID = '';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, searchPost, postParams)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                    _this.errorService.emitError(e['oResponse']);
                }
                else if (e['errorMessage']) {
                    _this.errorService.emitError(e);
                }
                else {
                    if (e.ServiceCoverRowID) {
                        _this.setControlValue('ServiceAnnualValue', e.ServiceAnnualValue);
                        _this.setControlValue('ServiceCoverRowID', e.ServiceCoverRowID);
                        _this.setControlValue('ServiceSalesEmployee', e.ServiceSalesEmployee);
                        _this.setControlValue('EmployeeSurname', e.EmployeeSurname);
                    }
                    else {
                        _this.ProductCodeEllipsis.openModal();
                    }
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServiceCoverDetailMaintenanceComponent.prototype.postRequestDetailCommenceDate = function () {
        var _this = this;
        var searchPost;
        searchPost = this.getURLSearchParamObject();
        searchPost.set(this.serviceConstants.Action, '6');
        var postParams = {};
        postParams.Function = 'GetProductCommence';
        postParams.ServiceCoverRowID = this.getControlValue('ServiceCoverRowID');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, searchPost, postParams)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                    _this.errorService.emitError(e);
                }
                else if (e['errorMessage']) {
                    _this.errorService.emitError(e);
                }
                else {
                    _this.setControlValue('DetailCommenceDate', e.DetailCommenceDate);
                    _this.setDetailCommenceDate();
                    if (_this.SCEnableProductDetailQty === 'True')
                        _this.setFocusServiceDetailQty.emit(true);
                    else
                        _this.setFocusDetailCommenceDate.emit(true);
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServiceCoverDetailMaintenanceComponent.prototype.riMaintenance_Search = function () {
        if (!this.getControlValue('ContractNumber')) {
            this.visibleContractNumberSelectionEllipsis = true;
            this.parentMode = 'LookUp';
        }
        if (!this.getControlValue('ContractNumber') && !this.getControlValue('PremiseNumber')) {
            this.visiblePremiseNumberSelectionEllipsis = true;
            this.parentMode = 'LookUp';
        }
        if (!this.getControlValue('ContractNumber') && !this.getControlValue('PremiseNumber') && !this.getControlValue('ProductCode')) {
            this.visibleProductCodeSelectionEllipsis = true;
            this.ProductCodeSelection();
        }
        if (this.getControlValue('ContractNumber') !== null && this.getControlValue('PremiseNumber') !== null && this.getControlValue('ProductCode') !== null) {
            this.visibleProductDetailSelectionEllipsis = true;
        }
    };
    ServiceCoverDetailMaintenanceComponent.prototype.ProductCodeSelection = function () {
        this.setControlValue('ServiceCoverRowID', this.riExchange.getParentHTMLValue('ServiceCoverRowID'));
    };
    ServiceCoverDetailMaintenanceComponent.prototype.lostBusinessCodeOnkeydown = function () {
        this.LostBusinessLookUp();
    };
    ServiceCoverDetailMaintenanceComponent.prototype.LostBusinessDetailCodeOnkeydown = function () {
        this.LostBusinessDetailLookUp();
    };
    ServiceCoverDetailMaintenanceComponent.prototype.serviceSalesEmployeeOnkeydown = function () {
        this.navigate('LookUp-ServiceCoverCommissionEmployee', 'Business/iCABSBEmployeeSearch');
    };
    ServiceCoverDetailMaintenanceComponent.prototype.ProductDetailCodeOnchange = function () {
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd)
            this.postRequestDetailCommenceDate();
    };
    ServiceCoverDetailMaintenanceComponent.prototype.productCodeOnchange = function () {
        if (this.getControlValue('ServiceCoverRowID') === '') {
            this.GetServiceCoverDetails();
            if (this.getControlValue('ServiceCoverRowID') === '')
                this.ProductCodeSelection();
        }
    };
    ServiceCoverDetailMaintenanceComponent.prototype.GetServiceCoverDetails = function () {
        this.riMaintenance.CBORequestClear();
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetServiceCoverDetails';
        this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.CBORequestAdd('ContractNumber');
        this.riMaintenance.CBORequestAdd('PremiseNumber');
        this.riMaintenance.CBORequestAdd('ProductCode');
        if (this.getControlValue('ServiceCoverRowID') !== '')
            this.riMaintenance.CBORequestAdd('ServiceCoverRowID');
        this.riMaintenance.CBORequestExecute(this, function (data) {
        });
    };
    ServiceCoverDetailMaintenanceComponent.prototype.callriMaintenance = function () {
        this.riMaintenance.BusinessObject = 'riControl.p';
        this.riMaintenance.CustomBusinessObject = 'iCABSServiceCoverDetailEntry.p';
        this.riMaintenance.CustomBusinessObjectSelect = true;
        this.riMaintenance.CustomBusinessObjectConfirm = false;
        this.riMaintenance.CustomBusinessObjectInsert = true;
        this.riMaintenance.CustomBusinessObjectUpdate = true;
        this.riMaintenance.CustomBusinessObjectDelete = false;
        this.riMaintenance.FunctionSnapShot = false;
        this.riMaintenance.FunctionDelete = false;
        if (this.Pending)
            this.riMaintenance.FunctionAdd = false;
        if (this.parentMode === 'Contact-View') {
            this.riMaintenance.FunctionAdd = false;
            this.riMaintenance.FunctionSearch = false;
            this.riMaintenance.FunctionSelect = false;
            this.riMaintenance.FunctionUpdate = false;
        }
        this.riMaintenance.AddTable('ServiceCoverDetail');
        switch (this.parentMode) {
            case 'Search':
            case 'SearchAdd':
            case 'ServiceCover':
                this.riMaintenance.AddTableKeyCS('BusinessCode', MntConst.eTypeCode);
                this.riMaintenance.AddTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
                this.riMaintenance.AddTableKey('PremiseNumber', MntConst.eTypeInteger, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
                this.riMaintenance.AddTableKey('ProductCode', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
                this.riMaintenance.AddTableKeyAlignment('ProductCode', MntConst.eAlignmentRight);
                break;
            case 'Contact':
            case 'Contact-View':
                this.riMaintenance.AddTableKeyCS('BusinessCode', MntConst.eTypeCode);
                this.riMaintenance.AddTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
                this.riMaintenance.AddTableKey('PremiseNumber', MntConst.eTypeInteger, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
                this.riMaintenance.AddTableKey('ProductCode', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
                this.riMaintenance.AddTableKeyAlignment('ProductCode', MntConst.eAlignmentRight);
                this.riMaintenance.AddTableKey('ServiceCoverDetailROWID', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
                break;
            default:
                this.riMaintenance.AddTableKeyCS('BusinessCode', MntConst.eTypeCode);
                this.riMaintenance.AddTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
                this.riMaintenance.AddTableKey('PremiseNumber', MntConst.eTypeInteger, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
                this.riMaintenance.AddTableKey('ProductCode', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
                this.riMaintenance.AddTableKeyAlignment('ProductCode', MntConst.eAlignmentRight);
        }
        this.riMaintenance.AddTableKey('ServiceCoverRowID', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
        this.riMaintenance.AddTableKey('Pending', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
        this.riMaintenance.AddTableKey('ProductDetailCode', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
        this.riMaintenance.AddTableField('ServiceDetailQty', MntConst.eTypeInteger, MntConst.eKeyOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('DetailCommenceDate', MntConst.eTypeDate, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('DetailDeleteDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableCommit(this, this.getTableData);
        this.riMaintenance.AddTable('*');
        this.riMaintenance.AddTableField('ReinstateInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('DetailReinstateDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('AnnualValueChange', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('ServiceAnnualValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('LostBusinessRequestNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('ServiceSalesEmployee', MntConst.eTypeCode, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('ServiceBranchNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateFixed, 'ReadOnly');
        this.riMaintenance.AddTableField('ServiceCoverRowID', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateFixed, 'Optional');
        this.riMaintenance.AddTableFieldPostData('ServiceCoverRowID', false);
        ;
        this.riMaintenance.AddTableField('LostBusinessCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Lookup');
        this.riMaintenance.AddTableField('LostBusinessDetailCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Lookup');
        this.riMaintenance.AddTableField('LocationEnabled', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableCommit(this);
    };
    ServiceCoverDetailMaintenanceComponent.prototype.LostBusinessLookUp = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'LostBusinessLang',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'LostBusinessCode': this.getControlValue('LostBusinessCode'),
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': ['LostBusinessDesc']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var LostBusiness = data[0][0];
            if (LostBusiness) {
                _this.setControlValue('LostBusinessDesc', LostBusiness.LostBusinessDesc);
                _this.postRequestDetailCommenceDate();
            }
        });
    };
    ServiceCoverDetailMaintenanceComponent.prototype.LostBusinessDetailLookUp = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'LostBusinessDetailLang',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'LostBusinessCode': this.getControlValue('LostBusinessCode'),
                    'LostBusinessDetailCode': this.getControlValue('LostBusinessDetailCode'),
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': ['LostBusinessDetailDesc']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var LostBusinessDetail = data[0][0];
            if (LostBusinessDetail) {
                _this.setControlValue('LostBusinessDetailDesc', LostBusinessDetail.LostBusinessDetailDesc);
                _this.postRequestDetailCommenceDate();
            }
        });
    };
    ServiceCoverDetailMaintenanceComponent.prototype.getTableData = function (data) {
        this.dtDetailCommenceDate = this.utils.convertDate(data.DetailCommenceDate);
        this.productDetailCodeValue = data.ProductDetailCode;
        this.setControlValue('ProductDetailCode', data.ProductDetailCode);
        if (data.DetailDeleteDate !== '') {
            this.dtDetailDeleteDate = this.utils.convertDate(data.DetailDeleteDate);
            this.HideShowFields();
            if (this.getControlValue('ReinstateInd')) {
                this.dtDetailReinstateDate = this.utils.convertDate(data.DetailDeleteDate);
            }
        }
    };
    ServiceCoverDetailMaintenanceComponent.prototype.SetCurrentContractType = function () {
        this.attributes.CurrentContractType = this.riExchange.setCurrentContractType();
    };
    ServiceCoverDetailMaintenanceComponent.prototype.HideShowFields = function () {
        this.setControlValue('DetailReinstateDate', '');
        if (this.dtDetailCommenceDate && this.dtDetailDeleteDate) {
            this.displayReinstateInd = true;
        }
    };
    ServiceCoverDetailMaintenanceComponent.prototype.AnnualValueChange_onchange = function () {
        if (!this.getControlValue('AnnualValueChange')) {
            this.setControlValue('AnnualValueChange', '0.00');
        }
        this.setControlValue('ServiceAnnualValue', (parseFloat(this.getControlValue('ServiceAnnualValue'))
            + parseFloat(this.getControlValue('AnnualValueChange'))));
        if (parseInt(this.getControlValue('AnnualValueChange'), 10) < 0) {
            this.visibleLostBusiness = true;
            this.visibleLostBusinessDetail = true;
            this.riMaintenance.SetRequiredStatus('LostBusinessCode', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LostBusinessDetailCode', true);
            this.setFocusLostBusinessCode.emit(true);
        }
        else {
            this.visibleLostBusiness = false;
            this.visibleLostBusinessDetail = false;
            this.riMaintenance.SetRequiredStatus('LostBusinessCode', false);
            this.riMaintenance.SetRequiredStatus('LostBusinessDetailCode', false);
        }
    };
    ServiceCoverDetailMaintenanceComponent.prototype.ReinstateInd_onclick = function () {
        if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            if (this.getControlValue('ReinstateInd')) {
                this.dtDetailReinstateDate = this.dtDetailDeleteDate;
                this.riExchange.riInputElement.Enable(this.uiForm, 'DetailReinstateDate');
                this.riMaintenance.CBORequestClear();
                this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetServiceAnnualValue';
                this.riMaintenance.CBORequestAdd('ServiceCoverRowID');
                this.riMaintenance.CBORequestAdd('DetailReinstateDate');
                this.riMaintenance.CBORequestExecute(this, function (data) {
                });
                this.SavedServiceAnnualValue = this.getControlValue('ServiceAnnualValue');
            }
            else {
                this.setControlValue('DetailReinstateDate', '');
                this.disableControl('DetailReinstateDate', true);
                this.riMaintenance.SetRequiredStatus('DetailReinstateDate', false);
            }
        }
    };
    ServiceCoverDetailMaintenanceComponent.prototype.riExchange_CBORequest = function () {
        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'ServiceDetailQty') && !(this.getControlValue('DetailDeleteDate')))
            this.vbRunDetailLocations = true;
        else if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'DetailDeleteDate') && !(this.getControlValue('DetailDeleteDate')))
            this.vbRunDetailLocations = false;
        else if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'ReinstateInd'))
            this.vbRunDetailLocations = true;
        if ((this.riExchange.riInputElement.HasChanged(this.uiForm, 'DetailCommenceDate') && !(this.getControlValue('DetailCommenceDate'))) ||
            (this.riExchange.riInputElement.HasChanged(this.uiForm, 'DetailDeleteDate') && !(this.getControlValue('DetailDeleteDate'))) ||
            (this.riExchange.riInputElement.HasChanged(this.uiForm, 'DetailReinstateDate') && !(this.getControlValue('DetailReinstateDate')))) {
            this.riMaintenance.CBORequestClear();
            this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetServiceAnnualValue';
            this.riMaintenance.CBORequestAdd('ServiceCoverRowID');
            if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'DetailCommenceDate'))
                this.riMaintenance.CBORequestAdd('DetailCommenceDate');
            if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'DetailDeleteDate'))
                this.riMaintenance.CBORequestAdd('DetailDeleteDate');
            if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'DetailReinstateDate'))
                this.riMaintenance.CBORequestAdd('DetailReinstateDate');
            this.riMaintenance.CBORequestExecute(this, function (data) {
            });
            this.SavedServiceAnnualValue = this.getControlValue('ServiceAnnualValue');
        }
    };
    ServiceCoverDetailMaintenanceComponent.prototype.DisableFields = function () {
        this.disableDetailCommenceDate = true;
        if (!this.getControlValue('DetailDeleteDate')) {
            this.disableDetailDeleteDate = true;
            this.setFocusReinstateInd.emit(true);
        }
        else {
            this.disableDetailDeleteDate = false;
            this.setFocusDetailDeleteDate.emit(true);
        }
    };
    ServiceCoverDetailMaintenanceComponent.prototype.riMaintenance_BeforeSelect = function () {
        if (this.parentMode === 'Contact') {
            this.getControlValue('PremiseNumber');
            this.getControlValue('PremiseName');
            this.getControlValue('ProductCode');
            this.getControlValue('ProductDesc');
            this.getControlValue('ServiceCoverRowID');
            this.getControlValue('LostBusinessRequestNumber');
        }
    };
    ServiceCoverDetailMaintenanceComponent.prototype.riMaintenance_BeforeFetch = function () {
        if ((this.getControlValue('ServiceCoverRowID') === ''))
            this.GetServiceCoverDetails();
        else
            this.riMaintenance.CustomBusinessObjectAdditionalPostData = this.getControlValue('ServiceCoverRowID') + this.Pending;
    };
    ServiceCoverDetailMaintenanceComponent.prototype.riMaintenance_AfterFetch = function () {
        this.riMaintenance.FunctionUpdate = true;
        this.HideShowFields();
        this.SavedServiceAnnualValue = this.getControlValue('ServiceAnnualValue');
    };
    ServiceCoverDetailMaintenanceComponent.prototype.riMaintenance_BeforeAdd = function () {
        this.GetServiceCoverDetails();
        if (this.getControlValue('LocationEnabled'))
            this.riMaintenance.SetRequiredStatus('ServiceDetailQty', true);
        this.disableControl('DetailDeleteDate', true);
        this.SavedServiceAnnualValue = this.getControlValue('ServiceAnnualValue');
    };
    ServiceCoverDetailMaintenanceComponent.prototype.riMaintenance_BeforeUpdate = function () {
        this.DisableFields();
    };
    ServiceCoverDetailMaintenanceComponent.prototype.riMaintenance_BeforeSave = function () {
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = this.getControlValue('ServiceCoverRowID') + this.Pending;
    };
    ServiceCoverDetailMaintenanceComponent.prototype.promptSave = function (event) {
        if (this.riExchange.validateForm(this.uiForm)) {
            this.promptModal.show();
        }
    };
    ServiceCoverDetailMaintenanceComponent.prototype.riMaintenance_AfterSave = function () {
        if (!this.DeleteDateDisplay)
            this.setControlValue('DetailDeleteDate', '');
        else
            this.setControlValue('DetailDeleteDate', this.DeleteDateDisplay);
        this.setControlValue('DetailCommenceDate', this.dtDetailCommenceDate.getDate() + '/' + (this.dtDetailCommenceDate.getMonth() + 1) + '/' + this.dtDetailCommenceDate.getFullYear());
        this.setControlValue('DetailReinstateDate', this.DeleteReinstateDateDisplay);
        var fields = "ContractNumber, PremiseNumber , ProductCode , ProductDetailCode,ReinstateInd,\n        ProductDetailDesc ,DetailCommenceDate , DetailDeleteDate ,  DetailReinstateDate , ServiceAnnualValue , AnnualValueChange , \n        LostBusinessCode , LostBusinessDesc , LostBusinessDetailCode , LostBusinessDetailDesc , ServiceDetailQty , ServiceSalesEmployee , EmployeeSurname,\n        LostBusinessRequestNumber , ServiceBranchNumber , ServiceCoverRowID , LocationEnabled";
        fields = fields.replace(/\\t/g, '').replace(/\r?\n|\r/g, '').replace(/ /g, '');
        var fieldsArr = fields.split(',');
        this.riMaintenance.clear();
        for (var i = 0; i < fieldsArr.length; i++) {
            var id = fieldsArr[i];
            var dataType = this.riMaintenance.getControlType(this.controls, id, 'type');
            var value = this.riExchange.riInputElement.GetValue(this.uiForm, id);
            this.riMaintenance.PostDataAdd(id, value, dataType);
        }
        this.riMaintenance.Execute(this, function (data) {
            if (data.hasOwnProperty('errorMessage')) {
                if (data.errorMessage.trim() !== '') {
                    this.messageModal.show({ msg: data.errorMessage }, false);
                }
            }
            else {
                if (this.Pending) {
                    this.riMaintenance.FunctionUpdate = false;
                }
                else {
                    this.HideShowFields();
                    this.DisableFields();
                }
                if (this.getControlValue('LocationEnabled'))
                    this.navigate('ProductDetail', 'grid/application/ServiceCoverDetailLocationEntryGridComponent');
            }
        }, 'POST', this.dataPostModeAction);
    };
    ServiceCoverDetailMaintenanceComponent.prototype.window_onload = function () {
        this.getSysCharDtetails();
        this.SetCurrentContractType();
        this.Pending = this.riExchange.URLParameterContains('Pending');
        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
        this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.setControlValue('ServiceSalesEmployee', this.riExchange.getParentHTMLValue('ServiceSalesEmployee'));
        this.setControlValue('ProductDetailCode', this.riExchange.getParentHTMLValue('ProductDetailCode'));
        this.setControlValue('ProductDetailDesc', this.riExchange.getParentHTMLValue('ProductDetailDesc'));
        this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
        this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
        this.setControlValue('LostBusinessCode', this.riExchange.getParentHTMLValue('LostBusinessCode'));
        this.setControlValue('LostBusinessDesc', this.riExchange.getParentHTMLValue('LostBusinessDesc'));
        this.setControlValue('LostBusinessDetailCode', this.riExchange.getParentHTMLValue('LostBusinessDetailCode'));
        this.setControlValue('LostBusinessDetailDesc', this.riExchange.getParentHTMLValue('LostBusinessDetailDesc'));
        this.setControlValue('ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
        this.setControlValue('ServiceDetailQty', '0');
        if (this.parentMode === 'Search' || this.parentMode === 'SearchAdd') {
            this.setControlValue('ServiceCoverRowID', this.riExchange.getParentAttributeValue('ProductCode'));
        }
        if (this.parentMode === 'ServiceCover')
            this.setControlValue('ServiceCoverRowID', this.riExchange.getParentHTMLValue('ServiceCoverRowID'));
        this.setControlValue('ServiceCoverRowID', this.riExchange.getParentHTMLValue('ServiceCoverRowID'));
        this.setControlValue('Pending', 'False');
        this.riMaintenance_Search();
        this.AnnualValueChange_onchange();
        if (this.parentMode) {
            switch (this.parentMode) {
                case 'SearchAdd':
                case 'ServiceCover':
                    this.postRequest();
                    this.riMaintenance.AddMode();
                    this.setControlValue('ProductDetailCode', this.riExchange.getParentHTMLValue('ProductDetailCode'));
                    break;
                case 'Contact':
                    this.riMaintenance.SelectMode();
                    this.postRequest();
                    this.callriMaintenance();
                    this.postRequestDetailCommenceDate();
                    break;
                case 'Contact-View':
                    this.postRequest();
                    this.riMaintenance.FetchRecord();
                    this.callriMaintenance();
                    this.riMaintenance.FunctionUpdate = false;
                    break;
                case 'LookUp':
                    this.setControlValue('ServiceAnnualValue', '');
                    this.disableControl('ContractNumber', false);
                    this.disableControl('PremiseNumber', false);
                    this.disableControl('ProductCode', false);
                    break;
                default:
                    this.postRequest();
                    this.riMaintenance.UpdateMode();
                    if (this.riMaintenance.RecordSelected(false)) {
                        this.riMaintenance.FetchRecord();
                    }
                    this.callriMaintenance();
            }
        }
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.disableControl('ServiceAnnualValue', true);
            this.riMaintenance.execMode(MntConst.eModeAdd, [this]);
        }
        else if ((this.riMaintenance.CurrentMode === MntConst.eModeUpdate)) {
            this.callriMaintenance();
            this.disableControl('ProductDetailCode', true);
            this.disableControl('ProductDetailDesc', true);
            this.postRequestDetailCommenceDate();
            this.riMaintenance.execMode(MntConst.eModeUpdate, [this]);
        }
    };
    ServiceCoverDetailMaintenanceComponent.prototype.saveData = function () {
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.riMaintenance.CurrentMode = MntConst.eModeSaveAdd;
            this.dataPostModeAction = 1;
        }
        else {
            this.riMaintenance.CurrentMode = MntConst.eModeSaveUpdate;
            this.dataPostModeAction = 2;
        }
        this.riMaintenance.execMode(this.riMaintenance.CurrentMode, [this]);
        this.riMaintenance_AfterSave();
    };
    ServiceCoverDetailMaintenanceComponent.prototype.LookUpProductDetailDesc = function () {
        this.doLookupformData();
        this.doLookupProductDetail();
    };
    ServiceCoverDetailMaintenanceComponent.prototype.doLookupProductDetail = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'ProductDetail',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ProductDetailCode': this.getControlValue('ProductDetailCode')
                },
                'fields': ['ProductDetailDesc']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var ProductDetail = data[0][0];
            if (ProductDetail) {
                _this.setControlValue('ProductDetailDesc', ProductDetail.ProductDetailDesc);
                _this.postRequestDetailCommenceDate();
                if (_this.parentMode === 'LookUp') {
                    _this.riMaintenance.UpdateMode();
                    _this.setControlValue('LocationEnabled', 'yes');
                }
            }
        });
    };
    ServiceCoverDetailMaintenanceComponent.prototype.sendContractNumber = function () {
        this.ellipsis.premiseNumberEllipsis.childparams.ContractNumber = this.getControlValue('ContractNumber');
    };
    ServiceCoverDetailMaintenanceComponent.prototype.sendContractPremiseNumber = function () {
        this.ellipsis.ProductCodeEllipsis.childparams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.ProductCodeEllipsis.childparams.PremiseNumber = this.getControlValue('PremiseNumber');
    };
    ServiceCoverDetailMaintenanceComponent.prototype.doLookupformData = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber')
                },
                'fields': ['ContractName']
            },
            {
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber')
                },
                'fields': ['PremiseName']
            },
            {
                'table': 'Product',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ProductCode': this.getControlValue('ProductCode')
                },
                'fields': ['ProductDesc']
            },
            {
                'table': 'Employee',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'EmployeeCode': this.getControlValue('ServiceSalesEmployee')
                },
                'fields': ['EmployeeSurname']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var Contract = data[0][0];
            if (Contract) {
                _this.setControlValue('ContractName', Contract.ContractName);
                _this.ellipsis.premiseNumberEllipsis.childparams.ContractNumber = _this.getControlValue('ContractNumber');
                _this.ellipsis.premiseNumberEllipsis.childparams.ContractName = _this.getControlValue('ContractName');
            }
            var Premise = data[1][0];
            if (Premise) {
                _this.setControlValue('PremiseName', Premise.PremiseName);
                _this.ellipsis.ProductCodeEllipsis.childparams.ContractNumber = _this.getControlValue('ContractNumber');
                _this.ellipsis.ProductCodeEllipsis.childparams.ContractName = _this.getControlValue('ContractName');
                _this.ellipsis.ProductCodeEllipsis.childparams.PremiseNumber = _this.getControlValue('PremiseNumber');
                _this.ellipsis.ProductCodeEllipsis.childparams.PremiseName = _this.getControlValue('PremiseName');
            }
            var Product = data[2][0];
            if (Product) {
                _this.ellipsis.ProductCodeEllipsis.childparams['ProductCode'] = _this.getControlValue('ProductCode');
                _this.setControlValue('ProductDesc', Product.ProductDesc);
                _this.postRequest();
            }
            var Employee = data[3][0];
            if (Employee) {
                _this.setControlValue('EmployeeSurname', Employee.EmployeeSurname);
            }
        });
    };
    ServiceCoverDetailMaintenanceComponent.prototype.setDetailCommenceDate = function () {
        this.dtDetailCommenceDate = this.utils.convertDate(this.getControlValue('DetailCommenceDate'));
    };
    ServiceCoverDetailMaintenanceComponent.prototype.DetailDeleteDateValue = function (value) {
        if (value && value.value) {
            this.DeleteDateDisplay = value.value;
        }
    };
    ServiceCoverDetailMaintenanceComponent.prototype.DetailReinstateDateValue = function (value) {
        if (value && value.value) {
            this.DeleteReinstateDateDisplay = value.value;
        }
    };
    ServiceCoverDetailMaintenanceComponent.prototype.displayError = function (error, apiError) {
        this.errorService.emitError(error);
        if (apiError) {
        }
    };
    ServiceCoverDetailMaintenanceComponent.prototype.ngOnDestroy = function () {
        if (this.lookUpSubscription) {
            this.lookUpSubscription.unsubscribe();
        }
        _super.prototype.ngOnDestroy.call(this);
    };
    ServiceCoverDetailMaintenanceComponent.prototype.showErrorModal = function (data, param) {
        this.errorModal.show(data, true);
    };
    ;
    ServiceCoverDetailMaintenanceComponent.prototype.showMessageModal = function (data, param) {
        this.messageModal.show({ msg: data, title: 'Message' }, false);
    };
    ;
    ServiceCoverDetailMaintenanceComponent.prototype.onProductDetailCodeDataReceived = function (data) {
        this.messageModal.show({ msg: 'Record Saved Successfully' }, true);
    };
    ServiceCoverDetailMaintenanceComponent.prototype.onContractSearchDataReceived = function (data) {
        this.setControlValue('ContractNumber', data.ContractNumber);
        this.setControlValue('ContractName', data.ContractName);
        this.ellipsis.premiseNumberEllipsis.childparams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.premiseNumberEllipsis.childparams.ContractName = this.getControlValue('ContractName');
    };
    ServiceCoverDetailMaintenanceComponent.prototype.onPremiseSearchhDataReceived = function (data) {
        this.setControlValue('PremiseNumber', data.PremiseNumber);
        this.setControlValue('PremiseName', data.PremiseName);
        this.ellipsis.ProductCodeEllipsis.childparams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.ProductCodeEllipsis.childparams.ContractName = this.getControlValue('ContractName');
        this.ellipsis.ProductCodeEllipsis.childparams.PremiseNumber = this.getControlValue('PremiseNumber');
        this.ellipsis.ProductCodeEllipsis.childparams.PremiseName = this.getControlValue('PremiseName');
    };
    ServiceCoverDetailMaintenanceComponent.prototype.onProductCodeDataReceived = function (data) {
        this.setControlValue('ServiceCoverRowID', data.row.ttServiceCover);
        this.setControlValue('ProductCode', data.ProductCode);
        this.setControlValue('ProductDesc', data.ProductDesc);
    };
    ServiceCoverDetailMaintenanceComponent.prototype.onemployeeSearchDataReceived = function (data) {
        this.setControlValue('ServiceSalesEmployee', data.ServiceSalesEmployee);
        this.setControlValue('EmployeeSurname', data.EmployeeSurname);
    };
    ServiceCoverDetailMaintenanceComponent.prototype.clearForm = function () {
        this.setControlValue('AnnualValueChange', '0.00');
        this.setControlValue('LostBusinessCode', '');
        this.setControlValue('LostBusinessDesc', '');
        this.setControlValue('LostBusinessDetailCode', '');
        this.setControlValue('LostBusinessDetailDesc', '');
        this.setControlValue('DetailCommenceDate', '');
        this.dtDetailReinstateDate = null;
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.setControlValue('DetailDeleteDate', '');
            this.dtDetailCommenceDate = null;
            this.DeleteDateDisplay = '';
            this.dtDetailDeleteDate = null;
            this.setControlValue('ProductDetailCode', '');
            this.setControlValue('ProductDetailDesc', '');
            this.postRequest();
        }
    };
    ServiceCoverDetailMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAServiceCoverDetailMaintenance.html'
                },] },
    ];
    ServiceCoverDetailMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    ServiceCoverDetailMaintenanceComponent.propDecorators = {
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'contractSearch': [{ type: ViewChild, args: ['contractSearch',] },],
        'premiseSearch': [{ type: ViewChild, args: ['premiseSearch',] },],
        'ProductCodeEllipsis': [{ type: ViewChild, args: ['ProductCodeEllipsis',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return ServiceCoverDetailMaintenanceComponent;
}(BaseComponent));
