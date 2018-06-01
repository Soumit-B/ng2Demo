var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, Injector, ViewChild, ElementRef } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { AjaxConstant } from './../../../shared/constants/AjaxConstants';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { EmployeeSearchComponent } from '../../internal/search/iCABSBEmployeeSearch';
import { ProductSearchGridComponent } from '../../internal/search/iCABSBProductSearch';
import { ContractActionTypes } from '../../actions/contract';
import { PremiseLocationSearchComponent } from '../../internal/search/iCABSAPremiseLocationSearch.component';
export var ServiceCoverDisplayEntryComponent = (function (_super) {
    __extends(ServiceCoverDisplayEntryComponent, _super);
    function ServiceCoverDisplayEntryComponent(injector, el) {
        _super.call(this, injector);
        this.el = el;
        this.queryParams = {
            operation: 'Application/iCABSAServiceCoverDisplayEntry',
            module: 'contract-admin',
            method: 'contract-management/grid'
        };
        this.sheduleTypeDisabled = false;
        this.isEmployeeSearchEllipsisDisabled = false;
        this.inputParamsEmployeeSearch = { 'parentMode': 'LookUp-ServiceCoverCommissionEmployee' };
        this.inputParamsInstallationEmployeeSearch = { 'parentMode': 'LookUp-InstallationEmployee' };
        this.employeeSearchComponent = EmployeeSearchComponent;
        this.initialFormData = {};
        this.menuOptionsGroupscd = [{}];
        this.menuOptionsGroupsc = [{}];
        this.pageId = '';
        this.itemsPerPage = 10;
        this.currentPage = 1;
        this.maxColumn = 11;
        this.search = new URLSearchParams();
        this.autoOpen = '';
        this.autoOpenSearch = false;
        this.riGrid = {};
        this.showHeader = true;
        this.setFormFlag = {
            rotationalRuleOnChange: false,
            getPercentageValues: false,
            scheduleIDOonChange: false,
            branchServiceAreaCodeonChange: false,
            premiseLocationNumberOnChange: false,
            exchangesStartAfterDateSelectedValue: false,
            totalDisplayValues: false,
            displayValueOnChange: false
        };
        this.querySysChar = new URLSearchParams();
        this.currentContractType = '';
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.premiseLocationEllipsis = {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'showAddNew': false
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: PremiseLocationSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        };
        this.contractSearchParams = {
            'parentMode': 'ContractSearch',
            'currentContractType': 'C',
            'currentContractTypeURLParameter': '<contract>',
            'showAddNew': true
        };
        this.additionalDataPost = [];
        this.searchModalRoute = '';
        this.searchPageRoute = '';
        this.showCloseButton = true;
        this.contractSearchComponent = ContractSearchComponent;
        this.componentRows = [];
        this.disableButtons = { delete: false, update: false };
        this.productSearchComponent = ProductSearchGridComponent;
        this.productSearchParams = { 'parentMode': 'DisplayEntry' };
        this.alternativeProductSearchParams = { 'parentMode': 'AlternateDisplayEntry' };
        this.ComponentColumnList = [
            'ComponentTypeCode',
            'ComponentTypeDesc',
            'ProductComponentCode',
            'AlternateProductCode',
            'ProductComponentDesc',
            'AttributeLabelA',
            'AttributeValueA',
            'AttributeLabelB',
            'AttributeValueB',
            'ComponentQuantity',
            'ProductRange',
            'ProductRangeDesc',
            'SequenceNumber',
            'RotationalInterval',
            'RotationalRule',
            'AttributeCodeA',
            'AttributeCodeB'
        ];
        this.minRows = 7;
        this.rowCount = 0;
        this.currDate = null;
        this.currDate2 = null;
        this.currDate3 = null;
        this.fieldRequired = {
            ServiceSalesEmployee: true,
            InstallByBranchInd: false,
            WEDValue: false,
            ServiceCoverItemCommenceDate: true,
            DisplayQty: false,
            EffectiveDate: false,
            InstallationEmployeeCode: false,
            ScheduleID: false,
            ExchangesStartAfterDate: false,
            ScheduleQty: false,
            RenegOldContract: false,
            RenegOldPremise: false,
            RenegOldValue: false
        };
        this.fieldHidden = {
            WEDValue: true,
            divComp: true,
            tdExpectedTotals: true,
            tdGridControl: true,
            EffectiveDate: true,
            tdPopulate: false,
            DisplayQty: false,
            InitialComponentsDate: true,
            MaterialsValue: false,
            LabourValue: false,
            ReplacementValue: false,
            trInstallationEmployee: true,
            trInstallations: true,
            percentDisplay: false,
            CurrentWeek: true,
            ScheduleID: true,
            ScheduleDetails: true,
            ScheduleName: true,
            ScheduleQty: true,
            ExchangesStartAfterDate: true,
            BranchServiceAreaCode: true,
            ExchangesGenUpTo: true,
            RenegOldContract: true,
            RenegOldValue: true,
            RenegOldPremise: true,
            trComponentRange: true,
            customUpdate: true,
            MaterialsCost: false,
            LabourCost: true,
            ScheduleEmployeeCode: true,
            chkRenegContract: true
        };
        this.functionMode = {
            snapShot: false,
            add: false,
            update: false,
            delete: false,
            select: false
        };
        this.checkedStatus = {
            ScheduleSearch: false
        };
        this.controls = [
            { name: 'ContractNumber', readonly: true, disabled: false, required: true },
            { name: 'ContractName', readonly: true, disabled: false, required: false },
            { name: 'ExpectedTotalQty', readonly: false, disabled: false, required: false },
            { name: 'ExpectedTotalValue', readonly: false, disabled: false, required: false },
            { name: 'PremiseNumber', readonly: false, disabled: false, required: true, value: '' },
            { name: 'PremiseName', readonly: true, disabled: false, required: false },
            { name: 'TotalQty', readonly: true, disabled: false, required: false },
            { name: 'TotalValue', readonly: false, disabled: false, required: false },
            { name: 'TotalWEDValue', readonly: false, disabled: false, required: false },
            { name: 'ProductCode', readonly: false, disabled: false, required: true },
            { name: 'ProductDesc', readonly: false, disabled: false, required: false },
            { name: 'ServiceCoverItemCommenceDate', readonly: false, disabled: false, required: false },
            { name: 'EffectiveDate', readonly: false, disabled: false, required: false },
            { name: 'ServiceSalesEmployee', readonly: false, disabled: false, required: false },
            { name: 'EmployeeSurname', readonly: false, disabled: true, required: false },
            { name: 'SalesEmployeeText', readonly: false, disabled: false, required: false },
            { name: 'UsePercentageValuesInd', readonly: false, disabled: false, required: false },
            { name: 'DisplayQty', readonly: false, disabled: false, required: false },
            { name: 'ItemDescription', readonly: false, disabled: false, required: false },
            { name: 'InstallByBranchInd', readonly: false, disabled: false, required: false },
            { name: 'InstalledInd', readonly: false, disabled: false, required: false },
            { name: 'MaterialsCost', readonly: false, disabled: false, required: false },
            { name: 'InstallationEmployeeCode', readonly: false, disabled: false, required: false },
            { name: 'InstallationEmployeeName', readonly: false, disabled: true, required: false },
            { name: 'ReplacementIncludeInd', readonly: false, disabled: false, required: false },
            { name: 'RenegOldContract', readonly: false, disabled: false, required: false },
            { name: 'RenegOldPremise', readonly: false, disabled: false, required: false },
            { name: 'MaterialsValuePerc', readonly: false, disabled: false, required: false },
            { name: 'MaterialsValue', readonly: false, disabled: false, required: false },
            { name: 'LabourValue', readonly: false, disabled: false, required: false },
            { name: 'LabourValuePerc', readonly: false, disabled: false, required: false },
            { name: 'ReplacementValue', readonly: false, disabled: false, required: false },
            { name: 'ReplacementValuePerc', readonly: false, disabled: false, required: false },
            { name: 'WEDValue', readonly: false, disabled: false, required: false },
            { name: 'DisplayValue', readonly: false, disabled: false, required: false },
            { name: 'LabourCost', readonly: false, disabled: false, required: false },
            { name: 'InstallByBranchInd', readonly: false, disabled: false, required: false },
            { name: 'PremiseLocationNumber', readonly: false, disabled: false, required: false },
            { name: 'PremiseLocationDesc', readonly: false, disabled: false, required: false },
            { name: 'ItemText1', readonly: false, disabled: false, required: false },
            { name: 'ItemText2', readonly: false, disabled: false, required: false },
            { name: 'CurrentWeek', readonly: false, disabled: false, required: false },
            { name: 'InitialComponentsDate', readonly: false, disabled: false, required: false },
            { name: 'ScheduleID', readonly: false, disabled: false, required: false },
            { name: 'ExchangesStartAfterDate', readonly: false, disabled: false, required: false },
            { name: 'ExchangesStartAfterWk', readonly: false, disabled: false, required: false },
            { name: 'selScheduleType', readonly: false, disabled: false, required: false },
            { name: 'BranchServiceAreaCode', readonly: false, disabled: false, required: false },
            { name: 'BranchServiceAreaDesc', readonly: false, disabled: false, required: false },
            { name: 'ScheduleName', readonly: false, disabled: false, required: false },
            { name: 'ScheduleEmployeeCode', readonly: false, disabled: false, required: false },
            { name: 'ScheduleEmployeeName', readonly: false, disabled: false, required: false },
            { name: 'ScheduleQty', readonly: false, disabled: false, required: false },
            { name: 'ExchangesGenUpTo', readonly: false, disabled: false, required: false },
            { name: 'ExchangesGenUpToWk', readonly: false, disabled: false, required: false },
            { name: 'ServiceCoverNumber', readonly: false, disabled: false, required: false },
            { name: 'ComponentTypeCode', readonly: false, disabled: false, required: false },
            { name: 'ComponentTypeDesc', readonly: false, disabled: false, required: false },
            { name: 'ComponentTypeDescLang', readonly: false, disabled: false, required: false },
            { name: 'SelProductCode', readonly: false, disabled: false, required: false },
            { name: 'SelProductDesc', readonly: false, disabled: false, required: false },
            { name: 'SelProductAlternateCode', readonly: false, disabled: false, required: false },
            { name: 'SelComponentTypeCode', readonly: false, disabled: false, required: false },
            { name: 'ServiceCoverItemNumber', readonly: false, disabled: false, required: false },
            { name: 'AccountNumber', readonly: false, disabled: false, required: false },
            { name: 'ServiceCoverMode', readonly: false, disabled: false, required: false },
            { name: 'ValidForDeletion', readonly: false, disabled: false, required: false },
            { name: 'ServiceBranchNumber', readonly: false, disabled: false, required: false },
            { name: 'NegBranchNumber', readonly: false, disabled: false, required: false },
            { name: 'RequiresManualVisitPlanningInd', readonly: false, disabled: false, required: false },
            { name: 'AnnualCalendarInd', readonly: false, disabled: false, required: false },
            { name: 'EmployeeLimitChildDrillOptions', readonly: false, disabled: false, required: false },
            { name: 'RemovalDate', readonly: false, disabled: false, required: false },
            { name: 'SelAttributeValue1', readonly: false, disabled: false, required: false },
            { name: 'SelAttributeValue2', readonly: false, disabled: false, required: false },
            { name: 'AttributeCode', readonly: false, disabled: false, required: false },
            { name: 'AttributeLabel', readonly: false, disabled: false, required: false },
            { name: 'SelAttributeCode', readonly: false, disabled: false, required: false },
            { name: 'SelAttributeValue', readonly: false, disabled: false, required: false },
            { name: 'AttributeValue', readonly: false, disabled: false, required: false },
            { name: 'SelProductRange', readonly: false, disabled: false, required: false },
            { name: 'SelProductRangeDesc', readonly: false, disabled: false, required: false },
            { name: 'SelComponentNumber', readonly: false, disabled: false, required: false },
            { name: 'SelProductComponentCode', readonly: false, disabled: false, required: false },
            { name: 'RangeDetailSeqNo', readonly: false, disabled: false, required: false },
            { name: 'RangeDetailInterval', readonly: false, disabled: false, required: false },
            { name: 'ServiceCoverRotation', readonly: false, disabled: false, required: false },
            { name: 'ScheduleRotation', readonly: false, disabled: false, required: false, value: false },
            { name: 'ScheduleSearch', readonly: false, disabled: false, required: false },
            { name: 'ScheduleType', readonly: false, disabled: false, required: false },
            { name: 'chkRenegContract', readonly: false, disabled: false, required: false },
            { name: 'RenegOldValue', readonly: false, disabled: false, required: false },
            { name: 'InstallationDate', readonly: false, disabled: false, required: false },
            { name: 'ServiceCoverRowID', readonly: false, disabled: false, required: false }
        ];
        this.pageId = PageIdentifier.ICABSASERVICECOVERDISPLAYENTRY;
    }
    ServiceCoverDisplayEntryComponent.prototype.loadSysChars = function () {
        var _this = this;
        var sysCharList = [
            this.sysCharConstants.SystemCharEnableWED,
            this.sysCharConstants.SystemCharEnableInstallsRemovals,
            this.sysCharConstants.SystemCharEnableServiceCoverDisplayLevel,
            this.sysCharConstants.SystemCharDisplayLevelInstall,
            this.sysCharConstants.SystemCharEnableLocations
        ];
        this.ajaxSource.next(AjaxConstant.START);
        this.lookUpSubscription = this.fetchSysChar(sysCharList).subscribe(function (data) {
            try {
                if (data.records) {
                    _this.pageParams.vEnableWED = data.records[0].Required;
                    _this.pageParams.vEnableInstallRemovals = data.records[1].Required;
                    _this.pageParams.vEnableDisplay = data.records[2].Integer;
                    _this.pageParams.vMaxComponentLines = data.records[2].Integer;
                    _this.pageParams.vDefaultDisplaysInstalled = data.records[3].Required;
                    _this.pageParams.vEnableLocations = data.records[4].Required;
                    _this.setData();
                }
            }
            catch (e) {
                _this.logger.warn('System variable response error' + e);
            }
            _this.ajaxSource.next(AjaxConstant.COMPLETE);
        });
    };
    ServiceCoverDisplayEntryComponent.prototype.fetchSysChar = function (sysCharNumbers) {
        this.querySysChar.set(this.serviceConstants.Action, '0');
        if (this.utils.getBusinessCode()) {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        }
        else {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.businessCode());
        }
        if (this.utils.getCountryCode()) {
            this.querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        }
        else {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.countryCode());
        }
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(this.querySysChar);
    };
    ServiceCoverDisplayEntryComponent.prototype.lookupData = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'ScheduleType',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode()
                },
                'fields': ['ScheduleTypeCode', 'ScheduleTypeDesc']
            }
        ];
        this.ajaxSource.next(AjaxConstant.START);
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            _this.pageParams.sheduleTypeOptions = [];
            for (var _i = 0, _a = data[0]; _i < _a.length; _i++) {
                var schedule = _a[_i];
                var optionObj = { text: schedule.ScheduleTypeDesc, value: schedule.ScheduleTypeCode };
                _this.pageParams.sheduleTypeOptions.push(optionObj);
            }
            _this.ajaxSource.next(AjaxConstant.COMPLETE);
        });
    };
    ServiceCoverDisplayEntryComponent.prototype.initData = function () {
        this.setFormFlag.rotationalRuleOnChange = false;
        this.setFormFlag.getPercentageValues = false;
        this.setFormFlag.scheduleIDOonChange = false;
        this.setFormFlag.branchServiceAreaCodeonChange = false;
        this.setFormFlag.premiseLocationNumberOnChange = false;
        this.setFormFlag.totalDisplayValues = false;
        this.setFormFlag.exchangesStartAfterDateSelectedValue = false;
        this.setFormFlag.displayValueOnChange = false;
        this.initialFormData = {};
        this.pageParams.vbSingleQtyComponents = [];
        if (this.parentMode !== 'DisplayUpd' && this.parentMode !== 'ScheduleSearch') {
            this.pageParams.mode = 'add';
        }
        else {
            this.pageParams.mode = 'update';
        }
        this.pageParams.GridMode = '0';
        this.pageParams.vbReplacementDefaultInd = true;
        this.pageParams.vbZeroValueProductInd = false;
        this.pageParams.sheduleTypeOptions = [{}];
        this.pageParams.vbServiceVisit = false;
        this.pageParams.contractType = this.riExchange.getCurrentContractType();
        this.pageParams.contractTypelabel = this.riExchange.getCurrentContractTypeLabel();
        var strDocTitle = 'Service Cover Display Maintenance';
        strDocTitle = strDocTitle.replace('^ 1 ^', this.pageParams.contractTypelabel);
        this.pageTitle = strDocTitle;
        this.utils.setTitle(strDocTitle);
        var strInpTitle = '^ 1 ^ Number';
        this.pageParams.contractTypelabel = strInpTitle.replace('^ 1 ^', this.pageParams.contractTypelabel);
        this.createComponentRows();
        this.currDate = null;
        this.effectiveDateChild.isEmptyRequired = true;
        this.loadSysChars();
        this.lookupData();
    };
    ServiceCoverDisplayEntryComponent.prototype.setData = function () {
        var _this = this;
        this.attributes.ServiceCoverItemRowID = this.riExchange.getParentAttributeValue('ServiceCoverItemRowID');
        if (this.parentMode !== 'ScheduleSearch') {
            this.uiForm.controls['ServiceCoverNumber'].setValue(this.riExchange.getParentHTMLValue('ServiceCoverNumber'));
            this.uiForm.controls['ServiceCoverItemNumber'].setValue(this.riExchange.getParentHTMLValue('ServiceCoverItemNumber'));
            this.uiForm.controls['ContractNumber'].setValue(this.riExchange.getParentHTMLValue('ContractNumber'));
            this.uiForm.controls['ContractName'].setValue(this.riExchange.getParentHTMLValue('ContractName'));
            this.uiForm.controls['PremiseNumber'].setValue(this.riExchange.getParentHTMLValue('PremiseNumber'));
            this.uiForm.controls['PremiseName'].setValue(this.riExchange.getParentHTMLValue('PremiseName'));
            this.uiForm.controls['ProductCode'].setValue(this.riExchange.getParentHTMLValue('ProductCode'));
            this.uiForm.controls['ProductDesc'].setValue(this.riExchange.getParentHTMLValue('ProductDesc'));
            this.uiForm.controls['AccountNumber'].setValue(this.riExchange.getParentHTMLValue('AccountNumber'));
            this.uiForm.controls['ServiceCoverMode'].setValue(this.riExchange.getParentHTMLValue('ServiceCoverMode'));
            this.uiForm.controls['EffectiveDate'].setValue(this.riExchange.getParentHTMLValue('EffectiveDate'));
            this.uiForm.controls['ServiceBranchNumber'].setValue(this.riExchange.getParentHTMLValue('ServiceBranchNumber'));
            this.uiForm.controls['NegBranchNumber'].setValue(this.riExchange.getParentHTMLValue('NegBranchNumber'));
            this.uiForm.controls['RequiresManualVisitPlanningInd'].setValue(this.riExchange.getParentHTMLValue('RequiresManualVisitPlanningInd'));
            this.uiForm.controls['AnnualCalendarInd'].setValue(this.riExchange.getParentHTMLValue('AnnualCalendarInd'));
            this.uiForm.controls['EmployeeLimitChildDrillOptions'].setValue(this.riExchange.getParentHTMLValue('EmployeeLimitChildDrillOptions'));
            this.uiForm.controls['ExpectedTotalValue'].setValue(this.riExchange.getParentHTMLValue('ExpectedTotalValue'));
            this.uiForm.controls['ExpectedTotalQty'].setValue(this.riExchange.getParentHTMLValue('ExpectedTotalQty'));
            this.pageParams.vbServiceBranchNumber = this.uiForm.controls['ServiceBranchNumber'].value;
        }
        if (this.uiForm.controls['ServiceCoverMode'].value === 'GroupServiceVisit' || this.uiForm.controls['ServiceCoverMode'].value === 'ServiceVisit' || this.uiForm.controls['ServiceCoverMode'].value === 'DespatchGrid') {
            this.pageParams.vbServiceVisit = true;
            this.uiForm.controls['ServiceCoverMode'].setValue('Normal');
        }
        if (this.parentMode === 'ScheduleSearch') {
            this.attributes['ProductCodeServiceCoverRowID'] = this.riExchange.getParentAttributeValue('ScheduleIDServiceCoverRowID');
            this.uiForm.controls['ServiceCoverMode'].setValue('Normal');
        }
        else {
            this.attributes['ProductCodeServiceCoverRowID'] = this.riExchange.getParentHTMLValue('ServiceCover');
        }
        if (this.riExchange.ClientSideValues.Fetch('FullAccess') === 'Full' || this.utils.getBranchCode() === this.uiForm.controls['ServiceBranchNumber'].value || this.utils.getBranchCode() === this.uiForm.controls['NegBranchNumber'].value) {
            this.pageParams.blnAccess = true;
        }
        else {
            this.pageParams.blnAccess = false;
        }
        if (this.parentMode === 'DisplayUpd' || this.parentMode === 'ScheduleSearch') {
            this.functionMode.snapShot = false;
            this.functionMode.add = false;
            this.functionMode.update = true;
            this.functionMode.delete = true;
            this.functionMode.select = false;
            if (this.pageParams.vbServiceVisit === true || this.parentMode === 'ScheduleSearch') {
                this.functionMode.delete = true;
            }
        }
        else {
            this.functionMode.snapShot = false;
            this.functionMode.add = true;
            this.functionMode.update = false;
            this.functionMode.delete = false;
            this.functionMode.select = false;
        }
        if (this.parentMode === 'DisplayUpd' || (this.parentMode === 'Add' && this.uiForm.controls['ServiceCoverMode'].value === 'ServiceCoverAdd') || this.parentMode === 'ScheduleSearch') {
            this.uiForm.controls['InstallByBranchInd'].disable();
            this.uiForm.controls['ServiceCoverItemCommenceDate'].disable();
            this.uiForm.controls['InstalledInd'].disable();
        }
        else {
            this.uiForm.controls['InstallByBranchInd'].enable();
            this.uiForm.controls['ServiceCoverItemCommenceDate'].enable();
            this.uiForm.controls['InstalledInd'].enable();
        }
        if (this.pageParams.vEnableWED === true) {
            this.fieldRequired.WEDValue = true;
        }
        if (this.uiForm.controls['ServiceCoverMode'].value === 'Normal') {
            this.uiForm.controls['MaterialsValue'].disable();
            this.uiForm.controls['LabourValue'].disable();
            this.uiForm.controls['ReplacementValue'].disable();
            this.uiForm.controls['UsePercentageValuesInd'].disable();
            this.uiForm.controls['DisplayValue'].disable();
        }
        else {
            this.uiForm.controls['MaterialsValue'].enable();
            this.uiForm.controls['LabourValue'].enable();
            this.uiForm.controls['ReplacementValue'].enable();
            this.uiForm.controls['UsePercentageValuesInd'].enable();
            this.uiForm.controls['DisplayValue'].enable();
        }
        this.uiForm.controls['PremiseLocationDesc'].disable();
        this.uiForm.controls['ServiceCoverItemNumber'].disable();
        this.uiForm.controls['AccountNumber'].disable();
        this.uiForm.controls['ValidForDeletion'].disable();
        this.uiForm.controls['ContractName'].disable();
        this.uiForm.controls['PremiseName'].disable();
        this.uiForm.controls['ProductDesc'].disable();
        this.uiForm.controls['ExpectedTotalQty'].disable();
        this.uiForm.controls['ExpectedTotalValue'].disable();
        this.uiForm.controls['TotalQty'].disable();
        this.uiForm.controls['TotalValue'].disable();
        this.uiForm.controls['TotalWEDValue'].disable();
        this.uiForm.controls['RemovalDate'].disable();
        this.uiForm.controls['ServiceCoverRotation'].disable();
        this.uiForm.controls['MaterialsValuePerc'].disable();
        this.uiForm.controls['LabourValuePerc'].disable();
        this.uiForm.controls['ReplacementValuePerc'].disable();
        this.uiForm.controls['CurrentWeek'].disable();
        this.uiForm.controls['ExchangesGenUpTo'].disable();
        this.uiForm.controls['ExchangesGenUpToWk'].disable();
        this.uiForm.controls['ExchangesStartAfterWk'].disable();
        this.uiForm.controls['ScheduleRotation'].disable();
        this.uiForm.controls['ScheduleSearch'].disable();
        if (this.parentMode !== 'DisplayUpd' && this.parentMode !== 'ScheduleSearch') {
            this.fieldRequired.DisplayQty = true;
        }
        else {
            this.fieldRequired.EffectiveDate = true;
        }
        if (this.parentMode === 'ScheduleSearch') {
            this.uiForm.controls['ServiceCoverRowID'].setValue(this.riExchange.getParentAttributeValue('ScheduleIDServiceCoverRowID'));
            this.checkedStatus.ScheduleSearch = true;
        }
        else {
            this.uiForm.controls['ServiceCoverRowID'].setValue(this.riExchange.getParentHTMLValue('ServiceCoverROWID'));
        }
        if (this.pageParams.vEnableWED) {
            this.fieldHidden.WEDValue = false;
        }
        if (this.parentMode !== 'DisplayUpd' && this.parentMode !== 'ScheduleSearch') {
            this.fieldHidden.divComp = false;
            this.fieldHidden.tdExpectedTotals = false;
            this.pageParams.vbReplacementDefaultInd = false;
            this.uiForm.controls['TotalQty'].setValue(this.riExchange.getParentHTMLValue('TotalQty'));
            this.uiForm.controls['TotalValue'].setValue(this.riExchange.getParentHTMLValue('TotalValue'));
            this.uiForm.controls['TotalWEDValue'].setValue(this.riExchange.getParentHTMLValue('TotalWEDValue'));
            var postData = {};
            postData['ProductCode'] = this.uiForm.controls['ProductCode'].value;
            postData['ServiceCoverRowID'] = this.uiForm.controls['ServiceCoverRowID'].value;
            postData['Function'] = 'DummyProductCodeList,SingleQtyComponents,DefaultReplacement,ZeroValueProduct';
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
                try {
                    if (data.DummyProductCodes) {
                        _this.pageParams.vbDummyProductCodes = data.DummyProductCodes.split('|');
                    }
                    if (data.SingleQtyComponents) {
                        _this.pageParams.vbSingleQtyComponents = data.SingleQtyComponents.split('|');
                    }
                    if (data.ReplacementDefaultInd && data.ReplacementDefaultInd === 'yes') {
                        _this.pageParams.vbReplacementDefaultInd = true;
                    }
                    if (data.ZeroValueProductInd && data.ZeroValueProductInd === 'yes') {
                        _this.pageParams.vbZeroValueProductInd = true;
                    }
                    _this.setFormData();
                }
                catch (error) {
                    _this.logger.warn(error);
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
        else {
            var postData = {};
            postData['ProductCode'] = this.uiForm.controls['ProductCode'].value;
            postData['Function'] = 'ZeroValueProduct';
            postData['ServiceCoverRowID'] = this.uiForm.controls['ServiceCoverRowID'].value;
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
                try {
                    if (data.ZeroValueProductInd && data.ZeroValueProductInd === 'yes') {
                        _this.pageParams.vbZeroValueProductInd = true;
                    }
                    _this.setFormData();
                }
                catch (error) {
                    _this.logger.warn(error);
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
            this.fieldHidden.tdGridControl = false;
            this.fieldHidden.EffectiveDate = false;
            this.fieldHidden.tdPopulate = true;
            this.fieldHidden.DisplayQty = true;
            this.fieldHidden.tdExpectedTotals = true;
            this.fieldHidden.InitialComponentsDate = true;
            this.buildGridComp();
        }
        if (this.pageParams.vbZeroValueProductInd === true) {
            this.fieldHidden.MaterialsValue = true;
            this.fieldHidden.LabourValueLab = true;
            this.fieldHidden.ReplacementValue = true;
        }
        else {
            this.fieldHidden.MaterialsValue = false;
            this.fieldHidden.LabourValueLab = false;
            this.fieldHidden.ReplacementValue = false;
        }
        this.updatedRequired();
        if (this.pageParams.mode === 'update') {
            this.riMaintenanceBeforeUpdate();
            this.riMaintenanceBeforeFetch();
        }
        else {
            this.riMaintenanceBeforeAdd();
        }
        this.setFormData();
        this.buildMenuOptions();
        this.sheduleTypeDisabled = true;
    };
    ServiceCoverDisplayEntryComponent.prototype.buildGridComp = function () {
        this.maxColumn = 11;
        if (this.uiForm.controls['RemovalDate'].value === '') {
            this.maxColumn++;
        }
        if (this.pageParams.gridUpdate === true) {
            this.componentGrid.update = true;
        }
        if (this.pageParams.vbUpdateRecord === 'Update') {
            this.search.set('AttributeValue1', this.pageParams.vbAttributeValue1);
            this.search.set('AttributeValue2', this.pageParams.vbAttributeValue2);
            this.search.set('UpdateField', this.pageParams.vbUpdateField);
        }
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set('ContractNumber', this.uiForm.controls['ContractNumber'].value);
        this.search.set('PremiseNumber', this.uiForm.controls['PremiseNumber'].value);
        this.search.set('ProductCode', this.uiForm.controls['ProductCode'].value);
        this.search.set('ServiceCoverNumber', this.uiForm.controls['ServiceCoverNumber'].value);
        this.search.set('ServiceCoverItemRowID', this.attributes.ServiceCoverItemRowID);
        this.search.set('GridType', 'Component');
        this.search.set('UpdateField', 'AttributeValue1');
        this.search.set('UpdateRecord', this.pageParams.vbUpdateRecord);
        this.search.set(this.serviceConstants.GridMode, this.pageParams.GridMode);
        this.search.set(this.serviceConstants.GridHandle, '0');
        this.search.set('riCacheRefresh', 'True');
        this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        this.queryParams.search = this.search;
        this.componentGrid.loadGridData(this.queryParams);
        if (this.pageParams.vbUpdateRecord === 'Update') {
            this.pageParams.vbUpdateRecord = '';
            this.pageParams.vbUpdateField = '';
        }
        else if (this.pageParams.vbUpdateRecord === 'Delete') {
            this.pageParams.vbUpdateRecord = '';
        }
    };
    ServiceCoverDisplayEntryComponent.prototype.scheduleOptionsChange = function (obj) {
        this.uiForm.controls['selScheduleType'].setValue(obj);
    };
    ServiceCoverDisplayEntryComponent.prototype.createComponentRows = function () {
        var rowObj = {};
        this.componentRows = [];
        var fieldDisable = false;
        for (var i = 1; i <= this.minRows; i++) {
            rowObj = {};
            rowObj['count'] = i;
            for (var cnt = 0; cnt < this.ComponentColumnList.length; cnt++) {
                rowObj[this.ComponentColumnList[cnt]] = this.ComponentColumnList[cnt] + i;
                if (this.parentMode !== 'DisplayUpd' && this.parentMode !== 'ScheduleSearch') {
                    if (this.ComponentColumnList[cnt] === 'ComponentTypeDesc' || this.ComponentColumnList[cnt] === 'ProductComponentDesc'
                        || this.ComponentColumnList[cnt] === 'AttributeLabelA' || this.ComponentColumnList[cnt] === 'AttributeLabelB'
                        || this.ComponentColumnList[cnt] === 'ProductRangeDesc' || this.ComponentColumnList[cnt] === 'SequenceNumber'
                        || this.ComponentColumnList[cnt] === 'RotationalInterval') {
                        fieldDisable = true;
                    }
                    else {
                        fieldDisable = false;
                    }
                }
                this.fieldRequired[this.ComponentColumnList[cnt] + this.rowCount] = false;
                this.fieldHidden[this.ComponentColumnList[cnt] + this.rowCount] = false;
                this.controls.push({ name: this.ComponentColumnList[cnt] + i, readonly: true, disabled: fieldDisable, required: false, value: '' });
            }
            this.componentRows.push(rowObj);
            this.rowCount++;
        }
        this.riExchange.renderForm(this.uiForm, this.controls);
        this.updatedRequired();
    };
    ServiceCoverDisplayEntryComponent.prototype.addComponentRow = function () {
        var rowObj = {};
        var fieldDisable = false;
        this.rowCount++;
        rowObj['count'] = this.rowCount;
        for (var cnt = 0; cnt < this.ComponentColumnList.length; cnt++) {
            rowObj[this.ComponentColumnList[cnt]] = this.ComponentColumnList[cnt] + this.rowCount;
            if (this.parentMode !== 'DisplayUpd' && this.parentMode !== 'ScheduleSearch') {
                if (this.ComponentColumnList[cnt] === 'ComponentTypeDesc' || this.ComponentColumnList[cnt] === 'ProductComponentDesc'
                    || this.ComponentColumnList[cnt] === 'AttributeLabelA' || this.ComponentColumnList[cnt] === 'AttributeLabelB'
                    || this.ComponentColumnList[cnt] === 'ProductRangeDesc' || this.ComponentColumnList[cnt] === 'SequenceNumber'
                    || this.ComponentColumnList[cnt] === 'RotationalInterval') {
                    fieldDisable = true;
                }
                else {
                    fieldDisable = false;
                }
            }
            this.fieldRequired[this.ComponentColumnList[cnt] + this.rowCount] = false;
            this.fieldHidden[this.ComponentColumnList[cnt] + this.rowCount] = false;
            this.controls.push({ name: this.ComponentColumnList[cnt] + this.rowCount, readonly: true, disabled: fieldDisable, required: false, value: '' });
        }
        this.riExchange.renderForm(this.uiForm, this.controls);
        this.componentRows.push(rowObj);
        this.updatedRequired();
    };
    ServiceCoverDisplayEntryComponent.prototype.onProductDataReceived = function (data, count) {
        this.uiForm.controls['ProductComponentCode' + count].setValue(data.ProductCode);
        this.uiForm.controls['AlternateProductCode' + count].setValue(data.PrimaryAlternateCode);
        this.uiForm.controls['ProductComponentDesc' + count].setValue(data.ProductDesc);
    };
    ServiceCoverDisplayEntryComponent.prototype.onAlternativeProductDataReceived = function (data, count) {
    };
    ServiceCoverDisplayEntryComponent.prototype.productCodeOnChange = function (index) {
        for (var _i = 0, _a = this.pageParams.vbSingleQtyComponents; _i < _a.length; _i++) {
            var vcomp = _a[_i];
            if (this.uiForm.controls['ComponentQuantity' + index].value.toLowerCase() === vcomp.toLowerCase()) {
                this.uiForm.controls['ComponentQuantity' + index].setValue('1');
                this.uiForm.controls['ComponentQuantity' + index].disable();
            }
        }
        if (this.uiForm.controls['ProductComponentCode' + index].value) {
            this.uiForm.controls['ProductComponentDesc' + index].disable();
            for (var _b = 0, _c = this.pageParams.vbDummyProductCodes; _b < _c.length; _b++) {
                var pobj = _c[_b];
                if (this.uiForm.controls['ProductComponentCode' + index].value.toLowerCase() === pobj.toLowerCase()) {
                    this.uiForm.controls['ProductComponentDesc' + index].enable();
                    this.el.nativeElement.querySelector('#ProductComponentDesc' + index).focus();
                    break;
                }
            }
        }
    };
    ServiceCoverDisplayEntryComponent.prototype.displayRotationalFields = function (index) {
        var _this = this;
        var postData = {};
        postData['ContractNumber'] = this.uiForm.controls['ContractNumber'].value;
        postData['PremiseNumber'] = this.uiForm.controls['PremiseNumber'].value;
        postData['ProductCode'] = this.uiForm.controls['ProductCode'].value;
        postData['ServiceCoverNumber'] = this.uiForm.controls['ServiceCoverNumber'].value;
        postData['ComponentNumber'] = index;
        postData['ProductComponentCode'] = this.uiForm.controls['ProductComponentCode' + index].value;
        postData['Function'] = 'DisplayRotationalFields';
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
            try {
                if (data.RotationalProductInd) {
                    _this.fieldRequired['ProductRange' + index] = true;
                    _this.fieldHidden.trComponentRange = false;
                    _this.fieldHidden.RotationalInterval1 = false;
                    _this.uiForm.controls['ProductRange' + index].setValue(data.ProductRange);
                    _this.uiForm.controls['ProductRangeDesc' + index].setValue(data.ProductRangeDesc);
                    _this.uiForm.controls['SequenceNumber' + index].setValue(data.SequenceNumber);
                    _this.uiForm.controls['RotationalRule' + index].setValue(data.RotationalRule);
                    _this.uiForm.controls['RotationalInterval' + index].setValue(data.RotationalInterval);
                    if (_this.uiForm.controls['RotationalRule'].value === 'C' && _this.uiForm.controls['ProductRange'].value) {
                        _this.uiForm.controls['ProductRangeDesc'].setValue(_this.uiForm.controls['PremiseName'].value);
                    }
                }
                else {
                    _this.fieldRequired['ProductRange' + index] = false;
                    _this.uiForm.controls['ProductRange' + index].setValue('');
                    _this.uiForm.controls['ProductRangeDesc' + index].setValue('');
                    _this.uiForm.controls['SequenceNumber' + index].setValue('');
                    _this.uiForm.controls['RotationalRule' + index].setValue('');
                    _this.uiForm.controls['RotationalInterval' + index].setValue('');
                    _this.fieldHidden.trComponentRange = true;
                    _this.fieldHidden.RotationalInterval1 = true;
                }
                _this.rotationalRuleOnChange(index);
                _this.updatedRequired();
                if (!_this.setFormFlag.rotationalRuleOnChange) {
                    _this.setFormData();
                    _this.setFormFlag.rotationalRuleOnChange = true;
                }
            }
            catch (error) {
                _this.logger.warn(error);
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ServiceCoverDisplayEntryComponent.prototype.rotationalRuleOnChange = function (index) {
        var _this = this;
        if (this.uiForm.controls['RotationalInterval' + index].value.toLowerCase() === 'c' || this.uiForm.controls['RotationalRule' + index].value.toLowerCase() === 's') {
            this.fieldHidden.RotationalInterval1 = false;
        }
        else {
            this.fieldHidden.RotationalInterval1 = true;
        }
        if (this.uiForm.controls['RotationalRule' + index].value.toLowerCase() === 'c') {
            this.fieldHidden.customUpdate = false;
        }
        var postData = {};
        postData['ContractNumber'] = this.uiForm.controls['ContractNumber'].value;
        postData['PremiseNumber'] = this.uiForm.controls['PremiseNumber'].value;
        postData['ProductCode'] = this.uiForm.controls['ProductCode'].value;
        postData['ServiceCoverNumber'] = this.uiForm.controls['ServiceCoverNumber'].value;
        postData['ComponentNumber'] = index;
        postData['ProductComponentCode'] = this.uiForm.controls['ProductComponentCode' + index].value;
        postData['Function'] = 'DefaultCustomRange';
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
            try {
                if (data.RotationalProductInd) {
                    _this.uiForm.controls['ProductRange' + index].setValue(data.ProductRange);
                    _this.uiForm.controls['ProductRangeDesc' + index].setValue(data.ProductRangeDesc);
                    _this.uiForm.controls['SequenceNumber' + index].setValue(data.SequenceNumber);
                    _this.uiForm.controls['RotationalInterval' + index].setValue(data.RotationalInterval);
                }
                else {
                    _this.uiForm.controls['ProductRange' + index].setValue('');
                    _this.uiForm.controls['ProductRangeDesc' + index].setValue('');
                    _this.uiForm.controls['SequenceNumber' + index].setValue('');
                    _this.uiForm.controls['RotationalInterval' + index].setValue('');
                }
                _this.uiForm.controls['ProductRange' + index].disable();
            }
            catch (error) {
                _this.logger.warn(error);
            }
        }, function (error) {
            _this.errorService.emitError(error);
            _this.uiForm.controls['ProductRange' + index].enable();
            _this.fieldHidden.customUpdate = true;
        });
    };
    ServiceCoverDisplayEntryComponent.prototype.getGridInfo = function (info) {
        this.componentGridPagination.totalItems = info.totalRows;
        if (this.pageParams.GridMode === '3')
            this.buildGridComp();
    };
    ServiceCoverDisplayEntryComponent.prototype.getCurrentPage = function (currentPage) {
        this.currentPage = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.buildGridComp();
    };
    ServiceCoverDisplayEntryComponent.prototype.refresh = function () {
        this.currentPage = 1;
        this.buildGridComp();
    };
    ServiceCoverDisplayEntryComponent.prototype.onGridRowClick = function (event) {
        switch (event.cellIndex) {
            case '6':
                this.attributes['ServiceCoverNumberServiceCoverComponentRowID'] = event.trRowData[0].additionalData;
                this.attributes['ServiceCoverNumberRow'] = event.rowIndex;
                this.attributes['ServiceCoverNumberAttributeCode'] = event.trRowData[5].additionalData;
                this.pageParams.vbAttributeCode1 = this.attributes['ServiceCoverNumberAttributeCode'];
                this.pageParams.vbUpdateField = 'AttributeValue1';
                break;
            case '8':
                this.attributes['ServiceCoverNumberServiceCoverComponentRowID'] = event.trRowData[0].additionalData;
                this.attributes['ServiceCoverNumberRow'] = event.rowIndex;
                this.attributes['ServiceCoverNumberAttributeCode'] = event.trRowData[7].additionalData;
                this.pageParams.vbAttributeCode2 = this.attributes['ServiceCoverNumberAttributeCode'];
                this.pageParams.vbUpdateField = 'AttributeValue1';
                break;
            default:
                break;
        }
    };
    ServiceCoverDisplayEntryComponent.prototype.onGridRowDblClick = function (event) {
        var _this = this;
        var cellIndex, deleteComponent = false, serviceCoverComponentRowID;
        serviceCoverComponentRowID = event.trRowData[0].additionalData;
        cellIndex = event.cellIndex;
        if (cellIndex === 11) {
            deleteComponent = true;
        }
        if (cellIndex === 0) {
            this.pageParams.mode = 'DisplayGrid';
            this.navigate('DisplayGrid', 'application/ServiceCoverComponentEntry', { ServiceCoverNumber: this.uiForm.controls['ServiceCoverNumber'].value, ServiceCoverItemNumber: this.uiForm.controls['ServiceCoverItemNumber'].value, ServiceCoverComponentRowID: serviceCoverComponentRowID });
        }
        else if (deleteComponent === true) {
            var postData = {};
            postData['Function'] = 'DeleteComponent';
            postData['ServiceCoverComponentRowID'] = serviceCoverComponentRowID;
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
                try {
                    if (data.errorMessage) {
                        _this.messageModal.show({ msg: data['errorMessage'], title: _this.pageTitle }, false);
                    }
                    else {
                        _this.attributes['grdServiceCoverComponentServiceCoverComponentRowID'] = event.cellData.additionalData;
                        _this.attributes['grdServiceCoverComponentRow'] = event.rowIndex;
                        _this.attributes['ServiceCoverNumberRow'] = event.rowIndex;
                        _this.attributes['ServiceCoverNumberServiceCoverComponentRowID'] = event.cellData.additionalData;
                        _this.pageParams.vbUpdateRecord = 'Delete';
                        _this.pageParams.gridUpdate = true;
                        _this.buildGridComp();
                    }
                }
                catch (error) {
                    _this.logger.warn(error);
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
    };
    ServiceCoverDisplayEntryComponent.prototype.onCellKeyDown = function (event) {
        if (this.pageParams.GridMode !== '3' && event.cellIndex === '6') {
            this.pageParams.vbUpdateField = 'AttributeValue1';
            this.pageParams.vbAttributeValue1 = event.keyCode.target.value;
            this.attributes['ServiceCoverNumberAttributeCode'] = event.completeRowData[5].additionalData;
            this.attributes['ServiceCoverNumberAttributeLabel'] = event.completeRowData[5].text;
            this.pageParams.mode = 'Attribute1';
            if (this.pageParams.vbAttributeValue1 !== event.cellData.text) {
                this.pageParams.vbAttributeCode1 = this.attributes['ServiceCoverNumberAttributeCode'];
                this.pageParams.gridUpdate = true;
                this.pageParams.vbUpdateRecord = 'Update';
                this.buildGridComp();
            }
            this.pageParams.vbAttributeCode1 = '';
            this.pageParams.vbAttributeValue1 = '';
        }
        if (this.pageParams.GridMode !== '3' && event.cellIndex === '8') {
            this.pageParams.vbUpdateField = 'AttributeValue1';
            this.pageParams.vbAttributeValue2 = event.keyCode.target.value;
            this.attributes['ServiceCoverNumberAttributeCode'] = event.completeRowData[7].additionalData;
            this.attributes['ServiceCoverNumberAttributeLabel'] = event.completeRowData[7].text;
            this.pageParams.mode = 'Attribute2';
            if (this.pageParams.vbAttributeValue2 !== event.cellData.text) {
                this.pageParams.vbAttributeCode2 = this.attributes['ServiceCoverNumberAttributeCode'];
                this.pageParams.gridUpdate = true;
                this.pageParams.vbUpdateRecord = 'Update';
                this.buildGridComp();
            }
            this.pageParams.vbAttributeCode2 = '';
            this.pageParams.vbAttributeValue2 = '';
        }
    };
    ServiceCoverDisplayEntryComponent.prototype.effectiveDateSelectedValue = function (value) {
        var _this = this;
        this.uiForm.controls['EffectiveDate'].setValue(value.value);
        if (this.attributes.ServiceCoverItemRowID) {
            var postData = {};
            postData['Function'] = 'EffectDatePopFields';
            postData['ContractNumber'] = this.uiForm.controls['ContractNumber'].value;
            postData['PremiseNumber'] = this.uiForm.controls['PremiseNumber'].value;
            postData['ProductCode'] = this.uiForm.controls['ProductCode'].value;
            postData['ServiceCoverNumber'] = this.uiForm.controls['ServiceCoverNumber'].value;
            postData['ServiceCoverItemNumber'] = this.uiForm.controls['ServiceCoverItemNumber'].value;
            postData['EffectiveDate'] = this.uiForm.controls['EffectiveDate'].value;
            postData['ServiceCoverItemRowID'] = this.attributes.ServiceCoverItemRowID;
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
                try {
                    if (data.errorMessage) {
                        _this.messageModal.show({ msg: data['errorMessage'], title: _this.pageTitle }, false);
                    }
                    else {
                        _this.uiForm.controls['MaterialsValue'].setValue(data.MaterialsValue);
                        _this.uiForm.controls['ReplacementValue'].setValue(data.ReplacementValue);
                        _this.uiForm.controls['LabourValue'].setValue(data.LabourValue);
                        _this.uiForm.controls['MaterialsCost'].setValue(data.MaterialsCost);
                        _this.uiForm.controls['WEDValue'].setValue(data.WEDValue);
                        _this.totalDisplayValues();
                    }
                }
                catch (error) {
                    _this.logger.warn(error);
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
    };
    ServiceCoverDisplayEntryComponent.prototype.installationDateSelectedValue = function (dt) {
        this.uiForm.controls['InstallationDate'].setValue(dt.value);
    };
    ServiceCoverDisplayEntryComponent.prototype.exchangesStartAfterDateSelectedValue = function (dt) {
        var _this = this;
        this.uiForm.controls['ExchangesStartAfterDate'].setValue(dt.value);
        if (this.uiForm.controls['ExchangesStartAfterDate'].value && (this.uiForm.controls['ExchangesStartAfterDate'].valid)) {
            var postData = {};
            postData['Function'] = 'GetExchangeStartWeek';
            postData['ExchangesStartAfterDate'] = this.uiForm.controls['ExchangesStartAfterDate'].value;
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
                try {
                    if (data.ExchangesStartAfterWk) {
                        _this.uiForm.controls['ExchangesStartAfterWk'].setValue(data.ExchangesStartAfterWk);
                        if (!_this.setFormFlag.exchangesStartAfterDateSelectedValue) {
                            _this.setFormData();
                            _this.setFormFlag.exchangesStartAfterDateSelectedValue = true;
                        }
                    }
                }
                catch (error) {
                    _this.logger.warn(error);
                    _this.uiForm.controls['ExchangesStartAfterWk'].setValue('');
                }
            }, function (error) {
                _this.errorService.emitError(error);
                _this.uiForm.controls['ExchangesStartAfterWk'].setValue('');
            });
        }
        else {
            this.uiForm.controls['ExchangesStartAfterWk'].setValue('');
        }
    };
    ServiceCoverDisplayEntryComponent.prototype.usePercentageValuesIndOnChange = function (ev) {
        this.uiForm.controls['UsePercentageValuesInd'].setValue(ev);
        if (this.uiForm.controls['ServiceCoverMode'].value === 'ServiceCoverAdd' && (this.pageParams.mode === 'add' || this.pageParams.mode === 'update')) {
            if (this.uiForm.controls['UsePercentageValuesInd'].value) {
                this.fieldHidden.percentDisplay = false;
                this.uiForm.controls['MaterialsValue'].disable();
                this.uiForm.controls['LabourValue'].disable();
                this.uiForm.controls['ReplacementValue'].disable();
                this.uiForm.controls['DisplayValue'].enable();
                if (this.uiForm.controls['DisplayValue'].value !== '') {
                    this.displayValueOnChange();
                }
                this.getPercentageValues();
            }
        }
        else {
            this.fieldHidden.percentDisplay = true;
            this.uiForm.controls['MaterialsValue'].enable();
            this.uiForm.controls['LabourValue'].enable();
            this.uiForm.controls['ReplacementValue'].enable();
            this.uiForm.controls['DisplayValue'].disable();
        }
    };
    ServiceCoverDisplayEntryComponent.prototype.displayValueOnChange = function () {
        var _this = this;
        if ((this.parentMode !== 'DisplayUpd' && this.parentMode !== 'ScheduleSearch') || this.pageParams.mode === 'update') {
            if (this.uiForm.controls['UsePercentageValuesInd'].value && this.uiForm.controls['DisplayValue'].value !== 0) {
                var postData = {};
                postData['ProductCode'] = this.uiForm.controls['ProductCode'].value;
                postData['DisplayValue'] = this.uiForm.controls['DisplayValue'].value;
                postData['MaterialsValue'] = this.uiForm.controls['MaterialsValue'].value;
                postData['ReplacementValue'] = this.uiForm.controls['ReplacementValue'].value;
                postData['LabourValue'] = this.uiForm.controls['LabourValue'].value;
                postData['Function'] = 'CalcPercentageValues';
                this.search = new URLSearchParams();
                this.search.set(this.serviceConstants.Action, '6');
                this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                this.search.set(this.serviceConstants.CountryCode, this.countryCode());
                this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
                    try {
                        if (data.LabourValue) {
                            _this.uiForm.controls['LabourValue'].setValue(data.LabourValue);
                        }
                        if (data.MaterialsValue) {
                            _this.uiForm.controls['MaterialsValue'].setValue(data.MaterialsValue);
                        }
                        if (data.ReplacementValue) {
                            _this.uiForm.controls['ReplacementValue'].setValue(data.ReplacementValue);
                        }
                        if (!_this.setFormFlag.displayValueOnChange) {
                            _this.setFormData();
                            _this.setFormFlag.displayValueOnChange = true;
                        }
                    }
                    catch (error) {
                        _this.logger.warn(error);
                    }
                }, function (error) {
                    _this.errorService.emitError(error);
                });
            }
        }
    };
    ServiceCoverDisplayEntryComponent.prototype.getPercentageValues = function () {
        var _this = this;
        var postData = {};
        postData['ProductCode'] = this.uiForm.controls['ProductCode'].value;
        postData['Function'] = 'GetPercValues';
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
            try {
                if (data.LabourValuePerc) {
                    _this.uiForm.controls['LabourValuePerc'].setValue(data.LabourValuePerc);
                }
                if (data.MaterialsValuePerc) {
                    _this.uiForm.controls['MaterialsValuePerc'].setValue(data.MaterialsValuePerc);
                }
                if (data.ReplacementValuePerc) {
                    _this.uiForm.controls['ReplacementValuePerc'].setValue(data.ReplacementValuePerc);
                }
                if (!_this.setFormFlag.getPercentageValues) {
                    _this.setFormData();
                    _this.setFormFlag.getPercentageValues = true;
                }
            }
            catch (error) {
                _this.logger.warn(error);
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ServiceCoverDisplayEntryComponent.prototype.chkRenegContractOnChange = function (ev) {
        this.uiForm.controls['chkRenegContract'].setValue(ev);
        if (this.uiForm.controls['chkRenegContract'].value) {
            this.fieldHidden.RenegOldContract = false;
            this.fieldRequired.RenegOldContract = true;
            this.fieldRequired.RenegOldPremise = true;
            this.fieldRequired.RenegOldValue = true;
            if (this.pageParams.mode === 'update') {
                this.uiForm.controls['RenegOldPremise'].setValue('');
                this.uiForm.controls['RenegOldContract'].setValue('');
                this.uiForm.controls['RenegOldValue'].setValue('');
            }
        }
        else {
            this.fieldHidden.RenegOldContract = true;
            this.fieldRequired.RenegOldContract = false;
            this.fieldRequired.RenegOldPremise = false;
            this.fieldRequired.RenegOldValue = false;
        }
        this.updatedRequired();
    };
    ServiceCoverDisplayEntryComponent.prototype.installedIndOnChange = function (ev) {
        this.uiForm.controls['InstalledInd'].setValue(ev);
        if (this.pageParams.mode === 'add') {
            if (this.uiForm.controls['InstalledInd'].value === true) {
                this.fieldHidden.trInstallationEmployee = false;
                this.uiForm.controls['InstallationDate'].setValue(this.uiForm.controls['ServiceCoverItemCommenceDate'].value);
                this.fieldRequired.InstallationEmployeeCode = true;
            }
            else {
                this.fieldHidden.trInstallationEmployee = true;
                this.fieldRequired.InstallationEmployeeCode = false;
            }
        }
        this.updatedRequired();
    };
    ServiceCoverDisplayEntryComponent.prototype.replacementIncludeIndOnChange = function (ev) {
        this.uiForm.controls['ReplacementIncludeInd'].setValue(ev);
    };
    ServiceCoverDisplayEntryComponent.prototype.installByBranchIndOnChange = function (ev) {
        this.uiForm.controls['InstallByBranchInd'].setValue(ev);
    };
    ServiceCoverDisplayEntryComponent.prototype.displayQtyOnChange = function (dq) {
        if (typeof dq !== 'undefined' && dq === '') {
            this.uiForm.controls['DisplayQty'].setValue('0');
        }
    };
    ServiceCoverDisplayEntryComponent.prototype.riMaintenanceBeforeAdd = function () {
        var _this = this;
        this.uiForm.controls['ItemDescription'].setValue('Display');
        this.uiForm.controls['ReplacementIncludeInd'].setValue(this.pageParams.vbReplacementDefaultInd);
        this.uiForm.controls['ServiceBranchNumber'].setValue(this.pageParams.vbServiceBranchNumber);
        if (this.parentMode === 'Add' && this.uiForm.controls['ServiceCoverMode'].value === 'ServiceCoverAdd') {
            this.uiForm.controls['ServiceCoverItemCommenceDate'].setValue(this.riExchange.getParentHTMLValue('ServiceCommenceDate') ? this.riExchange.getParentHTMLValue('ServiceCommenceDate') : this.riExchange.getParentHTMLValue('EffectiveDate'));
            this.el.nativeElement.querySelector('#ItemDescription').focus();
        }
        else {
            this.el.nativeElement.querySelector('#ServiceCoverItemCommenceDate').focus();
        }
        if (this.parentMode === 'Add' && this.uiForm.controls['ServiceCoverMode'].value === 'Normal') {
            if (this.pageParams.vEnableInstallRemovals) {
                this.fieldHidden.trInstallations = false;
                this.uiForm.controls['InstallByBranchInd'].setValue(true);
                if (this.pageParams.vDefaultDisplaysInstalled) {
                    this.uiForm.controls['InstalledInd'].setValue(true);
                }
            }
        }
        var postData = {};
        postData['ServiceCoverRowID'] = this.uiForm.controls['ServiceCoverRowID'].value;
        postData['PremiseNumber'] = this.uiForm.controls['PremiseNumber'].value;
        postData['ProductCode'] = this.uiForm.controls['ProductCode'].value;
        postData['Function'] = 'SalesEmployeeRotation';
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
            try {
                if (data.ServiceSalesEmployee) {
                    _this.uiForm.controls['ServiceSalesEmployee'].setValue(data.ServiceSalesEmployee);
                }
                if (data.EmployeeSurname) {
                    _this.uiForm.controls['EmployeeSurname'].setValue(data.EmployeeSurname);
                }
                if (data.ServiceCoverRotation) {
                    (data.ServiceCoverRotation === 'yes') ? _this.uiForm.controls['ServiceCoverRotation'].setValue(true) : _this.uiForm.controls['ServiceCoverRotation'].setValue(false);
                }
                if (data.UsePercentageValuesInd) {
                    (data.UsePercentageValuesInd === 'yes') ? _this.uiForm.controls['UsePercentageValuesInd'].setValue(true) : _this.uiForm.controls['UsePercentageValuesInd'].setValue(false);
                    _this.usePercentageValuesIndOnChange(_this.uiForm.controls['UsePercentageValuesInd'].value);
                }
                if (data.MaterialsValuePerc) {
                    _this.uiForm.controls['MaterialsValuePerc'].setValue(data.MaterialsValuePerc);
                }
                if (data.LabourValuePerc) {
                    _this.uiForm.controls['LabourValuePerc'].setValue(data.LabourValuePerc);
                }
                if (data.ReplacementValuePerc) {
                    _this.uiForm.controls['ReplacementValuePerc'].setValue(data.ReplacementValuePerc);
                }
                if (data.ScheduleRotation) {
                    (data.ScheduleRotation === 'yes') ? _this.uiForm.controls['ScheduleRotation'].setValue(true) : _this.uiForm.controls['ScheduleRotation'].setValue(false);
                }
            }
            catch (error) {
                _this.logger.warn(error);
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
        this.usePercentageValuesIndOnChange(this.uiForm.controls['UsePercentageValuesInd'].value);
        this.displayScheduleFields();
        if (this.uiForm.controls['ScheduleRotation'].value) {
            this.uiForm.controls['BranchServiceAreaCode'].setValue('?');
        }
    };
    ServiceCoverDisplayEntryComponent.prototype.setFormData = function () {
        for (var c in this.uiForm.controls) {
            if (this.uiForm.controls.hasOwnProperty(c)) {
                this.initialFormData[c] = this.uiForm.controls[c].value;
            }
        }
    };
    ServiceCoverDisplayEntryComponent.prototype.riMaintenanceBeforeUpdate = function () {
        this.displayScheduleFields();
        if (this.uiForm.controls['ScheduleRotation'].value) {
            this.uiForm.controls['BranchServiceAreaCode'].enable();
            this.pageParams.vbOrigScheduleID = this.uiForm.controls['ScheduleID'].value;
            this.pageParams.vbOrigScheduleType = this.uiForm.controls['selScheduleType'].value;
            if (this.uiForm.controls['ServiceCoverMode'].value === 'Normal') {
                if (this.uiForm.controls['UsePercentageValuesInd'].value) {
                    this.uiForm.controls['MaterialsValue'].disable();
                    this.uiForm.controls['LabourValue'].disable();
                    this.uiForm.controls['ReplacementValue'].disable();
                }
                else {
                    this.uiForm.controls['DisplayValue'].disable();
                }
            }
        }
    };
    ServiceCoverDisplayEntryComponent.prototype.beforeSaveUpdate = function (formdData) {
        var _this = this;
        if (this.uiForm.controls['MaterialsCost'].value === '0' || this.uiForm.controls['MaterialsCost'].value === '') {
            var postData = {};
            postData['ContractNumber'] = this.uiForm.controls['ContractNumber'].value;
            postData['PremiseNumber'] = this.uiForm.controls['PremiseNumber'].value;
            postData['ProductCode'] = this.uiForm.controls['ProductCode'].value;
            postData['ServiceCoverNumber'] = this.uiForm.controls['ServiceCoverNumber'].value;
            postData['ServiceCoverItemNumber'] = this.uiForm.controls['ServiceCoverItemNumber'].value;
            postData['Function'] = 'GetMaterialsCost';
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
                try {
                    if (data.MaterialsCost) {
                        _this.uiForm.controls['MaterialsCost'].setValue(data.MaterialsCost);
                    }
                    _this.updateServiceCover(formdData);
                }
                catch (error) {
                    _this.logger.warn(error);
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
        else {
            this.updateServiceCover(formdData);
        }
    };
    ServiceCoverDisplayEntryComponent.prototype.riMaintenanceBeforeFetch = function () {
        var _this = this;
        var scheduleSearch = this.uiForm.controls['ScheduleSearch'].value ? this.uiForm.controls['ScheduleSearch'].value : 'no';
        var postData = {};
        postData['ScheduleSearch'] = scheduleSearch;
        postData['ServiceCoverItemRowID'] = this.attributes.ServiceCoverItemRowID;
        postData['ServiceCoverROWID'] = this.uiForm.controls['ServiceCoverRowID'].value;
        postData['ContractNumber'] = this.uiForm.controls['ContractNumber'].value;
        postData['PremiseNumber'] = this.uiForm.controls['PremiseNumber'].value;
        postData['ProductCode'] = this.uiForm.controls['ProductCode'].value;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
            for (var cntrl in data) {
                if (data.hasOwnProperty(cntrl)) {
                    if (_this.uiForm.controls[cntrl]) {
                        if (cntrl === 'ReplacementIncludeInd' || cntrl === 'ServiceCoverRotation' || cntrl === 'UsePercentageValuesInd' || cntrl === 'ValidForDeletion' || cntrl === 'ScheduleRotation') {
                            _this.uiForm.controls[cntrl].setValue(data[cntrl] === 'yes' ? true : false);
                        }
                        else if (cntrl === 'EffectiveDate') {
                            var dateEarray = data[cntrl].split('/');
                            _this.currDate = new Date(dateEarray[2], dateEarray[1] - 1, dateEarray[0]);
                            _this.uiForm.controls[cntrl].setValue(data[cntrl]);
                        }
                        else if (cntrl === 'ExchangesStartAfterDate') {
                            var dateEAarray = data[cntrl].split('/');
                            _this.currDate2 = new Date(dateEAarray[2], dateEAarray[1] - 1, dateEAarray[0]);
                            _this.uiForm.controls[cntrl].setValue(data[cntrl]);
                        }
                        else {
                            _this.uiForm.controls[cntrl].setValue(data[cntrl]);
                        }
                    }
                }
            }
            _this.getCurrentWeek();
            _this.riMaintenanceAfterFetch();
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ServiceCoverDisplayEntryComponent.prototype.riMaintenanceAfterAbandon = function () {
        if (this.parentMode === 'DisplayUpd' || this.parentMode === 'ScheduleSearch') {
            this.getTotalValues();
        }
        else {
            if (this.uiForm.controls['UsePercentageValuesInd'].value) {
                this.fieldHidden.percentDisplay = false;
            }
            else {
                this.fieldHidden.percentDisplay = true;
            }
            if (this.uiForm.controls['ScheduleRotation'].value) {
                this.scheduleIDOonChange();
                if (this.uiForm.controls['ScheduleType'].value === 'C') {
                    this.deleteCustomSchedule();
                }
            }
        }
    };
    ServiceCoverDisplayEntryComponent.prototype.deleteCustomSchedule = function () {
        var _this = this;
        var postData = {};
        postData['ContractNumber'] = this.uiForm.controls['ContractNumber'].value;
        postData['PremiseNumber'] = this.uiForm.controls['PremiseNumber'].value;
        postData['ProductCode'] = this.uiForm.controls['ProductCode'].value;
        postData['ServiceCoverNumber'] = this.uiForm.controls['ServiceCoverNumber'].value;
        postData['ServiceCoverItemNumber'] = this.uiForm.controls['ServiceCoverItemNumber'].value;
        postData['Function'] = 'DeleteCustomSchedule';
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
            try {
            }
            catch (error) {
                _this.logger.warn(error);
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ServiceCoverDisplayEntryComponent.prototype.scheduleIDOonChange = function () {
        var _this = this;
        if (this.uiForm.controls['ScheduleID'].value) {
            var postData = {};
            postData['ScheduleID'] = 'BR';
            postData['Function'] = 'GetScheduleFields';
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
                try {
                    if (data.selScheduleType) {
                        _this.uiForm.controls['selScheduleType'].setValue(data.selScheduleType);
                    }
                    if (data.ScheduleName) {
                        _this.uiForm.controls['ScheduleName'].setValue(data.ScheduleName);
                    }
                    if (_this.uiForm.controls['ScheduleName'].value === 'BU' || _this.uiForm.controls['ScheduleName'].value === 'BR') {
                        _this.fieldRequired.ScheduleQty = true;
                    }
                    else {
                        _this.fieldRequired.ScheduleQty = false;
                    }
                    _this.updatedRequired();
                    if (!_this.setFormFlag.scheduleIDOonChange) {
                        _this.setFormData();
                        _this.setFormFlag.scheduleIDOonChange = true;
                    }
                }
                catch (error) {
                    _this.logger.warn(error);
                }
            }, function (error) {
                _this.errorService.emitError(error);
                _this.uiForm.controls['ScheduleID'].setValue('');
                _this.uiForm.controls['ScheduleName'].setValue('');
                _this.fieldRequired.ScheduleQty = false;
            });
        }
        else {
            this.uiForm.controls['ScheduleName'].setValue('');
            this.fieldRequired.ScheduleQty = false;
        }
        this.updatedRequired();
    };
    ServiceCoverDisplayEntryComponent.prototype.riMaintenanceAfterAbandonAdd = function () {
        var _this = this;
        var postData = {};
        postData['ContractNumber'] = this.uiForm.controls['ContractNumber'].value;
        postData['PremiseNumber'] = this.uiForm.controls['PremiseNumber'].value;
        postData['ProductCode'] = this.uiForm.controls['ProductCode'].value;
        postData['ServiceCoverNumber'] = this.uiForm.controls['ServiceCoverNumber'].value;
        postData['ServiceCoverItemNumber'] = this.uiForm.controls['ServiceCoverItemNumber'].value;
        postData['Function'] = 'DeleteCustomAddSchedule';
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
            _this.logger.info('Done');
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ServiceCoverDisplayEntryComponent.prototype.riMaintenanceAfterFetch = function () {
        if (this.uiForm.controls['RemovalDate'].value) {
            var rmdt = new Date(this.uiForm.controls['RemovalDate'].value), dt = new Date();
            if (rmdt.getTime() <= dt.getTime()) {
                this.disableButtons.update = false;
                this.disableButtons.delete = false;
            }
        }
        if (this.uiForm.controls['UsePercentageValuesInd'].value) {
            this.fieldHidden.percentDisplay = false;
            if (this.uiForm.controls['DisplayValue'].value) {
                this.displayValueOnChange();
            }
        }
        else {
            this.fieldHidden.percentDisplay = true;
        }
        this.displayScheduleFields();
        this.scheduleIDOonChange();
        this.branchServiceAreaCodeonChange();
        if (this.parentMode === 'ScheduleSearch') {
            this.getScheduleSearchFields();
        }
    };
    ServiceCoverDisplayEntryComponent.prototype.getScheduleSearchFields = function () {
        var _this = this;
        var postData = {};
        postData['ServiceCoverItemRowID'] = this.riExchange.getParentAttributeValue('ContractNumberServiceCoverItemRowID');
        postData['Function'] = 'GetScheduleSearchFields';
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
            try {
                if (data.ContractName) {
                    _this.uiForm.controls['ContractName'].setValue(data.ContractName);
                }
                if (data.PremiseName) {
                    _this.uiForm.controls['PremiseName'].setValue(data.PremiseName);
                }
                if (data.ProductDesc) {
                    _this.uiForm.controls['ProductDesc'].setValue(data.ProductDesc);
                }
                if (data.AccountNumber) {
                    _this.uiForm.controls['AccountNumber'].setValue(data.AccountNumber);
                }
                if (data.NegBranchNumber) {
                    _this.uiForm.controls['NegBranchNumber'].setValue(data.NegBranchNumber);
                }
                if (data.RequiresManualVisitPlanningInd) {
                    _this.uiForm.controls['RequiresManualVisitPlanningInd'].setValue(data.RequiresManualVisitPlanningInd);
                }
                if (data.AnnualCalendarInd) {
                    _this.uiForm.controls['AnnualCalendarInd'].setValue(data.AnnualCalendarInd);
                }
            }
            catch (error) {
                _this.logger.warn(error);
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ServiceCoverDisplayEntryComponent.prototype.riMaintenanceBeforeSaveAdd = function () {
        this.btnPopulateonclick();
    };
    ServiceCoverDisplayEntryComponent.prototype.materialsValueOnChange = function () {
        this.totalDisplayValues();
    };
    ServiceCoverDisplayEntryComponent.prototype.labourValueOnChange = function () {
        this.totalDisplayValues();
    };
    ServiceCoverDisplayEntryComponent.prototype.replacementValueOnChange = function () {
        this.totalDisplayValues();
    };
    ServiceCoverDisplayEntryComponent.prototype.renegOldContractOnchange = function () {
        this.utils.numberPadding(this.uiForm.controls['RenegOldContract'].value, 8);
    };
    ServiceCoverDisplayEntryComponent.prototype.totalDisplayValues = function () {
        var _this = this;
        var postData = {};
        postData['MaterialsValue'] = this.uiForm.controls['MaterialsValue'].value;
        postData['LabourValue'] = this.uiForm.controls['LabourValue'].value;
        postData['ReplacementValue'] = this.uiForm.controls['ReplacementValue'].value;
        postData['Function'] = 'TotalDisplayValues';
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
            if (data.DisplayValue) {
                _this.uiForm.controls['DisplayValue'].setValue(data.DisplayValue);
            }
            if (!_this.setFormFlag.totalDisplayValues) {
                _this.setFormData();
                _this.setFormFlag.totalDisplayValues = true;
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ServiceCoverDisplayEntryComponent.prototype.productRangeOnChange = function (index) {
        var _this = this;
        if (this.uiForm.controls['ProductRange' + index].value) {
            var postData = {};
            postData['ProductRange'] = this.uiForm.controls['ProductRange' + index].value;
            postData['ProductComponentCode'] = this.uiForm.controls['ProductComponentCode' + index].value;
            postData['Function'] = 'GetRangeDesc';
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
                if (data.ProductRangeDesc) {
                    _this.uiForm.controls['ProductRangeDesc' + index].setValue(data.ProductRangeDesc);
                }
                if (data.SequenceNumber) {
                    _this.uiForm.controls['SequenceNumber' + index].setValue(data.SequenceNumber);
                }
                if (data.RotationalInterval) {
                    _this.uiForm.controls['RotationalInterval' + index].setValue(data.RotationalInterval);
                }
            }, function (error) {
                _this.errorService.emitError(error);
                _this.uiForm.controls['ProductRange' + index].setValue('');
                _this.uiForm.controls['ProductRangeDesc' + index].setValue('');
                _this.uiForm.controls['SequenceNumber' + index].setValue('0');
                _this.uiForm.controls['RotationalInterval' + index].setValue('0');
            });
        }
        else {
            this.uiForm.controls['ProductRange' + index].setValue('');
            this.uiForm.controls['ProductRangeDesc' + index].setValue('');
            this.uiForm.controls['SequenceNumber' + index].setValue('0');
            this.uiForm.controls['RotationalInterval' + index].setValue('0');
        }
    };
    ServiceCoverDisplayEntryComponent.prototype.btnPopulateonclick = function () {
        var _this = this;
        var vbInclude = false;
        var postData = {};
        postData['ContractNumber'] = this.uiForm.controls['ContractNumber'].value;
        postData['PremiseNumber'] = this.uiForm.controls['PremiseNumber'].value;
        postData['ProductCode'] = this.uiForm.controls['ProductCode'].value;
        postData['ServiceCoverNumber'] = this.uiForm.controls['ServiceCoverNumber'].value;
        postData['MaxComponentLines'] = this.pageParams.vMaxComponentLines;
        postData['MaterialsCost'] = this.uiForm.controls['MaterialsCost'].value;
        for (var i = 1; i <= this.rowCount; i++) {
            postData['ComponentTypeCode' + i] = this.uiForm.controls['ComponentTypeCode' + i].value;
            postData['ProductComponentCode' + i] = this.uiForm.controls['ProductComponentCode' + i].value;
            postData['AlternateProductCode' + i] = this.uiForm.controls['AlternateProductCode' + i].value;
            postData['ComponentQuantity' + i] = this.uiForm.controls['ComponentQuantity' + i].value;
            postData['ProductRange' + i] = this.uiForm.controls['ProductRange' + i].value;
            postData['RotationalRule' + i] = this.uiForm.controls['RotationalRule' + i].value;
            postData['ProductRangeDesc' + i] = this.uiForm.controls['ProductRangeDesc' + i].value;
        }
        postData['Function'] = 'PopulateFields';
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
            try {
                for (var i = 1; i <= _this.rowCount; i++) {
                    vbInclude = true;
                    _this.uiForm.controls['ComponentTypeDesc' + i].setValue(data['ComponentTypeDesc' + i]);
                    _this.uiForm.controls['AlternateProductCode' + i].setValue(data['AlternateProductCode' + i]);
                    _this.uiForm.controls['ProductComponentCode' + i].setValue(data['ProductComponentCode' + i]);
                    _this.uiForm.controls['ProductRange' + i].setValue(data['ProductRange' + i]);
                    _this.uiForm.controls['ProductRangeDesc' + i].setValue(data['ProductRangeDesc' + i]);
                    _this.uiForm.controls['RotationalRule' + i].setValue(data['RotationalRule' + i]);
                    for (var _i = 0, _a = _this.pageParams.vbDummyProductCodes; _i < _a.length; _i++) {
                        var pobj = _a[_i];
                        if (_this.uiForm.controls['ProductComponentCode' + i].value) {
                            if (_this.uiForm.controls['ProductComponentCode' + i].value.toLowerCase() === pobj.toLowerCase() && _this.uiForm.controls['ProductComponentDesc' + i].value) {
                                vbInclude = false;
                                break;
                            }
                        }
                    }
                    if (vbInclude === true) {
                        _this.uiForm.controls['ProductComponentDesc' + i].setValue(data['ProductComponentDesc' + i]);
                    }
                    if (_this.uiForm.controls['RotationalRule' + i].value) {
                        if (_this.uiForm.controls['RotationalRule' + i].value.toLowerCase() === 'c' || _this.uiForm.controls['RotationalRule' + i].value.toLowerCase() === 's') {
                            _this.fieldHidden['RotationalInterval' + i] = false;
                        }
                        else {
                            _this.fieldHidden['RotationalInterval' + i] = true;
                        }
                    }
                    else {
                        _this.fieldHidden['RotationalInterval' + i] = true;
                    }
                    _this.uiForm.controls['MaterialsCost'].setValue(data.MaterialsCost);
                }
            }
            catch (error) {
                _this.logger.warn(error);
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ServiceCoverDisplayEntryComponent.prototype.branchServiceAreaCodeonChange = function () {
        var _this = this;
        if (this.uiForm.controls['BranchServiceAreaCode'].value) {
            var postData = {};
            postData['BranchNumber'] = this.uiForm['ServiceBranchNumber'].value;
            postData['BranchServiceAreaCode'] = this.uiForm['BranchServiceAreaCode'].value;
            postData['Function'] = 'GetBranchServiceArea';
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
                try {
                    if (data.BranchServiceAreaDesc) {
                        _this.uiForm.controls['BranchServiceAreaDesc'].setValue(data.BranchServiceAreaDesc);
                    }
                    if (data.ScheduleEmployeeCode) {
                        _this.uiForm.controls['ScheduleEmployeeCode'].setValue(data.ScheduleEmployeeCode);
                    }
                    if (data.ScheduleEmployeeName) {
                        _this.uiForm.controls['ScheduleEmployeeName'].setValue(data.ScheduleEmployeeName);
                    }
                    if (!_this.setFormFlag.branchServiceAreaCodeonChange) {
                        _this.setFormData();
                        _this.setFormFlag.branchServiceAreaCodeonChange = true;
                    }
                }
                catch (error) {
                    _this.logger.warn(error);
                }
            }, function (error) {
                _this.errorService.emitError(error);
                _this.uiForm.controls['BranchServiceAreaCode'].setValue('');
                _this.uiForm.controls['BranchServiceAreaDesc'].setValue('');
                _this.uiForm.controls['ScheduleEmployeeCode'].setValue('');
                _this.uiForm.controls['ScheduleEmployeeName'].setValue('');
            });
        }
        else {
            this.uiForm.controls['BranchServiceAreaDesc'].setValue('');
            this.uiForm.controls['ScheduleEmployeeCode'].setValue('');
            this.uiForm.controls['ScheduleEmployeeName'].setValue('');
        }
    };
    ServiceCoverDisplayEntryComponent.prototype.riMaintenanceAfterNormalAfterSave = function () {
        if (this.parentMode === 'DisplayUpd' || this.parentMode === 'ScheduleSearch') {
            this.pageParams.mode = 'add';
            this.getTotalValues();
        }
        this.pageParams.vbOrigScheduleID = '';
        this.pageParams.vbOrigScheduleType = '';
    };
    ServiceCoverDisplayEntryComponent.prototype.riExchangeQueryUnloadHTMLDocument = function () {
        var _this = this;
        if (this.parentMode === 'ServiceCoverAdd') {
            var postData = {};
            postData['ServiceCoverRowID'] = this.riExchange.getParentHTMLValue('ServiceCoverRowID');
            postData['Function'] = 'CheckDisplayExists';
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
                try {
                    if (data.errorMessage) {
                        _this.messageModal.show({ msg: data.errorMessage, title: _this.pageTitle }, false);
                    }
                }
                catch (error) {
                    _this.logger.warn(error);
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
    };
    ServiceCoverDisplayEntryComponent.prototype.riMaintenanceBeforeAbandonAdd = function () {
        var _this = this;
        var vbCustomComponents = '';
        for (var i = 1; i <= this.pageParams.vMaxComponentLines; i++) {
            if (this.uiForm.controls['RotationalRule' + i].value === 'C') {
                if (vbCustomComponents === '') {
                    vbCustomComponents += i;
                }
                else {
                    vbCustomComponents += '|' + i;
                }
            }
        }
        var postData = {};
        postData['ContractNumber'] = this.uiForm.controls['ContractNumber'].value;
        postData['PremiseNumber'] = this.uiForm.controls['PremiseNumber'].value;
        postData['ProductCode'] = this.uiForm.controls['ProductCode'].value;
        postData['ServiceCoverNumber'] = this.uiForm.controls['ServiceCoverNumber'].value;
        postData['SCComponentNumberList'] = vbCustomComponents;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
            _this.logger.info('Done');
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ServiceCoverDisplayEntryComponent.prototype.premiseLocationNumberOnChange = function () {
        var _this = this;
        if (this.uiForm.controls['PremiseLocationNumber'].value) {
            var postData = {};
            postData['ContractNumber'] = this.uiForm.controls['ContractNumber'].value;
            postData['PremiseNumber'] = this.uiForm.controls['PremiseNumber'].value;
            postData['PremiseLocationNumber'] = this.uiForm.controls['PremiseLocationNumber'].value;
            postData['Function'] = 'GetLocationDesc';
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
                try {
                    if (data.errorMessage && data.errorMessage !== '') {
                        _this.messageModal.show({ msg: data.errorMessage, title: _this.pageTitle }, false);
                    }
                    else {
                        _this.uiForm.controls['PremiseLocationDesc'].setValue(data.PremiseLocationDesc);
                    }
                }
                catch (error) {
                    _this.logger.warn(error);
                }
                if (!_this.setFormFlag.premiseLocationNumberOnChange) {
                    _this.setFormData();
                    _this.setFormFlag.premiseLocationNumberOnChange = true;
                }
            }, function (error) {
                _this.errorService.emitError(error);
                _this.uiForm.controls['PremiseLocationNumber'].setValue('');
                _this.uiForm.controls['PremiseLocationDesc'].setValue('');
            });
        }
        else {
            this.uiForm.controls['PremiseLocationDesc'].setValue('');
        }
    };
    ServiceCoverDisplayEntryComponent.prototype.getTotalValues = function () {
        var _this = this;
        var postData = {};
        postData['ServiceCoverRowID'] = this.uiForm.controls['ServiceCoverRowID'].value;
        postData['EffectiveDate'] = this.uiForm.controls['EffectiveDate'].value;
        postData['Function'] = 'GetServiceCoverTotals';
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
            try {
                if (data.TotalQty)
                    _this.uiForm.controls['TotalQty'].setValue(data.TotalQty);
                if (data.TotalValue)
                    _this.uiForm.controls['TotalValue'].setValue(data.TotalValue);
                if (data.TotalWEDValue)
                    _this.uiForm.controls['TotalWEDValue'].setValue(data.TotalWEDValue);
            }
            catch (error) {
                _this.logger.warn(error);
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ServiceCoverDisplayEntryComponent.prototype.displayScheduleFields = function () {
        if (this.uiForm.controls['ScheduleRotation'].value === false) {
            this.fieldHidden.CurrentWeek = true;
            this.fieldHidden.ScheduleID = true;
            this.fieldHidden.ScheduleDetails = true;
            this.fieldHidden.ScheduleName = true;
            this.fieldHidden.ScheduleQty = true;
            this.fieldHidden.ExchangesStartAfterDate = true;
            this.fieldHidden.BranchServiceAreaCode = true;
            this.fieldHidden.ExchangesGenUpTo = true;
            this.fieldHidden.InitialComponentsDate = true;
            this.fieldRequired.ScheduleID = false;
            this.fieldRequired.ExchangesStartAfterDate = false;
        }
        else {
            this.fieldHidden.CurrentWeek = false;
            this.fieldHidden.ScheduleID = false;
            this.fieldHidden.ScheduleDetails = false;
            this.fieldHidden.ScheduleName = false;
            this.fieldHidden.ScheduleQty = false;
            this.fieldHidden.ExchangesStartAfterDate = false;
            this.fieldHidden.BranchServiceAreaCode = false;
            this.fieldHidden.ExchangesGenUpTo = false;
            this.fieldRequired.ScheduleID = true;
            this.fieldRequired.ExchangesStartAfterDate = true;
            this.fieldHidden.InitialComponentsDate = false;
        }
        this.updatedRequired();
    };
    ServiceCoverDisplayEntryComponent.prototype.getCurrentWeek = function () {
        var _this = this;
        var postData = {};
        postData['Function'] = 'GetCurrentWeek';
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
            try {
                if (data.CurrentWeek)
                    _this.uiForm.controls['CurrentWeek'].setValue(data.CurrentWeek);
            }
            catch (error) {
                _this.logger.warn(error);
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ServiceCoverDisplayEntryComponent.prototype.cmdScheduleHeaderOnClick = function () {
        if (this.pageParams.mode === 'add' || this.pageParams.mode === 'update') {
            if (this.uiForm.controls['ScheduleID'].value === '' && this.pageParams.vbOrigScheduleType !== 'C') {
                this.pageParams.queryParamMode = 'AddSchedule';
            }
            else {
                if (this.uiForm.controls['ScheduleID'].value === '' && this.pageParams.vbOrigScheduleType === 'C') {
                    this.uiForm.controls['ScheduleID'].setValue(this.pageParams.vbOrigScheduleID);
                    this.scheduleIDOonChange();
                }
                this.pageParams.queryParamMode = 'ViewSchedule';
            }
            this.messageModal.show({ msg: 'iCABSBScheduleHeaderMaintenance is not yet developed', title: this.pageTitle }, false);
            if (this.pageParams.queryParamMode === 'AddSchedule') {
                this.scheduleIDOonChange();
            }
        }
        else {
            if (this.uiForm.controls['ScheduleID'].value !== '') {
                this.pageParams.queryParamMode = 'ViewSchedule';
                this.messageModal.show({ msg: 'iCABSBScheduleHeaderMaintenance is not yet developed', title: this.pageTitle }, false);
            }
        }
    };
    ServiceCoverDisplayEntryComponent.prototype.cmdScheduleDetailsOnClick = function () {
        if (this.uiForm.controls['ScheduleID'].value !== '') {
            this.pageParams.queryParamMode = 'ViewScheduleDetails';
            this.messageModal.show({ msg: 'iCABSBScheduleDetailGrid is not yet developed', title: this.pageTitle }, false);
        }
    };
    ServiceCoverDisplayEntryComponent.prototype.btnCustomUpdateOnClick = function (index) {
        this.genCheckValidProduct(index);
    };
    ServiceCoverDisplayEntryComponent.prototype.genCheckValidProduct = function (index) {
        var _this = this;
        var postData = {};
        postData['Function'] = 'CheckValidProduct';
        postData['ProductComponentCode'] = this.uiForm.controls['ProductComponentCode' + index].value;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
            try {
                if (data.ErrorMessageDesc) {
                    _this.messageModal.show({ msg: data.ErrorMessageDesc, title: _this.pageTitle }, false);
                }
                else {
                    _this.uiForm.controls['SelComponentNumber'].setValue(index.toString());
                    _this.uiForm.controls['SelProductComponentCode'].setValue(_this.uiForm.controls['ProductComponentCode' + index].value);
                    _this.uiForm.controls['SelProductRange'].setValue(_this.uiForm.controls['ProductRange' + index].value);
                    _this.uiForm.controls['SelProductRangeDesc'].setValue(_this.uiForm.controls['ProductRangeDesc' + index].value);
                    _this.uiForm.controls['RangeDetailSeqNo'].setValue(_this.uiForm.controls['RangeDetailSeqNo' + index].value);
                    _this.uiForm.controls['RangeDetailInterval'].setValue(_this.uiForm.controls['RangeDetailInterval' + index].value);
                    _this.uiForm.controls['SelComponentNumber'].setValue('');
                    _this.uiForm.controls['SelProductComponentCode'].setValue('');
                    _this.uiForm.controls['SelProductRange'].setValue('');
                    _this.uiForm.controls['SelProductRangeDesc'].setValue('');
                    _this.uiForm.controls['SequenceNumber' + index].setValue(_this.uiForm.controls['RangeDetailSeqNo'].value);
                    _this.uiForm.controls['RangeDetailInterval'].setValue(_this.uiForm.controls['RangeDetailInterval'].value);
                }
            }
            catch (error) {
                _this.logger.warn(error);
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ServiceCoverDisplayEntryComponent.prototype.buildMenuOptions = function () {
        this.menuOptionsGroupscd = [];
        this.menuOptionsGroupsc = [];
        this.menuOptionsGroupscd.push({ text: 'Service Item Values', value: 'ServiceItemValues' });
        this.menuOptionsGroupscd.push({ text: 'Replacement History', value: 'ReplacementHistory' });
        this.menuOptionsGroupsc.push({ text: 'Planned Visits', value: 'PlannedVisits' });
        this.menuOptionsGroupsc.push({ text: 'Static Visits (SOS)', value: 'StaticVisits' });
        this.menuOptionsGroupsc.push({ text: 'Visit History', value: 'VisitHistory' });
        if (this.pageParams.vEnableLocations) {
            this.menuOptionsGroupsc.push({ text: 'Location', value: 'Location' });
        }
        this.menuOptionsGroupsc.push({ text: 'Service Cover History', value: 'ServiceCoverHistory' });
        this.menuOptionsGroupsc.push({ text: 'Service Values', value: 'ServiceValues' });
        this.menuOptionsGroupsc.push({ text: 'Pro Rata Charge', value: 'ProRata' });
        this.menuOptionsGroupsc.push({ text: 'Invoice History', value: 'InvoiceHistory' });
        this.menuOptionsGroupsc.push({ text: 'State of Service', value: 'StateOfService' });
        this.menuOptionsGroupsc.push({ text: 'Event History', value: 'EventHistory' });
        if (this.uiForm.controls['EmployeeLimitChildDrillOptions'].value !== 'Y') {
            this.menuOptionsGroupsc.push({ text: 'Contract', value: 'Contract' });
            this.menuOptionsGroupsc.push({ text: 'Premises', value: 'Premises' });
        }
        if (this.pageParams.contractType === 'C') {
            this.menuOptionsGroupsc.push({ text: 'Service Seasons', value: 'SeasonalService' });
            this.menuOptionsGroupsc.push({ text: 'Calendar', value: 'ServiceCalendar' });
            this.menuOptionsGroupsc.push({ text: 'Closed', value: 'ClosedCalendar' });
        }
        this.menuOptionsGroupsc.push({ text: 'Customer Information', value: 'CustomerInformation' });
        if (this.pageParams.contractType === 'C' || this.pageParams.contractType === 'J') {
            this.menuOptionsGroupsc.push({ text: 'Service Visit Planning', value: 'ServiceVisitPlanning' });
        }
    };
    ServiceCoverDisplayEntryComponent.prototype.onAssignEmployeeDataReceived = function (data) {
        this.uiForm.controls['ServiceSalesEmployee'].setValue(data.ServiceSalesEmployee);
        this.uiForm.controls['EmployeeSurname'].setValue(data.EmployeeSurname);
    };
    ServiceCoverDisplayEntryComponent.prototype.onInstallationEmployeeCodDataReceived = function (data) {
        this.uiForm.controls['InstallationEmployeeCode'].setValue(data.InstallationEmployeeCode);
        this.uiForm.controls['InstallationEmployeeName'].setValue(data.InstallationEmployeeName);
    };
    ServiceCoverDisplayEntryComponent.prototype.menuonChange = function (menu) {
        switch (menu) {
            case 'ServiceItemValues':
                this.messageModal.show({ msg: 'iCABSAServiceItemValues is not yet developed', title: this.pageTitle }, false);
                break;
            case 'ReplacementHistory':
                this.messageModal.show({ msg: 'iCABSAServiceItemValues is not yet developed', title: this.pageTitle }, false);
                break;
            case 'PlannedVisits':
                this.router.navigate(['/grid/application/contract/planVisitGridYear'], {
                    queryParams: {
                        'parentMode': 'ServiceCover',
                        'CurrentContractTypeURLParameter': this.pageParams.contractType,
                        'ContractNumber': this.uiForm.controls['ContractNumber'].value,
                        'PremiseNumber': this.uiForm.controls['PremiseNumber'].value,
                        'ProductCode': this.uiForm.controls['ProductCode'].value,
                        'ServiceCoverRowID': this.uiForm.controls['ServiceCoverRowID'].value
                    }
                });
                break;
            case 'StaticVisits':
                this.router.navigate(['grid/application/service/StaticVisitGridYear'], {
                    queryParams: {
                        'parentMode': 'ServiceCover',
                        'CurrentContractTypeURLParameter': this.pageParams.contractType,
                        'ContractNumber': this.uiForm.controls['ContractNumber'].value,
                        'ContractName': this.uiForm.controls['ContractName'].value,
                        'PremiseNumber': this.uiForm.controls['PremiseNumber'].value,
                        'PremiseName': this.uiForm.controls['PremiseName'].value,
                        'ProductCode': this.uiForm.controls['ProductCode'].value,
                        'ProductDesc': this.uiForm.controls['ProductDesc'].value,
                        'ServiceCoverRowID': this.uiForm.controls['ServiceCoverRowID'].value
                    }
                });
                break;
            case 'VisitHistory':
                if (this.pageParams.blnAccess) {
                    this.store.dispatch({
                        type: ContractActionTypes.SAVE_DATA,
                        payload: {
                            'CurrentContractTypeURLParameter': this.pageParams.contractType,
                            'ContractNumber': this.uiForm.controls['ContractNumber'].value,
                            'ContractName': this.uiForm.controls['ContractName'].value,
                            'PremiseNumber': this.uiForm.controls['PremiseNumber'].value,
                            'PremiseName': this.uiForm.controls['PremiseName'].value,
                            'ProductCode': this.uiForm.controls['ProductCode'].value,
                            'ProductDesc': this.uiForm.controls['ProductDesc'].value,
                            'ServiceCoverRowID': this.uiForm.controls['ServiceCoverRowID'].value,
                            'currentContractType': this.pageParams.contractType
                        }
                    });
                    this.navigate('ServiceCover', 'grid/contractmanagement/maintenance/contract/visitsummary');
                }
                break;
            case 'Location':
                if (this.pageParams.blnAccess) {
                    this.navigate('Premise-Allocate', 'grid/application/EmptyPremiseLocationSearchGrid');
                }
                break;
            case 'ServiceCoverHistory':
                if (this.pageParams.blnAccess) {
                    this.router.navigate(['grid/application/contract/history'], {
                        queryParams: {
                            'parentMode': 'ServiceCover',
                            'CurrentContractTypeURLParameter': this.pageParams.contractType,
                            'ContractNumber': this.uiForm.controls['ContractNumber'].value,
                            'ContractName': this.uiForm.controls['ContractName'].value,
                            'PremiseNumber': this.uiForm.controls['PremiseNumber'].value,
                            'PremiseName': this.uiForm.controls['PremiseName'].value,
                            'ProductCode': this.uiForm.controls['ProductCode'].value,
                            'ProductDesc': this.uiForm.controls['ProductDesc'].value,
                            'AccountNumber': this.uiForm.controls['AccountNumber'].value,
                            'ServiceCoverNumber': this.uiForm.controls['ServiceCoverNumber'].value,
                            'ServiceCoverRowID': this.uiForm.controls['ServiceCoverRowID'].value,
                            'currentContractType': this.pageParams.contractType
                        }
                    });
                }
                break;
            case 'ServiceValues':
                if (this.pageParams.blnAccess) {
                    this.router.navigate(['grid/contractmanagement/account/serviceValue'], {
                        queryParams: {
                            'parentMode': 'ServiceCoverAll',
                            'AccountNumber': this.uiForm.controls['AccountNumber'].value,
                            'CurrentContractTypeURLParameter': this.pageParams.contractType,
                            'ContractNumber': this.uiForm.controls['ContractNumber'].value,
                            'ContractName': this.uiForm.controls['ContractName'].value,
                            'PremiseNumber': this.uiForm.controls['PremiseNumber'].value,
                            'PremiseName': this.uiForm.controls['PremiseName'].value,
                            'ProductCode': this.uiForm.controls['ProductCode'].value,
                            'ProductDesc': this.uiForm.controls['ProductDesc'].value,
                            'ServiceCoverRowID': this.uiForm.controls['ServiceCoverRowID'].value
                        }
                    });
                }
                break;
            case 'ProRata':
                if (this.pageParams.blnAccess) {
                    this.navigate('ServiceCover', 'grid/application/proRatacharge/summary', { 'CurrentContractTypeURLParameter': this.pageParams.contractType, 'currentContractType': this.pageParams.contractType });
                }
                break;
            case 'InvoiceHistory':
                if (this.pageParams.blnAccess) {
                    this.router.navigate(['/billtocash/contract/invoice'], {
                        queryParams: {
                            parentMode: 'Product',
                            'ContractNumber': this.uiForm.controls['ContractNumber'].value,
                            'ContractName': this.uiForm.controls['ContractName'].value,
                            'PremiseNumber': this.uiForm.controls['PremiseNumber'].value,
                            'PremiseName': this.uiForm.controls['PremiseName'].value,
                            'ProductCode': this.uiForm.controls['ProductCode'].value,
                            'ProductDesc': this.uiForm.controls['ProductDesc'].value
                        }
                    });
                }
                break;
            case 'StateOfService':
                if (this.pageParams.blnAccess) {
                    this.messageModal.show({ msg: 'iCABSSeStateOfServiceNatAccountGrid is not yet developed', title: this.pageTitle }, false);
                }
                break;
            case 'EventHistory':
                this.navigate('ServiceCover', 'grid/contactmanagement/customercontactHistorygrid');
                break;
            case 'Contract':
                this.router.navigate([this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE], {
                    queryParams: {
                        parentMode: 'ServiceCover',
                        'AccountNumber': this.uiForm.controls['AccountNumber'].value,
                        'CurrentContractTypeURLParameter': this.pageParams.contractType,
                        'CurrentContractType': this.pageParams.contractType,
                        'ContractNumber': this.uiForm.controls['ContractNumber'].value
                    }
                });
                break;
            case 'Premises':
                this.navigate('ServiceCover', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, {
                    CurrentContractTypeURLParameter: this.pageParams.contractType,
                    ContractNumber: this.uiForm.controls['ContractNumber'].value,
                    PremiseNumber: this.uiForm.controls['PremiseNumber'].value,
                    ProductCode: this.uiForm.controls['ProductCode'].value,
                    CurrentContractType: this.pageParams.contractType
                });
                break;
            case 'ServiceCalendar':
                if (this.uiForm.controls['RequiresManualVisitPlanningInd'].value === false) {
                    if (this.uiForm.controls['AnnualCalendarInd'].value) {
                        this.navigate('ServiceCover', 'grid/application/ServiceCoverCalendarDate', {
                            'AccountNumber': this.uiForm.controls['AccountNumber'].value,
                            'CurrentContractTypeURLParameter': this.pageParams.contractType,
                            'ContractNumber': this.uiForm.controls['ContractNumber'].value,
                            'ContractName': this.uiForm.controls['ContractName'].value,
                            'PremiseNumber': this.uiForm.controls['PremiseNumber'].value,
                            'PremiseName': this.uiForm.controls['PremiseName'].value,
                            'ProductCode': this.uiForm.controls['ProductCode'].value,
                            'ProductDesc': this.uiForm.controls['ProductDesc'].value,
                            'SCRowID': this.uiForm.controls['ServiceCoverRowID'].value,
                            currentContractType: this.pageParams.contractType
                        });
                    }
                }
                break;
            case 'SeasonalService':
                this.router.navigate(['grid/application/servicecover/seasongrid'], {
                    queryParams: {
                        'parentMode': 'ServiceCover',
                        'AccountNumber': this.uiForm.controls['AccountNumber'].value,
                        'CurrentContractTypeURLParameter': this.pageParams.contractType,
                        'ContractNumber': this.uiForm.controls['ContractNumber'].value,
                        'ContractName': this.uiForm.controls['ContractName'].value,
                        'PremiseNumber': this.uiForm.controls['PremiseNumber'].value,
                        'PremiseName': this.uiForm.controls['PremiseName'].value,
                        'ProductCode': this.uiForm.controls['ProductCode'].value,
                        'ProductDesc': this.uiForm.controls['ProductDesc'].value,
                        'ServiceCoverRowID': this.uiForm.controls['ServiceCoverRowID'].value
                    }
                });
                break;
            case 'ClosedCalendar':
                if (this.uiForm.controls['RequiresManualVisitPlanningInd'].value === false) {
                    this.messageModal.show({ msg: 'iCABSAServiceCoverClosedDateGrid is not yet developed', title: this.pageTitle }, false);
                }
                break;
            case 'CustomerInformation':
                this.navigate('ServiceCover', 'grid/contractmanagement/maintenance/contract/customerinformation', {
                    'AccountNumber': this.uiForm.controls['AccountNumber'].value,
                    'CurrentContractTypeURLParameter': this.pageParams.contractType,
                    'ContractNumber': this.uiForm.controls['ContractNumber'].value,
                    'ContractName': this.uiForm.controls['ContractName'].value,
                    'currentContractType': this.pageParams.contractType
                });
                break;
            case 'ServiceVisitPlanning':
                if (this.uiForm.controls['RequiresManualVisitPlanningInd'].value) {
                    this.messageModal.show({ msg: 'iCABSAServiceVisitPlanningGrid is not yet developed', title: this.pageTitle }, false);
                }
                else {
                    this.messageModal.show({ msg: MessageConstant.Message.productNotRequired, title: this.pageTitle }, false);
                }
                break;
            default:
                break;
        }
    };
    ServiceCoverDisplayEntryComponent.prototype.componentTypeCodeOnChange = function (index) {
        this.uiForm.controls['ComponentQuantity' + index].enable();
        if (this.uiForm.controls['ComponentTypeCode' + index].value !== '') {
            for (var _i = 0, _a = this.pageParams.vbSingleQtyComponents; _i < _a.length; _i++) {
                var vcomp = _a[_i];
                if (this.uiForm.controls['ComponentTypeCode' + index].value.toLowerCase() === vcomp.toLowerCase()) {
                    this.uiForm.controls['ComponentQuantity' + index].setValue('1');
                    this.uiForm.controls['ComponentQuantity' + index].disable();
                }
            }
            this.fieldRequired['ProductComponentCode' + index] = true;
            this.fieldRequired['ComponentQuantity' + index] = true;
            this.populateAttributes(index);
            this.fieldHidden.InitialComponentsDate = true;
        }
        else {
            this.fieldRequired['ProductComponentCode' + index] = false;
            this.fieldRequired['ComponentQuantity' + index] = false;
            this.fieldRequired['AttributeValueA' + index] = false;
            this.fieldRequired['AttributeValueB' + index] = false;
            this.uiForm.controls['ComponentTypeCode' + index].setValue('');
            this.uiForm.controls['ComponentTypeDesc' + index].setValue('');
            this.uiForm.controls['ProductComponentCode' + index].setValue('');
            this.uiForm.controls['AttributeCodeA' + index].setValue('');
            this.uiForm.controls['AttributeLabelA' + index].setValue('');
            this.uiForm.controls['AttributeValueA' + index].setValue('');
            this.uiForm.controls['AttributeCodeB' + index].setValue('');
            this.uiForm.controls['AlternateProductCode' + index].setValue('');
            this.uiForm.controls['AttributeValueA' + index].setValue('');
            this.uiForm.controls['ProductComponentDesc' + index].setValue('');
            this.uiForm.controls['ComponentQuantity' + index].setValue('');
        }
        this.updatedRequired();
    };
    ServiceCoverDisplayEntryComponent.prototype.populateAttributes = function (index) {
        var _this = this;
        var postData = {};
        postData['ComponentTypeCode'] = this.uiForm.controls['ComponentTypeCode' + index].value;
        postData['ProductCode'] = this.uiForm.controls['ProductCode'].value;
        postData['Function'] = 'PopulateAttributes';
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
            try {
                if (data.AttributeLabelA)
                    _this.uiForm.controls['AttributeLabelA' + index].setValue(data.AttributeLabelA);
                if (data.AttributeLabelB)
                    _this.uiForm.controls['AttributeLabelB' + index].setValue(data.AttributeLabelB);
                if (data.AttributeCodeA)
                    _this.uiForm.controls['AttributeCodeA' + index].setValue(data.AttributeCodeA);
                if (data.AttributeCodeB)
                    _this.uiForm.controls['AttributeCodeB' + index].setValue(data.AttributeCodeB);
                if (data.AttributeMandatoryA) {
                    _this.fieldRequired['AttributeValueA' + index] = true;
                }
                else {
                    _this.fieldRequired['AttributeValueA' + index] = false;
                }
                if (data.AttributeMandatoryB) {
                    _this.fieldRequired['AttributeValueB' + index] = true;
                }
                else {
                    _this.fieldRequired['AttributeValueB' + index] = false;
                }
                _this.updatedRequired();
            }
            catch (error) {
                _this.logger.warn(error);
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ServiceCoverDisplayEntryComponent.prototype.saveData = function () {
        for (var c in this.uiForm.controls) {
            if (this.uiForm.controls.hasOwnProperty(c)) {
                if (typeof this.uiForm.controls[c].value === 'undefined') {
                    this.uiForm.controls[c].setValue('');
                }
                if (this.uiForm.controls[c].invalid) {
                    this.uiForm.controls[c].markAsTouched();
                    if (c === 'EffectiveDate') {
                        this.effectiveDateChild.validateDateField();
                    }
                }
            }
        }
        if (this.uiForm.valid) {
            this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
            this.promptConfirmModal.show();
        }
    };
    ServiceCoverDisplayEntryComponent.prototype.promptConfirm = function (type) {
        var formdData = {};
        switch (type) {
            case 'save':
                var formdData_1 = {};
                if (this.pageParams.mode === 'update' && this.uiForm.controls['ServiceCoverRowID'].value !== '') {
                    for (var c in this.uiForm.controls) {
                        if (this.uiForm.controls.hasOwnProperty(c)) {
                            if (this.uiForm.controls[c].value) {
                                if (c === 'ServiceCoverRowID') {
                                    formdData_1['ServiceCoverROWID'] = this.uiForm.controls[c].value;
                                }
                                else if (c === 'ReplacementIncludeInd' || c === 'ServiceCoverRotation' || c === 'UsePercentageValuesInd' || c === 'ValidForDeletion' || c === 'ScheduleRotation') {
                                    formdData_1[c] = (this.uiForm.controls[c].value) ? 'yes' : 'no';
                                }
                                else {
                                    formdData_1[c] = this.uiForm.controls[c].value;
                                }
                            }
                        }
                    }
                    this.beforeSaveUpdate(formdData_1);
                }
                else {
                    for (var i = 1; i <= this.pageParams.vMaxComponentLines; i++) {
                        for (var c in this.uiForm.controls) {
                            if (this.uiForm.controls.hasOwnProperty(c)) {
                                if (this.uiForm.controls[c].value) {
                                    if (c === 'ServiceCoverRowID') {
                                        formdData_1['ServiceCoverROWID'] = this.uiForm.controls[c].value;
                                    }
                                    else if (c === 'ReplacementIncludeInd' || c === 'ServiceCoverRotation' || c === 'UsePercentageValuesInd' || c === 'ValidForDeletion' || c === 'ScheduleRotation') {
                                        formdData_1[c] = (this.uiForm.controls[c].value) ? 'yes' : 'no';
                                    }
                                    else if (c === 'ServiceCoverMode') {
                                        formdData_1['DisplayMode'] = this.uiForm.controls[c].value;
                                    }
                                    else {
                                        formdData_1[c] = this.uiForm.controls[c].value;
                                    }
                                }
                            }
                        }
                        for (var i_1 = 1; i_1 <= this.rowCount; i_1++) {
                            for (var cnt = 0; cnt < this.ComponentColumnList.length; cnt++) {
                                formdData_1[this.ComponentColumnList[cnt] + i_1] = this.uiForm.controls[this.ComponentColumnList[cnt] + i_1].value;
                            }
                        }
                    }
                    formdData_1['MaxComponentLines'] = 50;
                    this.addServiceCover(formdData_1);
                }
                break;
            case 'delete':
                this.deleteServiceCover();
                break;
            default:
                break;
        }
        this.formPristine();
    };
    ServiceCoverDisplayEntryComponent.prototype.deleteData = function (obj) {
        this.promptConfirmContent = MessageConstant.Message.DeleteRecord;
        this.promptConfirmModalDelete.show();
    };
    ServiceCoverDisplayEntryComponent.prototype.addServiceCover = function (frmdata) {
        var _this = this;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '1');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSource.next(AjaxConstant.START);
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, frmdata).subscribe(function (e) {
            try {
                if (typeof e['status'] !== 'undefined' && e['status'] === 'failure') {
                    _this.errorService.emitError(e.status);
                }
                else {
                    if ((typeof e !== 'undefined' && e.errorMessage)) {
                        _this.errorService.emitError(e.errorMessage);
                    }
                    else if (typeof e !== 'undefined' && e.Prospect !== '') {
                        _this.messageModal.show({ msg: 'Data added successfully', title: 'Message' }, false);
                    }
                }
            }
            catch (error) {
                _this.logger.warn(error);
            }
            _this.ajaxSource.next(AjaxConstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(AjaxConstant.COMPLETE);
        });
    };
    ServiceCoverDisplayEntryComponent.prototype.updateServiceCover = function (frmdata) {
        var _this = this;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSource.next(AjaxConstant.START);
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, frmdata).subscribe(function (e) {
            try {
                if (typeof e['status'] !== 'undefined' && e['status'] === 'failure') {
                    _this.errorService.emitError(e.status);
                }
                else {
                    if ((typeof e !== 'undefined' && e.errorMessage)) {
                        _this.messageModal.show({ msg: e.errorMessage, title: 'Message' }, false);
                        _this.errorService.emitError(e.errorMessage);
                    }
                    else if (typeof e !== 'undefined' && e.Prospect !== '') {
                        _this.messageModal.show({ msg: MessageConstant.Message.SavedSuccessfully, title: 'Message' }, false);
                    }
                }
            }
            catch (error) {
                _this.logger.warn(error);
            }
            _this.ajaxSource.next(AjaxConstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(AjaxConstant.COMPLETE);
        });
    };
    ServiceCoverDisplayEntryComponent.prototype.deleteServiceCover = function () {
        var _this = this;
        var postData = {};
        postData['ServiceCoverRowID'] = this.uiForm.controls['ServiceCoverRowID'].value;
        postData['ServiceCoverNumber'] = this.uiForm.controls['ServiceCoverNumber'].value;
        postData['ContractNumber'] = this.uiForm.controls['ContractNumber'].value;
        postData['PremiseNumber'] = this.uiForm.controls['PremiseNumber'].value;
        postData['ProductCode'] = this.uiForm.controls['ProductCode'].value;
        postData['DisplayMode'] = this.uiForm.controls['ServiceCoverMode'].value;
        postData['ServiceCoverItemRowID'] = this.attributes.ServiceCoverItemRowID;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '3');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSource.next(AjaxConstant.START);
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
            try {
                if (data.errorMessage) {
                    _this.messageModal.show({ msg: data['errorMessage'], title: _this.pageTitle }, false);
                }
                else {
                    _this.messageModal.show({ msg: 'Data deleted successfully', title: 'Message' }, false);
                }
            }
            catch (error) {
                _this.logger.warn(error);
            }
            _this.ajaxSource.next(AjaxConstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(AjaxConstant.COMPLETE);
        });
    };
    ServiceCoverDisplayEntryComponent.prototype.resetFormdata = function () {
        for (var c in this.initialFormData) {
            if (this.initialFormData.hasOwnProperty(c)) {
                this.uiForm.controls[c].setValue(this.initialFormData[c]);
            }
        }
        this.setFormFlag.rotationalRuleOnChange = false;
        this.setFormFlag.getPercentageValues = false;
        this.setFormFlag.scheduleIDOonChange = false;
        this.setFormFlag.branchServiceAreaCodeonChange = false;
        this.setFormFlag.premiseLocationNumberOnChange = false;
        this.setFormFlag.totalDisplayValues = false;
        this.setFormFlag.exchangesStartAfterDateSelectedValue = false;
        this.setFormFlag.displayValueOnChange = false;
    };
    ServiceCoverDisplayEntryComponent.prototype.updatedRequired = function () {
        for (var f in this.fieldRequired) {
            if (this.fieldRequired.hasOwnProperty(f)) {
                if (this.uiForm.controls[f]) {
                    if (this.fieldRequired[f])
                        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, f, true);
                    else
                        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, f, false);
                    this.uiForm.controls[f].updateValueAndValidity();
                }
            }
        }
    };
    ServiceCoverDisplayEntryComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Service Cover Display Mainteinance';
        this.initData();
    };
    ServiceCoverDisplayEntryComponent.prototype.ngOnDestroy = function () {
        this.lookUpSubscription.unsubscribe();
        this.ajaxSubscription.unsubscribe();
        _super.prototype.ngOnDestroy.call(this);
    };
    ServiceCoverDisplayEntryComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () {
            _this.cbbService.disableComponent(true);
        }, 400);
    };
    ServiceCoverDisplayEntryComponent.prototype.premiseLocationOnKeyDown = function (data) {
        this.uiForm.controls['PremiseLocationNumber'].setValue(data.PremiseLocationNumber);
        this.uiForm.controls['PremiseLocationDesc'].setValue(data.PremiseLocationDesc);
    };
    ServiceCoverDisplayEntryComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAServiceCoverDisplayEntry.html'
                },] },
    ];
    ServiceCoverDisplayEntryComponent.ctorParameters = [
        { type: Injector, },
        { type: ElementRef, },
    ];
    ServiceCoverDisplayEntryComponent.propDecorators = {
        'componentGrid': [{ type: ViewChild, args: ['componentGrid',] },],
        'componentGridPagination': [{ type: ViewChild, args: ['componentGridPagination',] },],
        'scheduleTypeSelectDropdown': [{ type: ViewChild, args: ['scheduleTypeSelectDropdown',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptConfirmModal': [{ type: ViewChild, args: ['promptConfirmModal',] },],
        'promptConfirmModalDelete': [{ type: ViewChild, args: ['promptConfirmModalDelete',] },],
        'employeeSearchEllipsis': [{ type: ViewChild, args: ['employeeSearchEllipsis',] },],
        'effectiveDateChild': [{ type: ViewChild, args: ['effectiveDateChild',] },],
        'premisesLocationEllipsis': [{ type: ViewChild, args: ['premisesLocationEllipsis',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return ServiceCoverDisplayEntryComponent;
}(BaseComponent));
